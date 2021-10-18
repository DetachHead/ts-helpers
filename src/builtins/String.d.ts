import { Split } from 'ts-toolbelt/out/String/Split'
import { OptionalParameterFromGeneric } from '../utilityTypes/misc'
import {
    CharAt,
    EndsWith,
    Includes,
    IndexOf,
    PadStart,
    Replace,
    ReplaceOne,
    StartsWith,
    Substring,
} from '../utilityTypes/String'

declare global {
    interface RegExpMatchArray {
        // useful when using the `noUncheckedIndexedAccess` compiler option.
        // see https://github.com/microsoft/TypeScript/issues/42296
        0: string
    }
    interface String {
        // TODO: remove these once https://github.com/microsoft/TypeScript/pull/46387 is merged
        toUpperCase<T extends string>(this: T): Uppercase<T>

        toLowerCase<T extends string>(this: T): Lowercase<T>

        split<T extends string, Delimiter extends string>(
            this: T,
            delimiter: Delimiter,
        ): Split<T, Delimiter>

        indexOf<T extends string, Substring extends string>(
            this: T,
            substring: Substring,
        ): IndexOf<T, Substring>

        includes<T extends string, Substring extends string>(
            this: T,
            substring: Substring,
        ): Includes<T, Substring>

        startsWith<T extends string, CheckStart extends string>(
            this: T,
            checkStart: CheckStart,
        ): StartsWith<T, CheckStart>

        endsWith<T extends string, CheckEnd extends string>(
            this: T,
            checkEnd: CheckEnd,
        ): EndsWith<T, CheckEnd>

        padStart<T extends string, Size extends number, PadString extends string = ' '>(
            this: T,
            length: Size,
            ...padString: OptionalParameterFromGeneric<PadString, ' '>
        ): PadStart<T, Size, PadString>

        substring<T extends string, StartIndex extends number, EndIndex extends number>(
            this: T,
            start: StartIndex,
            end: EndIndex,
        ): Substring<T, StartIndex, EndIndex>

        charAt<T extends string, Index extends number>(this: T, index: Index): CharAt<T, Index>

        replace<T extends string, Find extends string, ReplaceWithString extends string>(
            this: T,
            find: Find,
            replace: ReplaceWithString,
        ): ReplaceOne<T, Find, ReplaceWithString>

        replaceAll<T extends string, Find extends string, ReplaceWithString extends string>(
            this: T,
            find: Find,
            replace: ReplaceWithString,
        ): Replace<T, Find, ReplaceWithString>

        toString<T extends string>(this: T): T
    }
}
