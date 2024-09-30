export class LoggerMock {
  log = jest.fn();

  error = jest.fn();

  debug = jest.fn();

  warn = jest.fn();

  info = jest.fn();

  secure = jest.fn();

  isLevelEnabled = jest.fn(() => false);
}