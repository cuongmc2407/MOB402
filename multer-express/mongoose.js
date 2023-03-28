const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
    tieude: {
        type: String,
        required: true
    },
    noidung: {
        type: String,
    },
    tailieu: {
        type: Number,
        default: 0,
    },
});

const LabModel = mongoose.model('lab',LabSchema);
module.exports = LabModel;