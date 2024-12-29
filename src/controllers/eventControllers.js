const prisma = require("../prismaClient")
const nodemailer = require('nodemailer');

const createEventController = async (req, res) => {
  try {
    const { title, description, date, location, createdById } = req.body;
    const eventDate = new Date(date); 
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date:eventDate,
        location,
        createdById,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllApprovedEvents = async (req,res) =>{
  try {
    const Events = await prisma.event.findMany({
      where:{isAdminApproved: true,isVenueApproved:true}
    });
    res.status(200).json(Events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const transporter = nodemailer.createTransport({
  service: 'gmail', // or use another provider like 'smtp.mailtrap.io'
  auth: {
    user: 'edwardekka17@gmail.com', // Replace with your email
    pass: 'kgsy newn opso hswr',   // Replace with your email password or app-specific password
  },
});

const sendMail = (req, res) => {
  // Dummy data for the email content
  const mailOptions = {
    from: 'edwardekka17@gmail.com',  // Sender address
    to: 'vishalekka18@gmail.com',    // Receiver address
    subject: "No subject",           // Subject of the email
    text: "This is a test email with no subject and no content", // Plain text body
    html: "<p>This is a <strong>test</strong> email with no subject and no content</p>",  // HTML body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
      return res.status(500).json({ message: 'Failed to send email', error });
    } else {
      console.log('Email sent successfully:', info.response);
      return res.status(200).json({ message: 'Email sent successfully', info });
    }
  });
};

const getOrganizersEvents = async (req, res) => {
  const organizerId = req.params.id;
  try {
    const events = await prisma.event.findMany({
      where: {
        createdById: organizerId, 
      },
    });
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found for this organizer.' });
    }

    return res.status(200).json(events); 

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while fetching events.' });
  }
};

module.exports = { createEventController, getAllApprovedEvents, sendMail, getOrganizersEvents};
