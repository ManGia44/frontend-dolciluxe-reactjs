import React, { useEffect, useState } from 'react';
import { getAllAddress, createAddress, updateAddress, deleteAddress, getCurrentUser } from '~/api/apiUser';
import AddressSelector from './AddressSelector';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  List,
  Tag,
  Popconfirm,
  message,
  Typography
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const initialForm = {
  fullName: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  detail: '',
  full_address: '',
  isDefault: false,
};

export default function Address() {
  const [userId, setUserId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        const id = user?.data?.id || user?.data?._id;
        setUserId(id);
        console.log('Current user:', user);
      } catch {
        message.error('Không thể tải thông tin người dùng');
      }
    };
    fetchUser();
  }, []);

  const fetchAddresses = async () => {
    if (!userId) return;
    try {
      const res = await getAllAddress(userId);
      setAddresses(res || []);
    } catch {
      message.error('Lỗi khi tải danh sách địa chỉ');
    }
  };

  useEffect(() => {
    if (userId) fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleOpen = (addr) => {
    setEditId(addr?._id && typeof addr._id === 'string' ? addr._id : addr?._id?.toString() || null);
    form.setFieldsValue(addr || initialForm);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    form.resetFields();
  };

  // Xử lý lưu địa chỉ (thêm hoặc sửa)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const { _id, user, ...cleanedValues } = values;

      if (cleanedValues.isDefault) {
        await Promise.all(
          addresses
            .filter((addr) => addr.isDefault)
            .map((addr) => {
              const id = getRealId(addr._id);
              console.log('updateAddress unset default id:', id, 'type:', typeof id);
              return updateAddress(id, userId, { ...addr, isDefault: false });
            })
        );
      }

      if (editId) {
        console.log('updateAddress edit id:', editId, 'type:', typeof editId);
        await updateAddress(editId, userId, cleanedValues);
        message.success('Cập nhật địa chỉ thành công');
      } else {
        await createAddress(userId, cleanedValues);
        message.success('Thêm địa chỉ thành công');
      }

      fetchAddresses();
      handleClose();
    } catch (err) {
      console.error('Lỗi khi lưu địa chỉ:', err);
      if (!err?.errorFields) message.error('Không thể lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đặt địa chỉ mặc định
  const handleSetDefault = async (id) => {
    try {
      console.log('handleSetDefault id:', id, 'type:', typeof id);
      const current = addresses.find((addr) => getRealId(addr._id) === id);
      if (!current) throw new Error('Không tìm thấy địa chỉ');

      await Promise.all(
        addresses
          .filter((addr) => getRealId(addr._id) !== id && addr.isDefault)
          .map((addr) => {
            const addrId = getRealId(addr._id);
            console.log('updateAddress unset default id:', addrId, 'type:', typeof addrId);
            return updateAddress(addrId, userId, { ...addr, isDefault: false });
          })
      );

      const { _id, user, ...rest } = current;
      console.log('updateAddress set default id:', id, 'type:', typeof id);
      await updateAddress(id, userId, { ...rest, isDefault: true });

      message.success('Cập nhật địa chỉ mặc định thành công');
      fetchAddresses();
    } catch (err) {
      console.error('Lỗi đặt mặc định:', err);
      message.error('Không thể đặt làm mặc định');
    }
  };

  // Xử lý xóa địa chỉ
  const handleDelete = async (id) => {
    try {
      setConfirmLoading(true);
      console.log('handleDelete id:', id, 'type:', typeof id);

      const current = addresses.find((addr) => getRealId(addr._id) === id);
      if (!current) throw new Error('Không tìm thấy địa chỉ');

      if (current.isDefault) {
        message.warning('Không thể xóa địa chỉ mặc định');
        return;
      }

      console.log('deleteAddress id:', id, 'type:', typeof id);
      await deleteAddress(id, userId);
      message.success('Đã xóa địa chỉ');
      fetchAddresses();
    } catch (err) {
      console.error('Lỗi xóa địa chỉ:', err);
      message.error('Không thể xóa địa chỉ');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Hàm lấy id thực sự từ _id (objectId hoặc string)
  function getRealId(_id) {
    if (!_id) return '';
    if (typeof _id === 'string') return _id;
    if (_id.$oid) return _id.$oid;
    if (_id.toHexString) return _id.toHexString();
    if (_id.timestamp && _id.date) return _id.timestamp.toString(); // fallback, không nên dùng
    return _id.toString();
  }

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between mb-6">
          <Text strong className="text-xl">Địa chỉ giao hàng</Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpen()}
          >
            Thêm địa chỉ
          </Button>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <Text className="text-gray-500">Chưa có địa chỉ nào.</Text>
          </Card>
        ) : (
          <List
            dataSource={[...addresses].sort((a, b) => b.isDefault - a.isDefault)}
            renderItem={(addr) => {
              // Log toàn bộ addr và kiểu _id để debug
              console.log('addr:', addr);
              console.log('addr._id:', addr._id, 'typeof:', typeof addr._id);

              const realId = getRealId(addr._id);

              return (
                <List.Item className="!p-0 !border-b">
                  <div className={`flex items-center w-full p-4 hover:bg-gray-50 ${addr.isDefault ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center flex-1 min-w-0">
                      <EnvironmentOutlined className={`mr-3 ${addr.isDefault ? 'text-blue-500' : 'text-gray-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 truncate">
                          <Text strong className="truncate max-w-[120px]">
                            {addr.fullName}
                          </Text>
                          <Text type="secondary">|</Text>
                          <Text className="text-gray-600 truncate max-w-[100px]">
                            {addr.phone}
                          </Text>
                          {addr.isDefault && (
                            <Tag color="blue" className="ml-2 flex-shrink-0">
                              Mặc định
                            </Tag>
                          )}
                        </div>
                        <Text ellipsis className="text-gray-600 mt-1">
                          {addr.full_address || `${addr.detail}, ${addr.ward}, ${addr.district}, ${addr.province}`}
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      {!addr.isDefault && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleSetDefault(realId)}
                          className="mt-2"
                        >
                          Đặt làm địa chỉ mặc định
                        </Button>
                      )}

                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleOpen(addr)}
                        className="text-gray-500 hover:text-primary"
                      />

                      <Popconfirm
                        title="Xóa địa chỉ này?"
                        onConfirm={() => handleDelete(realId)}
                        okText="Xóa"
                        cancelText="Hủy"
                        disabled={addr.isDefault}
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className={`text-gray-500 hover:text-red-500 ${addr.isDefault ? 'opacity-50 cursor-not-allowed' : ''}`}
                          danger
                          disabled={addr.isDefault}
                        />
                      </Popconfirm>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}

        <Modal
          title={editId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
          open={open}
          onCancel={handleClose}
          footer={[
            <Button key="back" onClick={handleClose}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleSubmit}
            >
              Lưu
            </Button>,
          ]}
          width={900}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={initialForm}
            className="w-full"
          >
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>

            <AddressSelector form={form} />

            <Form.Item
              name="isDefault"
              valuePropName="checked"
            >
              <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}