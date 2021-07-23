const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Juanes'));
bands.addBand( new Band('Mana'));
bands.addBand( new Band('Gian Marcos'));
bands.addBand( new Band('Cafe tacuba'));

//Mensajes de sockets
io.on('connection', client => {
    console.log("cliente conectado")

    client.emit('active-bands', bands.getBand());

    client.on('disconnect', () => {
        console.log("cliente desconectado");
    });

    client.on('mensaje', (payload) =>{
        console.log("mensaje: ",payload);
    });

    client.on('vote-band', (payload) =>{
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBand());
    });

    client.on('add-band', (payload) =>{
        //console.log(payload);
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBand());
    });

    client.on('delete-band', (payload) =>{
        //console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBand());
    });

    // client.emit('mensaje', {mensaje: "nuevo mensaje desde el server"});

    // client.on('emitir-mensaje', (payload) => {
    //     //io.emit('nuevo-mensaje', payload);  //emite a todos
    //     client.broadcast.emit('nuevo-mensaje', payload);  //emite a todos menos el que lo emitió
    // });

});