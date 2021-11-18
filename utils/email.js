const nodemailer = require("nodemailer");

class Email {
  constructor(to, subject, html, cc, bcc) {
    this.to = to;
    this.cc = cc;
    this.bcc = bcc;
    this.subject = subject;
    this.html = html || "";

    if (to instanceof Array) {
      this.to = to.join();
    }

    if (cc && cc instanceof Array) {
      this.cc = cc.join();
    }

    if (bcc && bcc instanceof Array) {
      this.bcc = bcc.join();
    }
  }

  formatEmail() {
    return {
      from: `${process.env.EMAIL_SMTP_SENDER_NAME} <${process.env.EMAIL_SMTP_EMAIL}>`,
      to: this.to,
      cc: this.cc || null,
      bcc: this.bcc || null,
      subject: this.subject,
      html: this.html,
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
}

module.exports = {
  Email,
  EmailService,
};
