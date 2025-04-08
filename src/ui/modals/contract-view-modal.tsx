"use client";

import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { Modal } from "@/ui/modals/modal";

interface ContractViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileComplaint: () => void;
  contract: {
    courseName: string;
    tutorName: string;
    studentName: string;
    fee: number;
    startDate: string;
    endDate: string;
    terms: string;
    status: string;
  } | null;
  canFileComplaint: boolean;
}

export function ContractViewModal({
  isOpen,
  onClose,
  onFileComplaint,
  contract,
  canFileComplaint,
}: ContractViewModalProps) {
  if (!contract) return null;

  const footer = (
    <div className="flex justify-end space-x-2">
      {canFileComplaint && (
        <Button
          variant="outline"
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={onFileComplaint}
        >
          File Complaint
        </Button>
      )}
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contract Details"
      footer={footer}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {contract.courseName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: {contract.status}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start Date: {new Date(contract.startDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            End Date: {new Date(contract.endDate).toLocaleDateString()}
          </p>
        </div>

        <ScrollArea maxHeight="max-h-[400px]" className="pr-2">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Parties:</h4>
              <p className="text-sm mb-1">
                <span className="font-semibold">Tutor:</span>{" "}
                {contract.tutorName}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Student:</span>{" "}
                {contract.studentName}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Course Fee:</h4>
              <p className="text-sm">${contract.fee.toFixed(2)}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Terms and Conditions:</h4>
              <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-medium mb-2">Terms and Conditions:</h4>
                  <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <p>
                      1. <span className="font-medium">Enrollment:</span> By
                      agreeing to this contract, the Student (Party B) enrolls
                      in the course provided by the Tutor (Party A).
                    </p>
                    <p>
                      2. <span className="font-medium">Payment:</span> The
                      Student agrees to pay the course fee as specified above.
                      Payment must be made according to the payment schedule
                      provided.
                    </p>
                    <p>
                      3. <span className="font-medium">Attendance:</span> The
                      Student is expected to attend all scheduled classes.
                      Absence does not exempt the Student from payment
                      obligations.
                    </p>
                    <p>
                      4. <span className="font-medium">Cancellation:</span> The
                      Student may cancel enrollment within 48 hours of signing
                      this agreement for a full refund. After this period,
                      refunds will be subject to the cancellation policy.
                    </p>
                    <p>
                      5. <span className="font-medium">Course Materials:</span>{" "}
                      All course materials provided by the Tutor are for the
                      Student's personal use only and may not be reproduced or
                      distributed.
                    </p>
                    <p>
                      6. <span className="font-medium">Conduct:</span> The
                      Student agrees to maintain appropriate behavior during
                      classes. The Tutor reserves the right to terminate
                      enrollment for disruptive behavior without refund.
                    </p>
                    <p>
                      7. <span className="font-medium">Liability:</span> The
                      Tutor is not liable for any damages or injuries that may
                      occur during the course, except in cases of gross
                      negligence.
                    </p>
                    <p>
                      8. <span className="font-medium">Modifications:</span> Any
                      modifications to this agreement must be made in writing
                      and agreed upon by both parties.
                    </p>
                    <p>
                      9. <span className="font-medium">Governing Law:</span>{" "}
                      This agreement is governed by the laws of the
                      state/country in which the course is provided.
                    </p>
                    <p>
                      10. <span className="font-medium">Entire Agreement:</span>{" "}
                      This document constitutes the entire agreement between the
                      parties with respect to the course enrollment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Modal>
  );
}
