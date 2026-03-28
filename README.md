# TNTD Fashion Store Manager

Ứng dụng web quản lý bán hàng nội bộ cho cửa hàng thời trang (áo/quần), xây dựng bằng Node.js, Express, EJS, MySQL. Hỗ trợ đăng nhập 2 vai trò (admin, staff), quản lý sản phẩm/biến thể, nhập hàng, bán hàng, khách hàng/NCC, cập nhật tồn kho và báo cáo nhanh.

## Tính năng
- Đăng nhập/đăng xuất, phân quyền: admin (toàn quyền), staff (bán hàng, xem dữ liệu, không xóa master).
- Danh mục, sản phẩm, biến thể (size/màu, SKU, giá bán, giá vốn, tồn kho).
- Nhà cung cấp, khách hàng (dữ liệu kinh doanh, không phải tài khoản web).
- Phiếu nhập: tạo/lưu chi tiết, tự động tăng tồn, lưu nhật ký inventory_movements.
- Hóa đơn bán: kiểm tra tồn, tự lấy giá bán theo biến thể, giảm giá %, tự trừ tồn, lưu nhật ký inventory_movements.
- Dashboard: doanh thu, giá trị nhập, top bán chạy, cảnh báo tồn thấp.

## Yêu cầu hệ thống
- Node.js >= 18
- MySQL 8.0

## Cài đặt
```bash
git clone <repo-url>
cd TNTD-Fashion-Store_Manager
npm install
```

## Cấu hình môi trường
Tạo file `.env` (tham khảo `.env.example`):
```
PORT=3000
SESSION_SECRET=changeme
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=fashion_store_manager
```

## Cơ sở dữ liệu
1) Tạo schema/tables:
```bash
mysql -u <user> -p < database/schema.sql
```
2) Nạp dữ liệu mẫu:
```bash
mysql -u <user> -p fashion_store_manager < database/seed.sql
```

## Chạy ứng dụng
```bash
npm start     # chạy production mode
# hoặc
npm run dev   # dùng nodemon khi phát triển
```

Truy cập: http://localhost:3000

## Tài khoản mặc định (từ seed)
- admin / hashed_admin_pw
- staff01 / hashed_staff_pw

## Phân quyền chính
- Admin: toàn bộ CRUD danh mục/sản phẩm/biến thể, NCC, khách hàng, phiếu nhập, hóa đơn; xem báo cáo.
- Staff: xem danh mục/sản phẩm/biến thể; quản lý khách hàng; tạo/xem hóa đơn bán; xem tồn; không xóa master, không nhập hàng.

## Cấu trúc thư mục chính
- `app.js`               : entry Express
- `config/db.js`         : kết nối MySQL (mysql2/promise)
- `controllers/`         : xử lý nghiệp vụ (auth, dashboard, categories, products, variants, suppliers, customers, purchases, sales)
- `routes/`              : định tuyến Express
- `views/`               : EJS templates, partials
- `public/`              : CSS, asset tĩnh
- `database/`            : schema.sql, seed.sql

## Quy trình nghiệp vụ chính
- Nhập hàng: tạo phiếu nhập -> tăng tồn biến thể -> ghi inventory_movements.
- Bán hàng: kiểm tra tồn (không cho âm), tự lấy giá bán, giảm giá %, trừ tồn, ghi inventory_movements.
- Báo cáo: doanh thu tổng, giá trị nhập, top bán chạy, biến thể sắp hết tồn.

## Lưu ý vận hành
- Mật khẩu seed đang là chuỗi mẫu; đổi sang bcrypt cho môi trường thực.
- Không bật xóa cứng dữ liệu đã phát sinh giao dịch (đã có chặn cơ bản).
- Kiểm tra cấu hình `SESSION_SECRET` và tài khoản DB trước khi deploy.
