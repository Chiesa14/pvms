/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter } from "@/components/ui/filter";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { any, unknown } from "zod";

interface Reservation {
  id: string;
  slotId: string;
  startTime: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "cancelled" | "revoked";
  userId?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  slot?: {
    slotNumber: string;
    level: number;
    type: string;
  };
}

interface PaginatedResponse {
  data: Reservation[];
  total: number;
  page: number;
  totalPages: number;
}

interface Slot {
  id: string;
  slotNumber: string;
  floor: number;
  status: "available" | "occupied" | "reserved" | "maintenance";
  type: "standard" | "handicap" | "electric" | "compact";
}

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ slotId: "", startTime: "", endTime: "" });
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");

  const {
    page,
    pageSize,
    search,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleStatusChange,
  } = usePagination({ defaultPageSize: 10 });

  // Fetch reservations with pagination and filters
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const endpoint =
      user.role === "admin"
        ? "http://localhost:5000/api/reservations/all"
        : "http://localhost:5000/api/reservations";
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
    });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    fetch(`${endpoint}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data: PaginatedResponse) => {
        setReservations(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load reservations");
        setReservations([]);
        setLoading(false);
      });
  }, [user, page, pageSize, search, status]);

  // Fetch available slots
  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch("http://localhost:5000/api/slots?status=available", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch available slots");
      }
      
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setSlots(data.data.filter((slot: { status: string; }) => slot.status === "available"));
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to load available slots");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle opening the modal
  const handleOpenModal = async () => {
    setShowModal(true);
    await fetchAvailableSlots();
  };

  // Handle form input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add reservation
  const handleAddReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add reservation");
      }

      setReservations((prev) => [...prev, data]);
      setForm({ slotId: "", startTime: "", endTime: "" });
      setShowModal(false);
      toast.success("Reservation requested successfully");
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add reservation"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel reservation (user)
  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel reservation");
      }

      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
      );
      toast.success(data.message || "Reservation cancelled successfully");
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel reservation"
      );
    }
  };

  // Admin: acknowledge reservation
  const handleAcknowledge = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reservations/${id}/acknowledge`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error();
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "active" } : r))
      );
      toast.success("Reservation acknowledged");
    } catch {
      toast.error("Failed to acknowledge reservation");
    }
  };

  // Admin: revoke reservation
  const handleRevoke = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reservations/${id}/revoke`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error();
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "revoked" } : r))
      );
      toast.success("Reservation revoked");
    } catch {
      toast.error("Failed to revoke reservation");
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "revoked":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Add Reservation Button (user only) */}
      {user?.role !== "admin" && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleOpenModal}
            className="bg-primary text-white"
          >
            + Add Reservation
          </Button>
        </div>
      )}

      {/* Modal for adding reservation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => {
                setShowModal(false);
                setSlots([]); // Clear slots when closing modal
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add a Reservation</h2>
            <form onSubmit={handleAddReservation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Slot</label>
                <select
                  name="slotId"
                  value={form.slotId}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  disabled={loadingSlots}
                >
                  <option value="">Select a slot</option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.slotNumber} (Level {slot.floor}, {slot.type})
                    </option>
                  ))}
                </select>
                {loadingSlots && (
                  <p className="text-sm text-gray-500 mt-1">Loading available slots...</p>
                )}
                {!loadingSlots && slots.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">No available slots found</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={handleChange}
                  className="flex justify-between"
                  required
                />
              </div>
              <Button type="submit" disabled={submitting || loadingSlots} className="w-full">
                {submitting ? "Adding..." : "Add Reservation"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Reservations</h2>
          <div className="flex gap-2">
            <Filter
              searchPlaceholder="Search by slot, user, ..."
              onSearchChange={handleSearchChange}
              statusOptions={[
                { value: "", label: "All Statuses" },
                { value: "pending", label: "Pending" },
                { value: "active", label: "Active" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "revoked", label: "Revoked" },
              ]}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        {loading ? (
          <div>Loading reservations...</div>
        ) : !Array.isArray(reservations) || reservations.length === 0 ? (
          <div className="text-gray-500">No reservations found.</div>
        ) : (
          <div className="grid gap-4">
            {reservations.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        Slot {r.slot?.slotNumber || r.slotId}
                      </h3>
                      <Badge className={getStatusColor(r.status)}>
                        {r.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div>Level: {r.slot?.level || "N/A"}</div>
                      <div>Type: {r.slot?.type || "N/A"}</div>
                      <div>Start: {new Date(r.startTime).toLocaleString()}</div>
                      <div>End: {new Date(r.endTime).toLocaleString()}</div>
                    </div>
                    {user?.role === "admin" && r.user && (
                      <div className="text-sm text-gray-500">
                        <div>
                          User: {r.user.firstName} {r.user.lastName}
                        </div>
                        <div>Email: {r.user.email}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 self-end">
                    {/* User actions */}
                    {user?.role !== "admin" &&
                      ["pending", "active"].includes(r.status) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(r.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    {/* Admin actions */}
                    {user?.role === "admin" && r.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAcknowledge(r.id)}
                        >
                          Acknowledge
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevoke(r.id)}
                        >
                          Revoke
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
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
    </div>
  );
}
