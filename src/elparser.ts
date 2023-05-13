// import { createLogger } from '@coc-emacs/logger';
import { parse } from './elsexp';
import { SExpAbstract, SExpList, SExpNil, SExpNumber, SExpString, SExpSymbol } from './sexp-ast';

// const logger = createLogger('elparser');

export class SerializationError {
  constructor(public message: string) {
    // super(message);
  }
}

/**
 * @param {string} str S-expression text
 */
export function parseSexp(str: string): SExpAbstract[] {
  return parse(str.trim());
}

/**
 * @param {string} str S-expression text
 */
export function parseSexp1(str: string): SExpAbstract {
    return parseSexp(str)[0];
}


export function encode(obj:  Array<any> | Record<string, any> | string | number | boolean, throwException?: boolean) {
    return _encode(obj, throwException).toStr();
}

const escMap = { '\\': '\\\\', '"': '\\"', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'};

function _encode(obj: Array<any> | Record<string, any> | string | number | boolean, throwException?: boolean): SExpAbstract {
    if (obj === null || obj === undefined) return new SExpNil();
    if (Number.isNaN(obj) && throwException) {
        throw new SerializationError('NaN can not be encoded.');
    }
    if (typeof obj === 'string') {
        let str = obj;
        Object.entries(escMap).forEach(([s, q]) => {
            str = str.replaceAll(s, q);
        });
        return new SExpString(str);
    } else if (typeof obj === "number" || obj instanceof Number) {
        if (Number.isFinite(obj)) {
            return +obj % 1 === 0 ? SExpNumber.intVal(obj) : SExpNumber.floatVal(obj);
        } else if (throwException) {
            throw new SerializationError('Infinite can not be encoded.');
        } else {
            return new SExpNil();
        }
    } else if (typeof obj === 'boolean' || obj instanceof Boolean) {
        return obj ? new SExpSymbol('t') : new SExpNil();
    } else if (Array.isArray(obj)) {
        return new SExpList(obj.map(i => _encode(i, throwException)));
    } else if (obj instanceof SExpAbstract) {
        return obj; // pass as is
    } else if (obj instanceof Date ||
        obj instanceof RegExp ||
        obj instanceof Error ||
        obj instanceof Function) {
        // do nothing
    } else if (obj instanceof Object || Object.prototype.toString.call(obj) === '[object Object]') {
        const items: SExpAbstract[] = [];
        for (const key in obj) {
            items.push(new SExpSymbol(`:${key}`));
            items.push(_encode(obj[key]));
        }
        return new SExpList(items);
    }

    if (throwException) {
        throw new SerializationError(`Unknown object type: ${obj.toString()}/${typeof obj}`)
    }
    // logger.error('WARN: Unknown object type: ', obj, JSON.stringify(Object.getPrototypeOf(obj)));
    return new SExpString(obj.toString());
}

export function encodeMult(objs: Array<any>, sep?: string, throwException?: boolean): string {
    if (!sep) {
        sep = ' ';
    }
    return objs.map(i => encode(i, throwException)).join(sep);
}
