import Dexie from "dexie";

export const dbCache = new Dexie("SmarkMarkDB");

// Tables (your core app structure)
dbCache.version(1).stores({
  pupils: "id,name,class,createdAt",
  attendance: "id,pupilId,date,status",
  cache: "key"
});