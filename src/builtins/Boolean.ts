export {}
declare global {
    interface Boolean {
        toString<T extends boolean>(this: T): `${T}`
    }
}
