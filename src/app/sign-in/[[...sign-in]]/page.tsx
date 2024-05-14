import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
   <div className="grid lg:grid-cols-2 h-screen">
      <div className="bg-primary h-full w-full hidden lg:flex items-center justify-center p-5">
        <div className="p-5">
            <h1 className="font-bold text-secondary text-6xl">
               Social Media Website
            </h1>
            <span className="text-secondary text-sm">
               Share your moments with the world
            </span>
        </div>
      </div>
      <div className="flex items-center justify-center"><SignIn path="/sign-in" /></div>
   </div>
  );
}