import React from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaRegClock, FaPhone } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi'; // Import biểu tượng FiPhone
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
      <div className="w-full bg-[#06AAAA]">
        <div className="office-info flex items-center justify-between max-w-1xl w-full h-[2.2rem] m-auto  text-white ">
          <div className="address flex items-center h-full text-[1rem] mx-5">
            <FaMapMarkerAlt className="mr-3" />
            Thị Trấn Hưng Hà - Thái Bình
          </div>
          <div className="working-time flex items-center h-full text-[1rem] mx-5">
            <FaRegClock className="mr-3" />
            Mở Cửa Thứ 2 - Thứ 7: 8h30h - 17h
          </div>
          <div className="working-time flex items-center h-full text-[1rem] mx-5">
            <FiPhone className="mr-3" />
            Hotline: 0766 499 868
          </div>
        </div>
      </div>
      <div className="w-full shadow-sm">
        <nav className="nav-bar h-[3.3rem] flex items-center justify-between max-w-screen-xl w-full m-auto  text-[1rem] px-4">
          <Link to="/" className="logo p-1 flex items-center h-full">
            <img src={logo} className="h-full overflow-hidden" style={{ width: '52px', height: '47px' }} alt="logo" />
            <div className="text p-1" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', fontSize: '1.5rem', color: '#0C7777' }}>VaccinePro</div>
          </Link>
          <div className="list-link flex items-center">
            {HomeNav.map(
              (item, idx) =>
                item.roles.includes(userInfo?.role as ROLE) && (
                  <Link
                    key={idx}
                    className={`mr-6 p-1.5 ${item.path === location.pathname ? 'text-[var(--primary-color)]' : ''} hover:text-[var(--primary-color)] hover:bg-gray-300 transition duration-300`}

                    to={item.path}
                  >
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
