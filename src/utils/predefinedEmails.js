export const emailOptions = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  }
  return mailOptions
}

export const subjects = Object.freeze({
  resetPassword: 'Alenta Dev - Recuperación del contraseña'
})
