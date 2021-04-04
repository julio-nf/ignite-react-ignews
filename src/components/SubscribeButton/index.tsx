import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { AppSession } from '../../pages/posts/[slug]';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps): JSX.Element {
  const [session] = useSession();
  const appSession = session as AppSession;
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if (appSession?.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  );
}
