import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
@Injectable()
export class EmailService {
  private transposrter: Transporter;
  constructor(private configService: ConfigService) {
    this.transposrter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }
  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<any> {
    try {
      const optionEmail = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        text,
        html,
      };
      return await this.transposrter.sendMail(optionEmail);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
