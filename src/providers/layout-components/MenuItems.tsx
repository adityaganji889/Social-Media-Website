import { getUnreadNotificationsCount } from "@/server-actions/notifications";
import { getCurrentUserFromMongoDB } from "@/server-actions/users";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { useAuth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Bell, Home, LogOut, Search, User } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

function MenuItems() {
  //   const loggedInUserData = await currentUser();
  //   const userResponse = await getCurrentUserFromMongoDB();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const params = useParams();
  //   let user = null;
  //   if(userResponse.success){
  //     // message.success(userResponse.message);
  //     user = userResponse.data;
  //   }
  const { setLoggedInUserData }: UsersStoreType = useUsersStore();
  const [unreadNotificationsCount, setUnreadNotificationsCount] =
    React.useState(0);
  const handleLogout = async () => {
    await signOut();
    setLoggedInUserData(null);
    router.push("/sign-in");
  };
  const iconSize = 20;
  const menuItems = [
    {
      name: "Home",
      icon: <Home size={iconSize} />,
      path: "/",
      isActive: pathname === "/",
    },
    {
      name: "Search",
      icon: <Search size={iconSize} />,
      path: "/search",
      isActive: pathname === "/search",
    },
    {
      name: "Profile",
      icon: <User size={iconSize} />,
      path: `/profile/${loggedInUserData?._id}`,
      isActive: pathname === `/profile/${params.id}`,
    },
    {
      name: "Notifications",
      icon: <Bell size={iconSize} />,
      path: "/notifications",
      isActive: pathname === "/notifications",
    },
    {
      name: "Logout",
      icon: <LogOut size={iconSize} />,
      path: "/logout",
      isActive: false,
    },
  ];
  useEffect(() => {
    getUnreadNotificationsCount(loggedInUserData?._id!).then((res: any) => {
      if (res.success) {
        setUnreadNotificationsCount(res.data);
      }
    });
  }, []);
  return (
    <div className="w-60 p-5 lg:h-screen lg:bg-gray-300">
      <div className="mt-5">
        <span className="text-3xl font-bold text-info">
          Social <b className="text-primary"> Gram</b>
        </span>
        <div className="text-md">{loggedInUserData?.name}</div>
      </div>
      <div className="mt-20 flex flex-col gap-7">
        {menuItems.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex gap-3 items-center ${
                item.isActive ? "bg-info text-white" : "text-gray-500"
              } p-3 border rounded-md cursor-pointer hover:bg-info hover:text-white`}
              onClick={() => {
                if (item.name === "Logout") {
                  handleLogout();
                } else {
                  if (
                    item.name === "Notifications" &&
                    unreadNotificationsCount > 0
                  ) {
                    setUnreadNotificationsCount(0);
                  }
                  router.push(item.path);
                }
              }}
            >
              {item.icon}
              <span className="text-sm flex items-center gap-3">
                {item.name}
                {item.name === "Notifications" &&
                  unreadNotificationsCount > 0 && (
                    <div className="bg-red-700 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                      {unreadNotificationsCount}
                    </div>
                  )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MenuItems;
