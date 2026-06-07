# README VẤN ĐÁP RANDOM TEST - CYPRESS TIKI

Tài liệu này dùng để ôn vấn đáp khi giảng viên hỏi ngẫu nhiên một testcase trong project Cypress kiểm thử `https://tiki.vn`. Nội dung bám theo code hiện tại trên nhánh `main`: `search.cy.js` có 18 testcase, `login.cy.js` có 22 testcase, `cart.cy.js` có 17 testcase. Không tự thêm testcase ngoài code.

## 1. Cách trả lời chung khi bị hỏi một testcase bất kỳ

Trả lời theo 6 bước:

1. Testcase thuộc chức năng nào: Search, Login hay Cart.
2. Mục tiêu kiểm thử là gì.
3. Input hoặc trạng thái ban đầu là gì.
4. Cypress thao tác trên website theo các bước nào.
5. Expected output là gì.
6. Assertion nào quyết định Pass/Fail.

Đoạn mẫu học thuộc:

> Thưa cô, testcase này dùng để kiểm thử một hành vi cụ thể của người dùng trên website Tiki. Đầu tiên Cypress mở trang cần kiểm thử, sau đó tìm phần tử bằng selector, nhập dữ liệu nếu testcase có input, rồi click hoặc thao tác giống người dùng thật. Cuối cùng Cypress kiểm tra expected output bằng assertion như `.should(...)`, `expect(...)`, hoặc `cy.url().should(...)`. Nếu actual output đúng với expected output thì testcase Pass, ngược lại là Fail.

## 2. Bản đồ testcase trong project

| STT | Tên file | Tên describe | Testcase trong `it` | Chức năng | Mục tiêu test | Mức độ |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_001 - Hiển thị thành phần tìm kiếm trên trang chủ | Search | Kiểm tra search input và search button | Rất quan trọng |
| 2 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_002 - Tìm kiếm với từ khóa hợp lệ | Search | Search keyword hợp lệ và có kết quả | Rất quan trọng |
| 3 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_003 - Từ khóa tiếng Việt có dấu | Search | Search keyword tiếng Việt có dấu | Quan trọng |
| 4 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_004 - Từ khóa tiếng Việt không dấu | Search | Search keyword không dấu không crash | Quan trọng |
| 5 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_005 - Từ khóa có khoảng trắng đầu/cuối được trim | Search | Search keyword có khoảng trắng | Quan trọng |
| 6 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_006 - Tìm kiếm không phân biệt hoa/thường | Search | Search keyword mixed case | Quan trọng |
| 7 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_007 - Từ khóa dạng số | Search | Search keyword số không crash | Bình thường |
| 8 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_008 - Từ khóa ký tự đặc biệt không gây crash | Search | Search ký tự đặc biệt an toàn | Quan trọng |
| 9 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_009 - Từ khóa không phổ biến không làm trang tìm kiếm bị crash | Search | Keyword lạ vẫn render trang search | Quan trọng |
| 10 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_010 - Click Tìm kiếm khi ô trống không crash | Search | Submit search rỗng | Bình thường |
| 11 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_011 - Nhấn Enter để tìm kiếm | Search | Submit bằng Enter | Quan trọng |
| 12 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_012 - Tìm kiếm từ trang chi tiết sản phẩm | Search | Search từ PDP | Rất quan trọng |
| 13 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_013 - Chọn 1 sản phẩm từ kết quả tìm kiếm điều hướng sang trang chi tiết | Search | Click product card sang PDP | Rất quan trọng |
| 14 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_014 - Breadcrumb hiển thị trên trang chi tiết | Search | Breadcrumb PDP | Quan trọng |
| 15 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_015 - Click danh mục trên menu header | Search | Click category header | Bình thường |
| 16 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_016 - Tìm kiếm nhiều lần liên tiếp | Search | Search lần 1 và lần 2 | Rất quan trọng |
| 17 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_017 - Ô tìm kiếm giữ lại từ khóa đã nhập sau khi tìm kiếm | Search | Input giữ keyword | Quan trọng |
| 18 | `cypress/e2e/search.cy.js` | Chức năng tìm kiếm sản phẩm - Tiki | TKI_SEARCH_018 - Kết quả có đủ tên, hình ảnh và giá | Search | Card có ảnh và text | Quan trọng |
| 19 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_001 - Mở popup đăng nhập từ header | Login | Mở modal login | Rất quan trọng |
| 20 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_002 - Đóng popup đăng nhập | Login | Đóng modal login | Quan trọng |
| 21 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_003 - Nút Tiếp Tục disabled khi chưa nhập số điện thoại | Login | Validate phone rỗng | Rất quan trọng |
| 22 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_004 - Số điện thoại sai định dạng bị từ chối | Login | Validate phone sai | Rất quan trọng |
| 23 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_005 - Ô số điện thoại chặn ký tự chữ | Login | Phone chỉ nhận số | Quan trọng |
| 24 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_006 - Ô số điện thoại chặn ký tự đặc biệt | Login | Phone chặn ký tự đặc biệt | Quan trọng |
| 25 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_007 - Số điện thoại hợp lệ + chưa tick điều khoản không cho đi tiếp | Login | Terms checkbox | Quan trọng |
| 26 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_008 - Số điện thoại hợp lệ + tick điều khoản -> bước OTP | Login | OTP khi env bật | Bình thường |
| 27 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_009 - Link Điều khoản sử dụng hoạt động | Login | Link terms | Bình thường |
| 28 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_010 - Link Chính sách bảo mật hoạt động | Login | Link privacy | Bình thường |
| 29 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_011 - Chuyển sang đăng nhập bằng email | Login | Mở form email | Quan trọng |
| 30 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_012 - Đăng nhập bằng email rỗng bị chặn | Login | Validate email rỗng | Quan trọng |
| 31 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_013 - Đăng nhập bằng email sai định dạng | Login | Validate email sai | Quan trọng |
| 32 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_014 - Đăng nhập bằng email hợp lệ của tài khoản test | Login | Login email khi env bật | Bình thường |
| 33 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_015 - Sai thông tin xác thực hiển thị lỗi | Login | Password sai khi env bật | Bình thường |
| 34 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_016 - Đăng nhập bằng Google mở luồng OAuth | Login | Nút Google khi env bật | Bình thường |
| 35 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_017 - Đăng nhập bằng Facebook mở luồng OAuth | Login | Nút Facebook khi env bật | Bình thường |
| 36 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_018 - Trạng thái sau khi đăng nhập thành công + reload | Login | Session sau reload | Rất quan trọng |
| 37 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_019 - Mở giỏ hàng sau khi đăng nhập không yêu cầu login lại | Login | Cart không hỏi login lại | Rất quan trọng |
| 38 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_020 - Luồng mua hàng sau khi đăng nhập đi thẳng đến checkout | Login | Checkout sau login | Rất quan trọng |
| 39 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_021 - Bảo toàn giỏ hàng sau khi đăng nhập từ popup yêu cầu login | Login | Cart còn item sau login | Rất quan trọng |
| 40 | `cypress/e2e/login.cy.js` | Chức năng đăng nhập - Tiki | TKI_LOGIN_022 - Đăng nhập thất bại không làm mất trạng thái trang trước | Login | Login fail không mất PDP | Quan trọng |
| 41 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_001 - Hiển thị các thành phần chính của trang chi tiết | Cart | PDP có title/image/price/add hoặc hết hàng | Rất quan trọng |
| 42 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_002 - Thông tin giá theo định dạng VND | Cart | Giá đúng dạng tiền | Quan trọng |
| 43 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_003 - Số lượng mặc định là 1 | Cart | Quantity mặc định | Quan trọng |
| 44 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_004 - Tăng số lượng cập nhật giá trị | Cart | Increase quantity | Quan trọng |
| 45 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_005 - Số lượng không giảm dưới 1 | Cart | Decrease không dưới 1 | Quan trọng |
| 46 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_006 - Nhập số lượng không hợp lệ bị từ chối | Cart | Quantity không nhận 0 | Quan trọng |
| 47 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_007 - Thêm sản phẩm với số lượng 1 vào giỏ | Cart | Add cart guest/login | Rất quan trọng |
| 48 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_008 - Guest thêm giỏ hàng hiển thị popup đăng nhập | Cart | Guest bị yêu cầu login | Rất quan trọng |
| 49 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_009 - Đăng nhập trước, thêm giỏ và vào trang giỏ hàng | Cart | Add cart sau login | Rất quan trọng |
| 50 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_010 - Thông tin sản phẩm trong giỏ khớp dữ liệu đã thêm | Cart | Item name/price trong cart | Rất quan trọng |
| 51 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_011 - Tăng số lượng trong giỏ cập nhật thành tiền | Cart | Increase trong cart | Quan trọng |
| 52 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_012 - Giảm số lượng trong giỏ cập nhật thành tiền | Cart | Decrease trong cart | Quan trọng |
| 53 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_013 - Chọn/bỏ chọn 1 sản phẩm cập nhật tổng tiền | Cart | Toggle checkbox item | Bình thường |
| 54 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_014 - Thêm sản phẩm mới vào giỏ rồi xóa | Cart | Xóa item | Quan trọng |
| 55 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_015 - Tổng tiền thanh toán = tổng thành tiền các sản phẩm được chọn | Cart | Tổng tiền đúng | Rất quan trọng |
| 56 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_016 - Freeship chưa đạt ngưỡng hiển thị thông báo cần mua thêm | Cart | Freeship text | Bình thường |
| 57 | `cypress/e2e/cart.cy.js` | Chi tiết sản phẩm & Giỏ hàng - Tiki | TKI_CART_017 - Click Mua Hàng sau khi đăng nhập -> đi tới bước thanh toán | Cart | Checkout sau login | Rất quan trọng |

## 3. Giải thích chi tiết từng testcase

### Cách đọc nhanh mọi mục trong phần 3

Mỗi testcase bên dưới đều có: file, chức năng, mục tiêu, input, expected output, assertion, luồng Cypress, code quan trọng, câu trả lời ngắn, câu hỏi xoáy, điểm yếu và cách trả lời an toàn.

Mẫu câu hỏi xoáy dùng cho từng testcase:

1. Vì sao chọn input/trạng thái này? Trả lời: vì nó bám đúng mục tiêu testcase.
2. Selector có ổn định không? Trả lời: đã có fallback trong `selectors.js`, nhưng nếu HTML Tiki đổi thì vẫn phải cập nhật.
3. Assertion đã đủ mạnh chưa? Trả lời theo từng testcase; nếu chỉ `exist` hoặc skip mềm thì nói chưa đủ mạnh.
4. Nếu test fail thì do đâu? Trả lời: có thể do chức năng lỗi, selector đổi, popup, mạng, dữ liệu live, captcha/session.
5. Nếu Tiki đổi giao diện thì sao? Trả lời: test có thể fail do automation, cần lấy HTML thật rồi sửa selector.

### Testcase 1: TKI_SEARCH_001 - Hiển thị thành phần tìm kiếm trên trang chủ

**File:** `cypress/e2e/search.cy.js`  
**Chức năng:** Search  
**Mục tiêu kiểm thử:** Kiểm tra ô tìm kiếm và nút Tìm kiếm xuất hiện trên trang chủ.  
**Vì sao cần test:** Đây là điểm bắt đầu của mọi luồng tìm kiếm.  
**Input:** Không nhập keyword, chỉ mở trang chủ bằng `cy.visitHome()`.  
**Expected output:** Search input visible, có placeholder; search button visible và không disabled.  
**Actual output:** phụ thuộc kết quả chạy thực tế.  
**Pass/Fail dựa vào:** `.should('be.visible')`, `.and('have.attr', 'placeholder')`, `.and('not.be.disabled')`.

**Luồng Cypress đang chạy:** `beforeEach` gọi `cy.visitHome()` -> `cy.selByList(SEL.header.searchInput)` -> assert input -> `cy.selByList(SEL.header.searchButton)` -> assert button.

**Code quan trọng:** `SEL.header.searchInput` tìm input; `SEL.header.searchButton` tìm nút; `.should(...)` quyết định Pass/Fail.  
**Câu trả lời ngắn:** Test này kiểm tra thành phần tìm kiếm cơ bản của Tiki. Nếu người dùng không thấy input hoặc nút tìm kiếm thì không thể search. Cypress mở trang chủ rồi kiểm tra input và button hiển thị đúng.

**Câu hỏi xoáy:** Xem mẫu 5 câu hỏi xoáy ở đầu phần 3. Riêng testcase này, assertion khá mạnh cho UI cơ bản nhưng chưa kiểm tra thao tác search thật.  
**Điểm yếu:** Phụ thuộc header Tiki và popup; nếu placeholder đổi, assertion có thể fail.  
**Cách trả lời an toàn:** Đây là test smoke cho UI search, nếu triển khai thật có thể bổ sung test nhập keyword ngay sau đó.

### Testcase 2: TKI_SEARCH_002 - Tìm kiếm với từ khóa hợp lệ

**File:** `cypress/e2e/search.cy.js`  
**Chức năng:** Search  
**Mục tiêu kiểm thử:** Kiểm tra keyword hợp lệ đi tới trang search và có sản phẩm.  
**Input:** `data.search.validKeyword` từ fixture, hiện là `sách`.  
**Expected output:** URL chứa `/search`, danh sách sản phẩm có ít nhất 1 product card.  
**Pass/Fail dựa vào:** `cy.url().should('include', '/search')` và `SEL.search.productCard.should('have.length.greaterThan', 0)`.

**Luồng Cypress:** mở trang chủ -> `cy.doSearch(data.search.validKeyword)` -> nhập keyword -> click nút tìm kiếm -> kiểm tra URL -> kiểm tra product card.  
**Code quan trọng:** `cy.doSearch(...)` là helper thao tác search; `SEL.search.productCard` xác nhận kết quả render.  
**Câu trả lời ngắn:** Test này kiểm tra luồng search thành công với keyword phổ biến. Nếu URL không sang `/search` hoặc không có sản phẩm thì testcase fail.

**Câu hỏi xoáy:** Vì sao không assert tên sản phẩm cụ thể? Vì dữ liệu Tiki live thay đổi. Assertion hiện đủ tốt cho luồng cơ bản nhưng chưa kiểm tra từng item có đúng keyword.  
**Điểm yếu:** Phụ thuộc kết quả live của Tiki.  
**Cách trả lời an toàn:** Trong bài tập em kiểm tra luồng end-to-end; nếu thực tế sẽ dùng dữ liệu ổn định hoặc mock API.

### Testcase 3: TKI_SEARCH_003 - Từ khóa tiếng Việt có dấu

**File:** `cypress/e2e/search.cy.js`  
**Chức năng:** Search  
**Mục tiêu:** Kiểm tra Tiki xử lý keyword tiếng Việt có dấu.  
**Input:** `data.search.vietnameseWithAccent` = `sách thiếu nhi`.  
**Expected output:** URL chứa `/search`, có product card.  
**Assertion:** `cy.url().should('include', '/search')`, `productCard.should('have.length.greaterThan', 0)`.  
**Luồng:** `visitHome()` -> `doSearch()` -> kiểm tra URL và kết quả.  
**Code quan trọng:** `.type(keyword)` trong helper nhập chuỗi có dấu; product card chứng minh trang có kết quả.  
**Câu trả lời ngắn:** Test này đảm bảo người dùng nhập tiếng Việt có dấu vẫn tìm kiếm được sản phẩm.

**Câu hỏi xoáy:** Nếu font/encoding lỗi thì sao? Khi đó input hoặc query có thể sai. Nếu kết quả rỗng thì có thể do dữ liệu live. Assertion đủ cho luồng nhưng chưa kiểm tra semantic sản phẩm.  
**Điểm yếu:** Phụ thuộc search engine Tiki.  
**Cách trả lời an toàn:** Cần bổ sung kiểm tra query param hoặc API nếu muốn chặt hơn.

### Testcase 4: TKI_SEARCH_004 - Từ khóa tiếng Việt không dấu

**File:** `cypress/e2e/search.cy.js`  
**Chức năng:** Search  
**Mục tiêu:** Keyword không dấu không làm trang search lỗi.  
**Input:** `data.search.vietnameseNoAccent` = `sach thieu nhi`.  
**Expected output:** URL chứa `/search`, body không chứa `Internal Server Error`.  
**Assertion:** `cy.url().should('include', '/search')`, `cy.get('body').should('not.contain.text', 'Internal Server Error')`.  
**Luồng:** mở home -> search -> kiểm tra không crash.  
**Code quan trọng:** Assertion không yêu cầu có product card, chỉ yêu cầu trang không lỗi server.  
**Câu trả lời ngắn:** Test này kiểm tra hệ thống chịu được keyword không dấu, là hành vi rất thường gặp của người dùng Việt.

**Câu hỏi xoáy:** Assertion này mạnh chưa? Chưa mạnh bằng kiểm tra product card; hiện chỉ kiểm tra không crash.  
**Điểm yếu:** Expected output chưa kiểm tra rõ kết quả search có phù hợp hay không.  
**Cách trả lời an toàn:** Nếu cần nâng cấp, thêm assertion query đúng và có kết quả/gợi ý.

### Testcase 5: TKI_SEARCH_005 - Từ khóa có khoảng trắng đầu/cuối được trim

**File:** `cypress/e2e/search.cy.js`  
**Chức năng:** Search  
**Mục tiêu:** Search keyword có khoảng trắng vẫn xử lý nội dung chính.  
**Input:** `data.search.withWhitespace` = `"  sách  "`.  
**Expected output:** URL chứa `/search`, decoded URL match `/sách/`, có product card.  
**Assertion:** `expect(decoded).to.match(/sách/)`, product card > 0.  
**Luồng:** nhập chuỗi có khoảng trắng -> submit -> kiểm tra URL vẫn chứa keyword chính.  
**Code quan trọng:** `decodeURIComponent(u)` giúp đọc URL đã encode.  
**Câu trả lời ngắn:** Test này kiểm tra hệ thống không bị ảnh hưởng bởi khoảng trắng thừa khi người dùng nhập keyword.

**Câu hỏi xoáy:** Có kiểm tra trim chính xác hai đầu không? Không hoàn toàn, code chỉ kiểm tra URL có `sách`.  
**Điểm yếu:** Assertion chưa chứng minh query đã trim đúng 100%.  
**Cách trả lời an toàn:** Có thể cải thiện bằng kiểm tra `new URLSearchParams(...).get('q').trim()`.

### Testcase 6: TKI_SEARCH_006 - Tìm kiếm không phân biệt hoa/thường

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.mixedCase` = `SÁch Thiếu Nhi`.  
**Mục tiêu:** Keyword hoa/thường lẫn lộn vẫn có kết quả.  
**Expected output:** Có product card.  
**Assertion:** `SEL.search.productCard.should('have.length.greaterThan', 0)`.  
**Luồng:** mở home -> nhập keyword mixed case -> submit -> kiểm tra card.  
**Code quan trọng:** Không so sánh chữ hoa/thường trực tiếp, chỉ kiểm tra hệ thống trả kết quả.  
**Câu trả lời ngắn:** Test này mô phỏng người dùng nhập không chuẩn hoa thường nhưng vẫn tìm được sản phẩm.

**Điểm yếu:** Không kiểm tra URL/query và không so sánh với kết quả chữ thường.  
**Cách trả lời an toàn:** Đây là test hành vi cơ bản; nếu cần chặt hơn sẽ so sánh query hoặc số lượng kết quả giữa hai keyword.

### Testcase 7: TKI_SEARCH_007 - Từ khóa dạng số

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.numeric` = `2025`.  
**Mục tiêu:** Keyword số không làm trang lỗi.  
**Expected output:** URL chứa `/search`, body không chứa `Internal Server Error`.  
**Assertion:** URL include và body not contain server error.  
**Luồng:** search số -> kiểm tra trang search không crash.  
**Câu trả lời ngắn:** Test này kiểm tra input số, vì người dùng có thể tìm model, năm, mã sản phẩm.

**Điểm yếu:** Không kiểm tra có đúng sản phẩm liên quan số hay không.  
**Cách trả lời an toàn:** Assertion hiện kiểm tra độ ổn định, không kiểm tra độ liên quan kết quả.

### Testcase 8: TKI_SEARCH_008 - Từ khóa ký tự đặc biệt không gây crash

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.specialChars` = `@#$%^&*`.  
**Mục tiêu:** Ký tự đặc biệt không gây crash hoặc script injection đơn giản.  
**Expected output:** URL chứa `/search`, HTML không chứa `<script>alert`.  
**Assertion:** `expect($b.html().toLowerCase()).to.not.include('<script>alert')`.  
**Luồng:** nhập ký tự đặc biệt -> submit -> kiểm tra HTML body.  
**Câu trả lời ngắn:** Test này kiểm tra độ an toàn cơ bản của input search với ký tự đặc biệt.

**Điểm yếu:** Assertion bảo mật còn rất cơ bản, không thay thế security testing.  
**Cách trả lời an toàn:** Trong phạm vi UI test, em chỉ kiểm tra không crash/inject rõ ràng.

### Testcase 9: TKI_SEARCH_009 - Từ khóa không phổ biến không làm trang tìm kiếm bị crash

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.noResult` = `4t5783nd57t47`.  
**Mục tiêu:** Keyword lạ vẫn giữ query và trang không lỗi.  
**Expected output:** URL `/search`, query `q` đúng input, input giữ value, body visible, có `main`.  
**Assertion:** `expect(q).to.eq(data.search.noResult)`, input `have.value`, body visible.  
**Luồng:** search keyword lạ -> đọc query bằng `new URL(u).searchParams.get('q')` -> kiểm tra UI.  
**Câu trả lời ngắn:** Test này không ép Tiki phải no-result, chỉ kiểm tra keyword lạ không làm trang search hỏng.

**Điểm yếu:** Không kiểm tra thông báo không có kết quả.  
**Cách trả lời an toàn:** Vì Tiki có thể hiển thị fallback/gợi ý, nhóm em tránh assert cứng no-result.

### Testcase 10: TKI_SEARCH_010 - Click Tìm kiếm khi ô trống không crash

**File:** `cypress/e2e/search.cy.js`  
**Input:** chuỗi rỗng `""`.  
**Expected output:** Pathname match `/` hoặc `/search`, body visible.  
**Assertion:** `cy.location('pathname').should('match', /\/(search)?\/?$/)`.  
**Luồng:** gọi `cy.doSearch('')` -> submit nút search -> kiểm tra không crash.  
**Câu trả lời ngắn:** Test này đảm bảo click search khi ô trống không làm hệ thống lỗi.

**Điểm yếu:** Không kiểm tra thông báo validate cụ thể.  
**Cách trả lời an toàn:** Expected trong code là không crash, không phải bắt buộc hiện lỗi.

### Testcase 11: TKI_SEARCH_011 - Nhấn Enter để tìm kiếm

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.enterKey` = `tai nghe`, submit bằng `{enter}`.  
**Expected output:** URL `/search`, có product card.  
**Assertion:** URL include và product card > 0.  
**Luồng:** `cy.doSearch(keyword, { submit: 'enter' })`.  
**Câu trả lời ngắn:** Test này kiểm tra người dùng dùng bàn phím để search.

**Điểm yếu:** Phụ thuộc kết quả live cho keyword `tai nghe`.  
**Cách trả lời an toàn:** Có thể thêm kiểm tra query param để chắc keyword submit đúng.

### Testcase 12: TKI_SEARCH_012 - Tìm kiếm từ trang chi tiết sản phẩm

**File:** `cypress/e2e/search.cy.js`  
**Input:** vào PDP random rồi search `data.search.fromDetailPage` = `bàn phím`.  
**Expected output:** URL `/search`, query đúng, input visible có value đúng, body không lỗi, có `main`.  
**Assertion:** URL match PDP trước, sau đó URL search, `expect(q).to.eq(...)`, input `have.value`.  
**Luồng:** search sản phẩm -> mở random PDP -> search lại từ PDP -> kiểm tra query.  
**Câu trả lời ngắn:** Test này kiểm tra search header hoạt động không chỉ ở trang chủ mà cả trang chi tiết.

**Điểm yếu:** Phụ thuộc link PDP random.  
**Cách trả lời an toàn:** Nếu fail cần kiểm tra product URL và header search trên PDP.

### Testcase 13: TKI_SEARCH_013 - Chọn 1 sản phẩm từ kết quả tìm kiếm điều hướng sang trang chi tiết

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.validKeyword`, chọn link sản phẩm random.  
**Expected output:** URL match PDP, title sản phẩm visible, body visible.  
**Assertion:** `cy.url().should('match', /...-p\d+\.html.../)`, `SEL.product.title.should('be.visible')`.  
**Luồng:** search -> capture product name -> open random product -> assert PDP.  
**Câu trả lời ngắn:** Test này kiểm tra click sản phẩm từ kết quả search điều hướng đúng sang trang chi tiết.

**Điểm yếu:** Có capture name nhưng không dùng để assert khớp tên.  
**Cách trả lời an toàn:** Có thể cải thiện bằng so sánh tên card với title PDP.

### Testcase 14: TKI_SEARCH_014 - Breadcrumb hiển thị trên trang chi tiết

**File:** `cypress/e2e/search.cy.js`  
**Input:** PDP random từ search.  
**Expected output:** Breadcrumb có hơn 1 item và item đầu chứa `Trang chủ`.  
**Assertion:** breadcrumb length > 1, first contain text `Trang chủ`.  
**Luồng:** search -> mở PDP -> kiểm tra breadcrumb.  
**Câu trả lời ngắn:** Test này kiểm tra người dùng có đường dẫn điều hướng ngược trên PDP.

**Điểm yếu:** Phụ thuộc text tiếng Việt và cấu trúc breadcrumb.  
**Cách trả lời an toàn:** Nếu UI đổi text/selector cần cập nhật theo HTML thật.

### Testcase 15: TKI_SEARCH_015 - Click danh mục trên menu header

**File:** `cypress/e2e/search.cy.js`  
**Input:** category menu nếu tìm thấy trong header.  
**Expected output:** Sau click URL khác trang chủ, body không lỗi server. Nếu không thấy menu thì skip mềm bằng `cy.log`.  
**Assertion:** `cy.url().should('not.eq', baseUrl + '/')`, body not contain server error.  
**Luồng:** tìm category bằng selector list -> click first -> kiểm tra URL/body.  
**Câu trả lời ngắn:** Test này kiểm tra link danh mục header còn hoạt động.

**Điểm yếu:** Nếu không tìm thấy menu thì expected output chưa được kiểm tra rõ trong code.  
**Cách trả lời an toàn:** Đây là skip mềm để tránh fail do UI không render menu.

### Testcase 16: TKI_SEARCH_016 - Tìm kiếm nhiều lần liên tiếp

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.first` = `sách`, `data.search.second` = `laptop`.  
**Expected output:** Mỗi lần URL `/search`, query đúng keyword, có product card; sau lần 2 input giữ `laptop`.  
**Assertion:** `expect(q).to.eq(...)`, product card > 0, input `have.value`.  
**Luồng:** search lần 1 bằng Enter -> assert -> search lần 2 bằng Enter -> assert.  
**Câu trả lời ngắn:** Test này kiểm tra search có thể lặp lại, keyword mới thay keyword cũ.

**Điểm yếu:** Phụ thuộc kết quả live của cả hai keyword.  
**Cách trả lời an toàn:** Nếu fail cần xem query nào sai hoặc trang có bị render chậm không.

### Testcase 17: TKI_SEARCH_017 - Ô tìm kiếm giữ lại từ khóa đã nhập sau khi tìm kiếm

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.displayBack` = `đồ chơi trẻ em`.  
**Expected output:** Search input sau search có value length > 0.  
**Assertion:** `expect(v.length).to.be.greaterThan(0)`.  
**Luồng:** search -> lấy input -> kiểm tra value không rỗng.  
**Câu trả lời ngắn:** Test này kiểm tra UI giữ lại keyword để người dùng biết mình vừa tìm gì.

**Điểm yếu:** Không assert value đúng bằng keyword, chỉ kiểm tra không rỗng.  
**Cách trả lời an toàn:** Có thể cải thiện bằng `should('have.value', data.search.displayBack)`.

### Testcase 18: TKI_SEARCH_018 - Kết quả có đủ tên, hình ảnh và giá

**File:** `cypress/e2e/search.cy.js`  
**Input:** `data.search.richResult` = `sách`.  
**Expected output:** Có product card; card đầu có ảnh source; text card không rỗng.  
**Assertion:** `hasImageSource === true`, `text.trim().length > 0`.  
**Luồng:** search -> product card first -> within card -> check img attr và text.  
**Câu trả lời ngắn:** Test này kiểm tra card kết quả có thông tin hiển thị cơ bản cho người dùng.

**Điểm yếu:** Tên và giá chưa được kiểm tra riêng rõ ràng trong code, dù tên testcase nói có tên/hình ảnh/giá.  
**Cách trả lời an toàn:** Expected output phần giá chưa được kiểm tra rõ trong code hiện tại; cần bổ sung selector giá.

### Testcase 19: TKI_LOGIN_001 - Mở popup đăng nhập từ header

**File:** `cypress/e2e/login.cy.js`  
**Chức năng:** Login  
**Input:** Trang chủ, click Tài khoản.  
**Expected output:** Popup login có title, phone input visible, continue button exist.  
**Assertion:** `SEL.loginPopup.title.should('exist')`, phone input visible, continue button exist.  
**Luồng:** `visitHome()` -> `openLoginPopup()` -> assert modal.  
**Câu trả lời ngắn:** Test này kiểm tra điểm vào luồng đăng nhập từ header hoạt động.

**Điểm yếu:** `container` có fallback `div[role="dialog"]`, có thể nhầm popup khác nếu selector không đủ chặt.  
**Cách trả lời an toàn:** Code kiểm tra thêm title/phone input nên giảm nguy cơ nhầm.

### Testcase 20: TKI_LOGIN_002 - Đóng popup đăng nhập

**File:** `cypress/e2e/login.cy.js`  
**Input:** Popup login đang mở.  
**Expected output:** Popup không còn visible.  
**Assertion:** `expect(stillOpen).to.eq(false)`.  
**Luồng:** mở popup -> `closeLoginPopup()` -> quét container visible.  
**Câu trả lời ngắn:** Test này kiểm tra người dùng có thể đóng modal login.

**Điểm yếu:** Nếu selector close đổi, helper có thể phải fallback bằng ESC.  
**Cách trả lời an toàn:** Nếu fail cần lấy HTML nút đóng mới.

### Testcase 21: TKI_LOGIN_003 - Nút Tiếp Tục disabled khi chưa nhập số điện thoại

**File:** `cypress/e2e/login.cy.js`  
**Input:** Phone input rỗng.  
**Expected output:** Button disabled hoặc click sẽ hiện error.  
**Assertion:** phone `have.value ''`, sau đó `disabled === true` hoặc có error selector.  
**Luồng:** mở popup -> kiểm tra input rỗng -> kiểm tra button.  
**Câu trả lời ngắn:** Test kiểm tra validate bắt buộc nhập số điện thoại.

**Điểm yếu:** Nhánh error chỉ kiểm tra có selector lỗi, chưa kiểm tra text lỗi cụ thể.  
**Cách trả lời an toàn:** Có thể cải thiện bằng assert message chính xác.

### Testcase 22: TKI_LOGIN_004 - Số điện thoại sai định dạng bị từ chối

**File:** `cypress/e2e/login.cy.js`  
**Input:** `data.login.invalidPhone` = `12345`.  
**Expected output:** Có error hoặc vẫn ở phone input.  
**Assertion:** `expect(hasErr || stillVisible).to.eq(true)`.  
**Luồng:** nhập phone sai -> tick terms -> click Tiếp Tục -> kiểm tra error/input.  
**Câu trả lời ngắn:** Test này kiểm tra phone sai không được đi tiếp.

**Điểm yếu:** Không kiểm tra nội dung lỗi cụ thể.  
**Cách trả lời an toàn:** Assertion hiện kiểm tra hành vi bị chặn, chưa kiểm tra message chi tiết.

### Testcase 23: TKI_LOGIN_005 - Ô số điện thoại chặn ký tự chữ

**File:** `cypress/e2e/login.cy.js`  
**Input:** `data.login.invalidWithLetters` = `abcdefghij`.  
**Expected output:** Value chỉ gồm chữ số hoặc rỗng.  
**Assertion:** `expect(/^\d*$/.test(v)).to.eq(true)`.  
**Luồng:** mở popup -> clear phone -> type chữ -> kiểm tra value.  
**Câu trả lời ngắn:** Test đảm bảo ô điện thoại không nhận ký tự chữ.

**Điểm yếu:** Không kiểm tra maxlength hoặc message.  
**Cách trả lời an toàn:** Mục tiêu test này chỉ là chặn chữ ở input.

### Testcase 24: TKI_LOGIN_006 - Ô số điện thoại chặn ký tự đặc biệt

**File:** `cypress/e2e/login.cy.js`  
**Input:** `data.login.invalidWithSpecial` = `@#$%^&*`.  
**Expected output:** Value chỉ gồm số hoặc rỗng.  
**Assertion:** `expect(/^[\d]*$/.test(v)).to.eq(true)`.  
**Luồng:** mở popup -> nhập ký tự đặc biệt với `parseSpecialCharSequences: false` -> assert regex.  
**Câu trả lời ngắn:** Test kiểm tra input phone không nhận ký tự đặc biệt.

**Điểm yếu:** Không kiểm tra popup lỗi, chỉ kiểm tra value input.  
**Cách trả lời an toàn:** Đây là validate cấp input.

### Testcase 25: TKI_LOGIN_007 - Số điện thoại hợp lệ + chưa tick điều khoản không cho đi tiếp

**File:** `cypress/e2e/login.cy.js`  
**Input:** `Cypress.env('TEST_PHONE')` hoặc `0900000000`, checkbox terms unchecked.  
**Expected output:** Button disabled hoặc click xong phone input vẫn visible. Nếu không có checkbox thì skip mềm.  
**Assertion:** `expect(disabled).to.eq(true)` hoặc phone input visible.  
**Luồng:** mở popup -> nhập phone -> tìm checkbox -> uncheck -> kiểm tra button.  
**Câu trả lời ngắn:** Test kiểm tra điều khoản sử dụng là điều kiện trước khi tiếp tục.

**Điểm yếu:** Nếu UI không có checkbox thì expected output chưa được kiểm tra rõ.  
**Cách trả lời an toàn:** Code skip mềm vì UI Tiki có thể thay đổi điều khoản.

### Testcase 26: TKI_LOGIN_008 - Số điện thoại hợp lệ + tick điều khoản -> bước OTP

**File:** `cypress/e2e/login.cy.js`  
**Input:** `RUN_OTP_TESTS`, `TEST_PHONE`, tick terms.  
**Expected output:** Nếu env bật, có OTP input. Nếu env tắt, test chỉ log và return.  
**Assertion:** `expect(matchedOtp).to.eq(true)`.  
**Luồng:** kiểm tra env -> mở popup -> nhập phone -> tick -> click -> tìm OTP input.  
**Câu trả lời ngắn:** Test này chỉ chạy thật khi bật env vì OTP cần tài khoản thật.

**Điểm yếu:** Khi env tắt, expected output chưa được kiểm tra rõ trong code.  
**Cách trả lời an toàn:** Không nói test đã kiểm tra OTP nếu env chưa bật.

### Testcase 27: TKI_LOGIN_009 - Link Điều khoản sử dụng hoạt động

**File:** `cypress/e2e/login.cy.js`  
**Input:** Popup login.  
**Expected output:** Link terms có href match `dieu-khoan|terms|policy`. Nếu không thấy link thì skip mềm.  
**Assertion:** `.should('have.attr','href').and('match', /.../)`.  
**Luồng:** mở popup -> tìm terms link -> assert href.  
**Câu trả lời ngắn:** Test kiểm tra link điều khoản dẫn tới trang hợp lệ.

**Điểm yếu:** Không click mở tab thật; chỉ kiểm tra href.  
**Cách trả lời an toàn:** Kiểm tra href là đủ cho phạm vi UI cơ bản.

### Testcase 28: TKI_LOGIN_010 - Link Chính sách bảo mật hoạt động

**File:** `cypress/e2e/login.cy.js`  
**Input:** Popup login.  
**Expected output:** Link privacy có href match `bao-mat|privacy|policy`. Nếu không thấy link thì skip mềm.  
**Assertion:** `.should('have.attr','href').and('match', /.../)`.  
**Luồng:** mở popup -> tìm privacy link -> assert href.  
**Câu trả lời ngắn:** Test đảm bảo người dùng có thể truy cập chính sách bảo mật từ login.

**Điểm yếu:** Không kiểm tra trang đích load thành công.  
**Cách trả lời an toàn:** Có thể cải thiện bằng kiểm tra request/link target.

### Testcase 29: TKI_LOGIN_011 - Chuyển sang đăng nhập bằng email

**File:** `cypress/e2e/login.cy.js`  
**Input:** Click link đăng nhập bằng email nếu tồn tại.  
**Expected output:** Email input visible. Nếu không thấy link thì skip mềm.  
**Assertion:** `SEL.loginPopup.emailInput.should('be.visible')`.  
**Luồng:** mở popup -> click emailLoginLink -> assert email input.  
**Câu trả lời ngắn:** Test kiểm tra người dùng chuyển từ login phone sang login email.

**Điểm yếu:** Nếu UI không có link thì không kiểm tra expected thật.  
**Cách trả lời an toàn:** Tiki có thể thay đổi luồng login nên code skip mềm.

### Testcase 30: TKI_LOGIN_012 - Đăng nhập bằng email rỗng bị chặn

**File:** `cypress/e2e/login.cy.js`  
**Input:** Email input rỗng.  
**Expected output:** Submit disabled hoặc click xong vẫn ở email input.  
**Assertion:** disabled true hoặc `emailInput.should('be.visible')`.  
**Luồng:** mở popup -> chuyển email -> clear input -> kiểm tra submit.  
**Câu trả lời ngắn:** Test kiểm tra form email không cho submit khi thiếu email.

**Điểm yếu:** Không kiểm tra message cụ thể.  
**Cách trả lời an toàn:** Assertion kiểm tra hành vi bị chặn, chưa kiểm tra text lỗi.

### Testcase 31: TKI_LOGIN_013 - Đăng nhập bằng email sai định dạng

**File:** `cypress/e2e/login.cy.js`  
**Input:** `data.login.invalidEmail` = `invalid-email`.  
**Expected output:** Có error hoặc vẫn ở email input.  
**Assertion:** `expect(errFound || stillOnEmail).to.eq(true)`.  
**Luồng:** mở popup -> chuyển email -> nhập invalid email -> submit -> assert.  
**Câu trả lời ngắn:** Test kiểm tra validate định dạng email.

**Điểm yếu:** Không assert nội dung lỗi chính xác.  
**Cách trả lời an toàn:** Đây là test validate hành vi, có thể bổ sung message.

### Testcase 32: TKI_LOGIN_014 - Đăng nhập bằng email hợp lệ của tài khoản test

**File:** `cypress/e2e/login.cy.js`  
**Input:** `RUN_OTP_TESTS`, `TEST_EMAIL`, `TEST_SECRET`.  
**Expected output:** Nếu env bật, loggedInHeader accountText exist. Nếu env tắt, test log và return.  
**Assertion:** `SEL.loggedInHeader.accountText.should('exist')`.  
**Luồng:** kiểm tra env -> email login -> nhập email/password -> submit -> assert logged in.  
**Câu trả lời ngắn:** Test này là login thật qua email nhưng chỉ chạy khi có cấu hình env.

**Điểm yếu:** Khi env tắt không kiểm tra expected; phụ thuộc tài khoản/captcha.  
**Cách trả lời an toàn:** Không khẳng định login thật đã chạy nếu env chưa bật.

### Testcase 33: TKI_LOGIN_015 - Sai thông tin xác thực hiển thị lỗi

**File:** `cypress/e2e/login.cy.js`  
**Input:** `TEST_EMAIL`, `data.login.invalidSecret`.  
**Expected output:** Nếu env bật, error message tồn tại. Nếu env tắt, test log và return.  
**Assertion:** `expect(errFound).to.eq(true)`.  
**Luồng:** email login -> nhập password sai -> submit -> assert error.  
**Câu trả lời ngắn:** Test kiểm tra hệ thống báo lỗi khi thông tin xác thực sai.

**Điểm yếu:** Phụ thuộc env; không kiểm tra text lỗi cụ thể.  
**Cách trả lời an toàn:** Có thể cải thiện bằng tài khoản test ổn định và assert message.

### Testcase 34: TKI_LOGIN_016 - Đăng nhập bằng Google mở luồng OAuth

**File:** `cypress/e2e/login.cy.js`  
**Input:** `RUN_OAUTH_TESTS`.  
**Expected output:** Nếu env bật, có nút Google. Nếu env tắt, test log và return.  
**Assertion:** `expect(found, 'Có nút Google').to.eq(true)`.  
**Luồng:** env -> open popup -> tìm selector google button.  
**Câu trả lời ngắn:** Test chỉ kiểm tra entry OAuth Google tồn tại, không xử lý OAuth thật.

**Điểm yếu:** Khi env tắt chưa kiểm tra expected; không test callback OAuth.  
**Cách trả lời an toàn:** Cypress khó ổn định với OAuth popup/domain ngoài.

### Testcase 35: TKI_LOGIN_017 - Đăng nhập bằng Facebook mở luồng OAuth

**File:** `cypress/e2e/login.cy.js`  
**Input:** `RUN_OAUTH_TESTS`.  
**Expected output:** Nếu env bật, có nút Facebook. Nếu env tắt, test log và return.  
**Assertion:** `expect(found, 'Có nút Facebook').to.eq(true)`.  
**Luồng:** env -> open popup -> tìm facebook button.  
**Câu trả lời ngắn:** Test kiểm tra UI có entry Facebook OAuth.

**Điểm yếu:** Không test OAuth thật.  
**Cách trả lời an toàn:** Đây là test sự tồn tại nút OAuth, không phải đăng nhập OAuth end-to-end.

### Testcase 36: TKI_LOGIN_018 - Trạng thái sau khi đăng nhập thành công + reload

**File:** `cypress/e2e/login.cy.js`  
**Input:** `RUN_OTP_TESTS`, `cy.loginAsTestUser()`.  
**Expected output:** Account text tồn tại trước và sau reload.  
**Assertion:** `SEL.loggedInHeader.accountText.should('exist')` hai lần.  
**Luồng:** login -> visit home -> assert account -> reload -> assert account.  
**Câu trả lời ngắn:** Test kiểm tra session đăng nhập được giữ sau reload.

**Điểm yếu:** Phụ thuộc login thật, env và captcha.  
**Cách trả lời an toàn:** Nếu env tắt thì test chưa kiểm tra login thật.

### Testcase 37: TKI_LOGIN_019 - Mở giỏ hàng sau khi đăng nhập không yêu cầu login lại

**File:** `cypress/e2e/login.cy.js`  
**Input:** Login thật khi `RUN_OTP_TESTS` bật.  
**Expected output:** URL `/checkout/cart`, login popup không mở.  
**Assertion:** URL include `/checkout/cart`, `expect(popupOpen).to.eq(false)`.  
**Luồng:** login -> visit home -> click cart link -> assert URL/popup.  
**Câu trả lời ngắn:** Test kiểm tra user đã login không bị hỏi đăng nhập lại khi mở cart.

**Điểm yếu:** Phụ thuộc session login và selector popup.  
**Cách trả lời an toàn:** Cần xác nhận bằng UI header/session.

### Testcase 38: TKI_LOGIN_020 - Luồng mua hàng sau khi đăng nhập đi thẳng đến checkout

**File:** `cypress/e2e/login.cy.js`  
**Input:** Login thật, search sản phẩm, add cart.  
**Expected output:** Không mở login popup, URL match checkout/payment/order.  
**Assertion:** `expect(popupOpen).to.eq(false)`, URL regex.  
**Luồng:** login -> search -> PDP -> add cart -> go cart -> click checkout -> assert.  
**Câu trả lời ngắn:** Test kiểm tra sau login, người dùng có thể checkout không bị chặn bởi popup login.

**Điểm yếu:** Phụ thuộc sản phẩm live, add cart, login thật.  
**Cách trả lời an toàn:** Đây là end-to-end flow dài nên dễ flaky hơn test nhỏ.

### Testcase 39: TKI_LOGIN_021 - Bảo toàn giỏ hàng sau khi đăng nhập từ popup yêu cầu login

**File:** `cypress/e2e/login.cy.js`  
**Input:** `RUN_OTP_TESTS`, sản phẩm random, `TEST_PHONE`, `TEST_SECRET`.  
**Expected output:** Sau login từ popup, cart vẫn có item row.  
**Assertion:** `SEL.cart.itemRow.should('have.length.greaterThan', 0)`.  
**Luồng:** add product -> go cart -> checkout mở login -> nhập OTP/secret -> go cart -> assert item.  
**Câu trả lời ngắn:** Test kiểm tra đăng nhập giữa luồng checkout không làm mất giỏ hàng.

**Điểm yếu:** Phụ thuộc OTP/login thật và dữ liệu cart live.  
**Cách trả lời an toàn:** Nếu env tắt thì chưa kiểm tra expected thật.

### Testcase 40: TKI_LOGIN_022 - Đăng nhập thất bại không làm mất trạng thái trang trước

**File:** `cypress/e2e/login.cy.js`  
**Input:** PDP random, phone sai `data.login.invalidPhone`.  
**Expected output:** Sau close popup, URL vẫn bằng detailUrl cũ và title PDP visible.  
**Assertion:** `cy.url().should('eq', u)`, product title visible.  
**Luồng:** search -> PDP -> alias URL -> login fail -> close popup -> assert URL/title.  
**Câu trả lời ngắn:** Test kiểm tra login fail không làm người dùng mất trang sản phẩm đang xem.

**Điểm yếu:** Phụ thuộc PDP random và popup.  
**Cách trả lời an toàn:** Đây là kiểm tra bảo toàn trạng thái UI sau lỗi login.

### Testcase 41: TKI_CART_001 - Hiển thị các thành phần chính của trang chi tiết

**File:** `cypress/e2e/cart.cy.js`  
**Chức năng:** Cart  
**Input:** Sản phẩm random từ search `data.search.validKeyword`.  
**Expected output:** Title visible, image có src/srcset, price exist, có add button hoặc hết hàng.  
**Assertion:** title visible, `expect(src || srcset).to.be.ok`, price exist, `expect(hasAdd || hasOOS).to.eq(true)`.  
**Luồng:** `beforeEach(openRandomProduct)` -> assert PDP component.  
**Câu trả lời ngắn:** Test này kiểm tra trang chi tiết đủ thông tin cơ bản để người dùng quyết định mua.

**Điểm yếu:** Sản phẩm random có thể hết hàng hoặc UI khác.  
**Cách trả lời an toàn:** Code đã chấp nhận trường hợp hết hàng bằng `hasOOS`.

### Testcase 42: TKI_CART_002 - Thông tin giá theo định dạng VND

**File:** `cypress/e2e/cart.cy.js`  
**Input:** PDP random.  
**Expected output:** Text giá không rỗng và có ký hiệu tiền hoặc số tiền.  
**Assertion:** `txt.length > 0`, `expect(hasCurrency || hasMoneyNumber).to.eq(true)`.  
**Luồng:** lấy price text -> remove whitespace -> kiểm tra regex.  
**Câu trả lời ngắn:** Test kiểm tra giá hiển thị ở định dạng người dùng Việt hiểu được.

**Điểm yếu:** Không kiểm tra giá đúng về nghiệp vụ, chỉ format.  
**Cách trả lời an toàn:** Không nên assert cứng giá live.

### Testcase 43: TKI_CART_003 - Số lượng mặc định là 1

**File:** `cypress/e2e/cart.cy.js`  
**Input:** PDP có quantity input.  
**Expected output:** Quantity value bằng `1`. Nếu không có input thì skip mềm.  
**Assertion:** `quantityInput.should('have.value', '1')`.  
**Luồng:** tìm quantity input -> assert value.  
**Câu trả lời ngắn:** Test kiểm tra số lượng mặc định khi mua sản phẩm là 1.

**Điểm yếu:** Nếu UI không có quantity input thì expected chưa được kiểm tra rõ.  
**Cách trả lời an toàn:** Một số sản phẩm/seller có layout khác nên code skip mềm.

### Testcase 44: TKI_CART_004 - Tăng số lượng cập nhật giá trị

**File:** `cypress/e2e/cart.cy.js`  
**Input:** PDP có nút tăng quantity.  
**Expected output:** Sau click, input value bằng `2`.  
**Assertion:** `quantityInput.should('have.value', '2')`.  
**Luồng:** tìm increase -> click -> assert input.  
**Câu trả lời ngắn:** Test kiểm tra nút tăng số lượng hoạt động.

**Điểm yếu:** Nếu không có nút tăng thì skip mềm; không kiểm tra subtotal.  
**Cách trả lời an toàn:** Có thể nâng cấp bằng assert tạm tính thay đổi.

### Testcase 45: TKI_CART_005 - Số lượng không giảm dưới 1

**File:** `cypress/e2e/cart.cy.js`  
**Input:** PDP có nút giảm.  
**Expected output:** Sau click giảm, quantity >= 1.  
**Assertion:** `expect(v).to.be.gte(1)`.  
**Luồng:** click decrease -> parse input value -> assert.  
**Câu trả lời ngắn:** Test đảm bảo người dùng không thể mua số lượng nhỏ hơn 1.

**Điểm yếu:** Nếu không có nút giảm thì skip mềm.  
**Cách trả lời an toàn:** Mục tiêu là kiểm tra ràng buộc biên nhỏ nhất.

### Testcase 46: TKI_CART_006 - Nhập số lượng không hợp lệ bị từ chối

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Nhập `0` vào quantity input nếu input không readonly.  
**Expected output:** Sau blur, value >= 1.  
**Assertion:** `expect(v).to.be.gte(1)`.  
**Luồng:** tìm input -> nếu readonly thì log -> nếu nhập được thì clear/type/blur/assert.  
**Câu trả lời ngắn:** Test kiểm tra UI từ chối số lượng không hợp lệ.

**Điểm yếu:** Chỉ test `0`, chưa test `-1` hoặc `abc` dù fixture có `quantityInvalid`.  
**Cách trả lời an toàn:** Có thể mở rộng bằng loop qua fixture invalid.

### Testcase 47: TKI_CART_007 - Thêm sản phẩm với số lượng 1 vào giỏ

**File:** `cypress/e2e/cart.cy.js`  
**Input:** PDP random, quantity mặc định.  
**Expected output:** Nếu cần login thì popup login visible; nếu không thì success message exist.  
**Assertion:** login container visible hoặc cartPopup successMessage exist.  
**Luồng:** open product -> addCurrentProductToCart -> kiểm tra body.  
**Câu trả lời ngắn:** Test kiểm tra thao tác add cart cơ bản ở trạng thái guest hoặc có session.

**Điểm yếu:** Expected chia hai nhánh nên chưa khẳng định chắc sản phẩm đã vào cart nếu login required.  
**Cách trả lời an toàn:** Đây là test phản ứng sau click add cart.

### Testcase 48: TKI_CART_008 - Guest thêm giỏ hàng hiển thị popup đăng nhập

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Guest add product random.  
**Expected output:** Có login container, phone input hoặc text xin chào.  
**Assertion:** `expect(hasContainer || hasPhoneInput || hasGreeting).to.eq(true)`.  
**Luồng:** open product -> add cart -> assert login prompt.  
**Câu trả lời ngắn:** Test kiểm tra Tiki yêu cầu đăng nhập khi guest thêm giỏ.

**Điểm yếu:** Nếu Tiki cho guest add cart không popup thì test fail dù nghiệp vụ thay đổi.  
**Cách trả lời an toàn:** Expected dựa trên hành vi hiện tại của code/test.

### Testcase 49: TKI_CART_009 - Đăng nhập trước, thêm giỏ và vào trang giỏ hàng

**File:** `cypress/e2e/cart.cy.js`  
**Input:** `cy.ensureLoggedInForCart()`; nếu chưa session thì pause chờ login thủ công.  
**Expected output:** Cart page load, có item hoặc empty state hoặc checkout/summary.  
**Assertion:** `expect(hasItems || hasEmptyState || hasCheckout || hasSummary).to.eq(true)`.  
**Luồng:** login/session -> open product -> add cart -> go cart -> assert cart content.  
**Câu trả lời ngắn:** Test này là luồng ổn định cho cart sau đăng nhập.

**Điểm yếu:** Nếu chưa đăng nhập, cần người chạy thao tác thủ công và xử lý captcha.  
**Cách trả lời an toàn:** Không bypass captcha; Cypress pause để đăng nhập hợp lệ.

### Testcase 50: TKI_CART_010 - Thông tin sản phẩm trong giỏ khớp dữ liệu đã thêm

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Capture product title từ PDP.  
**Expected output:** Item đầu trong cart chứa từ đầu tiên của tên sản phẩm, item price exist.  
**Assertion:** `itemRow.first().should('contain.text', key.split(' ')[0])`, `itemPrice.first().should('exist')`.  
**Luồng:** login -> capture title -> add cart -> go cart -> assert item.  
**Câu trả lời ngắn:** Test kiểm tra sản phẩm trong giỏ khớp với sản phẩm vừa thêm.

**Điểm yếu:** Chỉ so khớp từ đầu tiên, chưa so full name.  
**Cách trả lời an toàn:** So từ đầu giúp giảm flaky do tên dài/variant; nếu cần chặt hơn sẽ so nhiều từ hơn.

### Testcase 51: TKI_CART_011 - Tăng số lượng trong giỏ cập nhật thành tiền

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Cart authenticated có item.  
**Expected output:** Sau click increase, quantity input >= 2.  
**Assertion:** `expect(v).to.be.gte(2)`.  
**Luồng:** prepareAuthenticatedCart -> within first item row -> click increase -> wait -> assert input.  
**Câu trả lời ngắn:** Test kiểm tra tăng số lượng trực tiếp trong cart.

**Điểm yếu:** Tên nói cập nhật thành tiền nhưng code chỉ kiểm tra quantity, chưa assert subtotal/total đổi.  
**Cách trả lời an toàn:** Expected output thành tiền chưa được kiểm tra rõ trong code hiện tại.

### Testcase 52: TKI_CART_012 - Giảm số lượng trong giỏ cập nhật thành tiền

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Cart có item, tăng trước rồi giảm.  
**Expected output:** Sau giảm, quantity >= 1.  
**Assertion:** `expect(v).to.be.gte(1)`.  
**Luồng:** prepare cart -> click increase -> wait -> click decrease -> assert.  
**Câu trả lời ngắn:** Test kiểm tra giảm số lượng không làm quantity lỗi.

**Điểm yếu:** Tên nói cập nhật thành tiền nhưng code chưa kiểm tra tiền đổi.  
**Cách trả lời an toàn:** Cần bổ sung assert subtotal nếu muốn đúng tên testcase hơn.

### Testcase 53: TKI_CART_013 - Chọn/bỏ chọn 1 sản phẩm cập nhật tổng tiền

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Cart có item.  
**Expected output:** Checkbox toggle được và checkout button tồn tại.  
**Assertion:** `SEL.cart.checkoutButton.should('exist')`.  
**Luồng:** prepare cart -> lấy checkbox -> check/uncheck/click -> assert checkout button.  
**Câu trả lời ngắn:** Test kiểm tra thao tác chọn/bỏ chọn item trong cart không làm mất khả năng checkout.

**Điểm yếu:** Expected output tổng tiền chưa được kiểm tra rõ trong code hiện tại.  
**Cách trả lời an toàn:** Nếu bị hỏi, nói test hiện mới kiểm tra toggle và button, cần bổ sung assert tổng tiền.

### Testcase 54: TKI_CART_014 - Thêm sản phẩm mới vào giỏ rồi xóa

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Add một sản phẩm random sau login.  
**Expected output:** Số item row sau xóa bằng trước đó trừ 1.  
**Assertion:** `expect(remaining).to.eq(before - 1)`.  
**Luồng:** login -> add product -> go cart -> đếm item -> click delete -> confirm -> đếm lại.  
**Câu trả lời ngắn:** Test kiểm tra xóa sản phẩm khỏi giỏ thật sự làm giảm số lượng item.

**Điểm yếu:** Dùng `cy.wait()` cố định và phụ thuộc confirm text `Xác Nhận`.  
**Cách trả lời an toàn:** Có thể cải thiện bằng chờ API xóa hoặc empty/item count thay đổi.

### Testcase 55: TKI_CART_015 - Tổng tiền thanh toán = tổng thành tiền các sản phẩm được chọn

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Thêm 2 sản phẩm từ kết quả search, chọn tất cả nếu có.  
**Expected output:** Tổng tiền thanh toán bằng tổng thành tiền các item checked.  
**Assertion:** `expect(totalVal).to.eq(sumThanhTien, ...)`.  
**Luồng:** login -> search -> lấy 2 link -> add từng sản phẩm -> go cart -> chọn tất cả -> parse tiền từng row -> parse tổng -> compare.  
**Câu trả lời ngắn:** Test này kiểm tra nghiệp vụ quan trọng nhất của cart: tổng tiền thanh toán phải đúng.

**Điểm yếu:** Parse tiền từ text UI có thể sai nếu Tiki đổi layout hoặc có discount/fee phức tạp.  
**Cách trả lời an toàn:** Đây là assertion mạnh nhưng phần bóc tách số tiền cần selector rõ hơn để ổn định.

### Testcase 56: TKI_CART_016 - Freeship chưa đạt ngưỡng hiển thị thông báo cần mua thêm

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Cart authenticated có item.  
**Expected output:** Body text có `mua thêm`, `chưa đủ`, `freeship` hoặc `miễn phí vận chuyển`.  
**Assertion:** `expect(meaningful).to.eq(true)`.  
**Luồng:** prepare cart -> lấy body text -> regex freeship.  
**Câu trả lời ngắn:** Test kiểm tra khu vực freeship/khuyến mãi có thông tin cho người dùng.

**Điểm yếu:** Regex rộng, chưa xác định đúng block freeship cụ thể.  
**Cách trả lời an toàn:** Assertion đủ cho smoke test, chưa đủ mạnh cho kiểm tra chi tiết khuyến mãi.

### Testcase 57: TKI_CART_017 - Click Mua Hàng sau khi đăng nhập -> đi tới bước thanh toán

**File:** `cypress/e2e/cart.cy.js`  
**Input:** Cart đã có item, user đã login.  
**Expected output:** Sau click Mua Hàng, URL match `checkout|payment|order`.  
**Assertion:** `cy.url({ timeout: 30000 }).should('match', /checkout|payment|order/)`.  
**Luồng:** prepareAuthenticatedCart -> click checkout button -> assert URL.  
**Câu trả lời ngắn:** Test này kiểm tra luồng checkout sau đăng nhập. Nếu user đã login và giỏ có item, click Mua Hàng phải đi tới bước thanh toán.

**Điểm yếu:** Code hiện đang dùng `it.only` cho testcase này, nên khi chạy `cart.cy.js` chỉ chạy riêng case 17. URL regex rộng, chưa kiểm tra nội dung trang checkout.  
**Cách trả lời an toàn:** Cần gỡ `it.only` trước khi chạy full; nếu muốn chặt hơn thì assert heading/step checkout.

## 4. Phần riêng cho chức năng Tìm kiếm

**Luồng tìm kiếm chung:** `visitHome()` mở trang chủ, `doSearch(keyword)` đóng popup, tìm search input, xóa nội dung cũ, nhập keyword, submit bằng click hoặc Enter, sau đó kiểm tra URL, query, product card hoặc body không crash.

**Các testcase tìm kiếm đang có:** TKI_SEARCH_001 đến TKI_SEARCH_018.

**Input được dùng:** `sách`, `sách thiếu nhi`, `sach thieu nhi`, `"  sách  "`, `SÁch Thiếu Nhi`, `2025`, `@#$%^&*`, `4t5783nd57t47`, chuỗi rỗng, `tai nghe`, `bàn phím`, `laptop`, `đồ chơi trẻ em`.

**Expected output chính:** vào được `/search`, query đúng input, có product card khi keyword hợp lệ, trang không có `Internal Server Error`, input giữ keyword sau search, PDP có title/breadcrumb khi chọn sản phẩm.

**Selector chính:** `SEL.header.searchInput`, `SEL.header.searchButton`, `SEL.search.productCard`, `SEL.search.productCardName`, `SEL.product.title`, breadcrumb selectors.

**Assertion chính:** `cy.url().should('include', '/search')`, `should('have.length.greaterThan', 0)`, `expect(q).to.eq(...)`, `should('not.contain.text', 'Internal Server Error')`, `should('have.value', ...)`.

**Lỗi thường gặp:** popup che input, selector header đổi, keyword live trả kết quả khác, page load lâu do tracking, link random không phải PDP.

**15 câu hỏi vấn đáp Search:**

1. Vì sao test search hợp lệ? Vì đây là luồng người dùng chính.
2. Vì sao test tiếng Việt có dấu/không dấu? Vì người dùng Việt nhập cả hai kiểu.
3. Vì sao kiểm tra `/search`? Vì đó là expected URL sau submit.
4. Vì sao không assert cứng tên sản phẩm? Vì dữ liệu Tiki live thay đổi.
5. Vì sao test ký tự đặc biệt? Để đảm bảo input không làm crash/inject rõ ràng.
6. Vì sao keyword lạ không bắt buộc no-result? Tiki có thể trả fallback/gợi ý.
7. Vì sao test Enter? Người dùng có thể submit bằng bàn phím.
8. Vì sao search từ PDP? Header search phải hoạt động ở nhiều trang.
9. Vì sao dùng selector fallback? DOM Tiki có thể đổi.
10. Nếu popup xuất hiện? Helper `dismissAds()` xử lý.
11. Nếu mạng chậm? Cypress có timeout nhưng website live vẫn flaky.
12. Assertion nào mạnh nhất? Query đúng input kết hợp URL đúng.
13. Điểm yếu lớn nhất? Phụ thuộc dữ liệu live.
14. Nếu kết quả rỗng? Có thể do dữ liệu live hoặc keyword.
15. Cải thiện thế nào? Mock API hoặc dùng dữ liệu/search fixture ổn định hơn.

## 5. Phần riêng cho chức năng Đăng nhập

**Luồng đăng nhập chung:** `visitHome()` mở trang chủ, `openLoginPopup()` click Tài khoản, test kiểm tra phone input, checkbox điều khoản, email login, OAuth button hoặc trạng thái đã đăng nhập tùy testcase.

**Các testcase đăng nhập đang có:** TKI_LOGIN_001 đến TKI_LOGIN_022.

**Input hợp lệ/không hợp lệ:** phone hợp lệ từ `Cypress.env('TEST_PHONE')`, phone sai `12345`, chữ `abcdefghij`, ký tự đặc biệt `@#$%^&*`, email sai `invalid-email`, secret sai `wrong-password-123`.

**Validate theo code:** phone rỗng/sai bị disabled hoặc hiện lỗi; phone input chỉ nhận số; terms checkbox có thể là điều kiện; email rỗng/sai không đi tiếp; OTP/OAuth/login thật chỉ chạy khi env tương ứng bật.

**Selector chính:** `SEL.header.accountLink`, `SEL.loginPopup.container`, `phoneInput`, `continueButton`, `termsCheckbox`, `emailLoginLink`, `emailInput`, `passwordInput`, `errorMessage`, `loggedInHeader.accountText`.

**Assertion chính:** `should('be.visible')`, `should('exist')`, `expect(disabled).to.eq(true)`, regex value chỉ số, `expect(errFound || stillOnEmail).to.eq(true)`, URL/cart/checkout khi login thật.

**Login thật hay không:** Các testcase 001-013 chủ yếu test validate UI. Các testcase 014, 015, 018-021 chỉ chạy login thật khi bật `RUN_OTP_TESTS`. OAuth 016-017 chỉ kiểm tra khi bật `RUN_OAUTH_TESTS`. Nếu env tắt, code chỉ `cy.log(...)` rồi `return`, expected output chưa được kiểm tra rõ trong code.

**15 câu hỏi vấn đáp Login:**

1. Vì sao phải test mở popup login? Vì mọi luồng login bắt đầu từ modal này.
2. Vì sao phone input phải visible? Người dùng cần thấy ô nhập số điện thoại.
3. Vì sao test nút Tiếp Tục disabled? Để kiểm tra bắt buộc nhập dữ liệu.
4. Vì sao test chữ/ký tự đặc biệt? Phone chỉ nên nhận số.
5. Vì sao có checkbox điều khoản? Đây là điều kiện pháp lý.
6. Vì sao OTP test có env flag? Vì cần tài khoản thật và OTP/captcha.
7. Vì sao OAuth không test sâu? Cypress khó xử lý popup/domain ngoài.
8. Nếu popup quảng cáo che login? Dùng `dismissAds()`.
9. Nếu API trả 200 nhưng chưa login? Xác nhận bằng UI header/account.
10. Test nào chỉ validate UI? 001-013.
11. Test nào cần tài khoản thật? 014, 015, 018-021 khi env bật.
12. Có bypass captcha không? Không.
13. Điểm yếu login? Phụ thuộc captcha, session, env.
14. Nếu env tắt thì sao? Test chỉ log và return.
15. Cải thiện thế nào? Dùng account test riêng hoặc API setup session nếu hệ thống cho phép.

## 6. Phần riêng cho chức năng Thêm sản phẩm vào giỏ hàng

**Luồng cart chung:** mở trang chủ, search `sách`, chọn PDP random, click add-to-cart, vào `/checkout/cart`, kiểm tra item/quantity/tổng tiền/checkout.

**Các testcase cart đang có:** TKI_CART_001 đến TKI_CART_017.

**Cách Cypress chọn sản phẩm:** `openRandomProductFromResults()` lấy các link `a[href]`, lọc URL Tiki dạng `-p<ID>.html` hoặc `/p<ID>.html`, chọn random trong tối đa 10 link đầu.

**Cách bấm thêm vào giỏ:** `addCurrentProductToCart()` scroll lên top, tìm selector trong `SEL.product.addToCartButton`, lấy nút visible và không disabled, rồi click.

**Cách kiểm tra sản phẩm vào giỏ:** một số test kiểm tra popup success/login popup; một số test vào cart rồi kiểm tra `itemRow`, `itemPrice`, quantity input, tổng tiền hoặc checkout URL.

**Selector chính:** `SEL.product.title`, `image`, `price`, `quantityInput`, `addToCartButton`, `SEL.cart.itemRow`, `itemPrice`, `itemQuantityIncrease`, `itemQuantityDecrease`, `itemDeleteButton`, `checkoutButton`, `cartTotal`.

**Assertion chính:** title visible, image có src/srcset, price format, quantity value/gte, cart item tồn tại, remaining = before - 1, totalVal = sumThanhTien, URL match checkout/payment/order.

**Nếu Tiki yêu cầu login hoặc có popup:** Code dùng `ensureLoggedInForCart()` và `manualLoginIfNeeded()`. Nếu chưa có session, Cypress pause để đăng nhập thủ công, xử lý captcha nếu có rồi bấm Resume. Popup quảng cáo được xử lý bằng `dismissAds()`.

**15 câu hỏi vấn đáp Cart:**

1. Vì sao test PDP trước cart? Vì người dùng add cart từ trang chi tiết.
2. Vì sao chọn sản phẩm random? Để linh hoạt trên dữ liệu live, nhưng có rủi ro flaky.
3. Vì sao kiểm tra title/image/price? Đây là thông tin mua hàng cơ bản.
4. Vì sao test quantity? Quantity ảnh hưởng tiền và đơn hàng.
5. Vì sao guest add cart hiện login? Tiki có thể yêu cầu xác thực.
6. Vì sao test sau đăng nhập? Checkout thường cần account.
7. Vì sao kiểm tra item name khớp? Để chắc thêm đúng sản phẩm.
8. Vì sao test xóa item? Đây là thao tác quản lý cart cơ bản.
9. Vì sao test tổng tiền? Đây là nghiệp vụ quan trọng.
10. Vì sao test freeship? Khuyến mãi ảnh hưởng quyết định mua.
11. Vì sao URL checkout dùng regex rộng? Tiki có thể dùng checkout/payment/order.
12. Điểm yếu lớn nhất? Login, dữ liệu live, tồn kho, popup.
13. Nếu không có item? Test fail hoặc throw vì thiếu dữ liệu.
14. Nếu captcha? Đăng nhập thủ công trong Cypress Open.
15. Cải thiện thế nào? Dùng sản phẩm test cố định, API setup cart, wait theo request.

## 7. Bảng lệnh Cypress xuất hiện trong project

| Lệnh Cypress | File sử dụng | Ý nghĩa | Ví dụ | Trả lời khi cô hỏi |
| --- | --- | --- | --- | --- |
| `describe()` | 3 spec | Gom nhóm testcase | `describe('Chức năng tìm kiếm...')` | Tổ chức suite test |
| `it()` / `it.only()` | 3 spec | Khai báo testcase | `it('TKI_SEARCH_001...', ...)` | Mỗi `it` là một testcase |
| `before()` | 3 spec | Load fixture | `cy.fixture('testData')` | Chuẩn bị data dùng chung |
| `beforeEach()` | spec/support | Chạy trước mỗi test | `cy.visitHome()` | Đưa test về trạng thái đầu |
| `cy.fixture()` | spec | Đọc data JSON | `cy.fixture('testData')` | Tách input khỏi code |
| `cy.visit()` | commands/spec | Mở URL | `cy.visit('/')` | Mô phỏng người dùng vào trang |
| `cy.get()` | toàn project | Tìm element | `cy.get('body')` | Lấy DOM để thao tác/assert |
| `cy.selByList()` | toàn project | Custom command tìm selector fallback | `cy.selByList(SEL.header.searchInput)` | Tăng độ bền selector |
| `cy.contains()` | cart | Tìm element theo text | `cy.contains('Xác Nhận')` | Dùng khi text UI rõ |
| `.type()` | specs/commands | Nhập dữ liệu | `.type(keyword)` | Mô phỏng gõ phím |
| `.click()` | toàn project | Click element | `.click({ force: true })` | Mô phỏng chuột |
| `.clear()` | login/commands | Xóa input | `.clear()` | Reset input |
| `.check()` / `.uncheck()` | login/cart | Tick checkbox | `.check({ force: true })` | Kiểm tra điều kiện checkbox |
| `.should()` | toàn project | Assertion retry | `.should('be.visible')` | Quyết định Pass/Fail |
| `.and()` | search | Nối assertion | `.and('not.be.disabled')` | Kiểm tra thêm điều kiện |
| `.then()` | toàn project | Callback xử lý subject | `cy.get('body').then(...)` | Dùng logic tùy DOM |
| `expect()` | toàn project | Chai assertion | `expect(v).to.eq(true)` | Kiểm tra điều kiện phức tạp |
| `cy.url()` | specs | Lấy URL hiện tại | `cy.url().should(...)` | Kiểm tra điều hướng |
| `cy.location()` | search | Lấy pathname/search | `cy.location('search')` | Kiểm tra query/path |
| `cy.wait()` | commands/cart | Chờ cố định | `cy.wait(1500)` | Có thể flaky, nên cải thiện |
| `cy.intercept()` | support/e2e.js | Chặn request | Chặn doubleclick/gtm/facebook/hotjar | Giảm nhiễu tracking |
| `cy.session()` | commands.js | Cache session login | `cy.session('tiki-manual-login-cart', ...)` | Tái sử dụng đăng nhập |
| `cy.pause()` | commands.js | Dừng test chờ thủ công | `manualLoginIfNeeded()` | Dùng khi login/captcha |
| `cy.reload()` | login 018 | Reload trang | `cy.reload()` | Kiểm tra session sau reload |
| `cy.wrap()` | toàn project | Bọc DOM/value vào chain | `cy.wrap($btn)` | Tiếp tục dùng Cypress command |
| `.as()` | search/cart/login | Tạo alias | `.as('addedName')` | Lưu dữ liệu tạm |
| `.invoke()` | specs | Gọi method jQuery | `.invoke('text')` | Lấy text/attr |
| `cy.scrollTo()` / `.scrollIntoView()` | cart/commands | Cuộn trang/element | `cy.scrollTo('top')` | Đưa element vào vùng thao tác |
| `cy.window()` | commands | Truy cập window/document | Set password bằng native setter | Xử lý React input khó type |
| `cy.log()` | specs/commands | Ghi log | `cy.log('skip soft')` | Thông báo nhánh không kiểm tra |

Không thấy `cy.xpath()` trong code hiện tại.

## 8. Bảng selector trong project

| Selector | File sử dụng | Dùng để tìm phần tử nào | Rủi ro | Cách giải thích |
| --- | --- | --- | --- | --- |
| `SEL.header.searchInput` | search/login/cart qua helper | Ô tìm kiếm header | Placeholder/data-view-id đổi | Selector chính cho search, có fallback |
| `SEL.header.searchButton` | search/helper | Nút Tìm kiếm | Text/data-view-id đổi | Dùng submit search bằng click |
| `SEL.header.accountLink` | login/commands | Khu vực Tài khoản | Text/class header đổi | Dùng mở popup login |
| `SEL.header.cartLink` | login/cart | Link/icon giỏ hàng | Selector dài dễ gãy | Có fallback `a[href*="/checkout/cart"]` |
| `SEL.search.productCard` | search/cart helper | Card sản phẩm | data-view-id đổi | Xác nhận có kết quả/chọn PDP |
| `SEL.product.title` | search/cart/login | Tên sản phẩm PDP | Layout title đổi | `h1` tương đối ổn |
| `SEL.product.image` | cart | Ảnh PDP | Lazy-load/srcset | Code check `src` hoặc `srcset` |
| `SEL.product.price` | cart | Giá PDP | Class price đổi | Có nhiều fallback |
| `SEL.product.addToCartButton` | cart/login | Nút Thêm vào giỏ/Chọn mua | Text/data-view-id đổi | Nút nghiệp vụ chính |
| `SEL.cart.itemRow` | cart | Dòng sản phẩm trong giỏ | Selector structural dùng `:has`, `:contains` dễ phụ thuộc DOM | Khi fail cần lấy HTML cart thật |
| `SEL.cart.itemDeleteButton` | cart | Nút xóa item | Icon/alt đổi | Dùng test xóa cart |
| `SEL.cart.checkoutButton` | cart/login | Nút Mua Hàng | Text đổi | Dùng đi checkout |
| `SEL.loginPopup.container` | login/commands | Modal login | `div[role="dialog"]` có thể match popup khác | Nên kết hợp input/title |
| `SEL.loginPopup.phoneInput` | login | Ô số điện thoại | Placeholder đổi | Validate phone |
| `SEL.loginPopup.errorMessage` | login | Thông báo lỗi | Text/class lỗi đổi | Validate input sai |
| `SEL.loggedInHeader.accountText/logoutAction` | login/commands | Trạng thái đã đăng nhập | Header đổi | Xác nhận session qua UI |

## 9. Bảng assertion trong project

| Assertion | File/testcase | Kiểm tra gì | Vì sao quyết định Pass/Fail | Mạnh/yếu | Cải thiện |
| --- | --- | --- | --- | --- | --- |
| `.should('be.visible')` | nhiều test | Element hiển thị | Người dùng thấy/thao tác được | Trung bình | Kết hợp text/value |
| `.should('exist')` | nhiều test | Element tồn tại | Không tồn tại thì fail | Yếu-Trung bình | Thêm visible/nội dung |
| `.should('have.length.greaterThan', 0)` | search/cart | Có kết quả/item | Không có element thì fail | Trung bình | Kiểm tra nội dung |
| `cy.url().should('include', '/search')` | search | Điều hướng search | URL sai là flow sai | Mạnh cho điều hướng | Thêm query |
| `expect(q).to.eq(input)` | search | Query đúng keyword | Chứng minh submit đúng | Mạnh | Giữ |
| `.should('not.contain.text', 'Internal Server Error')` | search | Trang không crash | Có lỗi server thì fail | Trung bình | Thêm UI chính |
| `expect(/^\d*$/.test(v)).to.eq(true)` | login phone | Input chỉ có số | Chữ lọt vào thì fail | Mạnh | Thêm maxlength |
| `expect(hasErr || stillVisible).to.eq(true)` | login validate | Sai input bị chặn | Không lỗi và không giữ form thì fail | Trung bình | Assert message cụ thể |
| `expect(popupOpen).to.eq(false)` | login/cart | Không còn popup login | Popup còn thì flow bị chặn | Mạnh | Thêm header/session |
| `expect(v).to.be.gte(1/2)` | cart quantity | Quantity hợp lệ | Sai quantity thì fail | Mạnh | Assert subtotal đổi |
| `expect(remaining).to.eq(before - 1)` | CART_014 | Xóa đúng item | Count không giảm thì fail | Mạnh | Chờ API cụ thể |
| `expect(totalVal).to.eq(sumThanhTien)` | CART_015 | Tổng tiền đúng | Sai nghiệp vụ tiền thì fail | Mạnh | Selector cột tiền rõ hơn |
| `cy.url().should('match', /checkout|payment|order/)` | checkout | Đi tới checkout | URL không đổi thì fail | Trung bình | Assert heading checkout |

## 10. 30 câu hỏi bẫy về code

1. Selector fail có nghĩa Tiki lỗi không? Không chắc, có thể chỉ do DOM đổi.
2. Vì sao không dùng class hash làm selector chính? Vì class hash dễ đổi.
3. Vì sao cần selector fallback? Vì Tiki live có nhiều layout.
4. Assertion `exist` đủ mạnh không? Chưa luôn đủ.
5. URL `/search` có đủ kiểm tra kết quả không? Chỉ kiểm tra điều hướng.
6. Input keyword random ổn không? Không hoàn toàn, vì dữ liệu live thay đổi.
7. Expected output lấy từ đâu? Từ assertion trong code.
8. Pass/Fail do ai quyết định? Cypress/Chai assertion.
9. Nếu test không có assertion rõ? Phải nói expected output chưa được kiểm tra rõ.
10. Vì sao có `cy.wait()`? Để chờ popup/API render, nhưng là điểm yếu.
11. Cải thiện `cy.wait()` thế nào? Chờ element/request cụ thể.
12. Popup quảng cáo ảnh hưởng gì? Che input/nút làm click fail.
13. Code xử lý popup thế nào? Dùng `dismissAds()`.
14. Mạng chậm ảnh hưởng gì? Timeout/page load chậm.
15. Tiki đổi giao diện thì sao? Cần lấy HTML mới cập nhật selector.
16. Giá sản phẩm thay đổi thì sao? Không assert cứng giá live.
17. Tồn kho thay đổi thì sao? Add cart/quantity có thể fail.
18. Login test có đăng nhập thật hết không? Không, nhiều test chỉ validate form.
19. Captcha có bypass không? Không.
20. Cart yêu cầu login thì sao? Helper pause chờ login thủ công.
21. Test tự động khác thủ công thế nào? Tự động có assertion lặp lại được.
22. Vì sao dùng `force: true`? Để click trong UI có overlay/animation, nhưng phải cẩn thận.
23. `cy.then` khác `should` thế nào? `should` retry, `then` chạy callback sau command.
24. Vì sao dùng `Cypress.$`? Để kiểm tra DOM với logic fallback.
25. Fixture dùng để làm gì? Tách input khỏi code.
26. Nếu `RUN_OTP_TESTS` false? Test chỉ log và return.
27. Nếu có `it.only` thì sao? Chỉ chạy testcase đó trong spec.
28. Vì sao chọn product random? Linh hoạt nhưng flaky.
29. Nếu hỏi điểm yếu lớn nhất? Website live phụ thuộc UI, mạng, dữ liệu, popup.
30. Nếu cô hỏi cách cải thiện? Selector ổn định hơn, dữ liệu cố định hơn, assertion chặt hơn.

## 11. Cách chống bí khi cô hỏi một test không nhớ

1. “Testcase này thuộc nhóm kiểm thử chức năng trên giao diện Tiki. Em sẽ đọc tên testcase để xác định chức năng và mục tiêu trước.”
2. “Input của testcase được lấy từ fixture hoặc trạng thái UI hiện tại, em không tự bịa dữ liệu ngoài code.”
3. “Phần code này dùng selector để lấy phần tử trên giao diện. Nếu selector thay đổi thì test có thể fail dù chức năng chưa chắc lỗi.”
4. “Pass/Fail dựa vào assertion trong code, ví dụ `.should(...)` hoặc `expect(...)`, không dựa vào cảm tính.”
5. “Với website live như Tiki, dữ liệu sản phẩm, giá và tồn kho có thể thay đổi nên nhóm em tránh assert cứng dữ liệu thương mại.”
6. “Nếu test fail, em sẽ kiểm tra trước: URL hiện tại, HTML element, popup, network và selector.”
7. “Trong phạm vi bài tập, nhóm em kiểm thử end-to-end qua UI, chưa mock backend hay seed database.”
8. “Nếu testcase có nhánh skip mềm bằng `cy.log`, nghĩa là expected output chưa được kiểm tra đầy đủ trong nhánh đó.”
9. “Nếu cần login/captcha, nhóm em dùng cơ chế thủ công trong Cypress Open để không bypass bảo mật.”
10. “Nếu em không nhớ chi tiết dòng code, em sẽ giải thích theo luồng: mở trang, tìm element, thao tác, kiểm tra expected output.”

## 12. Bản học thuộc 15 phút cuối

**10 câu bắt buộc học thuộc nguyên văn:**

1. “Cypress là công cụ end-to-end testing, mô phỏng thao tác người dùng trên trình duyệt thật.”
2. “Mỗi `it(...)` trong project là một testcase độc lập.”
3. “Expected output của testcase được kiểm tra bằng assertion như `.should(...)` hoặc `expect(...)`.”
4. “Nếu assertion đúng thì testcase Pass, nếu assertion sai hoặc timeout thì testcase Fail.”
5. “Project này kiểm thử ba chức năng chính: tìm kiếm, đăng nhập và giỏ hàng trên Tiki.”
6. “Selector được gom trong `cypress/support/selectors.js` để dễ bảo trì khi Tiki đổi HTML.”
7. “Fixture `testData.json` chứa dữ liệu input dùng cho testcase.”
8. “Vì Tiki là website live nên test có thể bị ảnh hưởng bởi popup, mạng chậm, dữ liệu sản phẩm và thay đổi giao diện.”
9. “Các testcase login thật phụ thuộc env flag và tài khoản test; nếu captcha xuất hiện thì xử lý thủ công, không bypass.”
10. “Khi test fail, cần phân biệt lỗi chức năng thật với lỗi automation như selector sai hoặc popup che.”

**10 khái niệm phải hiểu:** testcase, spec, describe, assertion, selector, fixture, custom command, expected output, actual output, end-to-end testing.

**10 lệnh Cypress phải nhớ:** `cy.visit`, `cy.get`, `cy.fixture`, `cy.intercept`, `cy.url`, `cy.location`, `cy.wait`, `cy.wrap`, `cy.session`, `cy.pause`.

**10 câu trả lời khi bị hỏi xoáy:**

1. “Assertion này kiểm tra expected output chính, nhưng nếu muốn chắc hơn có thể bổ sung thêm kiểm tra nội dung cụ thể.”
2. “Selector này có fallback, nhưng nếu Tiki đổi HTML thì vẫn cần cập nhật theo DOM mới.”
3. “Dữ liệu live không ổn định nên em không assert cứng tên/giá nếu code không kiểm soát dữ liệu đó.”
4. “`cy.wait` là giải pháp tạm để chờ UI/API, tốt hơn là chờ element hoặc request cụ thể.”
5. “Popup quảng cáo không thuộc chức năng cần test nên helper cố đóng để không che thao tác chính.”
6. “Nếu env flag tắt thì testcase chỉ log và return, nhánh đó chưa kiểm tra expected output thật.”
7. “Login thật có captcha/OTP nên nhóm em không bypass mà dùng thao tác thủ công khi cần.”
8. “Test random sản phẩm giúp linh hoạt nhưng có rủi ro flaky do sản phẩm hết hàng hoặc layout khác.”
9. “Nếu chạy full mà chỉ chạy một test thì cần kiểm tra còn `it.only` không.”
10. “Nếu cô hỏi cải thiện, em sẽ nói: dùng selector ổn định hơn, dữ liệu test cố định hơn và assertion chặt hơn.”

**5 lỗi không được nói khi vấn đáp:**

1. Không nói “em không biết test này làm gì” nếu chưa thử đọc tên test và assertion.
2. Không nói “test pass là do em thấy nó chạy được”, phải nói pass do assertion.
3. Không khẳng định chức năng Tiki lỗi ngay khi selector fail.
4. Không nói đã test login thật nếu code chỉ log và return do env flag tắt.
5. Không bịa selector, input hoặc expected output không có trong code.
