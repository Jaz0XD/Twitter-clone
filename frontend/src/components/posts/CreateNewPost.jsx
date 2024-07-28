import { useRef, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Icons
import { IoCloseSharp } from "react-icons/io5";
import { GrImage } from "react-icons/gr";
import { MdOutlineGifBox } from "react-icons/md";
import { RiListRadio } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import { LuCalendarClock } from "react-icons/lu";
// import { GrLocation } from "react-icons/gr";

const CreateNewPost = () => {
  const [text, setText] = useState("");
  const [img, setImage] = useState(null);
  const imageRef = useRef(null);
  const textareaRef = useRef(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, img }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      setText("");
      setImage(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleFocus = (e) => {
    e.preventDefault();
    const options = document.getElementById("options");
    if (options) {
      options.style.borderTop = "1px solid #1F2937";
    }
  };

  const handleBlur = () => {
    const options = document.getElementById("options");
    if (options) {
      options.style.borderTop = ""; // Remove the style
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex pt-4 px-6 items-start gap-4 border-b border-gray-800">
      {/* Avatar */}
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img
            src={
              authUser.profileImg ||
              "/avatar-placeholder.png"
            }
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
      >
        {/* Text */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={textareaRef}
          placeholder="What is happening?!"
          className="textarea w-full focus:min-h-[112px] p-0 mt-1 text-2xl font-medium resize-none border-none focus:outline-none"
        />
        {/* Image */}
        {img && (
          <div className="w-full flex justify-center items-center">
            <div className="relative w-full h-auto m-x-auto">
              <IoCloseSharp
                onClick={() => {
                  setImage(null);
                  imageRef.current.value = null;
                }}
                className="absolute top-1 right-1 text-white bg-gray-800 rounded-full w-10 h-10 p-2 cursor-pointer"
              />
              <img
                src={img}
                className="w-full max-auto object-contain rounded-[15px]"
              />
            </div>
          </div>
        )}

        {/* Options */}
        <div id="options" className="flex justify-between items-center py-2">
          <div className="flex gap-x-5 items-center">
            <GrImage
              className="text-primary w-6 h-7 cursor-pointer"
              onClick={() => imageRef.current.click()}
            />
            <MdOutlineGifBox className="text-primary w-7 h-7 cursor-pointer" />
            <RiListRadio className="text-primary w-6 h-7 cursor-pointer" />
            <BsEmojiSmile className="text-primary stroke-[0.5px] w-5 h-5 cursor-pointer" />
            <LuCalendarClock className="text-primary w-6 h-6 cursor-pointer" />
            {/* <GrLocation className="text-primary/50 w-6 h-6 cursor-pointer" /> */}
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageRef}
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full text-white text-lg font-black my-1 px-6">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Error notification */}
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};

export default CreateNewPost;
