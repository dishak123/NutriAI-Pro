import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Activity, Target, Zap, Waves, Scale, Microscope } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const data = [
  { name: 'Week 1', value: 72 },
  { name: 'Week 2', value: 71.5 },
  { name: 'Week 3', value: 70.8 },
  { name: 'Week 4', value: 70.2 },
  { name: 'Week 5', value: 69.5 },
  { name: 'Week 6', value: 68.9 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function HealthForecast({ profile }: { profile: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1E293B] border-slate-800 overflow-hidden relative">
          <CardHeader>
            <div className="flex items-center gap-3">
               <Scale className="text-blue-400 h-5 w-5" />
               <CardTitle className="text-white text-lg">Weight Trend</CardTitle>
            </div>
            <CardDescription>Predictive regression analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
               </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
             <span className="text-xs text-slate-500 font-bold uppercase">Estimated -3.1kg</span>
             <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">On Track</Badge>
          </div>
        </Card>

        <Card className="bg-[#1E293B] border-slate-800 overflow-hidden relative">
          <CardHeader>
             <div className="flex items-center gap-3">
               <Waves className="text-cyan-400 h-5 w-5" />
               <CardTitle className="text-white text-lg">Metabolic Rate</CardTitle>
             </div>
             <CardDescription>Calculated BMR baseline</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
             <p className="text-5xl font-bold text-white tracking-tighter">1,745</p>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none text-center">Calories / Day (Resting)</p>
             <div className="flex gap-2 pt-4">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400/20">Normal Range</Badge>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-800 overflow-hidden relative">
          <CardHeader>
             <div className="flex items-center gap-3">
               <Microscope className="text-purple-400 h-5 w-5" />
               <CardTitle className="text-white text-lg">Nutrient Density</CardTitle>
             </div>
             <CardDescription>Micronutrient diversity score</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                    data={[
                      { name: 'Vitamins', value: 40 },
                      { name: 'Minerals', value: 30 },
                      { name: 'Fiber', value: 20 },
                      { name: 'Antioxidants', value: 10 },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                 >
                   {COLORS.map((color, index) => (
                     <Cell key={`cell-${index}`} fill={color} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1E293B] border-slate-800 overflow-hidden">
         <CardHeader>
           <CardTitle className="text-white flex items-center gap-2">
             <Activity className="h-5 w-5 text-blue-400" />
             Deep Health Analytics Dashboard
           </CardTitle>
           <CardDescription>Research-grade visualization for complex nutritional datasets.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: 'Protein Synthesis Rate', value: '84%', icon: Zap, color: 'text-orange-400' },
                 { label: 'Glycemic Variability', value: 'Low', icon: Activity, color: 'text-emerald-400' },
                 { label: 'Iron Homeostasis', value: 'Optimal', icon: Target, color: 'text-blue-400' },
                 { label: 'Lipid Profile', value: 'Balanced', icon: Waves, color: 'text-cyan-400' },
               ].map((item, i) => (
                 <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                    <div className={cn("p-2 rounded-lg bg-slate-800", item.color)}>
                       <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{item.label}</p>
                       <p className="text-lg font-bold text-white tracking-tight">{item.value}</p>
                    </div>
                 </div>
               ))}
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
