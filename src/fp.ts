export * as A from "fp-ts/lib/Array";
export * as Monoid from "fp-ts/lib/Monoid";
export * as N from "fp-ts/lib/number";
export * as OrdM from "fp-ts/lib/Ord";
export * as Ordering from "fp-ts/lib/Ordering";
export * as S from "fp-ts/lib/string";
export * as SetF from "fp-ts/lib/Set";
export * as Struct from "fp-ts/lib/struct";
export * as T from "fp-ts/lib/Task";
export { flow, pipe } from "fp-ts/lib/function";

import { sequenceS } from "fp-ts/lib/Apply";
import * as T from "fp-ts/lib/Task";

export const TAlt = {
  sequenceStruct: sequenceS(T.ApplyPar),
  sequenceArraySeq: sequenceS(T.ApplySeq),
  sequencyArrayPar: sequenceS(T.ApplyPar),
};
