import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import config from 'config';

const client = new SESv2Client({
  endpoint: process.env.NODE_ENV !== 'production'
    ? config.get('ses.endpoint')
    : undefined,
});

// TODO: templates
function genHTML(title: string, body: string): string {
  return `\
  <!DOCTYPE PUBLIC
    "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
  >
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <title>${title}</title>
    </head>
    <body>
      ${body}
    </body>
  </html>
  `;
}

async function handleSend(toAddress: string, subject: string, html: string) {
  const params = {
    FromEmailAddress: config.get('notificationsEmailAddress') as string,
    Destination: {
      ToAddresses: [toAddress],
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: html,
          },
        },
      },
    },
  };
  const command = new SendEmailCommand(params);

  try {
    const data = await client.send(command);
    console.log('data:::', data);
  } catch (e) {
    console.error(e);
  }
}

type EmailType = 'registrationConfirmation';

// TODO: generic handler
export default async function sendEmail(toAddress: string, type: EmailType, token: string) {
  let title = '';
  let body = '';

  if (type === 'registrationConfirmation') {
    title = 'Ludi - Confirm Registration';
    const confirmationLink = `${config.get('platformURL')}/confirm-sign-up?token=${token}`;
    body = `<p>Verify your email address by clicking <a href="${confirmationLink}">here</a></p>`;
  }

  const html = genHTML(title, body);
  handleSend(toAddress, title, html);
}
