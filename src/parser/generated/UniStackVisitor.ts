// @ts-nocheck
// Generated from src/lang/UniStack.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor.js";

import { FileContext } from "./UniStackParser";
import { FileBodyContext } from "./UniStackParser";
import { FileSectionContext } from "./UniStackParser";
import { DecoratorSectionContext } from "./UniStackParser";
import { DecoratorListContext } from "./UniStackParser";
import { DecoratorContext } from "./UniStackParser";
import { DecoratorArgsContext } from "./UniStackParser";
import { DecoratorArgContext } from "./UniStackParser";
import { DecoratorValueContext } from "./UniStackParser";
import { StyleSectionContext } from "./UniStackParser";
import { StyleLineContext } from "./UniStackParser";
import { ImportsSectionContext } from "./UniStackParser";
import { ImportListContext } from "./UniStackParser";
import { ImportItemContext } from "./UniStackParser";
import { ImportAliasContext } from "./UniStackParser";
import { ConfigSectionContext } from "./UniStackParser";
import { ConfigEntryListContext } from "./UniStackParser";
import { ConfigEntryContext } from "./UniStackParser";
import { ConfigValueContext } from "./UniStackParser";
import { HtmlSectionContext } from "./UniStackParser";
import { HtmlBlockContext } from "./UniStackParser";
import { HtmlNodeContext } from "./UniStackParser";
import { HtmlTextContext } from "./UniStackParser";
import { HtmlExprContext } from "./UniStackParser";
import { HtmlConditionalContext } from "./UniStackParser";
import { ConditionContext } from "./UniStackParser";
import { CssSectionContext } from "./UniStackParser";
import { CssChunkContext } from "./UniStackParser";
import { PySectionContext } from "./UniStackParser";
import { PyFunctionContext } from "./UniStackParser";
import { PyDecoratorContext } from "./UniStackParser";
import { GenericParamsContext } from "./UniStackParser";
import { PyParamsContext } from "./UniStackParser";
import { PyParamContext } from "./UniStackParser";
import { TypeAnnotationContext } from "./UniStackParser";
import { ReturnTypeContext } from "./UniStackParser";
import { PyBodyContext } from "./UniStackParser";
import { JsSectionContext } from "./UniStackParser";
import { JsFunctionContext } from "./UniStackParser";
import { JsDecoratorContext } from "./UniStackParser";
import { AsyncKeywordContext } from "./UniStackParser";
import { JsParamsContext } from "./UniStackParser";
import { JsParamContext } from "./UniStackParser";
import { JsBodyContext } from "./UniStackParser";
import { RoutesSectionContext } from "./UniStackParser";
import { RouteContext } from "./UniStackParser";
import { HttpMethodContext } from "./UniStackParser";
import { HandlerContext } from "./UniStackParser";
import { RouteBodyContext } from "./UniStackParser";
import { RouteStatementContext } from "./UniStackParser";
import { ErrorHandlerContext } from "./UniStackParser";
import { ErrorBodyContext } from "./UniStackParser";
import { FunctionCallContext } from "./UniStackParser";
import { FunctionArgsContext } from "./UniStackParser";
import { FunctionArgContext } from "./UniStackParser";
import { DatasetOpContext } from "./UniStackParser";
import { JsonResponseContext } from "./UniStackParser";
import { JsonPairsContext } from "./UniStackParser";
import { JsonPairContext } from "./UniStackParser";
import { JsonValueContext } from "./UniStackParser";
import { JsonArrayContext } from "./UniStackParser";
import { JsonObjectContext } from "./UniStackParser";
import { LangRefContext } from "./UniStackParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `UniStackParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface UniStackVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `UniStackParser.file`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFile?: (ctx: FileContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.fileBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFileBody?: (ctx: FileBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.fileSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFileSection?: (ctx: FileSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.decoratorSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorSection?: (ctx: DecoratorSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.decoratorList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorList?: (ctx: DecoratorListContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.decorator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecorator?: (ctx: DecoratorContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.decoratorArgs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorArgs?: (ctx: DecoratorArgsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.decoratorArg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorArg?: (ctx: DecoratorArgContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.decoratorValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorValue?: (ctx: DecoratorValueContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.styleSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStyleSection?: (ctx: StyleSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.styleLine`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStyleLine?: (ctx: StyleLineContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.importsSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportsSection?: (ctx: ImportsSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.importList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportList?: (ctx: ImportListContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.importItem`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportItem?: (ctx: ImportItemContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.importAlias`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportAlias?: (ctx: ImportAliasContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.configSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConfigSection?: (ctx: ConfigSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.configEntryList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConfigEntryList?: (ctx: ConfigEntryListContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.configEntry`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConfigEntry?: (ctx: ConfigEntryContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.configValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConfigValue?: (ctx: ConfigValueContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.htmlSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlSection?: (ctx: HtmlSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.htmlBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlBlock?: (ctx: HtmlBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.htmlNode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlNode?: (ctx: HtmlNodeContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.htmlText`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlText?: (ctx: HtmlTextContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.htmlExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlExpr?: (ctx: HtmlExprContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.htmlConditional`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlConditional?: (ctx: HtmlConditionalContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.condition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCondition?: (ctx: ConditionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.cssSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCssSection?: (ctx: CssSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.cssChunk`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCssChunk?: (ctx: CssChunkContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.pySection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPySection?: (ctx: PySectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.pyFunction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyFunction?: (ctx: PyFunctionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.pyDecorator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyDecorator?: (ctx: PyDecoratorContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.genericParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericParams?: (ctx: GenericParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.pyParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyParams?: (ctx: PyParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.pyParam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyParam?: (ctx: PyParamContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.typeAnnotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeAnnotation?: (ctx: TypeAnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.returnType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnType?: (ctx: ReturnTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.pyBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyBody?: (ctx: PyBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsSection?: (ctx: JsSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsFunction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsFunction?: (ctx: JsFunctionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsDecorator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsDecorator?: (ctx: JsDecoratorContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.asyncKeyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAsyncKeyword?: (ctx: AsyncKeywordContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsParams?: (ctx: JsParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsParam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsParam?: (ctx: JsParamContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsBody?: (ctx: JsBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.routesSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRoutesSection?: (ctx: RoutesSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.route`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRoute?: (ctx: RouteContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.httpMethod`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHttpMethod?: (ctx: HttpMethodContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.handler`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHandler?: (ctx: HandlerContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.routeBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRouteBody?: (ctx: RouteBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.routeStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRouteStatement?: (ctx: RouteStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.errorHandler`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitErrorHandler?: (ctx: ErrorHandlerContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.errorBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitErrorBody?: (ctx: ErrorBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.functionArgs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionArgs?: (ctx: FunctionArgsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.functionArg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionArg?: (ctx: FunctionArgContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.datasetOp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatasetOp?: (ctx: DatasetOpContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsonResponse`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonResponse?: (ctx: JsonResponseContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsonPairs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonPairs?: (ctx: JsonPairsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsonPair`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonPair?: (ctx: JsonPairContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsonValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonValue?: (ctx: JsonValueContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsonArray`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonArray?: (ctx: JsonArrayContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.jsonObject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonObject?: (ctx: JsonObjectContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackParser.langRef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLangRef?: (ctx: LangRefContext) => Result;
}

