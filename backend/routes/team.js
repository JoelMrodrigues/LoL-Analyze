import express from 'express';
import Joi from 'joi';
import Team from '../models/Team.js';
import User from '../models/User.js';
import riotService from '../services/riotService.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { requireOwnership } from '../middleware/auth.js';

const router = express.Router();

// Schémas de validation
const createTeamSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(500).optional(),
  logo: Joi.string().uri().optional()
});

const addMemberSchema = Joi.object({
  userId: Joi.string().optional(),
  gameName: Joi.string().min(1).max(16).optional(),
  tagLine: Joi.string().min(1).max(5).optional(),
  role: Joi.string().valid('captain', 'player', 'substitute').default('player'),
  position: Joi.string().valid('TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'FLEX').default('FLEX')
}).or('userId', 'gameName');

const importMatchSchema = Joi.object({
  matchId: Joi.string().required(),
  autoDetectMembers: Joi.boolean().default(true)
});

// GET /api/teams - Obtenir toutes les équipes de l'utilisateur
router.get('/', asyncHandler(async (req, res) => {
  const teams = await Team.find({
    $or: [
      { owner: req.userId },
      { 'members.user': req.userId }
    ]
  })
  .populate('owner', 'username avatar')
  .populate('members.user', 'username avatar')
  .sort({ createdAt: -1 });

  res.json({
    status: 'success',
    data: {
      teams: teams.map(team => ({
        _id: team._id,
        name: team.name,
        description: team.description,
        logo: team.logo,
        owner: team.owner,
        membersCount: team.members.length,
        matchesCount: team.matches.length,
        statistics: team.statistics,
        isOwner: team.owner._id.toString() === req.userId.toString(),
        createdAt: team.createdAt
      }))
    }
  });
}));

// POST /api/teams - Créer une nouvelle équipe
router.post('/', asyncHandler(async (req, res) => {
  // Validation
  const { error, value } = createTeamSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  const { name, description, logo } = value;

  // Vérifier si une équipe avec ce nom existe déjà pour cet utilisateur
  const existingTeam = await Team.findOne({
    owner: req.userId,
    name: { $regex: new RegExp(`^${name}$`, 'i') }
  });

  if (existingTeam) {
    throw createError.conflict('Vous avez déjà une équipe avec ce nom');
  }

  // Créer l'équipe
  const team = new Team({
    name,
    description,
    logo,
    owner: req.userId,
    members: [{
      user: req.userId,
      role: 'owner',
      position: 'FLEX',
      // Utiliser le compte Riot principal de l'utilisateur
      riotAccount: req.user.getMainRiotAccount() ? {
        puuid: req.user.getMainRiotAccount().puuid,
        gameName: req.user.getMainRiotAccount().gameName,
        tagLine: req.user.getMainRiotAccount().tagLine,
        summonerLevel: req.user.getMainRiotAccount().summonerLevel,
        rank: req.user.getMainRiotAccount().rank
      } : null
    }]
  });

  await team.save();

  // Ajouter l'équipe à l'utilisateur
  req.user.teams.push(team._id);
  await req.user.save();

  // Populate les données pour la réponse
  await team.populate('owner', 'username avatar');
  await team.populate('members.user', 'username avatar');

  res.status(201).json({
    status: 'success',
    message: 'Équipe créée avec succès',
    data: {
      team: team.getPublicData()
    }
  });
}));

// GET /api/teams/:id - Obtenir une équipe spécifique
router.get('/:id', asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('owner', 'username avatar')
    .populate('members.user', 'username avatar riotAccounts')
    .populate('matches.importedBy', 'username');

  if (!team) {
    throw createError.notFound('Équipe non trouvée');
  }

  // Vérifier si l'utilisateur est membre de l'équipe
  const isMember = team.members.some(member => 
    member.user._id.toString() === req.userId.toString()
  );

  if (!isMember && !team.settings.isPrivate === false) {
    throw createError.forbidden('Accès interdit à cette équipe');
  }

  res.json({
    status: 'success',
    data: {
      team,
      isOwner: team.owner._id.toString() === req.userId.toString(),
      userMember: team.members.find(member => 
        member.user._id.toString() === req.userId.toString()
      )
    }
  });
}));

// PATCH /api/teams/:id - Modifier une équipe
router.patch('/:id', requireOwnership(Team), asyncHandler(async (req, res) => {
  const { name, description, logo, settings } = req.body;
  const team = req.resource;

  // Validation partielle
  const updateSchema = Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    description: Joi.string().max(500).optional(),
    logo: Joi.string().uri().optional(),
    settings: Joi.object({
      isPrivate: Joi.boolean().optional(),
      allowInvites: Joi.boolean().optional(),
      autoImportMatches: Joi.boolean().optional()
    }).optional()
  });

  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  // Mettre à jour les champs
  Object.assign(team, value);
  await team.save();

  res.json({
    status: 'success',
    message: 'Équipe modifiée avec succès',
    data: {
      team: team.getPublicData()
    }
  });
}));

// DELETE /api/teams/:id - Supprimer une équipe
router.delete('/:id', requireOwnership(Team), asyncHandler(async (req, res) => {
  const team = req.resource;

  // Supprimer l'équipe des utilisateurs membres
  await User.updateMany(
    { teams: team._id },
    { $pull: { teams: team._id } }
  );

  // Supprimer l'équipe
  await Team.findByIdAndDelete(team._id);

  res.json({
    status: 'success',
    message: 'Équipe supprimée avec succès'
  });
}));

// POST /api/teams/:id/members - Ajouter un membre
router.post('/:id/members', requireOwnership(Team), asyncHandler(async (req, res) => {
  const { error, value } = addMemberSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  const team = req.resource;
  const { userId, gameName, tagLine, role, position } = value;
  let targetUser;
  let riotAccount = null;

  if (userId) {
    // Ajout par ID utilisateur existant
    targetUser = await User.findById(userId);
    if (!targetUser) {
      throw createError.notFound('Utilisateur non trouvé');
    }
    riotAccount = targetUser.getMainRiotAccount();
  } else {
    // Ajout par Riot ID
    try {
      const riotProfile = await riotService.getBasicProfile(gameName, tagLine);
      
      // Chercher si un utilisateur a déjà ce compte Riot
      targetUser = await User.findOne({
        'riotAccounts.puuid': riotProfile.puuid
      });

      riotAccount = {
        puuid: riotProfile.puuid,
        gameName: riotProfile.gameName,
        tagLine: riotProfile.tagLine,
        summonerLevel: riotProfile.summonerLevel,
        rank: riotProfile.rank
      };

      if (!targetUser) {
        // Créer un utilisateur temporaire
        targetUser = new User({
          username: `${gameName}_${tagLine}`,
          email: `temp_${Date.now()}@temp.com`,
          password: 'temporary123',
          riotAccounts: [riotAccount]
        });
        await targetUser.save();
      }
    } catch (error) {
      throw createError.badRequest('Joueur Riot non trouvé');
    }
  }

  // Ajouter le membre à l'équipe
  try {
    await team.addMember(targetUser._id, role, position, riotAccount);
    
    // Ajouter l'équipe à l'utilisateur si ce n'est pas déjà fait
    if (!targetUser.teams.includes(team._id)) {
      targetUser.teams.push(team._id);
      await targetUser.save();
    }

    // Recharger l'équipe avec les données peuplées
    await team.populate('members.user', 'username avatar');

    res.status(201).json({
      status: 'success',
      message: 'Membre ajouté avec succès',
      data: {
        member: team.members[team.members.length - 1]
      }
    });
  } catch (error) {
    if (error.message.includes('déjà membre')) {
      throw createError.conflict(error.message);
    }
    throw error;
  }
}));

// DELETE /api/teams/:id/members/:memberId - Supprimer un membre
router.delete('/:id/members/:memberId', requireOwnership(Team), asyncHandler(async (req, res) => {
  const team = req.resource;
  const { memberId } = req.params;

  // Trouver le membre
  const member = team.members.find(m => m._id.toString() === memberId);
  if (!member) {
    throw createError.notFound('Membre non trouvé');
  }

  try {
    await team.removeMember(member.user);
    
    // Supprimer l'équipe de l'utilisateur
    await User.findByIdAndUpdate(
      member.user,
      { $pull: { teams: team._id } }
    );

    res.json({
      status: 'success',
      message: 'Membre supprimé avec succès'
    });
  } catch (error) {
    if (error.message.includes('propriétaire')) {
      throw createError.badRequest(error.message);
    }
    throw error;
  }
}));

// PATCH /api/teams/:id/members/:memberId - Modifier un membre
router.patch('/:id/members/:memberId', requireOwnership(Team), asyncHandler(async (req, res) => {
  const team = req.resource;
  const { memberId } = req.params;
  const { role, position } = req.body;

  // Validation
  const updateMemberSchema = Joi.object({
    role: Joi.string().valid('captain', 'player', 'substitute').optional(),
    position: Joi.string().valid('TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'FLEX').optional()
  });

  const { error, value } = updateMemberSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  // Trouver et modifier le membre
  const member = team.members.find(m => m._id.toString() === memberId);
  if (!member) {
    throw createError.notFound('Membre non trouvé');
  }

  Object.assign(member, value);
  await team.save();

  res.json({
    status: 'success',
    message: 'Membre modifié avec succès',
    data: { member }
  });
}));

// POST /api/teams/:id/matches/import - Importer un match
router.post('/:id/matches/import', requireOwnership(Team), asyncHandler(async (req, res) => {
  const { error, value } = importMatchSchema.validate(req.body);
  if (error) {
    throw createError.badRequest(error.details[0].message);
  }

  const team = req.resource;
  const { matchId, autoDetectMembers } = value;

  try {
    // Récupérer les détails du match
    const matchDetails = await riotService.getMatchDetails(matchId);

    // Vérifier si le match n'est pas déjà importé
    const existingMatch = team.matches.find(m => m.matchId === matchId);
    if (existingMatch) {
      throw createError.conflict('Ce match est déjà importé');
    }

    // Si autoDetectMembers, essayer de lier les participants aux membres
    if (autoDetectMembers) {
      matchDetails.participants.forEach(participant => {
        const member = team.members.find(m => 
          m.riotAccount && m.riotAccount.puuid === participant.puuid
        );
        if (member) {
          participant.teamMember = member.user;
        }
      });
    }

    // Créer l'objet match pour l'équipe
    const teamMatch = {
      matchId: matchDetails.matchId,
      gameId: matchDetails.gameId,
      gameType: matchDetails.gameType,
      gameMode: matchDetails.gameMode,
      gameDuration: matchDetails.gameDuration,
      gameCreation: new Date(matchDetails.gameCreation),
      participants: matchDetails.participants,
      result: 'LOSS', // À déterminer selon la logique de l'équipe
      importedBy: req.userId
    };

    // Déterminer le résultat pour l'équipe
    const teamMembers = matchDetails.participants.filter(p => p.teamMember);
    if (teamMembers.length > 0) {
      const teamWon = teamMembers.every(member => member.win);
      teamMatch.result = teamWon ? 'WIN' : 'LOSS';
    }

    // Ajouter le match à l'équipe
    team.matches.push(teamMatch);
    await team.save();

    // Mettre à jour les statistiques
    await team.updateStatistics();

    res.status(201).json({
      status: 'success',
      message: 'Match importé avec succès',
      data: {
        match: teamMatch,
        detectedMembers: teamMembers.length
      }
    });
  } catch (error) {
    throw error;
  }
}));

// GET /api/teams/:id/matches - Obtenir les matchs d'une équipe
router.get('/:id/matches', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const team = await Team.findById(req.params.id)
    .populate('matches.importedBy', 'username')
    .populate('matches.participants.teamMember', 'username');

  if (!team) {
    throw createError.notFound('Équipe non trouvée');
  }

  // Vérifier l'accès
  const isMember = team.members.some(member => 
    member.user.toString() === req.userId.toString()
  );

  if (!isMember) {
    throw createError.forbidden('Accès interdit');
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const matches = team.matches
    .sort((a, b) => new Date(b.gameCreation) - new Date(a.gameCreation))
    .slice(startIndex, endIndex);

  res.json({
    status: 'success',
    data: {
      matches,
      pagination: {
        currentPage: parseInt(page),
        totalMatches: team.matches.length,
        totalPages: Math.ceil(team.matches.length / limit),
        hasNext: endIndex < team.matches.length,
        hasPrev: startIndex > 0
      }
    }
  });
}));

export default router;