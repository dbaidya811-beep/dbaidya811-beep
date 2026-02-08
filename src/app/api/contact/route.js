import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to Admin (You)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'dbaidya811@gmail.com',
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
            <h2 style="margin: 0; color: #333; font-size: 24px;">New Contact Request</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #333; line-height: 1.6;">
            <p style="margin-top: 0;"><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f1f1f1; border-left: 4px solid #007bff; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #555; font-weight: bold; margin-bottom: 5px;">Message:</p>
              <p style="margin: 0; font-style: italic; color: #555;">"${message}"</p>
            </div>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Sent from your Portfolio Website</p>
          </div>
        </div>
      `,
    };

    // Email to User (Receipt)
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thanks for contacting me, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
            <h2 style="margin: 0; color: #333; font-size: 24px;">Message Received</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #333; line-height: 1.6;">
            <p style="margin-top: 0;">Hi <strong>${name}</strong>,</p>
            <p>Thanks for reaching out! I've received your message and will get back to you as soon as possible.</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f1f1f1; border-left: 4px solid #007bff; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #555; font-weight: bold; margin-bottom: 5px;">Your Message:</p>
              <p style="margin: 0; font-style: italic; color: #555;">"${message}"</p>
            </div>

            <p style="margin-bottom: 5px;">Best regards,</p>
            <p style="margin-top: 0; font-weight: bold;">Deep Baidya</p>
            <p style="margin-top: 0; font-size: 14px; color: #666;">Web Developer & Cyber Security Enthusiast</p>
            
            <div style="margin-top: 30px; text-align: center;">
               <a href="https://deepbaidya.vercel.app" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Return to Portfolio</a>
            </div>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Deep Baidya. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}