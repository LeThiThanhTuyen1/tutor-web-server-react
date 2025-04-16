"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Badge } from "@/ui/badge";
import { ScrollArea } from "@/ui/scroll-area";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useNotification } from "@/hook/use-notification";
import { useAuth } from "@/hook/use-auth";

export function NotificationDropdown() {
  const {
    unreadNotifications,
    readNotifications,
    markAsRead,
    unreadCount,
    refreshNotifications,
    lastFetched,
  } = useNotification();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Refresh notifications when dropdown opens, but only if stale
  useEffect(() => {
    if (open && (!lastFetched || Date.now() - lastFetched > 60000)) {
      refreshNotifications();
    }
  }, [open, refreshNotifications, lastFetched, unreadCount]);

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-indigo-600"
              variant="default"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Tabs defaultValue="unread" className="w-full">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h4 className="font-medium">Notifications</h4>
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger value="unread" className="text-xs">
                Unread ({unreadNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="read" className="text-xs">
                Read ({readNotifications.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="unread" className="mt-0">
            <ScrollArea className="h-[300px]">
              {unreadNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No unread notifications
                </div>
              ) : (
                <div className="divide-y">
                  {unreadNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="px-4 py-3 cursor-default focus:bg-indigo-50 dark:focus:bg-indigo-950/50"
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {notification.message}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) =>
                              handleMarkAsRead(notification.id, e)
                            }
                          >
                            Mark read
                          </Button>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatTime(
                            notification.createdAt || notification.sentAt
                          )}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="read" className="mt-0">
            <ScrollArea className="h-[300px]">
              {readNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No read notifications
                </div>
              ) : (
                <div className="divide-y">
                  {readNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="px-4 py-3 cursor-default"
                    >
                      <div className="flex flex-col w-full">
                        <p className="text-sm">{notification.message}</p>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatTime(
                            notification.createdAt || notification.sentAt
                          )}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-indigo-600 dark:text-indigo-400"
            asChild
          >
            <Link to={user?.role ? `/${user.role}/notifications` : "/notifications"} onClick={() => setOpen(false)}>
              View all notifications
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
