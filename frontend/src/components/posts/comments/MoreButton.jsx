import { useState, useEffect, useRef } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query' 
import { toast } from 'react-hot-toast'
//icons
import { RiMoreFill } from 'react-icons/ri'
import { FaTrash } from 'react-icons/fa'


const MoreButton = ({ comment, post }) => {
    const queryClient = useQueryClient();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const commentPopupRef = useRef(null);
    
    const { mutate: deleteComment } = useMutation({
        mutationFn: async (commentId) => {
            try {
                const res = await fetch(`/api/posts/comment/${commentId}`, {
                    method: 'DELETE',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Something went wrong');
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: (updatedComments) => {
            setIsPopupVisible(false);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            document.getElementById(`comment_modal_${post._id}`).close();
            queryClient.setQueryData(["comments"], (oldData) => {
				return oldData.map((c) => {
					if (c._id === comment._id) {
						return { ...c, comments: updatedComments };
					}
					return c;
				});
			});
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleDeleteComment = (e) => {
        e.preventDefault();
		deleteComment(comment._id);
	};

    const toggleCommentPopup = (e) => {
        e.preventDefault();
        setIsPopupVisible(!isPopupVisible);
    };

    const handleClickOutside = (event) => {
        if (commentPopupRef.current && !commentPopupRef.current.contains(event.target)) {
            setIsPopupVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className='relative flex w-1/3 justify-end items-center group cursor-pointer pt-1'>
                <div 
                    onClick={toggleCommentPopup}
                    className='w-11 h-11 -m-1 group-hover:bg-sky-400/15 flex justify-center items-center rounded-full'
                >
                    <RiMoreFill className='w-6 h-6 text-slate-500 group-hover:text-sky-400' />
                </div>
                {/* Popup */}
                {isPopupVisible && (
                    <div id='comment-popup' ref={commentPopupRef} className='absolute top-1 -right-2 z-20'>
                        <div className='relative min-w-[350px] h-auto bg-black flex flex-col justify-center rounded-[15px] z-10 overflow-hidden'>
                            <div onClick={handleDeleteComment} className='flex justify-start items-center gap-x-4 text-xl font-extrabold hover:bg-stone-900 transition-all duration-200 py-3 px-4 cursor-pointer'>
                                <FaTrash className='w-6 h-6' />
                                <p>Delete comment</p>
                            </div>
                        </div>
                        <div className="absolute inset-[2px] rounded-[14px] blur-sm bg-gradient-to-br from-white via-white to-white z-0"></div>
                    </div>
                )}
            </div>
        </>
    )
}

export default MoreButton