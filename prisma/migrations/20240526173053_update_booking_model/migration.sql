/*
  Warnings:

  - You are about to drop the column `date` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barbershop_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "observations" TEXT NOT NULL,
    CONSTRAINT "bookings_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "Barbershop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("barbershop_id", "client_id", "created_at", "id", "observations", "service_id") SELECT "barbershop_id", "client_id", "created_at", "id", "observations", "service_id" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
PRAGMA foreign_key_check("bookings");
PRAGMA foreign_keys=ON;
