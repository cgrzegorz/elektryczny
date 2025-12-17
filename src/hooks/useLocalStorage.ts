import { useState, useEffect } from 'react'

/**
 * Custom hook do synchronizacji state z localStorage
 * @param key - klucz w localStorage
 * @param initialValue - wartość początkowa
 * @returns [value, setValue] - tak jak useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Pobierz wartość z localStorage przy pierwszym renderze
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Zapisz do localStorage przy każdej zmianie wartości
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Pozwól na użycie funkcji (jak w useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      // Zapisz do localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))

      // Wyślij event dla innych tabów/okien
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Nasłuchuj zmian z innych tabów
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error syncing localStorage key "${key}":`, error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue]
}

/**
 * Funkcje pomocnicze do zarządzania localStorage
 */
export const localStorageUtils = {
  /**
   * Zapisz dane do localStorage
   */
  save: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving to localStorage:`, error)
    }
  },

  /**
   * Odczytaj dane z localStorage
   */
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error loading from localStorage:`, error)
      return defaultValue
    }
  },

  /**
   * Usuń dane z localStorage
   */
  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage:`, error)
    }
  },

  /**
   * Wyczyść cały localStorage
   */
  clear: (): void => {
    try {
      window.localStorage.clear()
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
    }
  },

  /**
   * Sprawdź czy klucz istnieje
   */
  exists: (key: string): boolean => {
    return window.localStorage.getItem(key) !== null
  },
}

