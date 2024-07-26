import SuggestedUsers from "../../components/explore/SuggestedUsers";
import CreatorAccounts from "../../components/explore/CreatorAccounts";
import { useState } from "react";

const ExplorePage = () => {
  const [explore, setExplore] = useState("all");

  const renderPosts = () => {
    switch (explore) {
      case "all":
        return <SuggestedUsers />;
      case "creators":
        return <CreatorAccounts />;
      default:
        return <SuggestedUsers />;
    }
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen ">
      <div className="sticky top-0 left-0 flex flex-col w-full bg-black/60 backdrop-blur-md z-20">
        {/* Header */}
        <div className="w-full flex justify-between items-center p-4">
          <span className="text-[21px] font-bold">Explore</span>
          {/* <SettingButton /> */}
        </div>
        <div className="flex w-full h-16 items-center border-b border-gray-700">
          {/* here */}
          <div
            className={`flex justify-center flex-1 p-5 hover:bg-secondary transition duration-300 cursor-pointer relative text-lg ${
              explore === "all"
                ? "font-black text-white"
                : "font-semibold text-gray-700"
            }`}
            onClick={() => setExplore("all")}
          >
            Suggested Users
            {explore === "all" && (
              <div className="absolute bottom-0 w-[70px] h-[4px] rounded-full bg-primary"></div>
            )}
          </div>
          {/* here */}
          <div
            className={`flex justify-center flex-1 p-5 hover:bg-secondary transition duration-300 cursor-pointer relative text-lg ${
              explore === "creators"
                ? "font-black text-white"
                : "font-semibold text-gray-700"
            }`}
            onClick={() => setExplore("creators")}
          >
            Creator accounts
            {explore === "creators" && (
              <div className="absolute bottom-0 w-[70px]  h-[4px] rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>{renderPosts()}</div>
    </div>
  );
};
export default ExplorePage;
