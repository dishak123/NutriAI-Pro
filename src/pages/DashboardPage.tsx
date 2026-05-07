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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardPage({ activeTab }: { activeTab: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isKeyMissing = !import.meta.env.VITE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY;

  if (isKeyMissing && typeof window !== 'undefined') {
    console.error("NUTRIAL DEBUG: VITE_GEMINI_API_KEY is missing from environment. AI will be disabled.");
  }

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
      {isKeyMissing && (
        <Alert variant="destructive" className="mb-8 border-red-500/20 bg-red-500/5 text-red-500 rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">AI Features Disabled</AlertTitle>
          <AlertDescription className="text-xs mt-1">
            <b>VITE_GEMINI_API_KEY</b> is missing from this build. 
            <br /><br />
            1. Add <b>VITE_GEMINI_API_KEY</b> to Netlify Env Variables. <br />
            2. Go to Deploys &gt; Trigger Deploy &gt; <b>Clear cache and deploy site</b>. <br />
            <i>Note: Static sites require a rebuild to inject new keys.</i>
          </AlertDescription>
        </Alert>
      )}
      {activeTab === 'dashboard' && <DashboardOverview profile={profile} />}
      {activeTab === 'nutrition' && <MealPlanner profile={profile} />}
      {activeTab === 'risk' && <HealthRisk profile={profile} />}
      {activeTab === 'vision' && <FoodRecognition profile={profile} />}
      {activeTab === 'analytics' && <HealthForecast profile={profile} />}
      {activeTab === 'chat' && <HealthChat profile={profile} />}
    </div>
  );
}
