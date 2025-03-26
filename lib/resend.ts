"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string, customerName: string, image: string) {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hi ${customerName},</h2>
            <p>We're excited to share your personalized <strong>AI Impact Report</strong> – a deep dive into how artificial intelligence is shaping your career and what the future might look like.</p>
            <p>🔍 <strong>Here's what you'll discover:</strong></p>
            <ul>
                <li>How AI will affect your current role and skillset</li>
                <li>Industry-specific AI disruption forecasts</li>
                <li>A timeline prediction of changes and opportunities</li>
                <li>Actionable insights to stay ahead of the curve</li>
                <li>Suggested tools and skills to upskill with confidence</li>
            </ul>
            <p>We built this report with your career growth in mind. If you have any questions or want a 1-on-1 consultation to go over your insights, we'd love to help.</p>
            <p>Let us know what you think—we're always here to support your next move.</p>
            <p>To your future,</p>
            <p><strong>Founder | Manshri Chanakya Gollapalli</strong></p>
            <p>8013183869 | <a href="mailto:info@urimsoftsol.com">info@urimsoftsol.com</a></p>
            <p style="color: #777; font-size: 0.9em;">&copy; 2025 Know AI. All rights reserved.</p>
        </div>
    `;

    const response = await resend.emails.send({
        from: "TheknowAI <noreply@scan.theknowai.com>",
        to: [`${email}`], 
        subject: "Your AI Impact Report is Ready! 🚀",
        html: htmlContent,
        attachments: [
            {
                path: `${image}`,
                filename: `${customerName}-profile.png`,
            },
        ],
    });
}