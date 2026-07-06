"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const mfaSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
});

type MFAFormData = z.infer<typeof mfaSchema>;

export function MFAForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
  });

  const onSubmit = async (data: MFAFormData) => {
    setError(null);
    // In a real app, this would verify the code against the backend via Server Action or API
    // For now, we simulate success for the scaffold
    const isValid = data.code === "123456"; // dummy check

    if (!isValid) {
      setError("Invalid 2FA code");
    } else {
      router.push("/os");
      router.refresh();
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="code">Authentication Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              maxLength={6}
              {...register("code")}
              disabled={isSubmitting}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
