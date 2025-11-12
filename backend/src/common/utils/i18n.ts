type User = { fullName?: string; email: string };

const translations: Record<string, string> = {
  'email.verify_subject': 'Verify your email',
  'email.verify_body':
    '<p>Welcome, {{name}}!</p><p>Please verify your email by clicking <a href="{{verifyUrl}}">here</a>.</p>',
  'email.resent': 'Verification email resent. Please check your inbox.',
  'email.already_verified': 'Your email is already verified.',
  'email.reset_password_subject': 'Reset your password',
  'email.reset_password_body':
    '<p>Hello, {{name}}!</p>' +
    '<p>We received a request to reset your password. If you did not make this request, you can ignore this email.</p>' +
    '<p>To reset your password, click <a href="{{resetUrl}}">here</a> or copy and paste the following link into your browser:</p>' +
    '<p><a href="{{resetUrl}}">{{resetUrl}}</a></p>' +
    '<p>This link will expire in 1 hour for your security.</p>',
};

export function getI18nText(
  key: string,
  user?: User,
  vars: Record<string, string> = {},
) {
  let text = translations[key] || key;
  text = text.replace(/{{name}}/g, user?.fullName || user?.email || '');
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
  }
  return text;
}
