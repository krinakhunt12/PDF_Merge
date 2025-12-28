import { describe, it, expect, vi } from 'vitest'
import { withTimeout, withMinLoadingTime } from '../../utils/loadingTimeout'

describe('Loading Timeout Utilities', () => {
  describe('withTimeout', () => {
    it('resolves when promise completes within timeout', async () => {
      const promise = Promise.resolve('success')
      const result = await withTimeout(promise, { timeout: 1000 })
      
      expect(result).toBe('success')
    })

    it('rejects when promise exceeds timeout', async () => {
      const promise = new Promise((resolve) => setTimeout(resolve, 2000))
      
      await expect(
        withTimeout(promise, { timeout: 100, timeoutMessage: 'Timed out' })
      ).rejects.toThrow('Timed out')
    })

    it('uses default timeout when not specified', async () => {
      const promise = Promise.resolve('success')
      const result = await withTimeout(promise)
      
      expect(result).toBe('success')
    })

    it('calls onTimeout callback when timeout occurs', async () => {
      const onTimeout = vi.fn()
      const promise = new Promise((resolve) => setTimeout(resolve, 2000))
      
      await expect(
        withTimeout(promise, { timeout: 100, onTimeout })
      ).rejects.toThrow()
      
      expect(onTimeout).toHaveBeenCalled()
    })

    it('clears timeout on success', async () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
      const promise = Promise.resolve('success')
      
      await withTimeout(promise, { timeout: 1000 })
      
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('withMinLoadingTime', () => {
    it('waits for minimum loading time', async () => {
      const startTime = Date.now()
      const promise = Promise.resolve('success')
      
      await withMinLoadingTime(promise, 500)
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(500)
    })

    it('returns promise result', async () => {
      const promise = Promise.resolve('test-result')
      const result = await withMinLoadingTime(promise, 100)
      
      expect(result).toBe('test-result')
    })
  })
})
