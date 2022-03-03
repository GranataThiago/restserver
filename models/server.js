const express = require('express');
const cors = require('cors');
const { connectDB } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            search: '/api/search',
        }

        // Conectar a la base de datos
        this.connectDatabase();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async connectDatabase() {
        await connectDB();
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

        this.app.use(this.paths.auth, require('../routes/auth.routes'))
        this.app.use(this.paths.categories, require('../routes/category.routes'))
        this.app.use(this.paths.users, require('../routes/user.routes'))
        this.app.use(this.paths.products, require('../routes/product.routes'))
        this.app.use(this.paths.search, require('../routes/search.routes'))

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log('Server listening on port', this.port)
        })

    }

}

module.exports = Server