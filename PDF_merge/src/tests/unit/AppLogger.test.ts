import { describe, it, expect, vi, beforeEach } from 'vitest'
import logger from '../../utils/AppLogger'

describe('AppLogger', () => {
  beforeEach(() => {
    // Clear console mocks
    vi.clearAllMocks()
  })

  it('logs info messages', () => {
    const consoleSpy = vi.spyOn(console, 'info')
    logger.info('Test info message')
    
    expect(consoleSpy).toHaveBeenCalled()
    expect(consoleSpy.mock.calls[0][1]).toBe('Test info message')
  })

  it('logs error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    logger.error('Test error message')
    
    expect(consoleSpy).toHaveBeenCalled()
    expect(consoleSpy.mock.calls[0][1]).toBe('Test error message')
  })

  it('logs warning messages', () => {
    const consoleSpy = vi.spyOn(console, 'warn')
    logger.warn('Test warning message')
    
    expect(consoleSpy).toHaveBeenCalled()
    expect(consoleSpy.mock.calls[0][1]).toBe('Test warning message')
  })

  it('logs debug messages', () => {
    const consoleSpy = vi.spyOn(console, 'debug')
    logger.debug('Test debug message')
    
    // Debug messages may be skipped in non-development mode
    if (import.meta.env.MODE === 'development') {
      expect(consoleSpy).toHaveBeenCalled()
      expect(consoleSpy.mock.calls[0][1]).toBe('Test debug message')
    } else {
      expect(consoleSpy).not.toHaveBeenCalled()
    }
  })

  it('includes timestamp and level in logs', () => {
    const consoleSpy = vi.spyOn(console, 'info')
    logger.info('Test message')
    
    const loggedPrefix = consoleSpy.mock.calls[0][0]
    expect(loggedPrefix).toMatch(/\[.*\] \[INFO\]/)
  })

  it('handles additional arguments', () => {
    const consoleSpy = vi.spyOn(console, 'info')
    const extraData = { key: 'value' }
    logger.info('Test message', extraData)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.any(String),
      'Test message',
      extraData
    )
  })
})
