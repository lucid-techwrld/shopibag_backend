const mongoose = require('mongoose')


const MONGODB = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        console.log('connnecting....')
        mongoose.connection.on('connected', () => console.log('Database connected sucessfully'))
        await mongoose.connect(MONGODB)
    } catch (error) {
        console.error(error)
    }
}

module.exports = connectDB;