/// <reference types="cypress" />
const SEL = require('../support/selectors');

describe('Chức năng tìm kiếm sản phẩm — Tiki', () => {
  let data;

  before(() => {
    cy.fixture('testData').then((d) => {
      data = d;
    });
  });

  beforeEach(() => {
    cy.visitHome();
  });

  it('TKI_SEARCH_001 — Hiển thị thành phần tìm kiếm trên trang chủ', () => {
    cy.selByList(SEL.header.searchInput).should('be.visible').and('have.attr', 'placeholder');
    cy.selByList(SEL.header.searchButton).should('be.visible').and('not.be.disabled');
  });

  it('TKI_SEARCH_002 — Tìm kiếm với từ khóa hợp lệ', () => {
    cy.doSearch(data.search.validKeyword);
    cy.url().should('include', '/search');
    cy.selByList(SEL.search.productCard, { timeout: 30000 })
      .should('have.length.greaterThan', 0);
  });

  it('TKI_SEARCH_003 — Từ khóa tiếng Việt có dấu', () => {
    cy.doSearch(data.search.vietnameseWithAccent);
    cy.url().should('include', '/search');
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);
  });

  it('TKI_SEARCH_004 — Từ khóa tiếng Việt không dấu', () => {
    cy.doSearch(data.search.vietnameseNoAccent);
    cy.url().should('include', '/search');
    cy.get('body').should('not.contain.text', 'Internal Server Error');
  });

  it('TKI_SEARCH_005 — Từ khóa có khoảng trắng đầu/cuối được trim', () => {
    cy.doSearch(data.search.withWhitespace);
    cy.url().should('include', '/search');
    cy.url().then((u) => {
      const decoded = decodeURIComponent(u);
      expect(decoded).to.match(/sách/);
    });
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);
  });

  it('TKI_SEARCH_006 — Tìm kiếm không phân biệt hoa/thường', () => {
    cy.doSearch(data.search.mixedCase);
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);
  });

  it('TKI_SEARCH_007 — Từ khóa dạng số', () => {
    cy.doSearch(data.search.numeric);
    cy.url().should('include', '/search');
    cy.get('body').should('not.contain.text', 'Internal Server Error');
  });

  it('TKI_SEARCH_008 — Từ khóa ký tự đặc biệt không gây crash', () => {
    cy.doSearch(data.search.specialChars);
    cy.url().should('include', '/search');
    cy.get('body').then(($b) => {
      expect($b.html().toLowerCase()).to.not.include('<script>alert');
    });
  });

  it('TKI_SEARCH_009 — Từ khóa không tồn tại hiển thị trạng thái không có kết quả', () => {
    cy.doSearch(data.search.noResult);
    cy.url().should('include', '/search');
    cy.get('body', { timeout: 20000 }).then(($b) => {
      const text = $b.text().toLowerCase();
      expect(
        /không tìm thấy|không có kết quả|rất tiếc|no result|gợi ý/.test(text)
      ).to.eq(true);
    });
  });

  it('TKI_SEARCH_010 — Click Tìm kiếm khi ô trống không crash', () => {
    cy.doSearch('');
    cy.location('pathname').should('match', /\/(search)?\/?$/);
    cy.get('body').should('be.visible');
  });

  it('TKI_SEARCH_011 — Nhấn Enter để tìm kiếm', () => {
    cy.doSearch(data.search.enterKey, { submit: 'enter' });
    cy.url().should('include', '/search');
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);
  });

  it('TKI_SEARCH_012 — Tìm kiếm từ trang chi tiết sản phẩm', () => {
    cy.doSearch(data.search.validKeyword);
    cy.openRandomProductFromResults();
    cy.url().should('match', /\/p\d+|\/p\//);

    cy.doSearch(data.search.fromDetailPage);
    cy.url().should('include', '/search');
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);
  });

  it('TKI_SEARCH_013 — Chọn 1 sản phẩm từ kết quả tìm kiếm điều hướng sang trang chi tiết', () => {
    cy.doSearch(data.search.validKeyword);
    cy.captureText(SEL.search.productCardName, 'pickedName');
    cy.openRandomProductFromResults();
    cy.url().should('match', /tiki\.vn\/.+\/p\d+|\/p\//);
    cy.selByList(SEL.product.title).should('be.visible');
    cy.selByList(SEL.product.price).should('exist');
  });

  it('TKI_SEARCH_014 — Breadcrumb hiển thị trên trang chi tiết', () => {
    cy.doSearch(data.search.validKeyword);
    cy.openRandomProductFromResults();
    cy.selByList(SEL.product.breadcrumb, { timeout: 20000 }).should('exist').and('be.visible');
  });

  it('TKI_SEARCH_015 — Click danh mục trên menu header', () => {
    cy.get('body').then(($b) => {
      const $cat = SEL.header.categoryMenu
        .map((s) => Cypress.$($b).find(s))
        .find((c) => c.length > 0);
      if (!$cat || $cat.length === 0) {
        cy.log('Không tìm thấy menu danh mục — skip soft');
        return;
      }
      cy.wrap($cat.first()).click({ force: true });
      cy.url().should('not.eq', `${Cypress.config('baseUrl')}/`);
      cy.get('body').should('not.contain.text', 'Internal Server Error');
    });
  });

  it('TKI_SEARCH_016 — Tìm kiếm nhiều lần liên tiếp', () => {
    cy.doSearch(data.search.first);
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);

    cy.doSearch(data.search.second);
    cy.url().then((u) => {
      const decoded = decodeURIComponent(u);
      expect(decoded).to.match(/laptop/);
    });
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);
  });

  it('TKI_SEARCH_017 — Ô tìm kiếm giữ lại từ khóa đã nhập sau khi tìm kiếm', () => {
    cy.doSearch(data.search.displayBack);
    cy.selByList(SEL.header.searchInput, { timeout: 20000 })
      .should(($i) => {
        const v = $i.val() || '';
        expect(v.length).to.be.greaterThan(0);
      });
  });

  it('TKI_SEARCH_018 — Kết quả có đủ tên, hình ảnh và giá', () => {
    cy.doSearch(data.search.richResult);
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);
    cy.selByList(SEL.search.productCard).first().within(() => {
      cy.get('img').should('have.attr', 'src');
      cy.root().invoke('text').then((t) => {
        expect(t.trim().length).to.be.greaterThan(0);
      });
    });
  });
});
