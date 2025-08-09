import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertPasswordSchema, type InsertPassword } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface MaterialPasswordFormProps {
  onClose: () => void;
}

export function MaterialPasswordForm({ onClose }: MaterialPasswordFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPassword>({
    resolver: zodResolver(insertPasswordSchema),
    defaultValues: {
      serviceName: '',
      accountType: 'custom',
      username: '',
      password: '',
      url: '',
      notes: '',
    }
  });

  const createPasswordMutation = useMutation({
    mutationFn: (data: InsertPassword) => apiRequest('/api/passwords', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/passwords'] });
      toast({
        title: "Password saved successfully!",
        description: "Your password has been securely stored."
      });
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving password",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertPassword) => {
    createPasswordMutation.mutate(data);
  };

  const clearForm = () => {
    form.reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl w-full max-w-md" style={{ boxShadow: 'var(--material-shadow-lg)' }}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Add New Password</h2>
          <button
            onClick={onClose}
            className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="material-icons text-gray-600">close</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Service Name *
              </label>
              <input
                type="text"
                {...form.register('serviceName')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                style={{ 
                  minHeight: '56px',
                  fontFamily: 'Roboto, sans-serif'
                }}
                placeholder="e.g., Gmail, Facebook"
                data-testid="input-service-name"
              />
              {form.formState.errors.serviceName && (
                <p className="text-red-600 text-sm">{form.formState.errors.serviceName.message}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Account Type
              </label>
              <select
                {...form.register('accountType')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                style={{ 
                  minHeight: '56px',
                  fontFamily: 'Roboto, sans-serif'
                }}
                data-testid="select-account-type"
              >
                <option value="custom">Custom</option>
                <option value="google">Google</option>
                <option value="microsoft">Microsoft</option>
                <option value="facebook">Facebook</option>
                <option value="github">GitHub</option>
                <option value="netflix">Netflix</option>
                <option value="amazon">Amazon</option>
              </select>
            </div>

            {/* Username/Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Username/Email *
              </label>
              <input
                type="text"
                {...form.register('username')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                style={{ 
                  minHeight: '56px',
                  fontFamily: 'Roboto, sans-serif'
                }}
                placeholder="your.email@example.com"
                data-testid="input-username"
              />
              {form.formState.errors.username && (
                <p className="text-red-600 text-sm">{form.formState.errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Password *
              </label>
              <input
                type="password"
                {...form.register('password')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                style={{ 
                  minHeight: '56px',
                  fontFamily: 'Roboto, sans-serif'
                }}
                placeholder="Enter your password"
                data-testid="input-password"
              />
              {form.formState.errors.password && (
                <p className="text-red-600 text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Website URL
              </label>
              <input
                type="url"
                {...form.register('url')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                style={{ 
                  minHeight: '56px',
                  fontFamily: 'Roboto, sans-serif'
                }}
                placeholder="https://example.com"
                data-testid="input-url"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Notes
              </label>
              <input
                type="text"
                {...form.register('notes')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                style={{ 
                  minHeight: '56px',
                  fontFamily: 'Roboto, sans-serif'
                }}
                placeholder="Additional notes"
                data-testid="input-notes"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={clearForm}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                style={{ fontFamily: 'Roboto, sans-serif' }}
                data-testid="button-clear"
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>clear</span>
                Clear
              </button>
              <button
                type="submit"
                disabled={createPasswordMutation.isPending}
                className="px-6 py-3 text-white rounded-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  boxShadow: 'var(--material-shadow-sm)',
                  fontFamily: 'Roboto, sans-serif'
                }}
                data-testid="button-save"
              >
                {createPasswordMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-icons" style={{ fontSize: '20px' }}>save</span>
                )}
                {createPasswordMutation.isPending ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}