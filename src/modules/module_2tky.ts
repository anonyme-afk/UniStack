export interface Position {
    line: number;
    col: number;
}
export type Literal = {
    kind: 'string';
    value: string;
} | {
    kind: 'number';
    value: number;
} | {
    kind: 'boolean';
    value: boolean;
};
export interface ConfigEntry {
    key: string;
    value: Literal;
    pos?: Position;
}
export interface ConfigSection {
    kind: 'config';
    entries: ConfigEntry[];
}
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
export interface CssSection {
    kind: 'css';
    chunks: string[];
}
export interface StyleSection {
    kind: 'style';
    lines: string[];
}
export interface FfiSection {
    kind: 'ffi';
    lines: string[];
}
export interface PyChunk {
    kind: 'pyChunk';
    code: string;
}
export interface PySection {
    kind: 'py';
    chunks: PyChunk[];
}
export interface JsChunk {
    kind: 'jsChunk';
    code: string;
}
export interface JsSection {
    kind: 'js';
    chunks: JsChunk[];
}
export interface ImportEntry {
    path: string;
    names?: string[];
    alias?: string;
}
export interface ImportsSection {
    kind: 'imports';
    entries: ImportEntry[];
}
export interface ComponentDef {
    name: string;
    params: string[];
    template: string;
}
export interface ComponentsSection {
    kind: 'components';
    components: ComponentDef[];
}
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
export interface StateEntry {
    key: string;
    expr: string;
}
export interface StateSection {
    kind: 'state';
    entries: StateEntry[];
}
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
export type Expr = Literal | {
    kind: 'identifier';
    name: string;
};
export type Section = ConfigSection | StateSection | ComponentsSection | MiddlewareSection | WsRoutesSection | EnvSection | HtmlSection | CssSection | StyleSection | FfiSection | PySection | JsSection | RouteSection | ImportsSection | TestSection | DbSection;
export interface TestRequestStep {
    kind: 'request';
    variable: string;
    method: HttpMethod;
    path: string;
    body?: string;
}
export interface TestAssertStep {
    kind: 'assert';
    expression: string;
}
export type TestStep = TestRequestStep | TestAssertStep;
export interface TestCase {
    name: string;
    steps: TestStep[];
    pos?: Position;
}
export interface TestSection {
    kind: 'test';
    cases: TestCase[];
}
export interface ColumnDef {
    name: string;
    type: string;
    primary?: boolean;
    autoincrement?: boolean;
    unique?: boolean;
    required?: boolean;
    default?: string;
    maxLength?: number;
    foreign?: string;
}
export interface TableDef {
    name: string;
    columns: ColumnDef[];
}
export interface DbSection {
    kind: 'db';
    tables: TableDef[];
}
export interface UniFile {
    type: 'app' | 'module';
    name: string;
    version: string;
    config: ConfigSection | null;
    sections: Section[];
    pos?: Position;
    filePath?: string;
}
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
