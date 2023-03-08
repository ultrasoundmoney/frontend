export * as A from "fp-ts/lib/Array";
export * as E from "fp-ts/lib/Either";
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
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

export const TAlt = {
  sequenceStruct: sequenceS(T.ApplyPar),
  sequenceArraySeq: sequenceS(T.ApplySeq),
  sequencyArrayPar: sequenceS(T.ApplyPar),
};

type ErrorLike = { error: Error };
type ErrorLikeB = { type: string; message: string };

const getOrThrow = <A>(
  te: TE.TaskEither<string | Error | ErrorLike | ErrorLikeB, A>,
): T.Task<A> =>
  pipe(
    te,
    TE.getOrElse((e): never => {
      if (e instanceof Error) {
        throw e;
      }

      if (typeof e === "string") {
        throw new Error(e);
      }

      if ("error" in e && e.error instanceof Error) {
        throw e.error;
      }

      if ("type" in e) {
        throw new Error(`${e.type}: ${e.message}`);
      }

      throw new Error(
        "failed to throw on getOrThrow, left is not an error and not a string",
      );
    }),
  );

export const TEAlt = {
  getOrThrow,
};
