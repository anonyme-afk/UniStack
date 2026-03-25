export interface Position {
  line: number;
  col: number;
}

/*
Copyright 2026 anonyme-afk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export type Literal =
  | { kind: 'string'; value: string }
  | { kind: 'number'; value: number }
  | { kind: 'boolean'; value: boolean };

export interface ConfigEntry {
  key: string;
  value: Literal;
  pos?: Position;
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

// english: ----- style (stdlib) -----
// french:  ----- style (stdlib) -----

export interface StyleSection {
  kind: 'style';
  lines: string[];
}

// english: ----- ffi ----- (native bridge declarations)
// french:  ----- ffi ----- (déclarations de bridge natif)

export interface FfiSection {
  kind: 'ffi';
  lines: string[];
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

// english: ----- imports -----
// french:  ----- imports -----

export interface ImportEntry {
  // path to the module file
  path: string;
  // named exports to import (optional)
  names?: string[];
  // alias for default import or module namespace
  alias?: string;
}

export interface ImportsSection {
  kind: 'imports';
  entries: ImportEntry[];
}

// english: ----- components ----- (reusable UI templates)
// french:  ----- components ----- (templates UI reutilisables)
export interface ComponentDef {
  name: string;
  params: string[];
  template: string;
}

export interface ComponentsSection {
  kind: 'components';
  components: ComponentDef[];
}

// english: ----- middleware ----- (server middleware config)
// french:  ----- middleware ----- (configuration middleware serveur)
export interface MiddlewareAuthConfig {
  enabled: boolean;
  excludes: string[];
  header: string;
  handler: LangRefPyJs | null;
}

export interface MiddlewareCorsConfig {
  enabled: boolean;
  origins: string[];
  methods: string[];
}

export interface MiddlewareRateLimitConfig {
  enabled: boolean;
  max: number;
  windowMs: number;
}

export interface MiddlewareSection {
  kind: 'middleware';
  auth: MiddlewareAuthConfig;
  cors: MiddlewareCorsConfig;
  rateLimit: MiddlewareRateLimitConfig;
}

// english: ----- ws-routes ----- (websocket routes)
// french:  ----- ws-routes ----- (routes websocket)
export interface WsRouteDef {
  path: string;
  onConnect?: LangRefPyJs;
  onMessage?: LangRefPyJs;
  onDisconnect?: LangRefPyJs;
}

export interface WsRoutesSection {
  kind: 'wsRoutes';
  routes: WsRouteDef[];
}

// english: ----- state ----- (reactive client state)
// french:  ----- state ----- (etat client reactif)
export interface StateEntry {
  key: string;
  expr: string;
}

export interface StateSection {
  kind: 'state';
  entries: StateEntry[];
}

// english: ----- env ----
// french:  ----- env -----
export interface EnvVarDef {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  default?: Literal;
}

export interface EnvSection {
  kind: 'env';
  vars: EnvVarDef[];
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
  pos?: Position;
  filePath?: string;
}

export interface RouteFileStmt {
  kind: 'file';
  field: string;
  accept: string[];
  maxSize: string;
}

export type RouteStmt = RouteReturnStmt | RouteStatusStmt | RouteValidateStmt | RouteFileStmt;

export interface RouteReturnStmt {
  kind: 'return';
  expr: LangRef;
}

export interface RouteStatusStmt {
  kind: 'status';
  code: number;
}

export interface RouteValidateRule {
  field: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  min?: number;
  max?: number;
}

export interface RouteValidateStmt {
  kind: 'validate';
  rules: RouteValidateRule[];
}

export interface RouteFileStmt {
  kind: 'file';
  accept: string[];
  maxSizeBytes: number;
  field: string;
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
  params: Expr[];
}

export type LangRef = LangRefPyJs | LangRefSql;

// english: Minimalist expressions for callSuffix arguments
// french:  Expressions minimalistes pour arguments de callSuffix
export type Expr = Literal | { kind: 'identifier'; name: string };

// english: ----- root file -----
// french:  ----- fichier racine -----

export type Section =
  | ConfigSection
  | StateSection
  | ComponentsSection
  | MiddlewareSection
  | WsRoutesSection
  | EnvSection
  | HtmlSection
  | CssSection
  | StyleSection
  | FfiSection
  | PySection
  | JsSection
  | RouteSection
  | ImportsSection
  | TestSection
  | DbSection;

export interface TestRequestStep {
  kind: 'request';
  variable: string;
  method: HttpMethod;
  path: string;
  body?: string; // JSON string
}

export interface TestAssertStep {
  kind: 'assert';
  expression: string;
}

export type TestStep = TestRequestStep | TestAssertStep;
export interface TestCase { name: string; steps: TestStep[]; pos?: Position; }
export interface TestSection { kind: 'test'; cases: TestCase[]; }
export interface ColumnDef {
  name: string;
  type: string; // 'integer', 'string', 'datetime', etc.
  primary?: boolean;
  autoincrement?: boolean;
  unique?: boolean;
  required?: boolean;
  default?: string; // 'now', or a literal
  maxLength?: number;
  foreign?: string; // 'table.column'
}

export interface TableDef {
  name: string;
  columns: ColumnDef[];
}

export interface DbSection { kind: 'db'; tables: TableDef[] }
export interface UniFile {
  type: 'app' | 'module';
  name: string;
  version: string;
  config: ConfigSection | null;
  sections: Section[];
  pos?: Position;
  filePath?: string;
}

// english: ----- code generation IR -----
// french:  ----- IR de génération -----

export interface FrontendPlaceholder {
  id: string;
  ref: LangRef;
  label?: string;
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
  validators: RouteValidateRule[];
  fileUpload?: {
    accept: string[];
    maxSizeBytes: number;
    field: string;
  };
  status?: number;
}

export interface BackendIR {
  routes: BackendRouteIR[];
  wsRoutes: WsRouteDef[];
  middleware: {
    auth: MiddlewareAuthConfig;
    cors: MiddlewareCorsConfig;
    rateLimit: MiddlewareRateLimitConfig;
  };
  // environment variable definitions from `env` section
  env?: EnvVarDef[];
  dbSchema?: DbSection;
}

export interface AssetsIR {
  clientEntry: string;
}

export interface PyBinding {
  name: string;
  kind: 'literal' | 'sql';
  value: Literal | string;
}

export interface CompilationIR {
  frontend: FrontendIR;
  backend: BackendIR;
  assets: AssetsIR;
  state: StateEntry[];
  pyBindings: PyBinding[];
  pySource: string;
  ffiSource: string;
}
