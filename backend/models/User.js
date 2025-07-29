import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est requis'],
    unique: true,
    trim: true,
    minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
    maxlength: [20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  avatar: {
    type: String,
    default: null
  },
  riotAccounts: [{
    gameName: {
      type: String,
      required: true
    },
    tagLine: {
      type: String,
      required: true
    },
    puuid: {
      type: String,
      required: true
    },
    summonerLevel: {
      type: Number,
      default: 1
    },
    profileIcon: {
      type: Number,
      default: 0
    },
    rank: {
      tier: {
        type: String,
        enum: ['UNRANKED', 'IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'],
        default: 'UNRANKED'
      },
      division: {
        type: String,
        enum: ['IV', 'III', 'II', 'I'],
        default: 'IV'
      },
      leaguePoints: {
        type: Number,
        default: 0
      }
    },
    isMain: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    publicProfile: {
      type: Boolean,
      default: false
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour les performances
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'riotAccounts.puuid': 1 });

// Middleware de hachage du mot de passe
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir les données publiques
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    avatar: this.avatar,
    riotAccounts: this.riotAccounts.map(account => ({
      gameName: account.gameName,
      tagLine: account.tagLine,
      summonerLevel: account.summonerLevel,
      rank: account.rank,
      isMain: account.isMain
    })),
    createdAt: this.createdAt
  };
};

// Méthode pour ajouter un compte Riot
userSchema.methods.addRiotAccount = function(accountData) {
  // Vérifier si le compte existe déjà
  const existingAccount = this.riotAccounts.find(
    account => account.puuid === accountData.puuid
  );
  
  if (existingAccount) {
    // Mettre à jour le compte existant
    Object.assign(existingAccount, accountData);
    existingAccount.lastUpdated = new Date();
  } else {
    // Si c'est le premier compte, le marquer comme principal
    if (this.riotAccounts.length === 0) {
      accountData.isMain = true;
    }
    this.riotAccounts.push(accountData);
  }
  
  return this.save();
};

// Méthode pour obtenir le compte principal
userSchema.methods.getMainRiotAccount = function() {
  return this.riotAccounts.find(account => account.isMain) || this.riotAccounts[0];
};

export default mongoose.model('User', userSchema);