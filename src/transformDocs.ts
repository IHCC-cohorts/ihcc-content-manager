import _ from "lodash";
import raw from "./assets/raw_data.json";

type MappingShape = {
  cohort_autocomplete?: string;
  cohort_name?: string;
  countries: string[];
  pi_lead?: string;
  website?: string;
  current_enrollment: number;
  available_data_types?: {
    genomic_data: boolean;
    environmental_data: boolean;
    biospecimens: boolean;
    phenotypic_clinical_data: boolean;
  };
  basic_cohort_attributes: string[];
  biosample: {
    sample_types: string[];
    biosample_variables: string[];
  };
  laboratory_measures: {
    genomic_variables: string[];
    microbiology: string[];
  };
  questionnaire_survey_data: {
    lifestyle_and_behaviours: string[];
    physiological_measurements: string[];
    socio_demographic_and_economic_characteristics: string[];
  };
};

type Raw = {
  prefix?: string;
  cohort_name?: string;
  countries?: string[];
  pi_lead?: string;
  website?: string;
  current_enrollment?: number;
  available_data_types?: {
    genomic_data: boolean;
    environmental_data: boolean;
    biospecimens: boolean;
    phenotypic_clinical_data: boolean;
  };
  basic_cohort_attributes?: {
    [k: string]: string[] | null;
  };
  biosample?: {
    sample_type?: string[];
  };
  laboratory_measures?: {
    microbiology?: string[];
  };
  questionnaire_survey_data: {
    lifestyle_and_behaviours?: string[];
    physiological_measurements?: {
      anthropometry?: string[];
      circulation_and_respiration?: string[];
    };
    socio_demographic_and_economic_characteristics?: string[];
  };
};

const toEsDocument = (allData: Raw[]) => {
  const randomSampleTypeDistribution = [
    "saliva",
    "blood",
    "blood",
    "blood",
    "stool",
    "stool",
    "stool",
    "stool",
    "urine",
    "urine",
  ];
  return (raw: Raw, i: number): MappingShape => {
    const toSpaceCase = (str: string) => str.split("_").join(" ");
    const additionalBiosampleTypeCounts = Math.floor(Math.random() * 2) + 1;
    const randomAdditionalSamples = _.range(
      0,
      additionalBiosampleTypeCounts
    ).map(() => {
      const index = Math.floor(
        Math.random() * randomSampleTypeDistribution.length
      );
      return randomSampleTypeDistribution[index];
    });

    const sanitizeName = (name: string) => {
      return Object.entries({
        "√∂": "ö",
        "√•": "å",
        "√§": "ä",
        "√ò": "O",
        "√¶": "ae",
      }).reduce((name, [key, value]) => name?.split(key).join(value), name);
    };
    try {
      const output = {
        cohort_name: raw.cohort_name,
        countries:
          raw.countries?.map((country) => {
            if (country === "") {
              if (raw.cohort_name === "NICCC") {
                return "USA";
              }
            }
            return (
              ({
                "Republic of Korea": "South Korea",
                "South Korea": "South Korea",
                Korea: "South Korea",
              } as { [k: string]: string })[country] || country
            );
          }) || [],
        current_enrollment: raw.current_enrollment || 0,
        basic_cohort_attributes: Object.values(
          raw.basic_cohort_attributes || {}
        )
          .reduce<string[]>(
            (acc, attributes) => [...acc, ...(attributes || [])],
            []
          )
          .map(toSpaceCase),
        biosample: {
          biosample_variables: [],
          sample_types: _(raw.biosample?.sample_type || [])
            .concat(randomAdditionalSamples)
            .uniq()
            .value(),
        },
        available_data_types: raw.available_data_types || {
          biospecimens: false,
          environmental_data: false,
          genomic_data: false,
          phenotypic_clinical_data: false,
        },
        laboratory_measures: {
          genomic_variables: [],
          microbiology: (raw.laboratory_measures?.microbiology || []).map(
            toSpaceCase
          ),
        },
        pi_lead: raw.pi_lead ? sanitizeName(raw.pi_lead) : "",
        questionnaire_survey_data: {
          socio_demographic_and_economic_characteristics: (
            raw.questionnaire_survey_data
              .socio_demographic_and_economic_characteristics || []
          ).map(toSpaceCase),
          lifestyle_and_behaviours: (
            raw.questionnaire_survey_data.lifestyle_and_behaviours || []
          ).map(toSpaceCase),
          physiological_measurements: [
            ...(raw.questionnaire_survey_data.physiological_measurements
              ?.anthropometry || []),
            ...(raw.questionnaire_survey_data.physiological_measurements
              ?.circulation_and_respiration || []),
          ].map(toSpaceCase),
        },
        website:
          ({
            "Korean Genome and Epidemiology Study (KoGES)":
              "http://www.cdc.go.kr/contents.es?mid=a50401010100",
            "Golestan Cohort Study":
              "https://dceg2.cancer.gov/gemshare/studies/GCS/",
          } as { [k: string]: string })[raw.cohort_name || ""] || raw.website,
      };
      console.log("output: ", output);
      return output;
    } catch (err) {
      console.log("err: ", err);
      throw err;
    }
  };
};

export default () => {
  // @ts-ignore it's ok we want to model the type explicitly
  const output = raw.map(toEsDocument(raw as Raw));
  return output;
};
