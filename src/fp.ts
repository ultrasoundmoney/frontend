export * as A from "fp-ts/lib/Array";
export * as D from "io-ts/Decoder";
export * as E from "fp-ts/lib/Either";
export * as MapF from "fp-ts/lib/Map";
export * as Monoid from "fp-ts/lib/Monoid";
export * as N from "fp-ts/lib/number";
export * as NEA from "fp-ts/lib/NonEmptyArray";
export * as O from "fp-ts/lib/Option";
export * as OrdM from "fp-ts/lib/Ord";
export * as Ordering from "fp-ts/lib/Ordering";
export * as R from "fp-ts/lib/Record";
export * as RA from "fp-ts/lib/ReadonlyArray";
export * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
export * as S from "fp-ts/lib/string";
export * as SetF from "fp-ts/lib/Set";
export * as Struct from "fp-ts/lib/struct";
export * as T from "fp-ts/lib/Task";
export * as TE from "fp-ts/lib/TaskEither";
export * as TO from "fp-ts/lib/TaskOption";
export { flow, pipe } from "fp-ts/lib/function";

import * as E from "fp-ts/lib/Either";
import * as MapF from "fp-ts/lib/Map";
import * as O from "fp-ts/lib/Option";
import * as S from "fp-ts/lib/string";
import * as T from "fp-ts/lib/Task";
import type * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";

export const TAlt = {
  sequenceArraySeq: sequenceS(T.ApplySeq),
  sequenceStructPar: sequenceS(T.ApplyPar),
  sequenceStructSeq: sequenceS(T.ApplySeq),
  sequencyArrayPar: sequenceS(T.ApplyPar),
};

type ErrorLike = { error: Error };
type ErrorLikeB = { type: string; message: string };

const getIsErrorLike = (e: unknown): e is ErrorLike =>
  typeof e === "object" && e !== null && "error" in e;

const getIsErrorLikeB = (e: unknown): e is ErrorLikeB =>
  typeof e === "object" && e !== null && "type" in e && "message" in e;

const unwrap = <E, A>(e: E.Either<E, A>): A =>
  pipe(
    e,
    E.getOrElse((e): A => {
      if (e instanceof Error) {
        throw e;
      }

      if (typeof e === "string") {
        throw new Error(e);
      }

      if (getIsErrorLike(e)) {
        throw (e as { error: unknown }).error;
      }

      if (getIsErrorLikeB(e)) {
        throw new Error(`${e.type}: ${e.message}`);
      }

      throw new Error(
        "failed to throw on getOrThrow, left is not an error and not a string",
      );
    }),
  );

export const TEAlt = {
  unwrap: <E, A>(te: TE.TaskEither<E, A>): T.Task<A> =>
    pipe(
      te,
      T.map((e) => unwrap(e)),
    ),
};

export const MapFS = {
  lookup: MapF.lookup(S.Eq),
  upsertAt: MapF.upsertAt(S.Eq),
};

export const EAlt = {
  unwrap,
  sequenceArray: sequenceS(E.Apply),
  sequenceStruct: sequenceS(E.Apply),
};

export const OAlt = {
  expect:
    (message: string) =>
    <A>(o: O.Option<A>): A =>
      pipe(
        o,
        O.getOrElse((): A => {
          throw new Error(message);
        }),
      ),
  sequenceStruct: sequenceS(O.Apply),
  sequenceTuple: sequenceT(O.Apply),
  unwrap: <A>(o: O.Option<A>): A => pipe(o, OAlt.expect("unwrap on none")),
};
