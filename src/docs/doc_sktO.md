# Testing Guide / Guide de test

**english:** complete testing information for UniStack developers.

**french:** informations de test complètes pour les développeurs UniStack.

---

## Running Tests

```bash
npm run test
```

Expected output: 4 passing tests with bilingual messages.

---

## Test Structure

All tests live in `src/tests/parser.test.ts`:

1. **testInlineRoutes()** - Validates inline route syntax parsing
2. **testConfigParsing()** - Validates config section parsing
3. **testTranspilerBuild()** - Validates end-to-end build pipeline

---

## Writing New Tests

Add new test functions to `src/tests/parser.test.ts`:

```typescript
function testMyFeature() {
  const src = `...`;
  const ast = parseUniFile(src, 'test.uni');
  assert(condition, 'test message');
  console.log('english: my test passed | french: mon test est passé');
}

testMyFeature();
```

---

## CI/CD Testing

GitHub Actions automatically runs `npm run test` on every push/PR.
Check `.github/workflows/ci.yml` for the workflow definition.

---

## Manual Testing

### Test the CLI

```bash
# Test init command
node dist/cli.js init

# Test build
node dist/cli.js build

# Test dev (will start server, press Ctrl+C to stop)
node dist/cli.js dev
```

### Test the Parser

```bash
npm run build
node --input-type=module -e "
import { parseUniFile } from './dist/parser/uniParser.js';
const src = \`unistack app \"Test\" version 1.0 { config: port=3000; }\`;
const ast = parseUniFile(src, 'test.uni');
console.log(JSON.stringify(ast, null, 2));
"
```

---

## Continuous Improvement

After making changes:

```bash
npm run build    # Compile
npm run test     # Test
npm run verify   # Verify setup
```

All should complete without errors.
