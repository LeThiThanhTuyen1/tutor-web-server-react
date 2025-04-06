"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Bell, Check, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/ui/skeleton";
import { useNotification } from "@/hooks/use-notification";

export default function NotificationsPage() {
  const {
    notifications,
    unreadNotifications,
    readNotifications,
    loading,
    markAsRead,
  } = useNotification();
  const [activeTab, setActiveTab] = useState("all");

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
    console.log(id)
  };

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-indigo-500" />
              Your Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread ({unreadNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="read">
                  Read ({readNotifications.length})
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

interface NotificationListProps {
  notifications: {
    id: number;
    message: string;
    sentAt: string;
    isRead: boolean;
  }[];
  onMarkAsRead: (id: number) => void;
}

function NotificationList({
  notifications,
  onMarkAsRead,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No notifications to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
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
                {notification.sentAt
                  ? formatDistanceToNow(
                      new Date(notification.sentAt.replace(" ", "T")),
                      { addSuffix: true }
                    )
                  : "Invalid date"}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              {notification.isRead ? (
                <div className="flex items-center text-gray-500 text-sm">
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Read
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
