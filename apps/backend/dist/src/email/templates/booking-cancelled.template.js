"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingCancelledTemplate = void 0;
const base_layout_1 = require("./base.layout");
const bookingCancelledTemplate = (data, language = 'en') => {
    const { t, customerName, serviceName, proName, date, reason } = data;
    const content = `
    <h1 class="title">${t.title}</h1>
    <p class="text">${t.greeting} ${customerName},</p>
    <p class="text">${t.message}</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0; color: #ef4444;">${t.bookingDetails}</h3>
      <div class="info-row">
        <span class="info-label">${t.service}:</span>
        <span class="info-value">${serviceName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${t.professional}:</span>
        <span class="info-value">${proName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${t.date}:</span>
        <span class="info-value">${date}</span>
      </div>
      ${reason ? `
      <div class="info-row">
        <span class="info-label">${t.reason}:</span>
        <span class="info-value">${reason}</span>
      </div>
      ` : ''}
    </div>
    
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        ${t.refund}
      </p>
    </div>
    
    <center>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/search" class="button">
        ${t.findAnother}
      </a>
    </center>
    
    <div class="divider"></div>
    
    <p class="text" style="font-size: 14px; color: #6b7280;">
      ${t.footer}
    </p>
  `;
    return (0, base_layout_1.baseEmailLayout)(content, language);
};
exports.bookingCancelledTemplate = bookingCancelledTemplate;
//# sourceMappingURL=booking-cancelled.template.js.map