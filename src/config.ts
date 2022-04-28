export const PORT = Number(process.env.PORT || 5000);
export const ES_INDEX = String(process.env.ES_INDEX || "demo_index");
export const ES_HOSTS = (process.env.ES_HOSTS || "http://localhost:9200").split(
  ","
);
