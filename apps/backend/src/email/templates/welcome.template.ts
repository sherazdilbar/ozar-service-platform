import { baseEmailLayout } from './base.layout';
import { emailTranslations } from '../translations';

export const welcomeTemplate = (data: any) => {
  const { name, role } = data;
  const hu = emailTranslations.hu.welcome;
  const en = emailTranslations.en.welcome;
  const isCustomer = role === 'CUSTOMER';
  
  const content = `
    <!-- Hungarian Version -->
    <div style="margin-bottom: 40px; padding-bottom: 40px; border-bottom: 2px solid #e5e7eb;">
      <h1 class="title">👋 ${hu.title}</h1>
      <p class="text">${hu.greeting} ${name},</p>
      <p class="text">${hu.message}</p>
      
      <p class="text">
        ${isCustomer ? hu.customerMessage : hu.proMessage}
      </p>
      
      <div style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #0f766e;">${hu.getStarted}</h3>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
          ${isCustomer ? `
            <li style="margin: 10px 0;">Böngéssz szolgáltatásokat a környékedben</li>
            <li style="margin: 10px 0;">Olvasd el a szakemberek értékeléseit</li>
            <li style="margin: 10px 0;">Foglalj azonnal vagy ütemezz később</li>
          ` : `
            <li style="margin: 10px 0;">Állítsd be a profilodat</li>
            <li style="margin: 10px 0;">Add hozzá a szolgáltatásaidat</li>
            <li style="margin: 10px 0;">Kezdj el foglalásokat fogadni</li>
          `}
        </ul>
      </div>
      
      <center>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}${isCustomer ? '/search' : '/pro/dashboard'}" class="button">
          ${isCustomer ? hu.browseServices : hu.setupProfile}
        </a>
      </center>
    </div>

    <!-- English Version -->
    <div>
      <h1 class="title">👋 ${en.title}</h1>
      <p class="text">${en.greeting} ${name},</p>
      <p class="text">${en.message}</p>
      
      <p class="text">
        ${isCustomer ? en.customerMessage : en.proMessage}
      </p>
      
      <div style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #0f766e;">${en.getStarted}</h3>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
          ${isCustomer ? `
            <li style="margin: 10px 0;">Browse services in your area</li>
            <li style="margin: 10px 0;">Read professional reviews</li>
            <li style="margin: 10px 0;">Book instantly or schedule for later</li>
          ` : `
            <li style="margin: 10px 0;">Complete your profile</li>
            <li style="margin: 10px 0;">Add your services</li>
            <li style="margin: 10px 0;">Start receiving bookings</li>
          `}
        </ul>
      </div>
      
      <center>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}${isCustomer ? '/search' : '/pro/dashboard'}" class="button">
          ${isCustomer ? en.browseServices : en.setupProfile}
        </a>
      </center>
      
      <div class="divider"></div>
      
      <p class="text" style="font-size: 14px; color: #6b7280;">
        ${en.footer}
      </p>
    </div>
  `;
  
  return baseEmailLayout(content);
};
