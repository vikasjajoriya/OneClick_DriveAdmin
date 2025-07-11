import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";

export default function Layout({ children }) {
  const { logout, user } = useAuth();
  const dropdownRef = useRef(null);
  const router = useRouter();
  // console.log("user",user);
  
  const userName = user?.name;
  const userEmail = user?.email;
  const userInitial = userName?.split(" ")?.map(itm => itm?.charAt(0));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isActive = (path) =>
    router.pathname === path ? "bg-gray-200 text-black font-semibold" : "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-2xl bg-gray-100 border-4 border-gray-200 sm:hidden"
              >
                <div className="space-y-1">
                  <span className="block w-6 h-0.5 bg-gray-500"></span>
                  <span className="block w-6 h-0.5 bg-gray-500"></span>
                  <span className="block w-6 h-0.5 bg-gray-500"></span>
                </div>
              </button>
              <Link href="/dashboard" className="flex ms-2 md:me-24">
                <Image
                  src="https://www.oneclickdrive.com/application/views/images/main-logo-mob.svg?v=4"
                  className="me-3"
                  width={150}
                  height={40}
                  alt="oneclickdrive Logo"
                />
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3" ref={dropdownRef}>
                <div>
                  <button
                    type="button"
                    className="flex items-center justify-center w-8 h-8 bg-gray-800 text-white text-sm font-semibold rounded-full focus:ring-4 focus:ring-gray-300"
                    aria-expanded="false"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {userInitial}
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 top-[56px] w-56 z-50 bg-white border rounded-sm shadow-lg divide-y divide-gray-100">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {userName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {userEmail}
                      </p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <Link
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={logout}
                        >
                          Sign out
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 bg-white transition-transform duration-300 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 py-5 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${isActive(
                  "/dashboard"
                )}`}
              >
                <MdDashboard />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/audit-log"
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${isActive(
                  "/audit-log"
                )}`}
              >
                <FaListCheck />
                <span className="ms-3">Audit Logs</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* <main
        className={`transition-all duration-300 flex-1 bg-green-900 p-6 pt-20 ${
          sidebarOpen ? "ml-64" : "ml-0 sm:ml-64"
        }`}
      >
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-4">
          <div className="grid grid-cols-3 gap-4 mb-4">{children}</div>
        </div>
      </main> */}
      <main className="pt-14 min-h-screen bg-gray-200 z-10 relative sm:ml-64 w-full">
        {children}
      </main>
    </div>
  );
}
