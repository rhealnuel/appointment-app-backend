const express = require("express")
const verifyToken = require('../middleware/VerifyToken')
const appointmentModel = require("../models/appointment")
const usersModel = require("../models/usersModel")




const router = express.Router()


router.get('/appointments', verifyToken, async(req, res) => {
   
    try {
        if(req.user.userType === "Other"){
            const appointments = await appointmentModel.find({ createdBy: req.user.id });

            return res.status(200).json({data: appointments})

        } else {

            const appointments = await appointmentModel.find({ provider: req.user.id });

            return res.status(200).json({data: appointments})
        }


    } catch (error) {
        return res.status(500).json({error: error.message})
    }

})

router.post('/book-appointment', verifyToken, async(req, res) => {

    const { petName, appDate, note, provider} = req.body

    try {
        if(!provider || !petName || !appDate || !note){
            return res.status(404).json({message: "please fill the required fields"})
        }
        
        const newAppointment = new appointmentModel({
            provider,
            petName,
            appDate,
            note,
            createdBy: req.user.id
        })

        await newAppointment.save();
            res.status(200).json({message: "appointment created successfully"})
            

    } catch (error) {
        res.status(500).json({error: error.message})

    }
})

router.post('/edit-status', verifyToken, async(req, res) => {
    const id = req.body.id
    const status = req.body.status

    try {
        if(!id || !status){
            return res.status(404).json({message: "please fill the required fields"})
        }

        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true } // Returns updated document and validates status
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({message: "status updated successfully"});

    } catch (error) {
        return res.status(500).json({error: error.message });

    }

})

router.post("/delete", verifyToken, async(req, res) => {
    const id = req.body.id
    try {
        const deleted = await appointmentModel.findByIdAndDelete(id)

        if(!deleted){
            return res.status(404).json({ message: "Appointment not found" });
    
        }
        res.status(200).json({message: "appointment successfully"});
    } catch (error) {
        return res.status(500).json({error: error.message });

    }
   


})

router.get("/userType", verifyToken, async(req, res) => {
    try {
        // Find all documents and project only "petName"
        const userTypes = await usersModel.find({}, { userType: 1, _id: 0 });

        if (userTypes.length === 0) {
            return res.status(404).json({ message: "No type found" });
        }

        // Extract an array of pet names
        const userTypeList = userTypes
        .filter(item => item.userType && item.userType !== "Other") // Exclude "Other"
        .map(item => item.userType);

        res.status(200).json({data : userTypeList}); 
    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
})

router.post("/provider", verifyToken, async(req, res) => {
    const userType = req.body.userType

    try {
        // Find all documents and project only "petName"
        const userTypes = await usersModel.find({userType: userType}).select("_id name email userType");
        // .populate('provider');

        if (userTypes.length === 0) {
            return res.status(404).json({ message: "No type found" });
        }

        // Extract an array of pet names
        const userTypeList = userTypes.map(item => item.userType);

        res.status(200).json({data : userTypes}); 
    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
})


module.exports = router