import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { ApiError } from '@/utils/apiError';
import { User, UserRole } from '@/modules/auth/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        storeId?: string;
        name: string;
        email: string;
      };
    }
  }
}

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Not authorized, user no longer exists or is inactive');
    }

    req.user = {
      id: String(user._id),
      role: user.role,
      storeId: user.storeId ? String(user.storeId) : undefined,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    next(new ApiError(401, 'Not authorized, invalid or expired token'));
  }
};

// Role-based access control — pass allowed roles, e.g. requireRole('platform_admin', 'store_owner')
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
};

// Store-scoping — ensures a store_owner/store_staff can only act on THEIR OWN store
export const requireOwnStore = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, 'Not authorized'));
  }

  // platform_admin bypasses store-scoping entirely (can manage any store)
  if (req.user.role === 'platform_admin') {
    return next();
  }

  const requestedStoreId = req.params.storeId;

  if (!req.user.storeId || req.user.storeId !== requestedStoreId) {
    return next(new ApiError(403, 'You do not have access to this store'));
  }

  next();
};