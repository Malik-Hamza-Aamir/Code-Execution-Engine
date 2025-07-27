import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'admin@fmexpress.uk',
        to,
        subject,
        html,
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error('Email sending failed');
      }

      return data;
    } catch (err) {
      console.error('Error sending email:', err);
      throw err;
    }
  }
}
