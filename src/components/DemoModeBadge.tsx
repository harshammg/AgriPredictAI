import { useAuth } from '@/context/AuthContext';

const DemoModeBadge = () => {
  const { isDemoMode } = useAuth();
  if (!isDemoMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-pill bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg backdrop-blur-sm">
      Demo Mode
    </div>
  );
};

export default DemoModeBadge;
