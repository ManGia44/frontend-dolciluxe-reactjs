import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Table, Input, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import AddProductModal from '~/components/Layouts/components/AdminProduct/AddProduct';
import UpdateProductModal from '~/components/Layouts/components/AdminProduct/UpdateProduct';
import usePagination from '~/hooks/usePagination';
import { deleteCake, getCakeById, getAllCakes } from '~/api/apiCakes';

const AdminProduct = () => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const filteredCakes = cakes.filter((cake) =>
    cake.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCakes = usePagination(filteredCakes);

  // Fetch all cakes
  const fetchCakes = async () => {
    try {
      setLoading(true);
      const res = await getAllCakes();
      if (res.status === 200 && res.data) {
        setCakes(res.data.data || res.data); // Handle different response structures
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách sản phẩm',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  useEffect(() => {
    paginatedCakes.jump(1);
  }, [searchTerm]);

  const handleDeleteCake = async (id) => {
    try {
      const res = await deleteCake(id);
      if (res.status === 200) {
        notification.success({
          message: 'Xóa sản phẩm',
          description: 'Xóa sản phẩm thành công',
        });
        await fetchCakes(); // Refresh the list
        paginatedCakes.jump(1);
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Xóa sản phẩm thất bại',
        });
      }
    } catch {
      notification.error({
        message: 'Lỗi',
        description: 'Xóa sản phẩm thất bại',
      });
    }
  };

  const handleEditClick = async (record) => {
    const id = record?.id || record?._id; // Kiểm tra cả id và _id
    if (!id) {
      notification.error({
        message: 'Lỗi',
        description: 'Không tìm thấy ID sản phẩm',
      });
      return;
    }

    try {
      console.log('Editing product with ID:', id); // Debug log
      const res = await getCakeById(id);
      console.log('Response from getCakeById:', res); // Debug log
      
      // Kiểm tra cả status và code để đảm bảo tương thích
      if ((res.status === 200 || res.code === 200) && res.data) {
        const productData = res.data.data || res.data;
        console.log('Product data:', productData); // Debug log
        setDataUpdate(productData);
        setIsModalUpdateOpen(true);
      } else {
        console.error('API response error:', res); // Debug log
        notification.error({
          message: 'Lỗi',
          description: `Không lấy được chi tiết sản phẩm. Status: ${res.status || res.code}`,
        });
      }
    } catch (error) {
      console.error('Error in handleEditClick:', error); // Debug log
      notification.error({
        message: 'Lỗi',
        description: `Không lấy được chi tiết sản phẩm: ${error.message}`,
      });
    }
  };

  const handleRefreshProducts = async () => {
    await fetchCakes();
    paginatedCakes.jump(1);
  };

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) =>
        (paginatedCakes.currentPage - 1) * paginatedCakes.pageSize + index + 1,
    },
    {
      title: 'Ảnh sản phẩm',
      dataIndex: 'imageLink',
      render: (text) => (
        <img
          src={text}
          alt="product"
          style={{ width: '100px', height: '90px', objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'price',
      render: (price) => `${price} đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (quantity) => `${quantity}`,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 250,
      render: (text) => (
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '20px' }}>
          <EditOutlined
            onClick={() => {
              console.log('Record data:', record); // Debug log
              handleEditClick(record);
            }}
            style={{ cursor: 'pointer', color: 'orange' }}
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn chắc chắn xóa sản phẩm này?"
            onConfirm={() => handleDeleteCake(record.id || record._id)}
            okText="Yes"
            cancelText="No"
            placement="left"
            okButtonProps={{ style: { backgroundColor: '#664545' } }}
            cancelButtonProps={{
              style: { color: '#664545', borderColor: '#664545' },
            }}
          >
            <DeleteOutlined style={{ cursor: 'pointer', color: 'red' }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="p-3 flex justify-between items-end">
        <h1 className="text-[x-large] font-bold text-[#664545]">
          Quản lý sản phẩm
        </h1>
        <AddProductModal fetchProducts={handleRefreshProducts} />
      </div>

      {/* Tìm kiếm */}
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      {/* Bảng sản phẩm */}
      <Table
        columns={columns}
        dataSource={paginatedCakes.currentData()}
        rowKey={(record) => record.id || record._id}
        pagination={false}
        loading={loading}
        scroll={{ x: true }}
      />

      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={paginatedCakes.currentPage}
          pageSize={paginatedCakes.pageSize}
          total={filteredCakes.length}
          onChange={(page) => paginatedCakes.jump(page)}
          showSizeChanger={false}
        />
      </div>

      {/* Modal Update */}
      <UpdateProductModal
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchProducts={handleRefreshProducts}
      />
    </div>
  );
};

export default AdminProduct;