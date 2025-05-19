"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Filter } from "@/components/ui/filter";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";

interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  data: Notification[];
  total: number;
  page: number;
  totalPages: number;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const {
    page,
    pageSize,
    search,
    status,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleStatusChange,
  } = usePagination({ defaultPageSize: 10 });

  // Fetch notifications with pagination and filters
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
    });
    if (search) params.set("search", search);
    if (status) params.set("isRead", status);
    fetch(`http://localhost:5000/api/notifications?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data: PaginatedResponse) => {
        setNotifications(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load notifications");
        setNotifications([]);
        setLoading(false);
      });
  }, [user, page, pageSize, search, status]);

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error();
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="mb-4">
        <Filter
          searchPlaceholder="Search notifications..."
          onSearchChange={handleSearchChange}
          statusOptions={[
            { value: "all", label: "All" },
            { value: "false", label: "Unread" },
            { value: "true", label: "Read" },
          ]}
          onStatusChange={handleStatusChange}
        />
      </div>
      {loading ? (
        <div>Loading notifications...</div>
      ) : !Array.isArray(notifications) || notifications.length === 0 ? (
        <div className="text-gray-500">No notifications found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id} className="border-t">
                  <td className="px-4 py-2">{n.message}</td>
                  <td className="px-4 py-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {n.isRead ? (
                      <span className="text-green-600 font-semibold">Read</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Unread
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {!n.isRead && (
                      <Button size="sm" onClick={() => handleMarkAsRead(n.id)}>
                        Mark as Read
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalItems={total}
        />
      </div>
    </div>
  );
}
