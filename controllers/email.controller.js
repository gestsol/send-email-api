const { Email } = require('../utils/email');

exports.sendEmail = async (req, res, next) => {
  try {
    const { to, subject, content } = req.body;

    const email = new Email(to, subject, content);
  
    await res.emailService.sendEmail(email);

    res.status(200).json({
      status: 'success',
      message: 'Email sent successfully',
    })
  } catch(err) {
    return next(err);
  }
}