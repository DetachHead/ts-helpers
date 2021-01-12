import {Primitive} from 'utility-types'

type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];

/**
 * creates a union type of numbers from 0 to generic `N`
 *
 * **WARNING:** this will probably fail on high numbers due to
 * `TS2589: Type instantiation is excessively deep and possibly infinite.`
 * @example
 * type Foo = Enumerate<3> //0|1|2
 * @see https://stackoverflow.com/a/63918062
 */
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;

/**
 * creates a range type of numbers from generics `FROM` (inclusive) to `TO` (inclusive)
 *
 * **WARNING:** this will probably fail on high numbers due to
 * `TS2589: Type instantiation is excessively deep and possibly infinite.`
 * @example
 * type Foo = Range<2, 5> //2|3|4|5
 * @see https://stackoverflow.com/a/63918062
 */
export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>> | TO;

/**
 * creates an array of type `T` with length `N` (starting from 1, same as {@link Array.prototype.length})
 *
 * **WARNING:** this will probably fail on high numbers due to
 * `TS2589: Type instantiation is excessively deep and possibly infinite.`
 * @example
 * type Foo = FixedSizeArray<string, 4> //[string, string, string, string]
 * @see https://gist.github.com/mstn/5f75651100556dbe30e405691471afe3
 */
export type FixedSizeArray<T, N extends number> = {
    //TODO: figure out why this is
    //@ts-expect-error template literal type w/ generic here is failing, not sure why but the type still works if we just ignore the error
    readonly [k in Enumerate<N>]: T;
} & { length: N } & Readonly<T[]>;

/**
 * creates a stringified version of `T`
 * @example
 * type Foo = ToString<1|2> //'1'|'2'
 */
export type ToString<T extends Exclude<Primitive, symbol>> = `${T}`