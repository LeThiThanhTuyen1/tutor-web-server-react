"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, User, Calendar, DollarSign, Book, FileSignature, CheckCircle } from "lucide-react"
import { Button } from "@/ui/button"
import { Badge } from "@/ui/badge"
import { ScrollArea } from "@/ui/scroll-area"

interface ContractAttachment {
  id: number
  name: string
  type: string
  url: string
}

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
  attachments?: ContractAttachment[]
}

interface ContractDialogProps {
  isOpen: boolean
  onClose: () => void
  contract: ContractDTO | null
  onFileComplaint?: () => void
  canFileComplaint?: boolean
  isRegistrationMode?: boolean
  onSignContract?: () => Promise<void>
  isSigningContract?: boolean
}

export function ContractDialog({
  isOpen,
  onClose,
  contract,
  // onFileComplaint,
  // canFileComplaint = false,
  isRegistrationMode = false,
  onSignContract,
  isSigningContract = false,
}: ContractDialogProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  useEffect(() => {
    if (contract?.attachments) {
      // Check if there's a signed contract in the attachments
      const hasSignedContract = contract.attachments.some(
        (attachment) => attachment.name.toLowerCase().includes("contract") && attachment.type === "signed",
      )
      setIsSigned(hasSignedContract)
    } else {
      setIsSigned(false)
    }
  }, [contract])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden ${isClosing ? "pointer-events-none" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold">
                  {contract ? `Contract: ${contract.courseName}` : "Contract Details"}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Content */}
            {contract ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-medium">Contract #{contract.id}</h3>
                  {getStatusBadge(contract.status)}
                </div>

                {/* Signed Contract Confirmation */}
                {isSigned && (
                  <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">Contract has been signed</p>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        This contract was signed and is now active
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Tutor</h4>
                        <p>{contract.tutorName}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <User className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Student</h4>
                        <p>{contract.studentName}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Book className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Course</h4>
                        <p>{contract.courseName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Fee</h4>
                        <p>${contract.fee.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Start Date</h4>
                        <p>{new Date(contract.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">End Date</h4>
                        <p>{new Date(contract.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start">
                    <FileSignature className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                    <div className="w-full">
                      <h4 className="font-medium mb-2">Terms and Conditions</h4>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        <p className="whitespace-pre-line">{contract.terms}</p>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center">
                <p>No contract data available</p>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button variant="outline" onClick={handleClose} className="mr-2">
                Close
              </Button>

              {/* Show Sign Contract button only in registration mode and if not already signed */}
              {isRegistrationMode && !isSigned && onSignContract && (
                <Button
                  onClick={onSignContract}
                  disabled={isSigningContract}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSigningContract ? "Signing..." : "Sign Contract"}
                </Button>
              )}

              {/* Show File Complaint button only in normal viewing mode */}
              {/* {!isRegistrationMode && canFileComplaint && onFileComplaint && (
                <Button
                  variant="outline"
                  onClick={onFileComplaint}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  File a Complaint
                </Button>
              )} */}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

