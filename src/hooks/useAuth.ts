import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    navigate('/admin/login');
  };

  return { session, loading, signOut };
}
