/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Reservation {
  id: string;
  slotId: string;
  startTime: string;
  endTime: string;
  status: string;
  userId?: string;
}

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ slotId: "", startTime: "", endTime: "" });
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);

  // Fetch reservations
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("http://localhost:5000/api/reservations", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setReservations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load reservations");
        setReservations([]);
        setLoading(false);
      });
  }, [user]);

  // Fetch available slots for reservation form
  useEffect(() => {
    if (!showModal) return;
    fetch("http://localhost:5000/api/slots", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => setSlots([]));
  }, [showModal]);

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
      if (!res.ok) throw new Error("Failed to add reservation");
      const newReservation = await res.json();
      setReservations((prev) => [...prev, newReservation]);
      setForm({ slotId: "", startTime: "", endTime: "" });
      setShowModal(false);
      toast.success("Reservation requested");
    } catch {
      toast.error("Failed to add reservation");
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
      if (!res.ok) throw new Error();
      setReservations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reservation cancelled");
    } catch {
      toast.error("Failed to cancel reservation");
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

  return (
    <div className="space-y-8 relative">
      {/* Add Reservation Button (user only) */}
      {user?.role !== "admin" && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setShowModal(true)}
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
              onClick={() => setShowModal(false)}
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
                >
                  <option value="">Select a slot</option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.slotNumber} ({slot.zone}, {slot.floor})
                    </option>
                  ))}
                </select>
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
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Adding..." : "Add Reservation"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Reservations</h2>
        {loading ? (
          <div>Loading reservations...</div>
        ) : !Array.isArray(reservations) || reservations.length === 0 ? (
          <div className="text-gray-500">No reservations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2">Slot</th>
                  <th className="px-4 py-2">Start Time</th>
                  <th className="px-4 py-2">End Time</th>
                  <th className="px-4 py-2">Status</th>
                  {user?.role === "admin" && (
                    <th className="px-4 py-2">User ID</th>
                  )}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2">{r.slotId}</td>
                    <td className="px-4 py-2">
                      {new Date(r.startTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(r.endTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 capitalize font-semibold">
                      {r.status}
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-4 py-2">{r.userId}</td>
                    )}
                    <td className="px-4 py-2 space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
