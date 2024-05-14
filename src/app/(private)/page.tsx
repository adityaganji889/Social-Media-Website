import ThemeProvider from "@/providers/theme-provider";
import { getCurrentUserFromMongoDB } from "@/server-actions/users";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button, message } from "antd";
import Image from "next/image";
// import UploadNewPostModal from "./_components/UploadNewPostModal";
import TimelineHeader from "./_components/TimelineHeader";
import Timeline from "./_components/Timeline";

export default function Home() {
  return (
    <div className="grid lg:grid-cols-5 mb-5">
      <div className="col-span-3">
        <TimelineHeader />
        <Timeline/>
      </div>
    </div>
  );
}
