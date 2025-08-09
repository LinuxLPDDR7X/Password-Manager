interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddPassword: () => void;
  categoryCounts: {
    all: number;
    favorites: number;
    shared: number;
    weak: number;
  };
}

export default function Sidebar({ selectedCategory, onCategoryChange, onAddPassword, categoryCounts }: SidebarProps) {
  const categories = [
    { id: 'all', icon: 'fas fa-globe', label: 'All Items', count: categoryCounts.all },
    { id: 'favorites', icon: 'fas fa-star', label: 'Favorites', count: categoryCounts.favorites },
    { id: 'shared', icon: 'fas fa-users', label: 'Shared', count: categoryCounts.shared },
    { id: 'weak', icon: 'fas fa-exclamation-triangle', label: 'Weak', count: categoryCounts.weak, warning: true },
  ];

  // Mock family members data - in production, this would come from the API
  const familyMembers = [
    { id: '1', name: 'Sarah Smith', passwordCount: 12, picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
    { id: '2', name: 'Mike Smith', passwordCount: 8, picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="sidebar-main">
      <h2 className="text-lg font-semibold text-gray-900 mb-4" data-testid="text-categories">Categories</h2>
      
      {/* Add New Password Button */}
      <button 
        className="w-full bg-primary text-white rounded-lg py-3 px-4 mb-6 hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        onClick={onAddPassword}
        data-testid="button-add-password"
      >
        <i className="fas fa-plus text-sm"></i>
        <span className="font-medium">Add Password</span>
      </button>

      {/* Categories */}
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'bg-primary bg-opacity-10 text-primary font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onCategoryChange(category.id)}
            data-testid={`button-category-${category.id}`}
          >
            <div className="flex items-center gap-3">
              <i className={category.icon}></i>
              <span>{category.label}</span>
            </div>
            <span className={`text-sm ${
              selectedCategory === category.id 
                ? 'text-primary' 
                : category.warning 
                  ? 'text-warning' 
                  : 'text-gray-500'
            }`} data-testid={`text-count-${category.id}`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Family Members */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3" data-testid="text-family-members">Family Members</h3>
        <div className="space-y-2">
          {familyMembers.map((member) => (
            <div 
              key={member.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              data-testid={`card-family-member-${member.id}`}
            >
              <img 
                src={member.picture} 
                alt={member.name} 
                className="w-8 h-8 rounded-full"
                data-testid={`img-family-member-${member.id}`}
              />
              <div>
                <div className="text-sm font-medium text-gray-900" data-testid={`text-member-name-${member.id}`}>
                  {member.name}
                </div>
                <div className="text-xs text-gray-500" data-testid={`text-member-count-${member.id}`}>
                  {member.passwordCount} passwords
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
