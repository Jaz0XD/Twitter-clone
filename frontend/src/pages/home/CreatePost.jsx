import { BsEmojiSmile } from "react-icons/bs";
import { useRef, useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { GrImage } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const textareaRef = useRef(null);

  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setPickerVisible(false);
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

  const {
    mutate: CreatePost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
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
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      //* Invalidate the posts query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["posts"] }); //* Adds the post to the screen (refetches and refreshes the page)
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    CreatePost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-2 pt-4 pr-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img src={authUser.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={textareaRef}
          placeholder="What is happening?!"
          className="textarea w-full focus:min-h-[112px] p-0 mt-1 text-xl font-medium resize-none border-none focus:outline-none"
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            {/* <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            /> */}
            <GrImage
              className="text-primary mr-1 w-6 h-7 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />

            {/* //TODO Fix emoji picker / Emoji tab opens but does not input in placeholder} */}

            <BsEmojiSmile
              className="text-primary ml-1 stroke-[0.5px] w-5 h-5 cursor-pointer"
              onClick={() => setPickerVisible(!isPickerVisible)}
            />
            {isPickerVisible && <EmojiPicker onEmojiClick={onEmojiClick} />}
            {chosenEmoji && <span>{chosenEmoji.emoji}</span>}
            {/* <BsEmojiSmileFill
              className="fill-primary w-5 h-5 cursor-pointer"
              onClick={() => imgRef.current.click()}
            /> */}
          </div>
          <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
