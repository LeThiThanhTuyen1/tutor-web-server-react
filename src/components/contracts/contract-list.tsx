"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Eye, FileWarning } from "lucide-react";
import { getContractsByUserId } from "@/services/contractService";
import { createComplaint } from "@/services/complaintService";
import { useAuth } from "@/hook/use-auth";
import { Button } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import { useToast } from "@/hook/use-toast";
import { ContractViewModal } from "@/ui/modals/contract-view-modal";
import { ComplaintDialog } from "@/ui/modals/complaint-dialog";
import { ToastContainer } from "@/ui/toast";

interface ContractDTO {
  id: number;
  tutorName: string;
  studentName: string;
  courseName: string;
  terms: string;
  fee: number;
  startDate: string;
  endDate: string;
  status: string;
}

export default function ContractList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, toasts, dismiss } = useToast();
  const [contracts, setContracts] = useState<ContractDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<ContractDTO | null>(
    null
  );
  const [isContractModalOpen, setIsContractModalOpen] = useState(false); // Renamed for clarity
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getContractsByUserId(Number.parseInt(user.id));

        if (response.succeeded && response.data) {
          setContracts(response.data);
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
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      case "canceled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
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

        // Update the contract status in the local state
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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">My Contracts</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Contracts</h1>
      </div>

      {contracts.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No Contracts Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              You don't have any contracts yet. Contracts will appear here when
              you enroll in courses.
            </p>
            <Button
              onClick={() => navigate("/courses")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <motion.div
              className="bg-white dark:bg-gray-800"
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {contract.courseName}
                      </CardTitle>
                      <CardDescription>
                        {user?.role === "Student"
                          ? `Tutor: ${contract.tutorName}`
                          : `Student: ${contract.studentName}`}
                      </CardDescription>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Fee
                      </p>
                      <p className="font-medium">${contract.fee.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Duration
                      </p>
                      <p className="font-medium">
                        {new Date(contract.startDate).toLocaleDateString()} -{" "}
                        {new Date(contract.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleViewContract(contract)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {canFileComplaint(contract.status) && (
                    <Button
                      variant="outline"
                      className="mr-2 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => {
                        setSelectedContract(contract);
                        setIsComplaintDialogOpen(true);
                      }}
                    >
                      <FileWarning className="h-4 w-4 mr-2" />
                      Complaint
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Contract View Modal */}
      <ContractViewModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onFileComplaint={handleOpenComplaintDialog}
        contract={selectedContract}
        canFileComplaint={
          selectedContract ? canFileComplaint(selectedContract.status) : false
        }
      />

      {/* Complaint Dialog */}
      <ComplaintDialog
        isOpen={isComplaintDialogOpen}
        onClose={() => setIsComplaintDialogOpen(false)}
        onSubmit={handleSubmitComplaint}
        isSubmitting={isSubmittingComplaint}
        contractId={selectedContract?.id}
      />

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}
