import { encode, parseSexp, parseSexp1, SerializationError } from "./elparser";
import { SyntaxError } from "./elsexp";
import {
  SExpAbstract,
  SExpCons,
  SExpList,
  SExpNil,
  SExpNumber,
  SExpString,
  SExpSymbol,
  SExpQuoted,
} from "./sexp-ast";

const ast = {
  SExpAbstract,
  SExpCons,
  SExpList,
  SExpNil,
  SExpNumber,
  SExpString,
  SExpSymbol,
  SExpQuoted,
  SerializationError,
  SyntaxError,
};

export {
  SExpAbstract,
  SExpCons,
  SExpList,
  SExpNil,
  SExpNumber,
  SExpString,
  SExpSymbol,
  SExpQuoted,
  SerializationError,
  SyntaxError,
  parseSexp as parse,
  parseSexp1 as parse1,
  encode,
  ast,
};
