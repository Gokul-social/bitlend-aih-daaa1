import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { shortenWalletAddress } from '@/lib/utils';

const profileSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current password is required.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationSchema = z.object({
  loanUpdates: z.boolean(),
  marketplaceAlerts: z.boolean(),
  securityAlerts: z.boolean(),
  marketingEmails: z.boolean(),
});

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });
  
  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      loanUpdates: true,
      marketplaceAlerts: true,
      securityAlerts: true,
      marketingEmails: false,
    },
  });

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    setIsSubmitting(true);
    
    // Mock profile update
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  const onSecuritySubmit = (values: z.infer<typeof securitySchema>) => {
    setIsSubmitting(true);
    
    // Mock password update
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  const onNotificationSubmit = (values: z.infer<typeof notificationSchema>) => {
    setIsSubmitting(true);
    
    // Mock notification settings update
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#ffffff' }}>Settings</h1>
        <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-100">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="glass-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-medium">Username</FormLabel>
                          <FormControl>
                            <input className="w-full p-3 glass-input-dark rounded-md" placeholder="Your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-medium">Email</FormLabel>
                          <FormControl>
                            <input className="w-full p-3 glass-input-dark rounded-md" placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel className="text-gray-900 font-medium">Wallet Address</FormLabel>
                      <div className="flex items-center p-3 glass-card-subtle rounded-md">
                        <span className="text-sm text-white">{shortenWalletAddress(user?.walletAddress || "")}</span>
                      </div>
                      <FormDescription className="text-gray-600">
                        Your connected wallet address
                      </FormDescription>
                    </div>
                    
                    <Button type="submit" className="glass-button-primary" disabled={isSubmitting}>
                      <span className="text-white font-semibold">{isSubmitting ? "Saving..." : "Save Changes"}</span>
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="glass-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Security Settings</CardTitle>
                <CardDescription>
                  Manage your account password and security options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium">Current Password</FormLabel>
                          <FormControl>
                            <input type="password" className="glass-input w-full" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium">New Password</FormLabel>
                          <FormControl>
                            <input type="password" className="glass-input w-full" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormDescription className="text-white/60">
                            Password must be at least 6 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium">Confirm New Password</FormLabel>
                          <FormControl>
                            <input type="password" className="glass-input w-full" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <button type="submit" className="glass-button" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="glass-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Notification Preferences</CardTitle>
                <CardDescription>
                  Customize how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <FormField
                      control={notificationForm.control}
                      name="loanUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between glass rounded-lg p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white font-medium text-base">Loan Updates</FormLabel>
                            <FormDescription className="text-white/60">
                              Receive notifications about your active loans
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="marketplaceAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between glass rounded-lg p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white font-medium text-base">Marketplace Alerts</FormLabel>
                            <FormDescription className="text-white/60">
                              Get notified about new matching loan opportunities
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="securityAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between glass rounded-lg p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white font-medium text-base">Security Alerts</FormLabel>
                            <FormDescription className="text-white/60">
                              Critical security notifications about your account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between glass rounded-lg p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white font-medium text-base">Marketing Emails</FormLabel>
                            <FormDescription className="text-white/60">
                              Receive news, updates and offers about BitLend
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <button type="submit" className="glass-button" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Preferences"}
                    </button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      </div>
    </div>
  );
}