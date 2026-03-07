import React from 'react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: createPageUrl('AdminDashboard'), icon: LayoutDashboard },
    { name: 'Leads', href: createPageUrl('LeadsDashboard'), icon: Users },
    { name: 'AI Assistant', href: createPageUrl('AdaSalesAssistant'), icon: Bot },
    { name: 'Blog Manager', href: createPageUrl('AdminBlog'), icon: FileText },
    { name: 'Social Accounts', href: createPageUrl('SocialAccounts'), icon: Share2 },
    { name: 'Chatbots', href: createPageUrl('ChatbotManagement'), icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path || location.pathname === path + '.html';

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-700">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NT</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">New Tech</div>
              <div className="text-slate-400 text-xs">Admin Panel</div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                          isActive(item.href)
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  to={createPageUrl('Home')}
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-6 w-6 shrink-0" />
                  View Public Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-slate-900 px-4 py-4 shadow-sm lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-slate-400 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">NT</span>
          </div>
          <span className="text-white font-semibold">Admin Panel</span>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NT</span>
              </div>
              <span className="text-white font-semibold">Admin Panel</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-md p-3 text-sm font-semibold ${
                      isActive(item.href)
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-slate-700">
                <Link
                  to={createPageUrl('Home')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-md p-3 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  View Public Site
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-md p-3 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}