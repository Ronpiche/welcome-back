export class MailerServiceMock {
  sendMail = jest.fn(() => Promise.resolve());
}
