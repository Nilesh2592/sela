const selaModel = require('./../model/selaModel');
const ObjectsToCsv = require('objects-to-csv')
const log = require('./../config/loggerConfig');


module.exports.search = async(req, res) => {
    try {
        if (req.body.startDate && req.body.endDate) {
            const criteria = {
                createdAt: {
                    $gte: new Date(parseInt(req.body.startDate)).toISOString(),
                    $lte: new Date(parseInt(req.body.endDate)).toISOString()
                }
            }
            const result = await selaModel.search(criteria);

            // save result into csv file
            const csv = new ObjectsToCsv(result);
            await csv.toDisk(`./search/${process.env.resultFile}.csv`);

            let fileUrl = `${process.env.apiUrl}/download/${process.env.resultFile}.csv`;

            return res.status(200).json({ status: true, fileUrl });
        } else {
            return res.status(400).json({ status: false, message: 'Invalid start and end dates'});
        }
    } catch(error) {
        console.log(error);
        log.info(`Error in search result: ${JSON.stringify(error)}`);
        res.status(500).json({ status: false, message: "Error in search result" });
    }
}

module.exports.download = async (req, res) => {
    try {
        const file = `${__dirname}/../search/${req.params.fileName}`;
        res.download(file);
    } catch (error) {
        log.info(`Error in download: ${JSON.stringify(error)}`);
        res.status(500).json({ status: false, message: "Error in download" });
    }
}