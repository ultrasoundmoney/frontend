export { flow, pipe } from "fp-ts/lib/function";
export * as T from "fp-ts/lib/Task";

import { sequenceS } from "fp-ts/lib/Apply";
import * as T from "fp-ts/lib/Task";

export const TAlt = {
  sequenceStruct: sequenceS(T.ApplyPar),
  sequenceArraySeq: sequenceS(T.ApplySeq),
  sequencyArrayPar: sequenceS(T.ApplyPar),
};
