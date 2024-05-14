"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./layout-components/Sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { usePathname } from "next/navigation";
import { message } from "antd";
import { getCurrentUserFromMongoDB } from "@/server-actions/users";
import useUsersStore, { UsersStoreType } from "@/store/users";
import Spinner from "@/components/Spinner";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  //   const loggedInUserData = await currentUser();
  if (pathname.includes("sign-in") || pathname.includes("sign-up")) {
    return <>{children}</>;
  }

  const { setLoggedInUserData }: UsersStoreType = useUsersStore();
  const [loading, setLoading] = useState<boolean>(false);

  const getCurrentUserData = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUserFromMongoDB();
      if (response.success) {
        setTimeout(()=>{
          setLoggedInUserData(response.data);
          message.success(response.message);
        },5000)
      } else {
        message.info(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setTimeout(()=>{
        setLoading(false);
      },5000)
    }
  };

  useEffect(() => {
    getCurrentUserData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  return (
    <div className="flex lg:flex-row flex-col gap-5 h-screen">
      <Sidebar />
      <div className="py-10 flex-1 px-5 overflow-y-scroll">{children}</div>
    </div>
  );
}

export default LayoutProvider;
