import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion } from 'motion/react';
import { HeartPulse, Brain, Zap, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <HeartPulse className="text-white h-6 w-6" />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-white">NutriAI <span className="text-blue-500">Pro</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 mr-8 text-sm font-semibold text-slate-400">
          <a href="#" className="hover:text-blue-400 transition-colors">Research Methodology</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Neural Engine</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
        </div>
        <Button 
          variant="outline" 
          className="bg-white/5 border-slate-800 hover:bg-white/10 text-white rounded-xl px-6 h-11 font-bold transition-all active:scale-95"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "INITIALIZING..." : "ACCESS SYSTEM"}
        </Button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-32">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="text-center max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold mb-10 uppercase tracking-[0.2em] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            MCA RESEARCH PROJECT: v4.2 STABLE
          </div>
          <h1 className="text-6xl md:text-[7rem] font-bold tracking-tighter mb-10 leading-[0.95] text-white">
            Precision Nutrition <br />
            <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent italic font-serif">
              Inference Engine
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
             A clinical-grade healthcare recommendation system utilizing advanced ML regressors, 
             predictive biometrics, and real-time vision intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white h-16 px-12 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-600/40 group transition-all active:scale-95"
              onClick={handleLogin}
            >
              INITIALIZE SESSION
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-xl border-2 border-[#0F172A] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-xl overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Researcher" className="w-full h-full object-cover opacity-70" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm text-white font-bold">1,240 Nodes Active</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Research Mesh</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Bento Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          {[
            { 
              icon: Brain, 
              title: "ML Optimization", 
              desc: "Deep neural networks for high-precision meal planning and micronutrient synthesis.",
              accent: "from-blue-500/20 to-transparent"
            },
            { 
              icon: Zap, 
              title: "Vision Analysis", 
              desc: "Real-time tensor-inference for instant caloric and macro-distribution estimation.",
              accent: "from-emerald-500/20 to-transparent"
            },
            { 
              icon: Shield, 
              title: "Risk Prediction", 
              desc: "Predictive diagnostics for chronic conditions using multivariate health history.",
              accent: "from-indigo-500/20 to-transparent"
            }
          ].map((f, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="relative p-10 rounded-[2.5rem] bg-[#1E293B]/40 border border-slate-800/50 hover:border-slate-700 transition-all group overflow-hidden"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", f.accent)} />
              <div className="relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                  {f.icon === Zap ? <Zap className="h-7 w-7 text-emerald-400" /> : <f.icon className="h-7 w-7 text-blue-400" />}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-16 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center">
            <HeartPulse className="text-slate-500 h-5 w-5" />
          </div>
          <span className="font-bold text-slate-500 text-sm">NutriAI PRO v4.2</span>
        </div>
        <p className="text-slate-600 text-[11px] font-bold uppercase tracking-[0.2em]">
          Experimental Research Core • Built with Gemini 1.5 Pro & Firestore RL
        </p>
        <div className="flex gap-6 text-slate-600 text-xs font-bold uppercase tracking-widest">
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Protocol</a>
        </div>
      </footer>
    </div>
  );
}
