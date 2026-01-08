import nodemailer from 'nodemailer';
import * as SES from '@aws-sdk/client-ses';
import mjml2html from 'mjml';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { parse } from 'csv-parse';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processEmails() {
  const csvPath = path.join(__dirname, 'customers-8-1-26.csv');
  const templatePath = path.join(__dirname, 'templates', 'welcome.mjml');
  
  try {
    // 1. Configure SES client
    const ses = new SES.SES({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // 2. Create Nodemailer transport
    const transporter = nodemailer.createTransport({
      SES: { ses, aws: SES },
    });

    // 3. Prepare MJML Template
    const mjmlRaw = await fs.readFile(templatePath, 'utf-8');

    // 4. Read and Parse CSV
    const recipients = [];
    const parser = createReadStream(csvPath).pipe(
      parse({
        columns: true, // Assumes first row is headers
        skip_empty_lines: true,
        trim: true
      })
    );

    for await (const record of parser) {
      recipients.push(record);
    }

    console.log(`Found ${recipients.length} recipients. Starting send...`);

    // 5. Loop through recipients
    for (const [index, recipient] of recipients.entries()) {
      // Extract data matching your CSV headers exactly
      const name = recipient['Customer Name'] || recipient.name || 'Valued Client';
      const email = recipient.email || recipient.Email || recipient['Customer Email'];
      const company = recipient.company || recipient.Company || '';
      const country = recipient.country || '';

      if (!email) {
        console.warn(`Skipping row ${index + 1}: No email found. Record:`, recipient);
        continue;
      }

      // Compile MJML with placeholders
      let mjmlContent = mjmlRaw.replace(/{{name}}/g, name);
      // Optional: you can add {{company}} to your MJML and it will work
      mjmlContent = mjmlContent.replace(/{{company}}/g, company);

      if (errors.length > 0) {
        console.error(`MJML Error for ${email}:`, errors);
        continue;
      }

      const mailOptions = {
        from: `"Dylan Mahony | Moksha Labs" <${process.env.SENDER_EMAIL || 'dylan@mokshalabs.ie'}>`,
        to: email,
        subject: 'Welcome to Moksha Labs',
        html: html,
        text: `Hey ${name}, I've been building custom websites for 10 years and noticed your site has room for improvement...`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[${index + 1}/${recipients.length}] Sent to ${email}: ${info.messageId}`);
        
        // Anti-throttle delay (optional, SES has its own rate limits)
        await new Promise(resolve => setTimeout(resolve, 200)); 
      } catch (err) {
        console.error(`Failed to send to ${email}:`, err.message);
      }
    }

    console.log('Batch processing complete.');

  } catch (error) {
    console.error('Critical Error:', error);
    process.exit(1);
  }
}

processEmails();
