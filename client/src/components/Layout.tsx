import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import arenaImage from '/motorpoint-arena-nottingham.svg?url';

type LayoutProps = {
  darkMode: boolean;
};

const Layout: React.FC<LayoutProps> = ({ darkMode }) => {
  const [expandNav, setExpandNav] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setExpandNav(false);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex gap-16 sm:justify-normal justify-between lg:px-16 relative h-28 p-4 items-center">
        <div className="py-5 px-0.5">
          <img src={arenaImage} className="w-56" alt="" />
        </div>
        <i
          onClick={() => setExpandNav(!expandNav)}
          className={`${
            expandNav ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
          } text-[#004996] text-2xl sm:!hidden block font-extrabold cursor-pointer`}
        ></i>
        <ul
          aria-expanded={expandNav ? 'true' : 'false'}
          className={`flex z-10 sm:aria-expanded:overflow-visible origin-top duration-300 ease-in-out transition-all sm:overflow-visible overflow-hidden aria-expanded:overflow-visible sm:aria-expanded:*:pointer-events-auto sm:*:pointer-events-auto aria-expanded:*:pointer-events-auto pointer-events-none sm:aria-expanded:scale-y-100 sm:scale-y-100 scale-y-0 aria-expanded:scale-y-100 sm:bg-transparent  sm:flex-row flex-col absolute top-24 sm:top-0 left-0  sm:relative  sm:w-fit w-full items-center *:h-full *:flex *:items-center sm:h-full *:lg:text-sm *:text-xs *:font-[600] ${
            darkMode ? '*:text-[#ffffff]' : '*:text-[#004996]'
          } *:uppercase font-inter  *:transition-all *:duration-500`}
        >
          <NavLinkComponent
            darkMode={darkMode}
            to="/whats-on"
            label="What's on"
          />
          <NavLinkComponent
            darkMode={darkMode}
            to="/hospitality-experiences"
            label="Hospitality"
          />
          <NavLinkComponent
            darkMode={darkMode}
            to="/nottingham-panthers"
            label="Panthers"
          />
        </ul>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

type NavLinkComponentPropsType = {
  to: string;
  label: string;
  darkMode: boolean;
};

function NavLinkComponent({ to, label, darkMode }: NavLinkComponentPropsType) {
  return (
    <li className="sm:w-fit w-full">
      <NavLink
        className={({ isActive }) =>
          `relative group hover:sm:-translate-y-0.5 sm:border-b-0 border-b-[.5px] border-b-neutral-500 group sm:bg-transparent transition-all w-full flex items-center h-16 sm:h-full ${
            isActive
              ? 'sm:-translate-y-0.5 sm:bg-transparent bg-[#d2430f]'
              : `${
                  darkMode
                    ? 'bg-[#171717] hover:bg-[#b93a0d]'
                    : 'bg-[#004996] hover:bg-[#00336a]'
                } sm:bg-transparent sm:hover:bg-transparent `
          }`
        }
        to={to}
      >
        {({ isActive }) => (
          <>
            <span className="px-3 sm:ml-0 ml-5 text-[15px] sm:text-sm sm:w-fit w-full  sm:text-inherit text-white whitespace-nowrap group-hover:brightness-100">
              {label}
            </span>
            <div
              className={`absolute sm:block hidden z-10 bottom-2 left-0 w-full transition-all duration-500 bg-[#d2430f] ${
                isActive ? 'sm:h-[5px]' : 'h-[0px] group-hover:h-[5px]'
              }`}
            ></div>
          </>
        )}
      </NavLink>
    </li>
  );
}

export default Layout;
