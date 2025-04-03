"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Checkbox } from "@/ui/checkbox"
import { ScrollArea } from "@/ui/scroll-area"
import { Modal } from "@/ui/modals/modal"
import { motion } from "framer-motion"

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isProcessing: boolean
  courseTitle: string
  tutorName: string
  studentName: string
  fee: number
}

export function ContractModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  courseTitle,
  tutorName,
  studentName,
  fee,
}: ContractModalProps) {
  const [isAgreed, setIsAgreed] = useState(false)

  const handleAgreementChange = (checked: boolean) => {
    setIsAgreed(checked)
  }

  // Reset state when modal closes
  const handleClose = () => {
    setIsAgreed(false)
    onClose()
  }

  const currentDate = new Date().toLocaleDateString()

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        disabled={!isAgreed || isProcessing}
        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
      >
        {isProcessing ? (
          <>
            <motion.div className="h-4 w-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          "Confirm Enrollment"
        )}
      </Button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Course Enrollment Agreement"
      footer={footer}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{courseTitle}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Contract Date: {currentDate}</p>
        </div>

        <ScrollArea maxHeight="max-h-[400px]" className="pr-2">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Parties:</h4>
              <p className="text-sm mb-1">
                <span className="font-semibold">Party A (Tutor):</span> {tutorName}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Party B (Student):</span> {studentName}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Course Fee:</h4>
              <p className="text-sm">${fee.toFixed(2)}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Terms and Conditions:</h4>
              <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <p>
                  1. <span className="font-medium">Enrollment:</span> By agreeing to this contract, the Student (Party
                  B) enrolls in the course provided by the Tutor (Party A).
                </p>
                <p>
                  2. <span className="font-medium">Payment:</span> The Student agrees to pay the course fee as specified
                  above. Payment must be made according to the payment schedule provided.
                </p>
                <p>
                  3. <span className="font-medium">Attendance:</span> The Student is expected to attend all scheduled
                  classes. Absence does not exempt the Student from payment obligations.
                </p>
                <p>
                  4. <span className="font-medium">Cancellation:</span> The Student may cancel enrollment within 48
                  hours of signing this agreement for a full refund. After this period, refunds will be subject to the
                  cancellation policy.
                </p>
                <p>
                  5. <span className="font-medium">Course Materials:</span> All course materials provided by the Tutor
                  are for the Student's personal use only and may not be reproduced or distributed.
                </p>
                <p>
                  6. <span className="font-medium">Conduct:</span> The Student agrees to maintain appropriate behavior
                  during classes. The Tutor reserves the right to terminate enrollment for disruptive behavior without
                  refund.
                </p>
                <p>
                  7. <span className="font-medium">Liability:</span> The Tutor is not liable for any damages or injuries
                  that may occur during the course, except in cases of gross negligence.
                </p>
                <p>
                  8. <span className="font-medium">Modifications:</span> Any modifications to this agreement must be
                  made in writing and agreed upon by both parties.
                </p>
                <p>
                  9. <span className="font-medium">Governing Law:</span> This agreement is governed by the laws of the
                  state/country in which the course is provided.
                </p>
                <p>
                  10. <span className="font-medium">Entire Agreement:</span> This document constitutes the entire
                  agreement between the parties with respect to the course enrollment.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="pt-4 flex items-start gap-2">
          <Checkbox
            id="agreement"
            checked={isAgreed}
            onCheckedChange={handleAgreementChange}
            className="border-gray-800 mt-1 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          />
          <label htmlFor="agreement" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            I have read and agree to the terms and conditions of this enrollment contract.
          </label>
        </div>
      </div>
    </Modal>
  )
}

