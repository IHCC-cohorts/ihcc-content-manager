import express from "express";
import { PORT, ES_HOSTS, INCLUDE_DEMO_DATA, INCLUDE_REAL_DATA } from "config";
import morgan from "morgan";
import { Client } from "@elastic/elasticsearch";
import indexData from "indexData";

(async () => {
  const app = express();
  app.use(morgan("combined"));

  const esClient = new Client({
    nodes: ES_HOSTS,
  });
  await indexData({
    esClient,
    includeDemoData: INCLUDE_DEMO_DATA,
    includeRealData: INCLUDE_REAL_DATA,
  });

  app.get("/status", (req, res) => {
    res.json({
      healthy: true,
    });
  });
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();
