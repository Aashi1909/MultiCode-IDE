import { useState, useEffect, useRef } from "react";
import logo from "../images/mainlogo.png";
import { FaRegUser } from "react-icons/fa";

const Navbar = ({ filteredLanguage, onLanguageChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
        className={`nav px-[100px] flex items-center justify-between h-[90px] bg-white text-black transition-colors duration-300`}
      >
        <img className="w-[110px] object-cover" src={logo} alt="" />

        <select
          className="border border-gray-300 rounded-lg p-2"
          value={filteredLanguage}
          onChange={onLanguageChange}
        >
          <option value="all">All</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="bash">Bash</option>
        </select>

        <div className="links flex items-center gap-[15px] relative">
          <div
            className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2  cursor-pointer hover:bg-red-100 p-2 border-black text-black`}
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <FaRegUser className={`text-3xl text-black  transition-all`} />
          </div>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className={`absolute top-[60px] right-0 bg-white text-black shadow-lg rounded-md w-[150px]`}
            >
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
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
