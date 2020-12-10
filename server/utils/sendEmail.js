import nodemailer from 'nodemailer';

/** GJENBRUKT FRA FORELESERS EKSEMPLER
 * Util funksjon som konfigurer kobling til nodemailer,
 * samt formen på en mail.
 * @param {MailInnhold} options - konfigurasjon for email innhold
 */
export const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};
