"use client";

import type React from "react";

import { Image, X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any | null;
  onSave: (updatedProfile: Partial<any>) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<Partial<any>>({
    name: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: new Date().toISOString(),
    school: "",
    gender: "",
    role: undefined,
    tutorInfo: null,
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString()
          : new Date().toISOString(),
        school: profile.school || "",
        gender: profile.gender || "",
        role: profile.role,
        image: profile.image,
        tutorInfo: profile.tutorInfo || null,
      });
    }
  }, [profile]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      if (name.startsWith("tutorInfo.")) {
        const tutorField = name.split(".")[1];
        setFormData((prev) => {
          // Create a new tutorInfo object with default empty strings for required fields
          const updatedTutorInfo: any = {
            experience: prev.tutorInfo?.experience || "",
            subjects: prev.tutorInfo?.subjects || "",
            introduction: prev.tutorInfo?.introduction || "",
          };

          // Update the specific field
          if (tutorField === "experience") updatedTutorInfo.experience = value;
          if (tutorField === "subjects") updatedTutorInfo.subjects = value;
          if (tutorField === "introduction")
            updatedTutorInfo.introduction = value;

          return {
            ...prev,
            tutorInfo: updatedTutorInfo,
          };
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(e.target.value).toISOString();
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: date,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSave(formData);
    },
    [formData, onSave]
  );

  const formatDate = useCallback((date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Image className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Edit Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-1"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <input
              hidden
              id="image"
              name="image"
              type="text"
              defaultValue={formData.image || ""}
            />
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium mb-1"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formatDate(formData.dateOfBirth)}
                onChange={handleDateChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Role
              </label>
              <input
                id="role"
                name="role"
                readOnly
                type="role"
                value={formData.role}
                disabled
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="school"
                className="block text-sm font-medium mb-1"
              >
                School
              </label>
              <input
                id="school"
                name="school"
                type="text"
                value={formData.school || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {profile?.role === "Tutor" && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-3">Tutor Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="tutorInfo.experience"
                    className="block text-sm font-medium mb-1"
                  >
                    Experience
                  </label>
                  <input
                    id="tutorInfo.experience"
                    name="tutorInfo.experience"
                    type="number"
                    value={formData.tutorInfo?.experience || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tutorInfo.subjects"
                    className="block text-sm font-medium mb-1"
                  >
                    Subjects
                  </label>
                  <input
                    id="tutorInfo.subjects"
                    name="tutorInfo.subjects"
                    type="text"
                    value={formData.tutorInfo?.subjects || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="tutorInfo.introduction"
                  className="block text-sm font-medium mb-1"
                >
                  Introduction
                </label>
                <textarea
                  id="tutorInfo.introduction"
                  name="tutorInfo.introduction"
                  value={formData.tutorInfo?.introduction || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
