import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/NavbarLogocopy.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-center border-b border-richblack-700/60 bg-richblack-900/80 backdrop-blur-md transition-all duration-300">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        
        {/* Navigation links */}
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
                    
                    <div className="invisible absolute left-[50%] top-[100%] z-[1000] flex w-[220px] translate-x-[-50%] translate-y-3 flex-col rounded-xl bg-richblack-800/95 backdrop-blur-lg p-3 text-richblack-25 shadow-2xl border border-richblack-700 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100 lg:w-[280px]">
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
                                className="rounded-lg py-2.5 px-3 hover:bg-richblack-700/60 hover:text-yellow-25 transition-colors text-sm font-medium"
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
                      className={`leading-none transition-colors duration-200 ${
                        matchRoute(link?.path)
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

        {/* Auth / Cart / Profile */}
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
              <button className="rounded-xl border border-richblack-700 bg-richblack-800/80 px-4 py-2 text-sm font-medium text-richblack-100 shadow-sm transition-all duration-200 hover:bg-richblack-700 hover:text-white hover:border-richblack-600 active:scale-95">
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

        <button className="mr-4 md:hidden rounded-lg p-2 text-richblack-100 hover:bg-richblack-800">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
