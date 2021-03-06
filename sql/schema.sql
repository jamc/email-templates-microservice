-- MySQL Script generated by MySQL Workbench
-- Sun Jul 26 22:48:59 2015
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema email_templates
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema email_templates
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `email_templates` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `email_templates` ;

-- -----------------------------------------------------
-- Table `email_templates`.`Templates`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_templates`.`Templates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `slug` VARCHAR(100) NOT NULL COMMENT '',
  `name` VARCHAR(150) NOT NULL COMMENT '',
  `subject` TEXT NOT NULL COMMENT '',
  `html` LONGTEXT NOT NULL COMMENT '',
  `text` LONGTEXT NOT NULL COMMENT '',
  `created_at` TIMESTAMP NOT NULL COMMENT '',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC)  COMMENT '',
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `email_templates`.`Languages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_templates`.`Languages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `code` VARCHAR(6) NOT NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  UNIQUE INDEX `code_UNIQUE` (`code` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `email_templates`.`Templates_Languages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_templates`.`Templates_Languages` (
  `templates_id` BIGINT UNSIGNED NOT NULL COMMENT '',
  `languages_id` BIGINT UNSIGNED NOT NULL COMMENT '',
  PRIMARY KEY (`templates_id`, `languages_id`)  COMMENT '',
  INDEX `fk_Templates_has_Languages_Languages1_idx` (`languages_id` ASC)  COMMENT '',
  INDEX `fk_Templates_has_Languages_Templates_idx` (`templates_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Templates_has_Languages_Templates`
    FOREIGN KEY (`templates_id`)
    REFERENCES `email_templates`.`Templates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Templates_has_Languages_Languages1`
    FOREIGN KEY (`languages_id`)
    REFERENCES `email_templates`.`Languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `email_templates`.`Attachments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_templates`.`Attachments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `templates_id` BIGINT UNSIGNED NOT NULL COMMENT '',
  `name` VARCHAR(150) NOT NULL COMMENT '',
  `type` VARCHAR(50) NOT NULL COMMENT '',
  `content` BLOB NOT NULL COMMENT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`id`, `templates_id`)  COMMENT '',
  INDEX `fk_Attachments_Templates1_idx` (`templates_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Attachments_Templates1`
    FOREIGN KEY (`templates_id`)
    REFERENCES `email_templates`.`Templates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `email_templates`.`Languages`
-- -----------------------------------------------------
START TRANSACTION;
USE `email_templates`;
INSERT INTO `email_templates`.`Languages` (`id`, `code`) VALUES (1, 'es-ES');

COMMIT;