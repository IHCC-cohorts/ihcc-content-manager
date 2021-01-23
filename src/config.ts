export const PORT = Number(process.env.PORT || 5000);
export const ES_INDEX = String(process.env.ES_INDEX || "demo_index");
export const ES_HOSTS = (process.env.ES_HOSTS || "http://localhost:9200").split(
  ","
);
export const INCLUDE_DEMO_DATA = process.env.INCLUDE_DEMO_DATA === "true";
export const INCLUDE_REAL_DATA = process.env.INCLUDE_REAL_DATA === "true";
export const INDEX_ON_STARTUP = process.env.INDEX_ON_STARTUP === "true";
export const SYNC_SECRET = process.env.SYNC_SECRET;
