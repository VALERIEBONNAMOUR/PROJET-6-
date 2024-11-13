const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use('/images', express.static(path.join(__dirname, 'images')))

const db = require("./models");
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');
db.sequelize.sync().then(() => console.log('db is ready'));
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
module.exports = app;

const apiUrl = 'http://localhost:5678/api/works';

function fetchProjects() {
    fetch(apiUrl)
        .then(response => {
            console.log(response)
            return response.json();
        })
        .then(projects => {
            const gallery = document.getElementById('project-gallery');

            gallery.innerHTML = '';

            projects.forEach(project => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = `./images/${project.image}`;
                img.alt = project.title;
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = project.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                gallery.appendChild(figure);
            });
        })
}
document.addEventListener('DOMContentLoaded', fetchProjects);