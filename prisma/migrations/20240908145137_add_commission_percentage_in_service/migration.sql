-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price_in_cents" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "duration_in_minutes" INTEGER NOT NULL,
    "commission_percentage" REAL NOT NULL DEFAULT 0,
    "barbershop_id" TEXT NOT NULL,
    CONSTRAINT "services_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "Barbershop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_services" ("barbershop_id", "description", "duration_in_minutes", "id", "name", "price_in_cents") SELECT "barbershop_id", "description", "duration_in_minutes", "id", "name", "price_in_cents" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
