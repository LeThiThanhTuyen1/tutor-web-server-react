import { createNotification } from "@/services/notificationService";

export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export const NotificationTemplates = {
  // Course related
  courseEnrollment: (courseName: string) =>
    `You have successfully enrolled in "${courseName}"`,

  courseEnrollmentForTutor: (studentName: string, courseName: string) =>
    `${studentName} has enrolled in your course "${courseName}"`,

  coursePayment: (courseName: string, amount: number) =>
    `Payment of $${amount} for "${courseName}" has been processed successfully`,

  courseCancellation: (courseName: string) =>
    `Your enrollment in "${courseName}" has been cancelled`,

  courseUpdate: (courseName: string) =>
    `The course "${courseName}" has been updated`,

  // Profile related
  profileUpdate: () => `Your profile has been updated successfully`,

  passwordChange: () => `Your password has been changed successfully`,

  // General
  welcomeMessage: (userName: string) => `Welcome to the platform, ${userName}!`,

  newMessage: (senderName: string) =>
    `You have received a new message from ${senderName}`,
};

// Helper function to send notifications
export const sendNotification = async (
  userId: number,
  message: string,
  type: NotificationType = NotificationType.INFO
) => {
  try {
    await createNotification(userId, message, type);
    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};
