import { Resend } from 'resend';

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.error('RESEND_API_KEY environment variable is not set. Email integrations are disabled.');
      throw new Error("Missing RESEND_API_KEY for emails. Please configure it in your environment.");
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

export const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  const resend = getResendClient();
  
  try {
    const data = await resend.emails.send({
      from: 'EdTech Platform <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });
    return data;
  } catch (error) {
    console.error("Failed to send email", error);
    throw error;
  }
};
