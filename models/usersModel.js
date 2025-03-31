const mongoose = require('mongoose')


const usersSchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
        
    },
    password: {
        type:String,
        required: true
    }
},
{
    timestamps: true
}
)


const usersModel = mongoose.model("usersModel", usersSchema);

module.exports = usersModel;