import { Link } from "react-router-dom";

const Premium = () => {
    return (
        <div className='flex flex-col border border-gray-700 rounded-[15px] mt-6 pl-3'>
            <p className='text-2xl font-black p-4'>Subscribe to Premium</p>
            <p className='max-w-[300px] text-lg pl-4'>Subscribe to unlock new features and, if eligible, receive a share of ads revenue.</p>
            <Link to='/' className='p-4'>
                <button
                    onClick={(e) => {e.preventDefault(); }}
                    className='btn btn-md text-lg border-none bg-primary text-white hover:bg-white hover:text-black hover:opacity-90 rounded-full cursor-pointer'
                >
                    Subscribe
                </button>
            </Link>
        </div>
    )
}

export default Premium