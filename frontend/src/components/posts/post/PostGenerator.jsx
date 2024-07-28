import { Link } from "react-router-dom";
import HeaderSection from "./HeaderSection";
import BodySection from "./BodySection";
import FooterSection from "./FooterSection";

const PostGenerator = ({ post }) => {
  const postOwner = post.user;

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-900/40">
        {/* Avatar */}
        <div className="avatar">
          <Link
            to={`/profile/${postOwner?.username}`}
            className="w-11 rounded-full overflow-hidden"
          >
            <img
              src={postOwner?.profileImg || "/avatar-placeholder.png"}
              alt=""
            />
          </Link>
        </div>

        <div className="flex flex-col flex-1 ">
          <HeaderSection post={post} />
          <BodySection post={post} />
          <FooterSection post={post} />
        </div>
      </div>
    </>
  );
};

export default PostGenerator;
