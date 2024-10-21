const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  phone_no: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },


});

adminSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// admin login
adminSchema.statics.login = async function (email, password) {
  const admin = await this.findOne({ email });
  if (admin) {
    // compare password
    const auth = await bcrypt.compare(password, admin.password);

    if (auth) {
      return admin;
    }
    throw new Error("Incorrect email address or password");
  }
  throw new Error("Incorrect email address or password");
};

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
