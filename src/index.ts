import express from "express";
import {
  PORT,
  ES_HOSTS,
  INCLUDE_DEMO_DATA,
  INCLUDE_REAL_DATA,
  INDEX_ON_STARTUP,
  SYNC_SECRET,
} from "config";
import morgan from "morgan";
import { Client } from "@elastic/elasticsearch";
import indexData from "indexData";
import apiDocs from "./apiDocs";

(async () => {
  const app = express();
  app.use(morgan("combined"));

  const esClient = new Client({
    nodes: ES_HOSTS,
  });
  if (INDEX_ON_STARTUP) {
    await indexData({
      esClient,
      includeDemoData: INCLUDE_DEMO_DATA,
      includeRealData: INCLUDE_REAL_DATA,
    });
  }

  app.get("/status", (req, res) => {
    res.json({
      healthy: true,
    });
  });
  if (!!SYNC_SECRET) {
    app.post<{}, {}, { sourceUrl: string; secret: string }>(
      "/sync",
      async (req, res) => {
        const { sourceUrl, secret } = req.body;
        if (secret === SYNC_SECRET) {
          const rawData = await fetch(sourceUrl).then((res) => res.json());
          await indexData(rawData);
          res.status(200).end();
        } else {
          res.status(401).end();
        }
      }
    );
  } else {
    console.warn(
      "[WARNING!!!] SYNC_SECRET is not set, /sync endpoint will not be available"
    );
  }
  app.get("/api-docs", apiDocs());
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();
