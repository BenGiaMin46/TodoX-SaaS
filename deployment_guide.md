# Hướng dẫn Triển khai (Deploy) - TodoX Full-Stack

Làm theo các bước sau để đưa ứng dụng của bạn lên mạng.

## Bước 1: Thiết lập MongoDB Atlas (Cơ sở dữ liệu đám mây)

1.  **Đăng ký**: Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) và tạo một tài khoản miễn phí.
2.  **Tạo Cluster**: Chọn gói **"FREE"** và chọn khu vực (Region) gần bạn nhất (ví dụ: Singapore).
3.  **Bảo mật**:
    *   **Database User**: Tạo một người dùng (ví dụ: `admin`) và đặt mật khẩu an toàn. **Hãy lưu lại mật khẩu này!**
    *   **IP Access List**: Chọn **"Allow Access from Anywhere"** (0.0.0.0/0) để Render có thể kết nối được.
4.  **Kết nối**:
    *   Nhấn **"Connect"** > **"Drivers"** > **"Node.js"**.
    *   Sẽ có một đoạn mã kết nối (Connection String) dạng: `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    *   **Lưu ý**: Thay thế `<password>` bằng mật khẩu bạn đã tạo ở trên.

---

## Bước 2: Đưa Code lên GitHub

1.  Mở Terminal tại thư mục gốc của dự án và chạy các lệnh:
    ```bash
    git init
    git add .
    git commit -m "Chuẩn bị TodoX phiên bản sản xuất"
    ```
2.  Tạo một Repository (kho lưu trữ) mới trên **GitHub**.
3.  Kết nối và đẩy code lên:
    ```bash
    git remote add origin https://github.com/TEN_CUA_BAN/TEN_REPO.git
    git branch -M main
    git push -u origin main
    ```

---

## Bước 3: Triển khai lên Render.com

1.  Đăng nhập vào [Render.com](https://render.com/).
2.  Nhấn nút **New** > **Web Service**.
3.  Kết nối với Repository GitHub bạn vừa tạo.
4.  **Cấu hình**:
    *   **Name**: `todox-app`
    *   **Region**: Chọn cùng khu vực với MongoDB Atlas.
    *   **Build Command**: `npm run build`
    *   **Start Command**: `npm start`
5.  **Biến môi trường (Environment Variables)**:
    Nhấn vào mục "Advanced" hoặc "Environment" và thêm các biến sau:
    *   `MONGODB_URI`: Dán đoạn mã kết nối MongoDB Atlas (đã thay mật khẩu).
    *   `JWT_SECRET`: Nhập một chuỗi ký tự bất kỳ thật dài để bảo mật.
    *   `GOOGLE_CLIENT_ID`: Dán mã Google Client ID của bạn.
    *   `NODE_ENV`: `production`

---

## Bước 4: Hoàn tất Google OAuth

1.  Copy địa chỉ web mới của bạn trên Render (ví dụ: `https://todox-app.onrender.com`).
2.  Truy cập [Google Cloud Console](https://console.cloud.google.com/) > **Credentials**.
3.  Chỉnh sửa OAuth Client ID của dự án TodoX.
4.  Thêm link web Render của bạn vào mục **Authorized JavaScript origins**.
5.  **Lưu lại.** (Có thể mất 5-10 phút để Google cập nhật).

**CHÚC MỪNG! Ứng dụng TodoX của bạn hiện đã trực tuyến và sẵn sàng phục vụ thế giới! 🚀 🌎**
