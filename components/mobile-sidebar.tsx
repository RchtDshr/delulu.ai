'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
  return (
    <Sheet >
      <SheetTrigger className="pr-4 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="bg-secondary p-0 pt-10 w-32 ">
        {/* <SheetHeader> */}
          {/* <SheetTitle>Are you absolutely sure?</SheetTitle> */}
          {/* <SheetDescription> */}
            <Sidebar/>
          {/* </SheetDescription> */}
        {/* </SheetHeader> */}
      </SheetContent>
    </Sheet>
  );
}
