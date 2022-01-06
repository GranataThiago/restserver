const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    middlewares() {

        // Directorio Público
        this.app.use(express.static('public'));

        // Parseo del body
        this.app.use(express.json());

        // CORS
        this.app.use(cors());
    }

    routes() {

        this.app.use('/api/users', require('../routes/user.routes'))

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log('Server listening on port', this.port)
        })

    }

}

module.exports = Server