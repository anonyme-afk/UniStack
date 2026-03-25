import { CharStreams, CommonTokenStream } from 'antlr4ts';
import type { ANTLRErrorListener } from 'antlr4ts/ANTLRErrorListener.js';
import { RecognitionException, Recognizer } from 'antlr4ts';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor.js';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode.js';
import type {
  ConfigEntry,
  ConfigSection,
  CssSection,
  HtmlBlock,
  HtmlExprNode,
  HtmlNode,
  HtmlSection,
  HtmlTextNode,
  ImportsSection,
  JsChunk,
  JsSection,
  LangRef,
  LangRefPyJs,
  LangRefSql,
  Literal,
  PyChunk,
  PySection,
  RouteDef,
  RouteReturnStmt,
  RouteSection,
  RouteStatusStmt,
  Section,
  UniFile,
} from '../lang/ast.js';
import { UniStackLexer } from './generated/UniStackLexer.js';
import { UniStackParser } from './generated/UniStackParser.js';
import { UniStackVisitor } from './generated/UniStackVisitor.js';

export interface ParseDiagnostic {
  message: string;
  line: number;
  column: number;
}

class CollectingErrorListener implements ANTLRErrorListener<number> {
  public readonly diagnostics: ParseDiagnostic[] = [];

  syntaxError(
    _recognizer: Recognizer<number, any>,
    _offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | undefined,
  ): void {
    this.diagnostics.push({ message: msg, line, column: charPositionInLine });
  }
}

export function parseUniFileAntlr(source: string, fileName: string): UniFile {
  const { ast, diagnostics } = parseUniFileAntlrWithDiagnostics(source, fileName);
  if (diagnostics.length > 0) {
    const first = diagnostics[0];
    throw new Error(
      `english: UniStack: parse error at ${first.line}:${first.column} (${first.message}). ` +
        `french: UniStack : erreur de parsing à ${first.line}:${first.column} (${first.message}).`,
    );
  }
  return ast;
}

export function parseUniFileAntlrWithDiagnostics(source: string, fileName: string): {
  ast: UniFile;
  diagnostics: ParseDiagnostic[];
} {
  const input = CharStreams.fromString(source, fileName);
  const lexer = new UniStackLexer(input);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new UniStackParser(tokenStream);

  const errorListener = new CollectingErrorListener();
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  const tree = parser.file();
  if (errorListener.diagnostics.length > 0) {
    return {
      ast: {
        name: 'Invalid',
        version: '0.0',
        config: null,
        sections: [],
      },
      diagnostics: errorListener.diagnostics,
    };
  }

  const visitor = new UniAstVisitor();
  const ast = visitor.visit(tree);

  return { ast, diagnostics: errorListener.diagnostics };
}

class UniAstVisitor extends AbstractParseTreeVisitor<any> implements UniStackVisitor<any> {
  protected defaultResult(): UniFile {
    return {
      name: 'Unnamed',
      version: '0.0',
      config: null,
      sections: [],
    };
  }

  visitFile(ctx: any): UniFile {
    const nameToken = findToken(ctx, UniStackLexer.STRING) ?? findToken(ctx, UniStackLexer.IDENT);
    const versionToken = findToken(ctx, UniStackLexer.VERSION);
    const name = nameToken ? unquote(nameToken.text) : 'Unnamed';
    const version = versionToken ? versionToken.text : '0.0';
    const sections = ctx.fileBody().fileSection().map((s: any) => this.visitFileSection(s));

    let config: ConfigSection | null = null;
    for (const s of sections) {
      if (s.kind === 'config') {
        config = s as ConfigSection;
      }
    }

    return { name, version, config, sections };
  }

  visitFileSection(ctx: any): Section {
    if (ctx.importsSection()) return this.visitImportsSection(ctx.importsSection());
    if (ctx.configSection()) return this.visitConfigSection(ctx.configSection());
    if (ctx.htmlSection()) return this.visitHtmlSection(ctx.htmlSection());
    if (ctx.cssSection()) return this.visitCssSection(ctx.cssSection());
    if (ctx.pySection()) return this.visitPySection(ctx.pySection());
    if (ctx.jsSection()) return this.visitJsSection(ctx.jsSection());
    if (ctx.routesSection()) return this.visitRoutesSection(ctx.routesSection());
    throw new Error('Unknown section');
  }

  visitImportsSection(ctx: any): ImportsSection {
    const paths = ctx.importList().STRING().map((s: any) => unquote(s.text));
    // translate to new entries format (no names/alias information available via grammar)
    const entries = paths.map(p => ({ path: p }));
    return { kind: 'imports', entries } as any;
  }

  visitConfigSection(ctx: any): ConfigSection {
    const entries = ctx.configEntryList().configEntry().map((e: any) => this.visitConfigEntry(e));
    return { kind: 'config', entries };
  }

  visitConfigEntry(ctx: any): ConfigEntry {
    const key = ctx.IDENT().text;
    const value = this.visitConfigValue(ctx.configValue());
    return { key, value };
  }

  visitConfigValue(ctx: any): Literal {
    if (ctx.STRING()) return { kind: 'string', value: unquote(ctx.STRING().text) };
    if (ctx.NUMBER()) return { kind: 'number', value: Number(ctx.NUMBER().text) };
    return { kind: 'boolean', value: ctx.BOOLEAN().text === 'true' };
  }

  visitHtmlSection(ctx: any): HtmlSection {
    const blocks = ctx.htmlBlock().map((b: any) => this.visitHtmlBlock(b));
    return { kind: 'html', blocks };
  }

  visitHtmlBlock(ctx: any): HtmlBlock {
    const nodes = ctx.htmlNode().map((n: any) => this.visitHtmlNode(n));
    return { nodes };
  }

  visitHtmlNode(ctx: any): HtmlNode {
    if (ctx.htmlText()) {
      const node: HtmlTextNode = { kind: 'htmlText', text: ctx.htmlText().text };
      return node;
    }
    const expr: HtmlExprNode = { kind: 'htmlExpr', target: this.visitLangRef(ctx.htmlExpr().langRef()) };
    return expr;
  }

  visitCssSection(ctx: any): CssSection {
    const chunks = ctx.cssChunk().map((c: any) => c.text);
    return { kind: 'css', chunks };
  }

  visitPySection(ctx: any): PySection {
    const code = ctx.pyChunk().map((c: any) => c.text).join('\n');
    const chunk: PyChunk = { kind: 'pyChunk', code };
    return { kind: 'py', chunks: [chunk] };
  }

  visitJsSection(ctx: any): JsSection {
    const code = ctx.jsChunk().map((c: any) => c.text).join('\n');
    const chunk: JsChunk = { kind: 'jsChunk', code };
    return { kind: 'js', chunks: [chunk] };
  }

  visitRoutesSection(ctx: any): RouteSection {
    const routes = ctx.routeDef().map((r: any) => this.visitRouteDef(r));
    return { kind: 'routes', routes };
  }

  visitRouteDef(ctx: any): RouteDef {
    const method = ctx.HTTP_METHOD().text as RouteDef['method'];
    const path = ctx.PATH().text;
    const body = ctx.routeBody().routeStmt().map((s: any) => this.visitRouteStmt(s));
    return { method, path, body };
  }

  visitRouteStmt(ctx: any): RouteReturnStmt | RouteStatusStmt {
    if (ctx.langRef()) {
      const expr = this.visitLangRef(ctx.langRef());
      return { kind: 'return', expr };
    }
    const code = Number(ctx.NUMBER().text);
    return { kind: 'status', code };
  }

  visitLangRef(ctx: any): LangRef {
    if (ctx.STRING() && ctx.getChild(0).text === 'sql') {
      const query = unquote(ctx.STRING().text);
      const ref: LangRefSql = { lang: 'sql', query, params: [] };
      return ref;
    }
    const lang = ctx.getChild(0).text as 'py' | 'js';
    const name = ctx.IDENT().text;
    const args = ctx.callSuffix()
      ? ctx
          .callSuffix()
          .argList()
          ?.expr()
          .map((e: any) => parseExpr(e)) ?? []
      : [];
    const ref: LangRefPyJs = { lang, name, args };
    return ref;
  }
}

function parseExpr(ctx: any): Literal | { kind: 'identifier'; name: string } {
  if (ctx.STRING()) return { kind: 'string', value: unquote(ctx.STRING().text) };
  if (ctx.NUMBER()) return { kind: 'number', value: Number(ctx.NUMBER().text) };
  if (ctx.BOOLEAN()) return { kind: 'boolean', value: ctx.BOOLEAN().text === 'true' };
  return { kind: 'identifier', name: ctx.IDENT().text };
}

function unquote(text: string): string {
  if (text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1);
  }
  return text;
}

function findToken(ctx: any, tokenType: number): TerminalNode | null {
  const children = ctx.children ?? [];
  for (const child of children) {
    if (child?.symbol?.type === tokenType) {
      return child as TerminalNode;
    }
  }
  return null;
}
