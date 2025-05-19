"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error("Invalid verification link");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        const data = await response.json();

        if (response.ok) {
          toast.success("Email verified successfully! You can now log in.");
          router.push("/auth/login");
        } else {
          toast.error(data.message || "Verification failed");
        }
      } catch (error) {
        toast.error("Error verifying email");
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Email Verification
          </h2>
          {verifying ? (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your email...</p>
            </div>
          ) : (
            <p className="mt-4 text-gray-600">
              {!token ? "Invalid verification link" : "Verification complete"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
