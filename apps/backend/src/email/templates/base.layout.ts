export const baseEmailLayout = (content: string, language: 'en' | 'hu' = 'en') => `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ozar</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      text-decoration: none;
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 20px 0;
    }
    .text {
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
      margin: 0 0 20px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(20, 184, 166, 0.3);
    }
    .button:hover {
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
    }
    .info-box {
      background-color: #f0fdfa;
      border-left: 4px solid: #14b8a6;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #374151;
    }
    .info-value {
      color: #6b7280;
      text-align: right;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin: 5px 0;
    }
    .footer-link {
      color: #14b8a6;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .title {
        font-size: 20px;
      }
      .text {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="logo">
        Ozar
      </a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p class="footer-text">
        © ${new Date().getFullYear()} Ozar. ${language === 'hu' ? 'Minden jog fenntartva.' : 'All rights reserved.'}
      </p>
      <p class="footer-text">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/trust-safety" class="footer-link">
          ${language === 'hu' ? 'Biztonság' : 'Trust & Safety'}
        </a> | 
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" class="footer-link">
          ${language === 'hu' ? 'Kapcsolat' : 'Contact'}
        </a> | 
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/help" class="footer-link">
          ${language === 'hu' ? 'Súgó' : 'Help'}
        </a>
      </p>
    </div>
  </div>
</body>
</html>
`;
