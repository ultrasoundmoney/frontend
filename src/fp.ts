import * as Num from "fp-ts/number";
import * as O from "fp-ts/Option";
import * as Str from "fp-ts/string";

export { flow, pipe } from "fp-ts/function";
export * as O from "fp-ts/Option";
export * as A from "fp-ts/Array";

export const OAlt = {
  numberFromUnknown: O.fromPredicate(Num.isNumber),
  stringFromUnknown: O.fromPredicate(Str.isString),
};
