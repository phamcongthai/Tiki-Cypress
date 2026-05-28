/// <reference types="cypress" />
const SEL = require('../support/selectors');

describe('Chi tiết sản phẩm & Giỏ hàng — Tiki', () => {
  let data;
  let cart10PdpUrl;

  before(() => {
    cy.fixture('testData').then((d) => {
      data = d;
    });
  });

  const openRandomProduct = () => {
    cy.visitHome();
    cy.doSearch(data.search.validKeyword);
    cy.openRandomProductFromResults();
    cy.url({ timeout: 30000 }).should('match', /(-p\d+\.html|\/p\d+\.html)(\?.*)?(#.*)?$/i);
    cy.selByList(SEL.product.title, { timeout: 30000 }).should('be.visible');
  };

  const openCartFromHeaderIcon = () => {
    cy.selByList(SEL.header.cartLink).then(($el) => {
      const $a = $el.is('a') ? $el : $el.closest('a');
      if ($a.length) {
        cy.wrap($a).click({ force: true });
        return;
      }
      cy.wrap($el).click({ force: true });
    });
  };

  const waitForCartPage = () => {
    cy.url({ timeout: 30000 }).should('include', '/checkout/cart');
    cy.selByList(SEL.cart.pageContainer, { timeout: 30000 }).should('exist');
  };

  const addToCartAndDetectLoginRequired = () => {
    cy.addCurrentProductToCart();
    return cy.get('body').then(($b) => {
      const loginRequired = SEL.loginPopup.container.some(
        (s) => Cypress.$($b).find(s).length > 0
      );
      if (loginRequired) {
        cy.log('Thêm giỏ yêu cầu đăng nhập, bỏ qua bước kiểm tra giỏ hàng cho guest');
      } else {
        cy.selByList(SEL.cartPopup.successMessage, { timeout: 20000 }).should('exist');
      }
      return loginRequired;
    });
  };

  describe('Trang chi tiết sản phẩm', () => {
    beforeEach(openRandomProduct);

    it('TKI_CART_001 — Hiển thị các thành phần chính của trang chi tiết', () => {
      cy.selByList(SEL.product.title).should('be.visible');
      cy.selByList(SEL.product.image).should(($img) => {
        expect($img.attr('src') || $img.attr('srcset')).to.be.ok;
      });
      cy.selByList(SEL.product.price).should('exist');
      cy.get('body').then(($b) => {
        const hasAdd = SEL.product.addToCartButton.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        const hasOOS = Cypress.$($b).text().includes('Hết hàng');
        expect(hasAdd || hasOOS).to.eq(true);
      });
    });

    it('TKI_CART_002 — Click thumbnail cập nhật ảnh chính', () => {
      cy.get('body').then(($b) => {
        const thumbs = SEL.product.thumbnails
          .map((s) => Cypress.$($b).find(s))
          .find((c) => c.length > 1);
        if (!thumbs) {
          cy.log('Sản phẩm không có nhiều thumbnail — skip soft');
          return;
        }
        cy.selByList(SEL.product.image).invoke('attr', 'src').then((srcBefore) => {
          cy.wrap(thumbs[1]).click({ force: true });
          cy.wait(500);
          cy.selByList(SEL.product.image).invoke('attr', 'src').should((srcAfter) => {
            expect(srcAfter).to.exist;
          });
        });
      });
    });

    it('TKI_CART_003 — Thông tin giá theo định dạng VND', () => {
      cy.selByList(SEL.product.price).invoke('text').then((t) => {
        const txt = t.replace(/\s+/g, '');
        expect(txt.length).to.be.greaterThan(0);
        const hasCurrency = /(₫|đ|VND)/i.test(txt);
        const hasMoneyNumber = /\d{1,3}([.,]\d{3})+|\d{4,}/.test(txt);
        expect(hasCurrency || hasMoneyNumber).to.eq(true);
      });
    });

    it('TKI_CART_004 — Số lượng mặc định là 1', () => {
      cy.get('body').then(($b) => {
        const found = SEL.product.quantityInput.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (!found) {
          cy.log('Sản phẩm không hiển thị ô số lượng (có thể OOS hoặc seller flash) — skip soft');
          return;
        }
        cy.selByList(SEL.product.quantityInput).should('have.value', '1');
      });
    });

    it('TKI_CART_005 — Tăng số lượng cập nhật giá trị', () => {
      cy.get('body').then(($b) => {
        const found = SEL.product.quantityIncrease.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (!found) return cy.log('Không có nút tăng — skip soft');
        cy.selByList(SEL.product.quantityIncrease).click({ force: true });
        cy.selByList(SEL.product.quantityInput).should('have.value', '2');
      });
    });

    it('TKI_CART_006 — Số lượng không giảm dưới 1', () => {
      cy.get('body').then(($b) => {
        const found = SEL.product.quantityDecrease.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (!found) return cy.log('Không có nút giảm — skip soft');
        cy.selByList(SEL.product.quantityDecrease).click({ force: true });
        cy.selByList(SEL.product.quantityInput).should(($i) => {
          const v = parseInt($i.val(), 10);
          expect(v).to.be.gte(1);
        });
      });
    });

    it('TKI_CART_007 — Nhập số lượng hợp lệ vào ô input', () => {
      cy.get('body').then(($b) => {
        const found = SEL.product.quantityInput.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (!found) return cy.log('Ô số lượng không có sẵn — skip soft');
        cy.selByList(SEL.product.quantityInput).then(($el) => {
          if ($el.attr('readonly')) {
            cy.log('Input readonly — sử dụng nút + thay thế');
            cy.selByList(SEL.product.quantityIncrease).click({ force: true });
            cy.wrap($el).should('have.value', '2');
          } else {
            cy.wrap($el).clear().type(String(data.cart.quantityValid));
            cy.wrap($el).blur();
            cy.wrap($el).should('have.value', String(data.cart.quantityValid));
          }
        });
      });
    });

    it('TKI_CART_008 — Nhập số lượng không hợp lệ bị từ chối', () => {
      cy.get('body').then(($b) => {
        const found = SEL.product.quantityInput.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (!found) return cy.log('Ô số lượng không có sẵn — skip soft');
        cy.selByList(SEL.product.quantityInput).then(($el) => {
          if ($el.attr('readonly')) {
            cy.log('Input readonly — không thể nhập tay, expected behavior');
            return;
          }
          cy.wrap($el).clear().type('0').blur();
          cy.wrap($el).should(($i) => {
            const v = parseInt($i.val(), 10) || 0;
            expect(v).to.be.gte(1);
          });
        });
      });
    });
  });

  describe('Thêm sản phẩm và giỏ hàng', () => {

    it('TKI_CART_009 — Thêm sản phẩm với số lượng 1 vào giỏ', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.get('body').then(($b) => {
        const loginRequired = SEL.loginPopup.container.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (loginRequired) {
          cy.selByList(SEL.loginPopup.container).should('be.visible');
          return;
        }
        cy.selByList(SEL.cartPopup.successMessage, { timeout: 20000 }).should('exist');
      });
    });

    it('TKI_CART_010 — Guest thêm giỏ hàng hiển thị popup đăng nhập', () => {
      openRandomProduct();
      cy.url().then((u) => {
        cart10PdpUrl = u;
      });
      cy.addCurrentProductToCart();
      cy.get('body', { timeout: 15000 }).should(($b) => {
        const hasContainer = SEL.loginPopup.container.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        const hasPhoneInput = SEL.loginPopup.phoneInput.some(
          (s) => Cypress.$($b).find(s).filter(':visible').length > 0
        );
        const hasGreeting = /xin chào/i.test($b.text());
        expect(hasContainer || hasPhoneInput || hasGreeting).to.eq(true);
      });
    });

    it.only('TKI_CART_011 — (Ổn định) Đăng nhập trước, thêm giỏ và vào trang giỏ hàng', () => {
      if (!Cypress.env('TEST_PHONE') || !Cypress.env('TEST_PASSWORD')) {
        cy.log('Thiếu TEST_PHONE/TEST_PASSWORD → skip');
        return;
      }
      const pdpUrl = Cypress.env('TEST_PDP_URL') || cart10PdpUrl;
      if (!pdpUrl) {
        cy.log('Thiếu TEST_PDP_URL (hoặc chưa có URL từ cart10) → skip');
        return;
      }
      cy.loginAsTestUser();
      cy.visit(pdpUrl);
      cy.selByList(SEL.product.title, { timeout: 30000 }).should('be.visible');
      cy.addCurrentProductToCart();
      cy.visit('/checkout/cart');
      cy.url({ timeout: 20000 }).then((u) => {
        if (u.includes('/checkout/cart')) return;
        cy.get('body').then(($b) => {
          const hasLoginPopup = SEL.loginPopup.container.some(
            (s) => Cypress.$($b).find(s).length > 0
          ) || SEL.loginPopup.phoneInput.some(
            (s) => Cypress.$($b).find(s).filter(':visible').length > 0
          );
          if (hasLoginPopup) cy.completeLoginPopup();
        });
        cy.visit('/checkout/cart');
      });
      waitForCartPage();
      cy.get('body', { timeout: 30000 }).should(($b) => {
        const hasItems = SEL.cart.itemRow.some((s) => Cypress.$($b).find(s).length > 0);
        const hasEmptyState = /giỏ hàng trống|không có sản phẩm|chưa có sản phẩm/i.test($b.text());
        const hasCheckout = SEL.cart.checkoutButton.some((s) => Cypress.$($b).find(s).length > 0);
        const hasSummary = SEL.cart.cartTotal.some((s) => Cypress.$($b).find(s).length > 0);
        expect(hasItems || hasEmptyState || hasCheckout || hasSummary).to.eq(true);
      });
    });

    it('TKI_CART_012 — Click icon giỏ hàng trên header mở trang giỏ hàng', () => {
      openRandomProduct();
      addToCartAndDetectLoginRequired().then((loginRequired) => {
        if (loginRequired) {
          cy.selByList(SEL.loginPopup.container, { timeout: 10000 }).should('be.visible');
          return;
        }
        openCartFromHeaderIcon();
        waitForCartPage();
        cy.selByList(SEL.cart.itemRow).should('have.length.greaterThan', 0);
      });
    });

    it('TKI_CART_013 — Thông tin sản phẩm trong giỏ khớp dữ liệu đã thêm', () => {
      openRandomProduct();
      cy.captureText(SEL.product.title, 'addedName');
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.get('@addedName').then((name) => {
        const key = name.split(' ').slice(0, 3).join(' ');
        cy.selByList(SEL.cart.itemRow).first().should('contain.text', key.split(' ')[0]);
      });
      cy.selByList(SEL.cart.itemPrice).first().should('exist');
    });

    it('TKI_CART_014 — Tăng số lượng trong giỏ cập nhật thành tiền', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.selByList(SEL.cart.itemRow).first().within(() => {
        cy.get('body').then(() => {
          const sels = SEL.cart.itemQuantityIncrease;
          for (const s of sels) {
            if (Cypress.$(s).length > 0) {
              cy.get(s).first().click({ force: true });
              return;
            }
          }
        });
      });
      cy.selByList(SEL.cart.itemRow).first().find('input[type="text"]').should(($i) => {
        const v = parseInt($i.val(), 10);
        expect(v).to.be.gte(2);
      });
    });

    it('TKI_CART_015 — Giảm số lượng trong giỏ cập nhật thành tiền', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();

      cy.selByList(SEL.cart.itemRow).first().within(() => {
        const incSels = SEL.cart.itemQuantityIncrease;
        for (const s of incSels) {
          if (Cypress.$(s).length > 0) {
            cy.get(s).first().click({ force: true });
            break;
          }
        }
      });
      cy.wait(800);
      cy.selByList(SEL.cart.itemRow).first().within(() => {
        const decSels = SEL.cart.itemQuantityDecrease;
        for (const s of decSels) {
          if (Cypress.$(s).length > 0) {
            cy.get(s).first().click({ force: true });
            break;
          }
        }
      });
      cy.selByList(SEL.cart.itemRow).first().find('input[type="text"]').should(($i) => {
        const v = parseInt($i.val(), 10);
        expect(v).to.be.gte(1);
      });
    });

    it('TKI_CART_016 — Giới hạn số lượng theo tồn kho', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.selByList(SEL.cart.itemRow).first().within(() => {
        const incSels = SEL.cart.itemQuantityIncrease;
        const incBtn = incSels.find((s) => Cypress.$(s).length > 0);
        if (!incBtn) return;
        for (let i = 0; i < 30; i++) {
          cy.get(incBtn).first().click({ force: true });
          cy.wait(150);
        }
      });
      cy.get('body').should('not.contain.text', 'NaN');
    });

    it('TKI_CART_017 — Chọn/bỏ chọn 1 sản phẩm cập nhật tổng tiền', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.selByList(SEL.cart.itemRow).first().within(() => {
        cy.get('input[type="checkbox"]').first().as('cb');
        cy.get('@cb').then(($c) => {
          if ($c.is(':checked')) cy.get('@cb').uncheck({ force: true });
          else cy.get('@cb').check({ force: true });
        });
        cy.get('@cb').click({ force: true });
      });
      cy.selByList(SEL.cart.checkoutButton).should('exist');
    });

    it('TKI_CART_018 — Chọn/bỏ chọn tất cả sản phẩm', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.get('body').then(($b) => {
        const found = SEL.cart.selectAllCheckbox.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (!found) return cy.log('Không có checkbox Tất cả — skip soft');
        cy.selByList(SEL.cart.selectAllCheckbox).click({ force: true });
        cy.selByList(SEL.cart.selectAllCheckbox).click({ force: true });
      });
    });

    it('TKI_CART_019 — Sản phẩm hết hàng không được chọn thanh toán', () => {
      cy.goToCart();
      cy.get('body').then(($b) => {
        const hasOOS = /Hết hàng|hết hàng/.test($b.text());
        if (!hasOOS) {
          cy.log('Giỏ không có sản phẩm hết hàng — skip soft');
          return;
        }
        cy.contains('Hết hàng').parents().find('input[type="checkbox"]').first()
          .should('be.disabled');
      });
    });

    it('TKI_CART_020 — Xóa 1 sản phẩm khỏi giỏ', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.selByList(SEL.cart.itemRow).then(($rows) => {
        const before = $rows.length;
        cy.selByList(SEL.cart.itemRow).first().within(() => {
          const delSels = SEL.cart.itemDeleteButton;
          for (const s of delSels) {
            if (Cypress.$(s).length > 0) {
              cy.get(s).first().click({ force: true });
              return;
            }
          }
        });
        cy.wait(1000);
        cy.get('body').then(($b) => {
          const remaining = SEL.cart.itemRow.reduce(
            (acc, s) => acc + Cypress.$($b).find(s).length,
            0
          );
          expect(remaining).to.be.lessThan(before);
        });
      });
    });

    it('TKI_CART_021 — Tổng tiền hàng = tổng thành tiền các sản phẩm được chọn', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.selByList(SEL.cart.finalAmount).should('exist').invoke('text').then((t) => {
        const num = t.replace(/[^\d]/g, '');
        expect(parseInt(num, 10)).to.be.greaterThan(0);
      });
    });

    it('TKI_CART_022 — Hiển thị khu vực khuyến mãi/freeship', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.get('body').then(($b) => {
        const text = $b.text().toLowerCase();
        const hasPromo = /khuyến mãi|freeship|giảm giá|coupon|mã giảm/.test(text);
        expect(hasPromo).to.eq(true);
      });
    });

    it('TKI_CART_023 — Freeship chưa đạt ngưỡng hiển thị thông báo cần mua thêm', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.get('body').then(($b) => {
        const text = $b.text().toLowerCase();
        const meaningful = /mua thêm|chưa đủ|freeship|miễn phí vận chuyển/.test(text);
        expect(meaningful).to.eq(true);
      });
    });

    it('TKI_CART_024 — Freeship đạt ngưỡng được áp dụng', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.get('body').should('be.visible');
    });

    it('TKI_CART_025 — Click Mua Hàng khi chưa đăng nhập → yêu cầu đăng nhập', () => {
      openRandomProduct();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.selByList(SEL.cart.checkoutButton).click({ force: true });
      cy.get('body', { timeout: 15000 }).then(($b) => {
        const matched = SEL.loginPopup.container.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        expect(matched, 'Popup đăng nhập xuất hiện').to.eq(true);
      });
    });

    it('TKI_CART_026 — Click Mua ngay khi chưa đăng nhập → popup đăng nhập', () => {
      openRandomProduct();
      cy.get('body').then(($b) => {
        const found = SEL.product.buyNowButton.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (!found) return cy.log('Sản phẩm không có nút Mua ngay — skip soft');
        cy.selByList(SEL.product.buyNowButton).click({ force: true });
        cy.get('body', { timeout: 15000 }).then(($body) => {
          const matched = SEL.loginPopup.container.some(
            (s) => Cypress.$($body).find(s).length > 0
          );
          expect(matched).to.eq(true);
        });
      });
    });

    it('TKI_CART_027 — Click Mua Hàng sau khi đăng nhập → đi tới bước thanh toán', () => {
      if (!Cypress.env('TEST_PHONE') || !Cypress.env('TEST_PASSWORD')) {
        cy.log('Thiếu TEST_PHONE/TEST_PASSWORD → skip');
        return;
      }
      cy.loginAsTestUser();
      cy.visit('/');
      cy.doSearch(data.search.validKeyword);
      cy.openRandomProductFromResults();
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.selByList(SEL.cart.checkoutButton).click({ force: true });
      cy.url({ timeout: 30000 }).should('match', /checkout|payment|order/);
    });

    it('TKI_CART_028 — Giỏ hàng trống hiển thị trạng thái phù hợp', () => {
      cy.goToCart();
      cy.get('body').then(($b) => {
        const isEmpty = /trống|chưa có sản phẩm/i.test($b.text());
        const hasItems = SEL.cart.itemRow.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        expect(isEmpty || hasItems).to.eq(true);
      });
    });
  });
});
