import { Head, PadStart, SplitByLength, Tail } from './String'
import { TupleOf } from './Array'
import { Decrement, Multiply, NumberToBinary, Subtract } from './Number'
import { Length } from 'ts-toolbelt/out/String/Length'

interface AsciiToBinaryMap {
  a: '01100001'
  b: '01100010'
  c: '01100011'
  d: '01100100'
  e: '01100101'
  f: '01100110'
  g: '01100111'
  h: '01101000'
  i: '01101001'
  j: '01101010'
  k: '01101011'
  l: '01101100'
  m: '01101101'
  n: '01101110'
  o: '01101111'
  p: '01110000'
  q: '01110001'
  r: '01110010'
  s: '01110011'
  t: '01110100'
  u: '01110101'
  v: '01110110'
  w: '01110111'
  x: '01111000'
  y: '01111001'
  z: '01111010'
  A: '01000001'
  B: '01000010'
  C: '01000011'
  D: '01000100'
  E: '01000101'
  F: '01000110'
  G: '01000111'
  H: '01001000'
  I: '01001001'
  J: '01001010'
  K: '01001011'
  L: '01001100'
  M: '01001101'
  N: '01001110'
  O: '01001111'
  P: '01010000'
  Q: '01010001'
  R: '01010010'
  S: '01010011'
  T: '01010100'
  U: '01010101'
  V: '01010110'
  W: '01010111'
  X: '01011000'
  Y: '01011001'
  Z: '01011010'
  0: '00110000'
  1: '00110001'
  2: '00110010'
  3: '00110011'
  4: '00110100'
  5: '00110101'
  6: '00110110'
  7: '00110111'
  8: '00111000'
  9: '00111001'
  ' ': '00100000'
}

// my attempt at implementing sha256 wtf is wrong with me
// https://qvault.io/cryptography/how-sha-2-works-step-by-step-sha-256/

// step 1
type AddByteUntil<
  Bytes extends string[],
  NumOfBytes extends number
> = Bytes['length'] extends NumOfBytes
  ? Bytes
  : ['00000000', ...AddByteUntil<Bytes, Decrement<NumOfBytes>>]

type NumberToBinaryInBytes<T extends number, Bytes extends number> = AddByteUntil<
  // @ts-expect-error stack depth
  SplitByLength<PadStart<NumberToBinary<T>, 8, 0>, 8>,
  Bytes
>

type AsciiToBinary<T extends string> = T extends ''
  ? []
  : [
      // @ts-expect-error who asked
      AsciiToBinaryMap[Head<T>],
      ...AsciiToBinary<Tail<T>>
    ]

// TODO: actually only works for 64 bytes like a boss
type AddToArrayUntilMultipleOf64Bytes<T extends string[]> = [
  ...T,
  ...TupleOf<'00000000', Subtract<64, T['length']>>
]

type Block<T extends string> = [
  ...AddToArrayUntilMultipleOf64Bytes<
    // @ts-expect-error ffuck off
    [...AsciiToBinary<T>, '10000000']
  >,
  ...NumberToBinaryInBytes<
    // @ts-expect-error fuck off
    Multiply<Length<T>, 8>,
    8
  >
]

// TODO: the rest of the steps
