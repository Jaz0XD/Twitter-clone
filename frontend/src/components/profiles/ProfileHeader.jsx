import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TbArrowLeft } from 'react-icons/tb'

const ProfileHeader = () => {
    const navigate = useNavigate();
    const { data: authUser } = useQuery({ queryKey: ['authUser'] });
    const { data: posts } = useQuery({ queryKey: ['posts'] });
    //functions
    const handlePageBack = () => {
        navigate(-1);
    };

    return (
        <div className='w-full flex justify-start items-center px-4 py-1 gap-x-10'>
            <div onClick={handlePageBack} className='w-12 h-12 hover:bg-secondary transition duration-200 flex justify-center items-center rounded-full cursor-pointer'>
                <TbArrowLeft className='w-7 h-7 text-white' />
            </div>
            <div className='flex flex-col justify-start'>
                <span className='text-[21px] font-bold'>{authUser.fullName}</span>
                <p className='text-gray-500'>{posts?.length} posts</p>
            </div>
        </div>
    )
}

export default ProfileHeader