/// <reference types="cypress" />
const SEL = require('../support/selectors');

describe('Chức năng đăng nhập — Tiki', () => {
  let data;

  before(() => {
    cy.fixture('testData').then((d) => {
      data = d;
    });
  });

  beforeEach(function () {
    const match = this.currentTest.title.match(/^TKI_LOGIN_(\d+)/);
    if (!match || Number(match[1]) <= 17) cy.visitHome();
  });

   it('TKI_LOGIN_001 — Mở popup đăng nhập từ header', () => {
    cy.openLoginPopup();
    cy.selByList(SEL.loginPopup.title).should('exist');
    cy.selByList(SEL.loginPopup.phoneInput).should('be.visible');
    cy.selByList(SEL.loginPopup.continueButton).should('exist');
  });

  it('TKI_LOGIN_002 — Đóng popup đăng nhập', () => {
    cy.openLoginPopup();
    cy.closeLoginPopup();
    cy.get('body').then(($b) => {
      const stillOpen = SEL.loginPopup.container.some(
        (s) => Cypress.$($b).find(`${s}:visible`).length > 0
      );
      expect(stillOpen).to.eq(false);
    });
  });

  it('TKI_LOGIN_003 — Nút Tiếp Tục disabled khi chưa nhập số điện thoại', () => {
    cy.openLoginPopup();
    cy.selByList(SEL.loginPopup.phoneInput).should('have.value', '');
    cy.selByList(SEL.loginPopup.continueButton).then(($btn) => {
      const disabled = $btn.prop('disabled') || $btn.attr('aria-disabled') === 'true';
      if (!disabled) {
        cy.wrap($btn).click({ force: true });
        cy.get('body').then(($b) => {
          const errSel = SEL.loginPopup.errorMessage.find(
            (s) => Cypress.$($b).find(s).length > 0
          );
          expect(errSel, 'Có error message hoặc nút disabled').to.exist;
        });
      } else {
        expect(disabled).to.eq(true);
      }
    });
  });

  it('TKI_LOGIN_004 — Số điện thoại sai định dạng bị từ chối', () => {
    cy.openLoginPopup();
    cy.selByList(SEL.loginPopup.phoneInput).clear().type(data.login.invalidPhone);
    cy.selByList(SEL.loginPopup.termsCheckbox).check({ force: true });
    cy.selByList(SEL.loginPopup.continueButton).click({ force: true });
    cy.get('body', { timeout: 5000 }).then(($b) => {
      const hasErr = SEL.loginPopup.errorMessage.some(
        (s) => Cypress.$($b).find(s).length > 0
      );
      const stillVisible = SEL.loginPopup.phoneInput.some(
        (s) => Cypress.$($b).find(`${s}:visible`).length > 0
      );
      expect(hasErr || stillVisible).to.eq(true);
    });
  });

  it('TKI_LOGIN_005 — Ô số điện thoại chặn ký tự không hợp lệ', () => {
    cy.openLoginPopup();
    cy.selByList(SEL.loginPopup.phoneInput)
      .clear()
      .type(data.login.invalidWithLetters)
      .should(($i) => {
        const v = $i.val() || '';
        expect(/^\d*$/.test(v)).to.eq(true);
      });

    cy.selByList(SEL.loginPopup.phoneInput)
      .clear()
      .type(data.login.invalidWithSpecial, { parseSpecialCharSequences: false })
      .should(($i) => {
        const v = $i.val() || '';
        expect(/^[\d]*$/.test(v)).to.eq(true);
      });
  });

  it('TKI_LOGIN_006 — Số điện thoại hợp lệ + chưa tick điều khoản không cho đi tiếp', () => {
    const phone = Cypress.env('TEST_PHONE') || '0900000000';
    cy.openLoginPopup();
    cy.selByList(SEL.loginPopup.phoneInput).clear().type(phone);
    cy.get('body').then(($b) => {
      const termsExists = SEL.loginPopup.termsCheckbox.some(
        (s) => Cypress.$($b).find(s).length > 0
      );
      if (!termsExists) {
        cy.log('Popup không có checkbox điều khoản — skip soft');
        return;
      }
      cy.selByList(SEL.loginPopup.termsCheckbox).uncheck({ force: true });
      cy.selByList(SEL.loginPopup.continueButton).then(($btn) => {
        const disabled = $btn.prop('disabled') || $btn.attr('aria-disabled') === 'true';
        if (disabled) {
          expect(disabled).to.eq(true);
        } else {
          cy.wrap($btn).click({ force: true });
          cy.selByList(SEL.loginPopup.phoneInput).should('be.visible');
        }
      });
    });
  });

  it('TKI_LOGIN_007 — Số điện thoại hợp lệ + tick điều khoản → bước OTP', () => {
    if (!Cypress.env('RUN_OTP_TESTS')) {
      cy.log('RUN_OTP_TESTS = false → skip (cần tài khoản test thật + OTP)');
      return;
    }
    const phone = Cypress.env('TEST_PHONE');
    cy.openLoginPopup();
    cy.selByList(SEL.loginPopup.phoneInput).clear().type(phone);
    cy.selByList(SEL.loginPopup.termsCheckbox).check({ force: true });
    cy.selByList(SEL.loginPopup.continueButton).click({ force: true });
    cy.get('body', { timeout: 30000 }).then(($b) => {
      const matchedOtp = SEL.loginPopup.otpInput.some(
        (s) => Cypress.$($b).find(s).length > 0
      );
      expect(matchedOtp).to.eq(true);
    });
  });

  it('TKI_LOGIN_008 — Chuyển sang đăng nhập bằng email', () => {
    cy.openLoginPopup();
    cy.get('body').then(($b) => {
      const found = SEL.loginPopup.emailLoginLink.some(
        (s) => Cypress.$($b).find(s).length > 0
      );
      if (!found) return cy.log('Không thấy link đăng nhập bằng email — skip soft');
      cy.selByList(SEL.loginPopup.emailLoginLink).click({ force: true });
      cy.selByList(SEL.loginPopup.emailInput, { timeout: 10000 }).should('be.visible');
    });
  });

  it('TKI_LOGIN_009 — Đăng nhập bằng email sai định dạng', () => {
    cy.openLoginPopup();
    cy.get('body').then(($b) => {
      const linkFound = SEL.loginPopup.emailLoginLink.some(
        (s) => Cypress.$($b).find(s).length > 0
      );
      if (!linkFound) return cy.log('Không có luồng email login — skip soft');
      cy.selByList(SEL.loginPopup.emailLoginLink).click({ force: true });
      cy.selByList(SEL.loginPopup.emailInput).clear().type(data.login.invalidEmail);
      cy.selByList(SEL.loginPopup.emailSubmitButton).click({ force: true });
      cy.get('body').then(($body) => {
        const errFound = SEL.loginPopup.errorMessage.some(
          (s) => Cypress.$($body).find(s).length > 0
        );
        const stillOnEmail = SEL.loginPopup.emailInput.some(
          (s) => Cypress.$($body).find(`${s}:visible`).length > 0
        );
        expect(errFound || stillOnEmail).to.eq(true);
      });
    });
  });

  it('TKI_LOGIN_010 — Đăng nhập bằng email hợp lệ của tài khoản test', () => {
    if (!Cypress.env('RUN_OTP_TESTS')) {
      cy.log('RUN_OTP_TESTS = false → skip (cần email/password test)');
      return;
    }
    const email = Cypress.env('TEST_EMAIL');
    const secret = Cypress.env('TEST_SECRET');
    cy.openLoginPopup();
    cy.selByList(SEL.loginPopup.emailLoginLink).click({ force: true });
    cy.selByList(SEL.loginPopup.emailInput).clear().type(email);
    cy.selByList(SEL.loginPopup.passwordInput).clear().type(secret, { log: false });
    cy.selByList(SEL.loginPopup.emailSubmitButton).click({ force: true });
    cy.selByList(SEL.loggedInHeader.accountText, { timeout: 30000 }).should('exist');
  });

  it('TKI_LOGIN_011 — Sai thông tin xác thực hiển thị lỗi', () => {
    if (!Cypress.env('RUN_OTP_TESTS')) {
      cy.log('RUN_OTP_TESTS = false → skip (cần tài khoản test)');
      return;
    }
    const email = Cypress.env('TEST_EMAIL');
    cy.openLoginPopup();
    cy.selByList(SEL.loginPopup.emailLoginLink).click({ force: true });
    cy.selByList(SEL.loginPopup.emailInput).clear().type(email);
    cy.selByList(SEL.loginPopup.passwordInput).clear().type(data.login.invalidSecret, { log: false });
    cy.selByList(SEL.loginPopup.emailSubmitButton).click({ force: true });
    cy.get('body', { timeout: 15000 }).then(($b) => {
      const errFound = SEL.loginPopup.errorMessage.some(
        (s) => Cypress.$($b).find(s).length > 0
      );
      expect(errFound).to.eq(true);
    });
  });
});
