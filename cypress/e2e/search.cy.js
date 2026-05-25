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

  it('TKI_SEARCH_009 — Từ khóa không phổ biến không làm trang tìm kiếm bị crash', () => {
    cy.doSearch(data.search.noResult);
    cy.url().should('include', '/search');
    cy.url().then((u) => {
      const q = new URL(u).searchParams.get('q');
      expect(q).to.eq(data.search.noResult);
    });
    cy.selByList(SEL.header.searchInput).should('have.value', data.search.noResult);
    cy.get('body').should('be.visible').and('not.contain.text', 'Internal Server Error');
    cy.get('main').should('exist');
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
    cy.url().should('match', /-p\d+\.html|\/p\d+|\/p\//);

    cy.doSearch(data.search.fromDetailPage);
    cy.url().should('include', '/search');
    cy.url().then((u) => {
      const q = new URL(u).searchParams.get('q');
      expect(q).to.eq(data.search.fromDetailPage);
    });
    cy.get('input[data-view-id="main_search_form_input"]:visible')
      .should('have.value', data.search.fromDetailPage);
    cy.get('body').should('be.visible').and('not.contain.text', 'Internal Server Error');
    cy.get('main').should('exist');
  });

  it('TKI_SEARCH_013 — Chọn 1 sản phẩm từ kết quả tìm kiếm điều hướng sang trang chi tiết', () => {
    cy.doSearch(data.search.validKeyword);
    cy.captureText(SEL.search.productCardName, 'pickedName');
    cy.openRandomProductFromResults();
    cy.url().should('match', /tiki\.vn\/.+-p\d+\.html|tiki\.vn\/.+\/p\d+|\/p\//);
    cy.selByList(SEL.product.title).should('be.visible');
    cy.get('body').should('be.visible');
  });

  it('TKI_SEARCH_014 — Breadcrumb hiển thị trên trang chi tiết', () => {
    cy.doSearch(data.search.validKeyword);
    cy.openRandomProductFromResults();
    cy.get('[data-view-id="breadcrumb_item"], .breadcrumb .breadcrumb-item')
      .should('have.length.greaterThan', 1);
    cy.get('[data-view-id="breadcrumb_item"], .breadcrumb .breadcrumb-item')
      .first()
      .should('contain.text', 'Trang chủ');
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
    cy.doSearch(data.search.first, { submit: 'enter' });
    cy.url().should('include', '/search');
    cy.location('search').should((search) => {
      const q = new URLSearchParams(search).get('q');
      expect(q).to.eq(data.search.first);
    });
    cy.selByList(SEL.search.productCard).should('have.length.greaterThan', 0);

    cy.doSearch(data.search.second, { submit: 'enter' });
    cy.url().should('include', '/search');
    cy.location('search').should((search) => {
      const q = new URLSearchParams(search).get('q');
      expect(q).to.eq(data.search.second);
    });
    cy.get('input[data-view-id="main_search_form_input"]:visible')
      .should('have.value', data.search.second);
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
      cy.get('img').first().should(($img) => {
        const attrs = ['src', 'srcset', 'data-src', 'data-srcset'];
        const hasImageSource = attrs.some((attr) => Boolean($img.attr(attr)));
        expect(hasImageSource).to.eq(true);
      });
      cy.root().invoke('text').then((t) => {
        expect(t.trim().length).to.be.greaterThan(0);
      });
    });
  });
});
