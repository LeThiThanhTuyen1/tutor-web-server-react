"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FileText, Eye } from "lucide-react"
import { getContractsByUserId } from "@/services/contractService"
import { useAuth } from "@/hook/use-auth"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card"
import { Badge } from "@/ui/badge"
import { Skeleton } from "@/ui/skeleton"
import { useToast } from "@/hook/use-toast"

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

export default function ContractsTab() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [contracts, setContracts] = useState<ContractDTO[]>([])
  const [loading, setLoading] = useState(true)

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
  }, [user, toast])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "disputed":
        return <Badge className="bg-purple-500">Disputed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleViewAllContracts = () => {
    navigate("/contracts")
  }

  const handleViewContract = (contractId: number) => {
    navigate(`/contracts/${contractId}`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Contracts</h2>
        <Button
          variant="outline"
          onClick={handleViewAllContracts}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
        >
          View All Contracts
        </Button>
      </div>

      {contracts.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Contracts Found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              You don't have any contracts yet. Contracts will appear here when you enroll in courses.
            </p>
            <Button onClick={() => navigate("/courses")} className="bg-indigo-600 hover:bg-indigo-700">
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.slice(0, 3).map((contract) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{contract.courseName}</CardTitle>
                      <CardDescription>
                        {user?.role === "Student" ? `Tutor: ${contract.tutorName}` : `Student: ${contract.studentName}`}
                      </CardDescription>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fee</p>
                      <p className="font-medium">${contract.fee.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium">
                        {new Date(contract.startDate).toLocaleDateString()} -{" "}
                        {new Date(contract.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" onClick={() => handleViewContract(contract.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}

          {contracts.length > 3 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={handleViewAllContracts}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
              >
                View All {contracts.length} Contracts
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

