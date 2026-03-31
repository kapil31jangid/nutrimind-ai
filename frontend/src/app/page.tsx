"use client";

import { useState } from "react";
import { Button as ShadedButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Activity, ChevronRight, DollarSign, Sparkles, Trophy, Zap, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

type FoodItem = {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  price: number;
};

type SwapItem = {
  name: string;
  score: number;
  price: number;
};

type Recommendation = {
  food: FoodItem;
  health_score: number;
  reasons: string[];
  swap: SwapItem | null;
};

export default function Home() {
  const [budget, setBudget] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const API_URL = process.env.NODE_ENV === "development" 
        ? "http://localhost:8080/api/recommend" 
        : "/api/recommend";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: Number(budget) }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error fetching recommendation.");
      }

      const data: Recommendation = await response.json();
      setResult(data);
      triggerConfetti();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-slate-100 selection:bg-emerald-500/30 font-sans relative overflow-x-hidden flex flex-col items-center pt-24 pb-24 px-4 sm:px-6">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center space-y-6 mb-16 max-w-3xl"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl text-emerald-400 text-xs font-semibold tracking-widest uppercase"
          >
            <Trophy className="w-3.5 h-3.5" />
            V2.0 PRO RELEASE
          </motion.div>
        </div>
        
        <h1 className="text-6xl font-black tracking-tighter sm:text-8xl">
          <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Nutri</span>
          <span className="bg-gradient-to-tr from-emerald-400 to-teal-200 bg-clip-text text-transparent italic">Mind AI</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          The world&apos;s most precise food recommendation engine. <br/>
          Powered by clinical data, optimized for your wallet.
        </p>
      </motion.div>

      {/* Main Interaction Area */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* Input Card Container */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="lg:col-span-4"
        >
          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <CardTitle className="text-xl text-slate-200">Budget Intel</CardTitle>
                </div>
                <CardDescription className="text-slate-400">Specify your maximum spend limit</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="group/input relative">
                  <Input
                    type="number"
                    placeholder="Enter amount (e.g. 200)"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="h-14 bg-black/40 border-slate-800 text-xl font-medium text-slate-100 placeholder:text-slate-700 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all"
                    min="1"
                  />
                  <div className="absolute right-4 top-4 text-slate-600 font-bold">INR</div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
                  >
                    <Info className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </CardContent>

              <CardFooter>
                <ShadedButton
                  type="submit"
                  disabled={loading || !budget}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-900/20 group/btn overflow-hidden relative"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Activity className="w-5 h-5 animate-spin" />
                        COMPUTING...
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="ready"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        ANALYZE NOW
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ShadedButton>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-8 p-6 rounded-2xl bg-slate-900/20 border border-slate-800/30 text-slate-500 text-sm leading-relaxed">
            <h4 className="text-slate-300 font-bold mb-2 flex items-center gap-2 italic">
              <Zap className="w-4 h-4 text-yellow-500" /> PRO TIP
            </h4>
            Try a budget of <span className="text-emerald-400 font-mono">150</span> to see how we prioritize protein density over pure calorie count.
          </div>
        </motion.div>

        {/* Output Section Container */}
        <div className="lg:col-span-8 min-h-[400px] flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-24 h-24 rounded-3xl bg-slate-900/50 border border-slate-800 flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-600 tracking-tight">System Standby</h3>
                <p className="text-slate-700 max-w-xs">Waiting for target budget allocation...</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading-ui"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
                </div>
                <p className="mt-6 font-mono text-emerald-500 text-sm tracking-[0.2em] animate-pulse uppercase">
                  Accessing Nutritional Core...
                </p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                {/* Main Recommendation Card */}
                <Card className="bg-slate-900/60 border-emerald-500/30 backdrop-blur-3xl overflow-hidden relative shadow-2xl">
                  {/* Premium Header Decoration */}
                  <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />
                  
                  <CardHeader className="pt-10 pb-6 px-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-1">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-none hover:bg-emerald-500/30 px-3">
                            MATHEMATICAL OPTIMUM
                          </Badge>
                        </motion.div>
                        <CardTitle className="text-4xl md:text-5xl font-black text-white py-2">
                          {result.food.name}
                        </CardTitle>
                      </div>
                      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center min-w-[140px]">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Health Score</p>
                        <p className="text-4xl font-black text-emerald-400 leading-none">
                          {result.health_score.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-10 pb-10">
                    {/* Nutrient Dashboard */}
                    <div className="grid grid-cols-3 gap-3 mb-10">
                      {[
                        { label: "CALORIES", value: `${result.food.calories} kcal`, color: "slate" },
                        { label: "PROTEIN", value: `${result.food.protein}g`, color: "blue", highlight: true },
                        { label: "FAT CONTENT", value: `${result.food.fat}g`, color: "rose" }
                      ].map((stat, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl bg-black/40 border border-slate-800/50 flex flex-col justify-center`}>
                          <span className={`text-[10px] font-bold text-slate-500 tracking-tighter mb-1`}>{stat.label}</span>
                          <span className={`text-lg sm:text-xl font-black ${stat.highlight ? 'text-blue-400' : 'text-slate-100'}`}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Reasoning Section */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" /> Intelligence Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {result.reasons.map((reason, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner flex items-start gap-4 group/reason"
                          >
                            <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 group-hover/reason:scale-125 transition-transform" />
                            <p className="text-sm text-slate-400 leading-relaxed">{reason}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Swap Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {result.swap ? (
                    <div className="relative group/swap">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover/swap:opacity-40 transition duration-1000" />
                      <Card className="bg-slate-950/80 border-blue-500/20 backdrop-blur-xl relative rounded-2xl">
                        <CardContent className="py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                              <Sparkles className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mb-1">Strict Health Upgrade Found</p>
                              <h4 className="text-xl font-bold text-slate-200">
                                Trade up to <span className="text-blue-100 underline decoration-blue-500 underline-offset-4">{result.swap.name}</span>
                              </h4>
                              <p className="text-sm text-slate-500 mt-1">Better nutrient density for only ₹{result.swap.price}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center md:items-end">
                             <div className="px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-sm">
                               UPGRADE SCORE: {result.swap.score.toFixed(1)}
                             </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-4 border-t border-slate-900">
                      <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">
                        Mathematical Peak Reached for this Budget.
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer Branding */}
      <footer className="mt-32 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-800 font-bold tracking-tighter text-sm">
          <Leaf className="w-4 h-4" />
          NUTRIMIND CORE v4.2.1
        </div>
        <div className="flex gap-6 justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
        </div>
      </footer>
    </main>
  );
}
