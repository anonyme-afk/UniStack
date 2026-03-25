import { parseUniFileAntlr, parseUniFileAntlrWithDiagnostics } from '../modules/module_vjbE';

// Tests for the hand-written parser (module_vjbE.ts)
describe('UniStack Hand-written Parser', () => {
  it('should parse a valid simple .uni file', () => {
    const source = `
      unistack app "TestApp" version 1.0 {
        config: port=3000;
        html-ui: 
          h1 { "Hello World" };
      }
    `;
    
    const result = parseUniFileAntlr(source, 'test.uni');
    expect(result.name).toBe('TestApp');
    expect(result.version).toBe('1.0');
    expect(result.config).not.toBeNull();
    expect(result.sections.length).toBeGreaterThan(0);
  });
  
  it('should return diagnostics for invalid .uni file', () => {
    const source = `
      unistack app "TestApp" version 1.0 {
        config: port=invalid;
      }
    `;
    
    const result = parseUniFileAntlrWithDiagnostics(source, 'test.uni');
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });
});