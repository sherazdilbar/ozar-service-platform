import { baseEmailLayout } from './base.layout';

export const bookingConfirmationTemplate = (data: any, language: 'en' | 'hu' = 'en') => {
  const { t, customerName, serviceName, proName, date, time, location, price, currency, bookingId } = data;
  
  const content = `
    <h1 class="title">${t.title}</h1>
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
      <div class="info-row">
        <span class="info-label">${t.status}:</span>
        <span class="info-value" style="color: #f59e0b; font-weight: 600;">${language === 'hu' ? 'Függőben' : 'Pending'}</span>
      </div>
    </div>
    
    <center>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${bookingId}" class="button">
        ${t.viewBooking}
      </a>
    </center>
    
    <div class="divider"></div>
    
    <p class="text" style="font-size: 14px; color: #6b7280;">
      ${t.needHelp} <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="color: #14b8a6;">${t.contactUs}</a>
    </p>
    
    <p class="text" style="font-size: 14px; color: #6b7280;">
      ${t.footer}
    </p>
  `;
  
  return baseEmailLayout(content, language);
};
