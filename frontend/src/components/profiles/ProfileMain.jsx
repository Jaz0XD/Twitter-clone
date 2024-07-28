import { useQuery } from '@tanstack/react-query'
import { getDateUserJoined } from '../../utils/date/index.js'
import ProfileEditorModal from './ProfileEditorModal'
import useFollow from '../../hooks/useFollow'
// Icons
import { RiLink, RiMoreLine } from "react-icons/ri"
// import { GrLocation } from "react-icons/gr"
import { PiCalendarDots } from "react-icons/pi"
import { TbMail } from "react-icons/tb"

const ProfileMain = ({ user }) => {
    const { data: authUser } = useQuery({ queryKey: ['authUser'] });
	const { follow, isPending } = useFollow();
	const isMyProfile = authUser._id === user?._id;
	const amIFollowing = authUser?.following.includes(user?._id);
    const joinedDate = getDateUserJoined(user?.createdAt);

    return (
        <>
            {/* Cover image */}
            <div className='relative group/cover'>
                <img
                    src={user?.coverImg || '../../../public/images/blank.jpg'}
                    className='w-full h-60 object-cover'
                    alt='cover image'
                />
                {/* User avatar image */}
                <div className='avatar absolute -bottom-20 left-8'>
                    <div className='rounded-full w-[140px] relative group/avatar border-4 border-black'>
                        <img src={user?.profileImg || "/avatar-placeholder.png"} />
                    </div>
                </div>
            </div>
            {/* Edit profile button */}
            <div className='flex justify-end px-4 mt-5'>
                {isMyProfile && <ProfileEditorModal authUser={authUser} user={user} />}
                {!isMyProfile && (
                    <div className='flex gap-x-3'>
                        <button className='w-11 h-11 flex justify-center items-center border border-gray-500 rounded-full hover:bg-white/10'>
                            <RiMoreLine className='w-6 h-6' />
                        </button>
                        <button className='w-11 h-11 flex justify-center items-center border border-gray-500 rounded-full hover:bg-white/10'>
                            <TbMail className='w-6 h-6' />
                        </button>
                        <button
                            className='w-24 h-11 border rounded-full bg-white hover:bg-white/90 text-black text-lg font-bold'
                            onClick={() => follow(user?._id)}
                        >
                            {isPending && "Loading..."}
                            {!isPending && amIFollowing && "Unfollow"}
                            {!isPending && !amIFollowing && "Follow"}
                        </button>
                    </div>
                )}
            </div>
            {/* User information */}
            <div className='flex flex-col gap-4 mt-12 px-4'>
                <div className='flex flex-col'>
                    {/* Full name */}
                    <span className='font-bold text-3xl'>{user?.fullName}</span>
                    {/* Username */}
                    <span className='text-xl text-slate-500'>@{user?.username}</span>
                    {/* Bio */}
                    <span className='text-xl my-1 text-white'>{user?.bio}</span>

                    <div className='flex items-center gap-3 flex-wrap text-gray-500 text-lg font-medium'>
                        {/* Location */}
                        {/* <div className='flex gap-1 items-center'>
                            <GrLocation className='w-5 h-5' />
                            <span>{user?.location}</span>
                        </div> */}
                        {/* Link */}
                        {user?.link && (
                            <div className='flex gap-1 items-center'>
                                <>
                                    <RiLink className='w-5 h-5' />
                                    <a
                                        href={user?.link}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='text-sm text-primary hover:underline'
                                    >
                                        {user?.link}
                                    </a>
                                </>
                            </div>
                        )}
                        {/* Joined date */}
                        <div className='flex gap-1 items-center'>
                            <PiCalendarDots className='w-5 h-5' />
                            <span>{joinedDate}</span>
                        </div>
                    </div>

                    <div className='flex gap-4 text-lg my-4'>
                        {/* The number of followings */}
                        <div className='flex gap-1 items-center text-white hover:underline cursor-pointer'>
                            <span className='font-extrabold text-white'>{user?.following.length}</span>
                            <span className='text-gray-500'>Following</span>
                        </div>
                        {/* The number of followers */}
                        <div className='flex gap-1 items-center hover:underline cursor-pointer'>
                            <span className='font-extrabold text-white'>{user?.followers.length}</span>
                            <span className='text-gray-500'>Followers</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileMain