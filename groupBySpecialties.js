const db = require('./db')
//Importacion de Schemas
db.connect()

const Doctor = require('./Doctors').model


Doctor.aggregate([
    {
        $group: {
            _id: '$specialties',  //$region is the column name in collection
            count: {$sum: 1}
        }
    }
], function (err, result) {
    if (err) {
        next(err);
    } else {
        res.json(result);
    }
});


