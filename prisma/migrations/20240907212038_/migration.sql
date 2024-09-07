/*
  Warnings:

  - You are about to drop the `Commission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Commission";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Payment";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "value_in_cents" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commission_percentage" REAL NOT NULL,
    "commission_value_in_cents" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "professional_id" TEXT NOT NULL,
    "paymnent_id" TEXT NOT NULL,
    CONSTRAINT "commissions_paymnent_id_fkey" FOREIGN KEY ("paymnent_id") REFERENCES "payments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "commissions_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
