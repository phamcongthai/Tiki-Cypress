/**
 * Tập trung các selector cho website Tiki.
 * Nếu Tiki thay đổi DOM, chỉ cần cập nhật file này.
 *
 * Ưu tiên dùng selector ổn định (data-view-id, role, non-text fallbacks).
 * Mỗi selector có thể là chuỗi CSS hoặc mảng fallback — file commands.js
 * sẽ thử lần lượt cho tới khi tìm thấy phần tử.
 *
 * QUAN TRỌNG — KHÔNG dùng cờ case-insensitive [attr*="x" i]:
 * engine jQuery/Sizzle (cy.get, Cypress.$.find) KHÔNG hỗ trợ cờ "i" và sẽ
 * throw "unrecognized expression". Để khớp không phân biệt hoa/thường, ta bỏ
 * ký tự đầu (chữ dễ đổi hoa/thường) và khớp phần còn lại, vd "oogle" khớp cả
 * "Google" lẫn "google".
 */
module.exports = {
  header: {
    searchInput: [
      'input[data-view-id="main_search_form_input"]',
      'input[name="q"]',
      'header input[placeholder][type="text"]',
    ],
    searchButton: [
      '[data-view-id="main_search_form_button"]',
      'button[data-view-id*="main_search_form"]',
      'button[data-view-id*="search"]',
      'form[action*="/search"] button[type="submit"]',
    ],
    accountLink: [
      '[data-view-id="header_header_account_link"]',
      '[data-view-id*="account"]',
      'a:contains("Tài khoản")',
    ],
    cartLink: [
      '[data-view-id="header_header_cart_link"]',
      'a[href*="/checkout/cart"]',
    ],
    cartBadge: [
      '[data-view-id="header_header_cart_link"] span',
      'a[href*="/checkout/cart"] span',
    ],
    categoryMenu: [
      '[data-view-id*="header_main_category"]',
      'header a[title]',
    ],
  },

  search: {
    resultsContainer: [
      '[data-view-id="product_list_container"]',
      '.product-list',
      'main',
    ],
    productCard: [
      '[data-view-id="product_list_item"]',
      '[data-view-id*="product_list_item"]',
      'a[href*="/p"][data-view-id]',
    ],
    productCardName: [
      '[data-view-id*="product_list_item"] h3',
      '.style__NameStyled',
      'div[class*="name"]',
    ],
    productCardImage: ['img'],
    productCardPrice: [
      '[data-view-id*="product_list_item"] [class*="price"]',
      'div[class*="price"]',
    ],
    noResultMessage: [
      '[data-view-id="product_list_no_result"]',
      'img[alt*="No"]',
      ':contains("Rất tiếc")',
      ':contains("không tìm thấy")',
    ],
    breadcrumb: ['nav[aria-label*="readcrumb"]', '.breadcrumb'],
  },

  product: {
    title: ['h1', '[class*="product-title"]'],
    image: ['[class*="WebpImage"] img', '.product-image img', 'picture img'],
    thumbnails: [
      '[data-view-id="pdp_thumbnail_item"]',
      '.product-thumbnail',
      'button[class*="thumbnail"]',
    ],
    price: [
      '[data-view-id="pdp_main_view_listing_price"]',
      '.product-price__current-price',
      '[class*="current-price"]',
    ],
    originalPrice: [
      '.product-price__list-price',
      '[class*="list-price"]',
    ],
    quantityInput: [
      'input[data-view-id="pdp_main_view_quantity_input"]',
      'input[type="text"][value][class*="quantity"]',
    ],
    quantityIncrease: [
      '[data-view-id="pdp_main_view_quantity_increase"]',
      'button[class*="btn-increase"]',
      'button:has(svg[data-view-id*="increase"])',
    ],
    quantityDecrease: [
      '[data-view-id="pdp_main_view_quantity_decrease"]',
      'button[class*="btn-decrease"]',
    ],
    addToCartButton: [
      '[data-view-id="pdp_add_to_cart_button"]',
      'button:contains("Thêm vào giỏ")',
    ],
    buyNowButton: [
      '[data-view-id="pdp_buy_now_button"]',
      'button:contains("Mua ngay")',
    ],
    subtotal: ['[class*="subtotal"]', '[data-view-id*="subtotal"]'],
    breadcrumb: ['[data-view-id="breadcrumb_item"]', '.breadcrumb', '.breadcrumb-item'],
    outOfStockBadge: [':contains("Hết hàng")'],
  },

  cartPopup: {
    successMessage: [
      ':contains("đã được thêm vào giỏ hàng")',
      ':contains("thêm vào giỏ hàng")',
      '[role="alert"]',
    ],
    viewCartButton: [
      'a:contains("Xem giỏ hàng và thanh toán")',
      'button:contains("Xem giỏ hàng")',
    ],
  },

  cart: {
    pageContainer: ['[data-view-id="cart_page_container"]', 'main'],
    itemRow: [
      '[data-view-id="cart_item_view"]',
      '[class*="cart-item"]',
      'div[class*="ItemStyled"]',
    ],
    itemName: ['[class*="item-name"]', 'a[class*="name"]'],
    itemPrice: ['[class*="item-price"]', '[class*="ProductPrice"]'],
    itemQuantityInput: ['input[type="text"][value]'],
    itemQuantityIncrease: ['button[class*="increase"]', 'button:contains("+")'],
    itemQuantityDecrease: ['button[class*="decrease"]', 'button:contains("-")'],
    itemDeleteButton: [
      'button[class*="delete"]',
      'svg[data-view-id*="trash"]',
      'button[aria-label*="óa"]',
    ],
    itemSubtotal: ['[class*="item-total"]', '[class*="ProductTotalPrice"]'],
    itemCheckbox: ['input[type="checkbox"]'],
    selectAllCheckbox: [
      '[data-view-id="cart_select_all_checkbox"]',
      'label:contains("Tất cả") input[type="checkbox"]',
    ],
    cartTotal: [
      '[data-view-id="cart_order_summary_total"]',
      '[class*="OrderSummary"]',
    ],
    subtotalAmount: [
      '[data-view-id*="subtotal"]',
      ':contains("Tạm tính")',
    ],
    discountAmount: [':contains("Giảm giá")'],
    finalAmount: [
      '[data-view-id="cart_order_summary_final"]',
      ':contains("Tổng tiền") + *',
    ],
    checkoutButton: [
      '[data-view-id="cart_order_summary_checkout_button"]',
      'button:contains("Mua Hàng")',
    ],
    emptyState: [
      ':contains("Giỏ hàng trống")',
      ':contains("Không có sản phẩm")',
      'img[alt*="mpty"]',
    ],
    freeshipBlock: [':contains("reeship")', ':contains("FREESHIP")'],
    promotionBlock: [':contains("Khuyến Mãi")', ':contains("Khuyến mãi")'],
  },

  loginPopup: {
    container: [
      '[data-view-id="login_dialog"]',
      'div[role="dialog"]',
      '[class*="ModalLogin"]',
    ],
    title: [':contains("Xin chào")'],
    phoneInput: [
      'input[name="tel"]',
      'input[type="tel"]',
      'input[placeholder*="iện thoại"]',
    ],
    termsCheckbox: ['input[type="checkbox"]'],
    continueButton: [
      'button:contains("Tiếp Tục")',
      'button:contains("Tiếp tục")',
    ],
    closeButton: [
      'button[aria-label*="lose"]',
      'button[class*="close"]',
      'svg[data-view-id*="close"]',
    ],
    emailLoginLink: [
      'a:contains("Đăng nhập bằng email")',
      'button:contains("Đăng nhập bằng email")',
    ],
    emailInput: [
      'input[type="email"]',
      'input[name="email"]',
      'input[placeholder*="mail"]',
    ],
    passwordInput: ['input[type="password"]', 'input[name="password"]'],
    emailSubmitButton: [
      'button:contains("Đăng nhập")',
      'button[type="submit"]',
    ],
    termsLink: [
      'a:contains("điều khoản sử dụng")',
      'a[href*="dieu-khoan"]',
    ],
    privacyLink: [
      'a:contains("Chính sách bảo mật")',
      'a[href*="bao-mat"]',
    ],
    googleButton: [
      '[data-view-id*="google"]',
      'button[aria-label*="oogle"]',
      'img[alt*="oogle"]',
    ],
    facebookButton: [
      '[data-view-id*="facebook"]',
      'button[aria-label*="acebook"]',
      'img[alt*="acebook"]',
    ],
    errorMessage: [
      '[class*="error"]',
      ':contains("không hợp lệ")',
      ':contains("không đúng")',
    ],
    otpInput: ['input[name="otp"]', 'input[maxlength="6"]'],
  },

  loggedInHeader: {
    accountText: [':contains("Tài khoản") + *', '[data-view-id*="account_name"]'],
    avatar: ['img[alt*="vatar"]', '[data-view-id*="account_avatar"]'],
  },
};
