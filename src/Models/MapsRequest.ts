import * as mongoose from 'mongoose';

const mapsRequestSchema = new mongoose.Schema({
    requestEndpoint: String,
    requestor: String,
    requestDate: Date,
});

const MapsRequest = mongoose.model('MapsRequest', mapsRequestSchema);
export default MapsRequest;
