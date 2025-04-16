"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Eye, FileWarning, Search } from "lucide-react";
import { getContractsByUserId } from "@/services/contractService";
import { createComplaint } from "@/services/complaintService";
import { Button } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import { Input } from "@/ui/input";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/hook/use-auth";
import { fadeIn } from "../layout/animation";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "@/ui/toast";
import { ChangePasswordModal } from "../auth/change-password";
import { ContractViewModal } from "@/ui/modals/contract-view-modal";
import { ComplaintDialog } from "@/ui/modals/complaint-dialog";

interface ContractDTO {
  id: number;
  tutorName: string;
  studentName: string;
  courseName: string;
  terms: string;
  fee: number;
  startDate: string;
  endDate?: string;
  status: string;
}

interface PaginationFilter {
  pageNumber: number;
  pageSize: number;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, toasts, dismiss } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [contracts, setContracts] = useState<ContractDTO[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ContractDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [pagination, setPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 5,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContract, setSelectedContract] = useState<ContractDTO | null>(
    null
  );
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  useEffect(() => {
    if (user?.role !== "Admin" && user?.id) {
      const fetchContracts = async () => {
        try {
          setLoadingContracts(true);
          const response = await getContractsByUserId(
            Number.parseInt(user.id),
            pagination
          );

          if (response.succeeded && response.data) {
            setContracts(response.data);
            setTotalPages(response.totalPages || 1);
          } else {
            toast({
              title: "Error",
              description: response.message || "Failed to fetch contracts",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        } finally {
          setLoadingContracts(false);
        }
      };

      fetchContracts();
    } else {
      setLoadingContracts(false);
    }
  }, [user, pagination]);

  // Apply filter when contracts or searchTerm changes
  useEffect(() => {
    const filtered = contracts.filter((contract) =>
      contract.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContracts(filtered);
  }, [contracts, searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
            Completed
          </Badge>
        );
      case "canceled":
        return (
          <Badge className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewContract = (contract: ContractDTO) => {
    setSelectedContract(contract);
    setIsContractModalOpen(true);
  };

  const handleOpenComplaintDialog = () => {
    setIsContractModalOpen(false);
    setIsComplaintDialogOpen(true);
  };

  const handleSubmitComplaint = async (description: string) => {
    if (!selectedContract) return;

    try {
      setIsSubmittingComplaint(true);
      const response = await createComplaint({
        contractId: selectedContract.id,
        description,
      });

      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Your complaint has been submitted successfully",
          variant: "success",
        });
        setIsComplaintDialogOpen(false);

        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.id === selectedContract.id
              ? { ...contract, status: "pending" }
              : contract
          )
        );

        if (selectedContract) {
          setSelectedContract({ ...selectedContract, status: "pending" });
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit complaint",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const canFileComplaint = (status: string) => {
    return ["active", "completed"].includes(status.toLowerCase());
  };

  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, pageNumber }));
    window.scrollTo({ top: 0, behavior: "smooth" }); 
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
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-8">
          <Card className="bg-white dark:bg-gray-800">
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

          {user?.role !== "Admin" && (
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Contracts Manage</CardTitle>
                <CardDescription>
                  View and manage your contracts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by course name..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 w-full sm:w-1/2 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                {loadingContracts ? (
                  <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : filteredContracts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm
                        ? "No contracts match your search."
                        : "No contracts found. Contracts will appear here when you take on tutoring sessions."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[250px] min-w-[150px]"
                            >
                              Course Name
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[150px] min-w-[120px]"
                            >
                              Student
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px] min-w-[80px] hidden sm:table-cell"
                            >
                              Fee
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px] min-w-[80px]"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[150px] min-w-[120px]"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          {filteredContracts.map((contract) => (
                            <tr
                              key={contract.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[230px]">
                                  {contract.courseName}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-gray-400 truncate max-w-[140px]">
                                  {contract.studentName}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                                <div className="text-sm text-gray-900 dark:text-gray-400">
                                  ${contract.fee.toFixed(2)}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                {getStatusBadge(contract.status)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    onClick={() => handleViewContract(contract)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  {canFileComplaint(contract.status) && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                                      onClick={() => {
                                        setSelectedContract(contract);
                                        setIsComplaintDialogOpen(true);
                                      }}
                                    >
                                      <FileWarning className="h-4 w-4 mr-1" />
                                      Complaint
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                      <Button
                        disabled={pagination.pageNumber === 1}
                        onClick={() =>
                          handlePageChange(pagination.pageNumber - 1)
                        }
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.pageNumber} of {totalPages}
                      </span>
                      <Button
                        disabled={pagination.pageNumber >= totalPages}
                        onClick={() =>
                          handlePageChange(pagination.pageNumber + 1)
                        }
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {user?.role === "Admin" && (
            <Card className="bg-white dark:bg-gray-800">
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
                    <Button variant="outline">
                      <Link to="/admin/users">Manage Users</Link>
                    </Button>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium mb-2">Course Management</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Manage courses and categories
                    </p>
                    <Button variant="outline">
                      <Link to="/admin/courses">Manage Courses</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {isChangePasswordModalOpen && (
          <ChangePasswordModal
            onClose={() => setIsChangePasswordModalOpen(false)}
          />
        )}
        {isContractModalOpen && selectedContract && (
          <ContractViewModal
            isOpen={isContractModalOpen}
            onClose={() => setIsContractModalOpen(false)}
            onFileComplaint={handleOpenComplaintDialog}
            contract={selectedContract}
            canFileComplaint={canFileComplaint(selectedContract.status)}
          />
        )}
        {isComplaintDialogOpen && selectedContract && (
          <ComplaintDialog
            isOpen={isComplaintDialogOpen}
            onClose={() => setIsComplaintDialogOpen(false)}
            onSubmit={handleSubmitComplaint}
            isSubmitting={isSubmittingComplaint}
            contractId={selectedContract.id}
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
