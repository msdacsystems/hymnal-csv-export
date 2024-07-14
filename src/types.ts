/**
 * The MongoDB data exported as JSON
 */
export interface MongoData {
  _id: string;
  PACKAGE: Package;
  _hostname: string;
  _initiated: Timestamp;
  _username: string;
  feedbackCount: Count;
  lastUpdated: Timestamp;
  presnLaunchCount: Count;
  systemLaunchCount: Count;
  usageSince: Timestamp;
}

export interface Package {
  hymnal: Hymnal;
}

export interface Hymnal {
  DATA: HymnDataRaw;
  __CHECKSUM__: string;
  __DATECREATED: Timestamp;
  __FILETYPE__: string;
}

/**
 *  The individual hymn data
 */
export interface HymnDataRaw {
  [key: string]: Datum[];
}

export interface Datum {
  $numberInt?: string;
  $numberDouble?: string;
}

export interface Timestamp {
  $numberDouble: string;
}

export interface Count {
  $numberInt: string;
}

/**
 * The parsed hymnal data
 */
export interface HymnData {
  id: string;
  queries: string;
  launches: string;
  lastAccessed: string;
}
