"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Định nghĩa interface User
interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  location?: string;
  role: "Admin" | "Student" | "Tutor";
  dateOfBirth?: string;
  school?: string;
  gender?: "Male" | "Female";
  profileImage?: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  title: string;
  user?: User | null;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSave,
  title,
  user,
}: UserFormModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    role: "Student",
    dateOfBirth: "",
    school: "",
    gender: "Male",
    profileImage: "uploads/userprofile.jpg",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm định dạng ngày cho input
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0]; // e.g., "2000-01-01"
  };

  // Reset form khi modal mở/đóng hoặc user thay đổi
  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Edit mode - điền sẵn dữ liệu người dùng
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || "",
          role: user.role || "Student",
          dateOfBirth: formatDateForInput(user.dateOfBirth),
          school: user.school || "",
          gender: user.gender || "Male",
          profileImage: user.profileImage || "Uploads/userprofile.jpg",
          password: "", // Mật khẩu để trống trong edit mode
        });
      } else {
        // Add mode - reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          location: "",
          role: "Student",
          dateOfBirth: "",
          school: "",
          gender: "Male",
          profileImage: "Uploads/userprofile.jpg",
        });
      }
      setErrors({});
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Xóa lỗi khi người dùng chỉnh sửa trường
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Họ và tên không được để trống";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Kiểm tra mật khẩu
    if (!user && !formData.password?.trim()) {
      // Trong add mode, mật khẩu là bắt buộc
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password && formData.password.length < 6) {
      // Nếu mật khẩu được nhập (add hoặc edit mode), kiểm tra độ dài
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.dateOfBirth) {
      const date = new Date(formData.dateOfBirth);
      if (isNaN(date.getTime())) {
        newErrors.dateOfBirth = "Ngày sinh không hợp lệ";
      } else if (date > new Date()) {
        newErrors.dateOfBirth = "Ngày sinh không được trong tương lai";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu gửi đến API
      const dataToSubmit = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : undefined,
      };

      // Trong edit mode, luôn gửi password (có thể là chuỗi rỗng)
      // Không xóa password khỏi dataToSubmit

      await onSave(dataToSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[700px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm Buc">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Mật khẩu {!user && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                  placeholder={user ? "Để trống nếu không thay đổi" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Vai trò <span className="text-red-500">*</span>
                </Label>
                {user ? (
                  // Trong edit mode, hiển thị role dưới dạng input chỉ đọc
                  <Input
                    id="role"
                    value={
                      formData.role === "Admin"
                        ? "Quản trị viên"
                        : formData.role === "Tutor"
                        ? "Gia sư"
                        : "Học viên"
                    }
                    readOnly
                    className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  />
                ) : (
                  // Trong add mode, cho phép chọn role
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Quản trị viên</SelectItem>
                      <SelectItem value="Tutor">Gia sư</SelectItem>
                      <SelectItem value="Student">Học viên</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">Trường học</Label>
                <Input
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Địa chỉ</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Giới tính</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                  className="flex space-x-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">
                      Nam
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">
                      Nữ
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}