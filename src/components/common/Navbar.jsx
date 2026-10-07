import { useEffect, useState, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/Logo/NavbarLogocopy.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { logout } from "../../services/operations/authAPI";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  const navRef = useRef(null);

  useOnClickOutside(navRef, () => setMobileMenuOpen(false));

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res?.data?.data || []);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  // Close mobile menu whenever location/route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileCatalogOpen(false);
  }, [location.pathname]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const defaultAvatar = user
    ? `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
      `${user?.firstName || "User"} ${user?.lastName || ""}`
    )}`
    : "";

  return (
    <header ref={navRef} className="sticky top-0 z-50 flex h-16 items-center justify-center border-b border-richblack-700 bg-richblack-900 backdrop-blur-md transition-all duration-300">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center">
          <ul className="flex gap-x-6 text-richblack-25 items-center">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="flex items-center">
                {link.title === "Catalog" ? (
                  <div className="group relative flex cursor-pointer items-center gap-1 text-richblack-25 hover:text-yellow-25 transition-colors py-2">
                    <p className={`flex items-center leading-none ${matchRoute("/catalog/:catalogName") ? "text-yellow-25 font-semibold" : ""}`}>
                      {link.title}
                    </p>
                    <BsChevronDown className="transition-transform duration-200 group-hover:rotate-180 text-xs text-richblack-200 group-hover:text-yellow-25" />

                    <div className="invisible absolute left-[50%] top-[100%] z-[1000] flex w-[220px] translate-x-[-50%] translate-y-3 flex-col rounded-xl bg-richblack-800 backdrop-blur-lg p-3 text-richblack-25 shadow-2xl border border-richblack-700 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100 lg:w-[280px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-4 w-4 translate-x-[-50%] translate-y-[-50%] rotate-45 rounded-sm bg-richblack-800 border-l border-t border-richblack-700"></div>
                      {loading ? (
                        <p className="py-2 text-center text-sm text-richblack-200 animate-pulse">Loading categories...</p>
                      ) : subLinks && subLinks.length ? (
                        <>
                          {subLinks
                            ?.filter((subLink) => subLink?.courses?.length > 0)
                            ?.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                className="rounded-lg py-2.5 px-3 hover:bg-richblack-700 hover:text-yellow-25 transition-colors text-sm font-medium"
                                key={i}
                              >
                                {subLink.name}
                              </Link>
                            ))}
                        </>
                      ) : (
                        <p className="py-2 text-center text-sm text-richblack-200">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path} className="flex items-center py-2">
                    <p
                      className={`leading-none transition-colors duration-200 ${matchRoute(link?.path)
                          ? "text-yellow-25 font-semibold"
                          : "text-richblack-25 hover:text-yellow-25"
                        }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Auth / Cart / Profile */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative p-2 rounded-full hover:bg-richblack-800 transition-colors">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-yellow-100 text-center text-xs font-bold text-richblack-900 shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-xl border border-richblack-700 bg-richblack-800 px-4 py-2 text-sm font-medium text-richblack-100 shadow-sm transition-all duration-200 hover:bg-richblack-700 hover:text-white hover:border-richblack-600 active:scale-95">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-xl bg-yellow-50 border border-yellow-100 px-4 py-2 text-sm font-medium text-richblack-900 shadow-sm transition-all duration-200 hover:bg-yellow-25 hover:scale-[1.02] active:scale-95">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden rounded-lg p-2 text-richblack-100 hover:bg-richblack-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <AiOutlineClose fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-richblack-900 border-b border-richblack-700 shadow-2xl md:hidden transition-all duration-300 z-50">
          <div className="flex flex-col p-5 gap-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Links */}
            <ul className="flex flex-col gap-y-3 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index} className="border-b border-richblack-800 pb-2">
                  {link.title === "Catalog" ? (
                    <div className="flex flex-col">
                      <button
                        onClick={() => setMobileCatalogOpen((prev) => !prev)}
                        className="flex items-center justify-between w-full py-1 text-left hover:text-yellow-25 transition-colors"
                      >
                        <span
                          className={`font-medium ${matchRoute("/catalog/:catalogName")
                              ? "text-yellow-25 font-semibold"
                              : "text-richblack-25"
                            }`}
                        >
                          {link.title}
                        </span>
                        {mobileCatalogOpen ? (
                          <BsChevronUp className="text-sm text-yellow-25" />
                        ) : (
                          <BsChevronDown className="text-sm text-richblack-200" />
                        )}
                      </button>

                      {/* Sublinks Accordion */}
                      {mobileCatalogOpen && (
                        <div className="mt-2 ml-3 flex flex-col gap-y-2 border-l-2 border-richblack-700 pl-3 py-1">
                          {loading ? (
                            <p className="text-xs text-richblack-300 animate-pulse">Loading categories...</p>
                          ) : subLinks && subLinks.length ? (
                            subLinks
                              ?.filter((subLink) => subLink?.courses?.length > 0)
                              ?.map((subLink, i) => (
                                <Link
                                  key={i}
                                  to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                  className="text-sm text-richblack-100 hover:text-yellow-25 transition-colors py-1"
                                >
                                  {subLink.name}
                                </Link>
                              ))
                          ) : (
                            <p className="text-xs text-richblack-300">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link?.path}
                      className={`block py-1 font-medium transition-colors ${matchRoute(link?.path)
                          ? "text-yellow-25 font-semibold"
                          : "text-richblack-25 hover:text-yellow-25"
                        }`}
                    >
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Auth / Profile / Cart Section */}
            <div className="pt-2 flex flex-col gap-y-3">
              {/* Cart for logged in student */}
              {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link
                  to="/dashboard/cart"
                  className="flex items-center gap-x-2 py-2 px-3 rounded-lg bg-richblack-800 hover:bg-richblack-700 text-richblack-100 transition-colors"
                >
                  <div className="relative">
                    <AiOutlineShoppingCart className="text-xl" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-yellow-100 text-[10px] font-bold text-richblack-900">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">Shopping Cart ({totalItems})</span>
                </Link>
              )}

              {/* Logged in User Profile Info & Dashboard/Logout buttons */}
              {token !== null && user ? (
                <div className="flex flex-col gap-y-3 bg-richblack-800 p-3 rounded-xl border border-richblack-700">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={user?.image || defaultAvatar}
                      alt={user?.firstName}
                      className="w-10 h-10 rounded-full object-cover border border-richblack-600"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-richblack-25">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-richblack-300">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-richblack-700">
                    <Link
                      to="/dashboard/my-profile"
                      className="flex items-center justify-center gap-x-2 py-2 px-3 rounded-lg bg-richblack-700 hover:bg-richblack-600 text-richblack-100 text-sm font-medium transition-colors"
                    >
                      <VscDashboard className="text-yellow-50" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout(navigate));
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-x-2 py-2 px-3 rounded-lg bg-pink-900 hover:bg-pink-800 text-pink-200 text-sm font-medium border border-pink-700 transition-colors cursor-pointer"
                    >
                      <VscSignOut />
                      Logout
                    </button>
                  </div>
                </div>
              ) : token === null ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link to="/login" className="w-full">
                    <button className="w-full rounded-xl border border-richblack-700 bg-richblack-800 px-4 py-2.5 text-sm font-medium text-richblack-100 shadow-sm transition-all duration-200 hover:bg-richblack-700 active:scale-95">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <button className="w-full rounded-xl bg-yellow-50 border border-yellow-100 px-4 py-2.5 text-sm font-medium text-richblack-900 shadow-sm transition-all duration-200 hover:bg-yellow-25 active:scale-95">
                      Sign up
                    </button>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

