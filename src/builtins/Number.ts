export {}
declare global {
    interface Number {
        toString<T extends number>(this: T): `${T}`
    }
}
