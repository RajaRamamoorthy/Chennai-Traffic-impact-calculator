
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
    this.initializeTransporter().catch(console.error);
  }

  private async initializeTransporter() {
    const port = parseInt(process.env.SMTP_PORT || '587');
    const host = process.env.SMTP_HOST || 'smtp.zoho.com';
    
    // Try multiple configurations for better compatibility
    const configs = [
      // Zoho with explicit authentication method
      {
        name: 'Zoho PLAIN Auth 587',
        host: 'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
          type: 'login'
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      // Zoho with different auth method
      {
        name: 'Zoho LOGIN Auth 465',
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
          method: 'LOGIN'
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      // Try different Zoho server
      {
        name: 'Zoho Alt Server',
        host: 'smtp.zoho.in',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      // Primary configuration from environment
      {
        name: 'Primary Config',
        host: host,
        port: port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      // Fallback for Zoho with port 587
      {
        name: 'Zoho Port 587',
        host: 'smtp.zoho.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      // Gmail fallback (if user wants to switch)
      {
        name: 'Gmail Fallback',
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        }
      }
    ];

    // Only create transporter if credentials are provided
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log('Initializing email service with:');
      console.log('- SMTP Host:', host);
      console.log('- SMTP Port:', port);
      console.log('- SMTP User:', process.env.SMTP_USER);
      console.log('- SMTP Pass Length:', process.env.SMTP_PASS?.length || 0);
      console.log('- Contact Email:', process.env.CONTACT_EMAIL || 'contact@chennaitrafficcalc.in');
      console.log('- From Email:', process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER);
      
      // Try each configuration until one works
      for (const config of configs) {
        try {
          this.transporter = nodemailer.createTransport(config);
          const verified = await this.transporter.verify();
          if (verified) {
            console.log(`✅ SMTP connection successful with: ${config.name}`);
            break;
          }
        } catch (error) {
          console.log(`❌ ${config.name} failed:`, error.message);
          this.transporter = null;
        }
      }
      
      if (!this.transporter) {
        console.log('⚠️ All SMTP configurations failed. Emails will not be sent.');
      }
    } else {
      console.warn('Email service not configured - missing SMTP credentials');
    }
  }

  async sendContactEmail(contactData: ContactEmail): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email service not configured - storing message in database only');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || 'contact@chennaitrafficcalc.in',
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
      console.log('No transporter configured');
      return false;
    }

    try {
      console.log('Testing SMTP connection...');
      await this.transporter.verify();
      console.log('SMTP connection test: SUCCESS');
      return true;
    } catch (error) {
      console.error('SMTP connection test: FAILED');
      console.error('Error details:', error);
      
      // Try alternative configurations
      console.log('Trying alternative SMTP configurations...');
      
      const alternativeConfigs = [
        // Zoho with port 587
        {
          name: 'Zoho Port 587',
          host: 'smtp.zoho.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: { rejectUnauthorized: false }
        },
        // Gmail configuration (if user wants to switch)
        {
          name: 'Gmail SMTP',
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        },
        // Generic SMTP with different settings
        {
          name: 'Generic SMTP',
          host: process.env.SMTP_HOST || 'smtp.zoho.com',
          port: 25,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: { rejectUnauthorized: false }
        }
      ];

      for (const config of alternativeConfigs) {
        try {
          console.log(`Trying ${config.name}...`);
          const altTransporter = nodemailer.createTransport(config);
          await altTransporter.verify();
          console.log(`${config.name}: SUCCESS`);
          this.transporter = altTransporter;
          return true;
        } catch (altError) {
          console.error(`${config.name} failed:`, altError.message);
        }
      }
      
      return false;
    }
  }
}

export const emailService = new EmailService();
