const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactSchema = new Schema({ 
    First_Name: String,
    Last_Name: String,  
    Phone_Number: String,
    users: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

const ContactModel = mongoose.model('contacts', ContactSchema);

module.exports = ContactModel;