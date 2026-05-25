import './commands';

Cypress.on('uncaught:exception', () => {
  // Tiki tải nhiều third-party script (ads, tracking) có thể throw error
  // không liên quan đến luồng test — bỏ qua để không làm hỏng test.
  return false;
});

beforeEach(() => {
  cy.intercept({ url: '**/*', middleware: true }, (req) => {
    if (/doubleclick|googletagmanager|facebook\.net|hotjar/i.test(req.url)) {
      req.reply({ statusCode: 204, body: '' });
    }
  });
});
