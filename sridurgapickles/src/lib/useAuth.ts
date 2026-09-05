import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface StoreProfile {
  id: string;
  email: string;
  role: 'admin' | 'customer';
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const sessionRequest = supabase.auth.getSession();
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));

    Promise.race([sessionRequest, timeout]).then((result) => {
      if (cancelled) return;
      if (result && 'data' in result) setSession(result.data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const profileRequest = supabase
        .from('store_profiles')
        .select('id, email, role')
        .eq('id', session.user.id)
        .maybeSingle();
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
      const result = await Promise.race([profileRequest, timeout]);
      if (!cancelled && result && 'data' in result) {
        setProfile(result.data as StoreProfile | null);
      } else if (!cancelled) {
        setProfile(null);
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  return { session, profile, loading };
}
