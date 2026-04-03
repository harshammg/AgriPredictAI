import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Leaf, Calendar, BarChart3, ArrowRight, Search, Bell as BellIcon, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const yieldData = [
  { month: "Oct", yield: 1800 }, { month: "Nov", yield: 2100 },
  { month: "Dec", yield: 1950 }, { month: "Jan", yield: 2300 },
  { month: "Feb", yield: 2400 }, { month: "Mar", yield: 2200 },
];

const predictions = [
  { date: "12 Mar", crop: "Rice", yield: "2,400 kg/ac", profit: "₹38,500", status: "Completed" },
  { date: "01 Mar", crop: "Wheat", yield: "1,800 kg/ac", profit: "₹29,000", status: "Completed" },
  { date: "18 Feb", crop: "Tomato", yield: "3,200 kg/ac", profit: "₹48,000", status: "Completed" },
];

const weekWeather = [
  { day: "Mon", temp: "28°C", icon: "☀️", today: false },
  { day: "Tue", temp: "27°C", icon: "⛅", today: false },
  { day: "Wed", temp: "29°C", icon: "☀️", today: false },
  { day: "Thu", temp: "26°C", icon: "🌧️", today: true },
  { day: "Fri", temp: "25°C", icon: "🌧️", today: false },
  { day: "Sat", temp: "28°C", icon: "⛅", today: false },
  { day: "Sun", temp: "30°C", icon: "☀️", today: false },
];

const alerts = [
  { type: 'warning' as const, icon: '⚠', title: 'Irrigation Due', body: 'Rice field needs water in 2 days', borderColor: 'border-l-yellow-400', bg: 'bg-yellow-50' },
  { type: 'success' as const, icon: '✓', title: 'Sowing Window Open', body: 'Optimal period for Rabi crop started today', borderColor: 'border-l-green-400', bg: 'bg-green-50' },
  { type: 'info' as const, icon: 'ℹ', title: 'Fertilizer Reminder', body: 'Apply Urea by this Friday', borderColor: 'border-l-blue-400', bg: 'bg-blue-50' },
];

const Dashboard = () => {
  const { user } = useAuth();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const firstName = user?.name?.split(' ')[0] || 'Farmer';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Greeting */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{greeting}, {firstName} 👋</h1>
            <p className="text-sm text-muted-foreground">{dateStr}</p>
          </div>
          <span className="inline-flex items-center rounded-pill bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 self-start">
            🌾 Rice Season Active
          </span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Sun, iconBg: 'bg-amber-100', iconColor: 'text-amber-500', label: "Today's Weather", value: "28°C", sub: `Partly Cloudy · ${user?.district || 'Mysuru'}` },
            { icon: Leaf, iconBg: 'bg-green-100', iconColor: 'text-primary', label: "Active Crop", value: "Rice", sub: "Kharif Season · 2.5 acres" },
            { icon: Calendar, iconBg: 'bg-blue-100', iconColor: 'text-blue-500', label: "Days to Harvest", value: "42 days", sub: "Est. harvest: 15 May" },
            { icon: BarChart3, iconBg: 'bg-purple-100', iconColor: 'text-purple-500', label: "Last Prediction", value: "2,400 kg/ac", sub: "₹38,500 projected profit" },
          ].map((stat, i) => (
            <div key={i} className="rounded-card bg-card shadow-card p-5 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 rounded-full ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-[60%_40%] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Chart */}
            <div className="rounded-card bg-card shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">Yield Forecast Trend</h2>
                <span className="rounded-pill bg-secondary px-3 py-1 text-xs text-muted-foreground">Last 6 Months</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={yieldData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 96%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(218, 11%, 65%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(218, 11%, 65%)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="yield" stroke="hsl(142, 71%, 45%)" strokeWidth={2.5} dot={{ fill: 'white', stroke: 'hsl(142, 71%, 45%)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* History table */}
            <div className="rounded-card bg-card shadow-card overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-4">
                <h2 className="text-base font-semibold">Recent Predictions</h2>
                <span className="text-sm text-green-600 font-medium cursor-pointer hover:text-green-700">View All</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left px-6 py-2.5 text-xs font-medium uppercase text-muted-foreground">Date</th>
                    <th className="text-left px-6 py-2.5 text-xs font-medium uppercase text-muted-foreground">Crop</th>
                    <th className="text-left px-6 py-2.5 text-xs font-medium uppercase text-muted-foreground">Yield</th>
                    <th className="text-left px-6 py-2.5 text-xs font-medium uppercase text-muted-foreground hidden sm:table-cell">Profit</th>
                    <th className="text-left px-6 py-2.5 text-xs font-medium uppercase text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, i) => (
                    <tr key={i} className="border-t border-border hover:bg-green-50 transition-colors">
                      <td className="px-6 py-3 text-gray-600">{p.date}</td>
                      <td className="px-6 py-3 font-medium">{p.crop}</td>
                      <td className="px-6 py-3 text-gray-600">{p.yield}</td>
                      <td className="px-6 py-3 text-gray-600 hidden sm:table-cell">{p.profit}</td>
                      <td className="px-6 py-3">
                        <span className="rounded-pill bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">✓ {p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Weather week */}
            <div className="rounded-card bg-card shadow-card p-6">
              <h2 className="text-base font-semibold mb-4">Weather This Week</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                {weekWeather.map((w, i) => (
                  <div key={i} className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-button min-w-[56px] snap-start ${w.today ? 'bg-primary text-primary-foreground' : 'bg-secondary text-gray-600'}`}>
                    <span className="text-xs font-medium">{w.day}</span>
                    <span className="text-lg">{w.icon}</span>
                    <span className="text-xs font-semibold">{w.temp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-card bg-card shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">Active Alerts</h2>
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground font-bold">2</span>
              </div>
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div key={i} className={`rounded-button border-l-[3px] ${a.borderColor} ${a.bg} p-3`}>
                    <p className="text-sm font-medium">{a.icon} {a.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{a.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-card bg-card shadow-card p-6">
              <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: BarChart3, label: "New Yield Prediction", to: "/predict" },
                  { icon: Search, label: "Scan a Leaf", to: "/disease" },
                  { icon: BellIcon, label: "Set SMS Alert", to: null },
                  { icon: BookOpen, label: "Crop Guide", to: null },
                ].map((action, i) => (
                  action.to ? (
                    <Link key={i} to={action.to} className="flex items-center gap-3 rounded-button border border-green-200 p-4 hover:bg-green-50 transition-colors group">
                      <action.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-gray-600 flex-1">{action.label}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ) : (
                    <button key={i} onClick={() => toast.info('Coming soon!')} className="flex items-center gap-3 rounded-button border border-green-200 p-4 hover:bg-green-50 transition-colors group text-left">
                      <action.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-gray-600 flex-1">{action.label}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
