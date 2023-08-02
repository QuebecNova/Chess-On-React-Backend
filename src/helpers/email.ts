import nodemailer from 'nodemailer'
import { htmlToText } from 'html-to-text'

export class Email {
    readonly url: string
    readonly name: string
    readonly from: string
    readonly to: string

    constructor(
        { name = 'Stranger', email }: { name?: string; email: string },
        url: string
    ) {
        this.to = email
        this.name = name
        this.from = `Hamchess <${process.env.EMAIL_FROM}>`
        this.url = url
    }

    createTransport() {
        if (process.env.NODE_ENV === 'prod') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            })
        } else {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT!),
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            })
        }
    }

    async send(html: string, subject: string) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        }

        await this.createTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send(
            this.welcomeHTMLTemplate(),
            `Welcome to my app. That's all. Did you expected more?`
        )
    }

    async sendResetPassword() {
        await this.send(
            this.resetPasswordHTMLTemplate(),
            'Your password reset token (valid for only 10 minutes)'
        )
    }

    protected resetPasswordHTMLTemplate = () => `<html>
        <body>
          <h2>Password Recovery</h2>
          <p>Use this OTP to reset your password. OTP is valid for 1 minute</p>
          <a href="${this.url}">${this.url}</a>
        </body>
      </html>
    `

    protected welcomeHTMLTemplate = () => `<html>
        <body>
          <h2>Hi from Hamchess!!!</h2>
        </body>
      </html>
    `
}
