/**
 * Professional Logger
 * Centralized logging system for development and production
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLog(level: LogLevel, message: string): string {
    return `[${this.getTimestamp()}] [${level}] ${message}`;
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  debug(message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: 'DEBUG',
      message,
      data,
    };
    this.addToHistory(entry);

    if (this.isDevelopment) {
      console.debug(this.formatLog('DEBUG', message), data);
    }
  }

  info(message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: 'INFO',
      message,
      data,
    };
    this.addToHistory(entry);

    if (this.isDevelopment) {
      console.info(this.formatLog('INFO', message), data);
    }
  }

  warn(message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: 'WARN',
      message,
      data,
    };
    this.addToHistory(entry);

    console.warn(this.formatLog('WARN', message), data);
  }

  error(message: string, error?: Error | unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: 'ERROR',
      message,
      data: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    };
    this.addToHistory(entry);

    console.error(this.formatLog('ERROR', message), error);
  }

  /**
   * Get log history for debugging
   */
  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }

  /**
   * Get error count from history
   */
  getErrorCount(): number {
    return this.logHistory.filter((entry) => entry.level === 'ERROR').length;
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

/**
 * Hook for React components
 */
export const useLogger = () => {
  return logger;
};

export default logger;
