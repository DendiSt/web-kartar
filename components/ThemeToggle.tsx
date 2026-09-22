'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure hydration mismatch doesn't occur by only rendering the toggle after mounting
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a dummy button with the same dimensions to avoid layout shift
    return <Button variant="ghost" size="icon" className="w-9 h-9 opacity-0" />
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="w-9 h-9" 
      onClick={toggleTheme}
      title="Ubah Tema"
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5 transition-all" />
      ) : (
        <Sun className="h-5 w-5 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
