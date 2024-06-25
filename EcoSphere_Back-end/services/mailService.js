import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesFolderPath = path.join(__dirname, '../public/templates')
const readHTMLFile = async (filePath) => {
    try {
        const html = await fs.readFile(filePath, { encoding: 'utf-8' });
        return html;
    } catch (err) {
        throw new Error(`Error reading HTML file: ${err}`);
    }
};


const replacePlaceholders = (template, replacements) => {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(replacements);
};


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ecosphere573@gmail.com',
        pass: 'jtoa uiul ltmw jaol'
    }
});


export const sendActivationMail = async (to, subject, replacements) => {
    try {
        const html = await readHTMLFile(path.join(templatesFolderPath, 'activation.html'));
        const htmlToSend = replacePlaceholders(html, replacements);
        console.log(htmlToSend);
        const mailOptions = {
            from: '"ecosphereSupport" <ecosphere573@gmail.com>',
            to: to,
            subject: subject,
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

export const sendPasswordModificationMail = async (to, subject, replacements) => {
    try {
        const html = await readHTMLFile(path.join(templatesFolderPath, 'forgetPassword.html'));
        const htmlToSend = replacePlaceholders(html, replacements);
        console.log(htmlToSend);
        const mailOptions = {
            from: '"ecosphereSupport" <ecosphere573@gmail.com>',
            to: to,
            subject: subject,
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

export const send2faCode = async (to, subject, replacements) => {
    try {
        const html = await readHTMLFile(path.join(templatesFolderPath, '2fa.html'));
        const htmlToSend = replacePlaceholders(html, replacements);
        console.log(htmlToSend);
        const mailOptions = {
            from: '"ecosphereSupport" <ecosphere573@gmail.com>',
            to: to,
            subject: subject,
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
};
export const sendBackValidationTemplate = async() => {
    const x = await readHTMLFile(path.join(templatesFolderPath, 'validation.html'));
    return x;
}

