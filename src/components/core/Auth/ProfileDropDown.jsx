import { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { logout } from "../../../services/operations/authAPI";

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  if (!user) return null;

  // Fallback avatar URL using user initials
  const defaultAvatar = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
    `${user?.firstName || "User"} ${user?.lastName || ""}`
  )}`;

  return (
    <button className="relative flex items-center" onClick={() => setOpen((prev) => !prev)}>
      <div className="flex items-center gap-x-1.5 p-1 rounded-full hover:bg-richblack-800 transition-colors">
        <img
          src={imgError || !user?.image ? defaultAvatar : user?.image}
          onError={() => setImgError(true)}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[32px] rounded-full object-cover border border-richblack-700 shadow-sm"
        />
        <AiOutlineCaretDown className="text-xs text-richblack-200 transition-transform duration-200" />
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[125%] right-0 z-[1000] min-w-[150px] overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800/95 backdrop-blur-lg p-1 text-richblack-100 shadow-xl transition-all"
          ref={ref}
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-2 py-2 px-3 text-sm rounded-lg hover:bg-richblack-700 hover:text-richblack-25 transition-colors font-medium">
              <VscDashboard className="text-lg text-yellow-50" />
              Dashboard
            </div>
          </Link>
          <div
            onClick={() => {
              dispatch(logout(navigate));
              setOpen(false);
            }}
            className="flex w-full items-center gap-x-2 py-2 px-3 text-sm rounded-lg hover:bg-richblack-700 hover:text-pink-200 transition-colors font-medium cursor-pointer"
          >
            <VscSignOut className="text-lg text-pink-200" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
}