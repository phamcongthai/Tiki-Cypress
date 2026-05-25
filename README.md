# Tiki Cypress Automation Test

## Mục tiêu project

Project dùng Cypress để kiểm thử tự động chức năng tìm kiếm sản phẩm trên website Tiki.

Trọng tâm hiện tại là test luồng search, search từ trang chủ, search từ trang kết quả, search từ trang chi tiết sản phẩm, kiểm tra điều hướng, popup, breadcrumb, product detail và dữ liệu hiển thị cơ bản.

## Kết quả thực hiện ngày 25/05/2025

Các việc đã hoàn thành:

- Hoàn thiện bộ testcase search cho Tiki.
- Xử lý lỗi search không điều hướng sang `/search`.
- Xác nhận assertion `/search` là hợp lý với hành vi thực tế của Tiki.
- Xử lý popup/overlay che input search.
- Sửa testcase keyword không phổ biến: không còn assert cứng `no result` vì Tiki vẫn có thể hiển thị fallback/gợi ý/sản phẩm liên quan.
- Sửa regex URL trang chi tiết sản phẩm theo format thực tế `-p<ID>.html`.
- Sửa selector breadcrumb theo DOM thật `.breadcrumb` và `[data-view-id="breadcrumb_item"]`.
- Sửa selector product detail dựa trên `h1` và `.product-price__current-price`.
- Sửa kiểm tra ảnh sản phẩm để phù hợp lazy-load/srcset.
- Sửa luồng search nhiều lần liên tiếp.
- Đưa bộ test search về trạng thái chạy ổn định.

## Phase hoàn thành

### Phase 1: Khảo sát hành vi thực tế của Tiki

Hoàn thành.

Các hành vi đã xác nhận:

- Search hợp lệ chuyển sang `/search?q=...`.
- Keyword lạ không nhất thiết hiển thị no-result.
- Tiki có popup/overlay có thể che input search.
- Trang chi tiết sản phẩm có search input riêng trên header.
- Product detail URL có format `-p<ID>.html`.
- Breadcrumb tồn tại trên trang chi tiết sản phẩm.

### Phase 2: Xây dựng và ổn định testcase search

Hoàn thành.

Các nhóm testcase đã ổn định:

- Hiển thị search component.
- Search keyword hợp lệ.
- Search tiếng Việt có dấu và không dấu.
- Search với khoảng trắng đầu/cuối.
- Search không phân biệt hoa/thường.
- Search keyword dạng số.
- Search ký tự đặc biệt.
- Search keyword không phổ biến.
- Search bằng Enter.
- Search từ trang chi tiết sản phẩm.
- Chọn sản phẩm từ kết quả search.
- Breadcrumb trang chi tiết.
- Click danh mục header.
- Search nhiều lần liên tiếp.
- Kiểm tra input giữ keyword sau search.
- Kiểm tra kết quả có tên, ảnh và giá.

### Phase 3: Cleanup project

Hoàn thành trong lần cập nhật này.

Các việc thực hiện:

- Dọn artifact cũ.
- Chuẩn hóa folder.
- Tạo `.gitkeep` cho folder artifact cần giữ.
- Cập nhật `.gitignore`.
- Bổ sung README.

## Cấu trúc thư mục

```txt
cypress/
├─ e2e/
├─ fixtures/
├─ support/
├─ screenshots/
├─ videos/
└─ downloads/
docs/
reports/
```

## Cài đặt

```bash
npm install
```

## Cách chạy test

Chạy toàn bộ test search:

```bash
npm run test:search
```

Mở Cypress runner:

```bash
npx cypress open
```

## Ghi chú vận hành

- Cypress có thể hiện popup nhiều hơn trình duyệt thường vì session/cookie/localStorage sạch.
- Không nên assert quá cứng vào dữ liệu live của Tiki.
- Với website live, UI/selector có thể thay đổi theo thời gian.
- Khi sửa test, ưu tiên selector ổn định như `data-view-id`, không dùng class hash/generated nếu có lựa chọn tốt hơn.
- Không gọi keyword lạ là fuzzy search nếu chưa có bằng chứng từ UI/API/source code.
