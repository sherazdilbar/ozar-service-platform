"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingAcceptedTemplate = void 0;
const base_layout_1 = require("./base.layout");
const bookingAcceptedTemplate = (data, language = 'en') => {
    const { t, customerName, serviceName, proName, date, time, location, price, currency, bookingId } = data;
    const content = `
    <h1 class="title">🎉 ${t.title}</h1>
    <p class="text">${t.greeting} ${customerName},</p>
    <p class="text">${t.message}</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0; color: #14b8a6;">${t.bookingDetails}</h3>
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
      <div class="info-row">
        <span class="info-label">${t.time}:</span>
        <span class="info-value">${time}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${t.location}:</span>
        <span class="info-value">${location}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${t.price}:</span>
        <span class="info-value"><strong>${price} ${currency}</strong></span>
      </div>
    </div>
    
    <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <h3 style="margin-top: 0; color: #059669;">${t.nextSteps}</h3>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
        <li style="margin: 10px 0;">${t.step1}</li>
        <li style="margin: 10px 0;">${t.step2}</li>
        <li style="margin: 10px 0;">${t.step3}</li>
      </ul>
    </div>
    
    <center>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${bookingId}" class="button">
        ${t.viewBooking}
      </a>
      <br>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/chat" class="button" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
        ${t.messageProf}
      </a>
    </center>
    
    <div class="divider"></div>
    
    <p class="text" style="font-size: 14px; color: #6b7280;">
      ${t.footer}
    </p>
  `;
    return (0, base_layout_1.baseEmailLayout)(content, language);
};
exports.bookingAcceptedTemplate = bookingAcceptedTemplate;
//# sourceMappingURL=booking-accepted.template.js.map