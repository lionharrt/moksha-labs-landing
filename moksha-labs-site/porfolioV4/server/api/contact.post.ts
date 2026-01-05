import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // Validate required fields
  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  // Honeypot check
  if (body.honeypot) {
    console.warn("Honeypot triggered - bot detected");
    return { success: true, message: "Email sent successfully" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email address",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.larksuite.com",
      port: 465,
      secure: true,
      auth: {
        user: config.larkEmail,
        pass: config.larkPassword,
      },
    });

    // Luxury Design System Tokens
    const colors = {
      cream: "#FDFBF7",
      charcoal: "#1A1A1A",
      saffron: "#E2A04F",
      textLight: "#666666",
      border: "#E5E5E5",
    };

    const mailOptions = {
      from: `"${config.larkFromName}" <${config.larkEmail}>`,
      to: config.larkEmail,
      replyTo: body.email,
      subject: body.subject
        ? `[Inquiry] ${body.subject}`
        : "New Contact Form Submission",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Inquiry</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: ${
          colors.cream
        }; font-family: 'Inter', Helvetica, Arial, sans-serif; color: ${
        colors.charcoal
      };">
          
          <!-- Container -->
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- Brand Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; letter-spacing: 0.1em; margin: 0; text-transform: uppercase; color: ${
                colors.charcoal
              };">
                Moksha Labs
              </h1>
              <div style="width: 40px; height: 2px; background-color: ${
                colors.saffron
              }; margin: 15px auto 0;"></div>
            </div>

            <!-- Main Card -->
            <div style="background-color: #FFFFFF; border: 1px solid ${
              colors.border
            }; padding: 40px; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
              
              <!-- Meta Info -->
              <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid ${
                colors.cream
              };">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <span style="font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${
                        colors.saffron
                      }; font-weight: 600;">Sender</span><br>
                      <strong style="font-family: 'Playfair Display', serif; font-size: 18px; color: ${
                        colors.charcoal
                      };">${body.name}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <span style="font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${
                        colors.saffron
                      }; font-weight: 600;">Email</span><br>
                      <a href="mailto:${body.email}" style="color: ${
        colors.charcoal
      }; text-decoration: none; border-bottom: 1px solid ${colors.saffron};">${
        body.email
      }</a>
                    </td>
                  </tr>
                  ${
                    body.subject
                      ? `
                  <tr>
                    <td>
                      <span style="font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${colors.saffron}; font-weight: 600;">Subject</span><br>
                      <span style="color: ${colors.charcoal};">${body.subject}</span>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <!-- Message Body -->
              <div>
                <span style="font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${
                  colors.saffron
                }; font-weight: 600; display: block; margin-bottom: 15px;">Message</span>
                <div style="font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.6; color: ${
                  colors.charcoal
                }; white-space: pre-wrap;">${body.message}</div>
              </div>

            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-family: 'Inter', sans-serif; font-size: 11px; color: ${
                colors.textLight
              }; letter-spacing: 0.05em;">
                SECURED TRANSMISSION VIA MOKSHA LABS
                <br>
                ${new Date().toLocaleString("en-US", { timeZone: "UTC" })}
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
      text: `
MOKSHA LABS - NEW INQUIRY
--------------------------------
FROM: ${body.name}
EMAIL: ${body.email}
SUBJECT: ${body.subject || "N/A"}

MESSAGE:
${body.message}

--------------------------------
Sent from mokshalabs.ie
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error: any) {
    console.error("Email sending error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send email",
      data: error.message,
    });
  }
});
