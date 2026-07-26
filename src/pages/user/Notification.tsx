import { useState } from "react";
import { Bell } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useGetUserNotification } from "@/queries";
import { UserNotification } from "@/types";

export default function Notification() {
  const { data: userNotifications } = useGetUserNotification();
  const [notifications] = useState<UserNotification[]>();
  if (!userNotifications) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="space-y-6">
        <div className="space-y-3">
          {userNotifications?.map((notification) => {
            return (
              <Card
                key={notification.id}
                className="border border-gray-200 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0`}
                    >
                      <Bell />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {notification.id}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.data.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.data.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {notifications?.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              You're all caught up! Check back later for new updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
