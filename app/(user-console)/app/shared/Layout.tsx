"use client";
import Sidebar from "@/app/components/shared/Sidebar";
import Topbar from "@/app/components/shared/Topbar";
import { Session } from "next-auth";
import React, { ReactNode, useState } from "react";

type Props = {
  children?: ReactNode;
  session: Session | null;
};

export default function Layout({ children, session }: Props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen flex-col md:overflow-hidden bg-dark-grey-2'>
      <Topbar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      <div className='flex-grow flex flex-row md:overflow-y-auto'>
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <div className='w-full bg-dark-grey-2'>{children}</div>
      </div>
    </div>
  );
}
