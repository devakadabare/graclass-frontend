import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-xl shadow-lg border p-8">
          {/* Logo */}
          <div className="text-center mb-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl rounded-full animate-pulse group-hover:animate-none"></div>
                <img
                  src="/logowithname.png"
                  alt="GradClass"
                  className="h-32 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-2xl animate-in fade-in zoom-in duration-700"
                />
              </div>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
