const { Email } = require('../utils/email');
const AppError = require('../utils/appError');

exports.sendEmail = async (req, res, next) => {
  try {
    const { to, subject, content } = req.body;

    if (!to || to === "") {
      return next(new AppError('To field is missing', 400));
    }

    if (!subject || subject === "") {
      return next(new AppError('Subject field is missing', 400));
    }

    if (!content || content === "") {
      return next(new AppError('Content field is missing', 400));
    }

    const email = new Email(to, subject, content);
  
    await res.emailService.sendEmail(email);

    res.status(200).json({
      status: 'success',
      message: 'Email sent successfully',
    })
  } catch(err) {
    return next(new AppError(err.message, 500));
  }
}