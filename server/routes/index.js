
const express = require('express');
const fs = require('fs');


module.exports.mountRoutes = (app) => {
    fs.readdirSync(__dirname).filter(file => {
        if (file !== "index.js") {
            const routes = require('./' + file);
            routes.routes(express, app)
        }
    })
}