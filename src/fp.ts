import * as Num from "fp-ts/number";
import * as O from "fp-ts/Option";

export { flow, pipe } from "fp-ts/function";
export * as O from "fp-ts/Option";
export * as A from "fp-ts/Array";

export const OAlt = {
  numberFromUnknown: O.fromPredicate(Num.isNumber),
};
