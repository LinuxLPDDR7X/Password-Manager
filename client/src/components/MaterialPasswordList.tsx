import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Password } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface MaterialPasswordListProps {
  passwords: Password[];
  isLoading: boolean;
}

export function MaterialPasswordList({ passwords, isLoading }: MaterialPasswordListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const deletePasswordMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/passwords/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/passwords'] });
      toast({
        title: "Password deleted",
        description: "Password has been successfully removed."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting password",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied to clipboard!",
        description: `${field} has been copied.`
      });
      
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id: number, serviceName: string) => {
    if (window.confirm(`Are you sure you want to delete the password for ${serviceName}?`)) {
      deletePasswordMutation.mutate(id);
    }
  };

  const getServiceIcon = (serviceName: string, accountType: string) => {
    if (accountType && accountType !== 'custom') {
      return accountType.charAt(0).toUpperCase();
    }
    return serviceName.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8" style={{ boxShadow: 'var(--material-shadow-sm)' }}>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Loading passwords...</span>
        </div>
      </div>
    );
  }

  if (passwords.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center" style={{ boxShadow: 'var(--material-shadow-sm)' }}>
        <span className="material-icons text-gray-400" style={{ fontSize: '4rem' }}>lock_open</span>
        <h3 className="text-xl font-medium text-gray-900 mt-4 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>No passwords saved yet</h3>
        <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Add your first password to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl" style={{ boxShadow: 'var(--material-shadow-sm)' }}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Saved Passwords
        </h2>
        <div className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <span style={{ fontWeight: 500 }}>{passwords.length}</span> passwords
        </div>
      </div>

      {/* Password List */}
      <div className="p-6 space-y-4">
        {passwords.map((password) => (
          <div
            key={password.id}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            style={{ fontFamily: 'Roboto, sans-serif' }}
            data-testid={`password-item-${password.id}`}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg flex-shrink-0"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              {getServiceIcon(password.serviceName, password.accountType || 'custom')}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-lg">
                {password.serviceName}
              </div>
              <div className="text-gray-600 text-sm">
                {password.username}
              </div>
              {password.url && (
                <div className="mt-1">
                  <a
                    href={password.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {password.url}
                  </a>
                </div>
              )}
              {password.notes && (
                <div className="text-gray-500 text-sm mt-1">
                  {password.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Copy Username */}
              <button
                onClick={() => copyToClipboard(password.username, 'Username')}
                className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                title="Copy Username"
                data-testid={`button-copy-username-${password.id}`}
              >
                <span 
                  className="material-icons text-gray-600" 
                  style={{ fontSize: '20px', color: copiedField === 'Username' ? 'var(--primary-color)' : '' }}
                >
                  person
                </span>
              </button>

              {/* Copy Password */}
              <button
                onClick={() => copyToClipboard(password.password, 'Password')}
                className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                title="Copy Password"
                data-testid={`button-copy-password-${password.id}`}
              >
                <span 
                  className="material-icons text-gray-600" 
                  style={{ fontSize: '20px', color: copiedField === 'Password' ? 'var(--primary-color)' : '' }}
                >
                  content_copy
                </span>
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(password.id, password.serviceName)}
                className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-50 transition-colors duration-200"
                title="Delete Password"
                data-testid={`button-delete-${password.id}`}
              >
                <span className="material-icons text-red-600" style={{ fontSize: '20px' }}>
                  delete
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}