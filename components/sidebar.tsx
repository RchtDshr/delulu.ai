"use client";

import { cn } from "@/lib/utils";
import { Home, Plus, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter()


  const routes = [
    {
      icon: Home,
      href: "/",
      label: "Home",
    },
    {
      icon: Plus,
      href: "/companion/new",
      label: "Create",
    },
    {
      icon: Settings,
      href: "/settings",
      label: "Settings",
    }
  ];

  const onNavigate = (url: string) => {
    return router.push(url)
  }

  return (
    <div className="space-y-4 flex flex-col h-[100vh] text-primary bg-secondary">
      <div className="p-2 pt-0 flex flex-1 justify-center">
        <div className="space-y-3">
          {routes.map((route) => (
            <div
              key={route.href}
              onClick={() => onNavigate(route.href)}
              className={cn(
                "text-muted-foreground text-sm group flex p-3 py-4 justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 w-full transition rounded-md",
                pathname === route.href && "bg-primary/10 text-primary"
              )}
            >
            <div className="flex flex-col gap-y-2 items-center flex-1">
                <route.icon className="h-7 w-7"/>
                {route.label}
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
