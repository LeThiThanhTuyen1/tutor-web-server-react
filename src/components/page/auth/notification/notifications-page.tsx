import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // Import Vietnamese locale
import { Bell, Check, CheckCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotification } from "@/hook/use-notification";
import React from "react";

export default function NotificationsPage() {
  const {
    notifications,
    unreadNotifications,
    readNotifications,
    loading,
    markAsRead,
  } = useNotification();
  const [activeTab, setActiveTab] = useState("all");

  // Memoize onMarkAsRead to prevent unnecessary re-renders
  const handleMarkAsRead = useCallback((id: number) => {
    markAsRead(id);
    console.log(id);
  }, [markAsRead]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-32" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            <Bell className="h-6 w-6 mr-2 text-indigo-500 inline" />
            Tất cả thông báo của bạn
          </h1>
        </div>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-4 mt-2">
                <TabsTrigger value="all">
                  Tất cả ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Thông báo chưa đọc ({unreadNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="read">
                  Thông báo đã đọc ({readNotifications.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <NotificationList
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                />
              </TabsContent>

              <TabsContent value="unread">
                <NotificationList
                  notifications={unreadNotifications}
                  onMarkAsRead={handleMarkAsRead}
                />
              </TabsContent>

              <TabsContent value="read">
                <NotificationList
                  notifications={readNotifications}
                  onMarkAsRead={handleMarkAsRead}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface NotificationItemProps {
  notification: {
    id: number;
    message: string;
    sentAt: string;
    isRead: boolean;
  };
  onMarkAsRead: (id: number) => void;
}

// Memoized NotificationItem to prevent unnecessary re-renders
const NotificationItem = React.memo(
  ({ notification, onMarkAsRead }: NotificationItemProps) => {
    const formatTime = (dateString: string) => {
      try {
        return formatDistanceToNow(new Date(dateString.replace(" ", "T")), {
          addSuffix: true,
          locale: vi, // Use Vietnamese locale
        });
      } catch (error) {
        return "Ngày không xác định";
      }
    };

    return (
      <div
        className={`p-4 border rounded-lg ${
          !notification.isRead
            ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
            : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-gray-900 dark:text-gray-100">
              {notification.message}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {formatTime(notification.sentAt)}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            {notification.isRead ? (
              <div className="flex items-center text-gray-500 text-sm">
                <CheckCheck className="h-4 w-4 mr-1" />
                Đã đọc
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Đánh dấu là đã đọc
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

interface NotificationListProps {
  notifications: {
    id: number;
    message: string;
    sentAt: string;
    isRead: boolean;
  }[];
  onMarkAsRead: (id: number) => void;
}

// Memoized NotificationList to prevent unnecessary re-renders
const NotificationList = React.memo(
  ({ notifications, onMarkAsRead }: NotificationListProps) => {
    if (notifications.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Không có thông báo.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    );
  }
);

NotificationList.displayName = "NotificationList";