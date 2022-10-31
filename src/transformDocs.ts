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
    other: string;
  };
  countries: string[];
  current_enrollment: number;
  dictionary_harmonized: boolean;
  enrollment_period?: string;
  irb_approved_data_sharing: string;
  laboratory_measures: {
    genomic_variables: string[];
    microbiology: string[];
  };
  pi_lead?: string;
  questionnaire_survey_data: {
    diseases: string[];
    healthcare_information: string[];
    lifestyle_and_behaviours: string[];
    medication: string[];
    non_pharmacological_interventions: string[];
    perception_of_health_and_quality_of_life: string[];
    physical_environment: string[];
    physiological_measurements: string[];
    survey_administration: string[];
    socio_demographic_and_economic_characteristics: string[];
    other_questionnaire_survey_data: string[];
  };
  target_enrollment?: number;
  type_of_cohort: {
    case_control: string;
    cross_sectional: string;
    longitudinal: string;
    health_records: string;
    other: string;
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
    demographic_data?: string;
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
    other?: string;
  };
  countries?: string[];
  current_enrollment?: number;
  dictionary_harmonized?: string;
  enrollment_period?: string;
  irb_approved_data_sharing?: string;
  laboratory_measures?: {
    microbiology?: string[];
  };
  pi_lead?: string;
  questionnaire_survey_data?: {
    diseases?: string[];
    healthcare_information?: string[];
    lifestyle_and_behaviours?: string[];
    medication?: string[];
    non_pharmacological_interventions?: string[];
    perception_of_health_and_quality_of_life?: string[];
    physical_environment?: string[];
    physiological_measurements?: {
      anthropometry?: string[];
      circulation_and_respiration?: string[];
    };
    socio_demographic_and_economic_characteristics?: string[];
    survey_administration?: string[];
    other_questionnaire_survey_data?: string[];
  };
  target_enrollment?: number;
  type_of_cohort?: {
    case_control?: string;
    cross_sectional?: string;
    longitudinal?: string;
    health_records?: string;
    other?: string;
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
          biospecimens: transformPercentRangeString(
            rawEntry.available_data_types?.biospecimens
          ),
          genomic_data: transformPercentRangeString(
            rawEntry.available_data_types?.genomic_data
          ),
          genomic_data_wgs: transformPercentRangeString(
            rawEntry.available_data_types?.genomic_data_wgs
          ),
          genomic_data_wes: transformPercentRangeString(
            rawEntry.available_data_types?.genomic_data_wes
          ),
          genomic_data_array: transformPercentRangeString(
            rawEntry.available_data_types?.genomic_data_array
          ),
          genomic_data_other: transformPercentRangeString(
            rawEntry.available_data_types?.genomic_data_other
          ),
          demographic_data: transformYesNoBoolean(
            rawEntry.available_data_types?.demographic_data
          ),
          imaging_data: transformPercentRangeString(
            rawEntry.available_data_types?.imaging_data
          ),
          participants_address_or_geocode_data: transformPercentRangeString(
            rawEntry.available_data_types?.participants_address_or_geocode_data
          ),
          electronic_health_record_data: transformPercentRangeString(
            rawEntry.available_data_types?.electronic_health_record_data
          ),
          phenotypic_clinical_data: transformPercentRangeString(
            rawEntry.available_data_types?.phenotypic_clinical_data
          ),
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
            .map((val) => val.replace("Other biosample type", "Other"))
            .uniq()
            .value(),
        },
        cohort_ancestry: {
          asian: transformPercentRangeString(rawEntry.cohort_ancestry?.asian),
          black_african_american_or_african: transformPercentRangeString(
            rawEntry.cohort_ancestry?.black_african_american_or_african
          ),
          european_or_white: transformPercentRangeString(
            rawEntry.cohort_ancestry?.european_or_white
          ),
          hispanic_latino_or_spanish: transformPercentRangeString(
            rawEntry.cohort_ancestry?.hispanic_latino_or_spanish
          ),
          middle_eastern_or_north_african: transformPercentRangeString(
            rawEntry.cohort_ancestry?.middle_eastern_or_north_african
          ),
          other: transformPercentRangeString(rawEntry.cohort_ancestry?.other),
        },
        countries:
          rawEntry.countries?.map((country) => {
            if (country === "" && rawEntry.cohort_name === "NICCC") {
              return "USA";
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
        dictionary_harmonized: transformYesNoBoolean(
          rawEntry.dictionary_harmonized
        ),
        enrollment_period: rawEntry?.enrollment_period,
        irb_approved_data_sharing: transformPercentRangeString(
          rawEntry.irb_approved_data_sharing
        ),
        laboratory_measures: {
          genomic_variables: [],
          microbiology: (rawEntry.laboratory_measures?.microbiology || []).map(
            toSpaceCase
          ),
        },
        pi_lead: rawEntry.pi_lead ? sanitizeName(rawEntry.pi_lead) : "",
        questionnaire_survey_data: {
          diseases: (rawEntry.questionnaire_survey_data?.diseases || []).map(
            toSpaceCase
          ),
          healthcare_information: (
            rawEntry.questionnaire_survey_data?.healthcare_information || []
          ).map(toSpaceCase),
          lifestyle_and_behaviours: (
            rawEntry.questionnaire_survey_data?.lifestyle_and_behaviours || []
          ).map(toSpaceCase),
          medication: (
            rawEntry.questionnaire_survey_data?.medication || []
          ).map(toSpaceCase),
          non_pharmacological_interventions: (
            rawEntry.questionnaire_survey_data
              ?.non_pharmacological_interventions || []
          ).map(toSpaceCase),
          perception_of_health_and_quality_of_life: (
            rawEntry.questionnaire_survey_data
              ?.perception_of_health_and_quality_of_life || []
          ).map(toSpaceCase),
          physical_environment: (
            rawEntry.questionnaire_survey_data?.physical_environment || []
          ).map(toSpaceCase),
          physiological_measurements: [
            ...(rawEntry.questionnaire_survey_data?.physiological_measurements
              ?.anthropometry || []),
            ...(rawEntry.questionnaire_survey_data?.physiological_measurements
              ?.circulation_and_respiration || []),
          ].map(toSpaceCase),
          socio_demographic_and_economic_characteristics: (
            rawEntry.questionnaire_survey_data
              ?.socio_demographic_and_economic_characteristics || []
          ).map(toSpaceCase),
          survey_administration: (
            rawEntry.questionnaire_survey_data?.survey_administration || []
          ).map(toSpaceCase),
          other_questionnaire_survey_data: (
            rawEntry.questionnaire_survey_data
              ?.other_questionnaire_survey_data || []
          ).map(toSpaceCase),
        },
        target_enrollment: rawEntry.target_enrollment,
        type_of_cohort: {
          case_control:
            transformYesNoOrUnknown(rawEntry.type_of_cohort?.case_control),
          cross_sectional:
            transformYesNoOrUnknown(rawEntry.type_of_cohort?.cross_sectional),
          longitudinal:
            transformYesNoOrUnknown(rawEntry.type_of_cohort?.longitudinal),
          health_records:
            transformYesNoOrUnknown(rawEntry.type_of_cohort?.health_records),
          other: transformYesNoOrUnknown(rawEntry.type_of_cohort?.other),
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

function transformYesNoBoolean(input?: string): boolean {
  // TODO: Check for string includes "Yes"
  return input?.toLowerCase().match(/yes/g) ? true : false;
}

function transformYesNoOrUnknown(input?: string): string {
    // Yes, No and Unknown replacement values
    const NO_STRING_VALUE = "No";
    const YES_STRING_VALUE = "Yes";
    const UKNOWN_VALUE = 'Unknown'

    switch (input?.trim().toLowerCase()){
      case 'yes':
        return YES_STRING_VALUE;
      case 'no':
        return NO_STRING_VALUE;
      case 'unknown':
        return UKNOWN_VALUE;
      // fallthrough to default
      default:
        return UKNOWN_VALUE;
    }
}

function transformPercentRangeString(input?: string): string {
  // Yes and No replacement values
  const NO_STRING_VALUE = "0%";
  const YES_STRING_VALUE = "% Unknown";

  switch (true) {
    case input === "Yes":
      return YES_STRING_VALUE;
    case !input:
      // covers undefined and null cases
      return NO_STRING_VALUE;
    case input === "No":
      return NO_STRING_VALUE;
    case input === 'Unknown':
      return YES_STRING_VALUE;
    default:
      return _.isEmpty(input) || !_.isString(input)
        ? NO_STRING_VALUE
        : input.replace("Yes", "").replace("(", "").replace(")", "").trim(); // handles standard pattern `Yes (x-y%)`, else it returns the value
  }
}

export default (raw: Raw[]) => {
  // @ts-ignore it's ok we want to model the type explicitly
  const output = raw.map(toEsDocument(raw as Raw));
  return output;
};
