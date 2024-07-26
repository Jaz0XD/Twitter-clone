import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import useFollow from "../../hooks/useFollow";

// Function to fetch users from API
const fetchSuggestedUsers = async () => {
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
};

//TODO FIX THE CREATOR ACCOUNT
const CreatorAccounts = () => {
  const {
    data: suggestedUsers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: fetchSuggestedUsers,
  });
  const follow = useFollow(); // Assuming useFollow is a custom hook for follow functionality

  const targetUsername = "jazxd"; // Replace with the username you want to display

  // Filter suggestedUsers to only include the user with the targetUsername
  const filteredUser = suggestedUsers?.find(
    (user) => user.username === targetUsername
  );

  if (isLoading) return <RightPanelSkeleton />;
  if (error) return <p>Error: {error.message}</p>;

  if (!filteredUser) return <p>No user found.</p>;

  return (
    <div className="mt-4 overflow-hidden">
      <div>
        <Link
          to={`/profile/${filteredUser.username}`}
          key={filteredUser._id}
          className="flex items-center justify-between py-3 pr-2 pl-7 cursor-pointer hover:bg-[#16181C] transition-all duration-200"
        >
          {/* User info */}
          <div className="flex gap-2 items-center">
            {/* User image */}
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={filteredUser.profileImg || "/avatar-placeholder.png"}
                  alt={`${filteredUser.fullName}'s avatar`}
                />
              </div>
            </div>
            {/* User names */}
            <div className="flex flex-col w-18 lg:w-[200px]">
              <span className="w-full text-md font-bold tracking-tight truncate hover:underline cursor-pointer">
                {filteredUser.fullName}
              </span>
              <span className="w-full text-md text-gray-500">
                @{filteredUser.username}
              </span>
            </div>
          </div>

          {/* Follow button */}
          <div className="w-auto mr-4 flex justify-center items-center rounded-xl">
            <button
              onClick={(e) => {
                e.preventDefault();
                follow(filteredUser._id);
              }}
              className="btn btn-sm text-md border-none bg-primary text-white hover:bg-white hover:text-black hover:opacity-90 rounded-xl cursor-pointer"
            >
              Follow
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CreatorAccounts;
