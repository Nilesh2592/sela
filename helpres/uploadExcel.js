const multer = require('multer');
const log = require('./../config/loggerConfig');
const selaModel = require('./../model/selaModel');
const csv = require('csvtojson');

const location = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './csv');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const uploadFile = multer({
    storage: location,
    limits: { fileSize: 50000000 }
}).fields([
    { name: 'file', maxCount: 1 }
])

module.exports.uploadCsv = uploadFile

module.exports.dataStorage = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: 'No file selected' })
        }

        const dataArray = [];

        req.files.file.forEach(async (file) => {
            const data = await csv().fromFile(`./csv/${file.originalname}`);
            data.forEach(row => {
                if(row.createdAt && row.customerId && row.invoiceId) {
                    dataArray.push({
                        createdAt: new Date(parseInt(row.createdAt)).toISOString(),
                        customerId: row.customerId,
                        invoiceId: row.invoiceId
                    });
                }
            });
            selaModel.addData(dataArray);
        });

        return res.status(200).json({ status: 'success', message: 'File uploaded & Data inserted successfully' });
    } catch (error) {
        console.log(error);
        log.info(`Error in file upload: ${JSON.stringify(error)}`);
        return res.status(500).json({ message: 'Error in file upload' });
    }
}