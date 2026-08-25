import { stripe } from '@/config/stripe';
import { Store } from '@/modules/stores/store.model';
import { User } from '@/modules/auth/user.model';
import { ApiError } from '@/utils/apiError';
import { env } from '@/config/env';

export const createConnectAccountLink = async (storeId: string, userId: string) => {
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found');

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  // Create the Connect account only once — reuse it on subsequent onboarding attempts
  if (!store.stripeConnectAccountId) {
    const account = await stripe.accounts.create({
      type: 'express', // Express accounts = Stripe hosts onboarding UI, less code for us, still real payouts
      country: 'US', // adjust based on your target market
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    store.stripeConnectAccountId = account.id;
    await store.save();
  }

  const accountLink = await stripe.accountLinks.create({
    account: store.stripeConnectAccountId,
    refresh_url: `${env.CLIENT_URL}/dashboard/settings/payments?refresh=true`,
    return_url: `${env.CLIENT_URL}/dashboard/settings/payments?success=true`,
    type: 'account_onboarding',
  });

  return { url: accountLink.url };
};

export const checkConnectStatus = async (storeId: string) => {
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found');

  if (!store.stripeConnectAccountId) {
    return { onboarded: false, chargesEnabled: false, payoutsEnabled: false };
  }

  const account = await stripe.accounts.retrieve(store.stripeConnectAccountId);

  const isFullyOnboarded = account.charges_enabled && account.payouts_enabled;

  // sync our local record with Stripe's actual state
  if (isFullyOnboarded && !store.stripeConnectOnboarded) {
    store.stripeConnectOnboarded = true;
    store.status = 'active'; // store can now actually sell
    await store.save();
  }

  return {
    onboarded: store.stripeConnectOnboarded,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
  };
};