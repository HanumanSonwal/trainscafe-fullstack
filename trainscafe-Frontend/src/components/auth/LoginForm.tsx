"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginFormData } from "@/types/auth.types";
import { loginUser } from "@/services/auth.service";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const { register, handleSubmit } = useForm<LoginFormData>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);

      const res = await loginUser(data.email, data.password);

      if (res?.success) {
        setUser(res?.data?.user);
        if (res?.data?.user?.role === "vendor") {
          router.replace("/supplier");
        } else {
          router.replace("/control");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen bg-background p-6",
        className,
      )}
      {...props}
    >
      <Card className="overflow-hidden p-0 shadow-xl border-border max-w-6xl w-full">
        <CardContent className="grid md:grid-cols-2 p-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-center md:p-10 bg-card"
          >
            <FieldGroup className="w-full max-w-sm space-y-3">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-primary">
                  Welcome to TrainsCafe
                </h1>

                <p className="text-muted-foreground text-sm">
                  Sign in to manage orders, vendors, and platform operations
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email")}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <a
                    href="#"
                    className="ml-auto text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  {...register("password")}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" isLoading={loading}>
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="hidden md:flex items-center justify-center bg-muted">
            <Image
              src="/images/trainscafe-login.png"
              alt="TrainsCafe banner"
              width={900}
              height={600}
              priority
              className="max-w-full object-contain"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="absolute bottom-6 text-center text-sm text-muted-foreground">
        By continuing you agree to our{" "}
        <a href="#" className="underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </FieldDescription>
    </div>
  );
}
