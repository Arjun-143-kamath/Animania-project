"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(JSON.parse(userStr)));
        window.dispatchEvent(new Event("profileUpdated"));
        router.push("/library");
      } catch (e) {
        console.error("Failed to parse user data", e);
        router.push("/login?error=auth_failed");
      }
    } else {
      router.push("/login?error=missing_credentials");
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-foreground">Completing Login...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center p-4">Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
