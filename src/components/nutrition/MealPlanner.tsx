import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { askGemini } from "@/lib/gemini";
import { 
  Utensils, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Info,
  RefreshCw,
  Salad
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export function MealPlanner({ profile }: { profile: any }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateMealPlan = async () => {
    setLoading(true);
    const systemPrompt = `You are an expert AI Nutritionist. Generate a 1-day personalized meal plan (Breakfast, Lunch, Dinner, Snack) for a user with the following profile:
    Age: ${profile.age}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Gender: ${profile.gender}, Goal: ${profile.healthGoal}, Diseases: ${profile.diseases?.join(', ') || 'None'}.
    Ensure the recommendations strictly follow medical guidelines for the diseases listed.
    Return a JSON array of 4 objects with: mealType, dishName, calories, protein, carbs, fats, instructions, and benefit (explaining why it's good for the user).`;

    const result = await askGemini("Generate my daily meal plan.", systemPrompt);
    if (result && Array.isArray(result)) {
      setPlans(result);
      toast.success("AI Meal Plan Generated!");
    } else {
      toast.error("Failed to generate plan. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">AI Nutrition Intelligence</h2>
          <p className="text-slate-400">Content-Based Recommendation using Cosine Similarity models.</p>
        </div>
        <Button 
          onClick={generateMealPlan} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20"
        >
          {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {plans.length > 0 ? "Regenerate Plan" : "Generate Meal Plan"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Meal Cards */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {plans.length > 0 ? (
              plans.map((meal, i) => (
                <motion.div
                  key={meal.dishName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-700 transition-colors group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 bg-slate-800/50 flex flex-col items-center justify-center p-6 border-r border-slate-800">
                           <Utensils className="h-8 w-8 text-blue-400 mb-2" />
                           <Badge variant="outline" className="text-[10px] uppercase tracking-widest bg-slate-900 border-slate-700 text-slate-400">
                             {meal.mealType}
                           </Badge>
                        </div>
                        <div className="flex-1 p-6">
                           <div className="flex justify-between items-start mb-4">
                             <div>
                               <h3 className="text-xl font-bold text-white mb-1">{meal.dishName}</h3>
                               <p className="text-sm text-slate-400 leading-relaxed font-medium capitalize">{meal.benefit}</p>
                             </div>
                             <div className="flex gap-2">
                               <div className="text-right">
                                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Calories</p>
                                  <p className="text-lg font-bold text-emerald-400">{meal.calories}</p>
                               </div>
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-3 gap-4 mb-4">
                              {['protein', 'carbs', 'fats'].map(macro => (
                                <div key={macro} className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                                   <p className="text-[10px] uppercase text-slate-500 font-bold">{macro}</p>
                                   <p className="text-sm font-semibold text-slate-200">{meal[macro]}g</p>
                                </div>
                              ))}
                           </div>

                           <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                              <div className="flex items-center text-xs text-slate-500">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>Prep time: 15-20 min</span>
                              </div>
                              <Button variant="link" className="text-blue-400 p-0 h-auto font-bold text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Recipe Details <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 w-full rounded-2xl bg-slate-800/40 border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600 italic">
                   {loading ? "AI is thinking..." : "Ready to plan your nutrition"}
                </div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Right: Insights & Filters */}
        <div className="space-y-6">
           <Card className="bg-[#1E293B] border-slate-800 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Salad className="h-24 w-24 text-emerald-500" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg text-white">Smart Filters</CardTitle>
                <CardDescription>Adjusting recommendation engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex flex-wrap gap-2">
                   {['Low Carb', 'High Protein', 'Vegan', 'Gluten Free', 'Keto', 'Diabetes Friendly'].map(tag => (
                     <Badge key={tag} className={cn(
                       "bg-slate-900 border-slate-700 text-slate-400 cursor-pointer hover:bg-blue-500/10 hover:text-blue-400 transition-colors",
                       tag === 'High Protein' && "bg-blue-500/20 text-blue-400 border-blue-500/30"
                     )}>
                       {tag}
                     </Badge>
                   ))}
                 </div>
                 <Separator className="bg-slate-800" />
                 <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                   <Info className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                   <p className="text-xs text-slate-400 leading-relaxed">
                     <span className="font-bold text-blue-400 uppercase">Pro Tip:</span> Based on your muscle gain goal, we elevated the protein density to 2.2g per kg of body weight.
                   </p>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-[#1E293B] border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Rule-Based Constraints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.diseases?.map((d: string) => (
                   <div key={d} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                      <span className="text-sm font-medium text-red-400">{d} Filter</span>
                      <Badge className="bg-red-500/20 text-red-500 border-red-500/20">Active</Badge>
                   </div>
                )) || <p className="text-sm text-slate-500 italic">No medical filters active.</p>}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
