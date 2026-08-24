import { Store } from './store.model';
import { User } from '@/modules/auth/user.model';
import { ApiError } from '@/utils/apiError';
import type { CreateStoreInput, UpdateStoreInput } from './store.validator';

export const createStore = async (userId: string, input: CreateStoreInput) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.storeId) {
    throw new ApiError(409, 'This account already owns a store');
  }

  const existingSlug = await Store.findOne({ slug: input.slug });
  if (existingSlug) {
    throw new ApiError(409, 'This store URL is already taken. Please choose another.');
  }

  const store = await Store.create({
    name: input.name,
    slug: input.slug,
    ownerId: user._id,
    plan: 'free',
    status: 'pending_setup', 
    productLimit: 10,
    transactionFeePercent: 5,
  });

  // promote the user to store_owner and link them to the new store
  user.role = 'store_owner';
  user.storeId = store._id as any;
  await user.save();

  return store;
};

export const getStoreBySlug = async (slug: string) => {
  const store = await Store.findOne({ slug, status: { $ne: 'suspended' } });
  if (!store) throw new ApiError(404, 'Store not found');
  return store;
};

export const getStoreById = async (storeId: string) => {
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found');
  return store;
};

export const updateStore = async (storeId: string, input: UpdateStoreInput) => {
  const store = await Store.findByIdAndUpdate(storeId, input, { new: true, runValidators: true });
  if (!store) throw new ApiError(404, 'Store not found');
  return store;
};

export const listAllStores = async () => {
  // platform_admin only — sees every store across all tenants
  return Store.find().sort({ createdAt: -1 });
};