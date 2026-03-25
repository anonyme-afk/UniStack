const { AdvancedCodeGenerator } = require('./dist/transpiler/advanced.js');
const gen = new AdvancedCodeGenerator();
console.log(gen.generateValidation());
