"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Eye, FileWarning } from "lucide-react"
import { getContractsByUserId } from "@/services/contractService"
import { createComplaint } from "@/services/complaintService"
import { useAuth } from "@/hook/use-auth"
import { Button } from "@/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/ui/card"
import { Badge } from "@/ui/badge"
import { Skeleton } from "@/ui/skeleton"
import { useToast } from "@/hook/use-toast"
import { ContractViewModal } from "@/ui/modals/contract-view-modal"
import { ComplaintDialog } from "@/ui/modals/complaint-dialog"
import { ToastContainer } from "@/ui/toast"

interface ContractDTO {
  id: number
  tutorName: string
  studentName: string
  courseName: string
  terms: string
  fee: number
  startDate: string
  endDate: string
  status: string
}

export default function ContractList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast, toasts, dismiss } = useToast()
  const [contracts, setContracts] = useState<ContractDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<ContractDTO | null>(null)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false)
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const response = await getContractsByUserId(Number.parseInt(user.id))

        if (response.succeeded && response.data) {
          setContracts(response.data)
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch contracts",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [user])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">Pending</Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">Completed</Badge>
        )
      case "canceled":
        return (
          <Badge className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700">Cancelled</Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleViewContract = (contract: ContractDTO) => {
    setSelectedContract(contract)
    setIsContractModalOpen(true)
  }

  const handleOpenComplaintDialog = () => {
    setIsContractModalOpen(false)
    setIsComplaintDialogOpen(true)
  }

  const handleSubmitComplaint = async (description: string) => {
    if (!selectedContract) return

    try {
      setIsSubmittingComplaint(true)
      const response = await createComplaint({
        contractId: selectedContract.id,
        description,
      })

      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Your complaint has been submitted successfully",
          variant: "success",
        })
        setIsComplaintDialogOpen(false)

        // Update the contract status in the local state
        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.id === selectedContract.id ? { ...contract, status: "pending" } : contract,
          ),
        )

        if (selectedContract) {
          setSelectedContract({ ...selectedContract, status: "pending" })
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit complaint",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComplaint(false)
    }
  }

  const canFileComplaint = (status: string) => {
    return ["active", "completed"].includes(status.toLowerCase())
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">My Contracts</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full border border-gray-200 dark:border-gray-700">
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
    )
  }

  const filteredContracts = contracts.filter((contract) =>
    contract.courseName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col mb-6 space-y-4">
        <h1 className="text-2xl font-bold">My Contracts</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by course name..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {filteredContracts.length === 0 ? (
        <Card className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
              <FileText className="h-16 w-16 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No Contracts Found</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              You don't have any contracts yet. Contracts will appear here when you enroll in courses.
            </p>
            <Button
              onClick={() => navigate("/courses")}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
            >
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Course Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {user?.role === "Student" ? "Tutor" : "Student"}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Fee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{contract.courseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-400">
                      {user?.role === "Student" ? contract.tutorName : contract.studentName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-400">${contract.fee.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-400">
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(contract.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                            setSelectedContract(contract)
                            setIsComplaintDialogOpen(true)
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
      )}

      {/* Contract View Modal */}
      <ContractViewModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onFileComplaint={handleOpenComplaintDialog}
        contract={selectedContract}
        canFileComplaint={selectedContract ? canFileComplaint(selectedContract.status) : false}
      />

      {/* Complaint Dialog */}
      <ComplaintDialog
        isOpen={isComplaintDialogOpen}
        onClose={() => setIsComplaintDialogOpen(false)}
        onSubmit={handleSubmitComplaint}
        isSubmitting={isSubmittingComplaint}
        contractId={selectedContract?.id}
      />

      <ToastContainer toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))} dismiss={dismiss} />
    </div>
  )
}
