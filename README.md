# IHCC Content Manager

Simple ETL service to add cohort data to the IHCC data portal. This application will transform a provided JSON source file of Cohorts into ES documents then upload these documents to elastic search. This can be run in two ways:

1. Command line service that runs a script to recreate the ES index and populate the cohort data.
1. Run an express API server that will recreate the ES index on startup.

   > NOTE: The intention of the server was to provide an API endpoint to reindex ES on command, but this has never been created. Since no authentication system was created for this poject it was determined that running a web service to reindex the data was an unecessary risk.
   >
   > Therefore, the API server mode of this is a placeholder for future (optional) development

## Running the Reindex Script

To run the re-index service:

1. Clone repo
1. Install NPM Dependencies:

   ```
   npm ci
   ```

1. Execute the reindex script:

   ```
   npm run reindex
   ```

   If necessary, add environment variables for the elasticsearch connection if the default values aren't correct:

   ```
   ES_INDEX=nci_cohort_data ES_HOSTS=https://es.example.com:9200 npm run index
   ```

   ### Configuring the reindex script

   We want to run the script `reindex` using `npm`, but first must provide some configuration. The environment variables this script expects are details in the `./src/config.ts` file and summarized in this table:

   | Env Variable | Default                 | Description                                                                |
   | ------------ | ----------------------- | -------------------------------------------------------------------------- |
   | **ES_INDEX** | `demo_index`            | Name of the ES index that will be created/replaced when this script is run |
   | **ES_HOSTS** | `http://localhost:9200` | Elasticsearch URL                                                          |
   |              |                         |

   To run the script with a non-default value for any of these properties, add them at the start of the command before `npm run reindex`. Example with custom ES_INDEX and ES_HOSTS values, including only real data:

   ```
   ES_HOSTS=http://example.com:9200 ES_INDEX=cohort_data_2021 INCLUDE_REAL_DATA=true npm run reindex
   ```

## Updating Real Data From Source

The source of truth for IHCC Cohort Data is: https://github.com/IHCC-cohorts/data-harmonization/blob/master/data/cohort-data.json

To update the ES index with this data, copy the contents of that file and replace the contents of `./src/assets/real_data.json`, Then run the reindex script.
