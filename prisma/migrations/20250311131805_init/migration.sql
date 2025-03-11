/*
  Warnings:

  - You are about to drop the column `catatan` on the `transaksi_list` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `catatan` TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `transaksi_list` DROP COLUMN `catatan`;
