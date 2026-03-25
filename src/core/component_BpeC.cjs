const { parseUniFile } = require('./dist/parser/uniParser.js');
const sample = `unistack app "A" version 1.0 { imports: "b.uni"; }`;
console.log(JSON.stringify(parseUniFile(sample,'test.uni'),null,2));
