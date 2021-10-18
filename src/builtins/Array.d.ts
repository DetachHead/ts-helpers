export {}
// this sucks because of these issues:
//  https://github.com/millsp/ts-toolbelt/issues/260
//  https://github.com/microsoft/TypeScript/issues/46394

// declare global {
//     interface ReadonlyArray<T> {
//         join<Arr extends ReadonlyArray<Literal>, D extends string = ','>(
//             this: Arr,
//             ...delimiter: OptionalParameterFromGeneric<D, ','>
//         ): Join<Arr, D>
//     }
//     interface Array<T> extends ReadonlyArray<T> {
//         join<Arr extends ReadonlyArray<Literal>, D extends string = ','>(
//             this: Arr,
//             ...delimiter: OptionalParameterFromGeneric<D, ','>
//         ): Join<Arr, D>
//     }
// }
