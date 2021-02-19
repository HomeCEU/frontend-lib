/**
 * Type information for drag and drop data fields
 */
export interface DataField {
  // user view used to provide a description of the data to retrieve
  description: string;
  // internal view used to retrieve data from the backend
  name: string;
}
