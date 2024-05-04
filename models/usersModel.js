import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { userSubscription } from '../constants/const.js';

const userSchemas = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    subscription: {
      type: String,
      enum: Object.values(userSubscription),
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchemas.pre('save', async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatarURL = `https://gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
  }

  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

export const User = model('User', userSchemas);
