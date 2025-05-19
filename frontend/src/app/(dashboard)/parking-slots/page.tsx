"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ParkingSlot {
  id: string;
  slotNumber: string;
  floor: number;
  status: "available" | "occupied" | "reserved" | "maintenance";
  type: "standard" | "handicap" | "electric" | "compact";
  reservedBy?: number;
}

export default function ParkingSlotsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slotNumber: "",
    floor: 1,
    status: "available",
    type: "standard",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fetch parking slots
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    fetch("http://localhost:5000/api/slots", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSlots(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load parking slots");
        setSlots([]);
        setLoading(false);
      });
  }, [user]);

  // Handle form input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === "level" ? parseInt(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Add or update parking slot
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingSlot
        ? `http://localhost:5000/api/slots/${editingSlot.id}`
        : "http://localhost:5000/api/slots";
      const method = editingSlot ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save parking slot");
      }

      const savedSlot = await res.json();
      if (editingSlot) {
        setSlots((prev) =>
          prev.map((slot) => (slot.id === editingSlot.id ? savedSlot : slot))
        );
        toast.success("Parking slot updated");
      } else {
        setSlots((prev) => [...prev, savedSlot]);
        toast.success("Parking slot added");
      }

      setForm({
        slotNumber: "",
        floor: 1,
        status: "available",
        type: "standard",
      });
      setEditingSlot(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving parking slot:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save parking slot"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete parking slot
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parking slot?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/slots/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) throw new Error();
      setSlots((prev) => prev.filter((slot) => slot.id !== id));
      toast.success("Parking slot deleted");
    } catch {
      toast.error("Failed to delete parking slot");
    }
  };

  // Edit parking slot
  const handleEdit = (slot: ParkingSlot) => {
    setEditingSlot(slot);
    setForm({
      slotNumber: slot.slotNumber,
      floor: slot.floor,
      status: slot.status,
      type: slot.type,
    });
    setShowModal(true);
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-8 relative">
      {/* Add Parking Slot Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setEditingSlot(null);
            setForm({
              slotNumber: "",
              floor: 1,
              status: "available",
              type: "standard",
            });
            setShowModal(true);
          }}
          className="bg-primary text-white"
        >
          + Add Parking Slot
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => {
                setShowModal(false);
                setEditingSlot(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingSlot ? "Edit Parking Slot" : "Add Parking Slot"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slot Number
                </label>
                <Input
                  name="slotNumber"
                  value={form.slotNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <Input
                  type="number"
                  name="level"
                  value={form.floor}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="standard">Standard</option>
                  <option value="handicap">Handicap</option>
                  <option value="electric">Electric</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting
                  ? editingSlot
                    ? "Updating..."
                    : "Adding..."
                  : editingSlot
                  ? "Update Parking Slot"
                  : "Add Parking Slot"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Parking Slots</h2>
        {loading ? (
          <div>Loading parking slots...</div>
        ) : !Array.isArray(slots) || slots.length === 0 ? (
          <div className="text-gray-500">No parking slots found.</div>
        ) : (
          <div className="grid gap-4">
            {slots.map((slot) => (
              <Card
                key={slot.id}
                className="flex flex-row items-center justify-between p-4"
              >
                <div>
                  <div className="font-bold">Slot {slot.slotNumber}</div>
                  <div className="text-sm text-gray-500">
                    Level {slot.floor} | {slot.type} | Status: {slot.status}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(slot)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(slot.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
