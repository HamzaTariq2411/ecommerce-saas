import bcrypt from 'bcryptjs';
import { User } from '@/modules/auth/user.model';
import { signToken } from '@/utils/jwt';
import { ApiError } from '@/utils/apiError';
import type { RegisterInput, LoginInput } from './auth.validator';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const registerUser = async (input: RegisterInput) => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: 'buyer', 
  });

  const token = signToken({ userId: String(user._id), role: user.role });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  // check if account is currently locked out
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new ApiError(429, `Too many failed attempts. Try again in ${minutesLeft} minute(s).`);
  }

  const isValid = await bcrypt.compare(input.password, user.password);

  if (!isValid) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      user.failedLoginAttempts = 0; // reset counter, lockout takes over
      await user.save();
      throw new ApiError(429, 'Too many failed attempts. Account locked for 15 minutes.');
    }

    await user.save();
    throw new ApiError(401, 'Invalid email or password');
  }

  // successful login — reset any failed attempt tracking
  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  await user.save();

  const token = signToken({
    userId: String(user._id),
    role: user.role,
    storeId: user.storeId ? String(user.storeId) : undefined,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
    },
    token,
  };
};