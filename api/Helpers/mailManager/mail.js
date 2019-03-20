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
/*
    * Description: Private function used to load specified mail template from templates directory
    * Parameters: templateName is a string used to look for specified template, and contexts are the variables
    *             that are used to fill placeholders in template
    * */
function loadTemplate (templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
    return Promise.all(contexts.map(context => {
        return new Promise((resolve, reject) => {
            //render returns either an error or an email as a result
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
    /*
    * Description: Function used to send a confirmation email to specified receiver
    * Parameters: receiver is an object that contains a name and an email that specifies
    *             the receiver, token is the verification token used as part of the link in the template
    * */
    async sendConfirmationEmail (receiver,token, cb) {
        //instantiating a context array of users
        let users = [];
        //adding the token to the receiver object
        receiver.token = `${config.url}/verifyUser?${token}`;
        users.push(receiver);
        try {
            let templates = await loadTemplate('confirmationEmail', users);
            let sentEmails = await Promise.all(templates.map(async template => {
                await sendEmail({
                    to: template.context.email,
                    from: `Tenaciti< ${config.transporter.auth.user} >`,
                    subject: template.email.subject,
                    html: template.email.html,
                    text: template.email.text
                });
            }));
            console.log(sentEmails);
            cb(null, true)
        } catch (err) {
            console.log(err);
            cb(err)
        }
    },
    /*
    * Description: Function used to send a password reset email to the specified receiver
    * Parameters: receiver is an email that specifies the receiver, token is the verification
    *             token used as part of the link in the template
    * */
    async sendResetPasswordEmail (receiver, token) {
        let users = [];
        receiver.token = `${config.url}/resetPassword?${token}`;
        users.push(receiver);
        console.log(receiver);
        try {
            let templates = await loadTemplate('resetPassword', users);
            Promise.all(templates.map(async template => {
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

    },
    /*
    * Description: Function used to send a notification that new application has signed up
    * Parameters: propertyName is a string specifying the property, userInfo is an object
    *             containing a name and email variable.
    * */
    async sendApplicationSignUpEmail (propertyName, userInfo, cb) {
        let applicants = [];
        let contextInfo = {};
        contextInfo.propertyName = propertyName;
        contextInfo.userName = userInfo.name;
        contextInfo.userEmail = userInfo.email;

        applicants.push(contextInfo);
        try {
            let templates = await loadTemplate('applicationSignUp', applicants);
            let sentEmails = await Promise.all(templates.map(async template => {
                await sendEmail({
                    to: template.context.email,
                    from: `Tenaciti< ${config.transporter.auth.user} >`,
                    subject: template.email.subject,
                    html: template.email.html,
                    text: template.email.text
                });
            }));
            console.log(sentEmails);
            cb(null, true)
        } catch (err) {
            console.log(err);
            cb(err)
        }
    },
};