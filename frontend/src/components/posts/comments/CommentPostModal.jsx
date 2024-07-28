import { useRef, useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from 'react-hot-toast'
import { getDatePosted } from '../../../utils/date/index.js'
import LoadingSpinner from '../../common/LoadingSpinner.jsx'
import MoreButton from '../../posts/comments/MoreButton'
// Icons
import { FaRegComment } from "react-icons/fa"
import { GrImage } from "react-icons/gr"
import { MdOutlineGifBox } from "react-icons/md"
import { RiListRadio, RiCloseLine } from "react-icons/ri"
import { BsEmojiSmile } from "react-icons/bs"
import { LuCalendarClock } from "react-icons/lu"
// import { GrLocation } from "react-icons/gr"
import { IoCloseSharp } from "react-icons/io5"


const CommentPostModal = ({ post }) => {
    const { data: authUser } = useQuery({ queryKey: ['authUser'] });
    const postOwner = post?.user;
    const [comment, setComment] = useState('');
    const [barHeight, setBarHeight] = useState(0);
    const [img, setImage] = useState(null);
    const imageRef = useRef(null);
    const textareaRef = useRef(null);
    const postContainerRef = useRef(null);
    const queryClient = useQueryClient();
    const postedDate = getDatePosted(post?.createdAt);

    const isMyComment = (commentUserId) => commentUserId === authUser._id;

    const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async ({ comment, img }) => {
			try {
				const res = await fetch(`/api/posts/comment/${post?._id}`, {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({ text: comment, img: img }),
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
			setComment('');
            setBarHeight(0);
			queryClient.invalidateQueries({ queryKey: ["posts"] });
            document.getElementById(`comment_modal_${post?._id}`).close();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

    const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost({ comment, img });
	};

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

    const handleCloseModal = () => {
        document.getElementById(`comment_modal_${post._id}`).close();
        setBarHeight(0);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [comment]);

    useEffect(() => {
        if (postContainerRef.current) {
            setBarHeight(postContainerRef.current.scrollHeight);
        }
    }, [comment, barHeight]);

    return (
        <>
            <div
                onClick={() => document.getElementById(`comment_modal_${post._id}`).showModal()}
                className='flex w-1/3 justify-start items-center group cursor-pointer'
            >
                <div className='w-12 h-12 -m-1 group-hover:bg-sky-400/15 flex justify-center items-center rounded-full'>
                    <FaRegComment className='w-6 h-6 text-slate-500 group-hover:text-sky-400' />
                </div>
                <span className='text-lg text-slate-500 group-hover:text-sky-400'>
                    {post.comments.length}
                </span>
            </div>
            <dialog id={`comment_modal_${post._id}`} className='modal border-none outline-none bg-slate-400/30 flex items-start'>
                <div className='w-[600px] flex-col items-start bg-black mx-auto mt-12 rounded-[18px]'>
                    {/* Header */}
                    <div className='flex px-3 pt-4 justify-between items-center w-full'>
                        <div className='modal-backdrop z-30'>
                            <button onClick={handleCloseModal}>
                                <RiCloseLine className='text-3xl text-white cursor-pointer'/>
                            </button>
                        </div>
                        <h3 className='font-bold text-lg text-primary mr-4'>Draft</h3>
                    </div>
                    {/* posted user */}
                    <div className='flex flex-col gap-3  px-5 mt-8 overflow-auto'>
                        <div className='flex justify-start items-start'>
                            {/* Posted user image */}
                            <div className='avatar flex-col justify-center items-center'>
                                <div className='w-11 h-11 rounded-full'>
                                    <img src={postOwner?.profileImg || '/avatar-placeholder.png'} />
                                </div>
                                {/* Left bar */}
                                <div className='w-[1.5px] min-h-[50px] bg-white/40 my-2' style={{ height: barHeight }}></div>
                            </div>
                            {/* Posted user info */}
                            <div className='w-full flex-col text-xl ml-2'>
                                <div className='flex items-center gap-x-2'>
                                    <span className='text-white text-lg font-bold'>{postOwner?.fullName}</span>
                                    <span className='text-white/40 text-lg'>@{postOwner?.username}・{postedDate}</span>
                                </div>
                                {/* posted content */}
                                <div ref={postContainerRef} className='w-full flex gap-x-1 font-semibold'>
                                    <span className='text-lg whitespace-pre-wrap'>{post?.text}</span>
                                    {post?.img && (<span className='text-lg'>pic.x.com/randomCode123</span>)}
                                </div>
                                <div className='w-full flex gap-x-1 mt-4'>
                                    <span className='text-white/40 text-lg'>Replying to</span>
                                    <span className='text-primary text-lg'>@{postOwner?.username}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Others comments */}
                    {post.comments.map((comment) => (
                        <div key={comment._id} className='flex flex-col gap-3  px-5 mt-8 overflow-auto'>
                            <div className='flex justify-start items-start'>
                                {/* Commented user image */}
                                <div className='avatar flex-col justify-center items-center'>
                                    <div className='w-11 h-11 rounded-full'>
                                        <img src={comment.user?.profileImg || '/avatar-placeholder.png'} />
                                    </div>
                                    {/* Left bar */}
                                    <div className='w-[1.5px] min-h-[50px] bg-white/40 my-2' style={{ height: barHeight }}></div>
                                </div>
                                {/* Commented user info */}
                                <div className='w-full flex-col text-xl ml-2'>
                                    <div className='flex justify-between'>
                                        <div className='flex items-center gap-x-2'>
                                            <span className='text-white text-lg font-bold'>{comment.user?.fullName}</span>
                                            <span className='text-white/40 text-lg'>@{comment.user?.username}・{getDatePosted(comment?.createdAt)}</span>
                                        </div>
                                        {isMyComment(comment.user?._id) && (<MoreButton comment={comment} post={post} />)}
                                    </div>
                                    {/* comment */}
                                    <div ref={postContainerRef} className='w-full flex gap-x-1 font-semibold'>
                                        <span className='text-lg whitespace-pre-wrap'>{comment.text}</span>
                                        {comment.img && (<span className='text-lg'>pic.x.com/randomCode123</span>)}
                                    </div>
                                    <div className='w-full flex gap-x-1 mt-4'>
                                        <span className='text-white/40 text-lg'>Replying to</span>
                                        <span className='text-primary text-lg'>@{comment.user?.username}</span>
                                    </div>
                                </div>                               
                            </div>
                        </div>
                    ))}

                    {/* Send new comment */}
                    <form
                        onSubmit={handlePostComment}
                        className='flex flex-col gap-3 px-5 bg-black rounded-bl-[18px] rounded-br-[18px]' 
                    >
                        <div className='flex pt-4'>
                            {/* User image */}
                            <div className='w-11 h-11 rounded-xl'>
                                <img src={authUser?.profileImg || '/avatar-placeholder.png'} className='w-11 h-11 rounded-full' />
                            </div>
                            {/* Comment area */}
                            <textarea
                                ref={textareaRef}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder='Post your reply' 
                                className='textarea w-full min-h-[110px] px-3 text-2xl font-medium resize-none border-none focus:outline-none bg-black' 
                            />
                            {/* Image */}
                            {img && (
                                <div className='w-full flex justify-center items-center'>
                                    <div className='relative w-full h-auto m-x-auto'>
                                        <IoCloseSharp
                                            onClick={() => { setImage(null); imageRef.current.value = null; }}
                                            className='absolute top-1 right-1 text-white bg-gray-800 rounded-full w-10 h-10 p-2 cursor-pointer'
                                        />
                                        <img src={img} className='w-full max-auto object-contain rounded-[15px]' />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Options */}
                        <div id='options' className='flex justify-between items-center py-2'>
                            <div className='flex gap-x-5 items-center'>
                                <GrImage
                                    className='text-primary w-6 h-7 cursor-pointer'
                                    onClick={() => imageRef.current.click()}
                                />
                                <MdOutlineGifBox className='text-primary w-7 h-7 cursor-pointer' />
                                <RiListRadio className='text-primary w-6 h-7 cursor-pointer' />
                                <BsEmojiSmile className='text-primary stroke-[0.5px] w-5 h-5 cursor-pointer' />
                                <LuCalendarClock className='text-primary w-6 h-6 cursor-pointer' />
                                {/* <GrLocation className='text-primary/50 w-6 h-6 cursor-pointer' /> */}
                            </div>
                            <input type='file' accept='image/*' hidden ref={imageRef} onChange={handleImgChange} />
                            <button className={`btn btn-primary rounded-full text-white text-lg font-black my-1 px-6 ${comment || img ? 'active' : 'disabled brightness-50'}`}>
                                {isCommenting ? <LoadingSpinner size='md' /> : 'Reply'}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
            
        </>
    )
}

export default CommentPostModal