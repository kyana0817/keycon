import React, {
  createContext,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react'

import { SUPPORT_KEYS, SUPPORT_NAMES } from './constants'
import type { ParticalOrderHotkey } from './HotkeyPattern'
import { keyboardEventLitener } from './utils'

type ScopeType = string

type ScopesType = ScopeType[]

type HotkeyProcessType = {
  scopes: ScopesType
  fn: (e: KeyboardEvent) => void
}

type HotkeyHandlesType = {
  [key in ParticalOrderHotkey]?: HotkeyProcessType
}

type HotkeySchemaType = {
  [key in ParticalOrderHotkey]?: HotkeyProcessType
}

type HotkeyContextType = {
  handles: React.MutableRefObject<HotkeySchemaType>
  scopes: React.MutableRefObject<ScopesType>
}

type HotkeyProviderProps = {
  schema: HotkeySchemaType
  initialScopes?: ScopesType
  children: React.ReactNode
}

const initialState: HotkeyContextType = {
  handles: { current: {} },
  scopes: { current: [] },
}

const HotkeyContext = createContext<HotkeyContextType>(initialState)

const keyBranch = ({ key }: { key: string }) => {
  const str = key.toLowerCase()
  return (SUPPORT_NAMES as ReadonlyArray<string>).includes(str)
    ? undefined
    : str
}

const formatShortcut = (e: KeyboardEvent): ParticalOrderHotkey =>
  [
    ...SUPPORT_KEYS.map((item) => (e[item.property] ? item.name : undefined)),
    keyBranch(e),
  ]
    .filter((item) => item)
    .join(' + ') as ParticalOrderHotkey

function hotkeyEvent(this: HotkeyContextType, e: KeyboardEvent): void {
  const shortcut = formatShortcut(e)
  const handles = this.handles.current[shortcut]

  if (
    handles &&
    handles.scopes.every((item) => this.scopes.current.includes(item))
  ) {
    handles.fn(e)
  }
}

export const useAddHotKey = (
  keyMap: ParticalOrderHotkey,
  process: HotkeyProcessType
) => {
  const { handles } = useContext(HotkeyContext)
  useEffect(() => {
    handles.current[keyMap] = process
    return () => {
      handles.current = Object.fromEntries(
        Object.entries(handles.current).filter(([key, _]) => key !== keyMap)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

type HandleEnabledFn = (enabledScopes: ScopesType) => () => void

export const useScopes = () => {
  const { scopes } = useContext(HotkeyContext)
  const handleEnabled: HandleEnabledFn = useCallback((enabledScopes) => {
    scopes.current = [...enabledScopes, ...scopes.current].filter(
      (item, idx, arr) => arr.indexOf(item) === idx
    )

    return () => {
      scopes.current = scopes.current.filter(
        (item) => !enabledScopes.includes(item)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { handleEnabled, scopes: scopes.current }
}

export const HotkeyProvider = ({
  schema = {},
  initialScopes = [],
  children,
}: HotkeyProviderProps): JSX.Element => {
  const handles = useRef<HotkeyHandlesType>(schema)
  const scopes = useRef<ScopesType>(initialScopes)

  useEffect(() => {
    const bindFn = hotkeyEvent.bind({ handles, scopes })
    const eventRemover = keyboardEventLitener(bindFn)
    return () => {
      eventRemover()
    }
  }, [])

  return (
    <HotkeyContext.Provider value={{ handles, scopes }}>
      {children}
    </HotkeyContext.Provider>
  )
}
