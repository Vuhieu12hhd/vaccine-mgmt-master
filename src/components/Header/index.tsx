import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';
import logo from 'assets/png/logo.png';
import { HomeNav } from 'routes/config';
import { ROLE } from 'config';
import UserMenu from 'components/UserMenu';
import { UserInfo } from 'interfaces/models';

const Header = () => {
  const location = useLocation();
  const userInfo = useLoaderData() as UserInfo;
  return (
    <header className="header ">
      <div className="w-full bg-[var(--primary-color)]">
        <div className="office-info flex items-center justify-between max-w-2xl w-full h-[2rem] m-auto  text-white ">
          <div className="address flex items-center h-full text-[1rem]">
            <FaMapMarkerAlt className="mr-3" />
            Thị Trấn Hưng Hà - Thái Bình
          </div>
          <div className="working-time flex items-center h-full text-[1rem]">
            <FaRegClock className="mr-3" />
            Mở Cửa Thứ 2 - Thứ 7: 8h30h - 17h
          </div>
        </div>
      </div>
      <div className="w-full shadow-sm">
        <nav className="nav-bar  h-[4rem] flex items-center justify-between max-w-screen-xl w-full m-auto  text-[1rem] px-4">
          <Link to="/" className="logo flex items-center h-full">
            <img src={logo} className="h-full overflow-hidden" style={{ width: '60px', height: '55px' }} alt="logo" />
            <div className="text" style={{fontFamily: 'Playfair Display, serif', fontWeight: 'bold', fontSize: '1.5rem', color: '#0C7777' }}>VaccinePro</div>
          </Link>
          <div className="list-link flex items-center">
            {HomeNav.map(
              (item, idx) =>
                item.roles.includes(userInfo?.role as ROLE) && (
                  <Link key={idx} className="mr-5" style={{ color: item.path === location.pathname ? 'var(--primary-color)' : '' }} to={item.path}>
                    {item.label}
                  </Link>
                ),
            )}
          </div>

          <div className="user-info">
            <UserMenu userInfo={userInfo} />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
