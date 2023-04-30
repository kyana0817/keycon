import { useEffect } from 'react'

const monitor = (e: KeyboardEvent) => {
  console.log(e)
}

export default function () {
  useEffect(() => {
    document.addEventListener('keydown', monitor)
    return () => {
      document.removeEventListener('keydown', monitor)
    }
  }, [])
}
