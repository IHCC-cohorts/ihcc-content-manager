import express from "express";
import * as swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

export default () => {
  const router = express.Router();
  const mainDoc = yaml.load(path.join(__dirname, "./assets/swagger.yaml"));
  console.log('mainDoc: ', mainDoc)
  router.use("/", swaggerUi.serve, swaggerUi.setup(mainDoc));
  return router;
};
