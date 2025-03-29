import NadraDB from '../models/nadra.model.js';

// Get all NADRA records
export const getAllRecords = async (req, res) => {
    try {
        const records = await NadraDB.find();
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving records', error: err });
    }
};

// Get a NADRA record by CNIC
export const getRecordByCNIC = async (req, res) => {
    const { cnic } = req.params;
    try {
        const record = await NadraDB.findOne({ cnic });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(record);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving record', error: err });
    }
};
