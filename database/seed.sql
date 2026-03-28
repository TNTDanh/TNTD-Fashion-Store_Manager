INSERT INTO `users` (id, username, password_hash, role) VALUES
(1, 'admin', 'hashed_admin_pw', 'admin'),
(2, 'staff01', 'hashed_staff_pw', 'staff');

INSERT INTO `categories` (id, name, description) VALUES
(1, 'Ao', NULL),
(2, 'Quan', NULL);

INSERT INTO `products` (id, category_id, name, code, description, is_active) VALUES
(1, 1, 'Ao thun basic', 'TSHIRT001', 'Ao thun cotton tron', 1),
(2, 2, 'Quan jeans slim', 'JEAN001', 'Quan jeans slim fit', 1);

INSERT INTO `product_variants` (id, product_id, size, color, sku, price, cost, stock_quantity) VALUES
(1, 1, 'M', 'White', 'TSHIRT001-M-WH', 180000.00, 90000.00, 17),
(2, 1, 'L', 'Black', 'TSHIRT001-L-BK', 180000.00, 90000.00, 5),
(3, 2, '30', 'Blue', 'JEAN001-30-BL', 450000.00, 250000.00, 14),
(4, 2, '32', 'Black', 'JEAN001-32-BK', 450000.00, 250000.00, 9);

INSERT INTO `customers` (id, name, phone, email, address) VALUES
(1, 'Nguyen Van A', '0901234567', 'a@example.com', 'Q1, TP HCM'),
(2, 'Tran Thi B', '0912345678', 'b@example.com', 'Q3, TP HCM');

INSERT INTO `suppliers` (id, name, phone, email, address) VALUES
(1, 'Nha cung cap May Mac', '0933111222', 'ncpm@example.com', 'Binh Tan, TP HCM'),
(2, 'Kho vai Gia Cong', '0944222333', 'kv@example.com', 'Tan Binh, TP HCM');

INSERT INTO `purchase_receipts` (id, supplier_id, user_id, receipt_date, total_amount, note) VALUES
(1, 1, 1, '2024-05-01 09:00:00', 8500000.00, 'Nhap hang thang 5');

INSERT INTO `purchase_receipt_items` (id, receipt_id, product_variant_id, quantity, unit_cost, line_total) VALUES
(1, 1, 1, 20, 90000.00, 1800000.00),
(2, 1, 2, 5, 90000.00, 450000.00),
(3, 1, 3, 15, 250000.00, 3750000.00),
(4, 1, 4, 10, 250000.00, 2500000.00);

INSERT INTO `sales_invoices` (id, customer_id, user_id, invoice_date, total_amount, discount_percent, final_amount, note) VALUES
(1, 1, 2, '2024-05-05 14:00:00', 810000.00, 0.00, 810000.00, 'Ban le'),
(2, 2, 2, '2024-05-06 16:30:00', 630000.00, 10.00, 567000.00, 'Giam gia thanh vien');

INSERT INTO `sales_invoice_items` (id, invoice_id, product_variant_id, quantity, unit_price, line_total) VALUES
(1, 1, 1, 2, 180000.00, 360000.00),
(2, 1, 3, 1, 450000.00, 450000.00),
(3, 2, 1, 1, 180000.00, 180000.00),
(4, 2, 4, 1, 450000.00, 450000.00);

INSERT INTO `inventory_movements` (id, product_variant_id, movement_type, ref_type, ref_id, quantity, note) VALUES
(1, 1, 'purchase', 'purchase_receipt', 1, 20, 'Nhap kho'),
(2, 2, 'purchase', 'purchase_receipt', 1, 5, 'Nhap kho'),
(3, 3, 'purchase', 'purchase_receipt', 1, 15, 'Nhap kho'),
(4, 4, 'purchase', 'purchase_receipt', 1, 10, 'Nhap kho'),
(5, 1, 'sale', 'sales_invoice', 1, -2, 'Xuat ban'),
(6, 3, 'sale', 'sales_invoice', 1, -1, 'Xuat ban'),
(7, 1, 'sale', 'sales_invoice', 2, -1, 'Xuat ban'),
(8, 4, 'sale', 'sales_invoice', 2, -1, 'Xuat ban');
