import axios from 'axios';

/* eslint-disable-next-line import/prefer-default-export */
export async function getRegistrationConfirmationEmail(emailAddress: string) {
  return new Promise((resolve, reject) => {
    let tryCount = 0;
    const intervalID = setInterval(async () => {
      try {
        const res = await axios('http://mockserver/emails');
        const email = res.data.emails
          .find((email: any) => email.Destination.ToAddresses[0] === emailAddress);
        if (email) {
          clearInterval(intervalID);
          resolve(email);
          return;
        }
        if (++tryCount >= 6) {
          throw new Error('Email not found within 3 seconds');
        }
      } catch (e) {
        clearInterval(intervalID);
        reject(e);
      }
    }, 500);
  });
}
