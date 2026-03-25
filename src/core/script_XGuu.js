const { parseUniFile } = require('./dist/parser/uniParser.js');
const sample = `unistack app "M" version 1.0 {
  imports: {foo, bar as baz} from "mod.uni", "other.uni" as util, * as all from "lib.uni";
}`;
console.log(JSON.stringify(parseUniFile(sample,'test.uni'),null,2));
