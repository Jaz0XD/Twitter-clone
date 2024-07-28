import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ProfileHeader from '../../components/profiles/ProfileHeader'
import ProfileMain from '../../components/profiles/ProfileMain'
import ProfileHeaderSkeleton from '../../components/skeletons/ProfileHeaderSkeleton'
import PostsSection from '../../components/posts/PostsSection'

const ProfilePage = () => {
    const [feedType, setFeedType] = useState('posts');
    const { username } = useParams();
    const menuList = [
        'posts',
        // 'replies',
        // 'highlights',
        // 'articles',
        // 'media',
        'likes',
    ];

    const { data: user, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Something went wrong');
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        }
    });
    
    useEffect(() => { // when changing username in the parameter, refetch the page
        refetch();
    }, [username, user, refetch]);

    return (
        <div className='md:w-[600px]'>
            {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
            {!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
            <div className='sticky top-0 left-0 flex flex-col w-full bg-black/90'>
                {!isLoading && !isRefetching && user && (
                    <>
                        <ProfileHeader />
                        <ProfileMain user={user} />
                        <div className='flex w-full h-16 items-center border-b border-gray-700'>
                            {menuList.map((menu, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-center flex-1 p-4 hover:bg-secondary transition duration-200 capitalize cursor-pointer relative text-lg ${feedType === menu ? 'font-black text-white' : 'font-semibold text-gray-500'}`}
                                    onClick={() => setFeedType(menu)}
                                >
                                {menu}
                                {feedType === menu && (
                                    <div className='absolute bottom-0 w-[70px] h-[4px] rounded-full bg-primary'></div>
                                )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {/* Render content */}
                <div>
                    <PostsSection feedType={feedType} username={username} userId={user?._id} />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage