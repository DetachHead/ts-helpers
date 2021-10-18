export {}
declare global {
    interface RegExpMatchArray {
        // useful when using the `noUncheckedIndexedAccess` compiler option.
        // see https://github.com/microsoft/TypeScript/issues/42296
        0: string
    }
}
