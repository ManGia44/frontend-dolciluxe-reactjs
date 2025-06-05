import { Input, Modal, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { updateCake } from "~/api/apiCakes";

const UpdateProductModal = ({ isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, fetchProducts }) => {
  const { TextArea } = Input;

  const [id, setId] = useState("");
  const [productName, setProductName] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState(null);

  // Khi modal mở, cập nhật các state từ dataUpdate
  useEffect(() => {
    if (isModalUpdateOpen && dataUpdate) {
      console.log('DataUpdate in modal:', dataUpdate); // Debug log
      
      // Mapping đúng với cấu trúc dữ liệu từ API
      setId(dataUpdate.id || dataUpdate._id || "");
      setProductName(dataUpdate.productName || ""); // productName thay vì product_name
      setImageFile(dataUpdate.imageLink || ""); // imageLink thay vì image_link
      setPrice(dataUpdate.price !== undefined ? dataUpdate.price.toString() : "");
      setQuantity(dataUpdate.quantity !== undefined ? dataUpdate.quantity.toString() : "");
      setDescription(dataUpdate.description || "");
      setProductType(dataUpdate.productType || null); // productType thay vì product_type_id
    } else {
      // reset khi đóng modal
      setId("");
      setProductName("");
      setImageFile("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setProductType(null);
      setDataUpdate(null);
    }
  }, [isModalUpdateOpen, dataUpdate, setDataUpdate]);

  const handleSubmitBtn = async () => {
    if (!productName || !imageFile || !price || !quantity || !description || !productType) {
      notification.error({
        message: "Validation Error",
        description: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    try {
      // Tạo object dữ liệu để gửi lên server
      const cakeData = {
        productName: productName,
        imageLink: imageFile,
        price: Number(price),
        quantity: Number(quantity),
        description: description,
        productType: productType
      };

      console.log('Sending update data:', { id, cakeData }); // Debug log

      const res = await updateCake(id, cakeData);
      console.log('Update response:', res); // Debug log
      
      if (res.code === 200 || res.status === 200) {
        notification.success({
          message: "Cập nhật sản phẩm",
          description: "Cập nhật bánh thành công",
        });
        setIsModalUpdateOpen(false);
        await fetchProducts();
      } else {
        throw new Error(`Cập nhật thất bại - Status: ${res.status || res.code}`);
      }
    } catch (error) {
      console.error('Update error:', error); // Debug log
      notification.error({
        message: "Lỗi cập nhật sản phẩm",
        description: error.response?.data?.message || error.message || "Cập nhật thất bại",
      });
    }
  };

  return (
    <Modal
      title="Cập nhật sản phẩm"
      open={isModalUpdateOpen}
      onOk={handleSubmitBtn}
      onCancel={() => setIsModalUpdateOpen(false)}
      okButtonProps={{ style: { backgroundColor: "#664545" } }}
      maskClosable={false}
      okText="Cập nhật"
      cancelText="Hủy"
      width={1000}
    >
      <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
        <div>
          <span>Loại bánh</span>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn loại bánh"
            options={[
              { value: '67de79685a1a07a80a724780', label: 'Bánh sinh nhật' },
              { value: '67de79685a1a07a80a724781', label: 'Bánh mỳ & Bánh khác' },
              { value: '67de79685a1a07a80a724783', label: 'Cookies & Mini Cake' },
              { value: '67de79685a1a07a80a724782', label: 'Bánh truyền thống' },
            ]}
            value={productType}
            onChange={setProductType}
          />
        </div>

        <div>
          <span>Sản phẩm</span>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div>
          <span>Hình ảnh (URL)</span>
          <Input
            value={imageFile}
            onChange={(e) => setImageFile(e.target.value)}
            placeholder="Nhập URL hình ảnh"
          />
          {imageFile && (
            <img
              src={imageFile}
              alt="product"
              style={{ width: "100px", height: "90px", objectFit: "cover", marginTop: "10px" }}
            />
          )}
        </div>

        <div>
          <span>Giá</span>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <span>Số lượng</span>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <span>Mô tả</span>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateProductModal;