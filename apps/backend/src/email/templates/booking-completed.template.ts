import { baseEmailLayout } from './base.layout';

export const bookingCompletedTemplate = (data: any, language: 'en' | 'hu' = 'en') => {
  const { t, customerName, serviceName, proName, date, price, currency, bookingId } = data;
  
  const content = `
    <h1 class="title">✅ ${t.title}</h1>
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
        <span class="info-label">${t.price}:</span>
        <span class="info-value"><strong>${price} ${currency}</strong></span>
      </div>
    </div>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        ⭐ ${t.leaveReview}
      </p>
    </div>
    
    <center>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${bookingId}/review" class="button">
        ${t.reviewButton}
      </a>
    </center>
    
    <div class="divider"></div>
    
    <p class="text" style="font-size: 14px; color: #6b7280;">
      ${t.footer}
    </p>
  `;
  
  return baseEmailLayout(content, language);
};
