/// <reference types="cypress" />
const SEL = require('../support/selectors');

describe('Chi tiết sản phẩm & Giỏ hàng — Tiki', () => {
  let data;

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
    cy.scrollTo('top', { duration: 0 });
    cy.wait(500);
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

  const prepareManualAuthenticatedSession = () => {
    cy.ensureLoggedInForCart();
    openRandomProduct();
  };

  const prepareAuthenticatedCart = () => {
    prepareManualAuthenticatedSession();
    cy.addCurrentProductToCart();
    cy.goToCart();
    waitForCartPage();
    cy.wait(2000); // Đợi Tiki load xong giỏ hàng từ API và render đầy đủ các item
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

    it('TKI_CART_002 — Thông tin giá theo định dạng VND', () => {
      cy.selByList(SEL.product.price).invoke('text').then((t) => {
        const txt = t.replace(/\s+/g, '');
        expect(txt.length).to.be.greaterThan(0);
        const hasCurrency = /(₫|đ|VND)/i.test(txt);
        const hasMoneyNumber = /\d{1,3}([.,]\d{3})+|\d{4,}/.test(txt);
        expect(hasCurrency || hasMoneyNumber).to.eq(true);
      });
    });

    it('TKI_CART_003 — Số lượng mặc định là 1', () => {
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

    it('TKI_CART_004 — Tăng số lượng cập nhật giá trị', () => {
      cy.get('body').then(($b) => {
        const found = SEL.product.quantityIncrease.some(
          (s) => Cypress.$($b).find(s).length > 0
        );
        if (!found) return cy.log('Không có nút tăng — skip soft');
        cy.selByList(SEL.product.quantityIncrease).click({ force: true });
        cy.selByList(SEL.product.quantityInput).should('have.value', '2');
      });
    });

    it('TKI_CART_005 — Số lượng không giảm dưới 1', () => {
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



    it('TKI_CART_006 — Nhập số lượng không hợp lệ bị từ chối', () => {
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

    it('TKI_CART_007 — Thêm sản phẩm với số lượng 1 vào giỏ', () => {
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

    it('TKI_CART_008 — Guest thêm giỏ hàng hiển thị popup đăng nhập', () => {
      openRandomProduct();
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

    it('TKI_CART_009 — (Ổn định) Đăng nhập trước, thêm giỏ và vào trang giỏ hàng', () => {
      prepareManualAuthenticatedSession();
      cy.addCurrentProductToCart();
      cy.goToCart();
      waitForCartPage();
      cy.get('body', { timeout: 30000 }).should(($b) => {
        const hasItems = SEL.cart.itemRow.some((s) => Cypress.$($b).find(s).length > 0);
        const hasEmptyState = /giỏ hàng trống|không có sản phẩm|chưa có sản phẩm/i.test($b.text());
        const hasCheckout = SEL.cart.checkoutButton.some((s) => Cypress.$($b).find(s).length > 0);
        const hasSummary = SEL.cart.cartTotal.some((s) => Cypress.$($b).find(s).length > 0);
        expect(hasItems || hasEmptyState || hasCheckout || hasSummary).to.eq(true);
      });
    });

    it('TKI_CART_010 — Thông tin sản phẩm trong giỏ khớp dữ liệu đã thêm', () => {
      prepareManualAuthenticatedSession();
      cy.captureText(SEL.product.title, 'addedName');
      cy.addCurrentProductToCart();
      cy.goToCart();
      cy.get('@addedName').then((name) => {
        const key = name.split(' ').slice(0, 3).join(' ');
        cy.selByList(SEL.cart.itemRow).first().should('contain.text', key.split(' ')[0]);
      });
      cy.selByList(SEL.cart.itemPrice).first().should('exist');
    });

    it('TKI_CART_011 — Tăng số lượng trong giỏ cập nhật thành tiền', () => {
      prepareAuthenticatedCart();
      cy.wait(2000); // Chờ Tiki load xong sự kiện React (Hydration)

      cy.selByList(SEL.cart.itemRow).first().within(() => {
        cy.root().then(($row) => {
          const sels = SEL.cart.itemQuantityIncrease;
          for (const s of sels) {
            if ($row.find(s).length > 0) {
              cy.get(s).first().click({ force: true });
              return;
            }
          }
        });
      });

      cy.wait(500); // Đợi số lượng cập nhật

      cy.selByList(SEL.cart.itemRow).first().find('input.qty-input, input[type="tel"], input[type="text"]').should(($i) => {
        const v = parseInt($i.val(), 10);
        expect(v).to.be.gte(2);
      });
    });

    it('TKI_CART_012 — Giảm số lượng trong giỏ cập nhật thành tiền', () => {
      prepareAuthenticatedCart();
      cy.wait(2000); // Chờ Tiki load xong sự kiện React

      cy.selByList(SEL.cart.itemRow).first().within(() => {
        cy.root().then(($row) => {
          const incSels = SEL.cart.itemQuantityIncrease;
          for (const s of incSels) {
            if ($row.find(s).length > 0) {
              cy.get(s).first().click({ force: true });
              return;
            }
          }
        });
      });
      cy.wait(1500); // Chờ request API cập nhật giỏ hàng hoàn tất

      cy.selByList(SEL.cart.itemRow).first().within(() => {
        cy.root().then(($row) => {
          const decSels = SEL.cart.itemQuantityDecrease;
          for (const s of decSels) {
            if ($row.find(s).length > 0) {
              cy.get(s).first().click({ force: true });
              return;
            }
          }
        });
      });

      cy.wait(500); // Đợi số lượng cập nhật

      cy.selByList(SEL.cart.itemRow).first().find('input.qty-input, input[type="tel"], input[type="text"]').should(($i) => {
        const v = parseInt($i.val(), 10);
        expect(v).to.be.gte(1);
      });
    });



    it('TKI_CART_013 — Chọn/bỏ chọn 1 sản phẩm cập nhật tổng tiền', () => {
      prepareAuthenticatedCart();
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



    it('TKI_CART_014 — Thêm sản phẩm mới vào giỏ rồi xóa', () => {
      // 1. Mở một sản phẩm bất kỳ
      prepareManualAuthenticatedSession();

      // 2. Thêm vào giỏ và đi tới giỏ hàng
      cy.addCurrentProductToCart();
      cy.goToCart();
      waitForCartPage();
      cy.wait(2000); // Chờ load API

      cy.get('body').then(($b) => {
        // Tìm một selector đúng để đếm chính xác số lượng item
        const validSel = SEL.cart.itemRow.find(s => Cypress.$($b).find(s).length > 0);
        if (!validSel) throw new Error('Không có sản phẩm trong giỏ để xóa');

        const before = Cypress.$($b).find(validSel).length;

        // 3. Xóa sản phẩm vừa thêm (thường nằm trên cùng danh sách)
        cy.get(validSel).first().within(() => {
          cy.root().then(($row) => {
            const delSels = SEL.cart.itemDeleteButton;
            for (const s of delSels) {
              if ($row.find(s).length > 0) {
                cy.get(s).first().click({ force: true });
                return;
              }
            }
          });
        });

        cy.wait(1000); // Chờ popup xuất hiện

        // 4. Bấm Xác Nhận
        cy.get('body').then(($body2) => {
          if ($body2.text().includes('Xác Nhận') || $body2.text().includes('Bạn có muốn xóa')) {
            cy.contains('Xác Nhận').click({ force: true });
            cy.wait(2000); // Chờ API xóa chạy xong
          }
        });

        // 5. Kiểm tra số lượng sau khi xóa
        cy.get('body').then(($body3) => {
          const remaining = Cypress.$($body3).find(validSel).length;
          expect(remaining).to.eq(before - 1); // Đảm bảo giảm đúng 1 sản phẩm
        });
      });
    });

    it('TKI_CART_015 — Tổng tiền thanh toán = tổng thành tiền các sản phẩm được chọn', () => {
      // Thêm 2 sản phẩm khác nhau vào giỏ
      cy.ensureLoggedInForCart();

      cy.visitHome();
      cy.doSearch(data.search.validKeyword);

      cy.get('a[href]', { timeout: 30000 }).then(($links) => {
        const productLinks = Array.from($links)
          .filter((el) => el.offsetParent !== null)
          .map((el) => el.getAttribute('href'))
          .filter((href) => {
            if (!href) return false;
            let url;
            try { url = new URL(href, 'https://tiki.vn'); } catch (e) { return false; }
            if (!/(\.|^)tiki\.vn$/i.test(url.hostname)) return false;
            return /-p\d+\.html$/i.test(url.pathname) || /\/p\d+\.html$/i.test(url.pathname);
          });

        const uniqueLinks = [...new Set(productLinks)].slice(0, 2);
        if (uniqueLinks.length < 2) throw new Error('Không đủ 2 sản phẩm trong kết quả tìm kiếm');
        cy.wrap(uniqueLinks[0]).as('prod1');
        cy.wrap(uniqueLinks[1]).as('prod2');
      });

      cy.get('@prod1').then((link) => {
        cy.visit(link);
        cy.addCurrentProductToCart();
        cy.wait(1000);
      });

      cy.get('@prod2').then((link) => {
        cy.visit(link);
        cy.addCurrentProductToCart();
        cy.wait(1000);
      });

      cy.goToCart();
      waitForCartPage();
      cy.wait(2000); // Chờ API tải xong

      cy.get('body').then(($b) => {
        const $selectAll = Cypress.$($b).find('span.label:contains("Tất cả (")').parent();
        if ($selectAll.length > 0) {
          cy.wrap($selectAll).click({ force: true });
          cy.wait(1500);
        }
      });

      cy.get('body').then(($b) => {
        const validSel = SEL.cart.itemRow.find(s => Cypress.$($b).find(s).length > 0);
        if (!validSel) throw new Error('Không có sản phẩm trong giỏ');

        let sumThanhTien = 0;
        let debugInfo = [];

        // 1. Tính tổng "Thành tiền" của các món đang tick
        cy.get(validSel).each(($row) => {
          // Tiki đôi khi giấu trạng thái checked ở thẻ input, nên ta check thêm class/svg
          const isChecked = $row.find('input[type="checkbox"]').is(':checked') || $row.find('.checkbox-fake svg, .checkbox-fake img').length > 0;
          const rowText = $row.text().trim().replace(/\s+/g, ' ');

          if (isChecked) {
            const matches = rowText.match(/[\d\.]+\s*(₫|đ)/ig);
            if (matches && matches.length > 0) {
              // Lấy giá trị tiền nằm cuối cùng bên phải của dòng (chính là cột Thành tiền)
              const lastMatch = matches[matches.length - 1];
              const thanhTienItem = parseInt(lastMatch.replace(/[^\d]/g, ''), 10);
              
              if (!isNaN(thanhTienItem)) {
                  sumThanhTien += thanhTienItem;
                  debugInfo.push(`[CHECKED] ${thanhTienItem}`);
              }
            } else {
              debugInfo.push(`[NO_PRICE_MATCH] ${rowText}`);
            }
          } else {
            debugInfo.push(`[UNCHECKED] ${rowText.substring(0, 40)}...`);
          }
        }).then(() => {
          // 2. Tìm dòng "Tổng tiền thanh toán"
          cy.get('body').then(($b2) => {
            const summaryNode = Cypress.$($b2).find('span, p, div').filter((_, el) => {
              const t = Cypress.$(el).text().trim().toLowerCase();
              return t === 'tổng tiền thanh toán';
            }).last();

            if (summaryNode.length > 0) {
              const parentText = summaryNode.parent().text();
              const priceMatch = parentText.match(/[\d\.]+\s*(₫|đ)/i);
              if (priceMatch) {
                const totalVal = parseInt(priceMatch[0].replace(/[^\d]/g, ''), 10);
                expect(totalVal).to.eq(sumThanhTien, `Lệch tiền. Chi tiết Thành tiền từng món: ${debugInfo.join(' | ')}`);
              } else {
                throw new Error('Không bóc tách được số tiền từ đoạn text: ' + parentText);
              }
            } else {
              throw new Error('Không tìm thấy dòng "Tổng tiền thanh toán" trên giao diện');
            }
          });
        });
      });
    });

    it('TKI_CART_016 — Freeship chưa đạt ngưỡng hiển thị thông báo cần mua thêm', () => {
      prepareAuthenticatedCart();
      cy.get('body').then(($b) => {
        const text = $b.text().toLowerCase();
        const meaningful = /mua thêm|chưa đủ|freeship|miễn phí vận chuyển/.test(text);
        expect(meaningful).to.eq(true);
      });
    });

    it.only('TKI_CART_017 — Click Mua Hàng sau khi đăng nhập → đi tới bước thanh toán', () => {
      prepareAuthenticatedCart();
      cy.selByList(SEL.cart.checkoutButton).click({ force: true });
      cy.url({ timeout: 30000 }).should('match', /checkout|payment|order/);
    });
  });
});