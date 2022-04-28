import _ from "lodash";

type MappingShape = {
  cohort_autocomplete?: string;
  cohort_name?: string;
  available_data_types: {
    biospecimens: string;
    genomic_data: string;
    genomic_data_wgs: string;
    genomic_data_wes: string;
    genomic_data_array: string;
    genomic_data_other: string;
    demographic_data: boolean;
    imaging_data: string;
    participants_address_or_geocode_data: string;
    electronic_health_record_data: string;
    phenotypic_clinical_data: string;
  };
  basic_cohort_attributes: string[];
  biosample: {
    sample_types: string[];
    biosample_variables: string[];
  };
  cohort_ancestry: {
    asian: string;
    black_african_american_or_african: string;
    european_or_white: string;
    hispanic_latino_or_spanish: string;
    middle_eastern_or_north_african: string;
    other: boolean;
  };
  countries: string[];
  current_enrollment: number;
  dictionary_harmonized: boolean;
  irb_approved_data_sharing: string;
  laboratory_measures: {
    genomic_variables: string[];
    microbiology: string[];
  };
  pi_lead?: string;
  questionnaire_survey_data: {
    lifestyle_and_behaviours: string[];
    physiological_measurements: string[];
    socio_demographic_and_economic_characteristics: string[];
    diseases: string[];
    medication: string[];
    non_pharmacological_interventions: string[];
    healthcare_information: string[];
  };
  target_enrollment?: number;
  type_of_cohort: {
    case_control: boolean;
    cross_sectional: boolean;
    longitudinal: boolean;
    health_records: boolean;
    other: boolean;
  };
  website?: string;
};

export type Raw = {
  prefix?: string;
  cohort_name?: string;
  available_data_types?: {
    biospecimens?: string;
    genomic_data?: string;
    genomic_data_wgs?: string;
    genomic_data_wes?: string;
    genomic_data_array?: string;
    genomic_data_other?: string;
    demographic_data?: boolean;
    imaging_data?: string;
    participants_address_or_geocode_data?: string;
    electronic_health_record_data?: string;
    phenotypic_clinical_data?: string;
  };
  basic_cohort_attributes?: {
    [k: string]: string[] | null;
  };
  biosample?: {
    sample_type?: string[];
  };
  cohort_ancestry?: {
    asian?: string;
    black_african_american_or_african?: string;
    european_or_white?: string;
    hispanic_latino_or_spanish?: string;
    middle_eastern_or_north_african?: string;
    other?: boolean;
  };
  countries?: string[];
  current_enrollment?: number;
  dictionary_harmonized?: boolean;
  irb_approved_data_sharing?: string;
  laboratory_measures?: {
    microbiology?: string[];
  };
  pi_lead?: string;
  questionnaire_survey_data?: {
    lifestyle_and_behaviours?: string[];
    physiological_measurements?: {
      anthropometry?: string[];
      circulation_and_respiration?: string[];
    };
    socio_demographic_and_economic_characteristics?: string[];
    diseases?: string[];
    medication?: string[];
    non_pharmacological_interventions?: string[];
    healthcare_information?: string[];
  };
  target_enrollment?: number;
  type_of_cohort?: {
    case_control?: boolean;
    cross_sectional?: boolean;
    longitudinal?: boolean;
    health_records?: boolean;
    other?: boolean;
  };
  website?: string;
};

/**
 * This is used just for demo.
 */
const generateRandomSampleTypes = () => {
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
  const additionalBiosampleTypeCounts = Math.floor(Math.random() * 2) + 1;
  const randomSampleTypes = _.range(0, additionalBiosampleTypeCounts).map(
    () => {
      const index = Math.floor(
        Math.random() * randomSampleTypeDistribution.length
      );
      return randomSampleTypeDistribution[index];
    }
  );
  return randomSampleTypes;
};

const toEsDocument = (allData: Raw[]) => {
  return (rawEntry: Raw, i: number): MappingShape => {
    const toSpaceCase = (str: string) => str.split("_").join(" ");
    const randomSampleTypes: string[] = generateRandomSampleTypes();
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
      const output: MappingShape = {
        cohort_name: rawEntry.cohort_name,
        available_data_types: {
          biospecimens: rawEntry.available_data_types?.biospecimens || "0%",
          genomic_data: rawEntry.available_data_types?.genomic_data || "0%",
          genomic_data_wgs:
            rawEntry.available_data_types?.genomic_data_wgs || "0%",
          genomic_data_wes:
            rawEntry.available_data_types?.genomic_data_wes || "0%",
          genomic_data_array:
            rawEntry.available_data_types?.genomic_data_array || "0%",
          genomic_data_other:
            rawEntry.available_data_types?.genomic_data_other || "0%",
          demographic_data:
            rawEntry.available_data_types?.demographic_data || false,
          imaging_data: rawEntry.available_data_types?.imaging_data || "0%",
          participants_address_or_geocode_data:
            rawEntry.available_data_types
              ?.participants_address_or_geocode_data || "0%",
          electronic_health_record_data:
            rawEntry.available_data_types?.electronic_health_record_data ||
            "0%",
          phenotypic_clinical_data:
            rawEntry.available_data_types?.phenotypic_clinical_data || "0%",
        },
        basic_cohort_attributes: Object.values(
          rawEntry.basic_cohort_attributes || {}
        )
          .reduce<string[]>(
            (acc, attributes) => [...acc, ...(attributes || [])],
            []
          )
          .map(toSpaceCase),
        biosample: {
          biosample_variables: [],
          sample_types: _(rawEntry.biosample?.sample_type || [])
            // .concat(randomSampleTypes) // use this if need random fake data
            .uniq()
            .value(),
        },
        cohort_ancestry: {
          asian: rawEntry.cohort_ancestry?.asian || "0%",
          black_african_american_or_african:
            rawEntry.cohort_ancestry?.black_african_american_or_african || "0%",
          european_or_white:
            rawEntry.cohort_ancestry?.european_or_white || "0%",
          hispanic_latino_or_spanish:
            rawEntry.cohort_ancestry?.hispanic_latino_or_spanish || "0%",
          middle_eastern_or_north_african:
            rawEntry.cohort_ancestry?.middle_eastern_or_north_african || "0%",
          other: rawEntry.cohort_ancestry?.other || false,
        },
        countries:
          rawEntry.countries?.map((country) => {
            if (country === "") {
              if (rawEntry.cohort_name === "NICCC") {
                return "USA";
              }
            }
            return (
              (
                {
                  "Republic of Korea": "South Korea",
                  "South Korea": "South Korea",
                  Korea: "South Korea",
                } as { [k: string]: string }
              )[country] || country
            );
          }) || [],
        current_enrollment: rawEntry.current_enrollment || 0,
        dictionary_harmonized: rawEntry.dictionary_harmonized || false,
        irb_approved_data_sharing: rawEntry.irb_approved_data_sharing || "0%",
        laboratory_measures: {
          genomic_variables: [],
          microbiology: (rawEntry.laboratory_measures?.microbiology || []).map(
            toSpaceCase
          ),
        },
        pi_lead: rawEntry.pi_lead ? sanitizeName(rawEntry.pi_lead) : "",
        questionnaire_survey_data: {
          socio_demographic_and_economic_characteristics: (
            rawEntry.questionnaire_survey_data
              ?.socio_demographic_and_economic_characteristics || []
          ).map(toSpaceCase),
          lifestyle_and_behaviours: (
            rawEntry.questionnaire_survey_data?.lifestyle_and_behaviours || []
          ).map(toSpaceCase),
          physiological_measurements: [
            ...(rawEntry.questionnaire_survey_data?.physiological_measurements
              ?.anthropometry || []),
            ...(rawEntry.questionnaire_survey_data?.physiological_measurements
              ?.circulation_and_respiration || []),
          ].map(toSpaceCase),
          diseases: (rawEntry.questionnaire_survey_data?.diseases || []).map(
            toSpaceCase
          ),
          healthcare_information: (
            rawEntry.questionnaire_survey_data?.healthcare_information || []
          ).map(toSpaceCase),
          medication: (
            rawEntry.questionnaire_survey_data?.medication || []
          ).map(toSpaceCase),
          non_pharmacological_interventions: (
            rawEntry.questionnaire_survey_data
              ?.non_pharmacological_interventions || []
          ).map(toSpaceCase),
        },
        target_enrollment: rawEntry.target_enrollment,
        type_of_cohort: {
          case_control: rawEntry.type_of_cohort?.case_control || false,
          cross_sectional: rawEntry.type_of_cohort?.cross_sectional || false,
          longitudinal: rawEntry.type_of_cohort?.longitudinal || false,
          health_records: rawEntry.type_of_cohort?.health_records || false,
          other: rawEntry.type_of_cohort?.other || false,
        },
        website:
          (
            {
              "Korean Genome and Epidemiology Study (KoGES)":
                "http://www.cdc.go.kr/contents.es?mid=a50401010100",
              "Golestan Cohort Study":
                "https://dceg2.cancer.gov/gemshare/studies/GCS/",
            } as { [k: string]: string }
          )[rawEntry.cohort_name || ""] || rawEntry.website,
      };
      return output;
    } catch (err) {
      console.log("err: ", err);
      throw err;
    }
  };
};

export default (raw: Raw[]) => {
  // @ts-ignore it's ok we want to model the type explicitly
  const output = raw.map(toEsDocument(raw as Raw));
  return output;
};
