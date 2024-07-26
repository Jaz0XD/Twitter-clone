import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../common/LoadingSpinner'
// Icons
import { BsPersonFill } from 'react-icons/bs'
import { IoHeartSharp } from 'react-icons/io5'
// import { PiStarFourFill } from 'react-icons/pi' // when a new post is posted by a following user 

const AllNotifications = () => {
    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/notifications");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Something went wrong');
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });
    
    const sortedNotifications = notifications ? [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
   
    return (
        <>
            {/* Loading */}
            {isLoading && (
                <div className='flex justify-center h-full items-center'>
                    <LoadingSpinner size='lg' />
                </div>
            )}

            {/* Notifications */}
            <div className='flex flex-col z-0'>
                {sortedNotifications?.length === 0 && 
                    <div className='text-center p-4 font-bold'>No notifications</div>
                }
                {sortedNotifications?.map((notification) => (
                    <div className='border-b border-gray-700 hover:bg-secondary/50 cursor-pointer' key={notification._id}>
                        <div className='flex gap-3 py-4 px-8'>
                            {notification.type === "follow" && <BsPersonFill className='w-9 h-9 text-primary' />}
                            {notification.type === "like" && <IoHeartSharp className='w-9 h-9 text-pink-600' />}
                            <Link to={`/profile/${notification.from.username}`}>
                                <div className='avatar'>
                                    <div className='w-9 rounded-full'>
                                        <img src={notification.from.profileImg || "/avatar-placeholder.png"} />
                                    </div>
                                </div>
                                <div className='flex gap-1 text-lg font-medium mt-2'>
                                    <p className='font-bold hover:underline text-white'>{notification.from.username}</p>
                                    <p className=''>
                                        {notification.type === "follow" ? "followed you" : "liked your post"}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default AllNotifications