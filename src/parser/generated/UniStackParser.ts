// @ts-nocheck
// Generated from src/lang/UniStack.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN.js";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer.js";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException.js";
import { NotNull } from "antlr4ts/Decorators.js";
import { NoViableAltException } from "antlr4ts/NoViableAltException.js";
import { Override } from "antlr4ts/Decorators.js";
import { Parser } from "antlr4ts/Parser.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator.js";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener.js";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor.js";
import { RecognitionException } from "antlr4ts/RecognitionException.js";
import { RuleContext } from "antlr4ts/RuleContext.js";
//import { RuleVersion } from "antlr4ts/RuleVersion.js";
import { TerminalNode } from "antlr4ts/tree/TerminalNode.js";
import { Token } from "antlr4ts/Token.js";
import { TokenStream } from "antlr4ts/TokenStream.js";
import { Vocabulary } from "antlr4ts/Vocabulary.js";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl.js";

import * as Utils from "antlr4ts/misc/Utils.js";

import { UniStackVisitor } from "./UniStackVisitor";


export class UniStackParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly T__19 = 20;
	public static readonly T__20 = 21;
	public static readonly T__21 = 22;
	public static readonly T__22 = 23;
	public static readonly T__23 = 24;
	public static readonly T__24 = 25;
	public static readonly T__25 = 26;
	public static readonly T__26 = 27;
	public static readonly T__27 = 28;
	public static readonly T__28 = 29;
	public static readonly T__29 = 30;
	public static readonly T__30 = 31;
	public static readonly T__31 = 32;
	public static readonly T__32 = 33;
	public static readonly T__33 = 34;
	public static readonly T__34 = 35;
	public static readonly T__35 = 36;
	public static readonly T__36 = 37;
	public static readonly T__37 = 38;
	public static readonly T__38 = 39;
	public static readonly T__39 = 40;
	public static readonly T__40 = 41;
	public static readonly T__41 = 42;
	public static readonly T__42 = 43;
	public static readonly NULL = 44;
	public static readonly STRING = 45;
	public static readonly VERSION = 46;
	public static readonly NUMBER = 47;
	public static readonly BOOLEAN = 48;
	public static readonly IDENT = 49;
	public static readonly DIGIT = 50;
	public static readonly LBRACE = 51;
	public static readonly RBRACE = 52;
	public static readonly LPAREN = 53;
	public static readonly RPAREN = 54;
	public static readonly COMMA = 55;
	public static readonly SEMI = 56;
	public static readonly HTML_TEXT = 57;
	public static readonly CSS_TEXT = 58;
	public static readonly PY_TEXT = 59;
	public static readonly JS_TEXT = 60;
	public static readonly ERROR_TEXT = 61;
	public static readonly STYLE_TEXT = 62;
	public static readonly WHITESPACE = 63;
	public static readonly COMMENT = 64;
	public static readonly RULE_file = 0;
	public static readonly RULE_fileBody = 1;
	public static readonly RULE_fileSection = 2;
	public static readonly RULE_decoratorSection = 3;
	public static readonly RULE_decoratorList = 4;
	public static readonly RULE_decorator = 5;
	public static readonly RULE_decoratorArgs = 6;
	public static readonly RULE_decoratorArg = 7;
	public static readonly RULE_decoratorValue = 8;
	public static readonly RULE_styleSection = 9;
	public static readonly RULE_styleLine = 10;
	public static readonly RULE_importsSection = 11;
	public static readonly RULE_importList = 12;
	public static readonly RULE_importItem = 13;
	public static readonly RULE_importAlias = 14;
	public static readonly RULE_configSection = 15;
	public static readonly RULE_configEntryList = 16;
	public static readonly RULE_configEntry = 17;
	public static readonly RULE_configValue = 18;
	public static readonly RULE_htmlSection = 19;
	public static readonly RULE_htmlBlock = 20;
	public static readonly RULE_htmlNode = 21;
	public static readonly RULE_htmlText = 22;
	public static readonly RULE_htmlExpr = 23;
	public static readonly RULE_htmlConditional = 24;
	public static readonly RULE_condition = 25;
	public static readonly RULE_cssSection = 26;
	public static readonly RULE_cssChunk = 27;
	public static readonly RULE_pySection = 28;
	public static readonly RULE_pyFunction = 29;
	public static readonly RULE_pyDecorator = 30;
	public static readonly RULE_genericParams = 31;
	public static readonly RULE_pyParams = 32;
	public static readonly RULE_pyParam = 33;
	public static readonly RULE_typeAnnotation = 34;
	public static readonly RULE_returnType = 35;
	public static readonly RULE_pyBody = 36;
	public static readonly RULE_jsSection = 37;
	public static readonly RULE_jsFunction = 38;
	public static readonly RULE_jsDecorator = 39;
	public static readonly RULE_asyncKeyword = 40;
	public static readonly RULE_jsParams = 41;
	public static readonly RULE_jsParam = 42;
	public static readonly RULE_jsBody = 43;
	public static readonly RULE_routesSection = 44;
	public static readonly RULE_route = 45;
	public static readonly RULE_httpMethod = 46;
	public static readonly RULE_handler = 47;
	public static readonly RULE_routeBody = 48;
	public static readonly RULE_routeStatement = 49;
	public static readonly RULE_errorHandler = 50;
	public static readonly RULE_errorBody = 51;
	public static readonly RULE_functionCall = 52;
	public static readonly RULE_functionArgs = 53;
	public static readonly RULE_functionArg = 54;
	public static readonly RULE_datasetOp = 55;
	public static readonly RULE_jsonResponse = 56;
	public static readonly RULE_jsonPairs = 57;
	public static readonly RULE_jsonPair = 58;
	public static readonly RULE_jsonValue = 59;
	public static readonly RULE_jsonArray = 60;
	public static readonly RULE_jsonObject = 61;
	public static readonly RULE_langRef = 62;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"file", "fileBody", "fileSection", "decoratorSection", "decoratorList", 
		"decorator", "decoratorArgs", "decoratorArg", "decoratorValue", "styleSection", 
		"styleLine", "importsSection", "importList", "importItem", "importAlias", 
		"configSection", "configEntryList", "configEntry", "configValue", "htmlSection", 
		"htmlBlock", "htmlNode", "htmlText", "htmlExpr", "htmlConditional", "condition", 
		"cssSection", "cssChunk", "pySection", "pyFunction", "pyDecorator", "genericParams", 
		"pyParams", "pyParam", "typeAnnotation", "returnType", "pyBody", "jsSection", 
		"jsFunction", "jsDecorator", "asyncKeyword", "jsParams", "jsParam", "jsBody", 
		"routesSection", "route", "httpMethod", "handler", "routeBody", "routeStatement", 
		"errorHandler", "errorBody", "functionCall", "functionArgs", "functionArg", 
		"datasetOp", "jsonResponse", "jsonPairs", "jsonPair", "jsonValue", "jsonArray", 
		"jsonObject", "langRef",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'unistack'", "'app'", "'version'", "'decorators'", "':'", 
		"'@'", "'='", "'style'", "'imports'", "'as'", "'config'", "'html-ui'", 
		"'{if'", "'{else}'", "'{end}'", "'=='", "'!='", "'<'", "'>'", "'css'", 
		"'py'", "'def'", "'['", "']'", "'|'", "'Optional'", "'->'", "'js'", "'function'", 
		"'async'", "'routes'", "'GET'", "'POST'", "'PUT'", "'DELETE'", "'PATCH'", 
		"'OPTIONS'", "'HEAD'", "'catch'", "'DataSet'", "'.'", "'json'", "'error'", 
		"'null'", undefined, undefined, undefined, undefined, undefined, undefined, 
		"'{'", "'}'", "'('", "')'", "','", "';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "NULL", "STRING", "VERSION", "NUMBER", "BOOLEAN", 
		"IDENT", "DIGIT", "LBRACE", "RBRACE", "LPAREN", "RPAREN", "COMMA", "SEMI", 
		"HTML_TEXT", "CSS_TEXT", "PY_TEXT", "JS_TEXT", "ERROR_TEXT", "STYLE_TEXT", 
		"WHITESPACE", "COMMENT",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(UniStackParser._LITERAL_NAMES, UniStackParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return UniStackParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "UniStack.g4"; }

	// @Override
	public get ruleNames(): string[] { return UniStackParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return UniStackParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(UniStackParser._ATN, this);
	}
	// @RuleVersion(0)
	public file(): FileContext {
		let _localctx: FileContext = new FileContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, UniStackParser.RULE_file);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 126;
			this.match(UniStackParser.T__0);
			this.state = 127;
			this.match(UniStackParser.T__1);
			this.state = 128;
			this.match(UniStackParser.STRING);
			this.state = 129;
			this.match(UniStackParser.T__2);
			this.state = 130;
			this.match(UniStackParser.VERSION);
			this.state = 131;
			this.match(UniStackParser.LBRACE);
			this.state = 132;
			this.fileBody();
			this.state = 133;
			this.match(UniStackParser.RBRACE);
			this.state = 134;
			this.match(UniStackParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public fileBody(): FileBodyContext {
		let _localctx: FileBodyContext = new FileBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, UniStackParser.RULE_fileBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 139;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << UniStackParser.T__3) | (1 << UniStackParser.T__7) | (1 << UniStackParser.T__8) | (1 << UniStackParser.T__10) | (1 << UniStackParser.T__11) | (1 << UniStackParser.T__19) | (1 << UniStackParser.T__20) | (1 << UniStackParser.T__27) | (1 << UniStackParser.T__30))) !== 0)) {
				{
				{
				this.state = 136;
				this.fileSection();
				}
				}
				this.state = 141;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public fileSection(): FileSectionContext {
		let _localctx: FileSectionContext = new FileSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, UniStackParser.RULE_fileSection);
		try {
			this.state = 151;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case UniStackParser.T__8:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 142;
				this.importsSection();
				}
				break;
			case UniStackParser.T__10:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 143;
				this.configSection();
				}
				break;
			case UniStackParser.T__11:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 144;
				this.htmlSection();
				}
				break;
			case UniStackParser.T__19:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 145;
				this.cssSection();
				}
				break;
			case UniStackParser.T__7:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 146;
				this.styleSection();
				}
				break;
			case UniStackParser.T__3:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 147;
				this.decoratorSection();
				}
				break;
			case UniStackParser.T__20:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 148;
				this.pySection();
				}
				break;
			case UniStackParser.T__27:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 149;
				this.jsSection();
				}
				break;
			case UniStackParser.T__30:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 150;
				this.routesSection();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decoratorSection(): DecoratorSectionContext {
		let _localctx: DecoratorSectionContext = new DecoratorSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, UniStackParser.RULE_decoratorSection);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 153;
			this.match(UniStackParser.T__3);
			this.state = 154;
			this.match(UniStackParser.T__4);
			this.state = 155;
			this.decoratorList();
			this.state = 156;
			this.match(UniStackParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decoratorList(): DecoratorListContext {
		let _localctx: DecoratorListContext = new DecoratorListContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, UniStackParser.RULE_decoratorList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 158;
			this.decorator();
			this.state = 163;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 159;
				this.match(UniStackParser.COMMA);
				this.state = 160;
				this.decorator();
				}
				}
				this.state = 165;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decorator(): DecoratorContext {
		let _localctx: DecoratorContext = new DecoratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, UniStackParser.RULE_decorator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 166;
			this.match(UniStackParser.T__5);
			this.state = 167;
			this.match(UniStackParser.IDENT);
			this.state = 169;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.LPAREN) {
				{
				this.state = 168;
				this.decoratorArgs();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decoratorArgs(): DecoratorArgsContext {
		let _localctx: DecoratorArgsContext = new DecoratorArgsContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, UniStackParser.RULE_decoratorArgs);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 171;
			this.match(UniStackParser.LPAREN);
			this.state = 172;
			this.decoratorArg();
			this.state = 177;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 173;
				this.match(UniStackParser.COMMA);
				this.state = 174;
				this.decoratorArg();
				}
				}
				this.state = 179;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 180;
			this.match(UniStackParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decoratorArg(): DecoratorArgContext {
		let _localctx: DecoratorArgContext = new DecoratorArgContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, UniStackParser.RULE_decoratorArg);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 182;
			this.match(UniStackParser.IDENT);
			this.state = 185;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__6) {
				{
				this.state = 183;
				this.match(UniStackParser.T__6);
				this.state = 184;
				this.decoratorValue();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public decoratorValue(): DecoratorValueContext {
		let _localctx: DecoratorValueContext = new DecoratorValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, UniStackParser.RULE_decoratorValue);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 187;
			_la = this._input.LA(1);
			if (!(((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (UniStackParser.STRING - 45)) | (1 << (UniStackParser.NUMBER - 45)) | (1 << (UniStackParser.BOOLEAN - 45)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public styleSection(): StyleSectionContext {
		let _localctx: StyleSectionContext = new StyleSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, UniStackParser.RULE_styleSection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 189;
			this.match(UniStackParser.T__7);
			this.state = 190;
			this.match(UniStackParser.T__4);
			this.state = 192;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 191;
				this.styleLine();
				}
				}
				this.state = 194;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.STYLE_TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public styleLine(): StyleLineContext {
		let _localctx: StyleLineContext = new StyleLineContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, UniStackParser.RULE_styleLine);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 196;
			this.match(UniStackParser.STYLE_TEXT);
			this.state = 197;
			this.match(UniStackParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public importsSection(): ImportsSectionContext {
		let _localctx: ImportsSectionContext = new ImportsSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, UniStackParser.RULE_importsSection);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 199;
			this.match(UniStackParser.T__8);
			this.state = 200;
			this.match(UniStackParser.T__4);
			this.state = 201;
			this.importList();
			this.state = 202;
			this.match(UniStackParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public importList(): ImportListContext {
		let _localctx: ImportListContext = new ImportListContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, UniStackParser.RULE_importList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 204;
			this.importItem();
			this.state = 209;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 205;
				this.match(UniStackParser.COMMA);
				this.state = 206;
				this.importItem();
				}
				}
				this.state = 211;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public importItem(): ImportItemContext {
		let _localctx: ImportItemContext = new ImportItemContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, UniStackParser.RULE_importItem);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 212;
			this.match(UniStackParser.STRING);
			this.state = 214;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__9) {
				{
				this.state = 213;
				this.importAlias();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public importAlias(): ImportAliasContext {
		let _localctx: ImportAliasContext = new ImportAliasContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, UniStackParser.RULE_importAlias);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 216;
			this.match(UniStackParser.T__9);
			this.state = 217;
			this.match(UniStackParser.IDENT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public configSection(): ConfigSectionContext {
		let _localctx: ConfigSectionContext = new ConfigSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, UniStackParser.RULE_configSection);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 219;
			this.match(UniStackParser.T__10);
			this.state = 220;
			this.match(UniStackParser.T__4);
			this.state = 221;
			this.configEntryList();
			this.state = 222;
			this.match(UniStackParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public configEntryList(): ConfigEntryListContext {
		let _localctx: ConfigEntryListContext = new ConfigEntryListContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, UniStackParser.RULE_configEntryList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 224;
			this.configEntry();
			this.state = 229;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 225;
				this.match(UniStackParser.COMMA);
				this.state = 226;
				this.configEntry();
				}
				}
				this.state = 231;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public configEntry(): ConfigEntryContext {
		let _localctx: ConfigEntryContext = new ConfigEntryContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, UniStackParser.RULE_configEntry);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 232;
			this.match(UniStackParser.IDENT);
			this.state = 233;
			this.match(UniStackParser.T__6);
			this.state = 234;
			this.configValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public configValue(): ConfigValueContext {
		let _localctx: ConfigValueContext = new ConfigValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, UniStackParser.RULE_configValue);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 236;
			_la = this._input.LA(1);
			if (!(((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (UniStackParser.STRING - 45)) | (1 << (UniStackParser.NUMBER - 45)) | (1 << (UniStackParser.BOOLEAN - 45)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public htmlSection(): HtmlSectionContext {
		let _localctx: HtmlSectionContext = new HtmlSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, UniStackParser.RULE_htmlSection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 238;
			this.match(UniStackParser.T__11);
			this.state = 239;
			this.match(UniStackParser.T__4);
			this.state = 241;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 240;
				this.htmlBlock();
				}
				}
				this.state = 243;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.T__12 || _la === UniStackParser.LBRACE || _la === UniStackParser.HTML_TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public htmlBlock(): HtmlBlockContext {
		let _localctx: HtmlBlockContext = new HtmlBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, UniStackParser.RULE_htmlBlock);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 246;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 245;
				this.htmlNode();
				}
				}
				this.state = 248;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.T__12 || _la === UniStackParser.LBRACE || _la === UniStackParser.HTML_TEXT);
			this.state = 250;
			this.match(UniStackParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public htmlNode(): HtmlNodeContext {
		let _localctx: HtmlNodeContext = new HtmlNodeContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, UniStackParser.RULE_htmlNode);
		try {
			this.state = 255;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case UniStackParser.HTML_TEXT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 252;
				this.htmlText();
				}
				break;
			case UniStackParser.LBRACE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 253;
				this.htmlExpr();
				}
				break;
			case UniStackParser.T__12:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 254;
				this.htmlConditional();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public htmlText(): HtmlTextContext {
		let _localctx: HtmlTextContext = new HtmlTextContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, UniStackParser.RULE_htmlText);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 257;
			this.match(UniStackParser.HTML_TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public htmlExpr(): HtmlExprContext {
		let _localctx: HtmlExprContext = new HtmlExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, UniStackParser.RULE_htmlExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 259;
			this.match(UniStackParser.LBRACE);
			this.state = 260;
			this.langRef();
			this.state = 261;
			this.match(UniStackParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public htmlConditional(): HtmlConditionalContext {
		let _localctx: HtmlConditionalContext = new HtmlConditionalContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, UniStackParser.RULE_htmlConditional);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 263;
			this.match(UniStackParser.T__12);
			this.state = 264;
			this.condition();
			this.state = 265;
			this.match(UniStackParser.RBRACE);
			this.state = 267;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 266;
				this.htmlBlock();
				}
				}
				this.state = 269;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.T__12 || _la === UniStackParser.LBRACE || _la === UniStackParser.HTML_TEXT);
			this.state = 277;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__13) {
				{
				this.state = 271;
				this.match(UniStackParser.T__13);
				this.state = 273;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 272;
					this.htmlBlock();
					}
					}
					this.state = 275;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la === UniStackParser.T__12 || _la === UniStackParser.LBRACE || _la === UniStackParser.HTML_TEXT);
				}
			}

			this.state = 279;
			this.match(UniStackParser.T__14);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public condition(): ConditionContext {
		let _localctx: ConditionContext = new ConditionContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, UniStackParser.RULE_condition);
		try {
			this.state = 294;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 16, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 281;
				this.match(UniStackParser.IDENT);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 282;
				this.match(UniStackParser.IDENT);
				this.state = 283;
				this.match(UniStackParser.T__15);
				this.state = 284;
				this.match(UniStackParser.IDENT);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 285;
				this.match(UniStackParser.IDENT);
				this.state = 286;
				this.match(UniStackParser.T__16);
				this.state = 287;
				this.match(UniStackParser.IDENT);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 288;
				this.match(UniStackParser.IDENT);
				this.state = 289;
				this.match(UniStackParser.T__17);
				this.state = 290;
				this.match(UniStackParser.IDENT);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 291;
				this.match(UniStackParser.IDENT);
				this.state = 292;
				this.match(UniStackParser.T__18);
				this.state = 293;
				this.match(UniStackParser.IDENT);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public cssSection(): CssSectionContext {
		let _localctx: CssSectionContext = new CssSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, UniStackParser.RULE_cssSection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 296;
			this.match(UniStackParser.T__19);
			this.state = 297;
			this.match(UniStackParser.T__4);
			this.state = 299;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 298;
				this.cssChunk();
				}
				}
				this.state = 301;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.CSS_TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public cssChunk(): CssChunkContext {
		let _localctx: CssChunkContext = new CssChunkContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, UniStackParser.RULE_cssChunk);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 303;
			this.match(UniStackParser.CSS_TEXT);
			this.state = 304;
			this.match(UniStackParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pySection(): PySectionContext {
		let _localctx: PySectionContext = new PySectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, UniStackParser.RULE_pySection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 306;
			this.match(UniStackParser.T__20);
			this.state = 307;
			this.match(UniStackParser.T__4);
			this.state = 309;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 308;
				this.pyFunction();
				}
				}
				this.state = 311;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.T__5 || _la === UniStackParser.T__21);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pyFunction(): PyFunctionContext {
		let _localctx: PyFunctionContext = new PyFunctionContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, UniStackParser.RULE_pyFunction);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 316;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.T__5) {
				{
				{
				this.state = 313;
				this.pyDecorator();
				}
				}
				this.state = 318;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 319;
			this.match(UniStackParser.T__21);
			this.state = 320;
			this.match(UniStackParser.IDENT);
			this.state = 322;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__17) {
				{
				this.state = 321;
				this.genericParams();
				}
			}

			this.state = 324;
			this.match(UniStackParser.LPAREN);
			this.state = 325;
			this.pyParams();
			this.state = 326;
			this.match(UniStackParser.RPAREN);
			this.state = 328;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__26) {
				{
				this.state = 327;
				this.returnType();
				}
			}

			this.state = 330;
			this.match(UniStackParser.LBRACE);
			this.state = 331;
			this.pyBody();
			this.state = 332;
			this.match(UniStackParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pyDecorator(): PyDecoratorContext {
		let _localctx: PyDecoratorContext = new PyDecoratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, UniStackParser.RULE_pyDecorator);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 334;
			this.match(UniStackParser.T__5);
			this.state = 335;
			this.match(UniStackParser.IDENT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public genericParams(): GenericParamsContext {
		let _localctx: GenericParamsContext = new GenericParamsContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, UniStackParser.RULE_genericParams);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 337;
			this.match(UniStackParser.T__17);
			this.state = 338;
			this.match(UniStackParser.IDENT);
			this.state = 343;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 339;
				this.match(UniStackParser.COMMA);
				this.state = 340;
				this.match(UniStackParser.IDENT);
				}
				}
				this.state = 345;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 346;
			this.match(UniStackParser.T__18);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pyParams(): PyParamsContext {
		let _localctx: PyParamsContext = new PyParamsContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, UniStackParser.RULE_pyParams);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 348;
			this.pyParam();
			this.state = 353;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 349;
				this.match(UniStackParser.COMMA);
				this.state = 350;
				this.pyParam();
				}
				}
				this.state = 355;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pyParam(): PyParamContext {
		let _localctx: PyParamContext = new PyParamContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, UniStackParser.RULE_pyParam);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 356;
			this.match(UniStackParser.IDENT);
			this.state = 359;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__4) {
				{
				this.state = 357;
				this.match(UniStackParser.T__4);
				this.state = 358;
				this.typeAnnotation();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeAnnotation(): TypeAnnotationContext {
		let _localctx: TypeAnnotationContext = new TypeAnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, UniStackParser.RULE_typeAnnotation);
		try {
			this.state = 373;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 25, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 361;
				this.match(UniStackParser.IDENT);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 362;
				this.match(UniStackParser.IDENT);
				this.state = 363;
				this.match(UniStackParser.T__22);
				this.state = 364;
				this.match(UniStackParser.IDENT);
				this.state = 365;
				this.match(UniStackParser.T__23);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 366;
				this.match(UniStackParser.IDENT);
				this.state = 367;
				this.match(UniStackParser.T__24);
				this.state = 368;
				this.match(UniStackParser.IDENT);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 369;
				this.match(UniStackParser.T__25);
				this.state = 370;
				this.match(UniStackParser.T__22);
				this.state = 371;
				this.match(UniStackParser.IDENT);
				this.state = 372;
				this.match(UniStackParser.T__23);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public returnType(): ReturnTypeContext {
		let _localctx: ReturnTypeContext = new ReturnTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, UniStackParser.RULE_returnType);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 375;
			this.match(UniStackParser.T__26);
			this.state = 376;
			this.typeAnnotation();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pyBody(): PyBodyContext {
		let _localctx: PyBodyContext = new PyBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, UniStackParser.RULE_pyBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 379;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 378;
				this.match(UniStackParser.PY_TEXT);
				}
				}
				this.state = 381;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.PY_TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsSection(): JsSectionContext {
		let _localctx: JsSectionContext = new JsSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, UniStackParser.RULE_jsSection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 383;
			this.match(UniStackParser.T__27);
			this.state = 384;
			this.match(UniStackParser.T__4);
			this.state = 386;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 385;
				this.jsFunction();
				}
				}
				this.state = 388;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << UniStackParser.T__5) | (1 << UniStackParser.T__28) | (1 << UniStackParser.T__29))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsFunction(): JsFunctionContext {
		let _localctx: JsFunctionContext = new JsFunctionContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, UniStackParser.RULE_jsFunction);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 393;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.T__5) {
				{
				{
				this.state = 390;
				this.jsDecorator();
				}
				}
				this.state = 395;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 397;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__29) {
				{
				this.state = 396;
				this.asyncKeyword();
				}
			}

			this.state = 399;
			this.match(UniStackParser.T__28);
			this.state = 400;
			this.match(UniStackParser.IDENT);
			this.state = 402;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__17) {
				{
				this.state = 401;
				this.genericParams();
				}
			}

			this.state = 404;
			this.match(UniStackParser.LPAREN);
			this.state = 405;
			this.jsParams();
			this.state = 406;
			this.match(UniStackParser.RPAREN);
			this.state = 408;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__26) {
				{
				this.state = 407;
				this.returnType();
				}
			}

			this.state = 410;
			this.match(UniStackParser.LBRACE);
			this.state = 411;
			this.jsBody();
			this.state = 412;
			this.match(UniStackParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsDecorator(): JsDecoratorContext {
		let _localctx: JsDecoratorContext = new JsDecoratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, UniStackParser.RULE_jsDecorator);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 414;
			this.match(UniStackParser.T__5);
			this.state = 415;
			this.match(UniStackParser.IDENT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public asyncKeyword(): AsyncKeywordContext {
		let _localctx: AsyncKeywordContext = new AsyncKeywordContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, UniStackParser.RULE_asyncKeyword);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 417;
			this.match(UniStackParser.T__29);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsParams(): JsParamsContext {
		let _localctx: JsParamsContext = new JsParamsContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, UniStackParser.RULE_jsParams);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 419;
			this.jsParam();
			this.state = 424;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 420;
				this.match(UniStackParser.COMMA);
				this.state = 421;
				this.jsParam();
				}
				}
				this.state = 426;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsParam(): JsParamContext {
		let _localctx: JsParamContext = new JsParamContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, UniStackParser.RULE_jsParam);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 427;
			this.match(UniStackParser.IDENT);
			this.state = 430;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__4) {
				{
				this.state = 428;
				this.match(UniStackParser.T__4);
				this.state = 429;
				this.typeAnnotation();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsBody(): JsBodyContext {
		let _localctx: JsBodyContext = new JsBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, UniStackParser.RULE_jsBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 433;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 432;
				this.match(UniStackParser.JS_TEXT);
				}
				}
				this.state = 435;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.JS_TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public routesSection(): RoutesSectionContext {
		let _localctx: RoutesSectionContext = new RoutesSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, UniStackParser.RULE_routesSection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 437;
			this.match(UniStackParser.T__30);
			this.state = 438;
			this.match(UniStackParser.T__4);
			this.state = 440;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 439;
				this.route();
				}
				}
				this.state = 442;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (UniStackParser.T__31 - 32)) | (1 << (UniStackParser.T__32 - 32)) | (1 << (UniStackParser.T__33 - 32)) | (1 << (UniStackParser.T__34 - 32)) | (1 << (UniStackParser.T__35 - 32)) | (1 << (UniStackParser.T__36 - 32)) | (1 << (UniStackParser.T__37 - 32)))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public route(): RouteContext {
		let _localctx: RouteContext = new RouteContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, UniStackParser.RULE_route);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 444;
			this.httpMethod();
			this.state = 445;
			this.match(UniStackParser.STRING);
			this.state = 446;
			this.handler();
			this.state = 448;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.T__38) {
				{
				this.state = 447;
				this.errorHandler();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public httpMethod(): HttpMethodContext {
		let _localctx: HttpMethodContext = new HttpMethodContext(this._ctx, this.state);
		this.enterRule(_localctx, 92, UniStackParser.RULE_httpMethod);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 450;
			_la = this._input.LA(1);
			if (!(((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (UniStackParser.T__31 - 32)) | (1 << (UniStackParser.T__32 - 32)) | (1 << (UniStackParser.T__33 - 32)) | (1 << (UniStackParser.T__34 - 32)) | (1 << (UniStackParser.T__35 - 32)) | (1 << (UniStackParser.T__36 - 32)) | (1 << (UniStackParser.T__37 - 32)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public handler(): HandlerContext {
		let _localctx: HandlerContext = new HandlerContext(this._ctx, this.state);
		this.enterRule(_localctx, 94, UniStackParser.RULE_handler);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 452;
			this.match(UniStackParser.LBRACE);
			this.state = 453;
			this.routeBody();
			this.state = 454;
			this.match(UniStackParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public routeBody(): RouteBodyContext {
		let _localctx: RouteBodyContext = new RouteBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 96, UniStackParser.RULE_routeBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 459;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & ((1 << (UniStackParser.T__38 - 39)) | (1 << (UniStackParser.T__39 - 39)) | (1 << (UniStackParser.T__41 - 39)) | (1 << (UniStackParser.IDENT - 39)))) !== 0)) {
				{
				{
				this.state = 456;
				this.routeStatement();
				}
				}
				this.state = 461;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public routeStatement(): RouteStatementContext {
		let _localctx: RouteStatementContext = new RouteStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 98, UniStackParser.RULE_routeStatement);
		try {
			this.state = 466;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case UniStackParser.IDENT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 462;
				this.functionCall();
				}
				break;
			case UniStackParser.T__39:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 463;
				this.datasetOp();
				}
				break;
			case UniStackParser.T__41:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 464;
				this.jsonResponse();
				}
				break;
			case UniStackParser.T__38:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 465;
				this.errorHandler();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public errorHandler(): ErrorHandlerContext {
		let _localctx: ErrorHandlerContext = new ErrorHandlerContext(this._ctx, this.state);
		this.enterRule(_localctx, 100, UniStackParser.RULE_errorHandler);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 468;
			this.match(UniStackParser.T__38);
			this.state = 469;
			this.match(UniStackParser.LBRACE);
			this.state = 470;
			this.errorBody();
			this.state = 471;
			this.match(UniStackParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public errorBody(): ErrorBodyContext {
		let _localctx: ErrorBodyContext = new ErrorBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 102, UniStackParser.RULE_errorBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 474;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 473;
				this.match(UniStackParser.ERROR_TEXT);
				}
				}
				this.state = 476;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === UniStackParser.ERROR_TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionCall(): FunctionCallContext {
		let _localctx: FunctionCallContext = new FunctionCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 104, UniStackParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 478;
			this.match(UniStackParser.IDENT);
			this.state = 479;
			this.match(UniStackParser.LPAREN);
			this.state = 481;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (UniStackParser.STRING - 45)) | (1 << (UniStackParser.NUMBER - 45)) | (1 << (UniStackParser.IDENT - 45)))) !== 0)) {
				{
				this.state = 480;
				this.functionArgs();
				}
			}

			this.state = 483;
			this.match(UniStackParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionArgs(): FunctionArgsContext {
		let _localctx: FunctionArgsContext = new FunctionArgsContext(this._ctx, this.state);
		this.enterRule(_localctx, 106, UniStackParser.RULE_functionArgs);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 485;
			this.functionArg();
			this.state = 490;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 486;
				this.match(UniStackParser.COMMA);
				this.state = 487;
				this.functionArg();
				}
				}
				this.state = 492;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionArg(): FunctionArgContext {
		let _localctx: FunctionArgContext = new FunctionArgContext(this._ctx, this.state);
		this.enterRule(_localctx, 108, UniStackParser.RULE_functionArg);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 493;
			_la = this._input.LA(1);
			if (!(((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (UniStackParser.STRING - 45)) | (1 << (UniStackParser.NUMBER - 45)) | (1 << (UniStackParser.IDENT - 45)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public datasetOp(): DatasetOpContext {
		let _localctx: DatasetOpContext = new DatasetOpContext(this._ctx, this.state);
		this.enterRule(_localctx, 110, UniStackParser.RULE_datasetOp);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 495;
			this.match(UniStackParser.T__39);
			this.state = 496;
			this.match(UniStackParser.T__40);
			this.state = 497;
			this.match(UniStackParser.IDENT);
			this.state = 498;
			this.match(UniStackParser.LPAREN);
			this.state = 500;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (UniStackParser.STRING - 45)) | (1 << (UniStackParser.NUMBER - 45)) | (1 << (UniStackParser.IDENT - 45)))) !== 0)) {
				{
				this.state = 499;
				this.functionArgs();
				}
			}

			this.state = 502;
			this.match(UniStackParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsonResponse(): JsonResponseContext {
		let _localctx: JsonResponseContext = new JsonResponseContext(this._ctx, this.state);
		this.enterRule(_localctx, 112, UniStackParser.RULE_jsonResponse);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 504;
			this.match(UniStackParser.T__41);
			this.state = 505;
			this.match(UniStackParser.LBRACE);
			this.state = 507;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.STRING) {
				{
				this.state = 506;
				this.jsonPairs();
				}
			}

			this.state = 509;
			this.match(UniStackParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsonPairs(): JsonPairsContext {
		let _localctx: JsonPairsContext = new JsonPairsContext(this._ctx, this.state);
		this.enterRule(_localctx, 114, UniStackParser.RULE_jsonPairs);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 511;
			this.jsonPair();
			this.state = 516;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === UniStackParser.COMMA) {
				{
				{
				this.state = 512;
				this.match(UniStackParser.COMMA);
				this.state = 513;
				this.jsonPair();
				}
				}
				this.state = 518;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsonPair(): JsonPairContext {
		let _localctx: JsonPairContext = new JsonPairContext(this._ctx, this.state);
		this.enterRule(_localctx, 116, UniStackParser.RULE_jsonPair);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 519;
			this.match(UniStackParser.STRING);
			this.state = 520;
			this.match(UniStackParser.T__4);
			this.state = 521;
			this.jsonValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsonValue(): JsonValueContext {
		let _localctx: JsonValueContext = new JsonValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 118, UniStackParser.RULE_jsonValue);
		try {
			this.state = 529;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case UniStackParser.STRING:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 523;
				this.match(UniStackParser.STRING);
				}
				break;
			case UniStackParser.NUMBER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 524;
				this.match(UniStackParser.NUMBER);
				}
				break;
			case UniStackParser.BOOLEAN:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 525;
				this.match(UniStackParser.BOOLEAN);
				}
				break;
			case UniStackParser.NULL:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 526;
				this.match(UniStackParser.NULL);
				}
				break;
			case UniStackParser.T__22:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 527;
				this.jsonArray();
				}
				break;
			case UniStackParser.LBRACE:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 528;
				this.jsonObject();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsonArray(): JsonArrayContext {
		let _localctx: JsonArrayContext = new JsonArrayContext(this._ctx, this.state);
		this.enterRule(_localctx, 120, UniStackParser.RULE_jsonArray);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 531;
			this.match(UniStackParser.T__22);
			this.state = 540;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 23)) & ~0x1F) === 0 && ((1 << (_la - 23)) & ((1 << (UniStackParser.T__22 - 23)) | (1 << (UniStackParser.NULL - 23)) | (1 << (UniStackParser.STRING - 23)) | (1 << (UniStackParser.NUMBER - 23)) | (1 << (UniStackParser.BOOLEAN - 23)) | (1 << (UniStackParser.LBRACE - 23)))) !== 0)) {
				{
				this.state = 532;
				this.jsonValue();
				this.state = 537;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === UniStackParser.COMMA) {
					{
					{
					this.state = 533;
					this.match(UniStackParser.COMMA);
					this.state = 534;
					this.jsonValue();
					}
					}
					this.state = 539;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 542;
			this.match(UniStackParser.T__23);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jsonObject(): JsonObjectContext {
		let _localctx: JsonObjectContext = new JsonObjectContext(this._ctx, this.state);
		this.enterRule(_localctx, 122, UniStackParser.RULE_jsonObject);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 544;
			this.match(UniStackParser.LBRACE);
			this.state = 553;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === UniStackParser.STRING) {
				{
				this.state = 545;
				this.jsonPair();
				this.state = 550;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === UniStackParser.COMMA) {
					{
					{
					this.state = 546;
					this.match(UniStackParser.COMMA);
					this.state = 547;
					this.jsonPair();
					}
					}
					this.state = 552;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 555;
			this.match(UniStackParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public langRef(): LangRefContext {
		let _localctx: LangRefContext = new LangRefContext(this._ctx, this.state);
		this.enterRule(_localctx, 124, UniStackParser.RULE_langRef);
		try {
			this.state = 564;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 50, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 557;
				this.match(UniStackParser.IDENT);
				this.state = 558;
				this.match(UniStackParser.T__4);
				this.state = 559;
				this.match(UniStackParser.IDENT);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 560;
				this.match(UniStackParser.T__42);
				this.state = 561;
				this.match(UniStackParser.T__4);
				this.state = 562;
				this.match(UniStackParser.IDENT);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 563;
				this.match(UniStackParser.IDENT);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03B\u0239\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t+" +
		"\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x044" +
		"\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04" +
		"=\t=\x04>\t>\x04?\t?\x04@\t@\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03" +
		"\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x03\x07\x03\x8C\n\x03\f\x03\x0E" +
		"\x03\x8F\v\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x05\x04\x9A\n\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x06\x03\x06\x03\x06\x07\x06\xA4\n\x06\f\x06\x0E\x06\xA7\v\x06" +
		"\x03\x07\x03\x07\x03\x07\x05\x07\xAC\n\x07\x03\b\x03\b\x03\b\x03\b\x07" +
		"\b\xB2\n\b\f\b\x0E\b\xB5\v\b\x03\b\x03\b\x03\t\x03\t\x03\t\x05\t\xBC\n" +
		"\t\x03\n\x03\n\x03\v\x03\v\x03\v\x06\v\xC3\n\v\r\v\x0E\v\xC4\x03\f\x03" +
		"\f\x03\f\x03\r\x03\r\x03\r\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x07\x0E" +
		"\xD2\n\x0E\f\x0E\x0E\x0E\xD5\v\x0E\x03\x0F\x03\x0F\x05\x0F\xD9\n\x0F\x03" +
		"\x10\x03\x10\x03\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x12\x03" +
		"\x12\x03\x12\x07\x12\xE6\n\x12\f\x12\x0E\x12\xE9\v\x12\x03\x13\x03\x13" +
		"\x03\x13\x03\x13\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x06\x15\xF4\n" +
		"\x15\r\x15\x0E\x15\xF5\x03\x16\x06\x16\xF9\n\x16\r\x16\x0E\x16\xFA\x03" +
		"\x16\x03\x16\x03\x17\x03\x17\x03\x17\x05\x17\u0102\n\x17\x03\x18\x03\x18" +
		"\x03\x19\x03\x19\x03\x19\x03\x19\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x06\x1A" +
		"\u010E\n\x1A\r\x1A\x0E\x1A\u010F\x03\x1A\x03\x1A\x06\x1A\u0114\n\x1A\r" +
		"\x1A\x0E\x1A\u0115\x05\x1A\u0118\n\x1A\x03\x1A\x03\x1A\x03\x1B\x03\x1B" +
		"\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B" +
		"\x03\x1B\x03\x1B\x05\x1B\u0129\n\x1B\x03\x1C\x03\x1C\x03\x1C\x06\x1C\u012E" +
		"\n\x1C\r\x1C\x0E\x1C\u012F\x03\x1D\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x03" +
		"\x1E\x06\x1E\u0138\n\x1E\r\x1E\x0E\x1E\u0139\x03\x1F\x07\x1F\u013D\n\x1F" +
		"\f\x1F\x0E\x1F\u0140\v\x1F\x03\x1F\x03\x1F\x03\x1F\x05\x1F\u0145\n\x1F" +
		"\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x05\x1F\u014B\n\x1F\x03\x1F\x03\x1F\x03" +
		"\x1F\x03\x1F\x03 \x03 \x03 \x03!\x03!\x03!\x03!\x07!\u0158\n!\f!\x0E!" +
		"\u015B\v!\x03!\x03!\x03\"\x03\"\x03\"\x07\"\u0162\n\"\f\"\x0E\"\u0165" +
		"\v\"\x03#\x03#\x03#\x05#\u016A\n#\x03$\x03$\x03$\x03$\x03$\x03$\x03$\x03" +
		"$\x03$\x03$\x03$\x03$\x05$\u0178\n$\x03%\x03%\x03%\x03&\x06&\u017E\n&" +
		"\r&\x0E&\u017F\x03\'\x03\'\x03\'\x06\'\u0185\n\'\r\'\x0E\'\u0186\x03(" +
		"\x07(\u018A\n(\f(\x0E(\u018D\v(\x03(\x05(\u0190\n(\x03(\x03(\x03(\x05" +
		"(\u0195\n(\x03(\x03(\x03(\x03(\x05(\u019B\n(\x03(\x03(\x03(\x03(\x03)" +
		"\x03)\x03)\x03*\x03*\x03+\x03+\x03+\x07+\u01A9\n+\f+\x0E+\u01AC\v+\x03" +
		",\x03,\x03,\x05,\u01B1\n,\x03-\x06-\u01B4\n-\r-\x0E-\u01B5\x03.\x03.\x03" +
		".\x06.\u01BB\n.\r.\x0E.\u01BC\x03/\x03/\x03/\x03/\x05/\u01C3\n/\x030\x03" +
		"0\x031\x031\x031\x031\x032\x072\u01CC\n2\f2\x0E2\u01CF\v2\x033\x033\x03" +
		"3\x033\x053\u01D5\n3\x034\x034\x034\x034\x034\x035\x065\u01DD\n5\r5\x0E" +
		"5\u01DE\x036\x036\x036\x056\u01E4\n6\x036\x036\x037\x037\x037\x077\u01EB" +
		"\n7\f7\x0E7\u01EE\v7\x038\x038\x039\x039\x039\x039\x039\x059\u01F7\n9" +
		"\x039\x039\x03:\x03:\x03:\x05:\u01FE\n:\x03:\x03:\x03;\x03;\x03;\x07;" +
		"\u0205\n;\f;\x0E;\u0208\v;\x03<\x03<\x03<\x03<\x03=\x03=\x03=\x03=\x03" +
		"=\x03=\x05=\u0214\n=\x03>\x03>\x03>\x03>\x07>\u021A\n>\f>\x0E>\u021D\v" +
		">\x05>\u021F\n>\x03>\x03>\x03?\x03?\x03?\x03?\x07?\u0227\n?\f?\x0E?\u022A" +
		"\v?\x05?\u022C\n?\x03?\x03?\x03@\x03@\x03@\x03@\x03@\x03@\x03@\x05@\u0237" +
		"\n@\x03@\x02\x02\x02A\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02" +
		"\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02" +
		"\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02<\x02" +
		">\x02@\x02B\x02D\x02F\x02H\x02J\x02L\x02N\x02P\x02R\x02T\x02V\x02X\x02" +
		"Z\x02\\\x02^\x02`\x02b\x02d\x02f\x02h\x02j\x02l\x02n\x02p\x02r\x02t\x02" +
		"v\x02x\x02z\x02|\x02~\x02\x02\x05\x04\x02//12\x03\x02\"(\x05\x02//113" +
		"3\x02\u0240\x02\x80\x03\x02\x02\x02\x04\x8D\x03\x02\x02\x02\x06\x99\x03" +
		"\x02\x02\x02\b\x9B\x03\x02\x02\x02\n\xA0\x03\x02\x02\x02\f\xA8\x03\x02" +
		"\x02\x02\x0E\xAD\x03\x02\x02\x02\x10\xB8\x03\x02\x02\x02\x12\xBD\x03\x02" +
		"\x02\x02\x14\xBF\x03\x02\x02\x02\x16\xC6\x03\x02\x02\x02\x18\xC9\x03\x02" +
		"\x02\x02\x1A\xCE\x03\x02\x02\x02\x1C\xD6\x03\x02\x02\x02\x1E\xDA\x03\x02" +
		"\x02\x02 \xDD\x03\x02\x02\x02\"\xE2\x03\x02\x02\x02$\xEA\x03\x02\x02\x02" +
		"&\xEE\x03\x02\x02\x02(\xF0\x03\x02\x02\x02*\xF8\x03\x02\x02\x02,\u0101" +
		"\x03\x02\x02\x02.\u0103\x03\x02\x02\x020\u0105\x03\x02\x02\x022\u0109" +
		"\x03\x02\x02\x024\u0128\x03\x02\x02\x026\u012A\x03\x02\x02\x028\u0131" +
		"\x03\x02\x02\x02:\u0134\x03\x02\x02\x02<\u013E\x03\x02\x02\x02>\u0150" +
		"\x03\x02\x02\x02@\u0153\x03\x02\x02\x02B\u015E\x03\x02\x02\x02D\u0166" +
		"\x03\x02\x02\x02F\u0177\x03\x02\x02\x02H\u0179\x03\x02\x02\x02J\u017D" +
		"\x03\x02\x02\x02L\u0181\x03\x02\x02\x02N\u018B\x03\x02\x02\x02P\u01A0" +
		"\x03\x02\x02\x02R\u01A3\x03\x02\x02\x02T\u01A5\x03\x02\x02\x02V\u01AD" +
		"\x03\x02\x02\x02X\u01B3\x03\x02\x02\x02Z\u01B7\x03\x02\x02\x02\\\u01BE" +
		"\x03\x02\x02\x02^\u01C4\x03\x02\x02\x02`\u01C6\x03\x02\x02\x02b\u01CD" +
		"\x03\x02\x02\x02d\u01D4\x03\x02\x02\x02f\u01D6\x03\x02\x02\x02h\u01DC" +
		"\x03\x02\x02\x02j\u01E0\x03\x02\x02\x02l\u01E7\x03\x02\x02\x02n\u01EF" +
		"\x03\x02\x02\x02p\u01F1\x03\x02\x02\x02r\u01FA\x03\x02\x02\x02t\u0201" +
		"\x03\x02\x02\x02v\u0209\x03\x02\x02\x02x\u0213\x03\x02\x02\x02z\u0215" +
		"\x03\x02\x02\x02|\u0222\x03\x02\x02\x02~\u0236\x03\x02\x02\x02\x80\x81" +
		"\x07\x03\x02\x02\x81\x82\x07\x04\x02\x02\x82\x83\x07/\x02\x02\x83\x84" +
		"\x07\x05\x02\x02\x84\x85\x070\x02\x02\x85\x86\x075\x02\x02\x86\x87\x05" +
		"\x04\x03\x02\x87\x88\x076\x02\x02\x88\x89\x07\x02\x02\x03\x89\x03\x03" +
		"\x02\x02\x02\x8A\x8C\x05\x06\x04\x02\x8B\x8A\x03\x02\x02\x02\x8C\x8F\x03" +
		"\x02\x02\x02\x8D\x8B\x03\x02\x02\x02\x8D\x8E\x03\x02\x02\x02\x8E\x05\x03" +
		"\x02\x02\x02\x8F\x8D\x03\x02\x02\x02\x90\x9A\x05\x18\r\x02\x91\x9A\x05" +
		" \x11\x02\x92\x9A\x05(\x15\x02\x93\x9A\x056\x1C\x02\x94\x9A\x05\x14\v" +
		"\x02\x95\x9A\x05\b\x05\x02\x96\x9A\x05:\x1E\x02\x97\x9A\x05L\'\x02\x98" +
		"\x9A\x05Z.\x02\x99\x90\x03\x02\x02\x02\x99\x91\x03\x02\x02\x02\x99\x92" +
		"\x03\x02\x02\x02\x99\x93\x03\x02\x02\x02\x99\x94\x03\x02\x02\x02\x99\x95" +
		"\x03\x02\x02\x02\x99\x96\x03\x02\x02\x02\x99\x97\x03\x02\x02\x02\x99\x98" +
		"\x03\x02\x02\x02\x9A\x07\x03\x02\x02\x02\x9B\x9C\x07\x06\x02\x02\x9C\x9D" +
		"\x07\x07\x02\x02\x9D\x9E\x05\n\x06\x02\x9E\x9F\x07:\x02\x02\x9F\t\x03" +
		"\x02\x02\x02\xA0\xA5\x05\f\x07\x02\xA1\xA2\x079\x02\x02\xA2\xA4\x05\f" +
		"\x07\x02\xA3\xA1\x03\x02\x02\x02\xA4\xA7\x03\x02\x02\x02\xA5\xA3\x03\x02" +
		"\x02\x02\xA5\xA6\x03\x02\x02\x02\xA6\v\x03\x02\x02\x02\xA7\xA5\x03\x02" +
		"\x02\x02\xA8\xA9\x07\b\x02\x02\xA9\xAB\x073\x02\x02\xAA\xAC\x05\x0E\b" +
		"\x02\xAB\xAA\x03\x02\x02\x02\xAB\xAC\x03\x02\x02\x02\xAC\r\x03\x02\x02" +
		"\x02\xAD\xAE\x077\x02\x02\xAE\xB3\x05\x10\t\x02\xAF\xB0\x079\x02\x02\xB0" +
		"\xB2\x05\x10\t\x02\xB1\xAF\x03\x02\x02\x02\xB2\xB5\x03\x02\x02\x02\xB3" +
		"\xB1\x03\x02\x02\x02\xB3\xB4\x03\x02\x02\x02\xB4\xB6\x03\x02\x02\x02\xB5" +
		"\xB3\x03\x02\x02\x02\xB6\xB7\x078\x02\x02\xB7\x0F\x03\x02\x02\x02\xB8" +
		"\xBB\x073\x02\x02\xB9\xBA\x07\t\x02\x02\xBA\xBC\x05\x12\n\x02\xBB\xB9" +
		"\x03\x02\x02\x02\xBB\xBC\x03\x02\x02\x02\xBC\x11\x03\x02\x02\x02\xBD\xBE" +
		"\t\x02\x02\x02\xBE\x13\x03\x02\x02\x02\xBF\xC0\x07\n\x02\x02\xC0\xC2\x07" +
		"\x07\x02\x02\xC1\xC3\x05\x16\f\x02\xC2\xC1\x03\x02\x02\x02\xC3\xC4\x03" +
		"\x02\x02\x02\xC4\xC2\x03\x02\x02\x02\xC4\xC5\x03\x02\x02\x02\xC5\x15\x03" +
		"\x02\x02\x02\xC6\xC7\x07@\x02\x02\xC7\xC8\x07:\x02\x02\xC8\x17\x03\x02" +
		"\x02\x02\xC9\xCA\x07\v\x02\x02\xCA\xCB\x07\x07\x02\x02\xCB\xCC\x05\x1A" +
		"\x0E\x02\xCC\xCD\x07:\x02\x02\xCD\x19\x03\x02\x02\x02\xCE\xD3\x05\x1C" +
		"\x0F\x02\xCF\xD0\x079\x02\x02\xD0\xD2\x05\x1C\x0F\x02\xD1\xCF\x03\x02" +
		"\x02\x02\xD2\xD5\x03\x02\x02\x02\xD3\xD1\x03\x02\x02\x02\xD3\xD4\x03\x02" +
		"\x02\x02\xD4\x1B\x03\x02\x02\x02\xD5\xD3\x03\x02\x02\x02\xD6\xD8\x07/" +
		"\x02\x02\xD7\xD9\x05\x1E\x10\x02\xD8\xD7\x03\x02\x02\x02\xD8\xD9\x03\x02" +
		"\x02\x02\xD9\x1D\x03\x02\x02\x02\xDA\xDB\x07\f\x02\x02\xDB\xDC\x073\x02" +
		"\x02\xDC\x1F\x03\x02\x02\x02\xDD\xDE\x07\r\x02\x02\xDE\xDF\x07\x07\x02" +
		"\x02\xDF\xE0\x05\"\x12\x02\xE0\xE1\x07:\x02\x02\xE1!\x03\x02\x02\x02\xE2" +
		"\xE7\x05$\x13\x02\xE3\xE4\x079\x02\x02\xE4\xE6\x05$\x13\x02\xE5\xE3\x03" +
		"\x02\x02\x02\xE6\xE9\x03\x02\x02\x02\xE7\xE5\x03\x02\x02\x02\xE7\xE8\x03" +
		"\x02\x02\x02\xE8#\x03\x02\x02\x02\xE9\xE7\x03\x02\x02\x02\xEA\xEB\x07" +
		"3\x02\x02\xEB\xEC\x07\t\x02\x02\xEC\xED\x05&\x14\x02\xED%\x03\x02\x02" +
		"\x02\xEE\xEF\t\x02\x02\x02\xEF\'\x03\x02\x02\x02\xF0\xF1\x07\x0E\x02\x02" +
		"\xF1\xF3\x07\x07\x02\x02\xF2\xF4\x05*\x16\x02\xF3\xF2\x03\x02\x02\x02" +
		"\xF4\xF5\x03\x02\x02\x02\xF5\xF3\x03\x02\x02\x02\xF5\xF6\x03\x02\x02\x02" +
		"\xF6)\x03\x02\x02\x02\xF7\xF9\x05,\x17\x02\xF8\xF7\x03\x02\x02\x02\xF9" +
		"\xFA\x03\x02\x02\x02\xFA\xF8\x03\x02\x02\x02\xFA\xFB\x03\x02\x02\x02\xFB" +
		"\xFC\x03\x02\x02\x02\xFC\xFD\x07:\x02\x02\xFD+\x03\x02\x02\x02\xFE\u0102" +
		"\x05.\x18\x02\xFF\u0102\x050\x19\x02\u0100\u0102\x052\x1A\x02\u0101\xFE" +
		"\x03\x02\x02\x02\u0101\xFF\x03\x02\x02\x02\u0101\u0100\x03\x02\x02\x02" +
		"\u0102-\x03\x02\x02\x02\u0103\u0104\x07;\x02\x02\u0104/\x03\x02\x02\x02" +
		"\u0105\u0106\x075\x02\x02\u0106\u0107\x05~@\x02\u0107\u0108\x076\x02\x02" +
		"\u01081\x03\x02\x02\x02\u0109\u010A\x07\x0F\x02\x02\u010A\u010B\x054\x1B" +
		"\x02\u010B\u010D\x076\x02\x02\u010C\u010E\x05*\x16\x02\u010D\u010C\x03" +
		"\x02\x02\x02\u010E\u010F\x03\x02\x02\x02\u010F\u010D\x03\x02\x02\x02\u010F" +
		"\u0110\x03\x02\x02\x02\u0110\u0117\x03\x02\x02\x02\u0111\u0113\x07\x10" +
		"\x02\x02\u0112\u0114\x05*\x16\x02\u0113\u0112\x03\x02\x02\x02\u0114\u0115" +
		"\x03\x02\x02\x02\u0115\u0113\x03\x02\x02\x02\u0115\u0116\x03\x02\x02\x02" +
		"\u0116\u0118\x03\x02\x02\x02\u0117\u0111\x03\x02\x02\x02\u0117\u0118\x03" +
		"\x02\x02\x02\u0118\u0119\x03\x02\x02\x02\u0119\u011A\x07\x11\x02\x02\u011A" +
		"3\x03\x02\x02\x02\u011B\u0129\x073\x02\x02\u011C\u011D\x073\x02\x02\u011D" +
		"\u011E\x07\x12\x02\x02\u011E\u0129\x073\x02\x02\u011F\u0120\x073\x02\x02" +
		"\u0120\u0121\x07\x13\x02\x02\u0121\u0129\x073\x02\x02\u0122\u0123\x07" +
		"3\x02\x02\u0123\u0124\x07\x14\x02\x02\u0124\u0129\x073\x02\x02\u0125\u0126" +
		"\x073\x02\x02\u0126\u0127\x07\x15\x02\x02\u0127\u0129\x073\x02\x02\u0128" +
		"\u011B\x03\x02\x02\x02\u0128\u011C\x03\x02\x02\x02\u0128\u011F\x03\x02" +
		"\x02\x02\u0128\u0122\x03\x02\x02\x02\u0128\u0125\x03\x02\x02\x02\u0129" +
		"5\x03\x02\x02\x02\u012A\u012B\x07\x16\x02\x02\u012B\u012D\x07\x07\x02" +
		"\x02\u012C\u012E\x058\x1D\x02\u012D\u012C\x03\x02\x02\x02\u012E\u012F" +
		"\x03\x02\x02\x02\u012F\u012D\x03\x02\x02\x02\u012F\u0130\x03\x02\x02\x02" +
		"\u01307\x03\x02\x02\x02\u0131\u0132\x07<\x02\x02\u0132\u0133\x07:\x02" +
		"\x02\u01339\x03\x02\x02\x02\u0134\u0135\x07\x17\x02\x02\u0135\u0137\x07" +
		"\x07\x02\x02\u0136\u0138\x05<\x1F\x02\u0137\u0136\x03\x02\x02\x02\u0138" +
		"\u0139\x03\x02\x02\x02\u0139\u0137\x03\x02\x02\x02\u0139\u013A\x03\x02" +
		"\x02\x02\u013A;\x03\x02\x02\x02\u013B\u013D\x05> \x02\u013C\u013B\x03" +
		"\x02\x02\x02\u013D\u0140\x03\x02\x02\x02\u013E\u013C\x03\x02\x02\x02\u013E" +
		"\u013F\x03\x02\x02\x02\u013F\u0141\x03\x02\x02\x02\u0140\u013E\x03\x02" +
		"\x02\x02\u0141\u0142\x07\x18\x02\x02\u0142\u0144\x073\x02\x02\u0143\u0145" +
		"\x05@!\x02\u0144\u0143\x03\x02\x02\x02\u0144\u0145\x03\x02\x02\x02\u0145" +
		"\u0146\x03\x02\x02\x02\u0146\u0147\x077\x02\x02\u0147\u0148\x05B\"\x02" +
		"\u0148\u014A\x078\x02\x02\u0149\u014B\x05H%\x02\u014A\u0149\x03\x02\x02" +
		"\x02\u014A\u014B\x03\x02\x02\x02\u014B\u014C\x03\x02\x02\x02\u014C\u014D" +
		"\x075\x02\x02\u014D\u014E\x05J&\x02\u014E\u014F\x076\x02\x02\u014F=\x03" +
		"\x02\x02\x02\u0150\u0151\x07\b\x02\x02\u0151\u0152\x073\x02\x02\u0152" +
		"?\x03\x02\x02\x02\u0153\u0154\x07\x14\x02\x02\u0154\u0159\x073\x02\x02" +
		"\u0155\u0156\x079\x02\x02\u0156\u0158\x073\x02\x02\u0157\u0155\x03\x02" +
		"\x02\x02\u0158\u015B\x03\x02\x02\x02\u0159\u0157\x03\x02\x02\x02\u0159" +
		"\u015A\x03\x02\x02\x02\u015A\u015C\x03\x02\x02\x02\u015B\u0159\x03\x02" +
		"\x02\x02\u015C\u015D\x07\x15\x02\x02\u015DA\x03\x02\x02\x02\u015E\u0163" +
		"\x05D#\x02\u015F\u0160\x079\x02\x02\u0160\u0162\x05D#\x02\u0161\u015F" +
		"\x03\x02\x02\x02\u0162\u0165\x03\x02\x02\x02\u0163\u0161\x03\x02\x02\x02" +
		"\u0163\u0164\x03\x02\x02\x02\u0164C\x03\x02\x02\x02\u0165\u0163\x03\x02" +
		"\x02\x02\u0166\u0169\x073\x02\x02\u0167\u0168\x07\x07\x02\x02\u0168\u016A" +
		"\x05F$\x02\u0169\u0167\x03\x02\x02\x02\u0169\u016A\x03\x02\x02\x02\u016A" +
		"E\x03\x02\x02\x02\u016B\u0178\x073\x02\x02\u016C\u016D\x073\x02\x02\u016D" +
		"\u016E\x07\x19\x02\x02\u016E\u016F\x073\x02\x02\u016F\u0178\x07\x1A\x02" +
		"\x02\u0170\u0171\x073\x02\x02\u0171\u0172\x07\x1B\x02\x02\u0172\u0178" +
		"\x073\x02\x02\u0173\u0174\x07\x1C\x02\x02\u0174\u0175\x07\x19\x02\x02" +
		"\u0175\u0176\x073\x02\x02\u0176\u0178\x07\x1A\x02\x02\u0177\u016B\x03" +
		"\x02\x02\x02\u0177\u016C\x03\x02\x02\x02\u0177\u0170\x03\x02\x02\x02\u0177" +
		"\u0173\x03\x02\x02\x02\u0178G\x03\x02\x02\x02\u0179\u017A\x07\x1D\x02" +
		"\x02\u017A\u017B\x05F$\x02\u017BI\x03\x02\x02\x02\u017C\u017E\x07=\x02" +
		"\x02\u017D\u017C\x03\x02\x02\x02\u017E\u017F\x03\x02\x02\x02\u017F\u017D" +
		"\x03\x02\x02\x02\u017F\u0180\x03\x02\x02\x02\u0180K\x03\x02\x02\x02\u0181" +
		"\u0182\x07\x1E\x02\x02\u0182\u0184\x07\x07\x02\x02\u0183\u0185\x05N(\x02" +
		"\u0184\u0183\x03\x02\x02\x02\u0185\u0186\x03\x02\x02\x02\u0186\u0184\x03" +
		"\x02\x02\x02\u0186\u0187\x03\x02\x02\x02\u0187M\x03\x02\x02\x02\u0188" +
		"\u018A\x05P)\x02\u0189\u0188\x03\x02\x02\x02\u018A\u018D\x03\x02\x02\x02" +
		"\u018B\u0189\x03\x02\x02\x02\u018B\u018C\x03\x02\x02\x02\u018C\u018F\x03" +
		"\x02\x02\x02\u018D\u018B\x03\x02\x02\x02\u018E\u0190\x05R*\x02\u018F\u018E" +
		"\x03\x02\x02\x02\u018F\u0190\x03\x02\x02\x02\u0190\u0191\x03\x02\x02\x02" +
		"\u0191\u0192\x07\x1F\x02\x02\u0192\u0194\x073\x02\x02\u0193\u0195\x05" +
		"@!\x02\u0194\u0193\x03\x02\x02\x02\u0194\u0195\x03\x02\x02\x02\u0195\u0196" +
		"\x03\x02\x02\x02\u0196\u0197\x077\x02\x02\u0197\u0198\x05T+\x02\u0198" +
		"\u019A\x078\x02\x02\u0199\u019B\x05H%\x02\u019A\u0199\x03\x02\x02\x02" +
		"\u019A\u019B\x03\x02\x02\x02\u019B\u019C\x03\x02\x02\x02\u019C\u019D\x07" +
		"5\x02\x02\u019D\u019E\x05X-\x02\u019E\u019F\x076\x02\x02\u019FO\x03\x02" +
		"\x02\x02\u01A0\u01A1\x07\b\x02\x02\u01A1\u01A2\x073\x02\x02\u01A2Q\x03" +
		"\x02\x02\x02\u01A3\u01A4\x07 \x02\x02\u01A4S\x03\x02\x02\x02\u01A5\u01AA" +
		"\x05V,\x02\u01A6\u01A7\x079\x02\x02\u01A7\u01A9\x05V,\x02\u01A8\u01A6" +
		"\x03\x02\x02\x02\u01A9\u01AC\x03\x02\x02\x02\u01AA\u01A8\x03\x02\x02\x02" +
		"\u01AA\u01AB\x03\x02\x02\x02\u01ABU\x03\x02\x02\x02\u01AC\u01AA\x03\x02" +
		"\x02\x02\u01AD\u01B0\x073\x02\x02\u01AE\u01AF\x07\x07\x02\x02\u01AF\u01B1" +
		"\x05F$\x02\u01B0\u01AE\x03\x02\x02\x02\u01B0\u01B1\x03\x02\x02\x02\u01B1" +
		"W\x03\x02\x02\x02\u01B2\u01B4\x07>\x02\x02\u01B3\u01B2\x03\x02\x02\x02" +
		"\u01B4\u01B5\x03\x02\x02\x02\u01B5\u01B3\x03\x02\x02\x02\u01B5\u01B6\x03" +
		"\x02\x02\x02\u01B6Y\x03\x02\x02\x02\u01B7\u01B8\x07!\x02\x02\u01B8\u01BA" +
		"\x07\x07\x02\x02\u01B9\u01BB\x05\\/\x02\u01BA\u01B9\x03\x02\x02\x02\u01BB" +
		"\u01BC\x03\x02\x02\x02\u01BC\u01BA\x03\x02\x02\x02\u01BC\u01BD\x03\x02" +
		"\x02\x02\u01BD[\x03\x02\x02\x02\u01BE\u01BF\x05^0\x02\u01BF\u01C0\x07" +
		"/\x02\x02\u01C0\u01C2\x05`1\x02\u01C1\u01C3\x05f4\x02\u01C2\u01C1\x03" +
		"\x02\x02\x02\u01C2\u01C3\x03\x02\x02\x02\u01C3]\x03\x02\x02\x02\u01C4" +
		"\u01C5\t\x03\x02\x02\u01C5_\x03\x02\x02\x02\u01C6\u01C7\x075\x02\x02\u01C7" +
		"\u01C8\x05b2\x02\u01C8\u01C9\x076\x02\x02\u01C9a\x03\x02\x02\x02\u01CA" +
		"\u01CC\x05d3\x02\u01CB\u01CA\x03\x02\x02\x02\u01CC\u01CF\x03\x02\x02\x02" +
		"\u01CD\u01CB\x03\x02\x02\x02\u01CD\u01CE\x03\x02\x02\x02\u01CEc\x03\x02" +
		"\x02\x02\u01CF\u01CD\x03\x02\x02\x02\u01D0\u01D5\x05j6\x02\u01D1\u01D5" +
		"\x05p9\x02\u01D2\u01D5\x05r:\x02\u01D3\u01D5\x05f4\x02\u01D4\u01D0\x03" +
		"\x02\x02\x02\u01D4\u01D1\x03\x02\x02\x02\u01D4\u01D2\x03\x02\x02\x02\u01D4" +
		"\u01D3\x03\x02\x02\x02\u01D5e\x03\x02\x02\x02\u01D6\u01D7\x07)\x02\x02" +
		"\u01D7\u01D8\x075\x02\x02\u01D8\u01D9\x05h5\x02\u01D9\u01DA\x076\x02\x02" +
		"\u01DAg\x03\x02\x02\x02\u01DB\u01DD\x07?\x02\x02\u01DC\u01DB\x03\x02\x02" +
		"\x02\u01DD\u01DE\x03\x02\x02\x02\u01DE\u01DC\x03\x02\x02\x02\u01DE\u01DF" +
		"\x03\x02\x02\x02\u01DFi\x03\x02\x02\x02\u01E0\u01E1\x073\x02\x02\u01E1" +
		"\u01E3\x077\x02\x02\u01E2\u01E4\x05l7\x02\u01E3\u01E2\x03\x02\x02\x02" +
		"\u01E3\u01E4\x03\x02\x02\x02\u01E4\u01E5\x03\x02\x02\x02\u01E5\u01E6\x07" +
		"8\x02\x02\u01E6k\x03\x02\x02\x02\u01E7\u01EC\x05n8\x02\u01E8\u01E9\x07" +
		"9\x02\x02\u01E9\u01EB\x05n8\x02\u01EA\u01E8\x03\x02\x02\x02\u01EB\u01EE" +
		"\x03\x02\x02\x02\u01EC\u01EA\x03\x02\x02\x02\u01EC\u01ED\x03\x02\x02\x02" +
		"\u01EDm\x03\x02\x02\x02\u01EE\u01EC\x03\x02\x02\x02\u01EF\u01F0\t\x04" +
		"\x02\x02\u01F0o\x03\x02\x02\x02\u01F1\u01F2\x07*\x02\x02\u01F2\u01F3\x07" +
		"+\x02\x02\u01F3\u01F4\x073\x02\x02\u01F4\u01F6\x077\x02\x02\u01F5\u01F7" +
		"\x05l7\x02\u01F6\u01F5\x03\x02\x02\x02\u01F6\u01F7\x03\x02\x02\x02\u01F7" +
		"\u01F8\x03\x02\x02\x02\u01F8\u01F9\x078\x02\x02\u01F9q\x03\x02\x02\x02" +
		"\u01FA\u01FB\x07,\x02\x02\u01FB\u01FD\x075\x02\x02\u01FC\u01FE\x05t;\x02" +
		"\u01FD\u01FC\x03\x02\x02\x02\u01FD\u01FE\x03\x02\x02\x02\u01FE\u01FF\x03" +
		"\x02\x02\x02\u01FF\u0200\x076\x02\x02\u0200s\x03\x02\x02\x02\u0201\u0206" +
		"\x05v<\x02\u0202\u0203\x079\x02\x02\u0203\u0205\x05v<\x02\u0204\u0202" +
		"\x03\x02\x02\x02\u0205\u0208\x03\x02\x02\x02\u0206\u0204\x03\x02\x02\x02" +
		"\u0206\u0207\x03\x02\x02\x02\u0207u\x03\x02\x02\x02\u0208\u0206\x03\x02" +
		"\x02\x02\u0209\u020A\x07/\x02\x02\u020A\u020B\x07\x07\x02\x02\u020B\u020C" +
		"\x05x=\x02\u020Cw\x03\x02\x02\x02\u020D\u0214\x07/\x02\x02\u020E\u0214" +
		"\x071\x02\x02\u020F\u0214\x072\x02\x02\u0210\u0214\x07.\x02\x02\u0211" +
		"\u0214\x05z>\x02\u0212\u0214\x05|?\x02\u0213\u020D\x03\x02\x02\x02\u0213" +
		"\u020E\x03\x02\x02\x02\u0213\u020F\x03\x02\x02\x02\u0213\u0210\x03\x02" +
		"\x02\x02\u0213\u0211\x03\x02\x02\x02\u0213\u0212\x03\x02\x02\x02\u0214" +
		"y\x03\x02\x02\x02\u0215\u021E\x07\x19\x02\x02\u0216\u021B\x05x=\x02\u0217" +
		"\u0218\x079\x02\x02\u0218\u021A\x05x=\x02\u0219\u0217\x03\x02\x02\x02" +
		"\u021A\u021D\x03\x02\x02\x02\u021B\u0219\x03\x02\x02\x02\u021B\u021C\x03" +
		"\x02\x02\x02\u021C\u021F\x03\x02\x02\x02\u021D\u021B\x03\x02\x02\x02\u021E" +
		"\u0216\x03\x02\x02\x02\u021E\u021F\x03\x02\x02\x02\u021F\u0220\x03\x02" +
		"\x02\x02\u0220\u0221\x07\x1A\x02\x02\u0221{\x03\x02\x02\x02\u0222\u022B" +
		"\x075\x02\x02\u0223\u0228\x05v<\x02\u0224\u0225\x079\x02\x02\u0225\u0227" +
		"\x05v<\x02\u0226\u0224\x03\x02\x02\x02\u0227\u022A\x03\x02\x02\x02\u0228" +
		"\u0226\x03\x02\x02\x02\u0228\u0229\x03\x02\x02\x02\u0229\u022C\x03\x02" +
		"\x02\x02\u022A\u0228\x03\x02\x02\x02\u022B\u0223\x03\x02\x02\x02\u022B" +
		"\u022C\x03\x02\x02\x02\u022C\u022D\x03\x02\x02\x02\u022D\u022E\x076\x02" +
		"\x02\u022E}\x03\x02\x02\x02\u022F\u0230\x073\x02\x02\u0230\u0231\x07\x07" +
		"\x02\x02\u0231\u0237\x073\x02\x02\u0232\u0233\x07-\x02\x02\u0233\u0234" +
		"\x07\x07\x02\x02\u0234\u0237\x073\x02\x02\u0235\u0237\x073\x02\x02\u0236" +
		"\u022F\x03\x02\x02\x02\u0236\u0232\x03\x02\x02\x02\u0236\u0235\x03\x02" +
		"\x02\x02\u0237\x7F\x03\x02\x02\x025\x8D\x99\xA5\xAB\xB3\xBB\xC4\xD3\xD8" +
		"\xE7\xF5\xFA\u0101\u010F\u0115\u0117\u0128\u012F\u0139\u013E\u0144\u014A" +
		"\u0159\u0163\u0169\u0177\u017F\u0186\u018B\u018F\u0194\u019A\u01AA\u01B0" +
		"\u01B5\u01BC\u01C2\u01CD\u01D4\u01DE\u01E3\u01EC\u01F6\u01FD\u0206\u0213" +
		"\u021B\u021E\u0228\u022B\u0236";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!UniStackParser.__ATN) {
			UniStackParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(UniStackParser._serializedATN));
		}

		return UniStackParser.__ATN;
	}

}

export class FileContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(UniStackParser.STRING, 0); }
	public VERSION(): TerminalNode { return this.getToken(UniStackParser.VERSION, 0); }
	public LBRACE(): TerminalNode { return this.getToken(UniStackParser.LBRACE, 0); }
	public fileBody(): FileBodyContext {
		return this.getRuleContext(0, FileBodyContext);
	}
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	public EOF(): TerminalNode { return this.getToken(UniStackParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_file; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitFile) {
			return visitor.visitFile(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FileBodyContext extends ParserRuleContext {
	public fileSection(): FileSectionContext[];
	public fileSection(i: number): FileSectionContext;
	public fileSection(i?: number): FileSectionContext | FileSectionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FileSectionContext);
		} else {
			return this.getRuleContext(i, FileSectionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_fileBody; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitFileBody) {
			return visitor.visitFileBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FileSectionContext extends ParserRuleContext {
	public importsSection(): ImportsSectionContext | undefined {
		return this.tryGetRuleContext(0, ImportsSectionContext);
	}
	public configSection(): ConfigSectionContext | undefined {
		return this.tryGetRuleContext(0, ConfigSectionContext);
	}
	public htmlSection(): HtmlSectionContext | undefined {
		return this.tryGetRuleContext(0, HtmlSectionContext);
	}
	public cssSection(): CssSectionContext | undefined {
		return this.tryGetRuleContext(0, CssSectionContext);
	}
	public styleSection(): StyleSectionContext | undefined {
		return this.tryGetRuleContext(0, StyleSectionContext);
	}
	public decoratorSection(): DecoratorSectionContext | undefined {
		return this.tryGetRuleContext(0, DecoratorSectionContext);
	}
	public pySection(): PySectionContext | undefined {
		return this.tryGetRuleContext(0, PySectionContext);
	}
	public jsSection(): JsSectionContext | undefined {
		return this.tryGetRuleContext(0, JsSectionContext);
	}
	public routesSection(): RoutesSectionContext | undefined {
		return this.tryGetRuleContext(0, RoutesSectionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_fileSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitFileSection) {
			return visitor.visitFileSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorSectionContext extends ParserRuleContext {
	public decoratorList(): DecoratorListContext {
		return this.getRuleContext(0, DecoratorListContext);
	}
	public SEMI(): TerminalNode { return this.getToken(UniStackParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_decoratorSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitDecoratorSection) {
			return visitor.visitDecoratorSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorListContext extends ParserRuleContext {
	public decorator(): DecoratorContext[];
	public decorator(i: number): DecoratorContext;
	public decorator(i?: number): DecoratorContext | DecoratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DecoratorContext);
		} else {
			return this.getRuleContext(i, DecoratorContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_decoratorList; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitDecoratorList) {
			return visitor.visitDecoratorList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public decoratorArgs(): DecoratorArgsContext | undefined {
		return this.tryGetRuleContext(0, DecoratorArgsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_decorator; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitDecorator) {
			return visitor.visitDecorator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorArgsContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(UniStackParser.LPAREN, 0); }
	public decoratorArg(): DecoratorArgContext[];
	public decoratorArg(i: number): DecoratorArgContext;
	public decoratorArg(i?: number): DecoratorArgContext | DecoratorArgContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DecoratorArgContext);
		} else {
			return this.getRuleContext(i, DecoratorArgContext);
		}
	}
	public RPAREN(): TerminalNode { return this.getToken(UniStackParser.RPAREN, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_decoratorArgs; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitDecoratorArgs) {
			return visitor.visitDecoratorArgs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorArgContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public decoratorValue(): DecoratorValueContext | undefined {
		return this.tryGetRuleContext(0, DecoratorValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_decoratorArg; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitDecoratorArg) {
			return visitor.visitDecoratorArg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DecoratorValueContext extends ParserRuleContext {
	public STRING(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.STRING, 0); }
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.NUMBER, 0); }
	public BOOLEAN(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.BOOLEAN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_decoratorValue; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitDecoratorValue) {
			return visitor.visitDecoratorValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StyleSectionContext extends ParserRuleContext {
	public styleLine(): StyleLineContext[];
	public styleLine(i: number): StyleLineContext;
	public styleLine(i?: number): StyleLineContext | StyleLineContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StyleLineContext);
		} else {
			return this.getRuleContext(i, StyleLineContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_styleSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitStyleSection) {
			return visitor.visitStyleSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StyleLineContext extends ParserRuleContext {
	public STYLE_TEXT(): TerminalNode { return this.getToken(UniStackParser.STYLE_TEXT, 0); }
	public SEMI(): TerminalNode { return this.getToken(UniStackParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_styleLine; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitStyleLine) {
			return visitor.visitStyleLine(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportsSectionContext extends ParserRuleContext {
	public importList(): ImportListContext {
		return this.getRuleContext(0, ImportListContext);
	}
	public SEMI(): TerminalNode { return this.getToken(UniStackParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_importsSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitImportsSection) {
			return visitor.visitImportsSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportListContext extends ParserRuleContext {
	public importItem(): ImportItemContext[];
	public importItem(i: number): ImportItemContext;
	public importItem(i?: number): ImportItemContext | ImportItemContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ImportItemContext);
		} else {
			return this.getRuleContext(i, ImportItemContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_importList; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitImportList) {
			return visitor.visitImportList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportItemContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(UniStackParser.STRING, 0); }
	public importAlias(): ImportAliasContext | undefined {
		return this.tryGetRuleContext(0, ImportAliasContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_importItem; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitImportItem) {
			return visitor.visitImportItem(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportAliasContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_importAlias; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitImportAlias) {
			return visitor.visitImportAlias(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConfigSectionContext extends ParserRuleContext {
	public configEntryList(): ConfigEntryListContext {
		return this.getRuleContext(0, ConfigEntryListContext);
	}
	public SEMI(): TerminalNode { return this.getToken(UniStackParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_configSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitConfigSection) {
			return visitor.visitConfigSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConfigEntryListContext extends ParserRuleContext {
	public configEntry(): ConfigEntryContext[];
	public configEntry(i: number): ConfigEntryContext;
	public configEntry(i?: number): ConfigEntryContext | ConfigEntryContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ConfigEntryContext);
		} else {
			return this.getRuleContext(i, ConfigEntryContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_configEntryList; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitConfigEntryList) {
			return visitor.visitConfigEntryList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConfigEntryContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public configValue(): ConfigValueContext {
		return this.getRuleContext(0, ConfigValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_configEntry; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitConfigEntry) {
			return visitor.visitConfigEntry(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConfigValueContext extends ParserRuleContext {
	public STRING(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.STRING, 0); }
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.NUMBER, 0); }
	public BOOLEAN(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.BOOLEAN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_configValue; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitConfigValue) {
			return visitor.visitConfigValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HtmlSectionContext extends ParserRuleContext {
	public htmlBlock(): HtmlBlockContext[];
	public htmlBlock(i: number): HtmlBlockContext;
	public htmlBlock(i?: number): HtmlBlockContext | HtmlBlockContext[] {
		if (i === undefined) {
			return this.getRuleContexts(HtmlBlockContext);
		} else {
			return this.getRuleContext(i, HtmlBlockContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_htmlSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitHtmlSection) {
			return visitor.visitHtmlSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HtmlBlockContext extends ParserRuleContext {
	public SEMI(): TerminalNode { return this.getToken(UniStackParser.SEMI, 0); }
	public htmlNode(): HtmlNodeContext[];
	public htmlNode(i: number): HtmlNodeContext;
	public htmlNode(i?: number): HtmlNodeContext | HtmlNodeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(HtmlNodeContext);
		} else {
			return this.getRuleContext(i, HtmlNodeContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_htmlBlock; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitHtmlBlock) {
			return visitor.visitHtmlBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HtmlNodeContext extends ParserRuleContext {
	public htmlText(): HtmlTextContext | undefined {
		return this.tryGetRuleContext(0, HtmlTextContext);
	}
	public htmlExpr(): HtmlExprContext | undefined {
		return this.tryGetRuleContext(0, HtmlExprContext);
	}
	public htmlConditional(): HtmlConditionalContext | undefined {
		return this.tryGetRuleContext(0, HtmlConditionalContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_htmlNode; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitHtmlNode) {
			return visitor.visitHtmlNode(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HtmlTextContext extends ParserRuleContext {
	public HTML_TEXT(): TerminalNode { return this.getToken(UniStackParser.HTML_TEXT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_htmlText; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitHtmlText) {
			return visitor.visitHtmlText(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HtmlExprContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(UniStackParser.LBRACE, 0); }
	public langRef(): LangRefContext {
		return this.getRuleContext(0, LangRefContext);
	}
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_htmlExpr; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitHtmlExpr) {
			return visitor.visitHtmlExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HtmlConditionalContext extends ParserRuleContext {
	public condition(): ConditionContext {
		return this.getRuleContext(0, ConditionContext);
	}
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	public htmlBlock(): HtmlBlockContext[];
	public htmlBlock(i: number): HtmlBlockContext;
	public htmlBlock(i?: number): HtmlBlockContext | HtmlBlockContext[] {
		if (i === undefined) {
			return this.getRuleContexts(HtmlBlockContext);
		} else {
			return this.getRuleContext(i, HtmlBlockContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_htmlConditional; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitHtmlConditional) {
			return visitor.visitHtmlConditional(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditionContext extends ParserRuleContext {
	public IDENT(): TerminalNode[];
	public IDENT(i: number): TerminalNode;
	public IDENT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.IDENT);
		} else {
			return this.getToken(UniStackParser.IDENT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_condition; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitCondition) {
			return visitor.visitCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CssSectionContext extends ParserRuleContext {
	public cssChunk(): CssChunkContext[];
	public cssChunk(i: number): CssChunkContext;
	public cssChunk(i?: number): CssChunkContext | CssChunkContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CssChunkContext);
		} else {
			return this.getRuleContext(i, CssChunkContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_cssSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitCssSection) {
			return visitor.visitCssSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CssChunkContext extends ParserRuleContext {
	public CSS_TEXT(): TerminalNode { return this.getToken(UniStackParser.CSS_TEXT, 0); }
	public SEMI(): TerminalNode { return this.getToken(UniStackParser.SEMI, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_cssChunk; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitCssChunk) {
			return visitor.visitCssChunk(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PySectionContext extends ParserRuleContext {
	public pyFunction(): PyFunctionContext[];
	public pyFunction(i: number): PyFunctionContext;
	public pyFunction(i?: number): PyFunctionContext | PyFunctionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PyFunctionContext);
		} else {
			return this.getRuleContext(i, PyFunctionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_pySection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitPySection) {
			return visitor.visitPySection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PyFunctionContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public LPAREN(): TerminalNode { return this.getToken(UniStackParser.LPAREN, 0); }
	public pyParams(): PyParamsContext {
		return this.getRuleContext(0, PyParamsContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(UniStackParser.RPAREN, 0); }
	public LBRACE(): TerminalNode { return this.getToken(UniStackParser.LBRACE, 0); }
	public pyBody(): PyBodyContext {
		return this.getRuleContext(0, PyBodyContext);
	}
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	public pyDecorator(): PyDecoratorContext[];
	public pyDecorator(i: number): PyDecoratorContext;
	public pyDecorator(i?: number): PyDecoratorContext | PyDecoratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PyDecoratorContext);
		} else {
			return this.getRuleContext(i, PyDecoratorContext);
		}
	}
	public genericParams(): GenericParamsContext | undefined {
		return this.tryGetRuleContext(0, GenericParamsContext);
	}
	public returnType(): ReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, ReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_pyFunction; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitPyFunction) {
			return visitor.visitPyFunction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PyDecoratorContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_pyDecorator; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitPyDecorator) {
			return visitor.visitPyDecorator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericParamsContext extends ParserRuleContext {
	public IDENT(): TerminalNode[];
	public IDENT(i: number): TerminalNode;
	public IDENT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.IDENT);
		} else {
			return this.getToken(UniStackParser.IDENT, i);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_genericParams; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitGenericParams) {
			return visitor.visitGenericParams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PyParamsContext extends ParserRuleContext {
	public pyParam(): PyParamContext[];
	public pyParam(i: number): PyParamContext;
	public pyParam(i?: number): PyParamContext | PyParamContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PyParamContext);
		} else {
			return this.getRuleContext(i, PyParamContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_pyParams; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitPyParams) {
			return visitor.visitPyParams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PyParamContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_pyParam; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitPyParam) {
			return visitor.visitPyParam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeAnnotationContext extends ParserRuleContext {
	public IDENT(): TerminalNode[];
	public IDENT(i: number): TerminalNode;
	public IDENT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.IDENT);
		} else {
			return this.getToken(UniStackParser.IDENT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_typeAnnotation; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitTypeAnnotation) {
			return visitor.visitTypeAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnTypeContext extends ParserRuleContext {
	public typeAnnotation(): TypeAnnotationContext {
		return this.getRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_returnType; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitReturnType) {
			return visitor.visitReturnType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PyBodyContext extends ParserRuleContext {
	public PY_TEXT(): TerminalNode[];
	public PY_TEXT(i: number): TerminalNode;
	public PY_TEXT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.PY_TEXT);
		} else {
			return this.getToken(UniStackParser.PY_TEXT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_pyBody; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitPyBody) {
			return visitor.visitPyBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsSectionContext extends ParserRuleContext {
	public jsFunction(): JsFunctionContext[];
	public jsFunction(i: number): JsFunctionContext;
	public jsFunction(i?: number): JsFunctionContext | JsFunctionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JsFunctionContext);
		} else {
			return this.getRuleContext(i, JsFunctionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsSection) {
			return visitor.visitJsSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsFunctionContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public LPAREN(): TerminalNode { return this.getToken(UniStackParser.LPAREN, 0); }
	public jsParams(): JsParamsContext {
		return this.getRuleContext(0, JsParamsContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(UniStackParser.RPAREN, 0); }
	public LBRACE(): TerminalNode { return this.getToken(UniStackParser.LBRACE, 0); }
	public jsBody(): JsBodyContext {
		return this.getRuleContext(0, JsBodyContext);
	}
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	public jsDecorator(): JsDecoratorContext[];
	public jsDecorator(i: number): JsDecoratorContext;
	public jsDecorator(i?: number): JsDecoratorContext | JsDecoratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JsDecoratorContext);
		} else {
			return this.getRuleContext(i, JsDecoratorContext);
		}
	}
	public asyncKeyword(): AsyncKeywordContext | undefined {
		return this.tryGetRuleContext(0, AsyncKeywordContext);
	}
	public genericParams(): GenericParamsContext | undefined {
		return this.tryGetRuleContext(0, GenericParamsContext);
	}
	public returnType(): ReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, ReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsFunction; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsFunction) {
			return visitor.visitJsFunction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsDecoratorContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsDecorator; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsDecorator) {
			return visitor.visitJsDecorator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AsyncKeywordContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_asyncKeyword; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitAsyncKeyword) {
			return visitor.visitAsyncKeyword(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsParamsContext extends ParserRuleContext {
	public jsParam(): JsParamContext[];
	public jsParam(i: number): JsParamContext;
	public jsParam(i?: number): JsParamContext | JsParamContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JsParamContext);
		} else {
			return this.getRuleContext(i, JsParamContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsParams; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsParams) {
			return visitor.visitJsParams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsParamContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsParam; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsParam) {
			return visitor.visitJsParam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsBodyContext extends ParserRuleContext {
	public JS_TEXT(): TerminalNode[];
	public JS_TEXT(i: number): TerminalNode;
	public JS_TEXT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.JS_TEXT);
		} else {
			return this.getToken(UniStackParser.JS_TEXT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsBody; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsBody) {
			return visitor.visitJsBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RoutesSectionContext extends ParserRuleContext {
	public route(): RouteContext[];
	public route(i: number): RouteContext;
	public route(i?: number): RouteContext | RouteContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RouteContext);
		} else {
			return this.getRuleContext(i, RouteContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_routesSection; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitRoutesSection) {
			return visitor.visitRoutesSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RouteContext extends ParserRuleContext {
	public httpMethod(): HttpMethodContext {
		return this.getRuleContext(0, HttpMethodContext);
	}
	public STRING(): TerminalNode { return this.getToken(UniStackParser.STRING, 0); }
	public handler(): HandlerContext {
		return this.getRuleContext(0, HandlerContext);
	}
	public errorHandler(): ErrorHandlerContext | undefined {
		return this.tryGetRuleContext(0, ErrorHandlerContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_route; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitRoute) {
			return visitor.visitRoute(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HttpMethodContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_httpMethod; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitHttpMethod) {
			return visitor.visitHttpMethod(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HandlerContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(UniStackParser.LBRACE, 0); }
	public routeBody(): RouteBodyContext {
		return this.getRuleContext(0, RouteBodyContext);
	}
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_handler; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitHandler) {
			return visitor.visitHandler(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RouteBodyContext extends ParserRuleContext {
	public routeStatement(): RouteStatementContext[];
	public routeStatement(i: number): RouteStatementContext;
	public routeStatement(i?: number): RouteStatementContext | RouteStatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RouteStatementContext);
		} else {
			return this.getRuleContext(i, RouteStatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_routeBody; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitRouteBody) {
			return visitor.visitRouteBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RouteStatementContext extends ParserRuleContext {
	public functionCall(): FunctionCallContext | undefined {
		return this.tryGetRuleContext(0, FunctionCallContext);
	}
	public datasetOp(): DatasetOpContext | undefined {
		return this.tryGetRuleContext(0, DatasetOpContext);
	}
	public jsonResponse(): JsonResponseContext | undefined {
		return this.tryGetRuleContext(0, JsonResponseContext);
	}
	public errorHandler(): ErrorHandlerContext | undefined {
		return this.tryGetRuleContext(0, ErrorHandlerContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_routeStatement; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitRouteStatement) {
			return visitor.visitRouteStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ErrorHandlerContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(UniStackParser.LBRACE, 0); }
	public errorBody(): ErrorBodyContext {
		return this.getRuleContext(0, ErrorBodyContext);
	}
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_errorHandler; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitErrorHandler) {
			return visitor.visitErrorHandler(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ErrorBodyContext extends ParserRuleContext {
	public ERROR_TEXT(): TerminalNode[];
	public ERROR_TEXT(i: number): TerminalNode;
	public ERROR_TEXT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.ERROR_TEXT);
		} else {
			return this.getToken(UniStackParser.ERROR_TEXT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_errorBody; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitErrorBody) {
			return visitor.visitErrorBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionCallContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public LPAREN(): TerminalNode { return this.getToken(UniStackParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(UniStackParser.RPAREN, 0); }
	public functionArgs(): FunctionArgsContext | undefined {
		return this.tryGetRuleContext(0, FunctionArgsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_functionCall; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitFunctionCall) {
			return visitor.visitFunctionCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionArgsContext extends ParserRuleContext {
	public functionArg(): FunctionArgContext[];
	public functionArg(i: number): FunctionArgContext;
	public functionArg(i?: number): FunctionArgContext | FunctionArgContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FunctionArgContext);
		} else {
			return this.getRuleContext(i, FunctionArgContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_functionArgs; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitFunctionArgs) {
			return visitor.visitFunctionArgs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionArgContext extends ParserRuleContext {
	public IDENT(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.IDENT, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.STRING, 0); }
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.NUMBER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_functionArg; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitFunctionArg) {
			return visitor.visitFunctionArg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatasetOpContext extends ParserRuleContext {
	public IDENT(): TerminalNode { return this.getToken(UniStackParser.IDENT, 0); }
	public LPAREN(): TerminalNode { return this.getToken(UniStackParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(UniStackParser.RPAREN, 0); }
	public functionArgs(): FunctionArgsContext | undefined {
		return this.tryGetRuleContext(0, FunctionArgsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_datasetOp; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitDatasetOp) {
			return visitor.visitDatasetOp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonResponseContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(UniStackParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	public jsonPairs(): JsonPairsContext | undefined {
		return this.tryGetRuleContext(0, JsonPairsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsonResponse; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsonResponse) {
			return visitor.visitJsonResponse(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonPairsContext extends ParserRuleContext {
	public jsonPair(): JsonPairContext[];
	public jsonPair(i: number): JsonPairContext;
	public jsonPair(i?: number): JsonPairContext | JsonPairContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JsonPairContext);
		} else {
			return this.getRuleContext(i, JsonPairContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsonPairs; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsonPairs) {
			return visitor.visitJsonPairs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonPairContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(UniStackParser.STRING, 0); }
	public jsonValue(): JsonValueContext {
		return this.getRuleContext(0, JsonValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsonPair; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsonPair) {
			return visitor.visitJsonPair(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonValueContext extends ParserRuleContext {
	public STRING(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.STRING, 0); }
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.NUMBER, 0); }
	public BOOLEAN(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.BOOLEAN, 0); }
	public NULL(): TerminalNode | undefined { return this.tryGetToken(UniStackParser.NULL, 0); }
	public jsonArray(): JsonArrayContext | undefined {
		return this.tryGetRuleContext(0, JsonArrayContext);
	}
	public jsonObject(): JsonObjectContext | undefined {
		return this.tryGetRuleContext(0, JsonObjectContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsonValue; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsonValue) {
			return visitor.visitJsonValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonArrayContext extends ParserRuleContext {
	public jsonValue(): JsonValueContext[];
	public jsonValue(i: number): JsonValueContext;
	public jsonValue(i?: number): JsonValueContext | JsonValueContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JsonValueContext);
		} else {
			return this.getRuleContext(i, JsonValueContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsonArray; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsonArray) {
			return visitor.visitJsonArray(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonObjectContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(UniStackParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(UniStackParser.RBRACE, 0); }
	public jsonPair(): JsonPairContext[];
	public jsonPair(i: number): JsonPairContext;
	public jsonPair(i?: number): JsonPairContext | JsonPairContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JsonPairContext);
		} else {
			return this.getRuleContext(i, JsonPairContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.COMMA);
		} else {
			return this.getToken(UniStackParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_jsonObject; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitJsonObject) {
			return visitor.visitJsonObject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LangRefContext extends ParserRuleContext {
	public IDENT(): TerminalNode[];
	public IDENT(i: number): TerminalNode;
	public IDENT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(UniStackParser.IDENT);
		} else {
			return this.getToken(UniStackParser.IDENT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return UniStackParser.RULE_langRef; }
	// @Override
	public accept<Result>(visitor: UniStackVisitor<Result>): Result {
		if (visitor.visitLangRef) {
			return visitor.visitLangRef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


