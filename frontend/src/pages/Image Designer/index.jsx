import { NavLink } from 'react-router-dom';
import imageCake from '~/assets/images/about_1.jpg';
import { useContext, useRef, useState } from 'react';
import { generateImage } from '~/api/apiAI';
import { useDispatch, useSelector } from 'react-redux';
import { createInstance } from '~/redux/interceptors';
import { loginSuccess } from '~/redux/authSlice';
import { toast } from 'react-toastify';
import { AddToCartContext } from '~/components/Layouts/DefaultLayout';
import CakeBuilder from '~/components/Layouts/components/GenerateAi/CakeBuilder';
function EditImage() {
  const [selectedLabel, setSelectedLabel] = useState('');
  const [input, setInput] = useState('');
  const handleChange = (event) => {
    setSelectedLabel(event.target.value);
  };
  const [image, setImage] = useState('');
  const inputRef = useRef(null);
  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  let instance = createInstance(user, dispatch, loginSuccess);
  const { setIsLogin } = useContext(AddToCartContext);

  return (
    <div className="mt-16 h-fit w-full bg-white/70 pb-5">
      <div className="mx-auto px-6 lg:px-[5rem]">
        <div className="flex h-11 items-center px-4 text-primary sm:px-6">
          <div className="capitalize">
            <NavLink to="/">Trang chủ </NavLink>
            <span>&gt;&gt;</span>
            <NavLink to="/category"> Designer </NavLink>
          </div>
        </div>
        <h1 className="text-center text-3xl font-bold leading-[48px] sm:text-4xl sm:leading-[56px] lg:text-5xl lg:leading-[72px]">
          Tạo bánh với Dolciluxe
        </h1>
        <p className="text-center text-base font-normal leading-[32px] sm:text-lg sm:leading-[48px] lg:text-xl lg:leading-[64px]">
          Dolciluxe - Làm bạn với AI
        </p>
        <div className="mx-auto max-w-screen-lg rounded-3xl border border-black lg:px-[3rem]">
          <div className="m-4 flex flex-col gap-6 sm:m-6 lg:flex-row lg:gap-10">
            {/* Form Section */}
            <CakeBuilder />
          </div>
        </div>
        <div className="py-8">
          <div className="mx-auto px-4">
            <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
              Biến Ý Tưởng Thành Tác Phẩm Nghệ Thuật Với <span className="text-pink-500">Dolciluxe</span>
            </h1>
            <p className="mb-8 text-center text-lg text-gray-600">
              Chỉ cần chọn ý tưởng, Dolciluxe sẽ giúp bạn tạo ra những hình ảnh bánh độc đáo trong vài giây. Dành cho
              người làm nội dung, thợ làm bánh, hay bất kỳ ai đam mê sáng tạo.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Tạo Ảnh Bánh Từ Ý Tưởng Với Dolciluxe</h2>
                <p className="mb-4 text-gray-600">
                  Dolciluxe sử dụng công nghệ AI tiên tiến để chuyển đổi mô tả văn bản thành hình ảnh bánh chất lượng
                  cao. Từ những thiết kế đơn giản đến những chi tiết phức tạp, tất cả đều trong tầm tay bạn.
                </p>
                <ul className="list-inside list-disc text-gray-600">
                  <li>Chọn nhiều phong cách: Hiện đại, cổ điển, chân thực và hơn thế nữa.</li>
                  <li>Tuỳ chỉnh màu sắc, ánh sáng và bố cục theo ý muốn.</li>
                  <li>Xuất ảnh chất lượng cao phù hợp cho web, in ấn, hoặc mạng xã hội.</li>
                  <li>Giao diện thân thiện, dễ sử dụng cho mọi người.</li>
                </ul>
              </div>
              <div>
                <img src={imageCake} alt="Dolciluxe" className="mx-auto size-[20rem] rounded-full" />
              </div>
            </div>
            <div className="mt-12 text-center">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Cách Sử Dụng Dolciluxe</h2>
              <div className="grid gap-6 text-left md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h3 className="mb-2 text-lg font-bold text-pink-500">1. Chọn Ý Tưởng</h3>
                  <p className="text-gray-600">
                    Hãy lựa chọn các option bạn muốn tạo ra. Ví dụ:
                    <i>"Số tầng, hình dạng, màu sắc, kem phủ,..."</i>
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h3 className="mb-2 text-lg font-bold text-pink-500">2. Chọn Phong Cách</h3>
                  <p className="text-gray-600">
                    Lựa chọn phong cách hình ảnh phù hợp như Hiện đại, chân thực, hoặc Tối giản. Tuỳ chỉnh màu sắc và tỷ
                    lệ khung hình để phù hợp với ý tưởng của bạn.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h3 className="mb-2 text-lg font-bold text-pink-500">3. Tải Xuống</h3>
                  <p className="text-gray-600">
                    Nhấn "Tải Ảnh" để lưu kết quả. Nếu chưa hài lòng, hãy điều chỉnh và tạo lại. Khi hoàn tất, bạn có
                    thể tải ảnh về hoặc chia sẻ trực tiếp.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h2 className="mb-6 text-2xl font-semibold text-gray-800">Lý Do Nên Chọn Dolciluxe</h2>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-bold text-pink-500">Dành Cho Người Làm Nội Dung</h3>
                  <p className="text-gray-600">
                    Tạo hình ảnh bánh đẹp mắt cho blog, bài đăng mạng xã hội, và bài viết thu hút người xem.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-bold text-pink-500">Dành Cho Thợ Làm Bánh</h3>
                  <p className="text-gray-600">
                    Tìm cảm hứng thiết kế bánh hoặc trình bày ý tưởng cho khách hàng dễ dàng hơn.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-bold text-pink-500">Dành Cho Người Kinh Doanh</h3>
                  <p className="text-gray-600">
                    Tạo ảnh quảng cáo và vật liệu truyền thông nhanh chóng, không cần kỹ năng thiết kế.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Câu Hỏi Thường Gặp</h2>
              <div className="grid gap-6 text-left md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-bold text-pink-500">
                    Có được sử dụng ảnh cho mục đích thương mại không?
                  </h3>
                  <p className="text-gray-600">
                    Có, bạn hoàn toàn có thể sử dụng ảnh cho mục đích thương mại. Xem thêm chi tiết trong Điều Khoản
                    Dịch Vụ của chúng tôi.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-pink-500">Ảnh có phù hợp để in ấn không?</h3>
                  <p className="text-gray-600">
                    Chất lượng ảnh phù hợp để in kích thước nhỏ. Đối với ảnh lớn, độ rõ nét có thể bị giảm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditImage;
