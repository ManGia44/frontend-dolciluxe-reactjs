import React from 'react';
import { Button, Typography } from 'antd';

const { Text } = Typography;

const CartActions = ({ hasSelected, onCheckout, onRemoveSelected, selectedCount, totalAmount, loading }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="flex justify-center sm:justify-start"
        style={{
          padding: '8px',
          borderRadius: '4px',
        }}
      >
        <Button
          style={{
            borderColor: hasSelected ? '#664545' : undefined,
          }}
          type="text"
          onClick={hasSelected ? onRemoveSelected : null}
          size="middle"
          loading={loading}
          disabled={!hasSelected}
        >
          Xóa
        </Button>
      </div>

      {/* Phần hiển thị Tổng cộng + Button */}
      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-col text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
          <Text className="text-sm sm:text-base">Tổng cộng ({selectedCount} sản phẩm):</Text>
          <Text className="text-lg font-bold sm:text-xl" style={{ color: '#664545' }}>
            {totalAmount}
          </Text>
        </div>
        <Button
          type="primary"
          style={{
            backgroundColor: hasSelected ? '#664545' : undefined,
            borderColor: hasSelected ? '#664545' : undefined,
          }}
          onClick={onCheckout}
          size="large"
          disabled={!hasSelected}
          loading={loading}
          className="w-full sm:w-auto"
        >
          Mua hàng
        </Button>
      </div>
    </div>
  );
};

export default CartActions;
