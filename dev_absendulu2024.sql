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

 Date: 21/02/2024 19:11:04
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
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of access_department
-- ----------------------------
INSERT INTO `access_department` VALUES (2, 1, 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of access_menu
-- ----------------------------
INSERT INTO `access_menu` VALUES (6, 1, 'view,insert,update,delete', 1);
INSERT INTO `access_menu` VALUES (7, 2, 'view,insert,update,delete', 1);
INSERT INTO `access_menu` VALUES (8, 3, 'delete,update,insert,view', 1);
INSERT INTO `access_menu` VALUES (9, 4, 'delete,update,insert,view', 1);
INSERT INTO `access_menu` VALUES (10, 5, 'view,insert,update,delete', 1);
INSERT INTO `access_menu` VALUES (11, 6, 'view,insert,update,delete', 1);
INSERT INTO `access_menu` VALUES (12, 7, 'view,insert,update,delete', 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES (1, 'panji jaya', NULL, '1.0411609836065656', '104.00322731118862', '0.08');
INSERT INTO `department` VALUES (2, 'nok', NULL, NULL, NULL, NULL);
INSERT INTO `department` VALUES (3, 'plasmotech', NULL, '1.110823684169351', '104.06070730108922', '0.05');
INSERT INTO `department` VALUES (4, 'citra tubindo', NULL, '1.1112659704329917', '104.13793822241679', '0.05');
INSERT INTO `department` VALUES (5, 'schneider', NULL, NULL, NULL, NULL);
INSERT INTO `department` VALUES (6, 'vallen', NULL, NULL, NULL, NULL);
INSERT INTO `department` VALUES (7, 'yokohama', NULL, NULL, NULL, NULL);
INSERT INTO `department` VALUES (9, 'caterpillar', NULL, '1.0440107581121947', '103.91144087440958', '0.08');
INSERT INTO `department` VALUES (10, 'tese', NULL, NULL, NULL, NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, 'access', '/configuration/access', 1, 1);
INSERT INTO `menu` VALUES (2, 'menu', '/configuration/menu', 2, 1);
INSERT INTO `menu` VALUES (3, 'menugroup', '/configuration/menugroup', 3, 1);
INSERT INTO `menu` VALUES (4, 'roles', '/configuration/roles', 4, 1);
INSERT INTO `menu` VALUES (5, 'department', '/masterdata/department', 1, 2);
INSERT INTO `menu` VALUES (6, 'sub department', '/masterdata/subdepartment', 1, 2);
INSERT INTO `menu` VALUES (7, 'data karyawan', '/masterdata/datakaryawan', 1, 2);

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
-- Table structure for pegawai
-- ----------------------------
DROP TABLE IF EXISTS `pegawai`;
CREATE TABLE `pegawai`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `panji_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nama` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nik_ktp` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tmp_lahir` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `tgl_lahir` date NULL DEFAULT NULL,
  `jk` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agama` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `kebangsaan` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `alamat` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `rt` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `rw` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `kel` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `kec` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `kota` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telp` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status_nikah` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tgl_join` date NULL DEFAULT NULL,
  `tgl_selesai` date NULL DEFAULT NULL,
  `tgl_reset` date NULL DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `position` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `npwp` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `jenis_bank` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `no_rek` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `bpjs_tk` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `bpjs_kes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `department_id` int NULL DEFAULT NULL,
  `sub_department_id` int NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_overtime` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pegawai_department_id_fkey`(`department_id` ASC) USING BTREE,
  INDEX `pegawai_sub_department_id_fkey`(`sub_department_id` ASC) USING BTREE,
  CONSTRAINT `pegawai_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pegawai_sub_department_id_fkey` FOREIGN KEY (`sub_department_id`) REFERENCES `sub_department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 522 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pegawai
-- ----------------------------
INSERT INTO `pegawai` VALUES (2, 'PJ-0000', 'ICHWAN RIZKY', '2171111309979001', 'batam', '1997-09-12', 'L', 'Islam', 'indonesia', '', '', '', '', '', '', '8117779913', 'TK', NULL, NULL, NULL, '', 'it', '', '', '', '', '', 1, 1, 1, 0);
INSERT INTO `pegawai` VALUES (70, 'PIDIR', 'EDI WARMAN', '2171110601749008', 'KOTOHILALANG', '1974-01-06', 'L', 'Islam', 'INDONESIA', 'GRIYA BATU AJI ASRI BLOK G5 RT 002 / RW 016 SAGULUNG BATU AJI', '2', '', '', 'SAGULUNG', 'BATAM', '08116957522', 'K3', '1970-01-01', NULL, '2022-06-22', 'edi.w@panji-jaya.co.id', 'DIREKTUR', '58.073.766.6-215.000', 'Mandiri', '109-00-0565929-7', '11034520525', '0001290725381', 1, 1, 1, 0);
INSERT INTO `pegawai` VALUES (71, 'PJMGR', 'RIRI ARIANTO', '2171120605789001', 'BASO', '1978-05-06', 'L', 'ISLAM', 'INDONESIA', 'CITRA PENDAWA ASRI A-1 NO.22 ', '5', '', '', 'BATU AJI', 'BATAM', '08127028037', 'K2', '1970-01-01', '2022-06-22', '2022-06-22', 'riri.a@panji-jaya.co.id', 'GENERAL MANAGER', '69.845.534.2-215.000 ', 'Mandiri', '109-00-0565929-7', '12000164736', '0001143586978', 1, 1, 1, 0);
INSERT INTO `pegawai` VALUES (72, 'PJ - 0173', 'HENDRI', '2171091105819008', 'PEKANBARU', '1980-05-12', 'L', 'Islam', 'INDONESIA', 'PERUM SAGULUNG PERMAI BLOK A NO 78', '0', '', '', 'SAGULUNG', 'BATAM', '085274441533', 'K3', '2014-01-12', NULL, '2022-06-22', 'H3N1ISA@GMAIL.COM', 'MATERIAL HANDLE', '', 'Mandiri', '109-00-1731423-8', '19029937539', '0000202097812', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (73, 'PJ - 0575', 'LELYANA OKTAVIA', '2171024310810002', 'KEDIRI', '1981-10-03', 'P', 'ISLAM', 'INDONESIA', 'PESONA ASRI BLOK B 14 NO 22, BATAM CENTRE', '1', '', '', 'BATAM KOTA', 'BATAM', '081268180021', 'K3', '2018-09-10', '2022-06-22', '2022-06-22', 'lelyanaoktavia1@gmail.com', 'OFFICER', '59.369.052.2-215.000 ', 'Mandiri', '109-00-1586592-6', '16058234473', '0001202351589', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (74, 'PJ - 0657', 'INDRA NURMALA CHANDRA', '2171120907839005', 'KOTO PANJANG ', '1983-07-09', 'L', 'ISLAM', 'INDONESIA', 'PERUM GRIYA PRIMA BLOK G NO. 24', '003', '', '', 'BATU AJI', 'BATAM', '082173626569', 'K3', '2019-06-11', '2022-06-22', '2022-06-22', 'BATAM8115@GMAIL.COM', 'OPERATOR', '68.961.521.9-215.000', 'Mandiri', '109-00-1662189-8', '19096622675', '0001131152174', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (75, 'PJ - 0658', 'WENDRI ', '2171120609759006', 'BASO', '1975-09-06', 'L', 'ISLAM', 'INDONESIA', 'PERUM MK. PARADISE BLK P NO. 05', '003', '', '', 'BATU AJI', 'BATAM', '081372888174', 'K3', '2019-01-11', '2022-06-22', '2022-06-22', 'WENDRISAJA@GMAIL.COM', 'HR MANAGER', '07.263.081.7-215.000', 'Mandiri', '109-00-0117822-7', '19096622683', '0001601787587', 1, 1, 1, 0);
INSERT INTO `pegawai` VALUES (76, 'NORA SUSAN', 'NORA SUSANTI', '1304134411930001', 'LUBUK JANTAN', '1993-11-04', 'P', 'ISLAM', 'INDONESIA', 'LEGENDA MALAKA BLOK H1 NO. 5', '', '', '', '', '', '', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'nora.susan46@gmail.com', 'STAFF', '64.061.360.0-215.000', 'Mandiri', '109-00-1515989-0', '12037286718', '0001501207536', 1, 2, 0, 1);
INSERT INTO `pegawai` VALUES (77, 'PJ - 0627', 'NELPITA SARI', '1402035810970001', 'BONGKAL MALANG', '1996-10-18', 'P', 'Islam', 'INDONESIA', 'TAMAN HANG TUAH BLOK D2 NO. 7', '', '', '', 'BATAM KOTA', 'BATAM', '082382520292', 'K0', '2019-01-07', NULL, '2022-06-22', 'sari_nelpita@yahoo.com', 'STAFF', '83.020.208.1-213.000', 'Mandiri', '109-00-1676016-7', '18001203209', '0001500007937', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (78, 'PJ - 0739', 'RIKO HENDRA ', '2171101709810003', 'BUKIT TINGGI', '1981-09-17', 'L', 'Islam', 'INDONESIA', 'CENDANA THP VII BLOK F 8 NO. 8', '008', '', '', 'BATAM KOTA', 'BATAM', '81261443900', 'K3', '1970-01-01', NULL, '2022-06-22', 'rikohendra152@gmail.com', 'SPV', '08.188.822.4-215.000 ', 'Mandiri', '109-00-0492600-2', '20059963288', '0001495264678', 1, 7, 1, 1);
INSERT INTO `pegawai` VALUES (79, 'PJ - 0797', 'RIA NOFITA SARI', '2171114802970001', 'BELAKANG PADANG', '1997-02-08', 'P', 'ISLAM', 'INDONESIA', 'PERUM GRIYA PERMAI BLOK B NO 2', '01', '', '', 'SAGULUNG', 'BATAM', '085668034796', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'riafita4@gmail.com', 'STAFF', '96.915.261.0-225.000', 'Mandiri', '109-00-1796448-7', '2006688561', '0001324096593', 1, 2, 0, 1);
INSERT INTO `pegawai` VALUES (80, 'PJ - 0813', 'VIOLA RAHMADHIAN', '1305025702940001', 'PARIAMAN', '1994-02-17', 'P', 'ISLAM', 'INDONESIA', 'PERUM CIPTA ASRI BLOK 5 NO. 35', '', '', '', '', '', '081276425531', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'violarahmadhian@gmail.com', 'STAFF', '82.067.570.0-201.000', 'Mandiri', '109-00-1683745-2', '18009135726', '0002300174932', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (81, 'PJ - 0826', 'ROMY ARDIAN', '2171101007800002', 'TANJUNG PINANG', '1980-07-10', 'L', 'ISLAM', 'INDONESIA', 'PERUMAHAN OMA BLOK A-2 NO. 09', '', '', '', '', '', '081364101707', 'K3', '2021-12-04', '2022-06-22', '2022-06-22', 'romy.ardian@panji-jaya.co.id', 'OPERATIONAL MANAGER', '07.972.125.4-215.000', 'Mandiri', '109-00-1146825-3', '07D20230000', '0001500037896', 1, 1, 1, 0);
INSERT INTO `pegawai` VALUES (82, 'PJ - 0838', 'ZULBAHRIZAL', '2171031502729021', 'LASI TUO', '1972-02-15', 'L', 'Islam', 'INDONESIA', 'TIBAN LAMA NO. 67 RT/RW. 004/006', '004', '', '', 'SEKUPANG', 'BATAM', '081364248155', 'K3', '1970-01-01', NULL, '2022-06-22', 'ZULBAHRIZALL@GMAIL.COM', 'DRIVER', '', 'Mandiri', '109-00-1909508-2', '21050659974', '0001293004462', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (83, 'PJ - 0872', 'AHMAD FIKRI', '2171102110000003', 'BATAM', '2000-10-21', 'L', 'ISLAM', 'INDONESIA', 'PERUMAHAN TAMAN RAYA TAHAP 3 BLOK HD NO. 31', '', '', '', '', 'BATAM', '082284571710', 'TK', '2021-06-07', '2022-06-22', '2022-06-22', 'af.690815@gmail.com', 'IT STAFF', '', 'Mandiri', '109-00-1774034-1', '21050659990', '0002075984379', 1, 2, 0, 1);
INSERT INTO `pegawai` VALUES (84, 'PJ - 0226', 'ERNI MAINISA', '1205165705970001', 'BESITANG', '1997-05-17', 'P', 'ISLAM', 'INDONESIA', 'PERUM PURI LEGENDA BLOK B.08 NO.10 ', '0', '', '', 'BATAM CENT', 'BATAM', '082170356775', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'erni.mainisa@gmail.com', 'OPERATOR', '42.444.918.9-225.000 ', 'Mandiri', '109-00-1723076-4', '19048086011', '0001877912223', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (85, 'PJ - 0568', 'DEDI CANDRA TANJUNG', '120705307720003', 'Bukit tinggi', '1972-07-31', 'L', 'Islam', 'INDONESIA', '', '', '', '', '', '', '08', 'TK', '2018-01-08', NULL, '2022-06-22', 'deddybulle73@gmail.com', 'P', '', 'Mandiri', '', '', '', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (123, 'PJ - 0067', 'DOSMAIDA TAMPUBOLON', '2171116803769008', 'PIASA ULU', '1976-03-28', 'P', 'ISLAM', 'INDONESIA', 'PUTRA MORO INDAH II BLOK L NO.10', '1', '', '', 'SAGULUNG', 'BATAM', '081372159221', 'TK/2', '1970-01-01', '2022-06-22', '2022-06-22', 'dosmaidat@gmail.com', 'OPERATOR', '59.335.184.4-215.000 ', 'Mandiri', '109-00-1351251-2', '19074102591', '0001149734283', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (135, 'PJ - 0065', 'MARIATI YUSTINA SAMOSIR', '2171126106859010', 'DURI', '1985-06-21', 'P', 'KRISTEN', 'INDONESIA', 'TEMBESI CENTER BLOK C6 NO.6 ', '1', '', '', 'BATU AJI', 'BATAM', '', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'monsam0608@gmail.com', 'OPERATOR', '79.740.691.5-215.000 ', 'Mandiri', '109-00-1772402-2', '20059963312', '0001135818213', 1, 4, 1, 1);
INSERT INTO `pegawai` VALUES (139, 'PJ - 0179', 'GUSNELA', '1302084708860006', 'MUARA PANAS', '1986-08-07', 'P', 'ISLAM', 'INDONESIA', 'PERUM BUKIT SAKINAH BLOK HIRO 2 NO.4', '0', '', '', 'BATU AJI', 'BATAM', '', 'K1', '1970-01-01', '2022-06-22', '2022-06-22', 'gusnelagusnela@gmail.com', 'OPERATOR', '69.924784.7.215.000 ', 'Mandiri', '109-00-1465162-4', '20059963320', '0001824987554', 1, 4, 1, 1);
INSERT INTO `pegawai` VALUES (148, 'PJ - 0436', 'YULI YANTI RAHMANA', '2171115907929002', 'BOYOLALI', '1992-07-19', 'P', 'ISLAM', 'INDONESIA', '', '', '', '', '', '', '', 'K1', '2017-07-08', '2022-09-28', '2022-06-22', 'yuli.marici@gmail.com', 'OPERATOR', '', 'Mandiri', '', '19048086037', '0001143774922', 1, 3, 0, 1);
INSERT INTO `pegawai` VALUES (170, 'PJ - 0215', 'YETI', '2171125505849011', 'PALEMBANG', '1984-05-15', 'P', 'ISLAM', 'INDONESIA', 'PERUM MKGR BLOK 3 NO.3', '3', '', '', 'BATU AJI', 'BATAM', '082169027981', 'K0', '2015-10-07', '2022-06-22', '2022-06-22', 'yetiaja4794@gmail.com', 'OPERATOR', '', 'Mandiri', '109-00-1495596-7', '19048086029', '0001819066972', 1, 5, 0, 1);
INSERT INTO `pegawai` VALUES (259, 'PJ - 0701', 'DESY NILAWATI', '2171115512869004', 'MUBA', '1986-12-15', 'P', 'ISLAM', 'INDONESIA', 'TEMBESI LESTARI', '3', '', '', 'SAGULUNG', 'BATAM', '', 'TK', '2020-01-07', '2022-06-22', '2022-06-22', 'desynilawati86@gmail.com', 'OPERATOR', '98.072.920.6-542.000 ', 'Mandiri', '109-00-1306873-9', '19074102567', '0001153450517', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (260, 'PJ - 0702', 'EMI SUSANTI', '1377045811840000', 'PAKASAI', '1984-11-18', 'P', 'Islam', 'INDONESIA', 'CIPTA SARANA BLOK C1 NO.18', '4', '', '', 'BATU AJI', 'BATAM', '085263894796', 'TK/1', '2020-01-07', NULL, '2022-06-22', 'emisusan1811@gmail.com', 'OPERATOR', '98.603.230.8.201.000 ', 'Mandiri', '109-00-1372394-5', '19074102583', '0001324427253', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (261, 'PJ - 0703', 'SRI INDRAYANTI', '2171115908819001', 'PADANG', '1981-08-19', 'P', 'ISLAM', 'INDONESIA', '', '', '', '', '', '', '', 'TK/2', '2020-01-07', '2022-06-22', '2022-06-22', 'sriindrayanti1908@gmail.com', 'OPERATOR', '55.213.427.2-215.000 ', 'Mandiri', '', '19074102559', '0001319051046', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (262, 'PJ - 0704', 'JANNARIAH', '1671116010920000', 'OKU TIMUR', '1992-10-20', 'P', 'Islam', 'INDONESIA', '', '', '', '', '', 'BATAM', '08', 'TK', '2020-01-07', NULL, '2022-06-22', 'jjnannah480@gmail.com', 'OPERATOR', '66.676.017.8-307.000 ', 'Mandiri', '109-00-1386275-0', '17015000999', '0001280402561', 1, 4, 1, 1);
INSERT INTO `pegawai` VALUES (263, 'PJ - 0705', 'MULA SONYA SIRAIT', '2171115509929007', 'PASAR BARU', '1992-09-15', 'P', 'Islam', 'INDONESIA', 'DORMITORY BLOK P14 #1-1', '', '', '', '', 'BATAM', '082386826733', 'TK', '2020-01-07', NULL, '2022-06-22', 'sonyasirait92@gmail.com', 'OPERATOR', '77.031.546.3-215.000', 'Mandiri', '109-00-1549803-3', '19074102609', '0001610886071', 1, 3, 0, 1);
INSERT INTO `pegawai` VALUES (266, 'PJ - 0708', 'HARIYANTI', '2171124209859009', 'MEDAN', '1985-09-02', 'P', 'ISLAM', 'INDONESIA', 'BUKIT SAKINAH BLOK THORIQ I NO. 11', '', '', '', '', '', '081277212240', 'K2', '2020-01-07', '2022-06-22', '2022-06-22', 'yy1991183@gmail.com', 'OPERATOR', '59.311.706.2-111.000 ', 'Mandiri', '109-00-1780486-5', '19056671357', '0002304095591', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (267, 'PJ - 0709', 'DEA APRIYELDA', '1401014104000001', 'PESISIR SELATAN', '2000-04-01', 'P', 'ISLAM', 'INDONESIA', 'BUKIT AYU LESTARI BLOK A2 NO. 36', '', '', '', '', '', '082288892927', 'TK', '2020-01-07', '2022-06-22', '2022-06-22', 'deaapriyelda23@gmail.com', 'OPERATOR', '53.415.288.8-225.000 ', 'Mandiri', '109-00-1806177-0', '20003820899', '000289422022', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (269, 'PJ - 0711', 'TRI SUMARSIH', '3402175702920001', 'BANTUL', '1992-02-17', 'P', 'ISLAM', 'INDONESIA', 'BIDADARI C2 NO. 20 TG. PIAYU', '', '', '', '', '', '081276511724', 'K0', '2020-01-07', '2022-06-22', '2022-06-22', 'Chandal93putri@gmail.com', 'OPERATOR', '69.965.468.7-543.000 ', 'Mandiri', '109-00-1812587-2', '20009040104', '0000094624007', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (271, 'PJ - 0713', 'RENNA YENI MARIANA HUTAGALUNG', '1205065409920007', 'SELAYANG', '1992-09-14', 'P', 'KRISTEN', 'INDONESIA', 'KOMP. CIPTA PERSADA BLOK A NO. 12', '004', '', '', 'BATU AJI', '', '0813 7223 70', 'TK', '2020-01-07', '2022-06-22', '2022-06-22', 'maria.ana081372237095@gmail.com', 'OPERATOR', '98.603.160.7-215.000', 'Mandiri', '109-00-1491227-3', '20025798867', '0001865287416', 1, 3, 0, 0);
INSERT INTO `pegawai` VALUES (273, 'PJ - 0715', 'JUREFNI', '2171124101830000', 'PASAR DURIAN', '1983-01-01', 'P', 'Islam', 'INDONESIA', 'PERUM. TAMAN PESONA INDAH BLOK B4 NO.9', '2', '', '', 'BATU AJI', 'BATAM', '0812 7527 63', 'TK/1', '2020-01-07', NULL, '2022-06-22', 'Jurefni83@gmail.com', 'OPERATOR', '49.144.336.2-215.000 ', 'Mandiri', '109-00-1159878-6', '19074102575', '0001136794779', 1, 4, 1, 1);
INSERT INTO `pegawai` VALUES (274, 'PJ - 0716', 'YELLY FEBNIWATI', '1304064902860002', 'PATAMEH', '1989-02-09', 'P', 'ISLAM', 'INDONESIA', 'PERUM MKI 1 BLOK CL NO. 03', '005', '', '', 'BATU AJI', '', '0823 8362 91', 'K2', '2020-08-07', '2022-06-22', '2022-06-22', 'yellypebniwati090290@gmail.com', 'OPERATOR', '', 'Mandiri', '109-00-1821476-7', '20025798842', '0001276896824', 1, 3, 0, 1);
INSERT INTO `pegawai` VALUES (276, 'PJ - 0718', 'KASMALINA', '1104026408000002', 'ARUL RELEM', '2000-04-03', 'P', 'Islam', 'INDONESIA', 'PERUM PERMATA PURI II BLOK R NO. 10', '', '', '', '', '', '0822 8352 45', 'TK', '2020-08-07', NULL, '2022-06-22', 'ikasmalina@gmail.com', 'OPERATOR', '94.533.786.3-104.000', 'Mandiri', '109-00-1827071-0', '20031518515', '0002317933607', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (288, 'PJ - 0730', 'RINTA YULIATI', '1304104304960003', 'SUMANIK', '1996-04-03', 'P', 'ISLAM', 'INDONESIA', 'PERUM GRIYA BATU AJI ASRI TAHAP 1 BLOK X NO.24', '006', '', '', '', 'BATAM', '085274136732', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'Rhintayulianti@gmail.com', 'OPERATOR', '', 'Mandiri', '109-00-1672972-5', '20059963205', '0000275505322', 1, 5, 0, 1);
INSERT INTO `pegawai` VALUES (289, 'PJ - 0731', 'SUSANTI', '2171124406880001', 'MEDAN', '1988-06-04', 'P', 'Islam', 'INDONESIA', 'BUKIT SAKINAH BLOK THORIQ I NO. 11', '', '', '', '', '', '085263042576', 'TK', '1970-01-01', NULL, '2022-06-22', 'chantikyut@gmail.com', 'OPERATOR', '', 'Mandiri', '109-00-1779073-4', '20059963296', '0001448020574', 1, 5, 0, 1);
INSERT INTO `pegawai` VALUES (291, 'PJ - 0733', 'AGUSTINA SAFITRI WULANDARI TARIHORAN', '1201154707960004', 'SIBOLGA', '1996-07-07', 'P', 'ISLAM', 'INDONESIA', 'PERUM CITRA LAGUNA II A,5 NO. 9', '', '', '', '', '', '081534354729', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'akuagustina9@gmail.com', 'OPERATOR', '', 'Mandiri', '109-00-1757613-3', '13007327748', '0001790699321', 1, 5, 0, 1);
INSERT INTO `pegawai` VALUES (292, 'PJ - 0734', 'RATI KARLINA', '1301084102940004', 'AMPALU', '1994-02-01', 'P', 'ISLAM', 'INDONESIA', 'PERUMNAS GRIYA PERMATA BLOK A NO 262', '0', '', '', '', 'BATAM', '081275532189', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'karlinarati5@gmail.com', 'OPERATOR', '', 'Mandiri', '109-00-1495600-7', '20059963221', '0001871394783', 1, 5, 0, 1);
INSERT INTO `pegawai` VALUES (293, 'PJ - 0735', 'RATI PUJI ASTUTI', '2171055710989002', 'PULAU AWENG', '1998-10-17', 'P', 'ISLAM', 'INDONESIA', 'KOMP. VIEWTOWN', '', '', '', '', '', '', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'ratipujiastuti1098@gmail.com', 'OPERATOR', '86.234.463.7-225.000', 'Mandiri', '109-00-1642092-9', '20059963247', '0000364011985', 1, 5, 0, 1);
INSERT INTO `pegawai` VALUES (294, 'PJ - 0736', 'RATNA ELFIYANI', '2171114808929002', 'CILACAP', '1992-08-08', 'P', 'ISLAM', 'INDONESIA', 'PERUM HPM BLOK L NO 04', '0', '', '', '', 'BATAM', '085925767672', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'ratnaalfiani30@gmail.com', 'OPERATOR', '16.202.638.9.215.000', 'Mandiri', '', '20059963270', '0001494779589', 1, 5, 0, 1);
INSERT INTO `pegawai` VALUES (295, 'PJ - 0737', 'ERMA MURNIATI', '2171097007969005', 'BATAM', '1996-07-30', 'P', 'ISLAM', 'INDONESIA', 'BENGKONG TENGAH', '3', '', '', 'BENGKONG', 'BATAM', '082174063341', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'iazriyansah@gmail.com', 'OPERATOR', '', 'Mandiri', '', '20059963213', '0000366157348', 1, 5, 0, 1);
INSERT INTO `pegawai` VALUES (297, 'PJ - 0740', 'DILA KARLINA', '1301084203970006', 'KOTO PANJANG ', '1997-03-02', 'P', 'ISLAM', 'INDONESIA', 'PERUM GRIYA PRIMA BLOK F NO. 24', '', '', '', '', '', '0823 8843 28', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'dilakarlina97@gmail.com', 'OPERATOR', '94.317.941.6-205.000', 'Mandiri', '109-00-1821463-5', '180007184791', '0002421924535', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (298, 'PJ - 0746', 'NOVRYANTY MANURUNG', '2171114111869006', 'BATAM', '1986-11-01', 'P', 'KRISTEN', 'INDONESIA', 'BATU AJI KAV LAMA BATAM JLN. SEKOLAH NO. 3', '', '', '', '', '', '0813 6421 66', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'Novryanty.manurung@gmail.com', 'OPERATOR', '59.368.980.5-215.000', 'Mandiri', '109-00-1443930-1', '13023399408', '0001496618976', 1, 3, 0, 1);
INSERT INTO `pegawai` VALUES (299, 'PJ - 0742', 'YENI KURNIAWATI', '2171126410939002', 'JEMBER', '1993-10-24', 'P', 'Islam', 'INDONESIA', 'DEVIN PREMIERE MSRIMA BLOK B1 NO. 89', '', '', '', '', '', '0823 8484 19', 'K1', '1970-01-01', NULL, '2022-06-22', 'imamefge@gmail.com', 'OPERATOR', '71.460.068.1-215.000', 'Mandiri', '109-00-1484009-4', '20031518523', '0001615500461', 1, 3, 0, 1);
INSERT INTO `pegawai` VALUES (301, 'PJ - 0807', 'DEUIS SARTIKA', '2171104404819008', 'SUKABUMI', '1981-04-04', 'P', 'ISLAM', 'INDONESIA', 'TAMAN RAYA TAHAP I BLOK EE NO. 19', '003', '', '', 'BATAM KOTA', 'BATAM', '089653568934', 'K1', '1970-01-01', '2022-06-22', '2022-06-22', 'rezekihallal9@gmail.com', 'OPERATOR', '55.561.545.9-215.000', 'Mandiri', '', '21034800389', '0002891220467', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (303, 'PJ - 0809', 'FERAWATY NAPITUPULU', '1272067008930004', 'PANEI TONGA', '1993-08-30', 'P', 'KRISTEN', 'INDONESIA', 'MKGR BLOK KARYA NYATA', '', '', '', '', 'BATAM', '085296410824', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', 'ferawatyna@gmail.com', 'OPERATOR', '', 'Mandiri', '109-00-1883786-6', '21034800413', '0000263871731', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (304, 'PJ - 0810', 'MASRIANI HARAHAP', '2171025107880001', 'MANDASIP', '1988-07-11', 'P', 'ISLAM', 'INDONESIA', 'PERMATA PURI II BLOK S NO. 7', '004', '', '', 'BATU AJI', 'BATAM', '081381811547', 'K2', '1970-01-01', '2022-06-22', '2022-06-22', 'suprianto.vivo7899@gmail.com', 'OPERATOR', '78.357.121.9-215.000', 'Mandiri', '109-00-1883766-6', '21034800421', '0003083244175', 1, 3, 0, 0);
INSERT INTO `pegawai` VALUES (306, 'PJ - 0873', 'MAHDALENA SIKUMBANG', '2171115607820001', 'MEDAN', '1982-07-16', 'P', 'ISLAM', 'INDONESIA', 'PERUM RINDANG GARDEN ', '', '', '', '', 'BATAM', '081270024821', 'K3', '2021-02-07', '2022-06-22', '2022-06-22', 'lenasikumbang78@gmail.com', 'OPERATOR', '68.058.338.2-215.000', 'Mandiri', '109-00-1916648-7', '21050659982', '0001824981311', 1, 4, 0, 0);
INSERT INTO `pegawai` VALUES (307, 'PJ - 0889', 'SUSMIATI ', '2171036510850008', 'MUARA PANAS', '1985-10-25', 'P', 'Islam', 'INDONESIA', 'PERUM BUKIT SAKINAH BLOK THOFIL II NO.11', '2', '', '', 'BATU AJI', 'BATAM', '0', 'K2', '1970-01-01', NULL, '2022-06-22', 'susmiatinauri@gmail.com', 'OPERATOR', '49.066.026.3-215.000 ', 'Mandiri', '109-00-1718315-3', '21058034337', '0001146548722', 1, 4, 1, 1);
INSERT INTO `pegawai` VALUES (308, 'PJ - 0887', 'RINA OKTARYANA', '1403085210964480', 'LEMANG', '1996-10-12', 'P', 'ISLAM', 'INDONESIA', 'PERUM BENIH RAYA BLOK C5 NO 4', '', '', '', '', 'BATAM', '081267196698', 'K1', '2021-09-08', '2022-06-22', '2022-06-22', 'Rinaoktaryana2017@gmail.com', 'OPERATOR', '72.877.378.9-219.000 ', 'Mandiri', '109-00-1938926-1', '21058034279', 'ikut suami', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (309, 'PJ - 0899', 'ZAHRATUL FITRIAH', '2171114712029003', 'BATAM', '2002-12-07', 'P', 'Islam', 'INDONESIA', 'SAGULUNG SUMBER SARI C10 18', '', '', '', '', 'BATAM', '082171487409', 'TK', '1970-01-01', NULL, '2022-06-22', 'zahratulfitriah07@gmail.com', 'OPERATOR', '63.521.423.2-225.000 ', 'Mandiri', '', '21066761244', '0001496248468', 1, 3, 0, 1);
INSERT INTO `pegawai` VALUES (356, 'PJ - 0669', 'LINCERIA SIANIPAR', '1202134301950002', 'PURBATUA', '1995-01-03', 'P', 'KRISTEN', 'INDONESIA', 'PERUM MASYEBA INDAH', '', '', '', '', '', '082385409685', 'K0', '1970-01-01', '2022-06-22', '2022-06-22', '', 'OPERATOR', '70.758.537.8-215.000', 'Mandiri', '900-00-2087264-5', '20009040088', '0001322118944', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (358, 'PJ - 0744', 'PUTI HATI LATURE', '2171114306879000', '', '1987-06-03', 'P', 'ISLAM', 'INDONESIA', '', '', '', '', '', 'BATAM', '', 'K2', '1970-01-01', '2022-06-22', '2022-06-22', 'putihatilature@gmail.com', 'OPERATOR', '98.434.122.2-215.000 ', 'Mandiri', '109-00-1195518-4', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (364, 'PJ - 0957', 'RICO PRADITO', '2171060106999004', 'KLATEN', '1999-06-01', 'L', 'Islam', 'INDONESIA', '', '', '', '', '', 'BATAM', '087874575781', 'TK', '1970-01-01', NULL, '2022-06-22', '', 'IT STAFF', '', '', '', '', '', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (365, 'PJ - 0958', 'WINDA SYAFITRI', '2171114705110008', 'BATAM', '2001-05-07', 'P', 'ISLAM', 'INDONESIA', '', '', '', '', '', 'BATAM', '', 'TK', '1970-01-01', '2022-06-22', '2022-06-22', '', 'OPERATOR', '', '', '', '', '', 1, 3, 0, 1);
INSERT INTO `pegawai` VALUES (393, NULL, 'DESI MONALISA BR MANURUNG', '-', 'Medan', '1993-12-10', 'P', 'ISLAM', 'Indonesia', 'Perumahan Senawangi RT/RW 2 Buliang Batu Aji', '2', '', '', 'Batu Aji', 'Batam', '', 'TK', '2022-05-17', '2022-05-18', '2022-05-18', '', 'Project JBS-OWS', '', '', '', '', '', 1, 2, 0, 1);
INSERT INTO `pegawai` VALUES (394, NULL, 'RIANA MARSAULINA SIMATUPANG', '-', 'PEMATANGSIANTAR', '1997-06-15', 'P', 'KRISTEN', 'INDONESIA', 'JL.S.M RAJA', '010', '', '', 'SIANTAR MA', 'MEDAN', '', 'TK', '2022-05-17', '2022-05-18', '2022-05-18', '', 'PROJECT JBS-OWS', '', '', '', '', '', 1, 2, 0, 1);
INSERT INTO `pegawai` VALUES (399, 'PJ-', 'Sri Rahayu', '21', 'Kubang', '1975-03-05', 'L', 'Islam', 'INDONESIA', 'Fortuna Raya 2 Blok JJ No. 25', '', '', '', '', '', '08', 'K2', '2022-06-13', NULL, '2022-06-16', '', 'Leader ', '57.228.762.1-215.000 ', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (400, NULL, 'Defi Melia ', '', 'Padang Panjang', '1981-05-19', 'L', 'ISLAM', '', '', '', '', '', '', '', '', 'K0', '2022-06-13', '2022-06-16', '2022-06-16', '', 'Operator', '59.321.321.8-215.000 ', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (401, NULL, 'Mira Kristanti', '', '', '1973-07-30', 'P', 'ISLAM', '', '', '', '', '', '', '', '', 'TK/2', '2022-06-13', '2022-06-16', '2022-06-16', '', 'Operator', '', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (402, 'PJ-', 'Dedy Chandra', '21', 'Pekanbaru', '1989-08-05', 'L', 'Islam', 'INDONESIA', '', '', '', '', '', '', '081261470455', 'K3', '2022-06-10', NULL, '2022-06-20', '', 'Leader Project', '', '', '', '', '', 1, 7, 1, 0);
INSERT INTO `pegawai` VALUES (403, NULL, 'MOHAMMAD ICHWAN RIZKY KURNIA', '2171111309979001', 'BATAM', '1997-09-13', 'L', 'ISLAM', 'INDONESIA', 'KAV LAMA SAGULUNG SENTOSA NO 74', '', '', '', '', '', '08117779914', 'TK', '2022-06-01', '2022-07-11', '2022-07-11', '', 'IT', '', 'MANDIRI', '1090017926122', '', '', 1, 1, 1, 0);
INSERT INTO `pegawai` VALUES (404, NULL, 'Vinaria', '', 'Sawah lunto', '1983-11-12', 'P', 'ISLAM', '', '', '', '', '', '', '', '', 'TK/2', '2022-07-07', '2022-07-08', '2022-07-08', '', 'Operator ', '46.515.657.8-203.000 ', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (405, 'PJ - 0997', 'Desrina sartika', '21', 'SAWAHLUNTO', '1983-12-10', 'P', 'Islam', 'INDONESIA', 'TEMBESI LESTARI', '', '', '', '', '', '08', 'K3', '2022-07-06', NULL, '2022-07-08', '', 'Operator', '58.075.237.6-215.000 ', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (406, 'PJ', 'TESSA SINTYA SARI', '2171096504990001', 'BATAM', '1999-04-25', 'P', 'Islam', 'INDONESIA', 'BENGKONG INDAH 2 BLOK D NO 13 ', '04', '01', '', 'BENGKONG', 'BATAM', '08163681577', 'TK', '2022-07-13', NULL, NULL, 'tessasintya2504@gmail.com', 'ADMIN ACCOUNTING', '94.295.455.3-225.000', '', '', '', '', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (453, 'PJ', 'Zulfikar', '2171102408859009', 'Pangkalan Susu', '1985-08-24', 'L', 'Islam', 'INDONESIA', 'Ruko Dreamland Square. Blok H2 no 12A', '003', '', '', 'Sekupang', 'Batam', '085261416146', 'K0', '2022-08-08', NULL, NULL, 'zulfikar@panji-jaya.co.id', 'A', '97.170.233.7-215.000 ', 'Mandiri', '1917525106', '', '', 1, 7, 1, 1);
INSERT INTO `pegawai` VALUES (456, NULL, 'Anova Rumate', '21711450879', 'Manado', '1979-08-05', 'P', 'ISLAM', 'INDONESIA', 'Tembesi Tower', '3', '', '', '', 'Batam', '08121884060', 'K3', '2022-08-16', '2022-08-19', '2022-08-19', '', 'Operator', '59.343.222.2-215.000 ', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (457, NULL, 'Riyah', '16710471882005', 'Supat 31', '1982-08-31', 'P', 'Islam', 'INDONESIA', 'Perumahan Central FFS NO 19', '', '', NULL, '', 'Batam', '08776935547', 'K3', '2022-08-16', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (458, 'PJ-', 'Rahma yati', '130501570702001', 'Padang ', '2002-10-17', 'P', 'Islam', 'INDONESIA', 'Batu Aji', '', '', '', '', '', '083801371135', 'TK', '2022-08-30', NULL, NULL, '', 'Inspeksi', '65.406.776.8-201.000 ', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (459, 'PJ-TES', 'Suci lestary', '131204711202001', 'Tinggam', '2002-12-31', 'P', 'Islam', 'INDONESIA', 'Perumahan Griya PERMATA', '', '', '', '', 'Batam', '082285217071', 'TK', '2022-08-30', NULL, '2022-09-02', '', 'Operator', '53.066.195.8-202.000 ', '', '', '', '0000281878795', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (460, 'PJ', 'Putri yosephine situmeang', '1271196807930003', 'Medan ', '1993-07-23', 'P', 'Islam', 'INDONESIA', 'BENGKONG PKJ BLOK A4 NO.17 A. SADAI BATAM-KEPULAUAN RIAU', '02', '', '', 'BENGKONG', 'BATAM', '081996234510', 'TK', '2022-09-05', NULL, '2022-09-05', 'putri_yosephine@yahoo.co.id', 'HR', '', 'BCA', '0613298972', '14021312641', '0001380574383', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (461, NULL, 'Winarni', '340104610289001', '', '1989-02-21', 'L', 'ISLAM', 'INDONESIA', '', '', '', '', '', '', '', 'K3', '2022-09-14', NULL, NULL, '', 'Operator', '98.547.270.3-215.000 ', '', '', '', '', 1, 4, 1, 1);
INSERT INTO `pegawai` VALUES (462, 'PJ-', 'Denada Antonika', '1304136601000001', 'BALAI TENGGAH', '2000-01-26', 'L', 'Islam', 'INDONESIA', '', '', '', '', '', '', '081277336403', 'TK', '2023-09-13', NULL, NULL, '', 'OPERATOR', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (463, 'PJ', 'RAMADHANI SAPUTRI', '1305055111030001', 'S', '2003-11-11', 'L', 'Islam', 'INDONESIA', '', '', '', '', '', '', '08', 'TK', '2022-09-13', NULL, NULL, '', 'OPERATOR', '', '', '', '', '', 1, 3, 0, 1);
INSERT INTO `pegawai` VALUES (464, NULL, 'SRIYANI', '2171076704809004', '', '1980-04-27', 'L', 'ISLAM', 'INDONESIA', '', '', '', '', '', '', '', 'K2', '2022-09-14', NULL, NULL, '', 'OPERATOR', '69.636.236.7-215.001 ', '', '', '', '', 1, 3, 0, 0);
INSERT INTO `pegawai` VALUES (465, 'PJ', 'Voni Julianti ', '1305015307010001', 'Ganting', '2001-07-13', 'P', 'Islam', 'INDONESIA', 'Genting- KOTO BURUAK ', '000', '000', '', 'LUBUK ALUN', '', '083182559911', 'TK', '2022-09-28', NULL, NULL, 'juliantivoni474@gmail.com', 'OPERATOR ', '42.764.674.0-225.000 ', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (466, NULL, 'MAHANANI NALENDRA', '3302025612980001', 'Magelang', '1998-12-16', 'P', 'ISLAM', 'INDONESIA', 'Perumahan Central Raya ', '', '', '', '', 'Batam', '081270678786', 'TK', '2022-09-28', NULL, NULL, 'mahananinaicndra@gmail.com', 'OPERATOR', '926.431.677.524.000 ', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (467, NULL, 'Friskayana Purba', '120827550202002', 'Dolok saratus', '2002-02-15', 'P', 'Islam', 'INDONESIA', 'Perum puripesonab no 8', '001', '015', NULL, 'Batu Aji', 'Batam', '085270842030', 'TK', '2022-09-28', NULL, NULL, 'Friskayanapurba@gmail.com', 'OPERATOR', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (468, '0', 'NOVIKA RONIDA NAHAMPUN', '2171115611989005', 'BATAM', '1998-11-16', 'P', 'Islam', 'INDONESIA', 'PUTRAMORO INDAH 2 BLOK  NO 12', '', '', '', '', 'BATAM', '0813638812', 'TK', '2022-10-06', NULL, NULL, '', 'OPERATOR', '90.313.011.0-225.000', '', '', '', '', 1, 6, 0, 1);
INSERT INTO `pegawai` VALUES (469, '0', 'BERLIAN FIATRA', '1307027008010001', 'PAYAKUMBUH', '2001-08-30', 'P', 'Islam', 'INDONESIA', 'Perum muka kuning indah', '', '', '', '', 'BATAM', '0822115054', 'TK', '2022-10-06', NULL, NULL, '', 'OPERATOR', '60.244.871.4-225.000', '', '', '', '', 1, 6, 0, 1);
INSERT INTO `pegawai` VALUES (470, NULL, 'Herlina novita s', '2171116011039006', 'Batam', '2003-11-20', 'P', 'ISLAM', 'INDONESIA', 'Tembesi Lesrari', '', '', '', '', 'Batam', '081275922510', 'TK', '2022-10-06', NULL, NULL, '', 'OPERATOR', '65.730.311.1-225.000', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (471, 'PJ', 'HAMIDAH FITRIANI', '210204580297006', 'TG BALAI', '1997-02-18', 'P', 'Islam', 'INDONESIA', 'Botania Garden', '', '', '', '', 'Batam', '082390426633', 'TK', '2022-10-06', NULL, NULL, '', 'OPERATOR', '', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (477, '0', 'Yulia Ivani', '2171124407969001', 'Selat Panjang ', '1996-07-04', 'P', 'Islam', 'INDONESIA', 'Plamo Garden pg Batam Center', '', '', '', '', 'Batam', '08998877895', 'TK', '2022-11-03', NULL, NULL, 'yulia.ivani4@gmail.com', 'Acconting', '88.873.967.9-215.000 ', '', '', '', '0002941403049', 1, 2, 0, 1);
INSERT INTO `pegawai` VALUES (478, '0', 'Ramona Margareta', '160130700.930001', 'Palembang ', '1993-03-30', 'P', 'Islam', 'INDONESIA', 'Medio Raya Blok K no 5', '', '', '', '', '', '082178192431', 'K2', '2022-11-07', NULL, NULL, '', 'Operator  ', '730909611302000', '', '', '', '', 1, 6, 0, 1);
INSERT INTO `pegawai` VALUES (480, 'PJ - 1036', 'Mei  Andriani', '170312610303001', 'Pasarketana', '2003-05-21', 'P', 'Islam', 'INDONESIA', 'kAPITAL RAYA BELIAN', '', '', '', '', 'Batam', '085788184280', 'TK', '2022-11-07', NULL, NULL, '', 'OPERATOR', '606068989328000', '', '', '', '', 1, 6, 0, 1);
INSERT INTO `pegawai` VALUES (481, '0', 'Hayattul Laila', '1305046108020002', 'Padang Panjang', '2002-08-21', 'P', 'Islam', 'INDONESIA', 'Perum pesenabuktlagunatanun piyayu', '', '', '', '', 'Batam', '081364431360', 'TK', '2022-11-07', NULL, NULL, '', 'OPERATOR', '', '', '', '', '', 1, 6, 0, 1);
INSERT INTO `pegawai` VALUES (482, '0', 'Bambang Sutopo', '2171032912719003', 'Jakarta', '1971-12-29', 'L', 'Kristen Protestan', 'INDONESIA', 'Tamn eirine Blok J no 15', '001', '014', '', 'Sekupang', 'Batam', '08117000241', 'K1', '2022-11-09', NULL, NULL, 'Bambang@panji-jaya.co.id', 'Marketing', '477401921215000', '', '', '', '', 1, 1, 0, 1);
INSERT INTO `pegawai` VALUES (483, NULL, 'Khayza aulia nathania', '2171016908029003', 'BATAM', '2002-08-29', 'P', 'Islam', 'INDONESIA', 'Belakang padang ', '', '', NULL, '', 'Batam', '08', 'TK', '2022-12-05', NULL, NULL, '', 'OPERATOR ', '', '', '', '', '0000364817261', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (484, NULL, 'Khayaa aulia hathania', '217101908029003', 'Batam', '2000-08-29', 'P', 'ISLAM', 'INDONESIA', 'Belakang Padang ', '', '', '', '', 'Batam', '087897918409', 'TK', '2022-12-05', NULL, NULL, '', 'Oprator ', '', '', '', '', '', 1, 6, 0, 1);
INSERT INTO `pegawai` VALUES (486, 'PJ-1051', 'Wisnora', '2171126209799002', 'Pangian', '1979-09-22', 'P', 'Islam', 'INDONESIA', 'Genta 1 Blok 4 CL02', '', '', NULL, '', 'Batam', '081372241778', 'TK/2', '2023-01-09', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (488, 'PJ-', 'Claudine ivane sitompul', '2171114410010001', 'Batam', '2001-10-04', 'P', 'Islam', 'INDONESIA', 'Sagulung sempurna ', '003', '005', '', 'Sagulung', 'Batam', '089523777092', 'TK', '2023-01-09', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 6, 1, 0);
INSERT INTO `pegawai` VALUES (489, 'PJ-1052', 'Linda', '1671075104020014', 'Palembang', '2002-04-11', 'P', 'Islam', 'INDONESIA', 'Jln Perinstrian 2', '068', '014', '', 'Sukarmi', 'Batam', '089609376440', 'TK', '2023-01-11', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 6, 0, 1);
INSERT INTO `pegawai` VALUES (491, 'PJ-1061', 'Reni Yusnibar', '2171125009779001', 'sUNGAI SALAK', '1977-09-10', 'P', 'Islam', 'INDONESIA', 'Perum Benih raya Blok D2 no 09', '005', '015', '', 'Sekupang ', 'Batam', '081364717631', 'K3', '2023-01-17', NULL, NULL, '', 'OPERATOR ', '', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (492, 'PJ-1071', 'Windi Parwati', '1110065505010001', 'Aceh Singkil', '2001-05-15', 'P', 'Islam', 'INDONESIA', 'Muka kuning pratama lig', '', '', '', '', 'Batam', '081261396675', 'TK', '2023-01-30', NULL, NULL, '', 'Acconting', '', '', '', '', '', 1, 2, 1, 1);
INSERT INTO `pegawai` VALUES (493, 'PJ-1069', 'Nur Ipmawati', '2171074511879001', 'Magelang ', '1987-11-05', 'P', 'Islam', 'INDONESIA', 'Perum mki  I Blok Ak 04', '', '', NULL, '', 'Batam', '087889411768', 'K0', '2023-01-30', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (494, 'PJ-1070', 'Rina Nofrita Sari', '2171114802849001', 'Sungai Salak', '1984-02-08', 'P', 'Islam', 'INDONESIA', 'Perum Galaxy parak azno 10', '', '', '', '', 'Batam', '082268583745', 'K2', '2023-01-30', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 6, 0, 1);
INSERT INTO `pegawai` VALUES (495, 'PJ-071', 'Aldo prabowo', '217102270992004', 'Medan ', '1992-09-27', 'L', 'Islam', 'INDONESIA', 'Batu mera atas ', '024', '007', '', 'Batu ampar', 'batam', '081270056778', 'K2', '2023-02-03', NULL, NULL, '', 'Welder', '555311737215000', '', '', '', '', 1, 7, 1, 1);
INSERT INTO `pegawai` VALUES (496, 'PJ-1077', 'RATNA ALFIYANI', '217111480808929002', 'Cilacap', '1992-08-08', 'P', 'Islam', 'INDONESIA', 'Perum HP M2 Blok L no 04', '', '', '', '', 'Batam', '081373155185', 'K1', '2023-02-20', NULL, NULL, '', 'OPerator', '162026389215000', 'Mandiri', '1090017183195', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (497, 'PJ-1112', 'Hafsah Nurul Quraini', '2171115206030002', 'Batam', '2003-06-12', 'P', 'Islam', 'INDONESIA', 'Perumahan graha nusa B', '001', '021', '', 'Sagulung', 'Batam', '082288157930', 'TK', '2023-05-08', NULL, NULL, '', 'OPERATOR', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (498, 'PJ-1114', 'Pipit ayu lestari', '3306115205970004', 'Purworejo', '1997-05-12', 'P', 'Islam', 'INDONESIA', 'Griya Batu Aji Asri Bio', '002', '016', '', 'Sagulung', 'Batam', '085215588180', 'K1', '2023-05-08', NULL, NULL, '', 'OPERATOR', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (499, 'PJ-1113', 'Irvana Sabella Dyna Rizky', '217107581098001', 'TUAPAYA', '1998-10-13', 'P', 'Islam', 'INDONESIA', 'Bida Ayu Blok. B5 NO.17', '001', '013', '', 'Sungai Bed', 'Batam', '082288839313', 'TK', '2023-05-08', NULL, NULL, '', 'OPERATOR', '921559183225000', '', '', '', '', 1, 4, 0, 1);
INSERT INTO `pegawai` VALUES (500, 'pJ-1132', 'Rani Anisa', '1371114305950005', 'Padang ', '1995-05-03', 'P', 'Islam', 'INDONESIA', 'Perumahan pesona bukit laguna 2 blok FT4 no 9 piyayu', '', '', NULL, '', 'Batam', '081949440728', 'K2', '2023-06-19', NULL, NULL, '', 'Operator', '724530886201000', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (501, 'PJ-1131', 'Novita Dewi Sofianti', '2171114711039008', 'Batam', '2003-11-07', 'P', 'Islam', 'INDONESIA', 'Geriya Batu aji asri  G8', '', '', NULL, '', 'Batam', '088270805904', 'TK', '2023-06-19', NULL, NULL, '', 'Operator', '40834696322500', '', '', '', '', 1, 6, 1, 1);
INSERT INTO `pegawai` VALUES (502, 'PJ-1136', 'Nurcahyanti', '210106621087003', 'Numbing ', '1987-10-22', 'P', 'Islam', 'INDONESIA', 'Numbing Bintan ', '', '', NULL, '', 'Bintan', '081267452492', 'K1', '2023-07-04', NULL, NULL, '', 'Operator ', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (503, 'PJ-1137', 'Sutriani', '352309470493007', 'Tuban', '1993-04-07', 'P', 'Islam', 'INDONESIA', 'Perumahan kampoleng daunanog', '', '', NULL, '', 'Batam', '085234728274', 'K0', '2023-07-04', NULL, NULL, '', 'Operator ', '9806466749648000', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (504, 'PJ-1138', 'Dewita oktavianti', '2171095551869004', 'Pasarabaa', '1986-10-15', 'P', 'Islam', 'INDONESIA', 'Bengkong Mahkota', '', '', NULL, '', 'Batam ', '083183500057', 'K2', '2023-07-04', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (505, 'PJ-1139', 'Diah Permata Nita', '2171115601950003', 'Batam', '1995-01-16', 'P', 'Islam', 'INDONESIA', 'Kavl sumber seraya', '', '', '', '', 'Batam', '082284650551', 'K1', '2023-07-04', NULL, NULL, '', 'Operator ', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (506, 'PJ-1140', 'Suryatno', '3305162002760001', 'Jakarta', '2023-07-05', 'L', 'Islam', 'INDONESIA', 'Taman BPPINdah Blok cn 052', '', '', '', '', 'Batam', '089636179399', 'K3', '2023-07-04', NULL, NULL, '', 'Projek', '', '', '', '', '', 1, 7, 0, 1);
INSERT INTO `pegawai` VALUES (507, 'PJ-1142', 'Fitri Aulya', '1721035701010004', 'Batam', '2001-01-17', 'L', 'Islam', 'INDONESIA', 'Tiban Lama', '002', '012', NULL, 'Sekupang', 'Batam', '08566662174', 'TK', '2023-07-10', NULL, NULL, '', 'Admin', '434585659215000', '', '', '', '', 1, 7, 1, 1);
INSERT INTO `pegawai` VALUES (508, 'PJ', 'Zalfa athifah putri sandy', '2171125010039001', 'Batam', '2003-10-10', 'P', 'Islam', 'INDONESIA', 'Muka kuning peraii JL. Pbatang no 286', '004', '020', NULL, 'batu aji', 'batam', '081374115890', 'TK', '2023-08-21', NULL, NULL, '', 'Operator', '408789402225000', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (509, 'PJ-', 'Sri Wahyu Ningsih', '130207410994002', 'cupak', '1994-09-01', 'P', 'Islam', 'INDONESIA', 'Perumahan taman lestari Blok C14 NO 34', '003', '0255', '', 'Batu aji', 'Batam', '021277984244', 'K2', '2023-08-21', NULL, NULL, '', 'Oprator', '95581954201', '', '', '', '', 1, 4, 0, 1);
INSERT INTO `pegawai` VALUES (510, 'PJ-', 'Ririn Yuli Valentin', '1610156107990002', 'Lubuk Keliat ', '1999-07-21', 'P', 'Islam', 'INDONESIA', 'Dusun II', '000', '000', '', 'Lubuk Keli', 'Ogan Ilir', '081278569477', 'TK', '2023-08-21', NULL, NULL, '', 'Operator', '413647975312000', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (511, 'PJ - 1173', 'Astri Nofia Sitorus', '1233177006030001', 'Parbutaran', '2003-06-30', 'P', 'Islam', 'INDONESIA', 'Perumahan  MCITRAPENDAWAASARI', '', '', '', '', 'Batam', '081370917954', 'TK', '2023-09-18', NULL, NULL, '', 'Operator ', '434707295117000', '', '', '', '', 1, 4, 0, 1);
INSERT INTO `pegawai` VALUES (512, 'PJ - 1173', 'Astri Nofia Sitorus', '121317700603001', 'Parbutaran', '2003-06-30', 'P', 'Islam', 'INDONESIA', 'Perumahan MCITRAPENDAWAASARI', '', '', '', '', 'Batam', '081370917954', 'TK', '2023-09-18', NULL, NULL, '', 'Operator', '434707295117000', 'Mandiri', '', '', '', 1, 4, 0, 0);
INSERT INTO `pegawai` VALUES (513, 'PJ-1198', 'Sintia Pristika', '1306136406030002', 'Bawan', '2004-06-24', 'P', 'Islam', 'INDONESIA', 'Padang cakuajor ongpasar padang ', '', '', NULL, '', '', '083840613309', 'TK', '2023-11-14', NULL, NULL, '', 'Operator ', '605410059225000', '', '', '0001504469913', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (514, 'PJ-1197', 'Rahmi Nedra Yulaila', '1304025007020004', 'Tanjung Barulak', '2002-07-10', 'P', 'Islam', 'INDONESIA', 'Cluster Melati Garden ', '', '', NULL, '', 'Batam', '083852531336', 'TK', '2023-11-14', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (515, 'PJ-1195', 'Dewi Rida Sri Duma RR', '1408037006010001', 'Minas ', '2001-06-30', 'P', 'Kristen Protestan', 'INDONESIA', 'Jl simpang Perawang Pekan baru', '003', '007', NULL, 'Minas', 'Kabupaten ', '081273757399', 'TK', '2023-11-14', NULL, NULL, '', 'Operator', '41794220822500', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (516, 'PJ-1196', 'Elisa Krismon', '1301064302980002', 'Bengkulu ', '1998-02-03', 'P', 'Islam', 'INDONESIA', 'Ambacang Kamba', '000', '000', NULL, 'Bayang ', 'Kabupaten ', '081378275862', 'TK', '2023-11-14', NULL, NULL, '', 'Operator', '948314067205000', '', '', '', '', 1, 3, 1, 1);
INSERT INTO `pegawai` VALUES (517, 'PJ-', 'M. Sari Wani ', '1404021803760003', 'Sungai ambat', '1976-03-18', 'P', 'Islam', 'INDONESIA', '', '', '', NULL, '', '', '0', 'K1', '2023-11-23', NULL, NULL, '', 'Operator', '', '', '', '', '', 1, 7, 1, 1);
INSERT INTO `pegawai` VALUES (518, 'PJ-', 'Fieman Pangeran Lubis', '2171022408929002', 'Batam', '1992-08-24', 'L', 'Islam', 'INDONESIA', '', '', '', '', '', '', '0', 'TK', '2023-11-23', NULL, NULL, '', 'A', '', '', '', '', '', 1, 7, 0, 1);
INSERT INTO `pegawai` VALUES (519, 'PJ', 'Firman Pangeran Lubis ', '2171022408929002', 'Batam', '1992-08-24', 'L', 'Islam', 'INDONESIA', '', '', '', NULL, '', '', 's', 'TK', '2023-11-23', NULL, NULL, '', 'A', '', '', '', '', '', 1, 7, 1, 1);
INSERT INTO `pegawai` VALUES (521, 'PJ-', 'Aolanda Perdana Putri', '1301057101010001', 'Painan', '2001-01-31', 'P', 'Islam', 'INDONESIA', 'Fila muka kuning ', '', '', '', '', 'Batam', '082288515012', 'TK', '2024-01-15', NULL, NULL, 'aolanda@panji-jaya.co.id', 'Drafter', '505925972205000', '', '', '', '', 1, 7, 1, 1);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `roles_role_name_key`(`role_name` ASC) USING BTREE
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
  UNIQUE INDEX `session_token_key`(`token` ASC) USING BTREE,
  UNIQUE INDEX `session_user_id_token_key`(`user_id` ASC, `token` ASC) USING BTREE,
  CONSTRAINT `session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of session
-- ----------------------------
INSERT INTO `session` VALUES (1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImljaHdhbiIsInJvbGVJZCI6MSwicm9sZU5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGF0aCI6Ii9jb25maWd1cmF0aW9uL2FjY2VzcyJ9LCJpYXQiOjE3MDg1MTIxNjksImV4cCI6MTcwODUxNTc2OX0.6SZeAMiMch7F8mvZL8WyBgtjEU_8hOv5aqu9yb80EAA', 1, '2024-02-21 17:42:49', '2024-02-21 18:42:49', 0);
INSERT INTO `session` VALUES (2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImljaHdhbiIsInJvbGVJZCI6MSwicm9sZU5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGF0aCI6Ii9tYXN0ZXJkYXRhL2RlcGFydG1lbnQifSwiaWF0IjoxNzA4NTE2MjU0LCJleHAiOjE3MDg1MTk4NTR9.hNVqoE6dJ6f9NPW2Ln_OCxBcBoFdZBEUoH-lOEZKGlI', 1, '2024-02-21 18:50:54', '2024-02-21 19:50:54', 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sub_department
-- ----------------------------
INSERT INTO `sub_department` VALUES (1, 'management', 1);
INSERT INTO `sub_department` VALUES (2, 'hrd', 1);
INSERT INTO `sub_department` VALUES (3, 'automotive', 1);
INSERT INTO `sub_department` VALUES (4, 'battery', 1);
INSERT INTO `sub_department` VALUES (5, 'ex batam', 1);
INSERT INTO `sub_department` VALUES (6, 'nka', 1);
INSERT INTO `sub_department` VALUES (7, 'project', 1);

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
INSERT INTO `user` VALUES (1, 'ichwan', '$2b$10$kdyHTskI3NebY9gWawI1r.rhkJs/VwEGeR.G.v8GWdGn6HTASDHIq', '2024-02-21 17:38:42', 1);

SET FOREIGN_KEY_CHECKS = 1;
