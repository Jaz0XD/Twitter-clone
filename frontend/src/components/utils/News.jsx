// import { Link } from "react-router-dom";
// import { RiMoreFill } from 'react-icons/ri'
// import newsImage from '../../../public/images/news1.jpg'

// const News = () => {
//     return (
//         <div className='border border-gray-700 rounded-[15px] mt-6 overflow-hidden'>
//             <p className='text-2xl font-black p-4 pl-7'>Trending News</p>
//             <div>
//                 {/* Top news */}
//                 <Link
//                     to='/'
//                     className='flex items-center justify-between py-3 pr-4 pl-7 cursor-pointer hover:bg-[#16181C] transition-all duration-200' 
//                 >
//                     <div className='flex gap-2 items-center'>
//                         {/* news image */}
//                         <div className='avatar'>
//                             <div className='w-20 rounded-lg'>
//                                 <img src={newsImage} />
//                             </div>
//                         </div>
//                         {/* news title */}
//                         <div className='flex flex-col w-18 lg:w-[200px]'>
//                             <span className='w-full text-lg font-bold tracking-tight truncate hover:underline cursor-pointer'>
//                                 News Title
//                             </span>
//                             <span className='w-full text-lg text-gray-500'>
//                                 Showing Genre
//                             </span>
//                         </div>
//                     </div>
//                 </Link>

//                 {/* Other news */}
//                 <Link
//                     to={`/profile/user.username`}
//                     key='user?._id'
//                     className='flex items-start justify-between py-3 pr-4 pl-7 cursor-pointer hover:bg-[#16181C] transition-all duration-200' 
//                 >
//                     <div className='flex gap-2 items-center'>
//                         <div className='flex flex-col w-18 lg:w-[200px]'>
//                             <span className='w-full text-lg text-gray-500'>
//                                 Trending in your Country
//                             </span>
//                             <span className='w-full text-lg font-black tracking-tight truncate hover:underline cursor-pointer'>
//                                 Trending word
//                             </span>
//                             <span className='w-full text-lg text-gray-500'>
//                                 44.5K posts
//                             </span>
//                         </div>
//                     </div>
//                     {/* More icon */}
//                     <div className='flex w-1/3 justify-end items-center group cursor-pointer'>
//                         <div className='w-12 h-12 -m-1 group-hover:bg-sky-400/15 flex justify-center items-center rounded-full'>
//                             <RiMoreFill className='w-6 h-6 text-slate-500 group-hover:text-sky-400' />
//                         </div>
//                     </div>
//                 </Link>
//                 <Link
//                     to={`/profile/user.username`}
//                     key='user?._id'
//                     className='flex items-start justify-between py-3 pr-4 pl-7 cursor-pointer hover:bg-[#16181C] transition-all duration-200' 
//                 >
//                     <div className='flex gap-2 items-center'>
//                         <div className='flex flex-col w-18 lg:w-[200px]'>
//                             <span className='w-full text-lg text-gray-500'>
//                                 Trending in your Country
//                             </span>
//                             <span className='w-full text-lg font-black tracking-tight truncate hover:underline cursor-pointer'>
//                                 Trending word
//                             </span>
//                             <span className='w-full text-lg text-gray-500'>
//                                 44.5K posts
//                             </span>
//                         </div>
//                     </div>
//                     {/* More icon */}
//                     <div className='flex w-1/3 justify-end items-center group cursor-pointer'>
//                         <div className='w-12 h-12 -m-1 group-hover:bg-sky-400/15 flex justify-center items-center rounded-full'>
//                             <RiMoreFill className='w-6 h-6 text-slate-500 group-hover:text-sky-400' />
//                         </div>
//                     </div>
//                 </Link>
//                 <Link
//                     to={`/profile/user.username`}
//                     key='user?._id'
//                     className='flex items-start justify-between py-3 pr-4 pl-7 cursor-pointer hover:bg-[#16181C] transition-all duration-200' 
//                 >
//                     <div className='flex gap-2 items-center'>
//                         <div className='flex flex-col w-18 lg:w-[200px]'>
//                             <span className='w-full text-lg text-gray-500'>
//                                 Trending in your Country
//                             </span>
//                             <span className='w-full text-lg font-black tracking-tight truncate hover:underline cursor-pointer'>
//                                 Trending word
//                             </span>
//                             <span className='w-full text-lg text-gray-500'>
//                                 44.5K posts
//                             </span>
//                         </div>
//                     </div>
//                     {/* More icon */}
//                     <div className='flex w-1/3 justify-end items-center group cursor-pointer'>
//                         <div className='w-12 h-12 -m-1 group-hover:bg-sky-400/15 flex justify-center items-center rounded-full'>
//                             <RiMoreFill className='w-6 h-6 text-slate-500 group-hover:text-sky-400' />
//                         </div>
//                     </div>
//                 </Link>
//             </div>
//         </div>
//     )
// }

// export default News