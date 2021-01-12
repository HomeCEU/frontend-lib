import {DataField} from './data-field.types';

export const DATA_FIELD_STUDENT: DataField[] = [
  {
    description: 'First name',
    name: '{{ student.fistName }}'
  },
  {
    description: 'Last name',
    name: '{{ student.lastName }}'
  },
  {
    description: 'Full name',
    name: '{{> student_name }}'
  },
  {
    description: 'Licenses',
    name: '{{> student_licenses }}'
  }
];

export const DATA_FIELD_COURSE: DataField[] = [
  {
    description: 'Name',
    name: '{{ course.name }}'
  },
  {
    description: 'Hours',
    name: '{{ course.hours }}'
  },
  {
    description: 'Format',
    name: '{{ course.format }}'
  },
  {
    description: 'ATC Code',
    name: '{{ course.atcCode }}'
  }
];

export const  DATA_FIELD_NURSING: DataField[] = [
  {
    description: 'RN',
    name: '{{> rn}}'
  },
  {
    description: 'LVN/LPN',
    name: '{{> lvn-lpn}}'
  },
  {
    description: 'RT',
    name: '{{> rt}}'
  },
  {
    description: 'NP',
    name: '{{> np}}'
  }
];

export const  DATA_FIELD_STANDARD: DataField[] = [
  {
    description: 'OT/COTA',
    name: '{{> ot-cota}}'
  },
  {
    description: 'MT/LMT',
    name: '{{> mt-lmt}}'
  },
  {
    description: ' ATC/LAT',
    name: '{{> atc-lat}}'
  },
  {
    description: 'SLP',
    name: '{{> slp}}'
  },
  {
    description: 'Audiology',
    name: '{{> audiology}}'
  },
  {
    description: 'CSCS/NSCA-CPT',
    name: '{{> cscs}}'
  },
  {
    description: 'PT/PTA',
    name: '{{> pt-pta}}'
  },
  {
    description: 'Dietitian/Nutritionist',
    name: '{{> dietitian-nutritionist}}'
  },
  {
    description: 'NHA',
    name: '{{> nha}}'
  },
  {
    description: 'Rec / Activities Director',
    name: '{{> rs}}'
  },
  {
    description: 'CDM',
    name: '{{> cdm}}'
  },
  {
    description: 'SW',
    name: '{{> sw }}'
  }
];
