import React, { useEffect, useRef, useState } from 'react';
import avatar from 'assets/svg/avatar-person.svg';
import { removeKey } from 'utils';
import { ACCESS_TOKEN } from 'config/localStorage';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'routes/config';
import { UserInfo } from 'interfaces/models';
import Modal from 'elements/Modal';
import PasswordForm from 'components/PasswordForm';
import ProfileForm from 'components/ProfileForm';
import { ROLE, mapRole } from 'config';

const UserMenu = (props: { userInfo: UserInfo }) => {
  const [show, setShow] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const navigate = useNavigate();
  const elementId = useRef('user-menu');
  useEffect(() => {
    window.addEventListener('click', clickEvent);
    return () => {
      window.removeEventListener('click', clickEvent);
    };
  }, []);

  const clickEvent = (e: MouseEvent) => {
    const selectMenuEl = document.getElementById(elementId.current);
    if (selectMenuEl && !selectMenuEl.contains(e.target as Node)) {
      setShow(false);
    }
  };

  const logout = () => {
    removeKey(ACCESS_TOKEN);
    navigate(ROUTES.LOGIN);
  };

  const showProfile = () => {
    setProfileModal(true);
  };

  const showChangePassword = () => {
    setPasswordModal(true);
  };

  return (
    <>
      <div id={elementId.current} className="relative" onClick={() => setShow(!show)}>
        <img src={avatar} className="w-10 cursor-pointer rounded-full shadow-lg" alt="Avatar" />
        <ul
          className={`absolute right-0  z-10 mt-1 max-h-56 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
          ${show ? 'block' : 'hidden'}`}
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          <li
            className="text-gray-900 relative border-b ring-gray-400  select-none py-2 pl-3 pr-9 cursor-pointer "
            id="listbox-option-0"
            role="option"
          >
            <div className="flex flex-col items-center">
              <span className=" ml-3 block truncate font-bold">{props.userInfo.name}</span>
              <span className="font-normal ml-3 block truncate">{mapRole[props.userInfo.role]}</span>
            </div>
          </li>
          <li
            onClick={showProfile}
            className="text-gray-900 relative  select-none py-2 pl-3 pr-9 cursor-pointer hover:bg-gray-200"
            id="listbox-option-0"
            role="option"
          >
            <div className="flex items-center">
              <span className="font-normal ml-3 block truncate">Thông tin tài khoản</span>
            </div>
          </li>
          <li
            onClick={showChangePassword}
            className="text-gray-900 relative  select-none py-2 pl-3 pr-9 cursor-pointer hover:bg-gray-200"
            id="listbox-option-0"
            role="option"
          >
            <div className="flex items-center">
              <span className="font-normal ml-3 block truncate">Đổi mật khẩu</span>
            </div>
          </li>
          <li
            onClick={logout}
            className="text-gray-900 relative  select-none py-2 pl-3 pr-9 cursor-pointer hover:bg-gray-200"
            id="listbox-option-0"
            role="option"
          >
            <div className="flex items-center">
              <span className="font-normal ml-3 block truncate">Đăng xuất</span>
            </div>
          </li>
        </ul>
      </div>

      <Modal unMounted size="lg" title="Đổi mật khẩu" onHide={() => setPasswordModal(false)} show={passwordModal}>
        <PasswordForm onHide={() => setPasswordModal(false)} />
      </Modal>

      <Modal size="lg" unMounted title="Thông tin tài khoản" onHide={() => setProfileModal(false)} show={profileModal}>
        <ProfileForm userInfo={props.userInfo} onHide={() => setProfileModal(false)} />
      </Modal>
    </>
  );
};

export default UserMenu;
