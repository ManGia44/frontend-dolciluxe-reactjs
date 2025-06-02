// import { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Result, Button, message } from 'antd';

// const PaymentSuccess = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="payment-success-page my-16 ml-12 flex flex-col items-center justify-center text-center">
//       {/* Nội dung trang thành công */}
//       <Result
//         status="success"
//         title="Thanh toán thành công!"
//         subTitle="Đơn hàng của bạn đã được xử lý thành công"
//         extra={[
//           <Button key="home" type="primary" onClick={() => navigate('/')}>
//             Quay lại trang chủ{' '}
//           </Button>,
//           <Button key="orders" onClick={() => navigate('/account/orders')}>
//             Xem đơn hàng của tôi
//           </Button>,
//         ]}
//       />
//     </div>
//   );
// };

// export default PaymentSuccess;
