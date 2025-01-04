import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  Briefcase, 
  Book, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart,
  Upload,
  Search,
  Award,
  Video
} from 'lucide-react';

const DashboardLayout = ({ role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getNavigationItems = () => {
    switch (role) {
      case 'student':
        return [
          { label: 'Dashboard', icon: Home, href: '/dashboard/student' },
          { label: 'Assessments', icon: Book, href: '/dashboard/student/assessments' },
          { label: 'Jobs', icon: Briefcase, href: '/dashboard/student/jobs' },
          { label: 'Skills', icon: Award, href: '/dashboard/student/skills' },
          { label: 'Interview Prep', icon: Video, href: '/dashboard/student/interview-prep' },
          { label: 'Profile', icon: Users, href: '/dashboard/student/profile' }
        ];
      
      case 'company':
        return [
          { label: 'Dashboard', icon: Home, href: '/dashboard/company' },
          { label: 'Candidates', icon: Search, href: '/dashboard/company/candidates' },
          { label: 'Job Posts', icon: Briefcase, href: '/dashboard/company/jobs' },
          { label: 'Interviews', icon: Video, href: '/dashboard/company/interviews' },
          { label: 'Analytics', icon: BarChart, href: '/dashboard/company/analytics' },
          { label: 'Profile', icon: Users, href: '/dashboard/company/profile' }
        ];
      
      case 'university':
        return [
          { label: 'Dashboard', icon: Home, href: '/dashboard/university' },
          { label: 'Students', icon: Users, href: '/dashboard/university/students' },
          { label: 'Batch Upload', icon: Upload, href: '/dashboard/university/upload' },
          { label: 'Placements', icon: Briefcase, href: '/dashboard/university/placements' },
          { label: 'Analytics', icon: BarChart, href: '/dashboard/university/analytics' },
          { label: 'Profile', icon: Users, href: '/dashboard/university/profile' }
        ];
      
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9F9E5] ">
      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 
        transition-transform duration-300 ease-in-out
        bg-[#D3EDDB] shadow-lg
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b bg-[#2C4C24]">
          <h1 className="text-xl font-bold text-white">Talent Bridge</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4  ">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center px-4 py-2 rounded-md
                      transition-colors duration-200
                      ${isActiveLink(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {/* Settings - Common for all roles */}
            <li>
              <Link
                to={`/dashboard/${role}/settings`}
                className={`
                  flex items-center px-4 py-2 rounded-md
                  transition-colors duration-200
                  ${isActiveLink(`/dashboard/${role}/settings`)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}
      `}>
        <div className="min-h-screen p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;