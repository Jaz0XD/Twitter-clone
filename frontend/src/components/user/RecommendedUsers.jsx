import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import useFollow from "../../hooks/useFollow";
import avatarImg from "../../../public/avatars/user-default.png";

const RecommendedUsers = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow } = useFollow();

  if (suggestedUsers?.length === 0) return <div className="md:w-0 w-64"></div>;
  return (
    <div className="border border-gray-700 rounded-[15px] mt-4 overflow-hidden">
      <p className="text-[20px] font-black p-4 pl-7">Who to follow</p>
      <div>
        {/* Skeletons */}
        {isLoading && (
          <div>
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
          </div>
        )}

        {!isLoading &&
          suggestedUsers?.map((user) => (
            <Link
              to={`/profile/${user.username}`}
              key={user?._id}
              className="flex items-center justify-between py-3 pr-2 pl-7 cursor-pointer hover:bg-[#16181C] transition-all duration-200"
            >
              {/* User info */}
              <div className="flex gap-2 items-center">
                {/* User image */}
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.profileImg || avatarImg} />
                  </div>
                </div>
                {/* User names */}
                <div className="flex flex-col w-18 lg:w-[200px]">
                  <span className="w-full text-md font-bold tracking-tight truncate hover:underline cursor-pointer">
                    {user.fullName}
                  </span>
                  <span className="w-full text-md text-gray-500">
                    @{user.username}
                  </span>
                </div>
              </div>

              {/* Follow button */}
              <div className="w-auto flex justify-center items-center rounded-full">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    follow(user._id);
                  }}
                  className="btn btn-md text-md border-none bg-primary text-white hover:bg-white hover:text-black hover:opacity-90 rounded-full cursor-pointer"
                >
                  Follow
                </button>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default RecommendedUsers;
