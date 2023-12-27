"use client";

import * as React from "react";

import { useSidebar } from "@/lib/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { IconLayoutSidebar } from "@tabler/icons-react";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden h-9 w-9 p-0 lg:flex"
      onClick={() => {
        toggleSidebar();
      }}
    >
      <IconLayoutSidebar className="h-6 w-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
