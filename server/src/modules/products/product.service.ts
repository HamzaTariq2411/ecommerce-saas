import { Product } from './product.model';
import { Store } from '@/modules/stores/store.model';
import { ApiError } from '@/utils/apiError';
import type { CreateProductInput, UpdateProductInput, ListProductsQuery } from './product.validator';

export const createProduct = async (storeId: string, input: CreateProductInput) => {
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found');

  if (store.status !== 'active') {
    throw new ApiError(403, 'Your store must complete setup before adding products');
  }

  const currentProductCount = await Product.countDocuments({ storeId });
  if (currentProductCount >= store.productLimit) {
    throw new ApiError(
      403,
      `Product limit reached (${store.productLimit}). Upgrade your plan to add more products.`
    );
  }

  const product = await Product.create({ ...input, storeId });
  return product;
};

export const listStoreProducts = async (storeId: string, query: ListProductsQuery) => {
  const page = parseInt(query.page, 10);
  const limit = Math.min(parseInt(query.limit, 10), 100); // hard cap, prevents abuse via ?limit=999999
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { storeId };
  if (query.category) filter.category = query.category;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getProductById = async (storeId: string, productId: string) => {
  const product = await Product.findOne({ _id: productId, storeId });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

export const updateProduct = async (storeId: string, productId: string, input: UpdateProductInput) => {
  const product = await Product.findOneAndUpdate({ _id: productId, storeId }, input, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

export const deleteProduct = async (storeId: string, productId: string) => {
  const product = await Product.findOneAndDelete({ _id: productId, storeId });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};