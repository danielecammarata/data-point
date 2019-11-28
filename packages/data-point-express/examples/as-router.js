const Express = require("express");
const Service = require("../lib");
const entities = require("./entities");

const app = new Express();

// API Routes
const routes = {
  helloWorld: {
    priority: 100,
    path: "/hello-world",
    middleware: "reducer:HelloWorld"
  },
  greet: {
    priority: 200,
    path: "/greet/:name",
    middleware: "reducer:greet"
  },
  getPerson: {
    priority: 300,
    path: "/person/:personId",
    middleware: "entry:getPerson"
  }
};

Service.create({ entities })
  .then(service => {
    // create Express routes

    // creates an inspect route
    // only use this in NON Production
    // environments.
    app.use("/api/inspect", service.inspector());

    // create api routes
    app.use("/api", service.router(routes));

    app.listen(3000, err => {
      if (err) {
        throw err;
      }

      // eslint-disable-next-line no-console
      console.info("Server ready!");

      // eslint-disable-next-line no-console
      console.info(
        "Inspector available at",
        "http://localhost:3000/api/inspect"
      );
    });
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.info("Failed to Create Service");
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
