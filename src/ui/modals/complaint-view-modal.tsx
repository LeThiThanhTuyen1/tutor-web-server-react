"use client";

import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Modal } from "@/ui/modals/modal";
import { FileText, AlertTriangle, Clock, CheckCircle, X } from "lucide-react";
import { Complaint } from "@/services/complaintService";
import { ScrollArea } from "../scroll-area";

interface ComplaintViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  isProcessing: boolean;
  onProcessComplaint: (action: "approve" | "reject") => void;
}

export function ComplaintViewModal({
  isOpen,
  onClose,
  complaint,
  isProcessing,
  onProcessComplaint,
}: ComplaintViewModalProps) {
  if (!complaint) return null;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-500">Pending</Badge>;
      case "canceled":
        return <Badge className="bg-red-500 hover:bg-red-500">Cancelled/Rejected</Badge>;
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-500">Rejected</Badge>;
      case "completed":
        return <Badge className="bg-gray-400 hover:bg-gray-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const footer = (
    <div className="flex justify-between items-center">
      <div>
        {complaint.status === "pending" ? (
          <span className="text-yellow-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Pending Review
          </span>
        ) : complaint.status === "approved" ? (
          <span className="text-green-500 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved
          </span>
        ) : complaint.status === "rejected" ? (
          <span className="text-red-500 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Rejected
          </span>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
          Close
        </Button>
        {complaint.status === "pending" && (
          <>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onProcessComplaint("reject")}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Reject"}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onProcessComplaint("approve")}
              disabled={isProcessing}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Approve"}
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Complaint #${complaint.id} Details`}
      footer={footer}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        <ScrollArea>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Submitted on {new Date(complaint.createdAt).toLocaleString()}
              </p>
            </div>
            {getStatusBadge(complaint.status)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">User</h4>
              <p className="font-medium">
                {complaint.user?.name || `User #${complaint.userId}`}
              </p>
              {complaint.user?.email && (
                <p className="text-sm text-gray-500">{complaint.user.email}</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Contract
              </h4>
              <p className="font-medium">
                {complaint.contract?.courseName ||
                  `Contract #${complaint.contractId}`}
              </p>
              {complaint.contract && (
                <p className="text-sm text-gray-500">
                  {complaint.contract.tutorName} (Tutor) |{" "}
                  {complaint.contract.studentName} (Student)
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Description
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4 max-h-[200px] overflow-y-auto">
              <p className="whitespace-pre-line">{complaint.description}</p>
            </div>
          </div>

          {complaint.contract && (
            <div>
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium">Related Contract Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded-md p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Course</p>
                    <p>{complaint.contract.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    {getStatusBadge(complaint.contract.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fee</p>
                    <p>${complaint.contract.fee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Duration
                    </p>
                    <p>
                      {new Date(
                        complaint.contract.startDate
                      ).toLocaleDateString()}{" "}
                      -
                      {new Date(
                        complaint.contract.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Terms and Conditions:</h4>
                <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <p>
                    1. <span className="font-medium">Enrollment:</span> By
                    agreeing to this contract, the Student (Party B) enrolls in
                    the course provided by the Tutor (Party A).
                  </p>
                  <p>
                    2. <span className="font-medium">Payment:</span> The Student
                    agrees to pay the course fee as specified above. Payment
                    must be made according to the payment schedule provided.
                  </p>
                  <p>
                    3. <span className="font-medium">Attendance:</span> The
                    Student is expected to attend all scheduled classes. Absence
                    does not exempt the Student from payment obligations.
                  </p>
                  <p>
                    4. <span className="font-medium">Cancellation:</span> The
                    Student may cancel enrollment within 48 hours of signing
                    this agreement for a full refund. After this period, refunds
                    will be subject to the cancellation policy.
                  </p>
                  <p>
                    5. <span className="font-medium">Course Materials:</span>{" "}
                    All course materials provided by the Tutor are for the
                    Student's personal use only and may not be reproduced or
                    distributed.
                  </p>
                  <p>
                    6. <span className="font-medium">Conduct:</span> The Student
                    agrees to maintain appropriate behavior during classes. The
                    Tutor reserves the right to terminate enrollment for
                    disruptive behavior without refund.
                  </p>
                  <p>
                    7. <span className="font-medium">Liability:</span> The Tutor
                    is not liable for any damages or injuries that may occur
                    during the course, except in cases of gross negligence.
                  </p>
                  <p>
                    8. <span className="font-medium">Modifications:</span> Any
                    modifications to this agreement must be made in writing and
                    agreed upon by both parties.
                  </p>
                  <p>
                    9. <span className="font-medium">Governing Law:</span> This
                    agreement is governed by the laws of the state/country in
                    which the course is provided.
                  </p>
                  <p>
                    10. <span className="font-medium">Entire Agreement:</span>{" "}
                    This document constitutes the entire agreement between the
                    parties with respect to the course enrollment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </Modal>
  );
}
