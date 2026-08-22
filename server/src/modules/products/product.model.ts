import { Schema, model, Document, Types } from 'mongoose';

export interface IProductVariant {
  _id?: Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  imageUrl?: string;
}

export interface IProduct extends Document {
  storeId: Types.ObjectId;
  title: string;
  description: string;
  aiGeneratedDescription: boolean;
  category: string;
  images: string[];
  basePrice: number;
  variants: IProductVariant[];
  isActive: boolean;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    inventory: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String },
  },
  { _id: true }
);

const productSchema = new Schema<IProduct>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    aiGeneratedDescription: { type: Boolean, default: false },
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    basePrice: { type: Number, required: true, min: 0 },
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
    embedding: { type: [Number], select: false },
  },
  { timestamps: true }
);

productSchema.index({ storeId: 1, isActive: 1 });
productSchema.index({ storeId: 1, category: 1 });
productSchema.index({ title: 'text', description: 'text' });

export const Product = model<IProduct>('Product', productSchema);