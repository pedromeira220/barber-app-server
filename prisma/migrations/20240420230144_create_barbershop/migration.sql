/*
  Warnings:

  - You are about to drop the column `hash_senha` on the `Barbershop` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Barbershop` table. All the data in the column will be lost.
  - You are about to drop the column `nome_contato` on the `Barbershop` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_contato` on the `Barbershop` table. All the data in the column will be lost.
  - Added the required column `contact_name` to the `Barbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_phone` to the `Barbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Barbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Barbershop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL
);
INSERT INTO "new_Barbershop" ("email", "id") SELECT "email", "id" FROM "Barbershop";
DROP TABLE "Barbershop";
ALTER TABLE "new_Barbershop" RENAME TO "Barbershop";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
