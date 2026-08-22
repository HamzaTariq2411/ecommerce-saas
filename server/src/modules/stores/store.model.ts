import { Schema, model, Document, Types } from 'mongoose';

export type StorePlan = 'free' | 'pro' | 'enterprise';
export type StoreStatus = 'active' | 'suspended' | 'pending_setup';

export interface IStore extends Document {
  name: string;
  slug: string;
  ownerId: Types.ObjectId;
  plan: StorePlan;
  status: StoreStatus;
  stripeConnectAccountId?: string;
  stripeConnectOnboarded: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  productLimit: number;
  transactionFeePercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'suspended', 'pending_setup'], default: 'pending_setup' },
    stripeConnectAccountId: { type: String },
    stripeConnectOnboarded: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    productLimit: { type: Number, default: 10 },
    transactionFeePercent: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const Store = model<IStore>('Store', storeSchema);