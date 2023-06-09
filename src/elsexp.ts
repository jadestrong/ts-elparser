
// Generated by peggy v. 2.0.1 (ts-pegjs plugin v. 2.2.1 )
//
// https://peggyjs.org/   https://github.com/metadevpro/ts-pegjs

"use strict";


    import * as ast from './sexp-ast';


export interface IFilePosition {
  offset: number;
  line: number;
  column: number;
}

export interface IFileRange {
  start: IFilePosition;
  end: IFilePosition;
  source: string;
}

export interface ILiteralExpectation {
  type: "literal";
  text: string;
  ignoreCase: boolean;
}

export interface IClassParts extends Array<string | IClassParts> {}

export interface IClassExpectation {
  type: "class";
  parts: IClassParts;
  inverted: boolean;
  ignoreCase: boolean;
}

export interface IAnyExpectation {
  type: "any";
}

export interface IEndExpectation {
  type: "end";
}

export interface IOtherExpectation {
  type: "other";
  description: string;
}

export type Expectation = ILiteralExpectation | IClassExpectation | IAnyExpectation | IEndExpectation | IOtherExpectation;

function peg$padEnd(str: string, targetLength: number, padString: string) {
  padString = padString || ' ';
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}

export class SyntaxError extends Error {
  public static buildMessage(expected: Expectation[], found: string | null) {
    function hex(ch: string): string {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s: string): string {
      return s
        .replace(/\\/g, "\\\\")
        .replace(/"/g,  "\\\"")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,            (ch) => "\\x0" + hex(ch) )
        .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x"  + hex(ch) );
    }

    function classEscape(s: string): string {
      return s
        .replace(/\\/g, "\\\\")
        .replace(/\]/g, "\\]")
        .replace(/\^/g, "\\^")
        .replace(/-/g,  "\\-")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,            (ch) => "\\x0" + hex(ch) )
        .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x"  + hex(ch) );
    }

    function describeExpectation(expectation: Expectation) {
      switch (expectation.type) {
        case "literal":
          return "\"" + literalEscape(expectation.text) + "\"";
        case "class":
          const escapedParts = expectation.parts.map((part) => {
            return Array.isArray(part)
              ? classEscape(part[0] as string) + "-" + classEscape(part[1] as string)
              : classEscape(part);
          });

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        case "any":
          return "any character";
        case "end":
          return "end of input";
        case "other":
          return expectation.description;
      }
    }

    function describeExpected(expected1: Expectation[]) {
      const descriptions = expected1.map(describeExpectation);
      let i: number;
      let j: number;

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found1: string | null) {
      return found1 ? "\"" + literalEscape(found1) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  }

  public message: string;
  public expected: Expectation[];
  public found: string | null;
  public location: IFileRange;
  public name: string;

  constructor(message: string, expected: Expectation[], found: string | null, location: IFileRange) {
    super();
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";

    if (typeof (Object as any).setPrototypeOf === "function") {
      (Object as any).setPrototypeOf(this, SyntaxError.prototype);
    } else {
      (this as any).__proto__ = SyntaxError.prototype;
    }
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, SyntaxError);
    }
  }

  format(sources: { grammarSource?: string; text: string }[]): string {
    let str = 'Error: ' + this.message;
    if (this.location) {
      let src: string[] | null = null;
      let k;
      for (k = 0; k < sources.length; k++) {
        if (sources[k].grammarSource === this.location.source) {
          src = sources[k].text.split(/\r\n|\n|\r/g);
          break;
        }
      }
      let s = this.location.start;
      let loc = this.location.source + ':' + s.line + ':' + s.column;
      if (src) {
        let e = this.location.end;
        let filler = peg$padEnd('', s.line.toString().length, ' ');
        let line = src[s.line - 1];
        let last = s.line === e.line ? e.column : line.length + 1;
        str += '\n --> ' + loc + '\n' + filler + ' |\n' + s.line + ' | ' + line + '\n' + filler + ' | ' +
          peg$padEnd('', s.column - 1, ' ') +
          peg$padEnd('', last - s.column, '^');
      } else {
        str += '\n at ' + loc;
      }
    }
    return str;
  }
}

function peg$parse(input: string, options?: IParseOptions) {
  options = options !== undefined ? options : {};

  const peg$FAILED: Readonly<any> = {};
  const peg$source = options.grammarSource;

  const peg$startRuleFunctions: {[id: string]: any} = { start: peg$parsestart };
  let peg$startRuleFunction: () => any = peg$parsestart;

  const peg$c0 = function(first: any, a: any): any {return a;};
  const peg$c1 = function(first: any, rest: any): any {
      rest.unshift(first);
      return rest;
  };
  const peg$c2 = function(first: any): any {
      return [first];
  };
  const peg$c3 = /^[\t\v\n\r\f ]/;
  const peg$c4 = peg$classExpectation(["\t", "\v", "\n", "\r", "\f", " "], false, false);
  const peg$c5 = "\"";
  const peg$c6 = peg$literalExpectation("\"", false);
  const peg$c7 = /^[^"\\]/;
  const peg$c8 = peg$classExpectation(["\"", "\\"], true, false);
  const peg$c9 = "\\";
  const peg$c10 = peg$literalExpectation("\\", false);
  const peg$c11 = peg$anyExpectation();
  const peg$c12 = function(chars: any): any {
        return new ast.SExpString(chars.map(char => {
          if (char === '\\"') {
             return '\"'
          }
          return char;
        }).join(""));
  };
  const peg$c13 = "(";
  const peg$c14 = peg$literalExpectation("(", false);
  const peg$c15 = ")";
  const peg$c16 = peg$literalExpectation(")", false);
  const peg$c17 = function(list: any): any {
      return new ast.SExpList(list);
  };
  const peg$c18 = ".";
  const peg$c19 = peg$literalExpectation(".", false);
  const peg$c20 = function(head: any, tail: any): any {
      if (head.length == 1) return new ast.SExpCons(head[0], tail);
      return new ast.SExpListDot(head, tail);
  };
  const peg$c21 = "'";
  const peg$c22 = peg$literalExpectation("'", false);
  const peg$c23 = function(body: any): any {
      return new ast.SExpQuoted(body);
  };
  const peg$c24 = "nil";
  const peg$c25 = peg$literalExpectation("nil", false);
  const peg$c26 = function(): any {
      return new ast.SExpNil();
  };
  const peg$c27 = function(start: any, parts: any): any {
      return new ast.SExpSymbol(start + parts.join(""));
  };
  const peg$c28 = /^[a-z\-.\/_:*+=]/i;
  const peg$c29 = peg$classExpectation([["a", "z"], "-", ".", "/", "_", ":", "*", "+", "="], false, true);
  const peg$c30 = /^[a-z\-.\/_:*+?=0-9]/i;
  const peg$c31 = peg$classExpectation([["a", "z"], "-", ".", "/", "_", ":", "*", "+", "?", "=", ["0", "9"]], false, true);
  const peg$c32 = function(parts: any): any { return ast.SExpNumber.floatVal(parts); };
  const peg$c33 = function(parts: any): any { return ast.SExpNumber.intVal(parts); };
  const peg$c34 = /^[+\-]/;
  const peg$c35 = peg$classExpectation(["+", "-"], false, false);
  const peg$c36 = "0";
  const peg$c37 = peg$literalExpectation("0", false);
  const peg$c38 = /^[0-9]/;
  const peg$c39 = peg$classExpectation([["0", "9"]], false, false);
  const peg$c40 = /^[1-9]/;
  const peg$c41 = peg$classExpectation([["1", "9"]], false, false);
  const peg$c42 = /^[eE]/;
  const peg$c43 = peg$classExpectation(["e", "E"], false, false);
  const peg$c44 = /^[\-+]/;
  const peg$c45 = peg$classExpectation(["-", "+"], false, false);

  let peg$currPos = 0;
  let peg$savedPos = 0;
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailPos = 0;
  let peg$maxFailExpected: Expectation[] = [];
  let peg$silentFails = 0;

  let peg$result;

  if (options.startRule !== undefined) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text(): string {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location(): IFileRange {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description: string, location1?: IFileRange) {
    location1 = location1 !== undefined
      ? location1
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location1
    );
  }

  function error(message: string, location1?: IFileRange) {
    location1 = location1 !== undefined
      ? location1
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location1);
  }

  function peg$literalExpectation(text1: string, ignoreCase: boolean): ILiteralExpectation {
    return { type: "literal", text: text1, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts: IClassParts, inverted: boolean, ignoreCase: boolean): IClassExpectation {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation(): IAnyExpectation {
    return { type: "any" };
  }

  function peg$endExpectation(): IEndExpectation {
    return { type: "end" };
  }

  function peg$otherExpectation(description: string): IOtherExpectation {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos: number) {
    let details = peg$posDetailsCache[pos];
    let p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos: number, endPos: number): IFileRange {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);

    return {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected1: Expectation) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected1);
  }

  function peg$buildSimpleError(message: string, location1: IFileRange) {
    return new SyntaxError(message, [], "", location1);
  }

  function peg$buildStructuredError(expected1: Expectation[], found: string | null, location1: IFileRange) {
    return new SyntaxError(
      SyntaxError.buildMessage(expected1, found),
      expected1,
      found,
      location1
    );
  }

  function peg$parsestart(): any {
    let s0;

    s0 = peg$parseSExps();

    return s0;
  }

  function peg$parseSExps(): any {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseSExp();
    if (s1 as any !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = [];
      s5 = peg$parseS();
      if (s5 as any !== peg$FAILED) {
        while (s5 as any !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parseS();
        }
      } else {
        s4 = peg$FAILED;
      }
      if (s4 as any !== peg$FAILED) {
        s5 = peg$parseSExp();
        if (s5 as any !== peg$FAILED) {
          peg$savedPos = s3;
          s4 = peg$c0(s1, s5);
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 as any !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = [];
        s5 = peg$parseS();
        if (s5 as any !== peg$FAILED) {
          while (s5 as any !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseS();
          }
        } else {
          s4 = peg$FAILED;
        }
        if (s4 as any !== peg$FAILED) {
          s5 = peg$parseSExp();
          if (s5 as any !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c0(s1, s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (s2 as any !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c1(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 as any === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseSExp();
      if (s1 as any !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parseS(): any {
    let s0;

    if (peg$c3.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c4); }
    }

    return s0;
  }

  function peg$parseSExp(): any {
    let s0;

    s0 = peg$parseNil();
    if (s0 as any === peg$FAILED) {
      s0 = peg$parseDecimalLiteral();
      if (s0 as any === peg$FAILED) {
        s0 = peg$parseCons();
        if (s0 as any === peg$FAILED) {
          s0 = peg$parseSymbol();
          if (s0 as any === peg$FAILED) {
            s0 = peg$parseString();
            if (s0 as any === peg$FAILED) {
              s0 = peg$parseList();
              if (s0 as any === peg$FAILED) {
                s0 = peg$parseQuoted();
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseString(): any {
    let s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s1 as any !== peg$FAILED) {
      s2 = [];
      if (peg$c7.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s3 as any === peg$FAILED) {
        s3 = peg$currPos;
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 92) {
          s5 = peg$c9;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s5 as any !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s6 as any !== peg$FAILED) {
            s5 = [s5, s6];
            s4 = s5;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 as any !== peg$FAILED) {
          s3 = input.substring(s3, peg$currPos);
        } else {
          s3 = s4;
        }
      }
      while (s3 as any !== peg$FAILED) {
        s2.push(s3);
        if (peg$c7.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s3 as any === peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 92) {
            s5 = peg$c9;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s5 as any !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c11); }
            }
            if (s6 as any !== peg$FAILED) {
              s5 = [s5, s6];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 as any !== peg$FAILED) {
            s3 = input.substring(s3, peg$currPos);
          } else {
            s3 = s4;
          }
        }
      }
      if (s2 as any !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s3 = peg$c5;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s3 as any !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c12(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseList(): any {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c13;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c14); }
    }
    if (s1 as any !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseS();
      while (s3 as any !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseS();
      }
      if (s2 as any !== peg$FAILED) {
        s3 = peg$parseSExps();
        if (s3 as any !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseS();
          while (s5 as any !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseS();
          }
          if (s4 as any !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s5 = peg$c15;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c16); }
            }
            if (s5 as any !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c17(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseCons(): any {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c13;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c14); }
    }
    if (s1 as any !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseS();
      while (s3 as any !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseS();
      }
      if (s2 as any !== peg$FAILED) {
        s3 = peg$parseSExps();
        if (s3 as any !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseS();
          if (s5 as any !== peg$FAILED) {
            while (s5 as any !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseS();
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 as any !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s5 = peg$c18;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c19); }
            }
            if (s5 as any !== peg$FAILED) {
              s6 = [];
              s7 = peg$parseS();
              if (s7 as any !== peg$FAILED) {
                while (s7 as any !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parseS();
                }
              } else {
                s6 = peg$FAILED;
              }
              if (s6 as any !== peg$FAILED) {
                s7 = peg$parseSExp();
                if (s7 as any !== peg$FAILED) {
                  s8 = [];
                  s9 = peg$parseS();
                  while (s9 as any !== peg$FAILED) {
                    s8.push(s9);
                    s9 = peg$parseS();
                  }
                  if (s8 as any !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s9 = peg$c15;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c16); }
                    }
                    if (s9 as any !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c20(s3, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseQuoted(): any {
    let s0, s1, s2;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 39) {
      s1 = peg$c21;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c22); }
    }
    if (s1 as any !== peg$FAILED) {
      s2 = peg$parseSExp();
      if (s2 as any !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c23(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseNil(): any {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c24) {
      s1 = peg$c24;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c25); }
    }
    if (s1 as any !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c26();
    }
    s0 = s1;
    if (s0 as any === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c13;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c14); }
      }
      if (s1 as any !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseS();
        while (s3 as any !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseS();
        }
        if (s2 as any !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c15;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c16); }
          }
          if (s3 as any !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseSymbol(): any {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$currPos;
    peg$silentFails++;
    if (input.charCodeAt(peg$currPos) === 46) {
      s2 = peg$c18;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c19); }
    }
    peg$silentFails--;
    if (s2 as any === peg$FAILED) {
      s1 = undefined;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 as any !== peg$FAILED) {
      s2 = peg$parseSymbolStart();
      if (s2 as any !== peg$FAILED) {
        s3 = [];
        s4 = peg$parseSymbolPart();
        while (s4 as any !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parseSymbolPart();
        }
        if (s3 as any !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c27(s2, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSymbolStart(): any {
    let s0;

    if (peg$c28.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c29); }
    }

    return s0;
  }

  function peg$parseSymbolPart(): any {
    let s0;

    if (peg$c30.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c31); }
    }

    return s0;
  }

  function peg$parseDecimalLiteral(): any {
    let s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$currPos;
    s3 = peg$parseDecimalSign();
    if (s3 as any === peg$FAILED) {
      s3 = null;
    }
    if (s3 as any !== peg$FAILED) {
      s4 = peg$parseDecimalIntegerLiteral();
      if (s4 as any !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s5 = peg$c18;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c19); }
        }
        if (s5 as any !== peg$FAILED) {
          s6 = peg$parseDecimalDigits();
          if (s6 as any === peg$FAILED) {
            s6 = null;
          }
          if (s6 as any !== peg$FAILED) {
            s7 = peg$parseExponentPart();
            if (s7 as any === peg$FAILED) {
              s7 = null;
            }
            if (s7 as any !== peg$FAILED) {
              s3 = [s3, s4, s5, s6, s7];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 as any !== peg$FAILED) {
      s1 = input.substring(s1, peg$currPos);
    } else {
      s1 = s2;
    }
    if (s1 as any !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c32(s1);
    }
    s0 = s1;
    if (s0 as any === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      s3 = peg$parseDecimalSign();
      if (s3 as any === peg$FAILED) {
        s3 = null;
      }
      if (s3 as any !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s4 = peg$c18;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c19); }
        }
        if (s4 as any !== peg$FAILED) {
          s5 = peg$parseDecimalDigits();
          if (s5 as any !== peg$FAILED) {
            s6 = peg$parseExponentPart();
            if (s6 as any === peg$FAILED) {
              s6 = null;
            }
            if (s6 as any !== peg$FAILED) {
              s3 = [s3, s4, s5, s6];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 as any !== peg$FAILED) {
        s1 = input.substring(s1, peg$currPos);
      } else {
        s1 = s2;
      }
      if (s1 as any !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c32(s1);
      }
      s0 = s1;
      if (s0 as any === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        s3 = peg$parseDecimalSign();
        if (s3 as any === peg$FAILED) {
          s3 = null;
        }
        if (s3 as any !== peg$FAILED) {
          s4 = peg$parseDecimalIntegerLiteral();
          if (s4 as any !== peg$FAILED) {
            s5 = peg$parseExponentPart();
            if (s5 as any === peg$FAILED) {
              s5 = null;
            }
            if (s5 as any !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 as any !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
        if (s1 as any !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c33(s1);
        }
        s0 = s1;
      }
    }

    return s0;
  }

  function peg$parseDecimalSign(): any {
    let s0;

    if (peg$c34.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c35); }
    }

    return s0;
  }

  function peg$parseDecimalIntegerLiteral(): any {
    let s0, s1, s2;

    if (input.charCodeAt(peg$currPos) === 48) {
      s0 = peg$c36;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c37); }
    }
    if (s0 as any === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseNonZeroDigit();
      if (s1 as any !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 as any === peg$FAILED) {
          s2 = null;
        }
        if (s2 as any !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseDecimalDigits(): any {
    let s0, s1;

    s0 = [];
    s1 = peg$parseDecimalDigit();
    if (s1 as any !== peg$FAILED) {
      while (s1 as any !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseDecimalDigit();
      }
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDecimalDigit(): any {
    let s0;

    if (peg$c38.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c39); }
    }

    return s0;
  }

  function peg$parseNonZeroDigit(): any {
    let s0;

    if (peg$c40.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c41); }
    }

    return s0;
  }

  function peg$parseExponentPart(): any {
    let s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parseExponentIndicator();
    if (s1 as any !== peg$FAILED) {
      s2 = peg$parseSignedInteger();
      if (s2 as any !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExponentIndicator(): any {
    let s0;

    if (peg$c42.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c43); }
    }

    return s0;
  }

  function peg$parseSignedInteger(): any {
    let s0, s1, s2;

    s0 = peg$currPos;
    if (peg$c44.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c45); }
    }
    if (s1 as any === peg$FAILED) {
      s1 = null;
    }
    if (s1 as any !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 as any !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

export interface IParseOptions {
  filename?: string;
  startRule?: string;
  tracer?: any;
  [key: string]: any;
}
export type ParseFunction = (input: string, options?: IParseOptions) => any;
export const parse: ParseFunction = peg$parse;

