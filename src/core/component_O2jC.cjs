const { AdvancedCodeGenerator } = require('./dist/transpiler/advanced.js');
const gen = new AdvancedCodeGenerator();
let code = gen.generateValidation();
code = code.replace(/export\s+/g, '');
code = code.replace(/:\s*[A-Za-z0-9_\[\]{}]+/g, '');
code = code.replace(/interface[\s\S]*?\}\s*/g, '');
console.log('sanitized code:');
console.log(code);
try {
  const validateFn = eval(code + '\nvalidate');
  console.log('eval succeeded');
} catch(e) {
  console.error('eval error', e);
}
