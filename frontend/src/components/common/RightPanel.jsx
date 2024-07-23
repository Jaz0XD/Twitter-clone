// //* Importing required modules
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";

// //* Importing components
// import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
// import useFollow from "../../hooks/useFollow";
// import LoadingSpinner from "./LoadingSpinner";
// import SearchBox from "../utils/SearchBox";
// import Premium from "../utils/Premium";

// const RightPanel = () => {
//   const { data: suggestedUsers, isLoading } = useQuery({
//     queryKey: ["suggestedUsers"],
//     queryFn: async () => {
//       try {
//         const res = await fetch("/api/users/suggested");
//         const data = await res.json();
//         if (!res.ok) {
//           throw new Error(data.error || "Something went wrong");
//         }
//         return data;
//       } catch (error) {
//         throw new Error(error.message);
//       }
//     },
//   });

//   const { follow, isPending } = useFollow();

//   if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;

//   return (
//     <div className="hidden lg:block my-4 mx-2">
//       <div className="bg-[#16181C] p-4 mb-4 rounded-md fixed top-2">
//         <SearchBox />
//       </div>
//       <div className="bg-[#16181C] p-4 mb-4 rounded-md fixed top-2">
//         <p className="font-bold text-[18px] pt-1 pb-2">Who to follow</p>
//         <div className="flex flex-col gap-4">
//           {/* item */}
//           {isLoading && (
//             <>
//               <RightPanelSkeleton />
//               <RightPanelSkeleton />
//               <RightPanelSkeleton />
//               <RightPanelSkeleton />
//             </>
//           )}
//           {!isLoading &&
//             suggestedUsers?.map((user) => (
//               <Link
//                 to={`/profile/${user.username}`}
//                 className="flex items-center justify-between gap-4"
//                 key={user._id}
//               >
//                 <div className="flex gap-2 items-center">
//                   <div className="avatar">
//                     <div className="w-8 rounded-full">
//                       <img src={user.profileImg || "/avatar-placeholder.png"} />
//                     </div>
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="font-semibold tracking-tight truncate w-28">
//                       {user.fullName}
//                     </span>
//                     <span className="text-sm text-slate-500">
//                       @{user.username}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <button
//                     className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       follow(user._id);
//                     }}
//                   >
//                     {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
//                   </button>
//                 </div>
//               </Link>
//             ))}
//         </div>
//       </div>
//       <Premium />
//     </div>
//   );
// };
// export default RightPanel;

import SearchBox from "../utils/SearchBox";
import Premium from "../utils/Premium";
import RecommendedUsers from "../user/RecommendedUsers";

const RightPanel = () => {
  return (
    <div className="hidden md:block pt-4 pl-8 border-l border-gray-700">
      <div className="sticky top-0 left-0 bg-black p-2 z-20">
        <SearchBox />
      </div>
      <div className="z-0 h-screen sticky top-0 left-0 mb-20">
        <RecommendedUsers />
        <Premium />
      </div>
    </div>
  );
};

export default RightPanel;
