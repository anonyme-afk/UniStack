/*
 * Copyright 2026 anonyme-afk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

grammar UniStackV2;

// UniStack v2 - Extended Grammar with Async/Await, Generics, Decorators, Advanced Types

file
  : 'unistack' 'app' STRING 'version' VERSION LBRACE fileBody RBRACE EOF
  ;

fileBody
  : fileSection*
  ;

fileSection
  : importsSection
  | configSection
  | htmlSection
  | cssSection
  | styleSection
  | decoratorSection
  | pySection
  | jsSection
  | routesSection
  ;

// ----- DECORATORS -----
decoratorSection
  : 'decorators' ':' decoratorList SEMI
  ;

decoratorList
  : decorator (COMMA decorator)*
  ;

decorator
  : '@' IDENT decoratorArgs?
  ;

decoratorArgs
  : '(' decoratorArg (COMMA decoratorArg)* ')'
  ;

decoratorArg
  : IDENT ('=' decoratorValue)?
  ;

decoratorValue
  : STRING
  | NUMBER
  | BOOLEAN
  ;

// ----- STYLE (stdlib) -----

styleSection
  : 'style' ':' styleLine+
  ;

styleLine
  : STYLE_TEXT SEMI
  ;

// ----- IMPORTS -----

importsSection
  : 'imports' ':' importList SEMI
  ;

importList
  : importItem (COMMA importItem)*
  ;

importItem
  : STRING importAlias?
  ;

importAlias
  : 'as' IDENT
  ;

// ----- CONFIG -----

configSection
  : 'config' ':' configEntryList SEMI
  ;

configEntryList
  : configEntry (COMMA configEntry)*
  ;

configEntry
  : IDENT '=' configValue
  ;

configValue
  : STRING
  | NUMBER
  | BOOLEAN
  ;

// ----- HTML-UI -----

htmlSection
  : 'html-ui' ':' htmlBlock+
  ;

htmlBlock
  : htmlNode+ SEMI
  ;

htmlNode
  : htmlText
  | htmlExpr
  | htmlConditional
  ;

htmlText
  : HTML_TEXT
  ;

// Dynamic expression {py:func()} or {js:var} or {error:handler}
htmlExpr
  : LBRACE langRef RBRACE
  ;

// Conditional rendering {if condition}...{else}...{end}
htmlConditional
  : '{if' condition '}' htmlBlock+ ('{else}' htmlBlock+)? '{end}'
  ;

condition
  : IDENT
  | IDENT '==' IDENT
  | IDENT '!=' IDENT
  | IDENT '<' IDENT
  | IDENT '>' IDENT
  ;

// ----- CSS -----

cssSection
  : 'css' ':' cssChunk+
  ;

cssChunk
  : CSS_TEXT SEMI
  ;

// ----- PYTHON FUNCTIONS -----

pySection
  : 'py' ':' pyFunction+
  ;

pyFunction
  : pyDecorator* 'def' IDENT genericParams? '(' pyParams ')' returnType? LBRACE pyBody RBRACE
  ;

pyDecorator
  : '@' IDENT
  ;

genericParams
  : '<' IDENT (',' IDENT)* '>'
  ;

pyParams
  : pyParam (COMMA pyParam)*
  ;

pyParam
  : IDENT (':' typeAnnotation)?
  ;

typeAnnotation
  : IDENT
  | IDENT '[' IDENT ']'  // List[T], Dict[K,V]
  | IDENT '|' IDENT      // Union types
  | 'Optional' '[' IDENT ']'
  ;

returnType
  : '->' typeAnnotation
  ;

pyBody
  : PY_TEXT+
  ;

// ----- JAVASCRIPT FUNCTIONS -----

jsSection
  : 'js' ':' jsFunction+
  ;

jsFunction
  : jsDecorator* asyncKeyword? 'function' IDENT genericParams? '(' jsParams ')' returnType? LBRACE jsBody RBRACE
  ;

jsDecorator
  : '@' IDENT
  ;

asyncKeyword
  : 'async'
  ;

jsParams
  : jsParam (COMMA jsParam)*
  ;

jsParam
  : IDENT (':' typeAnnotation)?
  ;

jsBody
  : JS_TEXT+
  ;

// ----- ROUTES -----

routesSection
  : 'routes' ':' route+
  ;

route
  : httpMethod STRING handler errorHandler?
  ;

httpMethod
  : 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD'
  ;

handler
  : '{' routeBody '}'
  ;

routeBody
  : routeStatement*
  ;

routeStatement
  : functionCall
  | datasetOp
  | jsonResponse
  | errorHandler
  ;

errorHandler
  : 'catch' '{' errorBody '}'
  ;

errorBody
  : ERROR_TEXT+
  ;

functionCall
  : IDENT '(' functionArgs? ')'
  ;

functionArgs
  : functionArg (COMMA functionArg)*
  ;

functionArg
  : IDENT | STRING | NUMBER
  ;

datasetOp
  : 'DataSet' '.' IDENT '(' functionArgs? ')'
  ;

jsonResponse
  : 'json' '{' jsonPairs? '}'
  ;

jsonPairs
  : jsonPair (COMMA jsonPair)*
  ;

jsonPair
  : STRING ':' jsonValue
  ;

jsonValue
  : STRING
  | NUMBER
  | BOOLEAN
  | null
  | jsonArray
  | jsonObject
  ;

jsonArray
  : '[' (jsonValue (COMMA jsonValue)*)? ']'
  ;

jsonObject
  : '{' (jsonPair (COMMA jsonPair)*)? '}'
  ;

// ----- TERMINALS -----

STRING
  : '"' (~["\n\\] | '\\' .)* '"'
  ;

VERSION
  : DIGIT+ '.' DIGIT+ '.' DIGIT+
  ;

NUMBER
  : '-'? DIGIT+ ('.' DIGIT+)?
  ;

BOOLEAN
  : 'true'
  | 'false'
  ;

IDENT
  : [a-zA-Z_][a-zA-Z0-9_]*
  ;

DIGIT
  : [0-9]
  ;

LBRACE
  : '{'
  ;

RBRACE
  : '}'
  ;

LPAREN
  : '('
  ;

RPAREN
  : ')'
  ;

COMMA
  : ','
  ;

SEMI
  : ';'
  ;

HTML_TEXT
  : ~[{};]+
  ;

CSS_TEXT
  : ~[;]+
  ;

PY_TEXT
  : ~[{}]+
  ;

JS_TEXT
  : ~[{}]+
  ;

ERROR_TEXT
  : ~[}]+
  ;

STYLE_TEXT
  : ~[;]+
  ;

WHITESPACE
  : [ \t\n\r]+ -> skip
  ;

COMMENT
  : '//' ~[\n]* -> skip
  ;

langRef
  : IDENT ':' IDENT
  | 'error' ':' IDENT
  | IDENT
  ;
