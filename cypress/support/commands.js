const SELECTORS = require('./selectors');

/**
 * cy.selByList(list) — thử nhiều selector lần lượt, trả về phần tử đầu tiên tìm thấy.
 * Nhận chuỗi hoặc mảng. Có hỗ trợ `:contains()` jQuery.
 */
Cypress.Commands.add('selByList', (list, opts = {}) => {
  const arr = Array.isArray(list) ? list : [list];
  const tryNext = (idx) => {
    if (idx >= arr.length) {
      throw new Error(`Không tìm thấy element với selectors: ${arr.join(' | ')}`);
    }
    const sel = arr[idx];
    return cy.get('body', { log: false }).then(($body) => {
      const $el = Cypress.$($body).find(sel);
      if ($el.length > 0) {
        return cy.get(sel, opts).first();
      }
      return tryNext(idx + 1);
    });
  };
  return tryNext(0);
});

/**
 * Đóng các popup quảng cáo/khuyến mãi của Tiki (Flash Sale, TIKI VIP, voucher…).
 * Best-effort: không fail nếu không thấy popup.
 * Có thể được gọi an toàn ở bất kỳ thời điểm nào.
 */
Cypress.Commands.add('dismissAds', () => {
  const adCloseSelectors = [
    // X button trong dialog quảng cáo
    'div[role="dialog"] button[aria-label*="close" i]',
    'div[role="dialog"] button[aria-label*="đóng" i]',
    'div[role="dialog"] [class*="close" i]',
    'div[role="dialog"] img[alt*="close" i]',
    // Popup container theo class phổ biến của Tiki
    '[class*="PopupStyle"] [class*="close" i]',
    '[class*="ModalAd"] [class*="close" i]',
    '[class*="Modal"][class*="ad" i] [class*="close" i]',
    '[class*="Popup"] button[class*="close" i]',
    '[class*="Popup"] svg[class*="close" i]',
    // Floating banner / sticky banner
    '[class*="floating-banner"] [class*="close" i]',
    '[class*="sticky"] [class*="close" i]',
    // App download banner / coupon banner
    '[class*="app-banner"] [class*="close" i]',
    '[data-view-id*="popup"] [data-view-id*="close"]',
    '[data-view-id*="banner"] [data-view-id*="close"]',
    // Generic fallback: button có aria-label đóng nằm trong overlay/dialog
    '[class*="overlay"] button[aria-label*="đóng" i]',
    '[class*="Overlay"] button[aria-label*="Close" i]',
  ];

  cy.get('body', { log: false }).then(($body) => {
    let closed = 0;
    for (const sel of adCloseSelectors) {
      const $el = Cypress.$($body).find(sel).filter(':visible');
      if ($el.length > 0) {
        $el.each((_, el) => {
          Cypress.$(el).trigger('click');
          closed += 1;
        });
      }
    }
    if (closed > 0) cy.log(`dismissAds: đã đóng ${closed} popup`);
  });

  // Layer 2 — CSS injection ẩn cứng các popup quảng cáo phổ biến.
  cy.window({ log: false }).then((win) => {
    if (win.__tikiAdsHidden) return;
    const style = win.document.createElement('style');
    style.id = 'cypress-hide-tiki-ads';
    style.innerHTML = `
      [class*="PopupStyle"]:not([class*="Login"]),
      [class*="ModalAd"],
      [class*="floating-banner"],
      [class*="app-download-banner"],
      [class*="sticky-banner"],
      [class*="coupon-popup"] {
        display: none !important;
        visibility: hidden !important;
      }
    `;
    win.document.head.appendChild(style);
    win.__tikiAdsHidden = true;
  });
});

/** Vào trang chủ Tiki và đợi search input xuất hiện. Tự động đóng popup ads. */
Cypress.Commands.add('visitHome', () => {
  cy.visit('/');
  cy.selByList(SELECTORS.header.searchInput, { timeout: 30000 }).should('be.visible');
  // Đợi 1 nhịp cho popup ad delay-load xuất hiện rồi mới đóng
  cy.wait(1500);
  cy.dismissAds();
});

/** Thực hiện tìm kiếm với 1 keyword + tùy chọn submit kiểu click hay Enter. */
Cypress.Commands.add('doSearch', (keyword, { submit = 'click' } = {}) => {
  cy.selByList(SELECTORS.header.searchInput).as('searchInput');
  cy.get('@searchInput').clear();
  if (keyword && keyword.length > 0) {
    cy.get('@searchInput').type(keyword, { delay: 30 });
  }
  if (submit === 'enter') {
    cy.get('@searchInput').type('{enter}');
  } else {
    cy.selByList(SELECTORS.header.searchButton).click({ force: true });
  }
});

/** Mở 1 sản phẩm bất kỳ từ trang kết quả tìm kiếm. */
Cypress.Commands.add('openRandomProductFromResults', () => {
  cy.selByList(SELECTORS.search.productCard, { timeout: 30000 }).should('have.length.greaterThan', 0);
  cy.get('body').then(($body) => {
    const cards = SELECTORS.search.productCard
      .map((s) => Cypress.$($body).find(s))
      .find((c) => c.length > 0);
    if (!cards || cards.length === 0) {
      throw new Error('Không có sản phẩm nào hiển thị trong kết quả tìm kiếm.');
    }
    const idx = Math.floor(Math.random() * Math.min(cards.length, 10));
    cy.wrap(cards[idx]).scrollIntoView().click({ force: true });
  });
  cy.wait(1500);
  cy.dismissAds();
});

/** Mở popup đăng nhập từ header. */
Cypress.Commands.add('openLoginPopup', () => {
  cy.dismissAds();
  cy.selByList(SELECTORS.header.accountLink, { timeout: 20000 })
    .click({ force: true });
  cy.selByList(SELECTORS.loginPopup.container, { timeout: 15000 }).should('be.visible');
});

/** Đóng popup đăng nhập (nếu đang mở). */
Cypress.Commands.add('closeLoginPopup', () => {
  cy.get('body').then(($body) => {
    const sels = SELECTORS.loginPopup.closeButton;
    for (const sel of sels) {
      if (Cypress.$($body).find(sel).length > 0) {
        cy.get(sel).first().click({ force: true });
        return;
      }
    }
    cy.get('body').type('{esc}');
  });
});

/** Truy cập trang giỏ hàng trực tiếp. */
Cypress.Commands.add('goToCart', () => {
  cy.visit('/checkout/cart');
  cy.selByList(SELECTORS.cart.pageContainer, { timeout: 30000 }).should('exist');
  cy.wait(1000);
  cy.dismissAds();
});

/** Đăng nhập bằng tài khoản test (chỉ chạy khi env có flag bật). */
Cypress.Commands.add('loginAsTestUser', () => {
  const phone = Cypress.env('TEST_PHONE');
  const secret = Cypress.env('TEST_SECRET');
  if (!phone || !secret) {
    cy.log('TEST_PHONE/TEST_SECRET chưa cấu hình — bỏ qua login');
    return;
  }
  cy.session([phone], () => {
    cy.visit('/');
    cy.openLoginPopup();
    cy.selByList(SELECTORS.loginPopup.phoneInput).clear().type(phone);
    cy.selByList(SELECTORS.loginPopup.termsCheckbox).check({ force: true });
    cy.selByList(SELECTORS.loginPopup.continueButton).click({ force: true });
    cy.selByList(SELECTORS.loginPopup.otpInput, { timeout: 30000 }).first().type(secret);
    cy.selByList(SELECTORS.loggedInHeader.accountText, { timeout: 30000 }).should('exist');
  });
});

/** Kiểm tra cờ env có bật hay không (true/false). */
Cypress.Commands.add('skipUnless', (envKey) => {
  const enabled = Cypress.env(envKey);
  if (!enabled) {
    cy.log(`${envKey} = false → skip test`);
    Cypress.runner.stop();
  }
});

/** Capture giá trị (vd tên, giá sản phẩm) dạng động vào alias. */
Cypress.Commands.add('captureText', (selectorList, alias) => {
  cy.selByList(selectorList).first().invoke('text').then((t) => {
    cy.wrap(t.trim()).as(alias);
  });
});

module.exports = {};
