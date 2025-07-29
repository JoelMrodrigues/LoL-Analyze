import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'équipe est requis'],
    trim: true,
    minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  description: {
    type: String,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    default: ''
  },
  logo: {
    type: String,
    default: null
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'captain', 'player', 'substitute'],
      default: 'player'
    },
    position: {
      type: String,
      enum: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'FLEX'],
      default: 'FLEX'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Compte Riot lié pour cette équipe
    riotAccount: {
      puuid: String,
      gameName: String,
      tagLine: String,
      summonerLevel: Number,
      rank: {
        tier: String,
        division: String,
        leaguePoints: Number
      }
    }
  }],
  matches: [{
    matchId: {
      type: String,
      required: true
    },
    gameId: {
      type: Number,
      required: true
    },
    gameType: {
      type: String,
      enum: ['NORMAL', 'RANKED_SOLO_5x5', 'RANKED_FLEX_SR', 'ARAM', 'CUSTOM'],
      required: true
    },
    gameMode: {
      type: String,
      required: true
    },
    gameDuration: {
      type: Number,
      required: true
    },
    gameCreation: {
      type: Date,
      required: true
    },
    participants: [{
      puuid: String,
      gameName: String,
      tagLine: String,
      championName: String,
      championId: Number,
      position: String,
      kills: Number,
      deaths: Number,
      assists: Number,
      totalMinionsKilled: Number,
      goldEarned: Number,
      items: [Number],
      summoners: [Number],
      win: Boolean,
      teamId: Number,
      // Lien vers le membre de l'équipe si applicable
      teamMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      }
    }],
    teamStats: {
      kills: Number,
      deaths: Number,
      assists: Number,
      towers: Number,
      dragons: Number,
      barons: Number,
      goldEarned: Number
    },
    result: {
      type: String,
      enum: ['WIN', 'LOSS'],
      required: true
    },
    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    importedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    totalGames: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    },
    averageGameDuration: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  championPool: [{
    championId: {
      type: Number,
      required: true
    },
    championName: {
      type: String,
      required: true
    },
    players: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      proficiency: {
        type: String,
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'MAIN'],
        default: 'INTERMEDIATE'
      },
      gamesPlayed: {
        type: Number,
        default: 0
      },
      winRate: {
        type: Number,
        default: 0
      }
    }]
  }],
  drafts: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    bans: {
      blue: [Number],
      red: [Number]
    },
    picks: {
      blue: [{
        championId: Number,
        position: String,
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }],
      red: [{
        championId: Number,
        position: String,
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    isPrivate: {
      type: Boolean,
      default: false
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    autoImportMatches: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour les performances
teamSchema.index({ owner: 1 });
teamSchema.index({ 'members.user': 1 });
teamSchema.index({ name: 1 });
teamSchema.index({ 'matches.matchId': 1 });

// Méthode pour ajouter un membre
teamSchema.methods.addMember = function(userId, role = 'player', position = 'FLEX', riotAccount = null) {
  // Vérifier si le membre existe déjà
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('Ce joueur est déjà membre de l\'équipe');
  }
  
  const newMember = {
    user: userId,
    role,
    position,
    riotAccount
  };
  
  this.members.push(newMember);
  return this.save();
};

// Méthode pour supprimer un membre
teamSchema.methods.removeMember = function(userId) {
  if (this.owner.toString() === userId.toString()) {
    throw new Error('Le propriétaire ne peut pas être supprimé');
  }
  
  this.members = this.members.filter(member => 
    member.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Méthode pour mettre à jour les statistiques
teamSchema.methods.updateStatistics = function() {
  const totalGames = this.matches.length;
  const wins = this.matches.filter(match => match.result === 'WIN').length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  
  const averageGameDuration = totalGames > 0 
    ? this.matches.reduce((sum, match) => sum + match.gameDuration, 0) / totalGames 
    : 0;
  
  this.statistics = {
    totalGames,
    wins,
    losses,
    winRate: Math.round(winRate * 100) / 100,
    averageGameDuration: Math.round(averageGameDuration),
    lastUpdated: new Date()
  };
  
  return this.save();
};

// Méthode pour obtenir les données publiques
teamSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    logo: this.logo,
    members: this.members.map(member => ({
      _id: member._id,
      role: member.role,
      position: member.position,
      joinedAt: member.joinedAt,
      riotAccount: member.riotAccount
    })),
    statistics: this.statistics,
    createdAt: this.createdAt
  };
};

// Middleware pour mettre à jour les stats après ajout de match
teamSchema.post('save', function(doc) {
  if (this.isModified('matches')) {
    this.updateStatistics();
  }
});

export default mongoose.model('Team', teamSchema);