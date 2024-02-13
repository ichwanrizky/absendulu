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

 Date: 13/02/2024 16:04:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for access_menu
-- ----------------------------
DROP TABLE IF EXISTS `access_menu`;
CREATE TABLE `access_menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int NULL DEFAULT NULL,
  `role_id` int NULL DEFAULT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `access_menu_menu_id_fkey`(`menu_id` ASC) USING BTREE,
  INDEX `access_menu_role_id_fkey`(`role_id` ASC) USING BTREE,
  CONSTRAINT `access_menu_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `access_menu_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of access_menu
-- ----------------------------
INSERT INTO `access_menu` VALUES (1, 1, 1, NULL);
INSERT INTO `access_menu` VALUES (2, 2, 1, 'insert,update,delete');
INSERT INTO `access_menu` VALUES (3, 4, 1, 'insert,update,delete');

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
INSERT INTO `menu` VALUES (1, 'department', '/master_data/department', 1, 1);
INSERT INTO `menu` VALUES (2, 'menu group', '/configuration/menugroup', 1, 2);
INSERT INTO `menu` VALUES (4, 'menu', '/configuration/menu', 2, 2);

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu_group
-- ----------------------------
INSERT INTO `menu_group` VALUES (1, 'master data', 1, 1, 'master_data');
INSERT INTO `menu_group` VALUES (2, 'configuration', 99, 1, 'configuration');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, 'administrator');

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
  UNIQUE INDEX `Session_token_key`(`token` ASC) USING BTREE,
  INDEX `Session_user_id_fkey`(`user_id` ASC) USING BTREE,
  UNIQUE INDEX `Session_token_user_id_key`(`token` ASC, `user_id` ASC) USING BTREE,
  CONSTRAINT `Session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of session
-- ----------------------------
INSERT INTO `session` VALUES (8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImljaHdhbiIsInJvbGVJZCI6MSwicm9sZU5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGF0aCI6Ii9tYXN0ZXJkYXRhL2RlcGFydG1lbnQifSwiaWF0IjoxNzA3Nzk4OTgwLCJleHAiOjE3MDc4MDI1ODB9.2V1t2t0Eja-S8eG5ljU57sg0S0Mqdgkhqi8B0im_CPg', 1, '2024-02-13 10:55:56', '2024-02-13 12:36:20', 0);
INSERT INTO `session` VALUES (9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImljaHdhbiIsInJvbGVJZCI6MSwicm9sZU5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGF0aCI6Ii9tYXN0ZXJkYXRhL2RlcGFydG1lbnQifSwiaWF0IjoxNzA3ODAyNzMxLCJleHAiOjE3MDc4MDYzMzF9.v9QVTCi9BLtuceIiwGQtzMX4c9bj1q_x8gaSHNUuNu4', 1, '2024-02-13 12:38:04', '2024-02-13 13:38:51', 0);
INSERT INTO `session` VALUES (10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImljaHdhbiIsInJvbGVJZCI6MSwicm9sZU5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGF0aCI6Ii9tYXN0ZXJkYXRhL2RlcGFydG1lbnQifSwiaWF0IjoxNzA3ODA4MjEwLCJleHAiOjE3MDc4MTE4MTB9.fT9dt6c_kCs-bggoxLvBkfUennGMb6YNl-SXSU0-5Kc', 1, '2024-02-13 14:10:10', '2024-02-13 15:10:10', 0);
INSERT INTO `session` VALUES (11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImljaHdhbiIsInJvbGVJZCI6MSwicm9sZU5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGF0aCI6Ii9tYXN0ZXJkYXRhL2RlcGFydG1lbnQifSwiaWF0IjoxNzA3ODEyMTc3LCJleHAiOjE3MDc4MTU3Nzd9.uPOFqvDPx7YxwBBC3ssAL-05Ev2oRXyEaHYujIwbsHk', 1, '2024-02-13 15:10:20', '2024-02-13 16:16:17', 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'ichwan', '$2b$10$VX6nw/u0wslLQ7El6NB5E.y4sOxfUxlh0YT6g6EVd6uGF6NIr4ygq', '2024-02-13 10:10:01', 1);

SET FOREIGN_KEY_CHECKS = 1;
