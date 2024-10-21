const nodemailer = require('nodemailer');

const sendEmailToApplicant = async (receiverEmail, mailBody) => {


        // Create a transporter object using Gmail credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAILFROM,
                pass: process.env.EMAIL_KEY  
            }
        });

        // Verify the connection before sending the email
        transporter.verify((error, success) => {
            if (error) {
                console.error('Error connecting to email server:', error);
                return res.status(500).json({ error: 'Error connecting to email server' });
            }
        });

        // Set up email options
        const mailOptions = {
            from: process.env.EMAILFROM,
            to: receiverEmail, // Send email to the applicant
            subject: 'CBT Exam Login Details',
            html: mailBody
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            }
            console.log('Email sent:', info.response);
        });

};

module.exports = { sendEmailToApplicant };
