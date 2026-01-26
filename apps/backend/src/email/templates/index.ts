import { bookingConfirmationTemplate } from './booking-confirmation.template';
import { bookingAcceptedTemplate } from './booking-accepted.template';
import { bookingCancelledTemplate } from './booking-cancelled.template';
import { passwordResetTemplate } from './password-reset.template';
import { welcomeTemplate } from './welcome.template';
import { bookingCompletedTemplate } from './booking-completed.template';

export const emailTemplates = {
  bookingConfirmation: bookingConfirmationTemplate,
  bookingAccepted: bookingAcceptedTemplate,
  bookingCancelled: bookingCancelledTemplate,
  passwordReset: passwordResetTemplate,
  welcome: welcomeTemplate,
  bookingCompleted: bookingCompletedTemplate,
};
