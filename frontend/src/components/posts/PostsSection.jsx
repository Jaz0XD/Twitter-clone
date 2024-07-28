import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import PostGenerator from './post/PostGenerator'
import LoadingSpinner from '../common/LoadingSpinner'

const PostsSection = ({ feedType, username, userId }) => {
    const getPostEndpoint = () => {
        switch (feedType) {
            case 'forYou':
                return '/api/posts/all';
            case 'following':
                return '/api/posts/following';
            case 'posts':
                return `/api/posts/user/${username}`;
            // case 'replies':
            //     return `/api/posts/user/${username}`;
            // case 'highlights':
            //     return `/api/posts/user/${username}`;
            // case 'articles':
            //     return `/api/posts/user/${username}`;
            // case 'media':
            //     return `/api/posts/user/${username}`;
            case 'likes':
                return `api/posts/likes/${userId}`;
            default:
                return '/api/posts/all';
        }
    };
    const POST_ENDPOINT = getPostEndpoint();

    const { data: posts, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            try {
                const res = await fetch(POST_ENDPOINT);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Oops! Something went wrong');
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        }
    });

    useEffect(() => {
		refetch();
	}, [feedType, username, refetch]);

    const sortedPosts = posts ? [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

    return (
        <> 
            {(isLoading || isRefetching) && (
                <div className='w-full h-auto flex justify-center'>
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && !isRefetching && posts?.length === 0 && (
                <div className='w-full flex justify-center'>
                    <p>No posts in this tab.</p>
                </div>
            )}
            {!isLoading && !isRefetching && posts && (
                <div>
                    {sortedPosts.map((post) => (
                        <PostGenerator key={post?._id} post={post} />
                    ))}
                </div>
            )}

        </>
    )
}

export default PostsSection