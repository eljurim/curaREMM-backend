const express = require('express')
const app = express()
const bodyParser = require('body-parser');

//Conexion a la base de Datos
const db = require('./db')
//Importacion de Schemas
const Doctor = require('./Doctors').model
const Hospital = require('./Hospitals').model
db.connect()

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

let idAndLocationArray = [{"id":"5bfd85136004132880c3b8ee","latitude":"19.4376855","longitude":"-99.19358269999998"},{"id":"5bfd85126004132880c3b8e0","latitude":"19.2773291","longitude":"-99.12248499999998"},{"id":"5bfd85136004132880c3b8ed","latitude":"19.4376855","longitude":"-99.19358269999998"},{"id":"5bfd85136004132880c3b8e7","latitude":"19.4914349","longitude":"-99.24406809999999"},{"id":"5bfd85136004132880c3b8ec","latitude":"19.4376855","longitude":"-99.19358269999998"},{"id":"5bfd85146004132880c3b8f7","latitude":"19.5342207","longitude":"-99.2257573"},{"id":"5bfd85146004132880c3b8fc","latitude":"19.4386598","longitude":"-99.1551556"},{"id":"5bfd85146004132880c3b8fd","latitude":"19.3834269","longitude":"-99.16588469999999"},{"id":"5bfd85146004132880c3b900","latitude":"19.3279731","longitude":"-99.1436114"},{"id":"5bfd85146004132880c3b8f8","latitude":"19.5342207","longitude":"-99.2257573"},{"id":"5bfd85206004132880c3b9cf","latitude":"19.2842868","longitude":"-99.67375609999999"},{"id":"5bfd85226004132880c3b9f2","latitude":"19.4937311","longitude":"-99.2464448"},{"id":"5bfd85216004132880c3b9ed","latitude":"19.4172254","longitude":"-99.17147349999999"},{"id":"5bfd85226004132880c3b9f7","latitude":"21.5041651","longitude":"-104.89458869999999"},{"id":"5bfd850f6004132880c3b89f","latitude":"19.4240109","longitude":"-99.10491389999999"},{"id":"5bfd850f6004132880c3b89e","latitude":"19.4240109","longitude":"-99.10491389999999"}]

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

app.get('/hospitals', (req ,resp)=>{
    console.log("Donde sale esto?")
    console.log(req)
    resp.send(idAndLocationArray)
})

app.post('/hospitals/findById', async (req ,resp)=>{
    console.log(req.body);
    let hospitalsList = await Hospital.findById(req.body.id).exec()
    resp.send(hospitalsList)
})

app.post('/doctors/add', async (req ,resp)=>{
    console.log(req.body);
    await Doctor.create(req.body)
    resp.send(req.body.name + " Creado")
})
// a modificar para geolocalizacion
app.post('/doctors/findBySpecialty', async (req ,resp)=>{
    console.log(req.body);
    let responseWithDistance = []
    // let jsonBody = JSON.parse(req.body.position)
    console.log(req.body.latitude)
    console.log(req.body.longitude)
    await Doctor.find({"specialties":req.body.specialties},(err, foundDoctors) =>{
        foundDoctors.forEach((currentDoctor)=>{
            let distance = calculateDistance(req.body.latitude, req.body.longitude, currentDoctor.workPlaces.latitude, currentDoctor.workPlaces.longitude, "K")
            console.log(distance)
            currentDoctor = currentDoctor.toObject()
            currentDoctor = Object.assign({distance},currentDoctor)
            responseWithDistance.push(currentDoctor)
        })
        
        resp.send(responseWithDistance)
    })
})

app.get('/doctors/specialtiesList', async (req, resp)=>{
    resp.send(await Doctor.find({}).distinct('specialties'))
})

app.get('/doctors/distincAddresses', async (req, resp)=>{
    resp.send(await Doctor.find({}).distinct('workPlaces'))
})

app.get('/hospitals/findAll', async (req ,resp)=>{
    let hospitalsList = await Hospital.find({}).exec()
    resp.send(hospitalsList)
})

app.get('/hospitals/distincAddresses', async (req ,resp)=>{
    let hospitalsList = await Hospital.find({}).distinct('searchableAddress').exec()
    resp.send(hospitalsList)
})

app.get('/hospitals/distincLocations', async (req ,resp)=>{
    let hospitalsList = await Hospital.find({}).distinct('position').exec()
    resp.send(hospitalsList)
})

app.listen(8080, () =>{
    console.log('app listen in port 8080')
})