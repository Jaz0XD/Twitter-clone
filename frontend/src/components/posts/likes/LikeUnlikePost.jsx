import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

const LikeUnlikePost = ({ post }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isLiked = post.likes.includes(authUser._id);
  const queryClient = useQueryClient();

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // will be returned updatedLikes' data
      // Update the cache directly for that post
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <div
      onClick={handleLikePost}
      className="flex w-1/3 justify-start group items-center"
    >
      {isLiking}
      <div className="w-12 h-12 -m-1 group-hover:bg-pink-500/15 flex justify-center items-center rounded-full">
        {!isLiked && !isLiking && (
          <IoHeartOutline className="w-5 h-5 cursor-pointer text-slate-500 group-hover:text-pink-500" />
        )}
        {isLiked && !isLiking && (
          <IoHeartSharp className="w-5 h-5 cursor-pointer text-pink-500" />
        )}
      </div>
      <span
        className={`text-lg group-hover:text-pink-500 ${
          isLiked ? "text-pink-500" : "text-slate-500"
        }`}
      >
        {post.likes.length}
      </span>
    </div>
  );
};

export default LikeUnlikePost;
