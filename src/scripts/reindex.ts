import { Client } from "@elastic/elasticsearch";
import { ES_HOSTS } from "../config";
import indexData from "../indexData";

const reindex = async function () {
  console.log("Beginning Reindex...\n");

  const esClient = new Client({
    nodes: ES_HOSTS,
  });
  await indexData({
    esClient,
  });

  console.log("\nDone Reindex.");
};

reindex();
