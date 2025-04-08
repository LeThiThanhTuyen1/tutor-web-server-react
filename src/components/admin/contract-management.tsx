"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { getAllContracts } from "@/services/contractService";
import {
  getAllComplaints,
  processComplaint,
  getComplaintById,
} from "@/services/complaintService";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/select";
import { ContractViewModal } from "@/ui/modals/contract-view-modal";
import { ComplaintViewModal } from "@/ui/modals/complaint-view-modal";
import { ToastContainer } from "@/ui/toast";

export interface ContractDTO {
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

interface Complaint {
  id: number;
  contractId: number;
  userId: number;
  description: string;
  status: string;
  createdAt: string;
  contract?: ContractDTO;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function ContractManagement() {
  const { toast, toasts, dismiss } = useToast();
  const [activeTab, setActiveTab] = useState("contracts");
  const [contracts, setContracts] = useState<ContractDTO[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContract, setSelectedContract] = useState<ContractDTO | null>(
    null
  );
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (activeTab === "contracts") {
      fetchContracts();
    } else if (activeTab === "complaints") {
      fetchComplaints();
    }
  }, [activeTab]);

  const fetchContracts = async () => {
    try {
      setLoadingContracts(true);
      const response = await getAllContracts();
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
      setLoadingContracts(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoadingComplaints(true);
      const response = await getAllComplaints({ pageNumber: 1, pageSize: 100 });
      if (response.succeeded && response.data) {
        setComplaints(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch complaints",
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
      setLoadingComplaints(false);
    }
  };

  const fetchComplaintById = async (id: number) => {
    try {
      const response = await getComplaintById(id);
      if (response.succeeded && response.data) {
        setSelectedComplaint(response.data);
        setIsComplaintModalOpen(true);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch complaint details",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleProcessComplaint = async (action: "approve" | "reject") => {
    if (!selectedComplaint) return;

    try {
      setIsProcessing(true);
      const response = await processComplaint(selectedComplaint.id, action);

      if (response.succeeded) {
        toast({
          title: "Success",
          description: `Complaint ${
            action === "approve" ? "approved" : "rejected"
          } successfully`,
          variant: "success",
        });

        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint.id === selectedComplaint.id
              ? {
                  ...complaint,
                  status: action === "approve" ? "Approved" : "Rejected",
                }
              : complaint
          )
        );

        if (action === "approve") {
          setContracts((prevContracts) =>
            prevContracts.map((contract) =>
              contract.id === selectedComplaint.contractId
                ? { ...contract, status: "Canceled" }
                : contract
            )
          );
        }

        setTimeout(() => {
          setIsComplaintModalOpen(false);
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: response.message || `Failed to ${action} complaint`,
          variant: "destructive",
        });
        setTimeout(() => {
          setIsComplaintModalOpen(false);
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setTimeout(() => {
        setIsComplaintModalOpen(false);
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "canceled":
        return <Badge className="bg-red-500">Cancelled/Rejected</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      contract.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.user?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (complaint.contract?.courseName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "all" ||
      complaint.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewContract = (contract: ContractDTO) => {
    setSelectedContract(contract);
    setIsContractModalOpen(true);
  };

  const handleViewComplaintDetails = (complaint: Complaint) => {
    fetchComplaintById(complaint.id); // Fetch full details
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contract Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="contracts">
            <FileText className="h-4 w-4 mr-2" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="complaints">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Complaints
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-white dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter by Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Cancelled</SelectItem>
              {activeTab === "complaints" && (
                <>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="contracts" className="mt-0">
          {loadingContracts ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredContracts.length === 0 ? (
            <NoDataCard
              type="contracts"
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          ) : (
            <div className="grid gap-4">
              {filteredContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  getStatusBadge={getStatusBadge}
                  onViewDetails={handleViewContract}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="complaints" className="mt-0">
          {loadingComplaints ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredComplaints.length === 0 ? (
            <NoDataCard
              type="complaints"
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          ) : (
            <div className="grid gap-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  getStatusBadge={getStatusBadge}
                  onViewDetails={handleViewComplaintDetails}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Contract View Modal */}
      <ContractViewModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        contract={selectedContract}
      />

      {/* Complaint View Modal */}
      <ComplaintViewModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        complaint={selectedComplaint}
        isProcessing={isProcessing}
        onProcessComplaint={handleProcessComplaint}
      />

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}

// Helper Components
const SkeletonCard = ({ key }: { key: number }) => (
  <Card key={key} className="w-full">
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
);

const NoDataCard = ({
  type,
  searchTerm,
  statusFilter,
}: {
  type: string;
  searchTerm: string;
  statusFilter: string;
}) => (
  <Card className="w-full">
    <CardContent className="flex flex-col items-center justify-center py-12">
      {type === "contracts" ? (
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
      ) : (
        <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
      )}
      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
        No {type === "contracts" ? "Contracts" : "Complaints"} Found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        {searchTerm || statusFilter !== "all"
          ? `No ${type} match your search criteria. Try adjusting your filters.`
          : `There are no ${type} in the system yet.`}
      </p>
    </CardContent>
  </Card>
);

const ContractCard = ({
  contract,
  getStatusBadge,
  onViewDetails,
}: {
  contract: ContractDTO;
  getStatusBadge: (status: string) => JSX.Element;
  onViewDetails: (contract: ContractDTO) => void;
}) => (
  <motion.div
    className="bg-white dark:bg-gray-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{contract.courseName}</CardTitle>
            <CardDescription>
              Tutor: {contract.tutorName} | Student: {contract.studentName}
            </CardDescription>
          </div>
          {getStatusBadge(contract.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Fee
            </p>
            <p className="font-medium">${contract.fee.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Start Date
            </p>
            <p className="font-medium">
              {new Date(contract.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              End Date
            </p>
            <p className="font-medium">
              {new Date(contract.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => onViewDetails(contract)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const ComplaintCard = ({
  complaint,
  getStatusBadge,
  onViewDetails,
}: {
  complaint: Complaint;
  getStatusBadge: (status: string) => JSX.Element;
  onViewDetails: (complaint: Complaint) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="w-full bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Complaint #{complaint.id}</CardTitle>
            <CardDescription>
              Contract:{" "}
              {complaint.contract?.courseName || `#${complaint.contractId}`} |
              User: {complaint.user?.name || `#${complaint.userId}`}
            </CardDescription>
          </div>
          {getStatusBadge(complaint.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Description
          </p>
          <p className="line-clamp-2">{complaint.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Submitted On
          </p>
          <p className="font-medium">
            {new Date(complaint.createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => onViewDetails(complaint)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);
