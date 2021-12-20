const smsConfig = require('../config/smsConfig');

const request = require('request');

module.exports = {
  sendSms: (content, receiver, language) => {
    const msgAr = 'مرحبا محمد';
    const msgEn = 'Hi Mohamed';

    // return the all active sender names separated by |

    // request.post({ url: `http://www.saudisms.net/api/sender?user_id=userID&default=NO&type=all`}, (err, httpResponse, body) => {
    //   console.log('body', body);
    // });

    // return the default sender name

    // request.post({ url: `http://www.saudisms.net/api/sender?user_id=userID&default=YES`}, (err, httpResponse, body) => {
    //   console.log('body', body);
    // });

    // Get Balance

    // request.post({ url: `http://saudisms.net/api/Balance?userName=$userName&userPassword=$userPassword`}, (err, httpResponse, body) => {
    //   console.log('body', body);
    // });

    // Send Single Message

    //   request.get({ url: `http://saudisms.net/api/send?userName=${smsConfig.userName}&userPassword=${smsConfig.password}&numbers=${smsConfig.to}&userSender=saudismsNET&msg=${msgEn}&By=API` }, (err, httpResponse, body) => {
    //   console.log('body', body);
    // });
    if (language === 'ar') {
      request.get({ url: `http://saudisms.net/api/send?userName=${smsConfig.userName}&userPassword=${smsConfig.password}&numbers=${smsConfig.to}&userSender=saudismsNET&msg=${encodeURIComponent(content)}&By=API` }, (err, httpResponse, body) => {
        console.log('body', body);
      });
    } else {
      request.get({ url: `http://saudisms.net/api/send?userName=${smsConfig.userName}&userPassword=${smsConfig.password}&numbers=${smsConfig.to}&userSender=saudismsNET&msg=${content}&By=API` }, (err, httpResponse, body) => {
        console.log('body', body);
      });
    }

    // http://saudisms.net/api/sendMultiple?userName=$userName&userPassword=$userPassword&numbers=$numbers&
    //   userSender=$userSender&msg=$msg&By=API
    // http://saudisms.net/api/sendMultiple?userName=myusername&userPassword=mypassword&numbers=96650000000
    //   1,966500000002,966500000003&userSender=mysender&msg=message1,message2,message3&By=API

    /**
     * 1 => SMS Sent Successfully
     * 1010 => Missing Data, Message content or Numbers
     * 1020 => Wrong Login
     * 1030 => Same message with same destinations exist in queue, Wait 10 second before resend
     * 1040 => Unrecognized Charet
     * 1050 => Msg Empty. Reason, message filtration removed your message content
     * 1060 => No enough credits to send
     * 1070 => Your credit balance is 0
     * 1090 => Repetition filter rejected the sending process, try later
     * 1100 => Message Not sent. Try Later
     * 1110 => Sorry, Bad Sender Name you used. Try by verified sender name
     * 1120 => Sorry, The country you are trying to send to is not covered
     * 1140 => Sorry, You exceeded maximum messages parts
     */
  }
};
