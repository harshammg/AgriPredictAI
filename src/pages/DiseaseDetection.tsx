import { useState, useRef, DragEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorCard from '@/components/ErrorCard';
import { API } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { Upload, X, Loader2, RotateCcw, Bell, Leaf, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';

const CROP_OPTIONS = ["Rice", "Wheat", "Tomato", "Potato", "Sugarcane", "Maize", "Other"];

const MOCK_DISEASE = {
  disease: "Rice Blast",
  confidence: 88,
  severity: "Moderate" as const,
  crop: "Rice",
  description: "Rice blast is caused by the fungus Magnaporthe oryzae. It affects leaves, nodes, and panicles, appearing as diamond-shaped lesions with gray centers.",
  organic_treatment: ["Neem oil spray 2%", "Trichoderma harzianum"],
  chemical_treatment: ["Tricyclazole 75% WP", "Carbendazim 50% WP"],
};

const MOCK_HEALTHY = { disease: null, confidence: 95, severity: null, crop: "Rice", description: "No disease patterns detected." };

const severityColors = {
  Severe: 'bg-red-100 text-red-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  Mild: 'bg-green-100 text-green-700',
};

const DiseaseDetection = () => {
  const { isDemoMode } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState('');
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<typeof MOCK_DISEASE | typeof MOCK_HEALTHY | null>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };
  const removeFile = () => { setFile(null); setPreview(null); };

  const handleSubmit = async () => {
    if (!file || !crop) return;
    setStatus('loading');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('crop', crop);
      const res = await fetch(API.detectDisease, { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus('success');
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      // Demo: randomly show disease or healthy
      setResult(Math.random() > 0.3 ? MOCK_DISEASE : MOCK_HEALTHY);
      setStatus('success');
      if (!isDemoMode) toast.info('Using demo data — API unavailable');
    }
  };

  const reset = () => { setFile(null); setPreview(null); setCrop(''); setStatus('idle'); setResult(null); };

  const canSubmit = file && crop && status !== 'loading';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">Home / Disease Detection</p>
          <h1 className="text-3xl font-bold">Crop Disease Detection</h1>
          <p className="text-gray-600 mt-1">Upload a clear photo of a leaf. Results in under 2 seconds.</p>
        </div>

        {(status === 'idle' || status === 'loading') && (
          <>
            {/* Upload dropzone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => !file && fileRef.current?.click()}
              className={`relative rounded-card border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
                dragging ? 'border-primary bg-green-100' : file ? 'border-green-300 bg-green-50' : 'border-green-300 bg-green-50 hover:border-primary'
              }`}
              style={{ minHeight: 280 }}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              
              {!file ? (
                <div className="flex flex-col items-center justify-center h-[280px] gap-3">
                  {dragging ? (
                    <p className="text-lg font-medium text-primary">Drop it here!</p>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-primary opacity-60" />
                      <p className="text-base font-medium text-gray-600">Drag & drop your leaf photo here</p>
                      <p className="text-sm text-green-600 hover:underline">or click to select file</p>
                      <p className="text-xs text-muted-foreground">JPG or PNG · Max 10MB</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative h-[280px]">
                  <img src={preview!} alt="Leaf preview" className="w-full h-full object-cover rounded-[14px]" />
                  <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 backdrop-blur-sm px-4 py-2 flex items-center justify-between rounded-b-[14px]">
                    <div className="flex items-center gap-2 text-primary-foreground text-sm">
                      <span>{file.name}</span>
                      <span className="text-xs opacity-70">{(file.size / 1024).toFixed(0)}KB</span>
                      <span className="rounded-pill bg-primary px-2 py-0.5 text-xs">✓ Ready</span>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); removeFile(); }} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-foreground/50 flex items-center justify-center text-primary-foreground hover:bg-foreground/70 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Crop selector */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600 block mb-3">Which crop is this?</label>
              <div className="flex flex-wrap gap-2">
                {CROP_OPTIONS.map(c => (
                  <button key={c} onClick={() => setCrop(c)}
                    className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${crop === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-green-200 text-green-700 hover:bg-green-50'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={!canSubmit}
              className="w-full mt-6 rounded-button bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-green-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[52px]">
              {status === 'loading' ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
              ) : 'Detect Disease →'}
            </button>

            {/* Loading overlay */}
            {status === 'loading' && (
              <div className="mt-8 rounded-card bg-card shadow-card p-12 text-center">
                <div className="relative mx-auto h-16 w-16 mb-4">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ripple" />
                  <div className="absolute inset-2 rounded-full bg-primary/30 animate-ripple" style={{ animationDelay: '0.3s' }} />
                  <div className="absolute inset-4 rounded-full bg-primary/40" />
                </div>
                <p className="text-base text-gray-600 font-medium">🔍 Analyzing leaf pattern...</p>
                <p className="text-sm text-muted-foreground mt-1">This usually takes 1–2 seconds.</p>
              </div>
            )}
          </>
        )}

        {status === 'error' && (
          <ErrorCard message="Unable to reach disease detection service." onRetry={reset} />
        )}

        {status === 'success' && result && (
          <div className="animate-fade-in-up">
            {result.disease ? (
              <div className="rounded-card bg-card shadow-card p-8 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${severityColors[(result as typeof MOCK_DISEASE).severity]}`}>
                    {(result as typeof MOCK_DISEASE).severity}
                  </span>
                  <span className="rounded-pill bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{result.confidence}% Confident</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{result.disease}</h2>
                <p className="text-sm text-muted-foreground mb-4 italic">Magnaporthe oryzae</p>
                <div className="border-t border-border pt-4 mb-4">
                  <h3 className="text-sm font-semibold mb-2">About this disease</h3>
                  <p className="text-sm text-gray-600">{result.description}</p>
                </div>
                <div className="border-t border-border pt-4 grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="h-5 w-5 text-primary" />
                      <h4 className="text-sm font-semibold">Organic Treatment</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {(result as typeof MOCK_DISEASE).organic_treatment.map((t, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-primary mt-1">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskConical className="h-5 w-5 text-primary" />
                      <h4 className="text-sm font-semibold">Chemical Treatment</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {(result as typeof MOCK_DISEASE).chemical_treatment.map((t, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-primary mt-1">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button onClick={() => toast.info('SMS alerts coming soon!')} className="w-full mt-6 rounded-button border border-primary py-3 text-sm font-medium text-primary hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                  <Bell className="h-4 w-4" /> Set SMS Alert for this disease →
                </button>
              </div>
            ) : (
              <div className="rounded-card border border-primary bg-green-50 p-12 text-center mt-6">
                <svg className="mx-auto h-16 w-16 text-primary mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" className="animate-draw-check" />
                </svg>
                <h2 className="text-xl font-bold text-green-700 mb-2">Your crop looks healthy! 🎉</h2>
                <p className="text-sm text-gray-600">No disease patterns detected in this leaf.</p>
              </div>
            )}

            <button onClick={reset} className="w-full mt-6 rounded-button border border-primary py-3 text-sm font-medium text-primary hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="h-4 w-4" /> Scan Another Leaf
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DiseaseDetection;
