"use client";
import Navbar from "@/components/navbar";
import RightSidebar from "@/components/rightSideBar";
import BackButton from "@/components/backButton";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="grid grid-cols-[275px_1fr_350px] gap-4 mx-auto max-w-7xl">
      <div>
        <Navbar />
      </div>

      <div>
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm px-4 py-3 border-b border-gray-200">
          {pathname !== "/" && <BackButton />}
        </div>
        {children}
      </div>

      <div>
        <RightSidebar />
      </div>
    </div>
  );
}
