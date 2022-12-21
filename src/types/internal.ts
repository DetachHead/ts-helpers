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
