import React from 'react';
import { NavLink, Outlet } from 'react-router';
import arenaImage from '../assets/motorpoint-arena-nottingham.svg';

type LayoutProps = {
  darkMode: boolean;
};

const Layout: React.FC<LayoutProps> = ({ darkMode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex gap-16 lg:px-16 h-28 p-4 items-center">
        <div className="py-5 px-0.5">
          <img src={arenaImage} className="w-56" alt="" />
        </div>
        <div
          className={`flex items-center *:h-full *:flex *:items-center h-full *:lg:text-sm *:text-xs *:font-[600] ${
            darkMode ? '*:text-[#ffffff]' : '*:text-[#004996]'
          } *:uppercase font-inter  *:transition-all *:duration-500`}
        >
          <LinkComponent to="/whats-on" label="What's on" />
          <LinkComponent to="/hospitality-experiences" label="Hospitality" />
          <LinkComponent to="/nottingham-panthers" label="Panthers" />
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

type LinkComponentPropsType = {
  to: string;
  label: string;
};

function LinkComponent({ to, label }: LinkComponentPropsType) {
  return (
    <NavLink
      className={({ isActive }) =>
        `relative group hover:-translate-y-0.5 ${
          isActive ? '-translate-y-0.5' : ''
        }`
      }
      to={to}
    >
      {({ isActive }) => (
        <>
          <span className="px-3">{label}</span>
          <div
            className={`absolute z-10 bottom-2 left-0 w-full transition-all duration-500 bg-[#d2430f] ${
              isActive ? 'h-[5px]' : 'h-[0px] group-hover:h-[5px]'
            }`}
          ></div>
        </>
      )}
    </NavLink>
  );
}

export default Layout;
