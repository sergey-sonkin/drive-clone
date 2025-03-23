import "server-only";
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { index, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import { int, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `drive-tutorial_${name}`,
);

export const folders_table = createTable(
  "folders_table",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    parent: int("parent"),
  },
  (t) => {
    return [index("parent_of_folder_index").on(t.parent)];
  },
);

export const files_table = createTable(
  "files_table",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    size: int("id").notNull(),
    url: text("url").notNull(),
    parent: int("parent").notNull(),
  },
  (t) => {
    return [index("parent_of_file_index").on(t.parent)];
  },
);
