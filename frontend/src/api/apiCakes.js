import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Lấy tất cả bánh
export const getAllCakes = () => api.get('/api/product');

// Lấy bánh theo id
export const getCakeById = (id) => api.get(`/api/product/${id}`);

// Lấy bánh theo loại
export const getCakesByType = (typeId) => api.get(`/api/product/by-type/${typeId}`);

// Lấy bánh đã xóa mềm
export const getDeletedCakes = () => api.get('/api/product/trash');

// Tạo mới bánh
export const createCake = (cake) => api.post('/api/product', cake);

// Cập nhật bánh
export const updateCake = (id, cake) => api.put(`/api/product/${id}`, cake);

// Xóa mềm bánh
export const deleteCake = (id) => api.delete(`/api/product/${id}`);

// Khôi phục bánh đã xóa mềm
export const restoreCake = (id) => api.patch(`/api/product/restore/${id}`);

export const getCake = getCakeById;