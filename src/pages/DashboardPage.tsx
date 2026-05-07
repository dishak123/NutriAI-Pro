import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { MealPlanner } from '@/components/nutrition/MealPlanner';
import { HealthRisk } from '@/components/ai/HealthRisk';
import { FoodRecognition } from '@/components/ai/FoodRecognition';
import { HealthForecast } from '@/components/analytics/HealthForecast';
import { HealthChat } from '@/components/chat/HealthChat';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardPage({ activeTab }: { activeTab: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!auth.currentUser) return;
      const path = `users/${auth.currentUser.uid}`;
      try {
        const d = await getDoc(doc(db, 'users', auth.currentUser.uid));
        setProfile(d.data());
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-2xl bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[150px] rounded-2xl bg-slate-800" />
          <Skeleton className="h-[150px] rounded-2xl bg-slate-800" />
          <Skeleton className="h-[150px] rounded-2xl bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-20">
      {activeTab === 'dashboard' && <DashboardOverview profile={profile} />}
      {activeTab === 'nutrition' && <MealPlanner profile={profile} />}
      {activeTab === 'risk' && <HealthRisk profile={profile} />}
      {activeTab === 'vision' && <FoodRecognition profile={profile} />}
      {activeTab === 'analytics' && <HealthForecast profile={profile} />}
      {activeTab === 'chat' && <HealthChat profile={profile} />}
    </div>
  );
}
