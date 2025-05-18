"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiKey } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only digits" }),
});

type OtpFormInputs = z.infer<typeof otpSchema>;

export default function OtpPage() {
  const router = useRouter();
  const { verifyOtp } = useAuth();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    setPendingEmail(sessionStorage.getItem("pendingEmail"));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormInputs>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormInputs) => {
    try {
      if (!pendingEmail) {
        toast.error("Session expired");
        return router.push("/auth/login");
      }

      const success = await verifyOtp(pendingEmail, data.otp);
      if (success) {
        toast.success("OTP verified successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("OTP verification failed", {
        description:
          error instanceof Error ? error.message : "Invalid or expired OTP",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md space-y-6 border"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Enter OTP</h1>
          <p className="text-gray-600">Check your email for a 6-digit code</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <div className="relative">
              <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="otp"
                type="text"
                maxLength={6}
                {...register("otp")}
                className="pl-10 tracking-widest text-lg"
              />
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full hover:shadow-md transition-shadow"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Didn&apos;t get the code?{" "}
          <span className="text-primary font-medium cursor-pointer hover:underline">
            Resend OTP
          </span>
        </p>
      </form>
    </div>
  );
}
