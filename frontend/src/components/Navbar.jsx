import { useState, useEffect, useRef } from "react";
import logo from "../images/mainlogo.png";
import { FaRegUser } from "react-icons/fa";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; 

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme(); 

  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div
        className={`nav px-[100px] flex items-center justify-between h-[90px] ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        } shadow-xl transition-colors duration-300`}
      >
        <img className="w-[110px] object-cover" src={logo} alt="" />
        <div className="links flex items-center gap-[15px] relative">
          <div
            className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-2"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <FaSun className="text-2xl text-yellow-400" />
            ) : (
              <FaMoon className="text-2xl text-gray-800" />
            )}
          </div>

          <div
            className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2  cursor-pointer hover:bg-red-100 dark:hover:bg-gray-700 p-2 ${
              darkMode ? "border-white" : "border-black"
            }`}
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <FaRegUser
              className={`text-3xl ${
                darkMode ? "text-white" : "text-black"
              } transition-all`}
            />
          </div>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className={`absolute top-[60px] right-0 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } shadow-lg rounded-md w-[150px]`}
            >
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
