"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Define a Vehicle type
interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  brand?: string;
  model?: string;
  color?: string;
}

export default function VehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    licensePlate: "",
    type: "car",
    brand: "",
    model: "",
    color: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch vehicles for current user
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("http://localhost:5000/api/vehicles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVehicles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load vehicles");
        setVehicles([]);
        setLoading(false);
      });
  }, [user]);

  // Handle form input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add vehicle
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add vehicle");
      const newVehicle = await res.json();
      setVehicles((prev) => {
        // Prevent duplicate vehicles (e.g., if API returns the full list)
        if (prev.some((v) => v.id === newVehicle.id)) return prev;
        return [...prev, newVehicle];
      });
      setForm({
        userId: user?.id ?? "",
        licensePlate: "",
        type: "car",
        brand: "",
        model: "",
        color: "",
      });
      setShowModal(false);
      toast.success("Vehicle added");
    } catch {
      toast.error("Failed to add vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete vehicle
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) throw new Error();
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vehicle deleted");
    } catch {
      toast.error("Failed to delete vehicle");
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Add Vehicle Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white"
        >
          + Add Vehicle
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add a Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  License Plate
                </label>
                <Input
                  name="licensePlate"
                  value={form.licensePlate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="truck">Truck</option>
                  <option value="bus">Bus</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Brand
                  </label>
                  <Input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Model
                  </label>
                  <Input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Color
                  </label>
                  <Input
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Adding..." : "Add Vehicle"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">My Vehicles</h2>
        {loading ? (
          <div>Loading vehicles...</div>
        ) : !Array.isArray(vehicles) || vehicles.length === 0 ? (
          <div className="text-gray-500">No vehicles found.</div>
        ) : (
          <div className="grid gap-4">
            {vehicles.map((v) => (
              <Card
                key={v.id}
                className="flex flex-row items-center justify-between p-4"
              >
                <div>
                  <div className="font-bold">{v.licensePlate}</div>
                  <div className="text-sm text-gray-500">
                    {v.type} {v.brand && `| ${v.brand}`}{" "}
                    {v.model && `| ${v.model}`} {v.color && `| ${v.color}`}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(v.id)}
                >
                  Delete
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
