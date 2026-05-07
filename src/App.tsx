/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Shell } from './components/layout/Shell';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { doc, getDoc } from 'firebase/firestore';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const path = `users/${user.uid}`;
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          setHasProfile(docSnap.exists());
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      } else {
        setHasProfile(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A] text-white">
        <div className="animate-pulse text-xl font-medium tracking-tight">Initializing NutriAI...</div>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <LandingPage />
      ) : !hasProfile ? (
        <ProfileSetupPage onComplete={() => setHasProfile(true)} />
      ) : (
        <Shell activeTab={activeTab} setActiveTab={setActiveTab}>
          <DashboardPage activeTab={activeTab} />
        </Shell>
      )}
      <Toaster position="bottom-right" richColors />
    </>
  );
}

