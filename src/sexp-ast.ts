import { encode } from './elparser';

export abstract class SExpAbstract {
  isAtom() {
    return false;
  }
  isCons() {
    return false;
  }
  isList() {
    return false;
  }
  isAlist() {
    return false;
  }
  visit(_f: any) {
    throw "Not implemented!";
  } // for value mapping
  toJS() {
    throw "Not implemented!";
  }
  toStr(): string {
    throw "Not implemented!";
  }
}

export abstract class SExpAbstractAtom extends SExpAbstract {
  isAtom() {
    return true;
  }
}

export class SExpNil extends SExpAbstractAtom {
  toStr() {
    return "nil";
  }
  isList() {
    return true;
  }
  visit() {}
  toJS() {
    return null;
  }
}

// s: Symbol name
export class SExpSymbol extends SExpAbstractAtom {
  constructor(private symbol: string) {
    super();
  }
  toStr() {
    return this.symbol;
  }
  toJS() {
    return this.symbol; // just return a symbol-name as string.
  }
}

// str: String value
export class SExpString extends SExpAbstractAtom {
  constructor(private str: string) {
    super();
  }

  toStr() {
    return `"${this.str}"`;
    // return JSON.stringify(this.str);
  }

  toJS() {
    return this.str;
  }
}

// val: value
type SExpNumberType = { type: "int" | "float" };
const INTEGER: SExpNumberType = { type: "int" };
const FLOAT: SExpNumberType = { type: "float" };

export class SExpNumber extends SExpAbstractAtom {
  constructor(private type: SExpNumberType, private val: any) {
    super();
  }

  static intVal(val: any) {
    return new SExpNumber(INTEGER, val);
  }
  static floatVal(val: any) {
    return new SExpNumber(FLOAT, val);
  }

  toInt() {
    return parseInt(this.val, 10);
  }
  toFloat() {
    return parseFloat(this.val);
  }
  toStr() {
    return this.val;
  }
  toJS() {
    switch (this.type) {
      case INTEGER:
        return this.toInt();
      case FLOAT:
        return this.toFloat();
    }
    throw "Unknow SExpNumber type: " + this.type + " for " + this.val;
  }
}

export abstract class SExpAbstractCons extends SExpAbstract {
  isCons() {
    return true;
  }
}

// sexps: [sexp]
export class SExpList extends SExpAbstractCons {
  constructor(private list: Array<SExpAbstract>) {
    super();
  }

  getCar() {
    return this.list[0];
  }

  getCdr() {
    if (this.list.length < 2) return null;
    return new SExpList(this.list.slice(1));
  }

  isList() {
    return true;
  }

  toStr() {
    if (this.list.length === 0) {
      return "nil";
    }
    return `(${this.list.map((i) => i.toStr()).join(" ")})`;
  }

  visit(f) {
    this.list = this.list.map(f);
  }

  isAlist() {
    for (let i = 0; i < this.list.length; i++) {
      if (!this.list[i].isCons()) {
        return false;
      }
    }
    return true;
  }

  toJS() {
    return this.list.map((i) => i.toJS());
  }

  toObject() {
    const ret = {};
    this.list.forEach((item: SExpCons) => {
      if (!item.isCons()) {
        throw `${item.toStr()} is not alist form in [${this.toStr()}]`;
      }
      ret[item.getCar().toJS()] = item.getCdr().toJS();
    });
    return ret;
  }
}

// t1: term1, t2: term2
export class SExpCons extends SExpAbstractCons {
  constructor(private car: any, private cdr: any) {
    super();
  }
  isCons() {
    return true;
  }
  getCar() {
    return this.car;
  }
  getCdr() {
    return this.cdr;
  }
  toStr() {
    if (this.cdr.isList() && this.cdr.list.length == 0)
      return `(${this.car.toStr()})`;
    if (this.cdr.isList() && this.cdr.list.length > 0) {
      return `(${this.car.toStr()} ${this.cdr.list
        .map((i) => i.toStr())
        .join(" ")})`;
    }
    return `(${this.car.toStr()} . ${this.cdr.toStr()})`;
  }
  visit(f) {
    this.car = f(this.car);
    this.cdr = f(this.cdr);
  }
  toJS() {
    return [this.car.toJS(), this.cdr.toJS()];
  }
}

// (list . last)
export class SExpListDot extends SExpAbstractCons {
  constructor(private list: any, private last: any) {
    super();
  }
  getCar() {
    return this.list[0];
  }
  getCdr() {
    const len = this.list.length;
    if (len == 2) {
      return new SExpCons(this.list[1], this.last);
    }
    return new SExpListDot(this.list.slice(1), this.last);
  }
  isList() {
    return false;
  }
  toStr() {
    return (
      "(" +
      this.list
        .map(function (i) {
          return i.toStr();
        })
        .join(" ") +
      " . " +
      this.last.toStr() +
      ")"
    );
  }
  visit(f) {
    this.list = this.list.map(f);
    this.last = f(this.last);
  }
  toJS() {
    var ret = this.list.map(function (i) {
      return i.toJS();
    });
    ret.push(this.last.toJS());
    return ret;
  }
}
// sexp: sexp
export class SExpQuoted extends SExpAbstract {
  constructor(private qsexp: any) {
    super();
  }
  toStr() {
    return "'" + encode(this.qsexp);
  }
  visit(f) {
    this.qsexp.visit(f);
  }
  toJS() {
    return [this.qsexp.toJS()];
  }
}
