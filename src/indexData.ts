import { Client } from "@elastic/elasticsearch";
import transformDocs, { Raw } from "./transformDocs";
import { ES_INDEX } from "./config";
import indexSetting from "./assets/cohort_centric.json";
import cohortData from "./assets/cohort_data.json";

export const initIndexMapping = async (index: string, esClient: Client) => {
  const serializedIndexName = index.toLowerCase();
  await esClient.indices.putMapping({
    index: serializedIndexName,
    body: indexSetting,
  });
};

const sleep = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, 500);
  });

const indexData = async (config: { esClient: Client }) => {
  const { esClient } = config;
  const dataToTransform = cohortData as Raw[];
  console.log(
    `Inserting ${dataToTransform.length} cohort documents to ${ES_INDEX}`
  );
  const cohorts = transformDocs(dataToTransform);
  await esClient.indices
    .delete({
      index: ES_INDEX,
    })
    .catch((err) => {
      console.log(`Error deleting index ${ES_INDEX}:`);
      console.error(err);
    })
    .then(sleep);
  await esClient.indices
    .create({
      index: ES_INDEX,
      body: indexSetting,
    })
    .catch((err) => {
      console.log(`Could not create index ${ES_INDEX}`);
      console.error(err);
    })
    .then(sleep);
  console.log(`Index ${ES_INDEX} has been updated.`);
  await Promise.all(
    cohorts.map((cohort, i: number) => {
      return esClient
        .index({
          index: ES_INDEX,
          id: cohort.cohort_name,
          body: cohort,
        })
        .catch((err) => {
          console.log("i: ", i);
          throw err;
        });
    })
  );
};
export default indexData;
