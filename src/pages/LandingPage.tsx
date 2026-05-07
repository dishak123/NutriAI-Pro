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
      // Use signInWithPopup directly. 
      // If it fails with "popup-closed-by-user" or similar, we might need more context.
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast.success('Successfully authenticated!');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Login popup was closed before completion.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignore, common during dev/fast clicks
      } else if (err.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized in Firebase Console. Please add your Netlify/GitHub domain to Authorized domains in Authentication settings.');
      } else {
        toast.error(`Authentication error: ${err.message || 'Please try again'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col selection:bg-blue-500/30 scroll-smooth">
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
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-400 transition-colors">How it Works</button>
          <button onClick={() => scrollToSection('features')} className="hover:text-blue-400 transition-colors">AI Features</button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-400 transition-colors">Pricing</button>
        </div>
        <Button 
          variant="outline" 
          className="bg-white/5 border-slate-800 hover:bg-white/10 text-white rounded-xl px-6 h-11 font-bold transition-all active:scale-95"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "SIGNING IN..." : "GET STARTED"}
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
            AI-POWERED NUTRITION PLATFORM
          </div>
          <h1 className="text-6xl md:text-[7rem] font-bold tracking-tighter mb-10 leading-[0.95] text-white text-balance">
            Precision Health <br />
            <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent italic font-serif">
              Intelligent Coaching
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
             The smarter way to manage your health with real-time food recognition, 
             predictive health analytics, and personalized nutrition plans.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white h-16 px-12 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-600/40 group transition-all active:scale-95"
              onClick={handleLogin}
            >
              START YOUR JOURNEY
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-48 w-full max-w-6xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white text-balance">Advanced Methodology</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-20 text-lg md:text-xl font-medium">
              Our multi-agent system processes biological signals and visual data to synthesize clinical-grade recommendations.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Data Ingestion", desc: "Sync your biometrics, activity, and health history securely through our encrypted gateway." },
              { step: "02", title: "Neural Analysis", desc: "Our proprietary ML models compute your unique nutritional requirements based on metabolic velocity." },
              { step: "03", title: "Vision Scan", desc: "Snap photos of meals for instant caloric and macro-distribution estimation via tensor-inference." },
              { step: "04", title: "AI Coaching", desc: "Receive 24/7 personalized guidance from our Gemini-powered inference engine." }
            ].map((s, i) => (
              <div key={i} className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800/50 text-left hover:bg-slate-800/50 transition-colors group">
                <span className="text-blue-500 font-mono text-2xl font-bold mb-6 block group-hover:scale-110 transition-transform origin-left">{s.step}</span>
                <h4 className="text-xl font-bold text-white mb-4">{s.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-48 w-full max-w-6xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Intelligence Layer</h2>
            <p className="text-slate-400 text-lg font-medium">The intersection of machine learning and biological precision.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Brain, 
                title: "ML Optimization", 
                desc: "Deep neural networks for high-precision meal planning and micronutrient synthesis based on your specific health markers.",
                accent: "from-blue-500/20 to-transparent"
              },
              { 
                icon: Zap, 
                title: "Vision Analysis", 
                desc: "Real-time edge-computing for instant food recognition and nutritional decomposition using advanced computer vision.",
                accent: "from-emerald-500/20 to-transparent"
              },
              { 
                icon: Shield, 
                title: "Risk Prediction", 
                desc: "Predictive diagnostics for chronic conditions using multivariate analysis of biometric trends and health patterns.",
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
      </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-48 w-full max-w-4xl px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight text-white">Subscription Protocol</h2>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/3 -translate-y-1/3">
                    <Sparkles className="h-48 w-48 text-white" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-[10px] font-bold mb-8 uppercase tracking-widest">Limited Access</span>
                    <h3 className="text-3xl font-bold text-white mb-4">Open Beta Access</h3>
                    <p className="text-blue-100 mb-10 max-w-md mx-auto font-medium">Get full access to the AI inference engine and health analytics for free during our experimental phase.</p>
                    <div className="text-5xl font-bold text-white mb-10">$0<span className="text-blue-200 text-lg">/month</span></div>
                    <Button 
                        size="lg" 
                        className="bg-white text-blue-600 hover:bg-slate-100 h-14 px-10 rounded-xl text-md font-bold transition-all active:scale-95"
                        onClick={handleLogin}
                    >
                        INITIALIZE FREE SESSION
                    </Button>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-16 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center">
            <HeartPulse className="text-slate-500 h-5 w-5" />
          </div>
          <span className="font-bold text-slate-500 text-sm">NutriAI PRO</span>
        </div>
        <p className="text-slate-600 text-[11px] font-bold uppercase tracking-[0.2em]">
          Powered by Gemini 1.5 Pro & Firestore
        </p>
      </footer>
    </div>
  );
}
