const prisma = require("../prismaClient");

const requestForApproval = async (req, res) => {
    const { userId, eventId, adminId, message } = req.body; 

    if (!userId || !eventId || !message) {
        return res.status(400).json({ error: "userId, eventId, and message are required." });
    }

    try {
        // Create a new request in the database
        const newRequest = await prisma.request.create({
            data: {
                userId,
                eventId,
                adminId,
                message,
                status: "PENDING", 
            },
        });

        // Update the corresponding Event record
        await prisma.event.update({
            where: { id: eventId },
            data: { isRequestedForApproval: true },
        });

        return res.status(201).json({ 
            message: "Request for approval created successfully.", 
            request: newRequest 
        });
    } catch (error) {
        console.error("Error creating request for approval:", error);
        return res.status(500).json({ 
            error: "An error occurred while creating the request for approval." 
        });
    }
};

const approveEventByAdmin = async (req, res) => {
    const { eventId, status } = req.body; // `status` can be "APPROVED" or "REJECTED"
    try {
      // Validate input
      if (!eventId || !["APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({ message: "Invalid input data." });
      }
  
      // Update event status and isRequestedForApproval field
      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: {
          status, // Set status to APPROVED or REJECTED
          isAdminApproved: status === "APPROVED", // Update admin approval flag if approved
          isVenueApproved: status === "APPROVED",
          isRequestedForApproval: false, // Set to false when status is updated
        },
      });
  
      // Delete associated requests for the event
      await prisma.request.deleteMany({
        where: { eventId },
      });
  
      return res.status(200).json({
        message: `Event ${status.toLowerCase()} successfully.`,
        event: updatedEvent,
      });
    } catch (error) {
      console.error("Error approving event:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const AdminRequests = async (req, res) => {
    const  adminId  = req.params.id;

    if (!adminId) {
        return res.status(400).json({ error: "adminId is required." });
    }

    try {
        // Fetch all requests associated with the admin
        const requestedEvents = await prisma.request.findMany({
            where: { adminId },
            include: {
                event: true, // Include event details if needed
                user: true,  // Include user details if needed
            },
        });

        return res.status(200).json({
            message: "Requests fetched successfully.",
            requests: requestedEvents,
        });
    } catch (error) {
        console.error("Error fetching admin requests:", error);
        return res.status(500).json({ 
            error: "An error occurred while fetching the requests." 
        });
    }
};

module.exports = { requestForApproval, approveEventByAdmin, AdminRequests };


