# 🚀 TodoX - Hệ thống Quản lý Công việc Chuyên nghiệp (Full-Stack)

TodoX là một ứng dụng quản lý công việc (To-do list) hiện đại, được xây dựng với kiến trúc Full-stack (MERN stack), mang lại trải nghiệm mượt mà, giao diện sang trọng và tính năng mạnh mẽ.

## ✨ Tính năng nổi bật

- **🔐 Xác thực an toàn**: Đăng ký/Đăng nhập bằng tài khoản hoặc Google OAuth 2.0.
- **📊 Bảng điều khiển (Dashboard)**: Theo dõi tiến độ công việc với biểu đồ năng suất trực quan.
- **📝 Quản lý Task**: Thêm, sửa, xóa và đánh dấu hoàn thành công việc dễ dàng.
- **🔔 Cảnh báo Deadline**: Tự động nhận diện và cảnh báo các nhiệm vụ sắp đến hạn hoặc quá hạn.
- **📥 Xuất dữ liệu**: Hỗ trợ xuất danh sách công việc ra file Excel (XLSX).
- **🖼️ Hồ sơ cá nhân**: Thay đổi ảnh đại diện và thông tin cá nhân.
- **📱 Giao diện Responsive**: Trải nghiệm tốt trên cả máy tính và điện thoại.
- **✨ Hiệu ứng mượt mà**: Sử dụng Framer Motion và Tailwind CSS cho giao diện hiện đại.

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js & Express**: Xử lý logic máy chủ và API.
- **MongoDB & Mongoose**: Cơ sở dữ liệu NoSQL mạnh mẽ.
- **JWT (JSON Web Token)**: Bảo mật phiên đăng nhập.
- **Multer**: Xử lý tải lên hình ảnh.

### Frontend
- **React.js (Vite)**: Thư viện giao diện người dùng nhanh và hiệu quả.
- **Tailwind CSS**: Framework CSS tiện dụng cho giao diện đẹp.
- **Lucide React**: Bộ biểu đồ biểu tượng hiện đại.
- **Recharts**: Biểu đồ thống kê năng suất.
- **Framer Motion**: Thư viện chuyển động chuyên nghiệp.

## 🚀 Hướng dẫn cài đặt và chạy cục bộ

### 1. Chuẩn bị
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).
- Có tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 2. Cài đặt
Clone dự án và cài đặt các thư viện cần thiết:
```bash
# Cài đặt thư viện cho Backend
npm install

# Cài đặt thư viện cho Frontend
cd frontend
npm install
cd ..
```

### 3. Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc và điền các thông tin:
```env
PORT=5005
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Chạy ứng dụng
Sử dụng lệnh sau tại thư mục gốc để chạy cả Backend và Frontend cùng lúc:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5005](http://localhost:5005)

## 🌐 Triển khai (Deployment)

Dự án đã được tối ưu hóa để triển khai lên **Render.com**:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

## 📄 Giấy phép
Dự án được phát triển cho mục đích học tập và thực hành.

---
**Phát triển bởi BenGiaMin46** 🚀
