import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Beaker, Droplets, FlaskConical, Thermometer, ArrowRight, Leaf } from 'lucide-react';

const SoilDetails = () => {
  const { updateUser, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    const n = parseFloat(form.nitrogen);
    const p = parseFloat(form.phosphorus);
    const k = parseFloat(form.potassium);
    const ph = parseFloat(form.ph);

    if (isNaN(n) || isNaN(p) || isNaN(k) || isNaN(ph)) {
      toast.error('Please enter valid numeric values for all fields');
      setLoading(false);
      return;
    }

    if (ph < 0 || ph > 14) {
      toast.error('pH must be between 0 and 14');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call or update local state
      updateUser({
        soilDetails: {
          nitrogen: n,
          phosphorus: p,
          potassium: k,
          ph: ph
        }
      });

      toast.success('Soil details saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save soil details');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => {
    // Only allow numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setForm(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-primary p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Leaf size={120} />
          </div>
          <h1 className="text-3xl font-bold relative z-10">Soil Profile</h1>
          <p className="text-primary-foreground/80 mt-2 relative z-10">
            Help us provide better recommendations by sharing your soil's nutritional levels.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nitrogen */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Droplets size={16} />
                </div>
                Nitrogen (N)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 45"
                  value={form.nitrogen}
                  onChange={(e) => update('nitrogen', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-primary transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">mg/kg</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
                  <Beaker size={16} />
                </div>
                Phosphorus (P)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 30"
                  value={form.phosphorus}
                  onChange={(e) => update('phosphorus', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-primary transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">mg/kg</span>
              </div>
            </div>

            {/* Potassium */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                  <FlaskConical size={16} />
                </div>
                Potassium (K)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 25"
                  value={form.potassium}
                  onChange={(e) => update('potassium', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-primary transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">mg/kg</span>
              </div>
            </div>

            {/* pH */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg">
                  <Thermometer size={16} />
                </div>
                Soil pH
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 6.5"
                  value={form.ph}
                  onChange={(e) => update('ph', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-primary transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">0 - 14</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-primary text-white hover:bg-green-600 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 group"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm text-center max-w-md">
        Note: You can find these details on your official soil health card. 
        Accuracy helps our AI provide more precise crop recommendations.
      </p>
    </div>
  );
};

export default SoilDetails;
