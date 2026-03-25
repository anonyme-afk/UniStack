export type Literal =
  | { kind: 'string'; value: string }
  | { kind: 'number'; value: number }
  | { kind: 'boolean'; value: boolean };

export interface ConfigEntry {
  key: string;
  value: Literal;
}

export interface ConfigSection {
  kind: 'config';
  entries: ConfigEntry[];
}

// english: ----- HTML -----
// french:  ----- HTML -----

export type HtmlNode = HtmlTextNode | HtmlExprNode;

export interface HtmlTextNode {
  kind: 'htmlText';
  text: string;
}

export interface HtmlExprNode {
  kind: 'htmlExpr';
  target: LangRef;
}

export interface HtmlSection {
  kind: 'html';
  blocks: HtmlBlock[];
}

export interface HtmlBlock {
  nodes: HtmlNode[];
}

// english: ----- CSS -----
// french:  ----- CSS -----

export interface CssSection {
  kind: 'css';
  chunks: string[];
}

// english: ----- py-logic -----
// french:  ----- py-logic -----

export interface PyChunk {
  kind: 'pyChunk';
  code: string;
}

export interface PySection {
  kind: 'py';
  chunks: PyChunk[];
}

// english: ----- js-events -----
// french:  ----- js-events -----

export interface JsChunk {
  kind: 'jsChunk';
  code: string;
}

export interface JsSection {
  kind: 'js';
  chunks: JsChunk[];
}

// english: ----- routes -----
// french:  ----- routes -----

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RouteSection {
  kind: 'routes';
  routes: RouteDef[];
}

export interface RouteDef {
  method: HttpMethod;
  path: string;
  body: RouteStmt[];
}

export type RouteStmt = RouteReturnStmt | RouteStatusStmt;

export interface RouteReturnStmt {
  kind: 'return';
  expr: LangRef;
}

export interface RouteStatusStmt {
  kind: 'status';
  code: number;
}

// english: ----- cross-language references -----
// french:  ----- références inter-langages -----

export type LangKind = 'py' | 'js' | 'sql';

export interface LangRefBase {
  lang: LangKind;
}

export interface LangRefPyJs extends LangRefBase {
  lang: 'py' | 'js';
  name: string;
  args: Expr[];
}

export interface LangRefSql extends LangRefBase {
  lang: 'sql';
  query: string;
}

export type LangRef = LangRefPyJs | LangRefSql;

// english: Minimalist expressions for callSuffix arguments
// french:  Expressions minimalistes pour arguments de callSuffix
export type Expr = Literal | { kind: 'identifier'; name: string };

// english: ----- root file -----
// french:  ----- fichier racine -----

export type Section = ConfigSection | HtmlSection | CssSection | PySection | JsSection | RouteSection;

export interface UniFile {
  name: string;
  version: string;
  config: ConfigSection | null;
  sections: Section[];
}

// english: ----- code generation IR -----
// french:  ----- IR de génération -----

export interface FrontendPlaceholder {
  id: string;
  ref: LangRef;
}

export interface FrontendIR {
  html: string;
  css: string;
  placeholders: FrontendPlaceholder[];
}

export interface BackendRouteIR {
  method: HttpMethod;
  path: string;
  // english: Name of the backend function/provider to call (py/sql)
  // french:  Nom de la fonction/fournisseur backend à appeler (py/sql)
  handler: LangRef;
}

export interface BackendIR {
  routes: BackendRouteIR[];
}

export interface AssetsIR {
  clientEntry: string;
}

export interface CompilationIR {
  frontend: FrontendIR;
  backend: BackendIR;
  assets: AssetsIR;
}
