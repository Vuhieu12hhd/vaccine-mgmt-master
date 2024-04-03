import React from 'react';
import { TERipple } from 'tw-elements-react';
import { AiFillStar } from 'react-icons/ai';
import Doctor from 'assets/png/doctor-3.jpg';
import Doctor2 from 'assets/png/doctor-2.jpg';

const DoctorCard = () => {
  return (
    <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
      <a href="#!">
        <img className="rounded-t-lg" src={Doctor} alt="" />
      </a>
      <div className="p-6">
        <div className="flex mb-2 ">
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
        </div>
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">Nguyễn Đăng Quang</h5>
        <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">TRƯỞNG KHOA XÉT NGHIỆM</p>
        <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">Trình Độ: Tiến Sĩ</p>
        <TERipple>
          <button
            type="button"
            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          >
            Xem thêm
          </button>
        </TERipple>
      </div>
      <a href="#!">
        <img className="rounded-t-lg" src={Doctor2} alt="" />
      </a>
      <div className="p-6">
        <div className="flex mb-2 ">
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
          <AiFillStar className="mr-1" size={20} color="#FCB71C" />
        </div>
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">Phan kim Liên</h5>
        <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">Y TÁ THEO DÕI HỒI SỨC</p>
        <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">Trình Độ: Cử nhân khoa học điều dưỡng đại học y Hà Nội</p>
        <TERipple>
          <button
            type="button"
            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          >
            Xem thêm
          </button>
        </TERipple>
      </div>
    </div>
    
  );
};

export default DoctorCard;
