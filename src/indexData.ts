import { Client } from "@elastic/elasticsearch";
import indexSetting from "./assets/cohort_centric.json";
import transformDocs, { Raw } from "transformDocs";
import { ES_INDEX } from "config";
import demoData from "./assets/raw_data.json";
import realData from "./assets/real_data.json";

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
      resolve();
    }, 500);
  });

const indexData = async (config: {
  esClient: Client;
  includeDemoData: boolean;
  includeRealData: boolean;
}) => {
  const { esClient, includeDemoData, includeRealData } = config;
  const dataToTransform = [
    ...((includeRealData ? realData : []) as Raw[]),
    ...((includeDemoData ? demoData : []) as Raw[]),
  ];
  const cohorts = transformDocs(dataToTransform);
  await esClient.indices
    .delete({
      index: ES_INDEX,
    })
    .catch((err) => {
      console.log(
        `tried to delete index ${ES_INDEX}, but it doesn't exist yet?`
      );
      console.error(err);
    })
    .then(sleep);
  await esClient.indices
    .create({
      index: ES_INDEX,
      body: indexSetting,
    })
    .catch((err) => {
      console.log(`could not create index ${ES_INDEX}`);
      console.error(err);
    })
    .then(sleep);
  console.log(`index ${ES_INDEX} is up to date`);
  await Promise.all(
    cohorts.map((cohort: object, i: number) => {
      return esClient
        .index({
          index: ES_INDEX,
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
