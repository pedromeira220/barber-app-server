/*
  Warnings:

  - Added the required column `nome_contato` to the `Barbearia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone_contato` to the `Barbearia` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Barbearia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash_senha" TEXT NOT NULL,
    "nome_contato" TEXT NOT NULL,
    "telefone_contato" TEXT NOT NULL
);
INSERT INTO "new_Barbearia" ("email", "hash_senha", "id", "nome") SELECT "email", "hash_senha", "id", "nome" FROM "Barbearia";
DROP TABLE "Barbearia";
ALTER TABLE "new_Barbearia" RENAME TO "Barbearia";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
