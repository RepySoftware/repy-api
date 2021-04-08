import { injectable } from "inversify";
import * as nodemailer from 'nodemailer';
import Mail = require("nodemailer/lib/mailer");
import { CONFIG } from "../config";
import * as twilio from 'twilio';
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export interface EmailOptions {
    emails: string[];
    message: string;
    subject?: string;
}

export interface WhatsAppOptions {
    whatsAppPhones: string[];
    message: string;
}

export interface VoiceCallOptions {
    phones: string[];
    message: string;
}

@injectable()
export class MessagingService {

    public async sendEmail(options: EmailOptions): Promise<any> {

        if (!options.subject)
            options.subject = 'Mensagem de Repy';

        const transporter = nodemailer.createTransport({
            service: CONFIG.EMAIL_SERVICE,
            auth: {
                user: CONFIG.EMAIL_USER,
                pass: CONFIG.EMAIL_PASSWORD
            }
        });

        const mailOptions: Mail.Options = {
            from: CONFIG.EMAIL_USER,
            to: options.emails.join(','),
            subject: options.subject,
            html: options.message
        }

        const result = await transporter.sendMail(mailOptions);
        return result;
    }

    public async sendWhatsApp(options: WhatsAppOptions): Promise<MessageInstance[]> {

        const client = twilio(CONFIG.TWILIO_ACCOUNT_SID, CONFIG.TWILIO_AUTH_TOKEN);

        const results = await Promise.all(
            options.whatsAppPhones.map(wpPhone =>
                client.messages.create({
                    from: CONFIG.TWILIO_WHATS_APP_FROM,
                    body: options.message,
                    to: wpPhone
                })
            )
        );

        return results;
    }
}