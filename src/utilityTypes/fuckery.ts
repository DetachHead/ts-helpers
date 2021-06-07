import { DuplicateString, Head, PadStart, SplitByLength, Tail } from './String'
import { Slice, TupleOf } from './Array'
import { Decrement, Multiply, NumberToBinary, Subtract } from './Number'
import { Length } from 'ts-toolbelt/out/String/Length'
import { Join } from 'ts-toolbelt/out/String/Join'

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

const block: Block<'hello'>

// step 2

type H0 = 0x6a09e667
type H1 = 0xbb67ae85
type H2 = 0x3c6ef372
type H3 = 0xa54ff53a
type H4 = 0x510e527f
type H5 = 0x9b05688c
type H6 = 0x1f83d9ab
type H7 = 0x5be0cd19

// step 3

type consts = [
  0x428a2f98,
  0x71374491,
  0xb5c0fbcf,
  0xe9b5dba5,
  0x3956c25b,
  0x59f111f1,
  0x923f82a4,
  0xab1c5ed5,
  0xd807aa98,
  0x12835b01,
  0x243185be,
  0x550c7dc3,
  0x72be5d74,
  0x80deb1fe,
  0x9bdc06a7,
  0xc19bf174,
  0xe49b69c1,
  0xefbe4786,
  0x0fc19dc6,
  0x240ca1cc,
  0x2de92c6f,
  0x4a7484aa,
  0x5cb0a9dc,
  0x76f988da,
  0x983e5152,
  0xa831c66d,
  0xb00327c8,
  0xbf597fc7,
  0xc6e00bf3,
  0xd5a79147,
  0x06ca6351,
  0x14292967,
  0x27b70a85,
  0x2e1b2138,
  0x4d2c6dfc,
  0x53380d13,
  0x650a7354,
  0x766a0abb,
  0x81c2c92e,
  0x92722c85,
  0xa2bfe8a1,
  0xa81a664b,
  0xc24b8b70,
  0xc76c51a3,
  0xd192e819,
  0xd6990624,
  0xf40e3585,
  0x106aa070,
  0x19a4c116,
  0x1e376c08,
  0x2748774c,
  0x34b0bcb5,
  0x391c0cb3,
  0x4ed8aa4a,
  0x5b9cca4f,
  0x682e6ff3,
  0x748f82ee,
  0x78a5636f,
  0x84c87814,
  0x8cc70208,
  0x90befffa,
  0xa4506ceb,
  0xbef9a3f7,
  0xc67178f2,
]

// step 4 (its just a description of the next steps)

// step 5:

type _MessageSchedule<T extends string[]> = [] extends T
  ? []
  : [
      Join<
        // @ts-expect-error false positive i think.........
        Slice<T, 0, 4>,
        ''
      >,
      ..._MessageSchedule<Slice<T, 4>>
    ]

type MessageSchedule<T extends string[]> = [
  ..._MessageSchedule<T>,
  ...TupleOf<DuplicateString<'0', 32>, 48>
]
// TODO: the rest of step 5
