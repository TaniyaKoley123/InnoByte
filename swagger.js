import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskSphere API",
      version: "1.0.0",
      description: "API documentation for TaskSphere project",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // change later after deployment
      },
    ],
  },
  apis: ["./routes/*.js"], // path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
