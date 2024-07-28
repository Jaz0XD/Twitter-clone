import CommentPostModal from '../comments/CommentPostModal'
import LikeUnlikePost from '../likes/LikeUnlikePost'
// Icons
import { BiRepost } from "react-icons/bi"
import { IoIosStats } from "react-icons/io"
import { FaRegBookmark } from "react-icons/fa6"
import { RiShare2Fill } from "react-icons/ri"


const FooterSection = ({ post }) => {
    return (
        <div className='flex justify-between mt-3'>
            <div className='flex gap-4 justify-between items-center w-full'>
                {/* Comment */}
                {/* Comment input popup using a modal component from DaisyUI */}
                <CommentPostModal post={post} />

                {/* Repost */}
                <div className='flex w-1/3 justify-start group items-center'>
                    <div className='w-12 h-12 -m-1 group-hover:bg-green-500/15 flex justify-center items-center rounded-full'>
                        <BiRepost className='w-7 h-7 cursor-pointer text-slate-500 group-hover:text-green-500' />
                    </div>
                    <span className='text-lg text-slate-500 group-hover:text-green-500'>
                        {/*//TODO REPOST SECTION */}
                    </span>
                </div>

                {/* Like and Unlike */}
                <LikeUnlikePost post={post} />

                {/* Stats */}
                <div className='flex w-1/3 justify-start items-center group cursor-pointer'>
                    <div className='w-12 h-12 -m-1 group-hover:bg-sky-400/15 flex justify-center items-center rounded-full'>
                        <IoIosStats className='w-6 h-6 text-slate-500 group-hover:text-sky-400' />
                    </div>
                    <span className='text-lg text-slate-500 group-hover:text-sky-400'>
                        {/* //TODO STATS SECTION */}
                    </span>
                </div>

                {/* Bookmark & Share*/}
                <div className='flex w-auto justify-end items-center'>
                    <div className='flex  justify-end items-center group'>
                        <div className='w-12 h-12 group-hover:bg-sky-400/15 flex justify-center items-center rounded-full'>
                            <FaRegBookmark className='w-5 h-5 text-slate-500 group-hover:text-sky-400 cursor-pointer' />
                        </div>
                    </div>
                    <div className='flex justify-end items-center group'>
                        <div className='w-12 h-12 group-hover:bg-sky-400/15 flex justify-center items-center rounded-full'>
                            <RiShare2Fill className='w-6 h-6 text-slate-500 hover:text-sky-400 cursor-pointer' />
                        </div>
                    </div>
                </div>         
            </div>
        </div>
    )
}

export default FooterSection