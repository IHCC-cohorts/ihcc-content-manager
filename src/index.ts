import express from "express";
import { PORT, ES_HOSTS } from "config";
import morgan from "morgan";
import { Client } from "@elastic/elasticsearch";
import indexData from "indexData";

(async () => {
  const app = express();
  app.use(morgan("combined"));

  const esClient = new Client({
    nodes: ES_HOSTS,
  });
  await indexData(esClient);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();
