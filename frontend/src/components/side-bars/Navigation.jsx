import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import UserPanel from "../user/UserPanel";
import CreatePostModal from "../posts/CreatePostModal";
// Icons
import { GoHome, GoHomeFill } from "react-icons/go";
import { TbMail, TbMailFilled } from "react-icons/tb";
import { PiMagnifyingGlass, PiMagnifyingGlassBold } from "react-icons/pi";
import {
  IoNotificationsOutline,
  IoNotifications,
  IoBookmarkOutline,
  IoBookmark,
} from "react-icons/io5";
// import { BsSlashSquare, BsSlashSquareFill } from "react-icons/bs";
// import { RiFileListLine, RiFileListFill } from "react-icons/ri";
import { CiCircleMore } from "react-icons/ci";
import { CgMoreO } from "react-icons/cg";
import { BsPerson, BsPersonFill, BsPeople, BsPeopleFill } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";

const Navigation = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [selectedItem, setSelectedItem] = useState("/");

  const navList = [
    { icon: GoHome, icon2: GoHomeFill, path: "/", text: "Home" },
    {
      icon: PiMagnifyingGlass,
      icon2: PiMagnifyingGlassBold,
      path: "/explore",
      text: "Explore",
    },
    {
      icon: IoNotificationsOutline,
      icon2: IoNotifications,
      path: "/notification",
      text: "Notifications",
    },
    // { icon: TbMail, icon2: TbMailFilled, path: "/messages", text: "Messages" },
    // {
    //   icon: BsSlashSquare,
    //   icon2: BsSlashSquareFill,
    //   path: "/grok",
    //   text: "Grok",
    // },
    // {
    //   icon: RiFileListLine,
    //   icon2: RiFileListFill,
    //   path: "/lists",
    //   text: "Lists",
    // },
    // {
    //   icon: IoBookmarkOutline,
    //   icon2: IoBookmark,
    //   path: "/bookmarks",
    //   text: "Bookmarks",
    // },
    // {
    //   icon: BsPeople,
    //   icon2: BsPeopleFill,
    //   path: "/communities",
    //   text: "Communities",
    // },
    // { icon: FaXTwitter, icon2: FaXTwitter, path: "/", text: "Premium" },
    {
      icon: BsPerson,
      icon2: BsPersonFill,
      path: `/profile/${authUser?.username}`,
      text: "Profile",
    },
    { icon: CiCircleMore, icon2: CgMoreO, path: "/more", text: "More" },
  ];

  const handleClick = (path) => {
    setSelectedItem(path);
  };

  return (
    <div className="sticky top-0 left-0 h-screen border-r border-gray-700 overflow-hidden min-w-[70px] lg:min-w-[300px] z-50">
      <div className="">
        {/* Logo */}
        <Link
          to="/"
          className="w-14 h-14 flex justify-center items-center hover:bg-stone-900 transition-all rounded-full duration-200 cursor-pointer ml-4 lg:ml-0 z-50 mb-5"
        >
          <FaXTwitter className="w-9 h-9" />
        </Link>

        {/* Navigation */}
        {navList.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item.path)}
            className="flex justify-center lg:justify-start mb-4"
          >
            <Link
              to={item.path}
              className="flex flex-row justify-center items-center hover:bg-stone-900 transition-all rounded-full duration-200 p-3 max-w-fit cursor-pointer"
            >
              {selectedItem === item.path ? (
                <item.icon2 className="w-8 h-8" />
              ) : (
                <item.icon className="w-8 h-8" />
              )}
              <span
                className={`text-2xl hidden lg:block md:px-4 ${
                  selectedItem === item.path ? "font-extrabold" : "font-medium"
                }`}
              >
                {item.text}
              </span>
            </Link>
          </div>
        ))}

        {/* Post button */}
        <CreatePostModal />

        {/* User panel */}
        <UserPanel />
      </div>
    </div>
  );
};

export default Navigation;
