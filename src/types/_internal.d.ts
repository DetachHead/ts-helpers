/*
this file needs to be a d.ts so the implementation of `indexedAccessCheck` doesn't get compiled away.
otherwise the `NoUncheckedIndexedAccess` type would always return `true` since this project's tsconfig has it enabled
*/

/**
 * the result of `find` functions such as `Array/find`, `Array/findAsync`, `Iterable/find`, etc.
 */
export type FindResult<T> =
    | {
          /** the result of the first `callback` that didn't return `undefined` or `null` */
          result: T
          /** the index in the array where that result occurred */
          index: number
      }
    | undefined


// eslint-disable-next-line jsdoc/check-tag-names -- https://github.com/microsoft/TypeScript/issues/38628#issuecomment-1378644305
/** @ts-expect-error need to use d.ts so the implementation doesn't get compiled away */
export declare const indexedAccessCheck = ([] as never[])[0]