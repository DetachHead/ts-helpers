/*
types for checking whether specific compiler options are enabled. useful when creating types that need to behave differently
depending on specific settings in `tsconfig.json`
*/
// this import needs src in it or it won't work when compiled
import { indexedAccessCheck } from '../../src/types/_internal'

/** whether or not `noUncheckedIndexedAccess` is enabled in this project */
export type NoUncheckedIndexedAccess = undefined extends typeof indexedAccessCheck ? true : false

/** whether or not `exactOptionalPropertyTypes` is enabled in this project */
export type ExactOptionalPropertyTypes = undefined extends Required<{
    value?: number | undefined
}>['value']
    ? true
    : false
