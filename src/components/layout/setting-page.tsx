"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Bell,
  Moon,
  Sun,
  Shield,
  CreditCard,
  LogOut,
  Trash2,
  Mail,
  FileText,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Label } from "@/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Switch } from "@/ui/switch";
import { Separator } from "@/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/alert-dialog";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/hook/use-auth";
import { fadeIn } from "../layout/animation";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "@/ui/toast";
import { ChangePasswordModal } from "../auth/change-password";

export default function SettingsPage() {
  const { user } = useAuth();
  //   const router = useRouter()
  const navigation = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const { toast, toasts, dismiss } = useToast();

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    newMessage: true,
    newCourse: true,
    remindersBefore24h: true,
    remindersBefore1h: true,
    systemUpdates: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showOnlineStatus: true,
    showLastSeen: true,
    allowContactByEmail: true,
    allowContactByPhone: false,
  });

  // Role-specific settings
  const [tutorSettings, setTutorSettings] = useState({
    autoAcceptBookings: false,
    displayRating: true,
    displayReviews: true,
    availableForNewStudents: true,
  });

  const [studentSettings, setStudentSettings] = useState({
    shareProgressWithTutors: true,
    receiveRecommendations: true,
    allowTutorsToContact: true,
  });

  const [adminSettings, setAdminSettings] = useState({
    enableSystemNotifications: true,
    enableSystemMaintenance: false,
    enableBetaFeatures: false,
  });

  // Check if dark mode is enabled on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }

    toast({
      title: newDarkMode ? "Dark mode enabled" : "Light mode enabled",
      description: "Your preference has been saved.",
    });
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
      variant: "success",
    });

    setIsSaving(false);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    });

    setIsDeleteDialogOpen(false);
    // In a real app, you would redirect to the login page or home page
    // router.push("/");
    navigation("/");
  };

  // Handle logout
  const handleLogout = () => {
    // In a real app, you would clear the auth state
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });

    setIsLogoutDialogOpen(false);
    // router.push("/login");
    navigation("/login");
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <Tabs
        defaultValue="account"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Sun className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          {user?.role === "Tutor" && (
            <TabsTrigger
              value="tutor"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Tutor Settings
            </TabsTrigger>
          )}
          {user?.role === "Student" && (
            <TabsTrigger
              value="student"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Student Settings
            </TabsTrigger>
          )}
          {user?.role === "Admin" && (
            <TabsTrigger
              value="admin"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Admin Settings
            </TabsTrigger>
          )}
        </TabsList>

        <div className="grid gap-8 bg-white dark:bg-gray-800">
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                >
                  Update Password
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-red-200 dark:border-red-900 rounded-lg">
                  <div>
                    <h4 className="font-medium">Log out from all devices</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This will log you out from all devices except this one
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 md:mt-0 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => setIsLogoutDialogOpen(true)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out from all devices
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-red-200 dark:border-red-900 rounded-lg">
                  <div>
                    <h4 className="font-medium">Delete account</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete your account and all of your content
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    className="mt-2 md:mt-0"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    {isDarkMode ? (
                      <Moon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Sun className="h-5 w-5 mr-2 text-amber-500" />
                    )}
                    <div>
                      <h4 className="font-medium">
                        {isDarkMode ? "Dark" : "Light"} Mode
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isDarkMode
                          ? "Use dark mode to reduce eye strain in low light environments"
                          : "Use light mode for a bright, clean interface"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      !isDarkMode
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => isDarkMode && toggleDarkMode()}
                  >
                    <div className="bg-white rounded-md p-4 shadow-sm mb-3">
                      <div className="h-2 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="font-medium">Light</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isDarkMode
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => !isDarkMode && toggleDarkMode()}
                  >
                    <div className="bg-gray-800 rounded-md p-4 shadow-sm mb-3">
                      <div className="h-2 w-20 bg-gray-700 rounded mb-2"></div>
                      <div className="h-2 w-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2 text-indigo-400" />
                      <span className="font-medium">Dark</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter> */}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>
                  Customize accessibility settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reduce animations</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Minimize motion for those with vestibular disorders
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">High contrast mode</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications on your device
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          pushNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive promotional emails and newsletters
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked: any) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          marketingEmails: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Messages</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        When you receive a new message
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newMessage}
                      onCheckedChange={(checked: any) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          newMessage: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Course</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        When a new course is available
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newCourse}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          newCourse: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Lesson Reminders</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Reminders before scheduled lessons
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings.remindersBefore24h}
                          onCheckedChange={(checked) =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              remindersBefore24h: checked,
                            }))
                          }
                        />
                        <span className="text-sm">24 hours before</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings.remindersBefore1h}
                          onCheckedChange={(checked) =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              remindersBefore1h: checked,
                            }))
                          }
                        />
                        <span className="text-sm">1 hour before</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">System Updates</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Important system updates and announcements
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked: any) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          systemUpdates: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your privacy and how your information is shared
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Visibility</h3>

                  <RadioGroup
                    value={privacySettings.profileVisibility}
                    onValueChange={(value: any) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        profileVisibility: value,
                      }))
                    }
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <div>
                        <Label htmlFor="public" className="font-medium">
                          Public
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your profile is visible to everyone
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="contacts" id="contacts" />
                      <div>
                        <Label htmlFor="contacts" className="font-medium">
                          Contacts Only
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your profile is only visible to your contacts
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <div>
                        <Label htmlFor="private" className="font-medium">
                          Private
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your profile is only visible to you
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Online Status</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Online Status</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let others see when you're online
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showOnlineStatus}
                      onCheckedChange={(checked: any) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          showOnlineStatus: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Last Seen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let others see when you were last active
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showLastSeen}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          showLastSeen: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Permissions</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow Contact by Email</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow others to contact you via email
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.allowContactByEmail}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          allowContactByEmail: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow Contact by Phone</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow others to contact you via phone
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.allowContactByPhone}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          allowContactByPhone: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Cookies</CardTitle>
                <CardDescription>
                  Manage your data and cookie preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Essential Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Required for the website to function properly
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Help us improve our website by collecting anonymous usage
                      data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Used to track you across websites for marketing purposes
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="mt-6">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutor Settings */}
          {user?.role === "Tutor" && (
            <TabsContent value="tutor" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tutor Settings</CardTitle>
                  <CardDescription>
                    Manage your tutor-specific settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-Accept Bookings</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatically accept booking requests from students
                      </p>
                    </div>
                    <Switch
                      checked={tutorSettings.autoAcceptBookings}
                      onCheckedChange={(checked) =>
                        setTutorSettings((prev) => ({
                          ...prev,
                          autoAcceptBookings: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Display Rating</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show your rating on your profile
                      </p>
                    </div>
                    <Switch
                      checked={tutorSettings.displayRating}
                      onCheckedChange={(checked) =>
                        setTutorSettings((prev) => ({
                          ...prev,
                          displayRating: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Display Reviews</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show student reviews on your profile
                      </p>
                    </div>
                    <Switch
                      checked={tutorSettings.displayReviews}
                      onCheckedChange={(checked) =>
                        setTutorSettings((prev) => ({
                          ...prev,
                          displayReviews: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        Available for New Students
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show as available for new students
                      </p>
                    </div>
                    <Switch
                      checked={tutorSettings.availableForNewStudents}
                      onCheckedChange={(checked) =>
                        setTutorSettings((prev) => ({
                          ...prev,
                          availableForNewStudents: checked,
                        }))
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contracts Manage</CardTitle>
                  <CardDescription>Manage your contracts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-medium">Contracts History</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          View your contracts history
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigation("/contracts")}
                      variant="outline"
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Student Settings */}
          {user?.role === "Student" && (
            <TabsContent value="student" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Student Settings</CardTitle>
                  <CardDescription>
                    Manage your student-specific settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        Share Progress with Tutors
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow tutors to see your progress in courses
                      </p>
                    </div>
                    <Switch
                      checked={studentSettings.shareProgressWithTutors}
                      onCheckedChange={(checked) =>
                        setStudentSettings((prev) => ({
                          ...prev,
                          shareProgressWithTutors: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Receive Recommendations</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive course and tutor recommendations based on your
                        interests
                      </p>
                    </div>
                    <Switch
                      checked={studentSettings.receiveRecommendations}
                      onCheckedChange={(checked) =>
                        setStudentSettings((prev) => ({
                          ...prev,
                          receiveRecommendations: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow Tutors to Contact</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow tutors to contact you directly
                      </p>
                    </div>
                    <Switch
                      checked={studentSettings.allowTutorsToContact}
                      onCheckedChange={(checked) =>
                        setStudentSettings((prev) => ({
                          ...prev,
                          allowTutorsToContact: checked,
                        }))
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Contracts Manage</CardTitle>
                  <CardDescription>Manage your contracts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-medium">Contracts History</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          View your contracts history
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigation("/contracts")}
                      variant="outline"
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-medium">Payment Methods</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Manage your payment methods
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-medium">Billing History</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          View your billing history
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">View</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Admin Settings */}
          {user?.role === "Admin" && (
            <TabsContent value="admin" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>Manage system-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">System Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enable system-wide notifications
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.enableSystemNotifications}
                      onCheckedChange={(checked) =>
                        setAdminSettings((prev) => ({
                          ...prev,
                          enableSystemNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Put the system in maintenance mode
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.enableSystemMaintenance}
                      onCheckedChange={(checked) =>
                        setAdminSettings((prev) => ({
                          ...prev,
                          enableSystemMaintenance: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Beta Features</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enable beta features for all users
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.enableBetaFeatures}
                      onCheckedChange={(checked) =>
                        setAdminSettings((prev) => ({
                          ...prev,
                          enableBetaFeatures: checked,
                        }))
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Management</CardTitle>
                  <CardDescription>
                    Manage system-wide settings and operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2">User Management</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Manage users, roles, and permissions
                      </p>
                      <Button variant="outline">Manage Users</Button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2">Course Management</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Manage courses and categories
                      </p>
                      <Button variant="outline">Manage Courses</Button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2">Payment Management</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Manage payment settings and transactions
                      </p>
                      <Button variant="outline">Manage Payments</Button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2">System Logs</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        View system logs and activity
                      </p>
                      <Button variant="outline">View Logs</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* Delete Account Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600/90 dark:hover:bg-red-700/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AnimatePresence>
        {isChangePasswordModalOpen && (
          <ChangePasswordModal
            onClose={() => setIsChangePasswordModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
      {/* Logout Dialog */}
      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out from all devices</AlertDialogTitle>
            <AlertDialogDescription>
              This will log you out from all devices except this one. You'll
              need to log in again on those devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
