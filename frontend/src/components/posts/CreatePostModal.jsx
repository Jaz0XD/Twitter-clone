import { useRef, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Icons
import { IoCloseSharp } from "react-icons/io5";
import { GrImage } from "react-icons/gr";
import { MdOutlineGifBox } from "react-icons/md";
import { RiListRadio, RiCloseLine, RiQuillPenFill } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import { LuCalendarClock } from "react-icons/lu";
// import { GrLocation } from "react-icons/gr";

const CreatePostModal = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [text, setText] = useState("");
  const [img, setImage] = useState(null);
  const imageRef = useRef(null);
  const textareaRef = useRef(null);
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
      document.getElementById("create_post_dialog").close();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
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
    <>
      <button
        onClick={() =>
          document.getElementById("create_post_dialog").showModal()
        }
        className="flex justify-center items-center w-[55px] lg:w-[230px] h-[55px] ml-2 rounded-full bg-primary hover:brightness-[80%] transition-all duration-200 text-white mt-7"
      >
        <p className="hidden lg:block lg:text-2xl lg:font-bold">Post</p>
        <RiQuillPenFill className="w-9 h-9 lg:hidden" />
      </button>
      {/* Dialog */}
      <dialog
        id="create_post_dialog"
        className="modal border-none outline-none bg-slate-400/30 flex items-start"
      >
        <div className="w-[600px] min-h-10 flex-col items-start bg-black mx-auto mt-12 rounded-[20px]">
          <div className="w-full flex flex-col pt-4 px-6 items-start gap-4">
            {/* Header */}
            <div className="flex px-3 justify-between items-center w-full">
              <div className="modal-backdrop z-30">
                <button
                  onClick={() =>
                    document.getElementById("create_post_dialog").close()
                  }
                >
                  <RiCloseLine className="text-3xl text-white cursor-pointer" />
                </button>
              </div>
              <h3 className="font-bold text-lg text-primary mr-4">Draft</h3>
            </div>
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-1 w-full p-3 text-lg resize-none border-none focus:outline-none"
            >
              <div className="flex w-full">
                {/* User photo */}
                <div className="avatar">
                  <div className="w-11 h-11 rounded-full">
                    <img
                      src={
                        authUser.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex-col w-full">
                  {/* Text */}
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    ref={textareaRef}
                    placeholder="What is happening?!"
                    className="textarea w-full min-h-[200px] p-3 text-2xl font-medium resize-none border-none focus:outline-none bg-black"
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
                </div>
              </div>

              {/* Options */}
              <div
                id="options"
                className="flex justify-between items-center py-2 border-t border-[#1F2937]"
              >
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
                <button
                  className={`btn btn-primary rounded-full text-white text-lg font-black my-1 px-6 ${
                    text || img ? "active" : "disabled brightness-50"
                  }`}
                >
                  {isPending ? "Posting..." : "Post"}
                </button>
              </div>

              {/* Error notification */}
              {isError && <div className="text-red-500">{error.message}</div>}
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreatePostModal;
