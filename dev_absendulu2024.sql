/*
 Navicat Premium Data Transfer

 Source Server         : LOCALHOST
 Source Server Type    : MySQL
 Source Server Version : 100427 (10.4.27-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : dev_absendulu2024

 Target Server Type    : MySQL
 Target Server Version : 100427 (10.4.27-MariaDB)
 File Encoding         : 65001

 Date: 19/02/2024 00:28:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for access_department
-- ----------------------------
DROP TABLE IF EXISTS `access_department`;
CREATE TABLE `access_department`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `department_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `access_department_role_id_fkey`(`role_id` ASC) USING BTREE,
  INDEX `access_department_department_id_fkey`(`department_id` ASC) USING BTREE,
  CONSTRAINT `access_department_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `access_department_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of access_department
-- ----------------------------
INSERT INTO `access_department` VALUES (7, 1, 2);
INSERT INTO `access_department` VALUES (8, 1, 6);

-- ----------------------------
-- Table structure for access_menu
-- ----------------------------
DROP TABLE IF EXISTS `access_menu`;
CREATE TABLE `access_menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int NULL DEFAULT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `access_menu_menu_id_role_id_key`(`menu_id` ASC, `role_id` ASC) USING BTREE,
  INDEX `access_menu_role_id_fkey`(`role_id` ASC) USING BTREE,
  CONSTRAINT `access_menu_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `access_menu_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 69 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of access_menu
-- ----------------------------
INSERT INTO `access_menu` VALUES (63, 1, 'insert,update,delete,view', 1);
INSERT INTO `access_menu` VALUES (64, 2, 'insert,update,delete,view', 1);
INSERT INTO `access_menu` VALUES (65, 3, 'insert,update,delete,view', 1);
INSERT INTO `access_menu` VALUES (66, 4, 'insert,update,delete,view', 1);
INSERT INTO `access_menu` VALUES (67, 5, 'view,update,insert,delete', 1);
INSERT INTO `access_menu` VALUES (68, 6, 'view,insert,update,delete', 1);

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_department` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lot` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `latitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `longitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `radius` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES (2, 'panji jaya', '', '1.0411609836065656', '104.00322731118862', '0.08');
INSERT INTO `department` VALUES (6, 'dummy', '', '', '', '');

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `path` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `urut` int NULL DEFAULT NULL,
  `menu_group_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `menu_menu_group_id_fkey`(`menu_group_id` ASC) USING BTREE,
  CONSTRAINT `menu_menu_group_id_fkey` FOREIGN KEY (`menu_group_id`) REFERENCES `menu_group` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, 'menu group', '/configuration/menugroup', 1, 1);
INSERT INTO `menu` VALUES (2, 'menu', '/configuration/menu', 2, 1);
INSERT INTO `menu` VALUES (3, 'roles', '/configuration/roles', 3, 1);
INSERT INTO `menu` VALUES (4, 'access', '/configuration/access', 4, 1);
INSERT INTO `menu` VALUES (5, 'department', '/masterdata/department', 1, 2);
INSERT INTO `menu` VALUES (6, 'sub department', '/masterdata/subdepartment', 2, 2);

-- ----------------------------
-- Table structure for menu_group
-- ----------------------------
DROP TABLE IF EXISTS `menu_group`;
CREATE TABLE `menu_group`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_group` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `urut` int NULL DEFAULT NULL,
  `group` int NULL DEFAULT NULL,
  `parent_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `menu_group_menu_group_key`(`menu_group` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu_group
-- ----------------------------
INSERT INTO `menu_group` VALUES (1, 'configuration', 2, 1, 'configuration');
INSERT INTO `menu_group` VALUES (2, 'master data', 1, 1, 'masterdata');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `roles_role_name_key`(`role_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, 'administrator');
INSERT INTO `roles` VALUES (2, 'test');

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  `expiredAt` datetime NULL DEFAULT NULL,
  `expired` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `session_token_key`(`token` ASC) USING BTREE,
  UNIQUE INDEX `session_user_id_token_key`(`user_id` ASC, `token` ASC) USING BTREE,
  CONSTRAINT `session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of session
-- ----------------------------
INSERT INTO `session` VALUES (1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo1LCJ1c2VybmFtZSI6ImljaHdhbiIsInJvbGVJZCI6MSwicm9sZU5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGF0aCI6Ii9tYXN0ZXJkYXRhL2RlcGFydG1lbnQifSwiaWF0IjoxNzA4MjY0MTE3LCJleHAiOjE3MDgyNjc3MTd9.BFWhgdm6nSX5VQzTcNIHU1ptmq7Hx7Xjb75CayHOHYg', 5, '2024-02-18 20:48:37', '2024-02-18 21:48:37', 0);
INSERT INTO `session` VALUES (2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo1LCJ1c2VybmFtZSI6ImljaHdhbiIsInJvbGVJZCI6MSwicm9sZU5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGF0aCI6Ii9tYXN0ZXJkYXRhL2RlcGFydG1lbnQifSwiaWF0IjoxNzA4MjY4NjMxLCJleHAiOjE3MDgyNzIyMzF9.Ulguz9EEUeEIKbroSW3QvnTtrA6PwhmP8a8jT6FAGws', 5, '2024-02-18 22:03:51', '2024-02-18 23:03:51', 0);

-- ----------------------------
-- Table structure for sub_department
-- ----------------------------
DROP TABLE IF EXISTS `sub_department`;
CREATE TABLE `sub_department`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_sub_department` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sub_department_department_id_fkey`(`department_id` ASC) USING BTREE,
  CONSTRAINT `sub_department_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sub_department
-- ----------------------------
INSERT INTO `sub_department` VALUES (1, 'management', 2);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  `rolesId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_username_key`(`username` ASC) USING BTREE,
  INDEX `user_rolesId_fkey`(`rolesId` ASC) USING BTREE,
  CONSTRAINT `user_rolesId_fkey` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (5, 'ichwan', '$2b$10$Tv9V18ztZ1EfBAKA9J/4cOdow0PsKO6ucIypw55Aai7nK36IworI.', '2024-02-17 14:23:10', 1);

SET FOREIGN_KEY_CHECKS = 1;
