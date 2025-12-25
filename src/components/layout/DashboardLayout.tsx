import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/auth.types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Clock,
  UserPlus,
  Settings,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const lecturerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/lecturer/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'My Courses', href: '/lecturer/courses', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'Classes', href: '/lecturer/classes', icon: <Calendar className="h-5 w-5" /> },
  { label: 'Enrollments', href: '/lecturer/enrollments', icon: <UserPlus className="h-5 w-5" /> },
  { label: 'Availability', href: '/lecturer/availability', icon: <Clock className="h-5 w-5" /> },
  { label: 'Register Student', href: '/lecturer/register-student', icon: <UserPlus className="h-5 w-5" /> },
  { label: 'Direct Enrollment', href: '/lecturer/direct-enrollment', icon: <UserCheck className="h-5 w-5" /> },
  { label: 'Profile', href: '/lecturer/profile', icon: <User className="h-5 w-5" /> },
];

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Browse Courses', href: '/student/courses', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'My Enrollments', href: '/student/enrollments', icon: <UserPlus className="h-5 w-5" /> },
  { label: 'My Classes', href: '/student/classes', icon: <Calendar className="h-5 w-5" /> },
  { label: 'Study Groups', href: '/student/groups', icon: <Users className="h-5 w-5" /> },
  { label: 'Profile', href: '/student/profile', icon: <User className="h-5 w-5" /> },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { label: 'Courses', href: '/admin/courses', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'Enrollments', href: '/admin/enrollments', icon: <UserPlus className="h-5 w-5" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case UserRole.LECTURER:
        return lecturerNavItems;
      case UserRole.STUDENT:
        return studentNavItems;
      case UserRole.ADMIN:
        return adminNavItems;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case UserRole.LECTURER:
        return 'Lecturer';
      case UserRole.STUDENT:
        return 'Student';
      case UserRole.ADMIN:
        return 'Administrator';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logowithname.png" alt="GradClass" className="h-10" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      location.pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
