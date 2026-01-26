import { baseEmailLayout } from './base.layout';

export const passwordResetTemplate = (data: any, language: 'en' | 'hu' = 'en') => {
  const { t, name, resetLink } = data;
  
  const content = `
    <h1 class="title">${t.title}</h1>
    <p class="text">${t.greeting} ${name},</p>
    <p class="text">${t.message}</p>
    
    <center>
      <a href="${resetLink}" class="button">
        ${t.resetButton}
      </a>
    </center>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        ⚠️ ${t.expiry}
      </p>
    </div>
    
    <p class="text" style="font-size: 14px; color: #6b7280;">
      ${t.notRequested}
    </p>
    
    <div class="divider"></div>
    
    <p class="text" style="font-size: 14px; color: #6b7280;">
      ${t.footer}
    </p>
  `;
  
  return baseEmailLayout(content, language);
};
