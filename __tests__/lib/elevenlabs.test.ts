import { useElevenLabs } from '../../lib/elevenlabs'
import { renderHook } from '@testing-library/react'

// TextEncoder polyfill for Jest
global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

// Mock fetch globally
global.fetch = jest.fn()

// Mock URL.createObjectURL since it's not available in Jest environment
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url')
global.URL.revokeObjectURL = jest.fn()

// Mock Audio constructor
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
})) as any

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock speechSynthesis
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => [])
} as any

describe('useElevenLabs Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null) // Default: sound enabled
    
    // Mock successful fetch response by default
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
    })
  })

  it('useElevenLabs hook başlangıç state\'ini doğru setlemeli', () => {
    const { result } = renderHook(() => useElevenLabs())
    
    expect(result.current).toHaveProperty('speak')
    expect(result.current).toHaveProperty('getVoices')
    expect(result.current).toHaveProperty('testVoice')
    expect(result.current).toHaveProperty('getApiStatus')
    expect(result.current).toHaveProperty('getTestTexts')
    expect(typeof result.current.speak).toBe('function')
    expect(typeof result.current.getVoices).toBe('function')
  })

  it('getTestTexts fonksiyonu doğru test metinlerini döndürmeli', () => {
    const { result } = renderHook(() => useElevenLabs())
    
    const testTexts = result.current.getTestTexts()
    
    expect(testTexts).toHaveProperty('letter')
    expect(testTexts).toHaveProperty('word')
    expect(testTexts).toHaveProperty('sentence')
    expect(testTexts).toHaveProperty('celebration')
    
    expect(Array.isArray(testTexts.letter)).toBe(true)
    expect(Array.isArray(testTexts.word)).toBe(true)
    expect(Array.isArray(testTexts.sentence)).toBe(true)
    expect(Array.isArray(testTexts.celebration)).toBe(true)
  })

  it('ses ayarları localStorage\'dan okunmalı', () => {
    localStorageMock.getItem.mockReturnValue('false') // Sound disabled
    
    const { result } = renderHook(() => useElevenLabs())
    
    // Hook çalışmalı, ses kapalı olsa bile
    expect(result.current.speak).toBeDefined()
  })
}) 