import { useEffect, useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
// Icons
import { TbSettings } from 'react-icons/tb'
import { FaTrash } from 'react-icons/fa'

const SettingButton = () => {
    const queryClient = useQueryClient();
    const notificationPopupRef = useRef(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

    const handleDeleteNotifications = (e) => {
        e.preventDefault();
		deleteNotifications();
	};

    const toggleNotificationPopup = (e) => {
        e.preventDefault();
        setIsPopupVisible(!isPopupVisible);
    }

    const handleClickOutside = (event) => {
        if (notificationPopupRef.current && !notificationPopupRef.current.contains(event.target)) {
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
            <div onClick={toggleNotificationPopup} className='w-11 h-11 hover:bg-secondary transition duration-200 flex justify-center items-center rounded-full cursor-pointer'>
                <TbSettings className='w-6 h-6 text-white' />
            </div>
            {/* Popup */}
            {isPopupVisible && (
                <div id='comment-popup' ref={notificationPopupRef} className='absolute top-4 right-2 z-20'>
                    <div className='relative min-w-[350px] h-auto bg-black flex flex-col justify-center rounded-[15px] z-10 overflow-hidden cursor-pointer text-red-500'>
                        <div onClick={handleDeleteNotifications} className='flex justify-start items-center gap-x-4 text-xl font-extrabold hover:bg-stone-900 transition-all duration-200 py-3 px-4 cursor-pointer'>
                            <FaTrash className='w-6 h-6 ' />
                            <p>Delete all notifications</p>
                        </div>
                    </div>
                    <div className="absolute inset-[2px] rounded-[14px] blur-sm bg-gradient-to-br from-white via-white to-white z-0"></div>
                </div>
            )}
        </>
    )
}

export default SettingButton