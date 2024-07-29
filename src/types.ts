/**
 * The MongoDB data exported as JSON
 */
export interface MongoData {
  _id: string;
  PACKAGE: MongoPackage;
  _hostname: string;
  _initiated: Timestamp;
  _username: string;
  feedbackCount: Count;
  lastUpdated: Timestamp;
  presnLaunchCount: Count;
  systemLaunchCount: Count;
  usageSince: Timestamp;
}

export interface MongoPackage {
  hymnal: MongoHymnalBrowserData;
}

export interface MongoHymnalBrowserData {
  DATA: MongoHymnData;
  __CHECKSUM__: string;
  __DATECREATED: Timestamp;
  __FILETYPE__: string;
}

/**
 *  The individual hymn data
 */
export interface MongoHymnData {
  [key: string]: MongoDatum[];
}

export interface MongoDatum {
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

export interface HymnalBrowserData {
  DATA: HymnDataRaw;
  __CHECKSUM__: string;
  __DATECREATED: Timestamp;
  __FILETYPE__: string;
}
export interface HymnDataRaw {
  [key: string]: number[];
}