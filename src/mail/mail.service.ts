import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter!: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  async init() {
    if (this.transporter) return;

    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    this.logger.log(`Ethereal user: ${testAccount.user}`);
  }

  async sendInviteEmail(params: {
    to: string;
    orgName: string;
    inviteUrl: string;
  }) {
    await this.init();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await this.transporter.sendMail({
      from: '"Dev Mail" <no-reply@dev.local>',
      to: params.to,
      subject: `Convite para entrar em ${params.orgName}`,
      text: `Você recebeu um convite para entrar em ${params.orgName}.\n\nAcesse: ${params.inviteUrl}\n\nSe não foi você, ignore.`,
      html: `
        <p>Você recebeu um convite para entrar em <b>${params.orgName}</b>.</p>
        <p><a href="${params.inviteUrl}">Clique aqui para aceitar o convite</a></p>
        <p>Se não foi você, ignore.</p>
      `,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const previewUrl = nodemailer.getTestMessageUrl(info);

    this.logger.log(`Ethereal preview: ${previewUrl}`);

    return { previewUrl };
  }
}
