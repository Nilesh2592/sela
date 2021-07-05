const MongoClient = require( 'mongodb' ).MongoClient;
const logger = require('./loggerConfig');

let connection;

module.exports = {
    // TO-DO check connection is established or not if yes then return
    connect: async () => {
        if(!connection) {
            client = await MongoClient.connect(process.env.databaseUrl, { 
                useNewUrlParser: true, 
                useUnifiedTopology: true 
            });
            connection = client.db(process.env.databaseName);
        }
        return connection;
    },

    close: async () => {
        logger.info('Database connection closed successfully!');
        connection.close();
    },
};