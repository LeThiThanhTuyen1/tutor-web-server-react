"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  School,
  Shield,
  Edit,
  Key,
} from "lucide-react";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "@/services/authService";
import { updateUser } from "@/store/authSlice";
import { useToast } from "@/hook/use-toast";
import { ToastContainer } from "@/ui/toast";
import { API_BASE_URL } from "@/config/axiosInstance";
import { EditProfileModal } from "./edit-profile";
import { ChangePasswordModal } from "./change-password";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { toast, toasts, dismiss } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for profile data
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modal visibility
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError("Failed to load profile data. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = useCallback(
    async (updatedProfile: Partial<any>) => {
      try {
        const profileToUpdate = {
          ...updatedProfile,
          id: profile?.id,
        };

        const result = await updateProfile(profileToUpdate);

        if (result.succeeded) {
          toast({
            title: "Success",
            description:
              result.message.message || "Profile updated successfully",
            variant: "success",
          });

          // update state of profile
          const newProfile = { ...profile, ...updatedProfile };
          setProfile(newProfile);

          if (profile != null) {
            const userForRedux: any = {
              id: profile.id.toString(),
              name: updatedProfile.name || profile.name,
              email: updatedProfile.email || profile.email,
              role: profile.role as "Student" | "Tutor" | "Admin",
              token: profile.token || "",
              gender: updatedProfile.gender || profile.gender,
              dateOfBirth: updatedProfile.dateOfBirth
                ? updatedProfile.dateOfBirth
                : profile.dateOfBirth?.toString(),
              school: updatedProfile.school || profile.school || "",
              location: updatedProfile.location || profile.location || "",
              image: profile.image,
              tutorInfo: updatedProfile.tutorInfo || profile.tutorInfo || null,
              phone: updatedProfile.phone || profile.phone,
            };
            dispatch(updateUser(userForRedux));
          }

          setIsEditProfileModalOpen(false);
        } else {
          toast({
            title: "Error",
            description:
              result.message?.join(", ") ||
              result.message ||
              "Failed to update profile",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    },
    [dispatch, profile, toast]
  );

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadProfileImage(file);

      if (result.succeeded) {
        toast({
          title: "Success",
          description: "Profile image uploaded successfully",
          variant: "success",
        });

        // Update profile in state
        if (profile) {
          const updatedProfile = {
            ...profile,
            image: result.profileImage,
          };
          setProfile(updatedProfile);

          const userForRedux: any = {
            id: profile.id.toString(),
            name: profile.name,
            email: profile.email,
            role: profile.role as "Student" | "Tutor" | "Admin",
            token: profile.token || "",
            gender: profile.gender,
            dateOfBirth: profile.dateOfBirth?.toString() || "",
            school: profile.school || "",
            location: profile.location || "",
            image: result.profileImage,
            tutorInfo: profile.tutorInfo || null,
            phone: profile.phone,
          };

          dispatch(updateUser(userForRedux));
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to upload profile image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-lg"></div>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400 relative" />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading your profile...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p>{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-gray-900 dark:text-white"
        >
          My Profile
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-24 relative">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div
                    className="relative"
                    onMouseEnter={() => setImageHover(true)}
                    onMouseLeave={() => setImageHover(false)}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: imageHover ? 1.05 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="h-32 w-32 rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={handleImageClick}
                    >
                      {profile?.image ? (
                        <img
                          key={profile.image}
                          src={
                            profile?.image
                              ? `${API_BASE_URL}/${
                                  profile.image
                                }?t=${new Date().getTime()}`
                              : "/placeholder.svg"
                          }
                          alt="Profile"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-16 w-16 text-gray-400" />
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}

                      <AnimatePresence>
                        {imageHover && !isUploading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full"
                          >
                            <Camera className="h-8 w-8 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile?.name}
                </h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {profile?.email}
                </p>
                <div className="inline-block px-3 py-1 mt-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium capitalize">
                  {profile?.role}
                </div>

                <div className="mt-6 space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsChangePasswordModalOpen(true)}
                    className="w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    <Key className="h-4 w-4" />
                    Change Password
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Full Name
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {profile?.name || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {profile?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Phone
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {profile?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Location
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {profile?.location || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date of Birth
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {profile?.dateOfBirth
                          ? new Date(profile.dateOfBirth).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Gender
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {profile?.gender || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <School className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        School
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {profile?.school || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {profile?.tutorInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                      Tutor Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                          Experience
                        </h4>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profile.tutorInfo.experience
                            ? `${profile.tutorInfo.experience} years`
                            : "Not provided"}
                        </p>
                      </div>

                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                          Subjects
                        </h4>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profile.tutorInfo.subjects || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        Introduction
                      </h4>
                      <p className="text-gray-900 dark:text-white">
                        {profile.tutorInfo.introduction || "Not provided"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditProfileModalOpen && (
          <EditProfileModal
            isOpen={isEditProfileModalOpen}
            onClose={() => setIsEditProfileModalOpen(false)}
            profile={profile}
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
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
    </div>
  );
}
