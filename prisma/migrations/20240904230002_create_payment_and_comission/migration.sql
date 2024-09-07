-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    "method" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    CONSTRAINT "Payment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commission_percentage" REAL NOT NULL,
    "commission_value" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "professional_id" TEXT NOT NULL,
    "paymnent_id" TEXT NOT NULL,
    CONSTRAINT "Commission_paymnent_id_fkey" FOREIGN KEY ("paymnent_id") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Commission_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
