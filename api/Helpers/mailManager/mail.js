'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config_env')[env];
const path = require('path');
const nodeMailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const transporter = nodeMailer.createTransport(config.transporter);
const Promise = require('bluebird');

async function sendEmail (obj) {
    return await transporter.sendMail(obj)
}
function loadTemplate (templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
    return Promise.all(contexts.map(context => {
        return new Promise((resolve, reject) => {
            template.render(context, (err,result) => {
                if (err) reject(err);
                resolve({
                    email: result,
                    context
                });
            })
        })
    }))
}
module.exports = {
    async sendConfirmationEmail (receiver,token) {
        let users = [];
        receiver.token = `${config.url}/verifyUser?${token}`;
        users.push(receiver);
        try {
            let templates = await loadTemplate('confirmationEmail', users);
            let sentEmails = Promise.all(templates.map(async template => {
                await sendEmail({
                    to: template.context.email,
                    from: `Tenaciti< ${config.transporter.auth.user} >`,
                    subject: template.email.subject,
                    html: template.email.html,
                    text: template.email.text
                });
            }));
            console.log(sentEmails);
        } catch (err) {
            console.log(err);
        }
    },
    async sendResetPasswordEmail (receiver, token) {
        let users = [];
        receiver.token = `${config.url}/resetPassword?${token}`;
        users.push(receiver);
        console.log(receiver);
        try {
            let templates = await loadTemplate('resetPassword', users);
            let sentEmails = Promise.all(templates.map(async template => {
                await sendEmail({
                    to: template.context.email,
                    from: `Tenaciti< ${config.transporter.auth.user} >`,
                    subject: template.email.subject,
                    html: template.email.html,
                    text: template.email.text
                });
            }));
        } catch (err) {
            console.log(err);
        }

    }
}