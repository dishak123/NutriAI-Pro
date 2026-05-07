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
        <Alert variant="destructive" className="mb-8 border-red-500/20 bg-red-500/5 text-red-500 rounded-2xl p-6">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 mt-1 flex-shrink-0" />
            <div className="space-y-4">
              <div>
                <AlertTitle className="text-lg font-bold">AI Features Disabled</AlertTitle>
                <AlertDescription className="text-sm opacity-90">
                  The application cannot find your <b>VITE_GEMINI_API_KEY</b>. 
                </AlertDescription>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-red-500/10 space-y-2 border border-red-500/10">
                  <h4 className="font-bold uppercase tracking-wider text-[10px]">1. Fix the "0 Values" Issue</h4>
                  <p>Your screenshot shows "0 values in all deploy contexts". This means the key is defined but <b>has no value</b>.</p>
                  <ul className="list-disc list-inside space-y-1 opacity-80">
                    <li>Click the variable in Netlify</li>
                    <li>Paste your key into the <b>Value</b> field</li>
                    <li>Ensure "All scopes" is checked</li>
                    <li>Click <b>Save</b></li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-red-500/10 space-y-2 border border-red-500/10">
                  <h4 className="font-bold uppercase tracking-wider text-[10px]">2. Trigger New Build</h4>
                  <p>Static sites <b>require a rebuild</b> to inject secrets into the code.</p>
                  <ul className="list-disc list-inside space-y-1 opacity-80">
                    <li>Go to the <b>Deploys</b> tab</li>
                    <li>Click <b>Trigger deploy</b></li>
                    <li>Select <b>Clear cache and deploy site</b></li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-red-500/10 flex items-center justify-between">
                <p className="text-[10px] opacity-60">Status: Build Variable Missing</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7 px-2 hover:bg-red-500/10"
                  onClick={() => window.location.reload()}
                >
                  Check again after rebuild
                </Button>
              </div>
            </div>
          </div>
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
