import { injectable } from 'inversify';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { CONFIG } from '../config';
import * as twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MessagingException } from '../common/exceptions/messaging.exception';
const zenviaTotalVoice = require('totalvoice-node');

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

        try {
            const result = await transporter.sendMail(mailOptions);
            return result;
        } catch (error) {
            throw new MessagingException('Erro ao enviar e-mail');
        }
    }

    public async sendWhatsApp(options: WhatsAppOptions): Promise<MessageInstance[]> {

        const client = twilio(CONFIG.TWILIO_ACCOUNT_SID, CONFIG.TWILIO_AUTH_TOKEN);

        try {
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
        } catch (error) {
            throw new MessagingException('Erro ao enviar WhatsApp');
        }
    }

    public async sendVoiceCall(options: VoiceCallOptions): Promise<any> {

        const client = new zenviaTotalVoice(CONFIG.ZENVIA_TOKEN);

        try {
            const results = await Promise.all(
                options.phones.map(phone =>
                    client.tts.enviar(phone, options.message, { tipo_voz: "br-Camila" })
                )
            );

            return results;
        } catch (error) {
            throw new MessagingException('Erro ao enviar ligação');
        }
    }
}