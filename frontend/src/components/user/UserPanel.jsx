import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Icon
import { RiMoreFill } from "react-icons/ri";

const UserPanel = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userSectionRef = useRef(null);
  const popupRef = useRef(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const togglePopup = (e) => {
    e.preventDefault();
    setIsPopupVisible((prev) => !prev);
  };

  const renderLoginPage = () => {
    navigate("/login");
  };

  const handleClickOutside = (e) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target) &&
      userSectionRef.current &&
      !userSectionRef.current.contains(e.target)
    ) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {authUser && (
        <div className="relative inline-block">
          {/* user section */}
          <div
            ref={userSectionRef}
            className="w-auto h-auto flex justify-center items-center hover:bg-stone-900 transition-all rounded-full duration-200 p-4 mt-16 cursor-pointer z-0"
          >
            <div
              onClick={togglePopup}
              className="flex flex-row justify-between items-center lg:w-[230px] mx-auto"
            >
              <div className="avatar md:inline-flex">
                <div className="w-12 rounded-full">
                  <img
                    src={
                      authUser?.profileImg ||
                      "/avatar-placeholder.png"
                    }
                  />
                </div>
              </div>
              <div className="hidden lg:block mr-2">
                <p className="text-white font-bold text-xl max-w-[120px] truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-xl">@{authUser?.username}</p>
              </div>
              <RiMoreFill className="hidden lg:block w-6 h-6 font-semibold cursor-pointer" />
            </div>
          </div>

          {/* Popup */}
          {isPopupVisible && (
            <div ref={popupRef} className="absolute bottom-24 left-1 z-50">
              <div className="relative w-[290px] h-[120px] bg-black flex flex-col justify-center rounded-[18px] z-10 overflow-hidden">
                <ul className="">
                  <li
                    onClick={renderLoginPage}
                    className="text-xl font-extrabold hover:bg-stone-900 transition-all duration-200 py-3 px-4 cursor-pointer"
                  >
                    Add an existing account
                  </li>
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      const confirmLogout = window.confirm(
                        "Are you sure you want to logout?"
                      );
                      if (confirmLogout) {
                        logout();
                      }
                    }}
                    className="text-xl font-extrabold hover:bg-stone-900 transition-all duration-200 py-3 px-4 cursor-pointer"
                  >
                    Log out of @{authUser?.username}
                  </li>
                </ul>
              </div>
              <div className="absolute inset-[2px] rounded-[18px] blur-sm bg-gradient-to-br from-white via-white to-white z-0"></div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserPanel;
