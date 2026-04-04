import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorCard from '@/components/ErrorCard';
import { API } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, RotateCcw, BarChart3, CheckCircle2, Sprout, Beaker, FlaskConical, Thermometer } from 'lucide-react';
import { toast } from 'sonner';

const CROPS = ["Rice", "Wheat", "Sugarcane", "Cotton", "Tomato", "Potato", "Maize", "Pulses", "Others"];
const SEASONS = ["Kharif", "Rabi", "Zaid"];

const MOCK_RESULT = {
  yield_kg_per_acre: 2400,
  profit_inr: 38500,
  confidence: 91,
  recommendations: [
    "Apply 40kg Urea before sowing",
    "Irrigate every 7 days during growth phase",
    "Monitor for brown spot disease in humid conditions",
  ],
};

const AnimatedCounter = ({ target, prefix = "", suffix = "", duration = 800 }: { target: number; prefix?: string; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

const PredictYield = () => {
  const { isDemoMode, user, updateUser } = useAuth();
  const [form, setForm] = useState({ 
    crop: '', 
    season: '', 
    fertilizerAmount: '', 
    pesticideAmount: '',
    // Hidden/Auto-passed
    n: user?.soilDetails?.nitrogen || 0,
    p: user?.soilDetails?.phosphorus || 0,
    k: user?.soilDetails?.potassium || 0,
    ph: user?.soilDetails?.ph || 7.0
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);

  useEffect(() => {
    if (user?.soilDetails) {
      setForm(prev => ({
        ...prev,
        n: user.soilDetails!.nitrogen,
        p: user.soilDetails!.phosphorus,
        k: user.soilDetails!.potassium,
        ph: user.soilDetails!.ph || 7.0
      }));
    }
  }, [user]);

  const update = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.soilDetails) {
      toast.error('Please complete your soil profile first!');
      return;
    }
    setStatus('loading');
    try {
      // Prepare payload with both user-entered and profile-fetched data
      const payload = {
        ...form,
        state: user.state,
        district: user.district
      };

      const res = await fetch(API.predictYield, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus('success');
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      setResult(MOCK_RESULT);
      setStatus('success');
      if (!isDemoMode) toast.info('Using demo logic — API unavailable');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="view-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Advanced Yield Intelligence</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Predict Your Harvest</h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto lg:mx-0">
              Get an accurate forecast by combining your current farming inputs with your stored soil profile.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_0.4fr] gap-8">
            <div className="card-premium p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Crop Selection</label>
                    <select value={form.crop} onChange={e => update('crop', e.target.value)} required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm">
                      <option value="">Select Crop</option>
                      {CROPS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Growth Season</label>
                    <select value={form.season} onChange={e => update('season', e.target.value)} required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm">
                      <option value="">Select Season</option>
                      {SEASONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                       <Beaker className="h-4 w-4 text-emerald-500" /> Fertilizer Amount (kg)
                    </label>
                    <input 
                      type="number" step="1" min="0" placeholder="e.g. 50" 
                      value={form.fertilizerAmount} 
                      onChange={e => update('fertilizerAmount', e.target.value)} 
                      required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-emerald-500" /> Pesticide Amount (L)
                    </label>
                    <input 
                      type="number" step="0.1" min="0" placeholder="e.g. 2.5" 
                      value={form.pesticideAmount} 
                      onChange={e => update('pesticideAmount', e.target.value)} 
                      required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={status === 'loading'}
                  className="btn-primary w-full h-[60px] text-lg mt-10">
                  {status === 'loading' ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Calculating Yield...</>
                  ) : 'Generate Harvest Forecast →'}
                </button>
              </form>
            </div>

            {/* Profile Data Preview */}
            <div className="space-y-6">
              <div className="card-premium p-6 border-l-[6px] border-emerald-500">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sprout size={16} className="text-emerald-500" /> Your Soil Profile
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-700">Nitrogen (N)</span>
                    <span className="text-sm font-black text-gray-900">{form.n} mg/kg</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <span className="text-xs font-bold text-orange-700">Phosphorus (P)</span>
                    <span className="text-sm font-black text-gray-900">{form.p} mg/kg</span>
                  </div>
                  <div className="flex justify-between items-center bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <span className="text-xs font-bold text-purple-700">Potassium (K)</span>
                    <span className="text-sm font-black text-gray-900">{form.k} mg/kg</span>
                  </div>
                  <div className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <span className="text-xs font-bold text-amber-700">Soil pH</span>
                    <span className="text-sm font-black text-gray-900">{form.ph}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic">
                  *Fetched automatically from your profile settings.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            {status === 'idle' && (
              <div className="rounded-3xl border-2 border-dashed border-green-200 bg-green-50/50 p-16 text-center animate-fade-in-up">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-10 w-10 text-primary opacity-40" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to predict?</h3>
                <p className="text-gray-500">Fill in your input amounts and we'll calculate your yield based on your soil health.</p>
              </div>
            )}

            {status === 'loading' && (
              <div className="space-y-6">
                <SkeletonCard />
              </div>
            )}

            {status === 'error' && (
              <ErrorCard message="Unable to reach prediction service." onRetry={() => setStatus('idle')} />
            )}

            {status === 'success' && result && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card-premium p-8 border-l-[6px] border-primary shadow-xl shadow-primary/10">
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Estimated Yield</p>
                    <p className="text-5xl font-bold tracking-tighter text-gray-900">
                      <AnimatedCounter target={result.yield_kg_per_acre} suffix=" kg/ac" />
                    </p>
                    <div className="mt-6">
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>MODEL CONFIDENCE</span>
                        <span>{result.confidence}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="card-premium p-8 border-l-[6px] border-primary shadow-xl shadow-primary/10">
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Projected Profit</p>
                    <p className="text-5xl font-bold tracking-tighter text-gray-900">
                      <AnimatedCounter target={result.profit_inr} prefix="₹" />
                    </p>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Estimated based on local market rates</p>
                  </div>
                </div>

                <div className="card-premium p-8">
                  <p className="text-sm font-bold text-primary uppercase tracking-wider mb-6">Smart Recommendations</p>
                  <ul className="space-y-4">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-gray-700 font-medium leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={reset} className="inline-flex flex-1 items-center justify-center gap-2 h-[56px] rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all">
                    <RotateCcw className="h-5 w-5" /> Run Another Prediction
                  </button>
                  <button 
                    onClick={() => {
                      const name = prompt("Enter a name for this report:", `${form.crop} Report - ${new Date().toLocaleDateString()}`);
                      if (name) {
                        const newReport = {
                          id: Math.random().toString(36).substr(2, 9),
                          name,
                          date: new Date().toISOString(),
                          crop: form.crop,
                          season: form.season,
                          yield: result.yield_kg_per_acre,
                          profit: result.profit_inr,
                          inputs: {
                            fertilizer: Number(form.fertilizerAmount),
                            pesticide: Number(form.pesticideAmount),
                            n: form.n,
                            p: form.p,
                            k: form.k,
                            ph: form.ph
                          }
                        };
                        const currentReports = user?.reports || [];
                        updateUser({ reports: [...currentReports, newReport] });
                        toast.success("Report saved to your profile!");
                      }
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-2 h-[56px] rounded-full bg-primary text-white font-bold hover:bg-green-600 transition-all shadow-lg shadow-primary/20"
                  >
                    <CheckCircle2 className="h-5 w-5" /> Save Report to Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PredictYield;
