export {}
declare global {
    interface BigInt {
        toString<T extends bigint>(this: T): `${T}`
    }
}
