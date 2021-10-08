const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { EmailService } = require('./utils/email');
const emailRoute = require('./routes/email.route');

dotenv.config({ path: './.env' });

const emailService = new EmailService(process.env.SMTP_EMAIL, process.env.SMTP_PASSWORD);

const app = express();

const port = process.env.PORT;

app.use(async (req, res, next) => {
  try {

    await emailService.init();

    res.emailService = emailService;

    return next();

  } catch(err) {
    console.log(err);
    next();
  }
});

app.use(cors({origin: '*'}));
app.use(express.json());

app.use('/send-email', emailRoute);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: 500,
    message: err.message,
  });
});

const server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION. Shutting down...');
  console.log(err);
  process.exit(1);
});


process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION. Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminaed.');
  });
});
