import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Check, ChevronRight, ChevronLeft, HeartPulse } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ProfileSetupPage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderately_active',
    healthGoal: 'maintain',
    diseases: [] as string[],
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    const { uid } = auth.currentUser;
    const path = `users/${uid}`;
    
    // Basic validation
    if (!formData.name || !formData.age || !formData.height || !formData.weight) {
      toast.error('Please fill in all physical statistics.');
      setLoading(false);
      return;
    }

    try {
      const profileData = {
        uid,
        ...formData,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Ensure we don't send NaN to Firestore which violates rules
      if (isNaN(profileData.age) || isNaN(profileData.height) || isNaN(profileData.weight)) {
        toast.error('Please enter valid numbers for age, height, and weight.');
        setLoading(false);
        return;
      }
      
      await setDoc(doc(db, 'users', uid), profileData);
      toast.success('Health profile created successfully!');
      onComplete();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/40">
            <HeartPulse className="text-white h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Welcome to NutriAI</h1>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            You're logged in! Now we just need a few basic details to calculate your personalized nutrition plans and health insights.
          </p>
        </div>

        <div className="bg-[#1E293B] border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="p-8 pb-4">
            <div className="flex justify-between items-center mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-all duration-500",
                    step === i ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-110" : 
                    step > i ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                    "bg-slate-900 border-slate-700 text-slate-600"
                  )}>
                    {step > i ? <Check className="h-5 w-5" /> : i}
                  </div>
                  {i < 3 && <div className={cn("h-[1px] flex-1 mx-4 transition-colors duration-500", step > i ? "bg-emerald-500/30" : "bg-slate-800")} />}
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">
              {step === 1 && "The Basics"}
              {step === 2 && "Physical Stats"}
              {step === 3 && "Your Goals"}
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              {step === 1 && "Knowing your age and gender helps us calculate your metabolism."}
              {step === 2 && "Height and weight are key for accurate calorie and health modeling."}
              {step === 3 && "Tell us what you want to achieve with NutriAI."}
            </p>
          </div>

          <div className="p-8 pt-0 min-h-[320px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Name</Label>
                    <Input className="bg-slate-900 border-slate-700 text-white rounded-xl h-12 focus:ring-blue-500/20" placeholder="e.g. John Doe" value={formData.name} onChange={e => updateField('name', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Age</Label>
                       <Input type="number" className="bg-slate-900 border-slate-700 text-white rounded-xl h-12" placeholder="25" value={formData.age} onChange={e => updateField('age', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gender</Label>
                       <Select value={formData.gender} onValueChange={v => updateField('gender', v)}>
                         <SelectTrigger className="bg-slate-900 border-slate-700 text-white rounded-xl h-12">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-[#0F172A] border-slate-800 text-white">
                           <SelectItem value="male">Male</SelectItem>
                           <SelectItem value="female">Female</SelectItem>
                           <SelectItem value="other">Non-binary</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Height (cm)</Label>
                       <Input type="number" className="bg-slate-900 border-slate-700 text-white rounded-xl h-12" placeholder="175" value={formData.height} onChange={e => updateField('height', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weight (kg)</Label>
                       <Input type="number" className="bg-slate-900 border-slate-700 text-white rounded-xl h-12" placeholder="70" value={formData.weight} onChange={e => updateField('weight', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Activity Level</Label>
                    <Select value={formData.activityLevel} onValueChange={v => updateField('activityLevel', v)}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F172A] border-slate-800 text-white">
                        <SelectItem value="sedentary">Sedentary (Office job)</SelectItem>
                        <SelectItem value="lightly_active">Lightly Active</SelectItem>
                        <SelectItem value="moderately_active">Moderately Active</SelectItem>
                        <SelectItem value="very_active">Very Active</SelectItem>
                        <SelectItem value="extra_active">Extra Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Health Goal</Label>
                    <Select value={formData.healthGoal} onValueChange={v => updateField('healthGoal', v)}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F172A] border-slate-800 text-white">
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintain">Maintain Weight</SelectItem>
                        <SelectItem value="disease_management">Health Monitoring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Medical History (Optional)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Diabetes', 'Hypertension', 'PCOS', 'Thyroid', 'Kidney Disease'].map(d => (
                        <button 
                          key={d}
                          type="button"
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all",
                            formData.diseases.includes(d) 
                              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                              : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                          )}
                          onClick={() => {
                            if (formData.diseases.includes(d)) {
                              updateField('diseases', formData.diseases.filter(x => x !== d));
                            } else {
                              updateField('diseases', [...formData.diseases, d]);
                            }
                          }}
                        >
                          <div className={cn("w-2 h-2 rounded-full", formData.diseases.includes(d) ? "bg-white" : "bg-slate-700")} />
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-8 border-t border-slate-800 flex justify-between bg-slate-900/30 backdrop-blur-sm">
            <button 
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                step === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 hover:text-slate-100"
              )} 
              onClick={prevStep} 
            >
               BACK
            </button>
            {step < 3 ? (
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                onClick={nextStep}
              >
                NEXT
              </button>
            ) : (
              <button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "SAVING..." : "COMPLETE SETUP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
