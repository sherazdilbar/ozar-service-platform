export declare class EmailService {
    private transporter;
    constructor();
    sendEmail(options: {
        to: string;
        subject: string;
        html: string;
        text?: string;
    }): Promise<void>;
    sendBookingConfirmation(to: string, bookingData: any): Promise<void>;
    sendBookingAccepted(to: string, bookingData: any): Promise<void>;
    sendBookingCancelled(to: string, bookingData: any): Promise<void>;
    sendBookingCompleted(to: string, bookingData: any): Promise<void>;
    sendWelcomeEmail(to: string, userData: any): Promise<void>;
    sendPasswordReset(to: string, resetData: any): Promise<void>;
}
