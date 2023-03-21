/*
this file needs to be a d.ts so the implementation doesn't get compiled away.
otherwise the `NoUncheckedIndexedAccess` type would always return `true` since this project's tsconfig has it enabled
*/
// eslint-disable-next-line jsdoc/check-tag-names -- https://github.com/microsoft/TypeScript/issues/38628#issuecomment-1378644305
/** @ts-expect-error see above */
export declare const noUncheckedIndexedAccessChecker = ([] as never[])[0]