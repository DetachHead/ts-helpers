/**
 * checks if two types are equal
 */
export type Equals<A, B> = A extends B ? (B extends A ? true : false) : false

/**
 * the compiler sees this as `undefined` if `noUncheckedIndexedAccess` is enabled, and `never` if it's not.
 * used by {@link NoUncheckedIndexedAccess}
 */
// TODO: figure out a way to do this without stuff existing at runtime
const _indexedAccessCheck = ([] as never[])[0]

/**
 * `true` if `noUncheckedIndexedAccess` is set, else `false`. useful when creating types that need to behave differently
 * based on this compiler option
 */
export type NoUncheckedIndexedAccess = undefined extends typeof _indexedAccessCheck ? true : false
