const express = require("express");
const descriptions = require("../routes/admin/descriptions");
const services = require("../routes/admin/services");
const views = require("../routes/admin/views");
const guests = require("../routes/admin/guests")


//to handle res.header
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, x-auth-token"
      );
      next();
    });

      //When enabled, Express attempts to determine the IP address of the client connected
  //through the front-facing proxy, or series of proxies.
  app.enable("trust proxy");

  app.use("/api/descriptions",descriptions);
  app.use("/api/services",services);
  app.use("/api/views",views);
  app.use("/api/guests",guests)
}