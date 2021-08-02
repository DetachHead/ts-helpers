/**
 * Checks if two types are equal at the type level.
 *
 * correctly checks `any` and `never`
 */
export type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false

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
