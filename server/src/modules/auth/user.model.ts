import { Schema, model, Document, Types } from 'mongoose';

export type UserRole = 'platform_admin' | 'store_owner' | 'store_staff' | 'buyer';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  storeId?: Types.ObjectId;
  isEmailVerified: boolean;
  isActive: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['platform_admin', 'store_owner', 'store_staff', 'buyer'],
      required: true,
      default: 'buyer',
    },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', index: true },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true }
);

// userSchema.index({ email: 1 });
userSchema.index({ storeId: 1, role: 1 });

export const User = model<IUser>('User', userSchema);