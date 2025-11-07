import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  // Skipping auth fields for now...
});

export const sightingsTable = sqliteTable("sightings", {
  id: int().primaryKey({ autoIncrement: true }),
  user_id: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  description: text().notNull(),
  // A geojson point (will need a custom editor in UI)
  location: text({ mode: "json" }).$type<{
    geometry: { coordinates: number[] };
    type: "Point";
  }>(),
  // S3 storage key (will need a custom editor in UI to upload file)
  photo: text(),
});
