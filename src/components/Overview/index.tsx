import React from 'react';
import Banner from 'assets/png/banner.jpg';
import BgService from 'assets/png/bg-service.jpg';
import Avatart1 from 'assets/png/avatar-1.png';
import Avatart2 from 'assets/png/avatar-2.png';
import DoctorCard from './DoctorCard';
import { FaUserMd  } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { useLoaderData } from 'react-router-dom';
import { UserInfo } from 'interfaces/models';
import ColumnChart from 'components/ColumnChart';
const serviceConfig = [
  {
    icon: <FaUserMd  size={79} className="mb-5" color="#2b8fe5" />,
    text: 'Tiêm Chủng Theo Yêu Cầu',
  },
  {
    icon: <FaUserMd  size={79} className="mb-5" color="#2b8fe5" />,
    text: 'Tiêm Chủng Trọn Gói',
  },
  {
    icon: <FaUserMd  size={79} className="mb-5" color="#2b8fe5" />,
    text: 'Tiêm Chủng Cho Trẻ Em',
  },
  
];

const Overview = () => {
  const userInfo = useLoaderData() as UserInfo;

  return (
    <div className="overview">
      <section className="w-full relative mb-28">
        <img src={Banner} alt="banner" className="w-full" />
        <div className="absolute w-2/3 h-full top-0 left-0 px-40 flex flex-col justify-center">
          <div className="text-[2rem] mb-3">VaccinePro</div>
          <div className="text-[var(--primary-color)] text-[1.5rem]">Trung Tâm Tiêm Chủng An Toàn</div>
          <div className="text-[var(--primary-color)] text-sm mb-3">
            <span>Chúng tôi tự tin là trung tâm tiêm chủng uy tín chất lượng hàng đầu Việt Nam.</span>
            <br />
            <span>Với đội ngũ nhân viên chuyên nghiệp với phác đồ điều trị theo chuẩn WHO. </span>
          </div>
          <div className="text-[var(--primary-color)] text-[1.5rem]">	Niềm tin - Đoàn kết - Chất lượng</div>
        </div>
      </section>
      <section className=" w-full drop-shadow mb-28">
        <ColumnChart />
      </section>
      <section className=" w-full drop-shadow mb-28">
        <div className="flex flex-col items-center max-w-screen-lg m-auto mb-10">
          <div className="title text-center text-blue-500 mb-2">THÔNG TIN VỀ ĐỘI NGŨ BÁC SỸ</div>
          <div className="title text-center text-base">
          Trung tâm tiêm chủng VaccinePro tự hào là đơn vị quy tụ đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm và luôn tâm huyết, tận tụy nghề. Các bác sĩ từng công tác và giữ vị trí quan trọng tại nhiều bệnh viện công lập, bệnh viện thuộc tuyến TW, mang đến sự an tâm cho khách hàng khi đến thăm khám và điều trị.
       
          </div>
        </div>
        <div className="grid grid-cols-3 max-w-screen-lg m-auto gap-8">
          <DoctorCard />
          <DoctorCard />
          <DoctorCard />
        </div>
      </section>

      <section className="w-full relative">
        <div className="p-20 flex flex-col z-10">
          <div className="title text-center text-white mb-2 text-3xl font-bold ">DỊCH VỤ CỦA CHÚNG TÔI</div>
          <div className="title text-center text-base text-white">
            Trung tâm cung cấp các dịch vụ chăm sóc sức khỏe, thiết bị khám trị liệu và phòng ngừa bệnh toàn diện, với công nghệ Y khoa hiện đại.
          </div>
          <div className="flex-1 grid grid-cols-3 grid-rows-1 gap-3 max-w-screen-2xl w-full m-auto py-20 border border-solid border-while border-20">
            {serviceConfig.map((item, idx) => (
              <div
                key={idx}
                className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 border border-solid border-black border-20 "
              >
                {item.icon}
                <p className="mb-4 text-xl font-bold text-neutral-600 dark:text-neutral-200">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <img src={BgService} alt="banner" className="w-full absolute h-full top-0 left-0  z-[-1]" />
      </section>
      <section className="w-full py-28">
        <div className="w-full grid grid-cols-2 max-w-screen-xl m-auto">
          <div className="flex flex-col items-center">
            <img src={Avatart1} className="w-32 rounded-full mb-4" alt="Avatar" />
            <div className="flex mb-4 ">
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
            </div>
            <div className="comment text-center font-normal text-base mb-4 px-10 italic">
              “ Tôi xin chân thành cảm ơn bác sĩ, y tá đã động viên, khích lệ, giúp đỡ và tạo điều kiện thuận lợi cho tôi trong suốt thời gian điều
              trị tại bệnh viện. Chúc bệnh viện ngày càng phát triển”
            </div>
            <div className="name font-bold">Minh Châu</div>
          </div>
          <div className="flex flex-col items-center">
            <img src={Avatart2} className="w-32 rounded-full mb-4" alt="Avatar" />
            <div className="flex mb-4 ">
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
              <AiFillStar className="mr-1" size={20} color="#FCB71C" />
            </div>
            <div className="comment text-center font-normal text-base mb-4 px-10 italic">
              “Trung tâm tiêm chủng VaccinePro là nơi đáng tin cậy, tôi đã tiết kiệm được rất nhiều thời gian khi 
              tiêm chủng tại đây, Trải nghiệm dịch vụ cũng rất tuyệt vời, cảm ơn các bác sỹ.”
            </div>
            <div className="name font-bold">Vũ Hiếu</div>
          </div>
        </div>
      </section>
      <footer className="bg-[#188B8B] text-white py-4 border-black border-blue-900">
  <div className="container mx-auto px-25 flex justify-between">
    <div className="grid grid-cols-3 md:grid-cols-4 px-55 gap-4">
      <div className="footer-links px-20">
        <h3 className="text-3xl font-semibold mb-2">VaccinePro</h3>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Adress: 79 - Thị Trấn Hưng Hà</a>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Email: VaccinePro@gmail.com</a>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Facebook: TTTC VaccinePro</a>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Telephone: 0584682528</a>
      </div>
      <div className="footer-links px-20">
        <h3 className="text-lg font-semibold mb-2">Thông Tin Trung Tâm</h3>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Về Chúng Tôi</a>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Chương Trình Ưu Đãi</a>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Tin Mới</a>
      </div>
      <div className="footer-links px-20">
        <h3 className="text-lg font-semibold mb-2">Hệ Thống Cơ Sở</h3>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Hà Nội</a>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Thái Bình</a>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Hưng Yên</a>
        <a href="#" className="text-white hover:text-gray-300 block mb-1 text-base">Hải Phòng</a>
      </div>
    </div>
  </div>
  <p className="text-right mt-4 text-sm">&copy; 2024 Medical System. All Rights Reserved.</p>
</footer>


    </div>
  );
};

export default Overview;
