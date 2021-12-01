import { Client } from "@elastic/elasticsearch";
import { ES_HOSTS, INCLUDE_DEMO_DATA, INCLUDE_REAL_DATA } from "../config";
import indexData from "../indexData";

const reindex = async function () {
  console.log("Begining Redindex...\n");

  const esClient = new Client({
    nodes: ES_HOSTS,
  });
  console.log("Real Data:", INCLUDE_REAL_DATA);
  console.log("Demo Data:", INCLUDE_DEMO_DATA);
  await indexData({
    esClient,
    includeDemoData: INCLUDE_DEMO_DATA,
    includeRealData: INCLUDE_REAL_DATA,
  });

  console.log("\nDone Redindex.");
};

reindex();
