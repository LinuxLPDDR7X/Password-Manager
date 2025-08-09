import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import PasswordItem from "@/components/password-item";
import AddPasswordModal from "@/components/add-password-modal";
import { signOut } from "@/lib/auth";
import { useLocation } from "wouter";
import type { Password } from "@shared/schema";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [demoUser, setDemoUser] = useState(null);
  const [, navigate] = useLocation();

  // Check for demo user in localStorage
  useEffect(() => {
    const demoUserData = localStorage.getItem('demo_user');
    if (demoUserData) {
      setDemoUser(JSON.parse(demoUserData));
    }
  }, []);

  const { data: authData, error: authError } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !demoUser, // Only fetch if not demo user
  });

  const { data: passwords = [], isLoading } = useQuery<Password[]>({
    queryKey: ['/api/passwords'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !demoUser, // Only fetch if not demo user
  });

  // Demo password data for testing
  const demoPasswords = demoUser ? [
    {
      id: '1',
      title: 'Gmail',
      username: 'demo@example.com',
      encryptedPassword: '••••••••',
      website: 'https://gmail.com',
      icon: null,
      isFavorite: true,
      isShared: false,
      strength: 'strong' as const,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '2',
      title: 'Banking',
      username: 'demo_user',
      encryptedPassword: '••••••••',
      website: 'https://bank.example.com',
      icon: null,
      isFavorite: true,
      isShared: false,
      strength: 'strong' as const,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    },
    {
      id: '3',
      title: 'Social Media',
      username: 'demo_user123',
      encryptedPassword: '••••••••',
      website: 'https://social.example.com',
      icon: null,
      isFavorite: false,
      isShared: true,
      strength: 'medium' as const,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user'
    }
  ] : [];

  const user = demoUser || (authData as any)?.user;
  const displayPasswords = demoUser ? demoPasswords : passwords;

  const filteredPasswords = displayPasswords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (selectedCategory) {
      case 'favorites':
        return password.isFavorite;
      case 'shared':
        return password.isShared;
      case 'weak':
        return password.strength === 'weak';
      default:
        return true;
    }
  });

  const getCategoryCount = (category: string) => {
    switch (category) {
      case 'all':
        return displayPasswords.length;
      case 'favorites':
        return displayPasswords.filter(p => p.isFavorite).length;
      case 'shared':
        return displayPasswords.filter(p => p.isShared).length;
      case 'weak':
        return displayPasswords.filter(p => p.strength === 'weak').length;
      default:
        return 0;
    }
  };

  const handleSignOut = async () => {
    if (demoUser) {
      localStorage.removeItem('demo_user');
      navigate('/');
    } else {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Material Design Header */}
      <header className="sticky top-0 z-50" style={{ 
        backgroundColor: 'var(--primary-color)', 
        boxShadow: 'var(--material-shadow-md)' 
      }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-icons text-white" style={{ fontSize: '2rem' }}>lock</span>
            <h1 className="text-2xl font-medium text-white" style={{ fontFamily: 'Roboto, sans-serif' }} data-testid="nav-title">Password Manager</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {user?.picture && (
              <img 
                src={user.picture} 
                alt="User Profile" 
                className="w-8 h-8 rounded-full"
                data-testid="img-user-avatar"
              />
            )}
            <span className="text-sm font-medium text-white opacity-90" data-testid="text-username">{user?.name || 'Demo User'}</span>
            <button 
              className="rounded-full w-12 h-12 flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
              onClick={handleSignOut}
              data-testid="button-signout"
              title="Sign out"
            >
              <span className="material-icons text-white">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6" style={{ marginTop: '2rem' }}>
        {/* Add Password Section */}
        <section className="mb-8">
          <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--material-shadow-sm)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Add New Password</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 text-white rounded-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  boxShadow: 'var(--material-shadow-sm)',
                  fontFamily: 'Roboto, sans-serif'
                }}
                data-testid="button-add-password"
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>add</span>
                Add Password
              </button>
            </div>
          </div>
        </section>

        {/* Password List Section */}
        <section>
          <MaterialPasswordList passwords={displayPasswords} isLoading={passwordsQuery.isLoading} />
                </div>
              </div>

              {/* Password Items */}
              <div className="divide-y divide-gray-100">
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading passwords...</p>
                  </div>
                ) : filteredPasswords.length === 0 ? (
                  <div className="p-6 text-center" data-testid="empty-passwords">
                    <i className="fas fa-key text-gray-400 text-3xl mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No passwords found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery || selectedCategory !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by adding your first password.'
                      }
                    </p>
                    {!searchQuery && selectedCategory === 'all' && (
                      <button 
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setIsAddModalOpen(true)}
                        data-testid="button-add-first-password"
                      >
                        Add Your First Password
                      </button>
                    )}
                  </div>
                ) : (
                  filteredPasswords.map((password) => (
                    <PasswordItem key={password.id} password={password} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Password Modal */}
      <AddPasswordModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
