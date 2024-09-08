/*
  Warnings:

  - You are about to drop the column `paymnent_id` on the `commissions` table. All the data in the column will be lost.
  - Added the required column `payment_id` to the `commissions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_commissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commission_percentage" REAL NOT NULL,
    "commission_value_in_cents" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "professional_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    CONSTRAINT "commissions_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "commissions_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_commissions" ("commission_percentage", "commission_value_in_cents", "date", "id", "professional_id") SELECT "commission_percentage", "commission_value_in_cents", "date", "id", "professional_id" FROM "commissions";
DROP TABLE "commissions";
ALTER TABLE "new_commissions" RENAME TO "commissions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
