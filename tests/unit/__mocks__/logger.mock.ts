export class LoggerMock {
  public log = jest.fn();

  public error = jest.fn();

  public debug = jest.fn();

  public warn = jest.fn();

  public info = jest.fn();

  public secure = jest.fn();

  public isLevelEnabled = jest.fn(() => false);
}