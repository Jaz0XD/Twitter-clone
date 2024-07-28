import { useEffect, useState, useRef } from 'react'
import useUpdateUserProfile from '../../hooks/useUpdateUserProfile'
import { RiCloseLine } from 'react-icons/ri'
import { MdOutlineAddAPhoto } from 'react-icons/md'

const ProfileEditorModal = ({ authUser, user }) => {
	const isMyProfile = authUser._id === user?._id;
	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
		coverImg: "",
		profileImg: "",
	});

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (state === 'coverImg') {
                    setCoverImg(reader.result);
                    setFormData((prevData) => ({ ...prevData, coverImg: reader.result }));
                } else if (state === 'profileImg') {
                    setProfileImg(reader.result);
                    setFormData((prevData) => ({ ...prevData, profileImg: reader.result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

	const handleCoverImgClear = () => {
		setCoverImg(null);
		setFormData((prevData) => ({ ...prevData, coverImg: "" }));
		coverImgRef.current.value = null;
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	
	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				className='btn border-[1px] px-5 border-gray-500 bg-black hover:border-gray-400 rounded-full btn-md text-lg font-extrabold'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-[20px] border-gray-700 shadow-md p-0'>
					<div className='flex flex-col gap-4 mb-8'>
						{/* Header */}
						<div className='sticky top-0 left-0 py-3 px-4 flex justify-between items-center w-full bg-black/80 backdrop-blur-sm z-10'>
							<div className='flex justify-between items-center gap-10'>
								<div className='modal-backdrop z-20'>
									<button onClick={() => document.getElementById("edit_profile_modal").close()}>
										<RiCloseLine className='text-3xl text-white cursor-pointer'/>
									</button>
								</div>
								<h3 className='font-extrabold text-2xl'>Edit Profile</h3>
							</div>
							{/* Save button */}
							<button 
								onClick={() => updateProfile(formData)}
								className='btn bg-white hover:bg-white/90 text-lg text-black rounded-full btn-md px-6'
							>
								{isUpdatingProfile ? 'Saving...' : 'Save'}
							</button>
						</div>

						<div className='mb-14 z-0'>		
							<div className='relative'>
								{/* Cover image */}
								<div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center gap-x-5 bg-black/40'>
									<div className='w-12 h-12 flex justify-center items-center bg-black/50 rounded-full cursor-pointer'>
										{isMyProfile && (
											<MdOutlineAddAPhoto onClick={() => coverImgRef.current.click()} className='w-6 h-6 text-gray-200' />
										)}
									</div>
									<div className='w-12 h-12 flex justify-center items-center bg-black/50 rounded-full cursor-pointer'>
										{isMyProfile && (
											<RiCloseLine 
												onClick={handleCoverImgClear} 
												className='w-6 h-6 text-gray-200' 
											/>
										)}
									</div>
									<input
										type='file'
										hidden
										accept='image/*'
										ref={coverImgRef}
										name='coverImage'
										onChange={(e) => handleImgChange(e, "coverImg")}
									/>
								</div>
								<img
									src={coverImg || user?.coverImg || '../../../public/images/blank.jpg'}
									className='w-full h-[130px] object-cover'
									alt='cover image'
								/>
								{/* User avatar image */}
								<div className='avatar absolute -bottom-16 left-6'>
									<div className='absolute top-8 left-8 flex justify-center items-center gap-x-5 z-10'>
										<div className='w-12 h-12 flex justify-center items-center bg-black/50 rounded-full cursor-pointer'>
											{isMyProfile && (
												<MdOutlineAddAPhoto 
													onClick={() => profileImgRef.current.click()} 
													className='w-6 h-6 text-gray-200'
												/>
											)}
										</div>
										<input
											type='file'
											hidden
											accept='image/*'
											ref={profileImgRef}
											name='profileImage'
											onChange={(e) => handleImgChange(e, "profileImg")}
										/>
									</div>
									<div className='rounded-full w-[90px] border-4 border-black brightness-75 z-0'>
										<img 
											src={profileImg || user?.profileImg || "/avatar-placeholder.png"} 
											className='brightness-75'
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='flex flex-col gap-y-8 px-5'>
							{/* Full name */}
							<div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>Name</span>
								<input
									type='text'
									placeholder='Full Name'
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.fullName}
									name='fullName'
									onChange={handleInputChange}
								/>
							</div>
							{/* Username */}
							<div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>Username</span>
								<input
									type='text'
									placeholder='Username'
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.username}
									name='username'
									onChange={handleInputChange}
								/>
							</div>
							{/* Email */}
							<div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>Email</span>
								<input
									type='email'
									placeholder='Email'
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.email}
									name='email'
									onChange={handleInputChange}
								/>
							</div>
							{/* Bio */}
							<div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>Bio</span>
								<textarea
									placeholder=''
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.bio}
									name='bio'
									onChange={handleInputChange}
								/>
							</div>
							{/* Location */}
							{/* <div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>Location</span>
								<input
									type='text'
									placeholder='Location'
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.location}
									name='location'
									onChange={handleInputChange}
								/>
							</div> */}
							{/* Website */}
							<div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>Website</span>
								<input
									type='text'
									placeholder='https://www.example.com'
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.link}
									name='link'
									onChange={handleInputChange}
								/>
							</div>
							{/* Current password */}
							<div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>Current Password</span>
								<input
									type='password'
									placeholder='Current Password'
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.currentPassword}
									name='currentPassword'
									onChange={handleInputChange}
								/>
							</div>
							{/* New password */}
							<div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>New Password</span>
								<input
									type='password'
									placeholder='New Password'
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.newPassword}
									name='newPassword'
									onChange={handleInputChange}
								/>
							</div>
							{/* Birth date */}
							<div className='flex flex-col border border-gray-700 rounded-md p-2'>
								<span className='text-sm text-gray-500 px-2'>Birth date</span>
								<input
									type='text'
									placeholder='Birth date'
									className='flex-1 input px-2 input-lg font-medium focus:outline-none focus:border-none'
									value={formData.birthDate}
									name='birthDate'
									onChange={handleInputChange}
								/>
							</div>
						</div>
					</div>
				</div>
			</dialog>
		</>
	);
};
export default ProfileEditorModal;