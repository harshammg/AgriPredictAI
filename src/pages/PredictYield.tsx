import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorCard from '@/components/ErrorCard';
import { API } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];
const CROPS = ["Rice 🌾", "Wheat 🌿", "Sugarcane", "Cotton", "Tomato 🍅", "Potato", "Maize", "Pulses"];
const SEASONS = ["Kharif", "Rabi", "Zaid"];
const SOILS = ["Clay", "Sandy", "Loamy", "Black Cotton", "Red", "Alluvial"];

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
  const { isDemoMode } = useAuth();
  const [form, setForm] = useState({ state: '', district: '', crop: '', season: '', sowingDate: '', area: '', soil: '', n: 60, p: 40, k: 40 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);

  const update = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(API.predictYield, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus('success');
    } catch {
      // Demo fallback
      await new Promise(r => setTimeout(r, 1200));
      setResult(MOCK_RESULT);
      setStatus('success');
      if (!isDemoMode) toast.info('Using demo data — API unavailable');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">Home / Predict Yield</p>
          <h1 className="text-3xl font-bold">Yield Prediction</h1>
          <p className="text-gray-600 mt-1">Get an AI-powered forecast before you invest in sowing.</p>
        </div>

        <div className="grid lg:grid-cols-[55%_45%] gap-8">
          {/* Form */}
          <div className="rounded-card bg-card shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-xs font-medium uppercase tracking-wider text-green-600">Farm Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1.5">State</label>
                  <select value={form.state} onChange={e => update('state', e.target.value)} required
                    className="w-full rounded-button border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <option value="">Select</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1.5">District</label>
                  <input type="text" placeholder="e.g. Mysuru" value={form.district} onChange={e => update('district', e.target.value)} required
                    className="w-full rounded-button border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1.5">Crop Type</label>
                  <select value={form.crop} onChange={e => update('crop', e.target.value)} required
                    className="w-full rounded-button border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <option value="">Select crop</option>
                    {CROPS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1.5">Season</label>
                  <select value={form.season} onChange={e => update('season', e.target.value)} required
                    className="w-full rounded-button border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <option value="">Select</option>
                    {SEASONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1.5">Sowing Date</label>
                  <input type="date" value={form.sowingDate} onChange={e => update('sowingDate', e.target.value)}
                    className="w-full rounded-button border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1.5">Land Area (acres)</label>
                  <input type="number" step="0.5" min="0" placeholder="e.g. 2.5" value={form.area} onChange={e => update('area', e.target.value)} required
                    className="w-full rounded-button border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1.5">Soil Type</label>
                <select value={form.soil} onChange={e => update('soil', e.target.value)} required
                  className="w-full rounded-button border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <option value="">Select soil type</option>
                  {SOILS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <p className="text-xs font-medium uppercase tracking-wider text-green-600 pt-2">Soil Nutrients</p>
              {[['Nitrogen (N)', 'n'], ['Phosphorus (P)', 'p'], ['Potassium (K)', 'k']].map(([label, key]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">{label}</label>
                    <span className="rounded-pill bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                      {form[key as keyof typeof form]} kg/ha
                    </span>
                  </div>
                  <input type="range" min="0" max="140" value={form[key as keyof typeof form] as number} onChange={e => update(key, +e.target.value)}
                    className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-sm" />
                </div>
              ))}

              <button type="submit" disabled={status === 'loading'}
                className="w-full rounded-button bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-green-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 h-[52px]">
                {status === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing your farm data...</> : 'Predict Yield & Profit →'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            {status === 'idle' && (
              <div className="rounded-card border-2 border-dashed border-green-200 bg-green-50 p-12 text-center h-full flex flex-col items-center justify-center">
                <svg viewBox="0 0 120 100" className="w-24 mb-4 text-green-400">
                  <rect x="10" y="50" width="100" height="40" rx="4" fill="currentColor" opacity="0.2" />
                  <rect x="20" y="60" width="30" height="10" rx="2" fill="currentColor" opacity="0.3" />
                  <rect x="60" y="60" width="40" height="10" rx="2" fill="currentColor" opacity="0.3" />
                  <text x="60" y="35" textAnchor="middle" fill="currentColor" fontSize="28" opacity="0.4">?</text>
                </svg>
                <p className="text-muted-foreground font-medium">Your prediction will appear here</p>
                <p className="text-sm text-muted-foreground mt-1">Fill in the form and hit Predict</p>
              </div>
            )}

            {status === 'loading' && (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}

            {status === 'error' && (
              <ErrorCard message="Unable to reach prediction service." onRetry={() => setStatus('idle')} />
            )}

            {status === 'success' && result && (
              <div className="space-y-4 animate-fade-in-up">
                {isDemoMode && (
                  <div className="text-right">
                    <span className="rounded-pill bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Demo Mode</span>
                  </div>
                )}
                <div className="rounded-card bg-card shadow-card p-6 border-l-4 border-primary">
                  <p className="text-xs font-medium uppercase tracking-wider text-green-600 mb-1">Estimated Yield</p>
                  <p className="text-4xl font-bold text-foreground">
                    <AnimatedCounter target={result.yield_kg_per_acre} suffix=" kg / acre" />
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Confidence</span>
                      <span>{result.confidence}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${result.confidence}%` }} />
                    </div>
                  </div>
                </div>

                <div className="rounded-card bg-card shadow-card p-6 border-l-4 border-primary">
                  <p className="text-xs font-medium uppercase tracking-wider text-green-600 mb-1">Projected Profit</p>
                  <p className="text-4xl font-bold text-foreground">
                    <AnimatedCounter target={result.profit_inr} prefix="₹ " />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Based on current MSP rates</p>
                </div>

                <div className="rounded-card bg-card shadow-card p-6 border-l-4 border-primary">
                  <p className="text-xs font-medium uppercase tracking-wider text-green-600 mb-3">AI Recommendations</p>
                  <ul className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-muted-foreground">Estimates based on historical Indian crop data. Actual results may vary.</p>

                <button onClick={reset} className="w-full rounded-button border border-primary py-3 text-sm font-medium text-primary hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="h-4 w-4" /> Run Another Prediction
                </button>
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
