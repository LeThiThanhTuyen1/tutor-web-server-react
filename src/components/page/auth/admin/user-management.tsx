"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Search, RefreshCw, Edit, UserPlus } from "lucide-react";
import {
  getPagedUsers,
  deleteUsers,
  type User,
  createUser,
  updateUser,
} from "@/services/adminService";
import { useToast } from "@/hook/use-toast";
import Pagination from "../../layout/pagination";
import { ToastContainer } from "../../../ui/toast";
import { UserFormModal } from "./user-form-modal";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const { toast, toasts, dismiss } = useToast();

  // Add and Edit user states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getPagedUsers(page, pageSize);
      if (response.succeeded && response.data) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.totalPages);
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Lỗi khi lấy danh sách người dùng.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi không mong muốn xảy ra",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleDeleteSingle = (userId: number) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMultiple = () => {
    if (selectedUsers.length === 0) return;
    setUserToDelete(null);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    const idsToDelete = userToDelete ? [userToDelete] : selectedUsers;

    try {
      const response = await deleteUsers(idsToDelete);
      if (response.succeeded) {
        toast({
          title: "Thành công",
          description: `Xóa thành công ${idsToDelete.length} người dùng`,
          variant: "success",
        });
        fetchUsers();
        setSelectedUsers([]);
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Lỗi khi xóa người dùng.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi không mong muốn xảy ra",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    }
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (userData: Partial<User>, isEdit: boolean) => {
    try {
      let response;

      if (isEdit && userToEdit) {
        response = await updateUser(userToEdit.id, userData);
      } else {
        response = await createUser(userData);
      }

      if (response.succeeded) {
        toast({
          title: "Thành công",
          description: isEdit
            ? "Cập nhật người dùng thành công"
            : "Thêm người dùng thành công",
          variant: "success",
        });
        fetchUsers();
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setUserToEdit(null);
      } else {
        toast({
          title: "Lỗi",
          description:
            response.message ||
            (isEdit
              ? "Lỗi khi cập nhật người dùng"
              : "Lỗi khi thêm người dùng"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi không mong muốn xảy ra",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-12 flex flex-col min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Button
          onClick={handleAddUser}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Nhập tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={handleDeleteMultiple}
            disabled={selectedUsers.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-gray-800 flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  className="border border-gray-800"
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>Mã ID</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={8}
                    className="h-12 animate-pulse bg-gray-100 dark:bg-gray-800"
                  ></TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      className="border border-gray-800"
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleSelectUser(user.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "Không có thông tin"}</TableCell>
                  <TableCell>{user.location || "Không có thông tin"}</TableCell>
                  <TableCell>
                    {user.role === "Tutor"
                      ? "Gia sư"
                      : user.role === "Admin"
                      ? "Quản trị viên"
                      : "Học viên"}
                  </TableCell>{" "}
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSingle(user.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Không tìm thấy người dùng phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />

      {totalPages > 1 && (
        <div className="bottom-0 left-0 right-0 py-4 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" }); 
            }}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete
                ? "Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác."
                : `Bạn có chắc muốn xóa ${selectedUsers.length} người dùng đã chọn? Hành động này không thể hoàn tác.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Modal */}
      <UserFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(userData) => handleSaveUser(userData, false)}
        title="Thêm người dùng mới"
      />

      {/* Edit User Modal */}
      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={(userData) => handleSaveUser(userData, true)}
        title="Chỉnh sửa người dùng"
        user={userToEdit}
      />
    </div>
  );
}
