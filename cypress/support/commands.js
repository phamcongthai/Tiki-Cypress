const SELECTORS = require('./selectors');
const ABS_PASSWORD_SELECTOR = 'body > div.ReactModalPortal > div > div > div > div.sc-2745a82-1.ehiTvW > div > form > div > input[type="password"]';

/**
 * cy.selByList(list) — thử nhiều selector lần lượt, trả về phần tử đầu tiên tìm thấy.
 * Nhận chuỗi hoặc mảng.
 *
 * Lưu ý 2 engine selector có giới hạn BÙ TRỪ nhau:
 *  - jQuery/Sizzle (cy.get, Cypress.$.find): hỗ trợ :contains()/:has()
 *    nhưng THROW với cờ case-insensitive [attr*="x" i].
 *  - querySelectorAll (native): hỗ trợ cờ "i" nhưng THROW với :contains().
 * Vì vậy selector có cờ "i" được xử lý bằng native + cy.wrap; còn lại dùng cy.get.
 */
Cypress.Commands.add('selByList', (list, opts = {}) => {
  const arr = Array.isArray(list) ? list : [list];
  const tryNext = (idx) => {
    if (idx >= arr.length) {
      throw new Error(`Không tìm thấy element với selectors: ${arr.join(' | ')}`);
    }
    const sel = arr[idx];
    // Selector dùng cờ case-insensitive [attr*="x" i] → cy.get (Sizzle) sẽ throw.
    const hasCaseInsensitiveFlag = /\s+i\s*\]/.test(sel);
    return cy.get('body', { log: false }).then(($body) => {
      const root = $body[0];
      if (hasCaseInsensitiveFlag) {
        let node = null;
        try {
          node = root.querySelector(sel);
        } catch (e) {
          node = null; // không engine nào parse được → bỏ qua selector này
        }
        if (node) return cy.wrap(node, opts);
        return tryNext(idx + 1);
      }
      // Selector an toàn với jQuery (kể cả :contains()/:has()).
      let exists = false;
      try {
        exists = Cypress.$(root).find(sel).length > 0;
      } catch (e) {
        exists = false; // selector không hợp lệ với Sizzle → bỏ qua
      }
      if (exists) return cy.get(sel, opts).first();
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
    '[data-view-id="popup-manager.close"]',
    'img[alt="close-icon"][width="32"][height="32"]',
    'img[alt="close-icon"]',
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
    const root = $body[0];
    let closed = 0;
    for (const sel of adCloseSelectors) {
      // Dùng querySelectorAll (native) thay vì jQuery.find():
      // Sizzle KHÔNG hỗ trợ cờ case-insensitive [attr*="x" i] và sẽ throw
      // "unrecognized expression", làm hỏng cả beforeEach hook.
      let nodes = [];
      try {
        nodes = Array.from(root.querySelectorAll(sel));
      } catch (e) {
        continue; // selector không hợp lệ với engine hiện tại — bỏ qua an toàn
      }
      nodes
        .filter((el) => el.offsetParent !== null) // chỉ phần tử đang hiển thị
        .forEach((el) => {
          Cypress.$(el).trigger('click');
          closed += 1;
        });
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
      [data-view-id="popup-manager.close"],
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
  const keywordText = String(keyword ?? '');
  cy.dismissAds();
  cy.get('body', { log: false }).then(($body) => {
    const inputSelectors = SELECTORS.header.searchInput;
    for (const sel of inputSelectors) {
      const $input = Cypress.$($body)
        .find(sel)
        .filter(':visible')
        .filter((_, el) => !el.disabled && !el.readOnly)
        .first();
      if ($input.length) return cy.wrap($input).as('searchInput');
    }
    throw new Error('Không tìm thấy search input visible.');
  });
  cy.get('@searchInput').click().type('{selectall}{backspace}');
  cy.get('@searchInput').should('have.value', '');
  if (keywordText.length > 0) {
    cy.get('@searchInput').type(keywordText, { delay: 30 });
  }
  cy.get('@searchInput').should('have.value', keywordText);
  cy.dismissAds();
  if (submit === 'enter') {
    cy.get('@searchInput').type('{enter}');
  } else {
    cy.selByList(SELECTORS.header.searchButton)
      .first()
      .click({ force: true });
  }
});

/** Mở 1 sản phẩm bất kỳ từ trang kết quả tìm kiếm. */
Cypress.Commands.add('openRandomProductFromResults', () => {
  cy.get('a[href]', { timeout: 30000 }).then(($links) => {
    const isProductUrl = (rawHref) => {
      if (!rawHref) return false;
      let url;
      try {
        url = new URL(rawHref, 'https://tiki.vn');
      } catch (e) {
        return false;
      }
      if (!/(\.|^)tiki\.vn$/i.test(url.hostname)) return false;
      if (/^hotro\.tiki\.vn$/i.test(url.hostname)) return false;
      const p = url.pathname.toLowerCase();
      if (p.includes('/knowledge-base/') || p.includes('/post/')) return false;
      // URL PDP Tiki thường có dạng ...-p123.html hoặc chứa /p123.html
      return /-p\d+\.html$/i.test(url.pathname) || /\/p\d+\.html$/i.test(url.pathname);
    };

    const productLinks = Array.from($links)
      .filter((el) => el.offsetParent !== null)
      .map((el) => el.getAttribute('href'))
      .filter((href) => isProductUrl(href));

    if (productLinks.length === 0) {
      throw new Error('Không tìm thấy link trang chi tiết sản phẩm hợp lệ trong kết quả tìm kiếm.');
    }

    const limit = Math.min(productLinks.length, 10);
    const idx = Math.floor(Math.random() * limit);
    cy.visit(productLinks[idx]);
  });
  cy.url({ timeout: 30000 }).should('match', /(-p\d+\.html|\/p\d+\.html)(\?.*)?(#.*)?$/i);
  cy.dismissAds();
});

/** Thêm sản phẩm ở PDP vào giỏ một cách ổn định dù trang đã scroll sâu. */
Cypress.Commands.add('addCurrentProductToCart', () => {
  cy.dismissAds();
  cy.scrollTo('top', { duration: 0 });
  cy.get('body', { log: false }).then(($body) => {
    for (const sel of SELECTORS.product.addToCartButton) {
      const $btn = Cypress.$($body)
        .find(sel)
        .filter(':visible')
        .filter((_, el) => !el.disabled)
        .first();
      if ($btn.length) {
        cy.wrap($btn).scrollIntoView().click({ force: true });
        return;
      }
    }
    throw new Error('Không tìm thấy nút Thêm vào giỏ/Chọn mua khả dụng trên PDP.');
  });
});

/** Mở popup đăng nhập từ header. */
Cypress.Commands.add('openLoginPopup', () => {
  cy.dismissAds();
  const closeOverlay = () => {
    cy.get('body').then(($b) => {
      const root = Cypress.$($b);
      // Loại bỏ hẳn portal quảng cáo TIKI VIP nếu có.
      root.find('div.ReactModalPortal:visible').each((_, el) => {
        const text = (el.textContent || '').toLowerCase();
        if (text.includes('thăng hạng tiki vip') || text.includes('đặc quyền')) {
          el.remove();
        }
      });
      const closeNodes = root
        .find('div.ReactModalPortal button:visible, div.ReactModalPortal [role="button"]:visible')
        .filter((_, el) => {
          const txt = (el.textContent || '').trim().toLowerCase();
          const aria = (el.getAttribute('aria-label') || '').toLowerCase();
          const cls = (el.getAttribute('class') || '').toLowerCase();
          return txt === '×' || txt === 'x' || aria.includes('close') || aria.includes('đóng') || cls.includes('close');
        });
      if (closeNodes.length > 0) cy.wrap(closeNodes[0]).click({ force: true });
    });
  };

  closeOverlay();

  closeOverlay();
  cy.selByList(SELECTORS.header.accountLink, { timeout: 20000 }).click({ force: true });
  closeOverlay();
  cy.get('body').then(($body2) => {
    const opened = SELECTORS.loginPopup.container.some(
      (s) => Cypress.$($body2).find(s).length > 0
    );
    if (opened) return;
    const $loginEntry = Cypress.$($body2)
      .find('a:contains("Đăng nhập"), button:contains("Đăng nhập"), span:contains("Đăng nhập")')
      .filter(':visible')
      .first();
    if ($loginEntry.length) cy.wrap($loginEntry).click({ force: true });
  });
  cy.selByList(SELECTORS.loginPopup.container, { timeout: 20000 }).should('be.visible');
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
  cy.url({ timeout: 30000 }).should('include', '/checkout/cart');
  cy.get('body', { timeout: 15000 }).then(($b) => {
    const hasLoginPopup = SELECTORS.loginPopup.container.some(
      (s) => Cypress.$($b).find(s).length > 0
    ) || SELECTORS.loginPopup.phoneInput.some(
      (s) => Cypress.$($b).find(s).filter(':visible').length > 0
    );
    if (!hasLoginPopup) return;

    const phone = Cypress.env('TEST_PHONE');
    const password = Cypress.env('TEST_PASSWORD');
    if (phone && password) {
      cy.completeLoginPopup();
      return;
    }

    const $close = Cypress.$($b)
      .find('div.sc-8a10c93b-0.fmsiux button:visible, div.ReactModalPortal button:visible')
      .filter((_, el) => {
        const txt = (el.textContent || '').trim().toLowerCase();
        const aria = (el.getAttribute('aria-label') || '').toLowerCase();
        const cls = (el.getAttribute('class') || '').toLowerCase();
        return txt === '×' || txt === 'x' || aria.includes('close') || aria.includes('đóng') || cls.includes('close');
      })
      .first();
    if ($close.length) cy.wrap($close).click({ force: true });
  });
  cy.selByList(SELECTORS.cart.pageContainer, { timeout: 30000 }).should('exist');
  cy.wait(1000);
  cy.dismissAds();
});

/** Đăng nhập bằng tài khoản test (chỉ dùng số điện thoại + mật khẩu). */
Cypress.Commands.add('loginAsTestUser', () => {
  const phone = Cypress.env('TEST_PHONE');
  const password = Cypress.env('TEST_PASSWORD');

  if (!phone || !password) {
    cy.log('Thiếu cấu hình login: cần TEST_PHONE và TEST_PASSWORD');
    return;
  }
  cy.visit('/');
  cy.wait(1200);
  cy.dismissAds();
  cy.get('body').then(($b) => {
    const root = Cypress.$($b);
    const closeNodes = root
      .find('div.ReactModalPortal button:visible, div.ReactModalPortal [role="button"]:visible')
      .filter((_, el) => {
        const txt = (el.textContent || '').trim().toLowerCase();
        const aria = (el.getAttribute('aria-label') || '').toLowerCase();
        const cls = (el.getAttribute('class') || '').toLowerCase();
        return txt === '×' || txt === 'x' || aria.includes('close') || aria.includes('đóng') || cls.includes('close');
      });
    if (closeNodes.length > 0) cy.wrap(closeNodes[0]).click({ force: true });
  });
  // Mở đăng nhập bằng nút Tài khoản trên header theo yêu cầu.
  cy.selByList(SELECTORS.header.accountLink, { timeout: 20000 }).click({ force: true });
  cy.get('body', { timeout: 20000 }).should(($b) => {
    const hasContainer = SELECTORS.loginPopup.container.some(
      (s) => Cypress.$($b).find(s).length > 0
    );
    const hasPhoneInput = SELECTORS.loginPopup.phoneInput.some(
      (s) => Cypress.$($b).find(s).filter(':visible').length > 0
    );
    const hasGreeting = /xin chào/i.test($b.text());
    expect(hasContainer || hasPhoneInput || hasGreeting).to.eq(true);
  });
  cy.get('body', { timeout: 20000 }).then(($b) => {
    const root = Cypress.$($b);
    let $phone = root.find('div.ReactModalPortal input[type="tel"]:visible').first();
    if (!$phone.length) $phone = root.find('div.ReactModalPortal input[name="tel"]:visible').first();
    if (!$phone.length) $phone = root.find('div.ReactModalPortal input:visible').first();
    if (!$phone.length) throw new Error('Không tìm thấy ô nhập số điện thoại trên popup đăng nhập.');

    cy.wrap($phone)
      .scrollIntoView()
      .click({ force: true })
      .clear({ force: true })
      .type(String(phone), { force: true, delay: 20 })
      .should(($i) => {
        const v = String($i.val() || '').replace(/\s+/g, '');
        expect(v).to.include(String(phone));
      });
  });
  cy.get('body').then(($b) => {
    const hasTerms = SELECTORS.loginPopup.termsCheckbox.some(
      (s) => Cypress.$($b).find(s).length > 0
    );
    if (hasTerms) cy.selByList(SELECTORS.loginPopup.termsCheckbox).check({ force: true });
  });
  cy.get('body', { timeout: 15000 }).then(($b) => {
    const $btn = Cypress.$($b)
      .find('div.ReactModalPortal button:visible')
      .filter((_, el) => /tiếp tục/i.test((el.textContent || '').trim()) && !el.disabled)
      .first();
    if ($btn.length) {
      cy.wrap($btn).click({ force: true });
      return;
    }
    cy.selByList(SELECTORS.loginPopup.continueButton, { timeout: 15000 }).click({ force: true });
  });
  cy.get('body', { timeout: 30000 }).should(($b) => {
    const hasAnyLoginInput =
      Cypress.$($b).find('div.ReactModalPortal form input:visible').length > 0 ||
      /nhập mật khẩu|mật khẩu/i.test($b.text());
    expect(hasAnyLoginInput).to.eq(true);
  });
  // Chỉ đóng popup quảng cáo TIKI VIP, tránh đóng nhầm popup đăng nhập.
  cy.get('body').then(($b) => {
    const root = Cypress.$($b);
    root.find('div.ReactModalPortal:visible').each((_, portal) => {
      const text = (portal.textContent || '').toLowerCase();
      if (text.includes('thăng hạng tiki vip') || text.includes('đặc quyền')) {
        const closeBtn = Cypress.$(portal)
          .find('button:visible, [role="button"]:visible')
          .filter((__, el) => {
            const txt = (el.textContent || '').trim().toLowerCase();
            const aria = (el.getAttribute('aria-label') || '').toLowerCase();
            const cls = (el.getAttribute('class') || '').toLowerCase();
            return txt === '×' || txt === 'x' || aria.includes('close') || aria.includes('đóng') || cls.includes('close');
          })
          .first();
        if (closeBtn.length) cy.wrap(closeBtn).click({ force: true });
      }
    });
  });
  cy.get('body', { timeout: 30000 }).then(($b) => {
    const root = Cypress.$($b);
    let $pwd = root.find('div.ReactModalPortal form input[type="password"]:visible').first();
    if (!$pwd.length) {
      $pwd = root
        .find('div.ReactModalPortal form input:visible')
        .filter((_, el) => {
          const ph = (el.getAttribute('placeholder') || '').toLowerCase();
          const tp = (el.getAttribute('type') || '').toLowerCase();
          return tp === 'password' || ph.includes('mật khẩu') || ph.includes('mat khau');
        })
        .first();
    }
    if (!$pwd.length) {
      const $btn = root
        .find('div.ReactModalPortal button:visible')
        .filter((_, el) => /tiếp tục/i.test((el.textContent || '').trim()) && !el.disabled)
        .first();
      if ($btn.length) cy.wrap($btn).click({ force: true });
    }
  });

  cy.get('div.ReactModalPortal input[placeholder*="Mật khẩu"], div.ReactModalPortal input[placeholder*="mật khẩu"]', { timeout: 30000 })
    .filter(':visible')
    .first()
    .then(($input) => {
      cy.wrap($input).click({ force: true }).clear({ force: true });
    });

  cy.window().then((win) => {
    const doc = win.document;
    let input =
      doc.querySelector('div.ReactModalPortal input[placeholder*="Mật khẩu"]') ||
      doc.querySelector('div.ReactModalPortal input[placeholder*="mật khẩu"]') ||
      doc.querySelector('div.ReactModalPortal form input[type="password"]') ||
      doc.querySelector(ABS_PASSWORD_SELECTOR);
    if (!input) {
      const cands = Array.from(doc.querySelectorAll('div.ReactModalPortal form input'));
      input = cands[cands.length - 1] || null;
    }
    if (!input) throw new Error('Không bắt được ô mật khẩu trong popup hiện tại.');

    input.focus();
    input.click();
    const setter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value')?.set;
    if (!setter) throw new Error('Không lấy được setter input.value');
    setter.call(input, String(password));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    const submitBtn =
      doc.querySelector('div.sc-8a10c93b-0.fmsiux form button') ||
      Array.from(doc.querySelectorAll('div.ReactModalPortal form button'))
      .find((b) => /đăng nhập|dang nhap/i.test((b.textContent || '').trim()));
    if (submitBtn) {
      submitBtn.click();
    } else {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    }
  });
  cy.get('body').then(($b) => {
    const $body = Cypress.$($b);
    const submitSel = [
      'div.ReactModalPortal form button[type="submit"]',
      'div.ReactModalPortal form button:contains("Đăng Nhập")',
      'div.ReactModalPortal form button:contains("Đăng nhập")',
      'div.ReactModalPortal form button:contains("Tiếp Tục")',
      'div.ReactModalPortal form button:contains("Tiếp tục")',
    ];
    for (const s of submitSel) {
      const $btn = $body.find(s).filter(':visible').first();
      if ($btn.length) {
        cy.wrap($btn).click({ force: true });
        return;
      }
    }
  });
  cy.get('body').type('{enter}', { force: true });
  cy.selByList(SELECTORS.loggedInHeader.accountText, { timeout: 30000 }).should('exist');
});

/** Hoàn tất đăng nhập ngay trên popup hiện tại bằng TEST_PHONE/TEST_PASSWORD. */
Cypress.Commands.add('completeLoginPopup', () => {
  const phone = Cypress.env('TEST_PHONE');
  const password = Cypress.env('TEST_PASSWORD');
  if (!phone || !password) {
    throw new Error('Thiếu TEST_PHONE/TEST_PASSWORD để đăng nhập trên popup.');
  }

  cy.get('body', { timeout: 20000 }).should(($b) => {
    const hasContainer = SELECTORS.loginPopup.container.some(
      (s) => Cypress.$($b).find(s).length > 0
    );
    const hasPhoneInput = SELECTORS.loginPopup.phoneInput.some(
      (s) => Cypress.$($b).find(s).filter(':visible').length > 0
    );
    const hasGreeting = /xin chào/i.test($b.text());
    expect(hasContainer || hasPhoneInput || hasGreeting).to.eq(true);
  });
  cy.dismissAds();

  cy.get('body').then(($b) => {
    const hasPasswordInput = Cypress.$($b).find('div.ReactModalPortal form input:visible').length > 0 &&
      Cypress.$($b).find('div.ReactModalPortal form input:visible').last().attr('type') === 'password';
    if (hasPasswordInput) return;
    const hasPhoneInput = SELECTORS.loginPopup.phoneInput.some(
      (s) => Cypress.$($b).find(s).filter(':visible').length > 0
    );
    if (hasPhoneInput) {
      cy.selByList(SELECTORS.loginPopup.phoneInput)
        .clear({ force: true })
        .type(String(phone), { force: true, delay: 20 });
      cy.get('body').then(($body2) => {
        const hasTerms = SELECTORS.loginPopup.termsCheckbox.some(
          (s) => Cypress.$($body2).find(s).length > 0
        );
        if (hasTerms) cy.selByList(SELECTORS.loginPopup.termsCheckbox).check({ force: true });
      });
      cy.selByList(SELECTORS.loginPopup.continueButton).click({ force: true });
    }
  });

  cy.get('body', { timeout: 30000 }).then(($b) => {
    let $pwd = Cypress.$($b).find(ABS_PASSWORD_SELECTOR).filter(':visible').first();
    if (!$pwd.length) {
      $pwd = Cypress.$($b)
        .find('div.ReactModalPortal form input[type="password"]:visible')
        .first();
    }
    if (!$pwd.length) {
      $pwd = Cypress.$($b).find('div.ReactModalPortal form input:visible').last();
    }
    if (!$pwd.length) throw new Error('Không tìm thấy ô mật khẩu trên popup đăng nhập.');
    cy.wrap($pwd).click({ force: true });
    cy.get('body').then(($body2) => {
      let $pwd2 = Cypress.$($body2).find(ABS_PASSWORD_SELECTOR).filter(':visible').first();
      if (!$pwd2.length) $pwd2 = Cypress.$($body2).find('div.ReactModalPortal form input[type="password"]:visible').first();
      if (!$pwd2.length) $pwd2 = Cypress.$($body2).find('div.ReactModalPortal form input:visible').last();
      if (!$pwd2.length) throw new Error('Không tìm lại được ô mật khẩu sau khi clear.');
      cy.wrap($pwd2).clear({ force: true });
    });
    cy.window().then((win) => {
      const doc = win.document;
      let input = doc.querySelector(ABS_PASSWORD_SELECTOR);
      if (!input) input = doc.querySelector('div.ReactModalPortal form input[type="password"]');
      if (!input) {
        const inputs = Array.from(doc.querySelectorAll('div.ReactModalPortal form input'));
        input = inputs[inputs.length - 1] || null;
      }
      if (!input) throw new Error('Không tìm thấy ô mật khẩu để set value.');
      const setter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value')?.set;
      if (!setter) throw new Error('Không lấy được native setter của input.value.');
      setter.call(input, String(password));
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    });
  });
  cy.get('body').then(($b) => {
    const $submit = Cypress.$($b)
      .find('div.sc-8a10c93b-0.fmsiux form button:visible, div.ReactModalPortal form button:visible')
      .filter((_, el) => /đăng nhập|tiếp tục/i.test((el.textContent || '').trim()))
      .first();
    if ($submit.length) {
      cy.wrap($submit).click({ force: true });
      return;
    }
    cy.get('body').type('{enter}');
  });
  cy.selByList(SELECTORS.loggedInHeader.accountText, { timeout: 30000 }).should('exist');
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
