SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ##############################################
-- Schema easyInterrogation-db
-- ##############################################
CREATE SCHEMA IF NOT EXISTS `easyInterrogation-db` DEFAULT CHARACTER SET utf8;
USE `easyInterrogation-db`;

-- ##############################################
-- Table `easyInterrogation-db`.calendar
-- ##############################################
CREATE TABLE IF NOT EXISTS `easyInterrogation-db`.`calendar` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `class` VARCHAR(10) NOT NULL DEFAULT 'main',
    `date` DATETIME NOT NULL,
    `insert-date`  DATE NOT NULL,
    `status` ENUM ('Non interrogato', 'Interrogato') NOT NULL,
    `addedBy` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC ))
ENGINE = InnoDB;

-- ##############################################
-- Table `easyInterrogation-db`.admins
-- ##############################################
CREATE TABLE IF NOT EXISTS `easyInterrogation-db`.`admins` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(255) NOT NULL,
    `secondName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(1000) NOT NULL,
    `jwt` VARCHAR(1000),
    `status` ENUM('active', 'disabled') NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC ))
ENGINE = InnoDB;
