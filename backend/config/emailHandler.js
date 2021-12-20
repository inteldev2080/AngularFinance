import emailTemplate from '../server/models/emailTemplate.model';

const mail = require('sendgrid').mail;
const eConfig = require('../config/emailConfg');
const sendGrid = require('sendgrid')(eConfig.sendGridKey);


const debug = require('debug')('app:emailHandler');

module.exports = {
  sendEmail: (receiver, content, templateKey, languageName) => {
    const senderEmail = new mail.Email('contact@supplieson.com'); // eConfig.sender
    const receiverEmail = new mail.Email(receiver); // receiver
    // content
    // TODO:
    let title = 'Greetings from SupplierOn.com';
    let body = 'Greetings from SupplierOn.com';
    // const email = 'SupplierOn.com';
    let emailContent;

    // emailTemplate.getTemplateByType(templateKey)
    emailTemplate.findOne({ type: templateKey })
      .then((template) => {
        if (!template) {
          throw { message: `template ${templateKey} does not exist` }; // eslint-disable-line no-throw-literal
        }

        // title = template.original_template.en.title;
        // body = template.original_template.en.body;

        title = `${template.template.ar.title} - ${template.template.en.title}`;
        body = `${template.template.ar.body}<br/><br/>${template.template.en.body}`;
        for (const key in content) { // eslint-disable-line guard-for-in, no-restricted-syntax
          const find = `${key}`;
          body = body.replace(find, content[key]);
          body = body.replace(find, content[key]);
          // title = title.replace(find, content[key]);
          // email = email.replace(find, content[key]);
        }

        emailContent = new mail.Content('text/html', body);

        const newEmail = new mail.Mail(senderEmail, title, receiverEmail, emailContent);
        if (languageName === 'en') {
          newEmail.setTemplateId(eConfig.mainTemplate.id);
        } else {
          newEmail.setTemplateId(eConfig.mainArabicTemplate.id);
        }
        const request = sendGrid.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: newEmail.toJSON()
        });

        return sendGrid.API(request, (error, response) => { // eslint-disable-line new-cap
          if (error) { debug('error', error); } else {
            debug('response', response);
          }

          debug('Status Code:', response.statusCode);
          debug('Body:', response.body);
          debug('Headers:', response.headers);
        });
      })
      .catch((err) => {
        debug('Sendmail error: ', err);
        throw (err); // TODO: what actions should be taken here??
      });
  }
};
