import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCartTotal } from '~/redux/selectors';
import { getAllAddress, createAddress, updateAddress } from '~/api/apiUser';
import AddressSelector from '../Account/contents/AddressSelector';

const Payment = () => {
  const { list } = useSelector((state) => state.cart);
  const totalAmount = useSelector(selectCartTotal);
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const userData = currentUser?.user || currentUser?.data || currentUser;

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: userData?.name || '',
    phone: userData?.phone || '',
    province: '',
    district: '',
    ward: '',
    detail: '',
    full_address: '',
    isDefault: false,
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getAllAddress();
        setAddresses(res || []);
        const defaultAddress = res?.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi khi tải danh sách địa chỉ');
      }
    };

    fetchAddresses();
  }, []);

  const handleOrder = () => {
    if (!selectedAddressId) {
      alert('Vui lòng chọn địa chỉ giao hàng.');
      return;
    }
    const url = paymentMethod === 'online' ? '/vnpay' : '/thankyou';
    window.location.href = url;
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: userData?.name || '',
      phone: userData?.phone || '',
      province: '',
      district: '',
      ward: '',
      detail: '',
      full_address: '',
      isDefault: false,
    });
  };

  const handleAddressSubmit = async () => {
    setLoading(true);
    try {
      if (addressForm.isDefault) {
        const updates = addresses
          .filter((addr) => addr.isDefault)
          .map((addr) => updateAddress(addr._id, { ...addr, isDefault: false }));

        await Promise.all(updates);
      }

      const newAddress = await createAddress(addressForm);

      if (newAddress) {
        const updatedAddresses = await getAllAddress();
        setAddresses(updatedAddresses || []);
        setSelectedAddressId(newAddress._id); // auto chọn địa chỉ mới
        alert('Thêm địa chỉ thành công');
        setOpenDialog(false);
        resetAddressForm();
      } else {
        alert('Không thể tạo địa chỉ mới');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 px-8 py-4">
      <h1 className="mb-8 text-center text-4xl font-bold text-primary">Thanh toán</h1>

      {list.length === 0 ? (
        <p className="text-center text-xl text-gray-500">Không có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          {/* Thông tin người mua */}
          <div className="flex-[2]">
            <h2 className="mb-4 text-2xl font-semibold">Thông tin người mua</h2>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4">
                <label className="mb-1 block font-semibold">Tên tài khoản:</label>
                <p>{userData?.name || 'Chưa có tên'}</p>
              </div>
              <div className="mb-4">
                <label className="mb-1 block font-semibold">Email:</label>
                <p>{userData?.email || 'Chưa có email'}</p>
              </div>
              <div className="mb-4">
                <label className="mb-1 block font-semibold">Chọn địa chỉ:</label>
                <div className="flex flex-col space-y-4">
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`cursor-pointer rounded-lg border p-4 shadow-md ${
                          selectedAddressId === address._id ? 'border-primary' : 'border-gray-300'
                        }`}
                        onClick={() => setSelectedAddressId(address._id)}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="selectedAddress"
                            value={address._id}
                            checked={selectedAddressId === address._id}
                            onChange={() => setSelectedAddressId(address._id)}
                            className="mt-1 accent-primary"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">
                              {address.fullName} - {address.phone}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {address.detail}, {address.ward}, {address.district}, {address.province}
                            </p>
                            {address.isDefault && (
                              <span className="mt-2 inline-block rounded bg-primary px-2 py-1 text-xs text-white">
                                Mặc định
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Chưa có địa chỉ nào.</p>
                  )}
                  <button
                    onClick={() => setOpenDialog(true)}
                    className="mt-2 w-fit rounded bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90"
                  >
                    Thêm địa chỉ mới
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="flex-[3]">
            <h2 className="mb-4 text-2xl font-semibold">Tóm tắt đơn hàng</h2>
            <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
              <ul className="divide-y divide-gray-200">
                {list.map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image_link}
                        alt={item.name}
                        width={70}
                        height={70}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <span className="block">{item.name}</span>
                        {item.variant !== 'one-variant' && (
                          <span className="block text-sm text-gray-500">{item.variant}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="block">x{item.buy_quantity || 0}</span>
                      <span>{(item.price * item.buy_quantity || 0).toLocaleString('vi-VN')} VND</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-between text-xl font-bold">
                <span>Tổng cộng:</span>
                <span className="text-primary">{totalAmount.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="mt-6">
              <h2 className="mb-4 text-2xl font-semibold">Phương thức thanh toán</h2>
              <div className="flex gap-6">
                {[
                  { value: 'cod', label: 'Thanh toán khi nhận hàng' },
                  // { value: 'online', label: 'Thanh toán online (VNPAY)' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                      className="accent-primary"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Nút đặt hàng */}
            <div className="mt-6 text-right">
              <button
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
                onClick={handleOrder}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog thêm địa chỉ mới */}
      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-xl font-bold">Thêm địa chỉ mới</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  className="w-full rounded border p-2"
                  value={addressForm.fullName}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <label className="mb-1 block">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded border p-2"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                />
              </div>

              <AddressSelector
                defaultAddress={addressForm}
                onChange={(value) => setAddressForm((prev) => ({ ...prev, ...value }))}
              />

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressChange}
                  className="mr-2"
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setOpenDialog(false);
                  resetAddressForm();
                }}
                className="rounded border px-4 py-2"
              >
                Hủy
              </button>
              <button
                onClick={handleAddressSubmit}
                className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
