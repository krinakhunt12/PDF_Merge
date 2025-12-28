/**
 * Loading timeout utilities
 * Prevents infinite loading states by implementing timeouts
 */

export const DEFAULT_TIMEOUT = 30000; // 30 seconds

export interface TimeoutOptions {
  timeout?: number;
  onTimeout?: () => void;
  timeoutMessage?: string;
}

/**
 * Wraps a promise with a timeout
 * @param promise - The promise to wrap
 * @param options - Timeout configuration options
 * @returns Promise that rejects if timeout is exceeded
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, onTimeout, timeoutMessage = 'Operation timed out' } = options;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      if (onTimeout) {
        onTimeout();
      }
      reject(new Error(timeoutMessage));
    }, timeout);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Hook-friendly timeout wrapper for async operations
 * @param asyncFn - Async function to execute
 * @param options - Timeout configuration options
 * @returns Wrapped function with timeout
 */
export function createTimeoutWrapper<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  options: TimeoutOptions = {}
): T {
  return (async (...args: any[]) => {
    return withTimeout(asyncFn(...args), options);
  }) as T;
}

/**
 * Minimum loading time to prevent flickering
 * @param promise - Promise to wait for
 * @param minTime - Minimum time in milliseconds (default: 500ms)
 */
export async function withMinLoadingTime<T>(promise: Promise<T>, minTime: number = 500): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, minTime)),
  ]);
  return result;
}
