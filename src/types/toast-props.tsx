export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  onDismiss: (id: string) => void;
}
