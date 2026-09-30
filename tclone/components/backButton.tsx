"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // no history to go back to (e.g. a shared link opened directly)
    }
  }

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
