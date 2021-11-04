const nodemailer = require("nodemailer");

class Email {
  constructor(to, subject, html, text) {
    this.to = to;
    this.subject = subject;
    this.html = html || '';
    this.text = text || '';
  }

  formatEmail() {
    return {
      from: `${process.env.EMAIL_SMTP_SENDER_NAME} <${process.env.EMAIL_SMTP_EMAIL}>`,
      to: this.to,
      subject: this.subject,
      html: this.html,
      text: this.text,
    };
  }
}

class EmailService {
  constructor(user, pass) {
    this.transport = {
      //this is the authentication for sending email.
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user,
        pass,
      },
    };
  }

  init() {
    this.transporter = nodemailer.createTransport(this.transport);

    return this.transporter.verify();
  }

  sendEmail(email) {
    if (email instanceof Email === false) {
      return new Error("email param must be an instance of Email class.");
    }

    this.transporter.sendMail(email.formatEmail());
  }
};

module.exports = {
  Email,
  EmailService
}