const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Profile_Picture:{
        data: Buffer,
        contentType: String
    },
    First_Name: String,
    Last_Name: String,
    Email: String,
    Phone_Number: String,
    contacts : [{
        type: Schema.Types.ObjectId,
        ref: 'contacts'
    }],
    Password: String,
})

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
