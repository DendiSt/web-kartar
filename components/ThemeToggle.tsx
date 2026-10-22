'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative w-9 h-9 rounded-xl opacity-0" 
        aria-hidden="true" 
      />
    )
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const isDark = currentTheme === 'dark'

  const toggleTheme = () => {
    // Aktifkan transisi halus global pada seluruh halaman
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.classList.add('theme-transition')
      setTheme(isDark ? 'light' : 'dark')
      window.setTimeout(() => {
        root.classList.remove('theme-transition')
      }, 500)
    } else {
      setTheme(isDark ? 'light' : 'dark')
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative w-9 h-9 rounded-xl hover:bg-muted/80 active:scale-90 transition-transform duration-200 overflow-hidden text-foreground flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
      onClick={toggleTheme}
      title={isDark ? "Ganti ke Mode Terang (Light)" : "Ganti ke Mode Gelap (Dark)"}
      aria-label="Ubah Tema Tampilan"
    >
      {/* Icon Matahari (Light Mode) dengan animasi putar & susut saat berganti */}
      <Sun 
        className={`h-5 w-5 text-amber-500 transition-all duration-500 ease-in-out ${
          isDark 
            ? 'rotate-90 scale-0 opacity-0 pointer-events-none' 
            : 'rotate-0 scale-100 opacity-100'
        }`} 
      />

      {/* Icon Bulan (Dark Mode) dengan animasi putar & mekar dari sudut rotasi */}
      <Moon 
        className={`absolute h-5 w-5 text-blue-400 transition-all duration-500 ease-in-out ${
          isDark 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0 pointer-events-none'
        }`} 
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
