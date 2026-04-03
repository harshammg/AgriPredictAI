import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, BarChart3, Leaf, Sparkles, Bell, Play } from 'lucide-react';

const FarmIllustration = () => (
  <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
    <svg viewBox="0 0 400 350" className="w-full max-w-md" fill="none">
      {/* Field grid */}
      <rect x="50" y="220" width="300" height="100" rx="8" fill="hsl(141, 84%, 93%)" stroke="hsl(142, 71%, 45%)" strokeWidth="1.5"/>
      <line x1="150" y1="220" x2="150" y2="320" stroke="hsl(142, 71%, 45%)" strokeWidth="1" opacity="0.4"/>
      <line x1="250" y1="220" x2="250" y2="320" stroke="hsl(142, 71%, 45%)" strokeWidth="1" opacity="0.4"/>
      <line x1="50" y1="270" x2="350" y2="270" stroke="hsl(142, 71%, 45%)" strokeWidth="1" opacity="0.4"/>
      {/* Barn */}
      <rect x="60" y="160" width="60" height="60" rx="4" fill="hsl(142, 69%, 58%)" opacity="0.3"/>
      <polygon points="60,160 90,130 120,160" fill="hsl(142, 71%, 45%)" opacity="0.4"/>
      {/* Phone mockup */}
      <rect x="240" y="60" width="90" height="150" rx="12" fill="white" stroke="hsl(142, 71%, 45%)" strokeWidth="2"/>
      <rect x="252" y="80" width="66" height="12" rx="3" fill="hsl(141, 84%, 93%)"/>
      <rect x="252" y="100" width="66" height="8" rx="3" fill="hsl(142, 69%, 58%)" opacity="0.3"/>
      <rect x="252" y="116" width="40" height="8" rx="3" fill="hsl(142, 69%, 58%)" opacity="0.3"/>
      <rect x="252" y="140" width="66" height="24" rx="6" fill="hsl(142, 71%, 45%)"/>
      <rect x="252" y="172" width="66" height="24" rx="6" fill="hsl(141, 84%, 93%)"/>
      {/* Dotted connection lines */}
      <path d="M 240 180 Q 180 200 150 220" stroke="hsl(142, 71%, 45%)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
      <path d="M 330 160 Q 340 200 320 220" stroke="hsl(142, 71%, 45%)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
    </svg>
    {/* Floating leaves */}
    <div className="absolute top-8 right-12 animate-float">
      <Leaf className="h-6 w-6 text-green-400 opacity-60" />
    </div>
    <div className="absolute top-24 left-8 animate-float" style={{ animationDelay: '1s' }}>
      <Leaf className="h-4 w-4 text-green-500 opacity-40" />
    </div>
    <div className="absolute bottom-32 right-4 animate-float" style={{ animationDelay: '2s' }}>
      <Leaf className="h-5 w-5 text-green-400 opacity-50" />
    </div>
  </div>
);

const features = [
  { icon: BarChart3, title: "Yield Forecasting", body: "Enter location, crop, soil data → get yield in kg/acre and profit in ₹ based on live MSP rates.", link: "/predict" },
  { icon: Leaf, title: "Instant Disease Detection", body: "Upload a leaf photo. CNN model identifies disease in under 2 seconds + suggests organic & chemical treatments.", link: "/disease" },
  { icon: Sparkles, title: "Smart Crop Advisor", body: "Get personalized crop and fertilizer suggestions based on your soil type, season, and local weather data.", link: "/predict" },
  { icon: Bell, title: "Automated SMS Alerts", body: "Get alerts for irrigation schedules, sowing windows, pest risks — directly to your phone via SMS.", link: "/dashboard" },
];

const steps = [
  { num: "01", title: "Create Your Account", body: "Register with your phone number and tell us your state and district." },
  { num: "02", title: "Enter Farm Details", body: "Select your crop, soil type, and area. Or upload a leaf photo for disease check." },
  { num: "03", title: "Get AI Predictions", body: "Receive yield forecasts, disease diagnosis, and actionable recommendations in seconds." },
];

const crops = ["Rice 🌾", "Wheat 🌿", "Sugarcane", "Cotton", "Tomato 🍅", "Potato", "Maize", "Pulses"];

const testimonials = [
  { quote: "I used to lose 30% of my rice crop every season to blast disease. AgriPredict detected it before I could even see it.", name: "Ravi Kumar", location: "Mandya, Karnataka" },
  { quote: "The yield prediction was within 200kg of my actual harvest. I planned my selling price in advance for the first time.", name: "Sunita Patil", location: "Solapur, Maharashtra" },
  { quote: "SMS alerts told me to irrigate 2 days before my soil dried out. Simple but it saved my crop.", name: "Mohan Das", location: "Warangal, Telangana" },
];

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar transparent />
      
      {/* Hero */}
      <section className="relative min-h-screen flex items-center -mt-16 pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(138,76%,97%)_0%,_transparent_70%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center rounded-pill bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 mb-6">
                🌾 Built for Indian Farmers
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Grow More.<br />
                <span className="text-primary">Lose Less.</span><br />
                Know Before You Sow.
              </h1>
              <p className="text-lg text-gray-600 max-w-[480px] mb-8">
                AgriPredict AI uses machine learning trained on Indian crop data to give you yield forecasts, instant disease detection, and profit estimates — before you spend a rupee.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-green-600 transition-colors shadow-md">
                  {isAuthenticated ? "Go to Dashboard" : "Start Predicting Free"} <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="inline-flex items-center gap-2 rounded-button border border-border bg-card px-6 py-3 text-base font-medium text-gray-600 hover:bg-accent transition-colors">
                  <Play className="h-4 w-4" /> Watch How It Works
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['RK', 'SP', 'MD', 'AJ'].map((initials, i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground border-2 border-card">
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Trusted by 10,000+ farmers across Karnataka, Maharashtra & UP</p>
              </div>
            </div>
            <div className="hidden lg:block animate-fade-in-up stagger-2">
              <FarmIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[["8+", "Crops"], ["90%+", "Accuracy"], ["2 sec", "Detection"], ["15–25%", "More Yield"]].map(([value, label], i) => (
              <div key={i} className={`py-2 ${i > 0 ? 'md:border-l md:border-primary-foreground/20' : ''}`}>
                <div className="text-2xl font-bold text-primary-foreground">{value}</div>
                <div className="text-sm text-primary-foreground/80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything a Smart Farmer Needs</h2>
            <p className="text-muted-foreground">One platform. Four powerful tools.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className={`group rounded-card border border-border bg-card p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-l-[3px] hover:border-l-primary transition-all duration-200 animate-fade-in-up stagger-${i + 1}`}>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{f.body}</p>
                <Link to={f.link} className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                  Try it →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-green-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Up and Running in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-green-300" />
            {steps.map((s, i) => (
              <div key={i} className="text-center relative animate-fade-in-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-primary font-bold mb-4 bg-card relative z-10">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crops Marquee */}
      <section className="py-16 bg-card overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-8">Supported Crops</h2>
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...crops, ...crops].map((crop, i) => (
              <span key={i} className="inline-flex items-center mx-3 rounded-pill border border-green-200 bg-card px-5 py-2.5 text-sm font-medium text-green-700">
                {crop}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Farmers Are Seeing Results</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-card bg-card p-6 shadow-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_, j) => <span key={j} className="text-green-400">★</span>)}
                </div>
                <p className="text-sm text-gray-600 mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Ready to Farm Smarter?</h2>
          <p className="text-green-100 mb-8 max-w-lg mx-auto">Join thousands of farmers already using AgriPredict AI. Free to start. No app download needed.</p>
          <Link to="/register" className="inline-flex items-center gap-2 rounded-button bg-card px-8 py-3.5 text-base font-semibold text-green-700 hover:bg-green-50 transition-colors">
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
