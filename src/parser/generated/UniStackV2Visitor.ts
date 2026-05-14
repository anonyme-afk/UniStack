// @ts-nocheck
// Generated from src/lang/UniStackV2.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor.js";

import { FileContext } from "./UniStackV2Parser";
import { FileBodyContext } from "./UniStackV2Parser";
import { FileSectionContext } from "./UniStackV2Parser";
import { DecoratorSectionContext } from "./UniStackV2Parser";
import { DecoratorListContext } from "./UniStackV2Parser";
import { DecoratorContext } from "./UniStackV2Parser";
import { DecoratorArgsContext } from "./UniStackV2Parser";
import { DecoratorArgContext } from "./UniStackV2Parser";
import { DecoratorValueContext } from "./UniStackV2Parser";
import { StyleSectionContext } from "./UniStackV2Parser";
import { StyleLineContext } from "./UniStackV2Parser";
import { ImportsSectionContext } from "./UniStackV2Parser";
import { ImportListContext } from "./UniStackV2Parser";
import { ImportItemContext } from "./UniStackV2Parser";
import { ImportAliasContext } from "./UniStackV2Parser";
import { ConfigSectionContext } from "./UniStackV2Parser";
import { ConfigEntryListContext } from "./UniStackV2Parser";
import { ConfigEntryContext } from "./UniStackV2Parser";
import { ConfigValueContext } from "./UniStackV2Parser";
import { HtmlSectionContext } from "./UniStackV2Parser";
import { HtmlBlockContext } from "./UniStackV2Parser";
import { HtmlNodeContext } from "./UniStackV2Parser";
import { HtmlTextContext } from "./UniStackV2Parser";
import { HtmlExprContext } from "./UniStackV2Parser";
import { HtmlConditionalContext } from "./UniStackV2Parser";
import { ConditionContext } from "./UniStackV2Parser";
import { CssSectionContext } from "./UniStackV2Parser";
import { CssChunkContext } from "./UniStackV2Parser";
import { PySectionContext } from "./UniStackV2Parser";
import { PyFunctionContext } from "./UniStackV2Parser";
import { PyDecoratorContext } from "./UniStackV2Parser";
import { GenericParamsContext } from "./UniStackV2Parser";
import { PyParamsContext } from "./UniStackV2Parser";
import { PyParamContext } from "./UniStackV2Parser";
import { TypeAnnotationContext } from "./UniStackV2Parser";
import { ReturnTypeContext } from "./UniStackV2Parser";
import { PyBodyContext } from "./UniStackV2Parser";
import { JsSectionContext } from "./UniStackV2Parser";
import { JsFunctionContext } from "./UniStackV2Parser";
import { JsDecoratorContext } from "./UniStackV2Parser";
import { AsyncKeywordContext } from "./UniStackV2Parser";
import { JsParamsContext } from "./UniStackV2Parser";
import { JsParamContext } from "./UniStackV2Parser";
import { JsBodyContext } from "./UniStackV2Parser";
import { RoutesSectionContext } from "./UniStackV2Parser";
import { RouteContext } from "./UniStackV2Parser";
import { HttpMethodContext } from "./UniStackV2Parser";
import { HandlerContext } from "./UniStackV2Parser";
import { RouteBodyContext } from "./UniStackV2Parser";
import { RouteStatementContext } from "./UniStackV2Parser";
import { ErrorHandlerContext } from "./UniStackV2Parser";
import { ErrorBodyContext } from "./UniStackV2Parser";
import { FunctionCallContext } from "./UniStackV2Parser";
import { FunctionArgsContext } from "./UniStackV2Parser";
import { FunctionArgContext } from "./UniStackV2Parser";
import { DatasetOpContext } from "./UniStackV2Parser";
import { JsonResponseContext } from "./UniStackV2Parser";
import { JsonPairsContext } from "./UniStackV2Parser";
import { JsonPairContext } from "./UniStackV2Parser";
import { JsonValueContext } from "./UniStackV2Parser";
import { JsonArrayContext } from "./UniStackV2Parser";
import { JsonObjectContext } from "./UniStackV2Parser";
import { LangRefContext } from "./UniStackV2Parser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `UniStackV2Parser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface UniStackV2Visitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `UniStackV2Parser.file`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFile?: (ctx: FileContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.fileBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFileBody?: (ctx: FileBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.fileSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFileSection?: (ctx: FileSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.decoratorSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorSection?: (ctx: DecoratorSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.decoratorList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorList?: (ctx: DecoratorListContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.decorator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecorator?: (ctx: DecoratorContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.decoratorArgs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorArgs?: (ctx: DecoratorArgsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.decoratorArg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorArg?: (ctx: DecoratorArgContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.decoratorValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecoratorValue?: (ctx: DecoratorValueContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.styleSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStyleSection?: (ctx: StyleSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.styleLine`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStyleLine?: (ctx: StyleLineContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.importsSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportsSection?: (ctx: ImportsSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.importList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportList?: (ctx: ImportListContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.importItem`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportItem?: (ctx: ImportItemContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.importAlias`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportAlias?: (ctx: ImportAliasContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.configSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConfigSection?: (ctx: ConfigSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.configEntryList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConfigEntryList?: (ctx: ConfigEntryListContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.configEntry`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConfigEntry?: (ctx: ConfigEntryContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.configValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConfigValue?: (ctx: ConfigValueContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.htmlSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlSection?: (ctx: HtmlSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.htmlBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlBlock?: (ctx: HtmlBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.htmlNode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlNode?: (ctx: HtmlNodeContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.htmlText`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlText?: (ctx: HtmlTextContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.htmlExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlExpr?: (ctx: HtmlExprContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.htmlConditional`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHtmlConditional?: (ctx: HtmlConditionalContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.condition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCondition?: (ctx: ConditionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.cssSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCssSection?: (ctx: CssSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.cssChunk`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCssChunk?: (ctx: CssChunkContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.pySection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPySection?: (ctx: PySectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.pyFunction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyFunction?: (ctx: PyFunctionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.pyDecorator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyDecorator?: (ctx: PyDecoratorContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.genericParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericParams?: (ctx: GenericParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.pyParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyParams?: (ctx: PyParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.pyParam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyParam?: (ctx: PyParamContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.typeAnnotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeAnnotation?: (ctx: TypeAnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.returnType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnType?: (ctx: ReturnTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.pyBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyBody?: (ctx: PyBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsSection?: (ctx: JsSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsFunction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsFunction?: (ctx: JsFunctionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsDecorator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsDecorator?: (ctx: JsDecoratorContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.asyncKeyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAsyncKeyword?: (ctx: AsyncKeywordContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsParams?: (ctx: JsParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsParam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsParam?: (ctx: JsParamContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsBody?: (ctx: JsBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.routesSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRoutesSection?: (ctx: RoutesSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.route`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRoute?: (ctx: RouteContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.httpMethod`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHttpMethod?: (ctx: HttpMethodContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.handler`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHandler?: (ctx: HandlerContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.routeBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRouteBody?: (ctx: RouteBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.routeStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRouteStatement?: (ctx: RouteStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.errorHandler`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitErrorHandler?: (ctx: ErrorHandlerContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.errorBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitErrorBody?: (ctx: ErrorBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.functionArgs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionArgs?: (ctx: FunctionArgsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.functionArg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionArg?: (ctx: FunctionArgContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.datasetOp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatasetOp?: (ctx: DatasetOpContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsonResponse`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonResponse?: (ctx: JsonResponseContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsonPairs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonPairs?: (ctx: JsonPairsContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsonPair`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonPair?: (ctx: JsonPairContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsonValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonValue?: (ctx: JsonValueContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsonArray`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonArray?: (ctx: JsonArrayContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.jsonObject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonObject?: (ctx: JsonObjectContext) => Result;

	/**
	 * Visit a parse tree produced by `UniStackV2Parser.langRef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLangRef?: (ctx: LangRefContext) => Result;
}

