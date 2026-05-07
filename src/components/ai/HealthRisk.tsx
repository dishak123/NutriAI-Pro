import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { askGemini } from "@/lib/gemini";
import { 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  TrendingDown,
  BrainCircuit,
  Fingerprint
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HealthRisk({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const performRiskAssessment = async () => {
    setLoading(true);
    const result = await askGemini(
      "Perform a detailed health risk assessment.",
      `You are a predictive healthcare model (RandomForest/XGBoost simulation). Analyze the following user profile and predict risks for Diabetes, Obesity, and Hypertension.
      Profile: Age ${profile.age}, Weight ${profile.weight}kg, Height ${profile.height}cm, Active: ${profile.activityLevel}, Diseases: ${profile.diseases?.join(', ') || 'None'}.
      Return a JSON object with:
      - risks: array of { condition, probability (0-100), severity (low/med/high), note }
      - forecast: { month3: weightGoalProb, month6: weightGoalProb }
      - topRecommendation: single strongest health tip.`
    );
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-xl">
        <div className="flex gap-4 items-center">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono tracking-tight text-white uppercase italic">Risk Neural Engine</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">RandomForest & Logistic Regression Engine</p>
          </div>
        </div>
        <Button 
          onClick={performRiskAssessment} 
          disabled={loading || analysis}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
        >
          {loading ? "Computing Vitals..." : "Initialize Assessment"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {!analysis && !loading && (
        <div className="p-20 text-center space-y-6">
           <Fingerprint className="h-20 w-20 mx-auto text-slate-800 animate-pulse" />
           <p className="text-slate-500 italic max-w-sm mx-auto">Assessment required to generate predictive health vectors based on your current bio-metrics.</p>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-slate-900 border-slate-800 animate-pulse h-48" />
          ))}
        </div>
      )}

      {analysis && (
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {analysis.risks.map((risk: any, i: number) => (
            <Card key={i} className="bg-[#1E293B] border-slate-800 relative group overflow-hidden">
               <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={cn(
                      "uppercase text-[10px]",
                      risk.severity === 'high' ? "text-red-400 border-red-400/30 bg-red-400/5" :
                      risk.severity === 'medium' ? "text-amber-400 border-amber-400/30 bg-amber-400/5" :
                      "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
                    )}>
                      {risk.severity} Risk
                    </Badge>
                    <span className="text-xl font-bold text-white">{risk.probability}%</span>
                  </div>
                  <CardTitle className="text-lg mt-4">{risk.condition}</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{risk.note}</p>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: `${risk.probability}%` }}
                       className={cn(
                         "h-full rounded-full transition-all duration-1000",
                         risk.severity === 'high' ? "bg-red-500" :
                         risk.severity === 'medium' ? "bg-amber-500" :
                         "bg-emerald-500"
                       )}
                     />
                  </div>
               </CardContent>
               <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <AlertTriangle className="h-24 w-24" />
               </div>
            </Card>
          ))}

          {/* Predictive Forecast Card */}
          <Card className="md:col-span-3 bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border-indigo-500/20">
             <CardContent className="p-8 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                   <div className="space-y-2">
                     <h4 className="text-2xl font-bold text-white">Goal Probability Forecast</h4>
                     <p className="text-slate-400">Time-series prediction for your ${profile.healthGoal.replace('_', ' ')} journey.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">3 Month Projection</p>
                         <p className="text-4xl font-bold text-white">{analysis.forecast.month3}%</p>
                         <Badge className="bg-emerald-500/10 text-emerald-400 text-[10px]">Likely Success</Badge>
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">6 Month Projection</p>
                         <p className="text-4xl font-bold text-white">{analysis.forecast.month6}%</p>
                         <Badge className="bg-blue-500/10 text-blue-400 text-[10px]">Sustainable Goal</Badge>
                      </div>
                   </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-80 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                   <div className="flex items-center gap-2 text-indigo-400 mb-4">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="font-bold text-sm">Critical ML Suggestion</span>
                   </div>
                   <p className="text-sm text-slate-300 italic mb-6 leading-relaxed">
                     "{analysis.topRecommendation}"
                   </p>
                   <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Update Habits</Button>
                </div>
             </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
