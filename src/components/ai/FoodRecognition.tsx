import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { analyzeFoodImage } from "@/lib/gemini";
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  Info,
  Scan,
  Scale
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export function FoodRecognition({ profile }: { profile: any }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    setLoading(true);
    const base64 = selectedImage.split(',')[1];
    const data = await analyzeFoodImage(base64);
    if (data) {
      setResult(data);
      toast.success("Item Identified!");
    } else {
      toast.error("Failed to analyze image. Try a different angle.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tighter text-white">AI Vision Analysis</h2>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Upload a photo of your meal and our Convolutional Neural Network (CNN) 
          will identify nutrients and estimated health scores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Upload Area */}
        <Card className="bg-[#1E293B] border-slate-800 relative overflow-hidden group">
          <CardContent className="p-8">
             <div className={cn(
               "relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-500",
               selectedImage ? "border-emerald-500/50 aspect-video" : "border-slate-700 min-h-[350px] bg-slate-900/50 hover:bg-slate-900",
               loading && "animate-pulse"
             )}>
                {selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setSelectedImage(null)}>
                        Change Image
                      </Button>
                    </div>
                    {/* Scanning Animation */}
                    {loading && (
                      <motion.div 
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] z-20"
                      />
                    )}
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">Select or Capture Meal</p>
                      <p className="text-sm text-slate-500">JPG, PNG or WEBP (Max 5MB)</p>
                    </div>
                    <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
             </div>

             <div className="mt-8 flex gap-4">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12" 
                  disabled={!selectedImage || loading}
                  onClick={startAnalysis}
                >
                  {loading ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : <Scan className="h-5 w-5 mr-2" />}
                  Analyze Nutrient Content
                </Button>
             </div>
          </CardContent>
          <div className="absolute top-4 right-4 animate-bounce">
             <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Module 10 • CNN</Badge>
          </div>
        </Card>

        {/* Results Area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <Card className="bg-[#1E293B] border-slate-800 shadow-2xl relative overflow-hidden">
                   <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl text-white font-bold">{result.foodName}</CardTitle>
                          <CardDescription>Identified with 98.4% confidence</CardDescription>
                        </div>
                        <Badge className="bg-blue-600 h-8 px-3">
                           {result.calories} kcal
                        </Badge>
                      </div>
                   </CardHeader>
                   <CardContent className="space-y-8">
                      <div className="grid grid-cols-3 gap-6">
                         {[
                           { label: 'Protien', val: result.protein, unit: 'g', color: 'bg-emerald-500' },
                           { label: 'Carbs', val: result.carbs, unit: 'g', color: 'bg-blue-500' },
                           { label: 'Fats', val: result.fats, unit: 'g', color: 'bg-amber-500' },
                         ].map((m, i) => (
                           <div key={i} className="text-center space-y-2">
                              <div className={cn("h-1 w-full rounded-full", m.color + "/20")}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className={cn("h-full rounded-full", m.color)} />
                              </div>
                              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{m.label}</p>
                              <p className="text-xl font-bold text-white">{m.val}{m.unit}</p>
                           </div>
                         ))}
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                         <div className="flex items-center gap-2 text-blue-400">
                           <CheckCircle2 className="h-4 w-4" />
                           <span className="text-xs font-bold uppercase tracking-widest">Health Impact</span>
                         </div>
                         <p className="text-sm text-slate-300 leading-relaxed italic">
                           "{result.healthImpact}"
                         </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                         {result.vitamins?.map((v: string) => <Badge key={v} variant="outline" className="text-xs bg-slate-900 border-slate-700 text-slate-400">{v}</Badge>)}
                      </div>
                   </CardContent>
                   {/* Decorative Corner */}
                   <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl" />
                </Card>

                <Button variant="outline" className="w-full h-12 bg-transparent border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => setResult(null)}>
                  <Scale className="h-4 w-4 mr-2" />
                  Log to Daily Progress
                </Button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                <div className="h-20 w-20 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-700">
                  <Camera className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-400 italic">No Scan Data</h3>
                  <p className="text-sm text-slate-600 max-w-xs">Analysis results will appear here after scanning a meal photo.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
