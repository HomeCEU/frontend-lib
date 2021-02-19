import {DataField} from '../models/data-field.types';

export const DATA_FIELD_STUDENT: DataField[] = [
  {
    description: 'First name',
    name: '{{ student.fistName }}'
  },
  {
    description: 'Last name',
    name: '{{ student.lastName }}'
  },
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
    description: 'Completion date',
    name: '{{ completionDate  }}'
  },
  {
    description: 'ATC Code',
    name: '{{ course.atcCode }}'
  }
];

