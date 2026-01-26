"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
const booking_confirmation_template_1 = require("./booking-confirmation.template");
const booking_accepted_template_1 = require("./booking-accepted.template");
const booking_cancelled_template_1 = require("./booking-cancelled.template");
const password_reset_template_1 = require("./password-reset.template");
const welcome_template_1 = require("./welcome.template");
const booking_completed_template_1 = require("./booking-completed.template");
exports.emailTemplates = {
    bookingConfirmation: booking_confirmation_template_1.bookingConfirmationTemplate,
    bookingAccepted: booking_accepted_template_1.bookingAcceptedTemplate,
    bookingCancelled: booking_cancelled_template_1.bookingCancelledTemplate,
    passwordReset: password_reset_template_1.passwordResetTemplate,
    welcome: welcome_template_1.welcomeTemplate,
    bookingCompleted: booking_completed_template_1.bookingCompletedTemplate,
};
//# sourceMappingURL=index.js.map