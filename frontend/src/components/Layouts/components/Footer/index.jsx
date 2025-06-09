import { Link } from 'react-router-dom';
import { Dolciluxe, EmailIcon, Facebook, Instagram, Location, Telephone, Tiktok, Youtube } from '~/assets/icons';

function Footer() {
  return (
    <footer className="w-full border-t-2 bg-fifth text-black">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 px-4 md:px-12">
        {/* Logo & Slogan */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/">
            <Dolciluxe className="mb-2 mx-auto md:mx-0" />
          </Link><br></br>
          <h2 className="text-xl text-[#3D3D3D] text-center md:text-left">Luôn lắng nghe, luôn thấu hiểu</h2>
        </div>
        {/* Về chúng tôi */}
        <div>
          <h3 className="text-2xl font-semibold text-[#664545]">Về chúng tôi</h3>
          <ul className="mt-2 space-y-2 text-base text-[#3D3D3D]">
            <li>
              <Link to="/about?mode=info1" className="hover:text-[#9E6B6B]">Câu chuyện</Link>
            </li>
            <li>
              <Link to="/about?mode=info3" className="hover:text-[#9E6B6B]">Lời cam kết</Link>
            </li>
            <li>
              <Link to="/about?mode=info2" className="hover:text-[#9E6B6B]">Dịch vụ</Link>
            </li>
          </ul>
        </div>
        {/* Chính sách */}
        <div>
          <h3 className="text-2xl font-semibold text-[#664545]">Chính sách</h3>
          <ul className="mt-2 space-y-2 text-base text-[#3D3D3D]">
            <li>
              <Link to="/policy?mode=general" className="hover:text-[#9E6B6B]">Chính sách quy định chung</Link>
            </li>
            <li>
              <Link to="/policy?mode=security" className="hover:text-[#9E6B6B]">Chính sách bảo mật</Link>
            </li>
            <li>
              <Link to="/policy?mode=delivery" className="hover:text-[#9E6B6B]">Chính sách vận chuyển</Link>
            </li>
            <li>
              <Link to="/policy?mode=return" className="hover:text-[#9E6B6B]">Chính sách đổi trả</Link>
            </li>
            <li>
              <Link to="/policy?mode=payment" className="hover:text-[#9E6B6B]">Chính sách giao dịch & thanh toán</Link>
            </li>
          </ul>
        </div>
        {/* Liên hệ */}
        <div>
          <h3 className="text-2xl font-semibold text-[#664545]">Liên hệ</h3>
          <ul className="mt-2 space-y-2 text-base text-[#3D3D3D]">
            <li>
              <Location className="mb-1 mr-2 inline-flex" />
              371 Đoàn Kết, P.Bình Thọ, TP.Thủ Đức, HCM
            </li>
            <li>
              <EmailIcon className="mb-1 mr-2 inline-flex" />
              dolciluxevn@gmail.com
            </li>
            <li>
              <Telephone className="mb-1 mr-2 inline-flex" />
              0966.888888
            </li>
            <li className="inline-flex space-x-2">
              <a href=""><Facebook /></a>
              <a href=""><Instagram /></a>
              <a href=""><Tiktok /></a>
              <a href=""><Youtube /></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full border-t-2 py-3 flex flex-col md:flex-row items-center justify-center gap-2 text-sm">
        <div className="text-[#B4B9C9] text-center">
          Copyright © 2025 DOLCILUXE | All Rights Reserved |
        </div>
        <Link to="/condition?mode=condition" className="text-[#353E5C] underline hover:text-[#9E6B6B]">
          Điều khoản và điều kiện
        </Link>
      </div>
    </footer>
  );
}

export default Footer;