"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle } from "lucide-react"
import { Button } from "@/ui/button"
import { Textarea } from "@/ui/textarea"
import { Label } from "@/ui/label"

interface ComplaintDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (description: string) => Promise<void>
  isSubmitting: boolean
  contractId?: number
}

export function ComplaintDialog({ isOpen, onClose, onSubmit, isSubmitting, contractId }: ComplaintDialogProps) {
  const [description, setDescription] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    if (isSubmitting) return

    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setDescription("")
      onClose()
    }, 300)
  }

  const handleSubmit = async () => {
    if (!description.trim() || isSubmitting) return
    await onSubmit(description)
    setDescription("")
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
            onClick={isSubmitting ? undefined : handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden ${isClosing || isSubmitting ? "pointer-events-none" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h2 className="text-xl font-semibold">File a Complaint</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Please describe your issue with this contract. Our team will review your complaint and get back to you.
              </p>

              <div className="space-y-2">
                <Label htmlFor="complaint-description">Complaint Details</Label>
                <Textarea
                  id="complaint-description"
                  placeholder="Describe your issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  disabled={isSubmitting}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="mr-2">
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !description.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

