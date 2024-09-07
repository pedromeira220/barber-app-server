/*
  Warnings:

  - You are about to drop the column `commission_value` on the `Commission` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `commission_value_in_cents` to the `Commission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value_in_cents` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Commission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commission_percentage" REAL NOT NULL,
    "commission_value_in_cents" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "professional_id" TEXT NOT NULL,
    "paymnent_id" TEXT NOT NULL,
    CONSTRAINT "Commission_paymnent_id_fkey" FOREIGN KEY ("paymnent_id") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Commission_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Commission" ("commission_percentage", "date", "id", "paymnent_id", "professional_id") SELECT "commission_percentage", "date", "id", "paymnent_id", "professional_id" FROM "Commission";
DROP TABLE "Commission";
ALTER TABLE "new_Commission" RENAME TO "Commission";
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "value_in_cents" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    CONSTRAINT "Payment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("booking_id", "date", "id", "method") SELECT "booking_id", "date", "id", "method" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_key_check("Commission");
PRAGMA foreign_key_check("Payment");
PRAGMA foreign_keys=ON;
