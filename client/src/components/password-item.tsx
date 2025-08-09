import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard, decryptPassword, getStrengthColor, getStrengthBgColor } from "@/lib/crypto";
import { apiRequest } from "@/lib/queryClient";
import type { Password } from "@shared/schema";

interface PasswordItemProps {
  password: Password;
}

export default function PasswordItem({ password }: PasswordItemProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updatePasswordMutation = useMutation({
    mutationFn: async (updates: Partial<Password>) => {
      const res = await apiRequest('PATCH', `/api/passwords/${password.id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/passwords'] });
    },
  });

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updatePasswordMutation.mutateAsync({ isFavorite: !password.isFavorite });
      toast({
        title: password.isFavorite ? "Removed from favorites" : "Added to favorites",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleCopyPassword = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const decrypted = await decryptPassword(password.encryptedPassword);
      const success = await copyToClipboard(decrypted);
      
      if (success) {
        toast({
          title: "Password copied",
          description: "Password has been copied to clipboard",
          duration: 2000,
        });
        
        // Update last used timestamp
        updatePasswordMutation.mutate({ lastUsed: new Date() });
      } else {
        throw new Error("Failed to copy");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      });
    }
  };

  const getServiceIcon = (title: string, website?: string) => {
    const serviceName = title.toLowerCase();
    const domain = website?.toLowerCase();
    
    if (serviceName.includes('gmail') || domain?.includes('gmail')) {
      return 'fab fa-google text-blue-600';
    } else if (serviceName.includes('facebook') || domain?.includes('facebook')) {
      return 'fab fa-facebook text-blue-600';
    } else if (serviceName.includes('spotify') || domain?.includes('spotify')) {
      return 'fab fa-spotify text-green-600';
    } else if (serviceName.includes('twitter') || domain?.includes('twitter')) {
      return 'fab fa-twitter text-blue-400';
    } else if (serviceName.includes('github') || domain?.includes('github')) {
      return 'fab fa-github text-gray-900';
    } else if (serviceName.includes('netflix') || domain?.includes('netflix')) {
      return 'fab fa-netflix text-red-600';
    } else {
      return 'fas fa-globe text-gray-600';
    }
  };

  const formatLastUsed = (lastUsed?: Date | string) => {
    if (!lastUsed) return 'Never used';
    
    const date = new Date(lastUsed);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div 
      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={() => setIsRevealed(!isRevealed)}
      data-testid={`card-password-${password.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <i className={`${getServiceIcon(password.title, password.website || undefined)} text-xl`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900" data-testid={`text-title-${password.id}`}>
              {password.title}
            </h3>
            <p className="text-sm text-gray-500" data-testid={`text-username-${password.id}`}>
              {password.username}
            </p>
            <p className="text-xs text-gray-400" data-testid={`text-last-used-${password.id}`}>
              Last used: {formatLastUsed(password.lastUsed || undefined)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStrengthBgColor(password.strength || 'medium')}`}></div>
            <span className={`text-xs font-medium capitalize ${getStrengthColor(password.strength || 'medium')}`} data-testid={`text-strength-${password.id}`}>
              {password.strength || 'medium'}
            </span>
          </div>
          <button 
            className={`hover:text-yellow-600 transition-colors ${password.isFavorite ? 'text-warning' : 'text-gray-400'}`}
            onClick={handleToggleFavorite}
            disabled={updatePasswordMutation.isPending}
            data-testid={`button-favorite-${password.id}`}
          >
            <i className={password.isFavorite ? 'fas fa-star' : 'far fa-star'}></i>
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleCopyPassword}
            data-testid={`button-copy-${password.id}`}
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isRevealed && (
        <div className="mt-4 pt-4 border-t border-gray-100" data-testid={`details-password-${password.id}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
              <p className="text-sm text-gray-900" data-testid={`text-website-${password.id}`}>
                {password.website || 'Not specified'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-900" data-testid={`text-password-${password.id}`}>
                  {'•'.repeat(12)}
                </span>
                <button 
                  className="text-xs text-primary hover:text-blue-700"
                  onClick={handleCopyPassword}
                  data-testid={`button-copy-password-${password.id}`}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          
          {password.isShared && (
            <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
              <i className="fas fa-users"></i>
              <span>Shared with family</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
