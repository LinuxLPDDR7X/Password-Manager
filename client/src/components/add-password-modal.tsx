import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPasswordSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generatePassword, getPasswordStrength, encryptPassword } from "@/lib/crypto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { z } from "zod";

type FormData = z.infer<typeof insertPasswordSchema>;

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPasswordModal({ isOpen, onClose }: AddPasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(insertPasswordSchema),
    defaultValues: {
      title: '',
      username: '',
      encryptedPassword: '',
      website: '',
      isFavorite: false,
      isShared: false,
      strength: 'medium',
    },
  });

  const createPasswordMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const encryptedPassword = await encryptPassword(data.encryptedPassword);
      const strength = getPasswordStrength(data.encryptedPassword);
      
      const res = await apiRequest('POST', '/api/passwords', {
        ...data,
        encryptedPassword,
        strength,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/passwords'] });
      toast({
        title: "Password added",
        description: "Your password has been saved securely",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: FormData) => {
    createPasswordMutation.mutate(data);
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(16);
    form.setValue('encryptedPassword', newPassword);
  };

  const watchedPassword = form.watch('encryptedPassword');
  const passwordStrength = watchedPassword ? getPasswordStrength(watchedPassword) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-add-password">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">Add New Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Website/Service</Label>
            <Input
              id="title"
              placeholder="e.g., Gmail, Facebook"
              {...form.register('title')}
              data-testid="input-title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-error mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="username">Username/Email</Label>
            <Input
              id="username"
              placeholder="your@email.com"
              {...form.register('username')}
              data-testid="input-username"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-error mt-1">{form.formState.errors.username.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website URL (optional)</Label>
            <Input
              id="website"
              placeholder="https://example.com"
              {...form.register('website')}
              data-testid="input-website"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...form.register('encryptedPassword')}
                data-testid="input-password"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 p-1"
                  onClick={handleGeneratePassword}
                  data-testid="button-generate-password"
                >
                  <i className="fas fa-sync text-sm"></i>
                </button>
              </div>
            </div>
            
            {passwordStrength && (
              <div className="mt-2 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  passwordStrength === 'weak' ? 'bg-error' :
                  passwordStrength === 'medium' ? 'bg-warning' : 'bg-success'
                }`}></div>
                <span className={`text-xs font-medium capitalize ${
                  passwordStrength === 'weak' ? 'text-error' :
                  passwordStrength === 'medium' ? 'text-warning' : 'text-success'
                }`} data-testid="text-password-strength">
                  {passwordStrength} password
                </span>
              </div>
            )}
            
            {form.formState.errors.encryptedPassword && (
              <p className="text-sm text-error mt-1">{form.formState.errors.encryptedPassword.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareWithFamily"
              checked={!!form.watch('isShared')}
              onCheckedChange={(checked) => form.setValue('isShared', !!checked)}
              data-testid="checkbox-share-family"
            />
            <Label htmlFor="shareWithFamily" className="text-sm">
              Share with family members
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createPasswordMutation.isPending}
              data-testid="button-save"
            >
              {createPasswordMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Password'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
