"use client";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";

import { Button } from "@/components/ui/button"
import { ModeToggle } from "./theme-toggle";
import MobileSidebar from "./mobile-sidebar";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export default function Navbar() {
  return (
    <div className="bg-secondary/90 h-[4.5rem] shadow-md border-primary fixed w-full flex justify-between items-center px-6 py-4 z-50">
      <div className="flex items-center">
        {/* <Menu className="block md:hidden" /> */}
        <MobileSidebar />
        <Link href="/">
          <h1
            className={cn(
              "font-bold hidden md:block text-3xl",
              font.className
            )}
          >
            delulu.ai
          </h1>
        </Link>
      </div>
        <div className="flex items-center gap-3 border-secondary h-9">
        <Button variant="default"> Upgrade </Button>
        <ModeToggle />
        <UserButton/>
        </div>
    </div>
  );
}
