import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getCakeById, getCakesByType } from '~/api/apiCakes';
import Card from '../Card';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCartContext } from '../../DefaultLayout';
import { addCartItem, fetchCart } from '~/redux/cartSlice';
import { Spin, message } from 'antd';

function DetailedCake() {
  const [cake, setCake] = useState({});
  const [alikeCake, setAlikeCake] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login.currentUser);
  const { triggerSuccessPopup } = useContext(AddToCartContext);
  const { categoryName } = location.state || {};

  useEffect(() => {
    if (id) {
      fetchCakeDetail();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchCakeDetail = async () => {
    try {
      setLoading(true);
      const res = await getCakeById(id);
      const cakeData = res.data;
      setCake(cakeData);

      // Lấy id loại sản phẩm (giả sử backend trả về productType là string id)
      const productTypeId = cakeData?.productType;
      if (productTypeId) {
        const resAlike = await getCakesByType(productTypeId);
        const filteredAlike = resAlike.data.filter(
          (item) => String(item.id) !== String(cakeData.id)
        );
        setAlikeCake(filteredAlike);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu chi tiết bánh:', err);
      message.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth?mode=signin');
      return;
    }

    try {
      await dispatch(
        addCartItem({
          productId: cake.id,
          quantity: quantity
        })
      ).unwrap();

      dispatch(fetchCart());
      triggerSuccessPopup();
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      message.error(error.message || 'Thêm vào giỏ hàng thất bại');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/auth?mode=signin');
      return;
    }
    try {
      await dispatch(
        addCartItem({
          productId: cake.id,
          quantity: quantity
        })
      ).unwrap();
      dispatch(fetchCart());

      navigate('/cart', {
        state: {
          autoSelectedKey: cake.id,
          isBuyNow: true
        }
      });
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      message.error(error.message || 'Thêm vào giỏ hàng thất bại');
    }
  };

  return (
    <div className="mt-16 w-full bg-white">
      <div className="mx-4 sm:mx-8 lg:mx-[5rem]">
        <Spin spinning={loading}>
          <br />
          <div className="my-10 flex flex-col lg:flex-row gap-5">
            <img
              src={cake.imageLink}
              alt={cake.productName}
              className="h-[300px] w-full sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px] rounded-xl object-cover mx-auto lg:mx-0"
            />
            <div className="flex flex-col justify-center">
              <h2 className="pb-4 text-2xl sm:text-3xl lg:text-4xl font-bold capitalize text-center lg:text-left">
                {cake.productName}
              </h2>
              <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary text-center lg:text-left">
                {cake.price ? `${cake.price.toLocaleString('vi-VN')} VND` : ''}
              </span>

              <h4 className="my-4 text-lg sm:text-xl lg:text-2xl font-semibold text-center lg:text-left">
                Số lượng
              </h4>
              <div className="flex items-center justify-center lg:justify-start">
                <button
                  className="h-10 w-10 rounded-bl-lg rounded-tl-lg border border-primary"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="h-10 w-12 border-b border-t border-primary text-center"
                />
                <button
                  className="h-10 w-10 rounded-br-lg rounded-tr-lg border border-primary"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              <div className="mt-10 flex flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleAddToCart}
                  className="h-[50px] sm:h-[60px] lg:h-[65px] w-full sm:w-[200px] lg:w-[260px] rounded-lg border border-primary text-lg sm:text-xl lg:text-2xl font-semibold text-primary"
                >
                  Thêm vào giỏ hàng
                </button>

                <button
                  onClick={handleBuyNow}
                  className="h-[50px] sm:h-[60px] lg:h-[65px] w-full sm:w-[200px] lg:w-[260px] rounded-lg bg-primary text-lg sm:text-xl lg:text-2xl font-semibold text-white hover:bg-opacity-90 transition-colors"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary">Mô tả</h4>
          <p className="my-5 text-base sm:text-lg lg:text-xl font-normal">{cake.description}</p>

          <h2 className="my-5 text-center text-2xl sm:text-3xl lg:text-[40px] font-bold leading-[48px] text-primary">
            Sản phẩm tương tự
          </h2>
          {alikeCake.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {alikeCake.slice(0, 4).map((item) => (
                <Card
                  key={item.id}
                  product_name={item.productName}
                  description={item.description}
                  image_link={item.imageLink}
                  id={item.id}
                  price={item.price}
                  categoryName={categoryName}
                  cake={item}
                />
              ))}
            </div>
          ) : (
            <br />
          )}
        </Spin>
      </div>
    </div>
  );
}

export default DetailedCake;