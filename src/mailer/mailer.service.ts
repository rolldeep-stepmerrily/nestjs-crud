import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';

@Injectable()
export class MailerService {
  #sesClient: SESClient;
  #transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.#sesClient = new SESClient({
      region: configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.#transporter = createTransport({
      SES: { ses: this.#sesClient, aws: { SendRawEmailCommand } },
    });
  }

  async sendEmail(options: SendMailOptions) {
    return await this.#transporter.sendMail({
      ...options,
      from: this.configService.getOrThrow('AWS_SES_SENDER_EMAIL'),
    });
  }
}
