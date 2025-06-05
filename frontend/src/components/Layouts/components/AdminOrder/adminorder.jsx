import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getOrders, updateOrderStatus } from '~/api/apiOrder';
import { getListUsers, getAllAddress } from '~/api/apiUser';
import { generateImage_admin } from '~/api/apiAI';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { uploadcloudinary } from '~/api/apiAI';
import ImageDownloader from '~/components/Layouts/components/ImageDownloader';

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  const [users, setUsers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDialog, setStatusDialog] = useState({ open: false, orderId: null, newStatus: '' });
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const user = useSelector((state) => state.auth.login.currentUser);
  const [image, setImage] = useState('');
  const { setIsLogin } = useContext(AddToCartContext);
  
  const handleGenerateImageToAdmin = async(e) => {
    e.preventDefault();
      if (!user) setIsLogin(true);
      else {
        setLoading(true);
        try {
          if (topSellingProducts.length === 0){
            setImage(null);
            return;
          }
          const res = await generateImage_admin(topSellingProducts.join(", "), instance);
          console.log(res);
          // setImage(res[0].tmp_url);
          // inputRef.current.focus();
          if (res && res.image_url) {
              setImage(res.image_url);
              await uploadcloudinary(image, instance);
          } else if (res && res.message) {
              alert(`Lỗi tạo ảnh: ${res.message}`);
          } else {
              alert('Không thể tạo ảnh. Vui lòng thử lại.');
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, userRes, addressRes] = await Promise.all([getOrders(), getListUsers(), getAllAddress()]);
        console.log(orderRes);

        const updatedOrders = await Promise.all(
          orderRes.data.map(async (order) => {
            if (order.paymentMethod === 'VNPAY' && order.paymentStatus === 'paid') {
              try {
                const updateRes = await updatepaymentStatus(order._id, 'processing');
                return { ...order, paymentStatus: updateRes.data.paymentStatus };
              } catch {
                return order;
              }
            } else if (order.paymentMethod === 'VNPAY' && order.paymentStatus === 'pending') {
              try {
                const updateRes = await updatepaymentStatus(order._id, 'pending');
                return { ...order, paymentStatus: updateRes.data.paymentStatus };
              } catch {
                return order;
              }
            }
            return order;
          }),
        );

        setOrders(updatedOrders);
        calculateTopSelling(orders);
        setUsers(userRes.data);
        setAddresses(addressRes);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTopSelling = (orders) => {
    if(orders.length ===0) {
      setTopSellingProducts(null);
    }
    const productSales = new Map(); 
    orders.forEach(orther => {
      OtherHouses.items.forEach(item => {
        const product = item.product?.productName;
        if (!product) {
          const quantity = parseInt(item.quantity, 10);
          if (productSales.has(product)) {
            const existingProduct = productSales.get(product);
            existingProduct.totalQuantity += quantity;
            productSales.set(product, existingProduct);
          }
          else {
            productSales.set(product, {
                product: product,
                totalQuantity: quantity
            });
          }
        }
      });
    });
    const sortedProducts = Array.from(productSales.values()).sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, 3);

    setTopSellingProducts(sortedProducts.productarr);
  };
  const getUserInfo = (userId) => users.find((u) => u.id === userId);
  const getUserDefaultAddress = (userId) =>
    addresses.find((addr) => addr.user === userId && addr.isDefault) || addresses.find((addr) => addr.user === userId);
  const handleUpdateStatus = (orderId, newStatus) => {
    setStatusDialog({ open: true, orderId, newStatus });
  };
  const getReceiverFromOrder = (order) => {
    if (order.address) {
      return {
        fullName: order.address.fullName,
        phone: order.address.phone,
        detail: order.address.detail,
        ward: order.address.ward,
        district: order.address.district,
        province: order.address.province,
      };
    }
    return getUserDefaultAddress(order.user);
  };

  const confirmUpdateStatus = async () => {
    try {
      const { orderId, newStatus } = statusDialog;
      const res = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, orderStatus: res.data.orderStatus } : o)));
      toast.success(`Đã chuyển trạng thái sang ${newStatus}`, {
        position: 'bottom-right',
        autoClose: 3000,
        icon: '✅',
      });
    } catch (err) {
      toast.error('Cập nhật trạng thái thất bại', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setStatusDialog({ open: false, orderId: null, newStatus: '' });
    }
  };
  const formatAddress = (receiver) =>
    receiver ? `${receiver.detail}, ${receiver.ward}, ${receiver.district}, ${receiver.province}` : 'N/A';

  if (loading) return <p>Đang tải danh sách đơn hàng...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-[x-large] font-bold text-[#664545]">Quản lý đơn hàng</h1>
      <div className="overflow-x-auto text-sm">
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">Chưa có đơn hàng nào.</p>
        ) : (
          <table className="w-full table-auto border-collapse overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
              <tr>
                <th className="border-y border-gray-200 px-4 py-3 text-center">STT</th>
                <th className="border-y border-gray-200 px-4 py-3 text-center">Thông tin khách hàng</th>
                <th className="border-y border-gray-200 px-4 py-3 text-center">Chi tiết đơn hàng</th>
                <th className="border-y border-gray-200 px-4 py-3 text-center">Phương thức thanh toán</th>
                <th className="border-y border-gray-200 px-4 py-3 text-center">Trạng thái đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const userInfo = getUserInfo(order.user);
                const receiver = getReceiverFromOrder(order);
                return (
                  <tr key={order._id} className="text-gray-800 transition-all hover:bg-gray-100">
                    <td className="border-y border-gray-200 py-3 text-center">{index + 1}</td>
                    <td className="border-y border-gray-200 px-4 py-3 text-left">
                      <p className="font-medium">{userInfo?.name || 'N/A'}</p>
                      <p>{userInfo?.phone || 'N/A'}</p>
                      <p>{userInfo?.email || 'N/A'}</p>
                    </td>
                    <td className="border-y border-gray-200 px-4 py-3 text-left">
                      {order.items.map((item, i) => (
                        <p key={i}>
                          {item.product?.productName} (x{item.quantity})
                        </p>
                      ))}
                      <p className="mt-1 font-semibold">Tổng: {order.totalPrice.toLocaleString()}đ</p>
                      <p>
                        Trạng thái thanh toán:{' '}
                        <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}>
                          {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </p>
                      <p className="mt-2 font-medium">Người nhận: {receiver?.fullName || 'N/A'}</p>
                      <p>SĐT: {receiver?.phone || 'N/A'}</p>
                      <p>Địa chỉ: {formatAddress(receiver)}</p>
                    </td>
                    <td className="border-y border-gray-200 px-4 py-3 text-center uppercase">{order.paymentMethod}</td>
                    <td className="border-y border-gray-200 px-4 py-3 text-center">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="rounded border px-2 py-1 text-sm shadow"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {topSellingProducts.length > 0 && (
        <div className="relative w-full lg:w-1/2">
        <p className="text-center text-base font-normal leading-[32px] sm:text-lg sm:leading-[48px] lg:text-xl lg:leading-[64px]">Top {topSellingProducts.length.toString()} bánh bán chạy nhất cửa hàng là {topSellingProducts.join(", ")}</p>
        <button
          onClick={handleGenerateImageToAdmin}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white shadow hover:bg-blue-700"
          disabled={isGenerating}
        >
          {isGenerating ? 'Đang tạo...' : 'Tạo ảnh'}
        </button>

        {/* Hiển thị ảnh được tạo từ API */}
        {generatedImageUrl && (
            <div className="mt-8 flex flex-col items-center gap-4">
                <h3 className="text-lg font-semibold">Ảnh đã tạo từ AI:</h3>
                <img
                    src={generatedImageUrl}
                    alt="AI Generated Cake"
                    className="w-[300px] h-[300px] object-contain rounded-lg shadow-md"
                />
              </div>
        )}
        <ImageDownloader imageUrl={generatedImageUrl} />
      </div>
      )}

      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, orderId: null, newStatus: '' })}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc muốn thay đổi trạng thái đơn hàng thành "{statusDialog.newStatus}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, orderId: null, newStatus: '' })}>Hủy</Button>
          <Button variant="contained" onClick={confirmUpdateStatus}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminOrder;
