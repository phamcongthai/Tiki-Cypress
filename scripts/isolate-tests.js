#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPEC_DIR = path.join(ROOT, 'cypress', 'e2e');
const TEST_RE = /\bit(\.only)?\s*\(\s*(['"`])([\s\S]*?)\2\s*,/g;

const usage = `
Cypress testcase isolation helper

Usage:
  node scripts/isolate-tests.js
  node scripts/isolate-tests.js list
  node scripts/isolate-tests.js clear
  node scripts/isolate-tests.js set <STT|TEST_ID> [STT|TEST_ID...]
  node scripts/isolate-tests.js add <STT|TEST_ID> [STT|TEST_ID...]

Examples:
  node scripts/isolate-tests.js list
  node scripts/isolate-tests.js clear
  node scripts/isolate-tests.js set TKI_SEARCH_002 TKI_CART_017
  node scripts/isolate-tests.js set 2 57
  node scripts/isolate-tests.js add TKI_LOGIN_001

Notes:
  - "set" xoa toan bo .only cu, sau do tao danh sach co lap moi.
  - "add" giu .only hien tai va them testcase moi vao danh sach co lap.
  - "clear" dua tat ca testcase ve it(...) binh thuong.
`;

const getSpecFiles = () => {
  if (!fs.existsSync(SPEC_DIR)) return [];
  return fs
    .readdirSync(SPEC_DIR)
    .filter((name) => /\.cy\.[jt]s$/.test(name) || /\.spec\.[jt]s$/.test(name))
    .sort()
    .map((name) => path.join(SPEC_DIR, name));
};

const getLineNumber = (text, index) => text.slice(0, index).split(/\r?\n/).length;

const extractTestId = (title) => {
  const match = title.match(/\bTKI_[A-Z]+_\d+\b/);
  return match ? match[0] : null;
};

const readTests = () => {
  const tests = [];

  getSpecFiles().forEach((file) => {
    const source = fs.readFileSync(file, 'utf8');
    TEST_RE.lastIndex = 0;
    let match;
    while ((match = TEST_RE.exec(source)) !== null) {
      const title = match[3].replace(/\s+/g, ' ').trim();
      tests.push({
        index: tests.length + 1,
        file,
        relativeFile: path.relative(ROOT, file).replace(/\\/g, '/'),
        line: getLineNumber(source, match.index),
        id: extractTestId(title),
        title,
        only: Boolean(match[1]),
      });
    }
  });

  return tests;
};

const printStatus = (tests) => {
  const isolated = tests.filter((test) => test.only);
  const bySpec = tests.reduce((acc, test) => {
    acc[test.relativeFile] ||= { total: 0, isolated: 0 };
    acc[test.relativeFile].total += 1;
    if (test.only) acc[test.relativeFile].isolated += 1;
    return acc;
  }, {});

  console.log('\n=== Cypress testcase isolation status ===');
  console.log(`Tong so testcase: ${tests.length}`);
  console.log(`Tong so testcase dang co lap (.only): ${isolated.length}`);
  console.log('\nTheo spec:');
  Object.entries(bySpec).forEach(([file, stat]) => {
    console.log(`- ${file}: ${stat.total} testcase, ${stat.isolated} dang co lap`);
  });

  console.log('\nDanh sach testcase:');
  tests.forEach((test) => {
    const marker = test.only ? '[ONLY]' : '      ';
    const id = test.id || 'NO_ID';
    console.log(
      `${String(test.index).padStart(3, ' ')} ${marker} ${id.padEnd(15, ' ')} ${test.relativeFile}:${test.line} - ${test.title}`
    );
  });

  if (isolated.length > 0) {
    console.log('\nDang co lap:');
    isolated.forEach((test) => {
      console.log(`- ${test.id || test.index}: ${test.title} (${test.relativeFile}:${test.line})`);
    });
  }
  console.log('');
};

const clearOnlyInFiles = () => {
  getSpecFiles().forEach((file) => {
    const source = fs.readFileSync(file, 'utf8');
    const updated = source
      .replace(/\bit\.only\s*\(/g, 'it(')
      .replace(/\bdescribe\.only\s*\(/g, 'describe(');
    if (updated !== source) fs.writeFileSync(file, updated, 'utf8');
  });
};

const normalizeTargets = (tests, rawTargets) => {
  const wanted = new Set(rawTargets.map((target) => String(target).trim()).filter(Boolean));
  const selected = [];
  const missing = [];

  wanted.forEach((target) => {
    const byIndex = /^\d+$/.test(target)
      ? tests.find((test) => String(test.index) === target)
      : null;
    const byId = tests.find((test) => test.id && test.id.toLowerCase() === target.toLowerCase());
    const match = byIndex || byId;
    if (match) selected.push(match);
    else missing.push(target);
  });

  return { selected, missing };
};

const applyOnly = (selectedTests) => {
  const selectedKeys = new Set(
    selectedTests.map((test) => `${path.resolve(test.file)}::${test.title}`)
  );

  getSpecFiles().forEach((file) => {
    const source = fs.readFileSync(file, 'utf8');
    let output = '';
    let lastIndex = 0;
    TEST_RE.lastIndex = 0;

    let match;
    while ((match = TEST_RE.exec(source)) !== null) {
      const title = match[3].replace(/\s+/g, ' ').trim();
      const key = `${path.resolve(file)}::${title}`;
      output += source.slice(lastIndex, match.index);

      const declaration = match[0];
      if (selectedKeys.has(key)) {
        output += declaration.replace(/\bit(\.only)?\s*\(/, 'it.only(');
      } else {
        output += declaration;
      }
      lastIndex = match.index + declaration.length;
    }

    output += source.slice(lastIndex);
    if (output !== source) fs.writeFileSync(file, output, 'utf8');
  });
};

const main = () => {
  const [command = 'list', ...args] = process.argv.slice(2);
  const normalizedCommand = command.toLowerCase();
  const tests = readTests();

  if (normalizedCommand === 'help' || normalizedCommand === '--help' || normalizedCommand === '-h') {
    console.log(usage);
    return;
  }

  if (normalizedCommand === 'list' || normalizedCommand === 'status') {
    printStatus(tests);
    return;
  }

  if (normalizedCommand === 'clear') {
    clearOnlyInFiles();
    console.log('Da go toan bo .only. Tat ca testcase da ve trang thai it(...).');
    printStatus(readTests());
    return;
  }

  if (normalizedCommand === 'set' || normalizedCommand === 'add') {
    if (args.length === 0) {
      console.error('Can truyen it nhat 1 STT hoac TEST_ID.');
      console.log(usage);
      process.exitCode = 1;
      return;
    }

    if (normalizedCommand === 'set') clearOnlyInFiles();

    const latestTests = readTests();
    const { selected, missing } = normalizeTargets(latestTests, args);

    if (missing.length > 0) {
      console.error(`Khong tim thay testcase: ${missing.join(', ')}`);
      process.exitCode = 1;
      return;
    }

    applyOnly(selected);
    console.log(
      `${normalizedCommand === 'set' ? 'Da tao moi' : 'Da them'} danh sach co lap: ${selected
        .map((test) => test.id || test.index)
        .join(', ')}`
    );
    printStatus(readTests());
    return;
  }

  console.error(`Lenh khong hop le: ${command}`);
  console.log(usage);
  process.exitCode = 1;
};

main();
