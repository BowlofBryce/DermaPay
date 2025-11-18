import { supabase } from './supabase';

export const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@dermapay.com',
  name: 'Demo Artist',
  shopName: 'Demo Tattoo Studio',
  isDemo: true,
};

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(identifier: string, password: string) {
  if ((identifier === 'Demo' || identifier === 'demo') && password === 'password') {
    localStorage.setItem('demoUser', JSON.stringify(DEMO_USER));
    return {
      data: {
        user: DEMO_USER,
        session: { user: DEMO_USER }
      },
      error: null
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password,
  });
  return { data, error };
}

export async function signOut() {
  localStorage.removeItem('demoUser');
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const demoUser = localStorage.getItem('demoUser');
  if (demoUser) {
    const user = JSON.parse(demoUser);
    return { session: { user }, error: null };
  }

  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

export async function getCurrentUser() {
  const demoUser = localStorage.getItem('demoUser');
  if (demoUser) {
    return { user: JSON.parse(demoUser), error: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}
