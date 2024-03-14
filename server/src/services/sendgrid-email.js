const sgMail = require('@sendgrid/mail');

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'test@example.com',
    from: 'imrozkhangre@gmail.com', // Use the email address or domain you verified above
    subject: 'A document has been shared with you',
    text: 'and easy to do anywhere, even with Node.js',
    html: '',
};

//ES8
const sendEmailToShareDoc = async (senderEmail) => {
    const documentLink = 'http://localhost:4200/';
    const recipientName = senderEmail;
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Document Access</title>
        <style>
            body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}
            .container {max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;}
            .header {font-size: 24px; text-align: center; padding-bottom: 20px;}
            .content {font-size: 16px; line-height: 1.6; color: #333333;}
            .footer {text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;}
            .button {display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Access to Document Granted</div>
            <div class="content">
                <p>Dear ${recipientName},</p>
                <p>We are pleased to inform you that access to the document has been granted. You can view the document by clicking on the link below:</p>
                <p><a href="${documentLink}" target="_blank" class="button">View Document</a></p>
                <p>If you have any questions or encounter any issues accessing the document, please do not hesitate to contact us.</p>
                <p>Best regards,</p>
                <p>Doc Edito</p>
                <p>999-999-9999</p>
            </div>
            <div class="footer">
                © 2024 TILO. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
    msg.html = htmlContent;
    msg.to = senderEmail;
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
}

module.exports = {sendEmailToShareDoc};