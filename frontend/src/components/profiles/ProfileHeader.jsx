import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TbArrowLeft } from "react-icons/tb";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: posts } = useQuery({ queryKey: ["posts"] });

  //functions
  const handlePageBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full flex justify-start items-center px-4 py-1 gap-x-10">
      <div
        onClick={handlePageBack}
        className="w-12 h-12 hover:bg-secondary transition duration-200 flex justify-center items-center rounded-full cursor-pointer"
      >
        <TbArrowLeft className="w-7 h-7 text-white" />
      </div>
      <div className="flex gap-10 px-4 py-2 items-center">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{authUser?.fullName}</span>
          <span className="text-sm text-slate-500">{posts?.length} posts</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
