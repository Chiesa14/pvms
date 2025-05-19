"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(() =>
    user
      ? {
          username: user.username || "",
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: user.phoneNumber || "",
          addressStreet: user.addressStreet || "",
          addressCity: user.addressCity || "",
          addressState: user.addressState || "",
          addressPostalCode: user.addressPostalCode || "",
          addressCountry: user.addressCountry || "",
        }
      : {
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          addressStreet: "",
          addressCity: "",
          addressState: "",
          addressPostalCode: "",
          addressCountry: "",
        }
  );
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  if (!user) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated successfully");
      setEditing(false);
      await updateUser();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-xl font-semibold mb-6">My Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow relative"
      >
        {/* Edit icon button */}
        {!editing && (
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 hover:text-primary transition-colors"
            onClick={() => setEditing(true)}
            aria-label="Edit Profile"
          >
            <FiEdit className="w-4 h-4" />
          </button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input name="email" value={form.email} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <Input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Input name="role" value={user.role} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Street</label>
            <Input
              name="addressStreet"
              value={form.addressStreet}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input
              name="addressCity"
              value={form.addressCity}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <Input
              name="addressState"
              value={form.addressState}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Postal Code
            </label>
            <Input
              name="addressPostalCode"
              value={form.addressPostalCode}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <Input
              name="addressCountry"
              value={form.addressCountry}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        </div>
        {editing && (
          <Button type="submit" className="mt-4 w-full" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </form>
    </div>
  );
}
