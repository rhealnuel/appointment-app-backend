const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
    createdBy:  { 
        type: mongoose.Schema.Types.ObjectId, // Reference by ID
        ref: 'usersModel', // Reference to 'User' model
        required: true,

      },
    petName: String,
    appDate: {
        type: Date,
        required: true
    },
    note: {
        type: String,
        required: true
    }, 
    status: {
        type: String,
        enum: ["Awaiting", "Pending", "In-Progress", "Completed", "Declined" ],
        default: "Awaiting",
        required: true
    },
    provider: { 
        type: mongoose.Schema.Types.ObjectId, // Reference by ID
        ref: 'usersModel', // Reference to 'User' model
        required: true,

      },
},
{
    timestamps: true
}
)

const appointmentModel = mongoose.model("appointmentModel", appointmentSchema);

module.exports = appointmentModel;