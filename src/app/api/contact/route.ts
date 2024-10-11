import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your email address
        pass: process.env.GMAIL_PASS, // Your email password (or an app-specific password)
      },
    });

    // Set up the email options
    const mailOptions = {
      from: process.env.GMAIL_USER, // Your Gmail address
      to: process.env.GMAIL_USER, // The email address where you want to receive the contact form data
      subject: `New message from ${name}`,
      text: message,
      replyTo: email, // This will allow replies to go to the user's email
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}
