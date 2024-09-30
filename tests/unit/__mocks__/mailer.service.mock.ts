export class MailerServiceMock {
  sendMail = jest.fn(async() => Promise.resolve());
}