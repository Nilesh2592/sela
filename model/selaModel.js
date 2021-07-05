const dbConfig = require('./../config/dbConfig');
const log = require('./../config/loggerConfig');
const { ObjectId } = require('mongodb');


module.exports.search = async(criteria) => {
    try {
        // Connect to database
        const db = await dbConfig.connect();
        return await db.collection('data').find(criteria, { _id: 0, createdAt: 1, customerId: 1, invoiceId: 1 }).toArray();
    } catch(error) {
        throw error;
    }
}

module.exports.addData = async (data) => {
    try {
        // Connect to database
        const db = await dbConfig.connect();
        return await db.collection('data').insertMany( data, { ordered: false });
    } catch(error) {
        throw error;
    }
}