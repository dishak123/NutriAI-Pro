import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Flame, 
  Droplets, 
  Target,
  ArrowUpRight,
  Calculator
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const mockWeeklyData = [
  { day: 'Mon', calories: 2100, protein: 120, water: 2500 },
  { day: 'Tue', calories: 1950, protein: 110, water: 2100 },
  { day: 'Wed', calories: 2300, protein: 135, water: 2800 },
  { day: 'Thu', calories: 2000, protein: 125, water: 2400 },
  { day: 'Fri', calories: 1800, protein: 105, water: 3000 },
  { day: 'Sat', calories: 2500, protein: 140, water: 2200 },
  { day: 'Sun', calories: 2200, protein: 130, water: 2600 },
];

export function DashboardOverview({ profile }: { profile: any }) {
  // Calculate BMI and BMR (Simplified)
  const heightInM = profile.height / 100;
  const bmi = (profile.weight / (heightInM * heightInM)).toFixed(1);
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (val < 25) return { label: 'Healthy', color: 'text-emerald-400' };
    if (val < 30) return { label: 'Overweight', color: 'text-amber-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };
  const bmiCat = getBmiCategory(parseFloat(bmi));

  const stats = [
    { label: 'BMI Score', value: bmi, sub: bmiCat.label, icon: Calculator, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Daily Goal', value: '2,450', sub: 'kcal', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Current Intake', value: '1,840', sub: '75% of goal', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Hydration', value: '2.4', sub: 'Liters', icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1E293B] border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-blue-500/50 transition-all duration-300"
          >
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h2 className="text-2xl font-bold text-white flex items-baseline gap-2">
              {stat.value} 
              <span className="text-slate-500 text-xs font-normal tracking-tight">{stat.sub}</span>
            </h2>
            <div className="mt-4 w-full bg-slate-900 h-1 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full", stat.color.replace('text-', 'bg-'))} 
                style={{ width: i === 2 ? '75%' : '100%' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Risk Chart */}
        <div className="lg:col-span-2 bg-[#1E293B] border border-slate-800 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Predictive Health Analytics</h3>
              <p className="text-xs text-slate-500">ML Regression on nutritional markers</p>
            </div>
            <select className="bg-slate-900 text-[10px] border-none rounded-lg px-3 py-1.5 text-slate-400 font-bold uppercase tracking-wider outline-none">
              <option>Disease Probability (XGBoost)</option>
              <option>Intake Trends (LSTM)</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockWeeklyData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                   itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="calories" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Pulse / Macro Distribution */}
        <div className="bg-blue-600 rounded-3xl p-6 text-white flex flex-col relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-1">AI Pulse Intelligence</h3>
            <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest mb-6">Real-time inference engine</p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">Health Optimization Score</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-4xl font-bold">88<span className="text-lg opacity-50">/100</span></h4>
                  <span className="text-[10px] text-emerald-300 font-bold">↑ 4% Efficiency</span>
                </div>
              </div>

              <div className="space-y-4">
                 {[
                   { label: 'Prot', val: 32, unit: 'g' },
                   { label: 'Carb', val: 45, unit: 'g' },
                   { label: 'Fiber', val: 12, unit: 'g' },
                 ].map((macro, i) => (
                   <div key={i}>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
                         <span>{macro.label} Synthesis</span>
                         <span>{macro.val}{macro.unit}</span>
                      </div>
                      <div className="h-1 w-full bg-black/20 rounded-full">
                         <div className="h-full bg-white rounded-full" style={{ width: `${(macro.val / 50) * 100}%` }} />
                      </div>
                   </div>
                 ))}
              </div>

              <button className="w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl text-sm shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                Generate AI Optimization Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Alerts & Status */}
      {profile.diseases?.length > 0 && (
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 border border-amber-500/30">
               <Activity className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Nutritional Deficiency Detected</h4>
              <p className="text-xs text-slate-400">System indicates monitoring for {profile.diseases.join(', ')}. Nutrient profiles adjusted.</p>
            </div>
          </div>
          <button className="text-xs font-bold text-blue-400 hover:underline">View Correction Plan →</button>
        </div>
      )}
    </div>
  );
}
