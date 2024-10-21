const mongoose = require('mongoose');

dbConnect = ()=>{
    mongoose.connect(process.env.DB_URI)
}

module.exports = {dbConnect};