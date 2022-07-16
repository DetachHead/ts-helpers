import { Methods } from '../utilityTypes/Function'
import { AnyFunction } from 'tsdef'

/**
 * takes an object and binds the method with the given `methodName` to it.
 *
 * basically an alternative to `foo.doThing.bind(foo)` so you don't have to write `foo` twice
 * @example
 * bindThis(foo, 'doThing')
 */
export const bindThis = <Type, MethodName extends keyof Methods<Type>>(
    object: Type,
    methodName: MethodName,
): OmitThisParameter<Type[MethodName]> =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- we cast it back to a non-any type
    (object[methodName] as Type[MethodName] & AnyFunction).bind(object) as ReturnType<
        typeof bindThis
    >
