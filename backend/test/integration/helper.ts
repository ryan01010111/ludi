import axios from 'axios';
import { SendEmailCommandInput } from '@aws-sdk/client-sesv2';

type Email = SendEmailCommandInput;

export async function getEmailsByToAddress(emailAddress: string): Promise<Email[]> {
  for (let tryCount = 1; tryCount <= 7; tryCount++) {
    /* eslint-disable-next-line no-await-in-loop */
    const res = await axios('http://mockserver/emails');
    const emails: Email[] = res.data.emails
      .filter((email: Email) => email.Destination?.ToAddresses?.[0] === emailAddress);
    if (emails.length) return emails;

    if (tryCount > 6) break;
    /* eslint-disable-next-line */
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error('Email not found within 3 seconds');
}

export async function confirmRegistration(emailAddress: string) {
  const emails = await getEmailsByToAddress(emailAddress);
  let emailHTML: string | undefined;
  for (const email of emails) {
    const html = email.Content?.Simple?.Body?.Html?.Data;
    if (html?.match(/\/confirm-sign-up/)) {
      emailHTML = html;
      break;
    }
  }
  if (!emailHTML) throw new Error('Registration confirmation email not found');

  const token = emailHTML.match(/\?token=([^"]+)/)?.[1];
  await axios.post('http://localhost/auth/confirm-registration', { token });
}

export async function deleteAllEmails() {
  await axios.delete('http://mockserver/emails');
}
