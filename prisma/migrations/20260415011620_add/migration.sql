-- AlterTable
ALTER TABLE `post` MODIFY `content` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `fatherName` VARCHAR(191) NULL;
