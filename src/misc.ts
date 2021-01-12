/**
 * narrows the given value from type `Base` to type `Narrowed` without having to assign it to a new variable
 * @example
 * declare const foo: number
 * cast<number, 1|2>(foo)
 * type Bar = typeof foo //1|2
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function cast<Base, Narrowed extends Base>(_value: Base): asserts _value is Narrowed {}

/**
 * unsafely casts the given value to type `T` without having to assign it to a new variable.
 * @example
 * declare const foo: number
 * cast<number, 1|2>(foo)
 * type Bar = typeof foo //1|2
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function unsafeCast<T>(_value: unknown): asserts _value is T {}