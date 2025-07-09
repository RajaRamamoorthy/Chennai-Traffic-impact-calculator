
import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ContactEmail {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const port = parseInt(process.env.SMTP_PORT || '587');
    // Port 465 typically requires secure connection
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: port,
      secure: secure,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    // Only create transporter if credentials are provided
    if (emailConfig.auth.user && emailConfig.auth.pass) {
      console.log('Initializing email service with:');
      console.log('- SMTP Host:', emailConfig.host);
      console.log('- SMTP Port:', emailConfig.port);
      console.log('- SMTP Secure:', emailConfig.secure);
      console.log('- SMTP User:', emailConfig.auth.user);
      console.log('- Contact Email:', process.env.CONTACT_EMAIL || 'contact@chennaitrafficcalc.in');
      
      this.transporter = nodemailer.createTransport(emailConfig);
    } else {
      console.warn('Email service not configured - missing SMTP credentials');
    }
  }

  async sendContactEmail(contactData: ContactEmail): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email service not configured');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        subject: `New Contact Form Submission - Chennai Traffic Calculator`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">New Contact Form Submission</h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Submitted:</strong> ${contactData.submittedAt}</p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #374151;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>This email was automatically generated from the Chennai Traffic Impact Calculator contact form.</p>
            </div>
          </div>
        `,
        text: `
          New Contact Form Submission
          
          Name: ${contactData.name}
          Email: ${contactData.email}
          Submitted: ${contactData.submittedAt}
          
          Message:
          ${contactData.message}
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Contact email sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send contact email:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
