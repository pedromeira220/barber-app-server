/*
  Warnings:

  - Added the required column `nome_contato` to the `Barbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone_contato` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Barbershop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash_senha" TEXT NOT NULL,
    "nome_contato" TEXT NOT NULL,
    "telefone_contato" TEXT NOT NULL
);
INSERT INTO "new_Barbershop" ("email", "hash_senha", "id", "nome") SELECT "email", "hash_senha", "id", "nome" FROM "Barbershop";
DROP TABLE "Barbershop";
ALTER TABLE "new_Barbershop" RENAME TO "Barbershop";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
