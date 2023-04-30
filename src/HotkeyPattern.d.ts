type SupportKey = 'alt' | 'control' | 'shift'
type DigitKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'
type AlfabetKey =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'm'
  | 'x'
  | 'y'
  | 'z'

type SymbolKey =
  | 'comma'
  | 'period'
  | 'semicolon'
  | 'quote'
  | 'bracket'
  | 'backquote'
  | 'backslash'
  | 'minus'
  | 'equal'
  | 'intlro'
  | 'intlyen'

type AllKey = SupportKey | DigitKey | AlfabetKey | SymbolKey
type P<L extends string, R extends string> = `${L} + ${R}`
type EP<L extends string, R extends string> = `${`${L} + ` | ''}${R}`

type Pattern<T, E = '', R = ''> = R extends ''
  ? T extends infer U
    ? U extends `${infer S0 extends SupportKey} + ${infer S1}`
      ? S1 extends P<string, string>
        ? P<S0, Pattern<T, S0, S1>>
        : P<S0, Exclude<AllKey, S0>>
      : AllKey
    : never
  : R extends `${infer S0 extends Exclude<SupportKey, E>} + ${infer S1}`
  ? S1 extends P<string, string>
    ? P<S0, Pattern<T, E | S0, S1>>
    : P<S0, Exclude<AllKey, E | S0>>
  : Exclude<AllKey, E>

type NoParticularPattern = EP<
  SupportKey,
  EP<SupportKey, EP<SupportKey, AllKey>>
>
type ParticularPattern = EP<'alt', EP<'control', EP<'shift', AllKey>>>

export type NoParticalOrderHotkey = Pattern<NoParticularPattern>
export type ParticalOrderHotkey = Exclude<
  Pattern<ParticularPattern>,
  'alt + shift + control'
>
