-- MySQL dump 10.13  Distrib 5.7.24, for osx11.1 (x86_64)
--
-- Host: localhost    Database: hamcam
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_feedback`
--

DROP TABLE IF EXISTS `ai_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_feedback` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `estimated_study_time` int DEFAULT NULL,
  `future_plan` tinytext,
  `generated_at` datetime(6) NOT NULL,
  `overall_analysis` tinytext NOT NULL,
  `recommended_problem_types` varchar(500) DEFAULT NULL,
  `study_recommendations` tinytext,
  `weak_concepts` tinytext,
  `evaluation_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKsa31l0j1m73i89k7cu1s7fe14` (`evaluation_id`),
  CONSTRAINT `FKimjkdg4tiopoeg8fhsfjrmyi6` FOREIGN KEY (`evaluation_id`) REFERENCES `unit_evaluation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_feedback`
--

LOCK TABLES `ai_feedback` WRITE;
/*!40000 ALTER TABLE `ai_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachment`
--

DROP TABLE IF EXISTS `attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content_type` varchar(100) DEFAULT NULL,
  `original_file_name` varchar(255) DEFAULT NULL,
  `preview_available` bit(1) NOT NULL,
  `stored_file_name` varchar(500) NOT NULL,
  `comment_id` bigint DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `reply_id` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `file_size` bigint DEFAULT NULL,
  `chat_message_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKds6u1rptrsif835t89kb15cyo` (`comment_id`),
  KEY `FKdpdlf5eltdxsl2wjh8ab5huv4` (`reply_id`),
  KEY `idx_attachment_post` (`post_id`),
  KEY `idx_attachment_chat_message` (`chat_message_id`),
  CONSTRAINT `FK57nlwn59e1o3uor5njjmukiar` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `FKdpdlf5eltdxsl2wjh8ab5huv4` FOREIGN KEY (`reply_id`) REFERENCES `reply` (`id`),
  CONSTRAINT `FKds6u1rptrsif835t89kb15cyo` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`),
  CONSTRAINT `FKn3dq8yc9s3fuukwxytvry6t9v` FOREIGN KEY (`chat_message_id`) REFERENCES `chat_message` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachment`
--

LOCK TABLES `attachment` WRITE;
/*!40000 ALTER TABLE `attachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `block`
--

DROP TABLE IF EXISTS `block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `block` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_id` bigint DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `reply_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKak0sjaqdne8jyaecul7ffeggb` (`user_id`,`post_id`,`comment_id`,`reply_id`),
  KEY `FKqh98ss5v7m1ksrcen3q7uhysi` (`comment_id`),
  KEY `FKaeb1kehuvgl9e7xfkkhoflfrd` (`post_id`),
  KEY `FKm1nqcbhgr9fb4bssswpeob8u7` (`reply_id`),
  CONSTRAINT `FKaeb1kehuvgl9e7xfkkhoflfrd` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `FKm1nqcbhgr9fb4bssswpeob8u7` FOREIGN KEY (`reply_id`) REFERENCES `reply` (`id`),
  CONSTRAINT `FKnipk7k3gk2rjko7fhq5jjpu4i` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKqh98ss5v7m1ksrcen3q7uhysi` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `block`
--

LOCK TABLES `block` WRITE;
/*!40000 ALTER TABLE `block` DISABLE KEYS */;
/*!40000 ALTER TABLE `block` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blocks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blocked_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `comment_id` bigint DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `reply_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `blocked_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_block_user_post_comment_reply` (`user_id`,`post_id`,`comment_id`,`reply_id`),
  UNIQUE KEY `uk_block_user_targets` (`user_id`,`post_id`,`comment_id`,`reply_id`,`blocked_user_id`),
  KEY `idx_block_user` (`user_id`),
  KEY `FK1xesclmrgvqjr81s9321vc7yh` (`comment_id`),
  KEY `FKm8iio7q5kt0oyw2i453x2n4db` (`post_id`),
  KEY `FKp4yu19wbk023o0vad5ydp49rp` (`reply_id`),
  KEY `FKt1d095gywtpm79686tbxkel9f` (`blocked_user_id`),
  CONSTRAINT `FK1xesclmrgvqjr81s9321vc7yh` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `FKm8iio7q5kt0oyw2i453x2n4db` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `FKp4yu19wbk023o0vad5ydp49rp` FOREIGN KEY (`reply_id`) REFERENCES `reply` (`id`),
  CONSTRAINT `FKpu9d2f26jeb31f1203lmjv4ny` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKt1d095gywtpm79686tbxkel9f` FOREIGN KEY (`blocked_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocks`
--

LOCK TABLES `blocks` WRITE;
/*!40000 ALTER TABLE `blocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(2000) NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `stored_file_name` varchar(500) DEFAULT NULL,
  `type` tinyint NOT NULL,
  `chat_room_id` bigint DEFAULT NULL,
  `sender_id` bigint DEFAULT NULL,
  `content_type` varchar(100) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5f82aoyy0jiwpj08qapfrxbh6` (`sender_id`),
  KEY `idx_chat_room_sent_at` (`chat_room_id`,`sent_at`),
  CONSTRAINT `FK5f82aoyy0jiwpj08qapfrxbh6` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKj52yap2xrm9u0721dct0tjor9` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_participant`
--

DROP TABLE IF EXISTS `chat_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_participant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_muted` bit(1) NOT NULL,
  `is_pinned` bit(1) NOT NULL,
  `joined_at` datetime(6) NOT NULL,
  `last_read_message_id` bigint DEFAULT NULL,
  `chat_room_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_participant_user_room` (`user_id`,`chat_room_id`),
  KEY `FKqaqt420qk0puto2opt6st1u42` (`chat_room_id`),
  CONSTRAINT `FKe2s50kw19y5jwfi23jl5v6ov7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKqaqt420qk0puto2opt6st1u42` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_participant`
--

LOCK TABLES `chat_participant` WRITE;
/*!40000 ALTER TABLE `chat_participant` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_read`
--

DROP TABLE IF EXISTS `chat_read`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_read` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_read` bit(1) NOT NULL,
  `read_at` datetime(6) NOT NULL,
  `message_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK45s2pll1rla7afs5tjf90bjnx` (`message_id`,`user_id`),
  KEY `FK52vuchvn31gspb4k57gkr6frf` (`user_id`),
  CONSTRAINT `FK52vuchvn31gspb4k57gkr6frf` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKm0x4txayj9jsm9jfoxgixoxqg` FOREIGN KEY (`message_id`) REFERENCES `chat_message` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_read`
--

LOCK TABLES `chat_read` WRITE;
/*!40000 ALTER TABLE `chat_read` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_read` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room`
--

DROP TABLE IF EXISTS `chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `reference_id` bigint DEFAULT NULL,
  `type` enum('DIRECT','GROUP') NOT NULL,
  `last_message` varchar(1000) DEFAULT NULL,
  `last_message_at` datetime(6) DEFAULT NULL,
  `representative_image_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_chatroom_type_ref` (`type`,`reference_id`),
  KEY `idx_chatroom_last_message_at` (`last_message_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room`
--

LOCK TABLES `chat_room` WRITE;
/*!40000 ALTER TABLE `chat_room` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `like_count` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `post_id` bigint NOT NULL,
  `writer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs1slvnkuemjsq2kj4h3vhx7i1` (`post_id`),
  KEY `FKesq8qbb4pp4k3gsxku3tqvgmn` (`writer_id`),
  CONSTRAINT `FKesq8qbb4pp4k3gsxku3tqvgmn` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKs1slvnkuemjsq2kj4h3vhx7i1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `like_count` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `post_id` bigint NOT NULL,
  `writer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_comment_post` (`post_id`),
  KEY `idx_comment_writer` (`writer_id`),
  CONSTRAINT `FKbqnvawwwv4gtlctsi3o7vs131` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `FKtdvhgjfwg764l2sltaixna6ku` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_users`
--

DROP TABLE IF EXISTS `dashboard_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dashboard_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKdep8htixxhiabehwtgnwea340` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_users`
--

LOCK TABLES `dashboard_users` WRITE;
/*!40000 ALTER TABLE `dashboard_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `dashboard_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluation_answer`
--

DROP TABLE IF EXISTS `evaluation_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evaluation_answer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `answered_at` datetime(6) NOT NULL,
  `difficulty` varchar(20) NOT NULL,
  `is_correct` bit(1) NOT NULL,
  `user_answer` varchar(500) DEFAULT NULL,
  `evaluation_id` bigint NOT NULL,
  `problem_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKobwficqmb054rgb9ppfltuyxj` (`evaluation_id`),
  KEY `FKbifi055u00p819bp2i1cqfi4x` (`problem_id`),
  CONSTRAINT `FKbifi055u00p819bp2i1cqfi4x` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`problem_id`),
  CONSTRAINT `FKobwficqmb054rgb9ppfltuyxj` FOREIGN KEY (`evaluation_id`) REFERENCES `unit_evaluation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluation_answer`
--

LOCK TABLES `evaluation_answer` WRITE;
/*!40000 ALTER TABLE `evaluation_answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluation_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_schedule`
--

DROP TABLE IF EXISTS `exam_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exam_schedule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `exam_date` date NOT NULL,
  `title` varchar(100) NOT NULL,
  `user_id` bigint NOT NULL,
  `description` text,
  `location` varchar(200) DEFAULT NULL,
  `subject` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrg4kfbbvwvvk1c65aco5aajmc` (`user_id`),
  CONSTRAINT `FKrg4kfbbvwvvk1c65aco5aajmc` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_schedule`
--

LOCK TABLES `exam_schedule` WRITE;
/*!40000 ALTER TABLE `exam_schedule` DISABLE KEYS */;
INSERT INTO `exam_schedule` VALUES (36,'2025-10-02','충청 ICT 발표',13,NULL,NULL,NULL,NULL),(37,'2025-10-02','충청 ICT',13,NULL,NULL,NULL,NULL),(38,'2025-10-24','중간고사',13,NULL,NULL,NULL,NULL),(39,'2025-10-02','충청ict',13,NULL,NULL,NULL,NULL),(40,'2025-10-02','충청 ICT',12,NULL,NULL,NULL,NULL),(41,'2025-10-02','충청 ICT',12,NULL,NULL,NULL,NULL),(42,'2025-10-02','충청 ict',12,NULL,NULL,NULL,NULL),(43,'2025-10-23','중간고사',12,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `exam_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_schedules`
--

DROP TABLE IF EXISTS `exam_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exam_schedules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `exam_date` date NOT NULL,
  `subject` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKwpr5fmrreiugm49hsdeu37qw` (`user_id`),
  CONSTRAINT `FKwpr5fmrreiugm49hsdeu37qw` FOREIGN KEY (`user_id`) REFERENCES `dashboard_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_schedules`
--

LOCK TABLES `exam_schedules` WRITE;
/*!40000 ALTER TABLE `exam_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `focus_room`
--

DROP TABLE IF EXISTS `focus_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `focus_room` (
  `target_time` int NOT NULL,
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKo8mntogpvu9hy13hpomodiqmv` FOREIGN KEY (`id`) REFERENCES `study_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `focus_room`
--

LOCK TABLES `focus_room` WRITE;
/*!40000 ALTER TABLE `focus_room` DISABLE KEYS */;
/*!40000 ALTER TABLE `focus_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend`
--

DROP TABLE IF EXISTS `friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friend` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `friend_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKjpppv9iwr7xgl05k560rji8tk` (`user_id`,`friend_id`),
  UNIQUE KEY `uk_user_friend` (`user_id`,`friend_id`),
  KEY `idx_friend_user` (`user_id`),
  KEY `idx_friend_friend` (`friend_id`),
  KEY `idx_friend_is_deleted` (`is_deleted`),
  CONSTRAINT `FK5j28qgyvon52ycu9sfieraerm` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKeab81424e9dtc4a8hjlq4xiew` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend`
--

LOCK TABLES `friend` WRITE;
/*!40000 ALTER TABLE `friend` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend_block`
--

DROP TABLE IF EXISTS `friend_block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friend_block` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blocked_at` datetime(6) DEFAULT NULL,
  `blocked_id` bigint NOT NULL,
  `blocker_id` bigint NOT NULL,
  `is_deleted` bit(1) NOT NULL,
  `unblocked_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKfaturxh7wu3888odaryhrwuay` (`blocker_id`,`blocked_id`),
  UNIQUE KEY `uk_blocker_blocked` (`blocker_id`,`blocked_id`),
  KEY `idx_blocker` (`blocker_id`),
  KEY `idx_blocked` (`blocked_id`),
  KEY `idx_block_is_deleted` (`is_deleted`),
  CONSTRAINT `FKduebves07fm4ko2cdu1l9ih3f` FOREIGN KEY (`blocker_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKeve15hmyeek4i12ihkiga8g08` FOREIGN KEY (`blocked_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_block`
--

LOCK TABLES `friend_block` WRITE;
/*!40000 ALTER TABLE `friend_block` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend_block` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend_report`
--

DROP TABLE IF EXISTS `friend_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friend_report` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reason` varchar(500) NOT NULL,
  `reported_at` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','REJECTED','RESOLVED') NOT NULL,
  `reported_id` bigint NOT NULL,
  `reporter_id` bigint NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `resolved_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKk29xe0h1e0yur9kp87ikc6au` (`reporter_id`,`reported_id`),
  UNIQUE KEY `uk_reporter_reported` (`reporter_id`,`reported_id`),
  KEY `idx_reporter` (`reporter_id`),
  KEY `idx_reported` (`reported_id`),
  KEY `idx_status` (`status`),
  KEY `FK9ou3pnigirskj4484nr00x02r` (`resolved_by`),
  CONSTRAINT `FK9e5lwtsrw3dtj9ywx0ob1pjyy` FOREIGN KEY (`reported_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK9ou3pnigirskj4484nr00x02r` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKag6ymu7vvikalvjysde8bsov4` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_report`
--

LOCK TABLES `friend_report` WRITE;
/*!40000 ALTER TABLE `friend_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend_request`
--

DROP TABLE IF EXISTS `friend_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friend_request` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `requested_at` datetime(6) NOT NULL,
  `receiver_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `responded_at` datetime(6) DEFAULT NULL,
  `status` enum('ACCEPTED','PENDING','REJECTED') NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sender_receiver` (`sender_id`,`receiver_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_receiver` (`receiver_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `FK2j9x9icn4n27jgwx9daltsi9a` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK5rji2dcs4fmykw6ovpsyv5ssw` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_request`
--

LOCK TABLES `friend_request` WRITE;
/*!40000 ALTER TABLE `friend_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal`
--

DROP TABLE IF EXISTS `goal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goal` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `daily_goal_minutes` int NOT NULL,
  `is_suggested` bit(1) NOT NULL,
  `set_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf70arauooy8e5a5egk8k69xdr` (`user_id`),
  CONSTRAINT `FKf70arauooy8e5a5egk8k69xdr` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal`
--

LOCK TABLES `goal` WRITE;
/*!40000 ALTER TABLE `goal` DISABLE KEYS */;
/*!40000 ALTER TABLE `goal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `achieved` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `current_hours` int NOT NULL,
  `daily_minutes` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_suggested` bit(1) NOT NULL,
  `progress` double NOT NULL,
  `set_at` datetime(6) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `target_hours` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `weekly_minutes` int NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5mtqwo1qbugfqerrhmc20k4oa` (`user_id`),
  CONSTRAINT `FK5mtqwo1qbugfqerrhmc20k4oa` FOREIGN KEY (`user_id`) REFERENCES `dashboard_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goals`
--

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
/*!40000 ALTER TABLE `goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_id` bigint DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `reply_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `liked_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKobo176u8hg3sfj3nccdiindrs` (`user_id`,`post_id`,`comment_id`,`reply_id`),
  UNIQUE KEY `uk_like_user_post` (`user_id`,`post_id`),
  UNIQUE KEY `uk_like_user_comment` (`user_id`,`comment_id`),
  UNIQUE KEY `uk_like_user_reply` (`user_id`,`reply_id`),
  KEY `idx_like_user` (`user_id`),
  KEY `idx_like_post` (`post_id`),
  KEY `idx_like_comment` (`comment_id`),
  KEY `idx_like_reply` (`reply_id`),
  CONSTRAINT `FK8arpx7i3g3e5dammtdsira2m6` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`),
  CONSTRAINT `FKe4guax66lb963pf27kvm7ikik` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `FKfaun4rv1gl7015llsyfxruoih` FOREIGN KEY (`reply_id`) REFERENCES `reply` (`id`),
  CONSTRAINT `FKnvx9seeqqyy71bij291pwiwrg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKowd6f4s7x9f3w50pvlo6x3b41` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `math_problem_attempts`
--

DROP TABLE IF EXISTS `math_problem_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `math_problem_attempts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attempted_at` datetime(6) DEFAULT NULL,
  `attempts_count` int NOT NULL,
  `feedback` varchar(1000) DEFAULT NULL,
  `hints_used` int DEFAULT NULL,
  `is_correct` bit(1) NOT NULL,
  `student_answer` varchar(255) NOT NULL,
  `time_spent` int NOT NULL,
  `type` enum('EVALUATION','PRACTICE','REVIEW') NOT NULL,
  `math_problem_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7fljm37oumhyr9u4dxsfojr98` (`math_problem_id`),
  KEY `FKbjvdinci7by10ue2q1imynwur` (`student_id`),
  CONSTRAINT `FK7fljm37oumhyr9u4dxsfojr98` FOREIGN KEY (`math_problem_id`) REFERENCES `math_problems` (`id`),
  CONSTRAINT `FKbjvdinci7by10ue2q1imynwur` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `math_problem_attempts`
--

LOCK TABLES `math_problem_attempts` WRITE;
/*!40000 ALTER TABLE `math_problem_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `math_problem_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `math_problems`
--

DROP TABLE IF EXISTS `math_problems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `math_problems` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `answer` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `difficulty_grade` int NOT NULL,
  `exam_month_year` varchar(255) NOT NULL,
  `explanation` varchar(1000) DEFAULT NULL,
  `hint` varchar(500) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `points` int NOT NULL,
  `problem_number` int NOT NULL,
  `subject` varchar(255) NOT NULL,
  `subject_detail` varchar(2000) NOT NULL,
  `time_limit` int NOT NULL,
  `type` enum('MULTIPLE_CHOICE','SHORT_ANSWER') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `math_problems`
--

LOCK TABLES `math_problems` WRITE;
/*!40000 ALTER TABLE `math_problems` DISABLE KEYS */;
/*!40000 ALTER TABLE `math_problems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notice` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `content` tinytext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `views` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passage`
--

DROP TABLE IF EXISTS `passage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passage` (
  `passage_id` bigint NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`passage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passage`
--

LOCK TABLES `passage` WRITE;
/*!40000 ALTER TABLE `passage` DISABLE KEYS */;
/*!40000 ALTER TABLE `passage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` enum('ANONYMOUS','GENERAL','INFO','NOTICE','QUESTION','STUDY') NOT NULL,
  `comment_count` int NOT NULL,
  `content` tinytext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `like_count` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `view_count` int NOT NULL,
  `writer_id` bigint DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `team_room_id` bigint DEFAULT NULL,
  `tag` varchar(500) DEFAULT NULL,
  `study_room_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_post_writer` (`writer_id`),
  KEY `idx_post_created` (`created_at`),
  KEY `idx_post_is_deleted` (`is_deleted`),
  KEY `FKrjerjryobur5od58v6qrusfhl` (`team_room_id`),
  KEY `FKc95em3ociqqj433m6w6w8ajg` (`study_room_id`),
  CONSTRAINT `FKb6bn9c3v7svh9lywhv9nnrdep` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKc95em3ociqqj433m6w6w8ajg` FOREIGN KEY (`study_room_id`) REFERENCES `study_room` (`id`),
  CONSTRAINT `FKrjerjryobur5od58v6qrusfhl` FOREIGN KEY (`team_room_id`) REFERENCES `team_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_favorite`
--

DROP TABLE IF EXISTS `post_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_favorite` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_post` (`user_id`,`post_id`),
  KEY `idx_favorite_user` (`user_id`),
  KEY `idx_favorite_post` (`post_id`),
  KEY `idx_favorite_is_deleted` (`is_deleted`),
  CONSTRAINT `FK937yqqte113cikxpdcub6jhsp` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKtnr54tuktg3welr2u950p0mqr` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_favorite`
--

LOCK TABLES `post_favorite` WRITE;
/*!40000 ALTER TABLE `post_favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `problem`
--

DROP TABLE IF EXISTS `problem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `problem` (
  `problem_id` bigint NOT NULL AUTO_INCREMENT,
  `answer` varchar(20) NOT NULL,
  `correct_rate` double DEFAULT NULL,
  `explanation` longtext,
  `image_path` varchar(500) DEFAULT NULL,
  `source` varchar(200) DEFAULT NULL,
  `subject` varchar(50) NOT NULL,
  `passage_id` bigint DEFAULT NULL,
  `unit_id` bigint NOT NULL,
  `choices` varchar(1000) DEFAULT NULL,
  `content` tinytext,
  `title` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`problem_id`),
  KEY `FKp404e57g1lbssjdx74v5x19oa` (`passage_id`),
  KEY `FKqd9gkb271lxrlha22ilgjmqp3` (`unit_id`),
  CONSTRAINT `FKp404e57g1lbssjdx74v5x19oa` FOREIGN KEY (`passage_id`) REFERENCES `passage` (`passage_id`),
  CONSTRAINT `FKqd9gkb271lxrlha22ilgjmqp3` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `problem`
--

LOCK TABLES `problem` WRITE;
/*!40000 ALTER TABLE `problem` DISABLE KEYS */;
/*!40000 ALTER TABLE `problem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_room`
--

DROP TABLE IF EXISTS `quiz_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_room` (
  `difficulty` varchar(255) DEFAULT NULL,
  `grade` int DEFAULT NULL,
  `month` int DEFAULT NULL,
  `problem_id` bigint DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `id` bigint NOT NULL,
  `current_problem_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKf4ix3yf6ql5y08lf20jtcoi7y` (`current_problem_id`),
  CONSTRAINT `FKb2422a6ly6m80r4e3j3h86q2g` FOREIGN KEY (`current_problem_id`) REFERENCES `problem` (`problem_id`),
  CONSTRAINT `FKdifhisvw42wdokwvk9t24159t` FOREIGN KEY (`id`) REFERENCES `study_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_room`
--

LOCK TABLES `quiz_room` WRITE;
/*!40000 ALTER TABLE `quiz_room` DISABLE KEYS */;
INSERT INTO `quiz_room` VALUES (NULL,0,0,NULL,NULL,1,NULL),(NULL,0,0,NULL,NULL,2,NULL),(NULL,0,0,NULL,NULL,3,NULL);
/*!40000 ALTER TABLE `quiz_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reflections`
--

DROP TABLE IF EXISTS `reflections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reflections` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `accuracy` double NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `duration_minutes` int NOT NULL,
  `focus_rate` double NOT NULL,
  `reflection_date` date NOT NULL,
  `reflection_type` enum('CUSTOM','RANGE','WEEKLY') NOT NULL,
  `study_date` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf6jumiyjfdpswarhdwoc85qts` (`user_id`),
  CONSTRAINT `FKf6jumiyjfdpswarhdwoc85qts` FOREIGN KEY (`user_id`) REFERENCES `dashboard_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reflections`
--

LOCK TABLES `reflections` WRITE;
/*!40000 ALTER TABLE `reflections` DISABLE KEYS */;
/*!40000 ALTER TABLE `reflections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reply`
--

DROP TABLE IF EXISTS `reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reply` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` tinytext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `like_count` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `comment_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  `writer_id` bigint NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reply_post` (`post_id`),
  KEY `idx_reply_comment` (`comment_id`),
  KEY `idx_reply_writer` (`writer_id`),
  KEY `idx_reply_is_deleted` (`is_deleted`),
  CONSTRAINT `FK6w0ns67lrq1jdiwi5xvtj1vxx` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`),
  CONSTRAINT `FKjd46p0k0waihmq9r3ng6m5fr5` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `FKnpyg5e6pqr2v1y4y6pacte11q` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `FKp0ksrhgq6o5rlhvkcios5ex6c` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
/*!40000 ALTER TABLE `reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reason` varchar(500) NOT NULL,
  `reported_at` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','REJECTED','RESOLVED') NOT NULL,
  `comment_id` bigint DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `reply_id` bigint DEFAULT NULL,
  `reporter_id` bigint NOT NULL,
  `target_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKjcwlmqqfklb0vyaafk9rjyn9w` (`reporter_id`,`post_id`,`comment_id`,`reply_id`,`target_user_id`),
  KEY `idx_report_reporter` (`reporter_id`),
  KEY `idx_report_post` (`post_id`),
  KEY `idx_report_comment` (`comment_id`),
  KEY `idx_report_reply` (`reply_id`),
  KEY `idx_report_target_user` (`target_user_id`),
  KEY `idx_report_status` (`status`),
  CONSTRAINT `FK14hrtq6fw0l01spmrbpvrep62` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKjiyp2xkgtb2vg8vfro8ney1i5` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `FKnuqod1y014fp5bmqjeoffcgqy` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `FKqbhdxqd3ly7fkhly5nrl2j93k` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrxmqns3s8l98cumv1xa784h6j` FOREIGN KEY (`reply_id`) REFERENCES `reply` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_attempts`
--

DROP TABLE IF EXISTS `review_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review_attempts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_correct` bit(1) NOT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `review_answer` varchar(255) NOT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `time_spent` int NOT NULL,
  `wrong_answer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKasn7ag3rw2tbhotum303co18n` (`wrong_answer_id`),
  CONSTRAINT `FKasn7ag3rw2tbhotum303co18n` FOREIGN KEY (`wrong_answer_id`) REFERENCES `student_wrong_answers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_attempts`
--

LOCK TABLES `review_attempts` WRITE;
/*!40000 ALTER TABLE `review_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `max_participants` int NOT NULL,
  `room_type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sidebar_study`
--

DROP TABLE IF EXISTS `sidebar_study`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sidebar_study` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `color` varchar(255) DEFAULT NULL,
  `info` varchar(255) DEFAULT NULL,
  `members` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `schedule` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `tag_color` varchar(255) DEFAULT NULL,
  `creator_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbdvglq071wfldneq1o1w53ili` (`creator_id`),
  CONSTRAINT `FKbdvglq071wfldneq1o1w53ili` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sidebar_study`
--

LOCK TABLES `sidebar_study` WRITE;
/*!40000 ALTER TABLE `sidebar_study` DISABLE KEYS */;
/*!40000 ALTER TABLE `sidebar_study` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_level`
--

DROP TABLE IF EXISTS `student_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_level` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `average_score` double DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `current_level` int NOT NULL,
  `hard_streak` int NOT NULL,
  `total_attempts` int NOT NULL,
  `total_correct` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `unit_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkges9gq4fp1xxlmp2mbqnuwrd` (`user_id`,`unit_id`),
  KEY `FK9ghklbkro26q62up1sorka6dx` (`unit_id`),
  CONSTRAINT `FK9ghklbkro26q62up1sorka6dx` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`),
  CONSTRAINT `FKk2psvijggligiv4rlst4iqyq4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_level`
--

LOCK TABLES `student_level` WRITE;
/*!40000 ALTER TABLE `student_level` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_wrong_answers`
--

DROP TABLE IF EXISTS `student_wrong_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_wrong_answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_resolved` bit(1) NOT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `study_recommendation` varchar(2000) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `weakness_analysis` varchar(1000) DEFAULT NULL,
  `wrong_answer` varchar(255) NOT NULL,
  `wrong_count` int NOT NULL,
  `math_problem_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7rhay3o9p92melkutdrarm56r` (`math_problem_id`),
  KEY `FKqs0kesqt054t0qmia5nfbprkh` (`student_id`),
  CONSTRAINT `FK7rhay3o9p92melkutdrarm56r` FOREIGN KEY (`math_problem_id`) REFERENCES `math_problems` (`id`),
  CONSTRAINT `FKqs0kesqt054t0qmia5nfbprkh` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_wrong_answers`
--

LOCK TABLES `student_wrong_answers` WRITE;
/*!40000 ALTER TABLE `student_wrong_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_wrong_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `average_accuracy` double DEFAULT NULL,
  `class_number` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `current_math_level` enum('ADVANCED','BEGINNER','ELEMENTARY','HIGH','MIDDLE') NOT NULL,
  `email` varchar(255) NOT NULL,
  `grade` int DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `max_streak_count` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `school` varchar(255) DEFAULT NULL,
  `streak_count` int DEFAULT NULL,
  `student_number` int DEFAULT NULL,
  `total_correct_answers` int DEFAULT NULL,
  `total_solved_problems` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKakwqgcdnid3qo41cqpdu4ke01` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_application`
--

DROP TABLE IF EXISTS `study_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_application` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  `study_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8l2fttiusqy9r7isd5alnky31` (`study_id`),
  KEY `FK5ptwucfg93gsv0maeslsho609` (`user_id`),
  CONSTRAINT `FK5ptwucfg93gsv0maeslsho609` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK8l2fttiusqy9r7isd5alnky31` FOREIGN KEY (`study_id`) REFERENCES `sidebar_study` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_application`
--

LOCK TABLES `study_application` WRITE;
/*!40000 ALTER TABLE `study_application` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_log`
--

DROP TABLE IF EXISTS `study_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `study_minutes` int NOT NULL,
  `warning_count` int NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8ms3urcnyopot5ohlavi52vvx` (`user_id`),
  CONSTRAINT `FK8ms3urcnyopot5ohlavi52vvx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_log`
--

LOCK TABLES `study_log` WRITE;
/*!40000 ALTER TABLE `study_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_participant`
--

DROP TABLE IF EXISTS `study_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_participant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `joined_at` datetime(6) DEFAULT NULL,
  `study_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `role` enum('LEADER','MEMBER') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbaohbol12wl4ovj263ylqkm0v` (`study_id`),
  KEY `FKb85pam3yagnxtqjmwi4te6khw` (`user_id`),
  CONSTRAINT `FKb85pam3yagnxtqjmwi4te6khw` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKbaohbol12wl4ovj263ylqkm0v` FOREIGN KEY (`study_id`) REFERENCES `sidebar_study` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_participant`
--

LOCK TABLES `study_participant` WRITE;
/*!40000 ALTER TABLE `study_participant` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_plan`
--

DROP TABLE IF EXISTS `study_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_plan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `checked` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `plan_content` text,
  `subject` varchar(255) DEFAULT NULL,
  `units` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `weeks` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_plan`
--

LOCK TABLES `study_plan` WRITE;
/*!40000 ALTER TABLE `study_plan` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_room`
--

DROP TABLE IF EXISTS `study_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_room` (
  `room_type` varchar(31) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invite_code` varchar(255) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `password` varchar(30) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `host_id` bigint NOT NULL,
  `max_participants` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKbn51l0sv2cqvejdx0eoem1x9j` (`invite_code`),
  KEY `FKrr4vw37ocr7iu07xhssha5bn3` (`host_id`),
  CONSTRAINT `FKrr4vw37ocr7iu07xhssha5bn3` FOREIGN KEY (`host_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_room`
--

LOCK TABLES `study_room` WRITE;
/*!40000 ALTER TABLE `study_room` DISABLE KEYS */;
INSERT INTO `study_room` VALUES ('QUIZ',1,'14A74B',_binary '',NULL,'Quiz_test',12,0),('QUIZ',2,'3D6D91',_binary '',NULL,'test',12,0),('QUIZ',3,'0F93E9',_binary '',NULL,'good',12,0);
/*!40000 ALTER TABLE `study_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_room_participant`
--

DROP TABLE IF EXISTS `study_room_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_room_participant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `focus_seconds` int NOT NULL,
  `goal_achieved` bit(1) NOT NULL,
  `has_confirmed_exit` bit(1) NOT NULL,
  `is_presenter` bit(1) NOT NULL,
  `is_ready` bit(1) NOT NULL,
  `joined_at` datetime(6) DEFAULT NULL,
  `study_room_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3ll5uf07pteau9dvvs3i3gu85` (`study_room_id`),
  KEY `FKscwqox75f9gt6nm2ciq2pk1v` (`user_id`),
  CONSTRAINT `FK3ll5uf07pteau9dvvs3i3gu85` FOREIGN KEY (`study_room_id`) REFERENCES `study_room` (`id`),
  CONSTRAINT `FKscwqox75f9gt6nm2ciq2pk1v` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_room_participant`
--

LOCK TABLES `study_room_participant` WRITE;
/*!40000 ALTER TABLE `study_room_participant` DISABLE KEYS */;
INSERT INTO `study_room_participant` VALUES (1,0,_binary '\0',_binary '\0',_binary '\0',_binary '\0','2025-06-03 22:17:58.063450',1,12),(2,0,_binary '\0',_binary '\0',_binary '\0',_binary '\0','2025-06-03 22:25:01.157053',2,12),(3,0,_binary '\0',_binary '\0',_binary '\0',_binary '\0','2025-06-11 02:41:06.585534',3,12);
/*!40000 ALTER TABLE `study_room_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_session`
--

DROP TABLE IF EXISTS `study_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_session` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `accuracy` double NOT NULL,
  `correct_rate` double NOT NULL,
  `duration_minutes` int NOT NULL,
  `ended_at` datetime(6) NOT NULL,
  `focus_rate` double NOT NULL,
  `started_at` datetime(6) NOT NULL,
  `study_date` date NOT NULL,
  `study_type` enum('PERSONAL','TEAM') NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `unit_name` varchar(100) NOT NULL,
  `warning_count` int NOT NULL,
  `user_id` bigint NOT NULL,
  `focus_minutes` int NOT NULL,
  `total_minutes` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3bkr0f6m9dbckmbh3yt4dcpwd` (`user_id`),
  CONSTRAINT `FK3bkr0f6m9dbckmbh3yt4dcpwd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_session`
--

LOCK TABLES `study_session` WRITE;
/*!40000 ALTER TABLE `study_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_time`
--

DROP TABLE IF EXISTS `study_time`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_time` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `today_goal_minutes` int NOT NULL DEFAULT '0',
  `today_study_minutes` int NOT NULL DEFAULT '0',
  `weekly_goal_minutes` int NOT NULL DEFAULT '0',
  `user_id` bigint NOT NULL,
  `date` date NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_study_time_user_date` (`user_id`,`date`),
  CONSTRAINT `FKrnjine6ix7hy6o291ykefbov6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_time`
--

LOCK TABLES `study_time` WRITE;
/*!40000 ALTER TABLE `study_time` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_time` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_times`
--

DROP TABLE IF EXISTS `study_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_times` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `accuracy` double NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `duration_minutes` int NOT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `focus_rate` double NOT NULL,
  `minutes` int NOT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `study_date` date NOT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK21e014fqiwp2ki884fdhwlrrt` (`user_id`),
  CONSTRAINT `FK21e014fqiwp2ki884fdhwlrrt` FOREIGN KEY (`user_id`) REFERENCES `dashboard_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_times`
--

LOCK TABLES `study_times` WRITE;
/*!40000 ALTER TABLE `study_times` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_room`
--

DROP TABLE IF EXISTS `team_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `room_type` varchar(255) NOT NULL,
  `max_participants` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `host_id` bigint NOT NULL,
  `team_id` int NOT NULL,
  `current_presenter_id` bigint DEFAULT NULL,
  `current_question_index` int DEFAULT NULL,
  `focus_completed_at` datetime(6) DEFAULT NULL,
  `mode` enum('FOCUS','QUIZ') DEFAULT NULL,
  `quiz_started_at` datetime(6) DEFAULT NULL,
  `room_name` varchar(255) DEFAULT NULL,
  `status` enum('FOCUS_COMPLETE','FOCUS_IN_PROGRESS','QUIZ_ENDED','QUIZ_IN_PROGRESS','WAITING') DEFAULT NULL,
  `target_time` int DEFAULT NULL,
  `winner_id` bigint DEFAULT NULL,
  `creator_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7sotwyx3j8mn6i52jl6rb8fge` (`host_id`),
  KEY `FK71jc3vdbos5i0s8l8auhjsj9x` (`creator_id`),
  KEY `fk_teamroom_team` (`team_id`),
  CONSTRAINT `FK71jc3vdbos5i0s8l8auhjsj9x` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK7sotwyx3j8mn6i52jl6rb8fge` FOREIGN KEY (`host_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_teamroom_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_room`
--

LOCK TABLES `team_room` WRITE;
/*!40000 ALTER TABLE `team_room` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_room_raised_hands`
--

DROP TABLE IF EXISTS `team_room_raised_hands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_room_raised_hands` (
  `room_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  KEY `FKbt6om2lbg5irvisboe8n7xkad` (`room_id`),
  CONSTRAINT `FKbt6om2lbg5irvisboe8n7xkad` FOREIGN KEY (`room_id`) REFERENCES `team_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_room_raised_hands`
--

LOCK TABLES `team_room_raised_hands` WRITE;
/*!40000 ALTER TABLE `team_room_raised_hands` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_room_raised_hands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teams` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `team_name` varchar(100) NOT NULL,
  `team_code` varchar(10) NOT NULL,
  `team_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `team_end` datetime DEFAULT NULL,
  `is_active` enum('Y','N') DEFAULT 'Y',
  `team_description` text,
  PRIMARY KEY (`team_id`),
  UNIQUE KEY `team_code` (`team_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `todo`
--

DROP TABLE IF EXISTS `todo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `text` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `completed` bit(1) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `priority` enum('HIGH','LOW','NORMAL') NOT NULL,
  `title` varchar(100) NOT NULL,
  `todo_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdcopxq1yu1u8ijb7rjexhsr6v` (`user_id`),
  CONSTRAINT `FKdcopxq1yu1u8ijb7rjexhsr6v` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todo`
--

LOCK TABLES `todo` WRITE;
/*!40000 ALTER TABLE `todo` DISABLE KEYS */;
INSERT INTO `todo` VALUES (8,NULL,13,_binary '\0','','NORMAL','test','2025-06-25'),(10,NULL,13,_binary '\0','','NORMAL','test','2025-06-17'),(11,NULL,13,_binary '\0','','NORMAL','good','2025-06-08'),(12,NULL,13,_binary '\0','','NORMAL','test','2025-06-08'),(13,NULL,13,_binary '\0','','NORMAL','test','2025-06-19'),(14,NULL,13,_binary '\0',NULL,'NORMAL','test','2025-06-09'),(15,NULL,13,_binary '\0',NULL,'NORMAL','test','2025-06-11'),(16,NULL,13,_binary '\0',NULL,'NORMAL','ㅅㄷㄴㅅ','2025-06-08'),(17,NULL,13,_binary '\0',NULL,'NORMAL','good','2025-06-08'),(18,NULL,13,_binary '\0','','NORMAL','test','2025-06-08'),(19,NULL,13,_binary '\0','','NORMAL','test','2025-06-08'),(20,NULL,13,_binary '\0','','NORMAL','ㅅㄷㄴㅅ','2025-06-20'),(21,NULL,13,_binary '\0','','NORMAL','test','2025-06-14'),(22,NULL,13,_binary '\0','','NORMAL','gte','2025-06-08'),(23,NULL,13,_binary '\0','','NORMAL','ㄴㄴㄴ','2025-06-27'),(24,NULL,13,_binary '\0','','NORMAL','test','2025-07-17'),(25,NULL,13,_binary '\0','','NORMAL','ㅎ','2025-06-12'),(26,NULL,13,_binary '\0','','NORMAL','ㅎ','2025-06-08'),(27,NULL,13,_binary '\0','','NORMAL','todo','2025-06-08'),(28,NULL,13,_binary '\0','','NORMAL','test','2025-06-12'),(29,NULL,13,_binary '\0','','NORMAL','test','2025-06-13'),(59,NULL,12,_binary '\0','','HIGH','충청 ict','2025-10-02'),(60,NULL,12,_binary '\0','','NORMAL','발표자료 내기','2025-09-30');
/*!40000 ALTER TABLE `todo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_evaluation`
--

DROP TABLE IF EXISTS `unit_evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unit_evaluation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed_at` datetime(6) DEFAULT NULL,
  `correct_answers` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `easy_correct` int NOT NULL DEFAULT '0',
  `hard_correct` int NOT NULL DEFAULT '0',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `medium_correct` int NOT NULL DEFAULT '0',
  `score` double DEFAULT NULL,
  `started_at` datetime(6) NOT NULL,
  `total_questions` int NOT NULL,
  `unit_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5s6l60eboaw8h555quiwstg2x` (`unit_id`),
  KEY `FK120lgardvrnbeiytu101xxkcf` (`user_id`),
  CONSTRAINT `FK120lgardvrnbeiytu101xxkcf` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK5s6l60eboaw8h555quiwstg2x` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_evaluation`
--

LOCK TABLES `unit_evaluation` WRITE;
/*!40000 ALTER TABLE `unit_evaluation` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `units` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT NULL,
  `subject` varchar(20) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subjects`
--

DROP TABLE IF EXISTS `user_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_subjects` (
  `user_id` bigint NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  KEY `FK7jj09lbw40l669pbngidrnofu` (`user_id`),
  CONSTRAINT `FK7jj09lbw40l669pbngidrnofu` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subjects`
--

LOCK TABLES `user_subjects` WRITE;
/*!40000 ALTER TABLE `user_subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_team`
--

DROP TABLE IF EXISTS `user_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_team` (
  `team_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  KEY `FKmodbby1xpn7sf5rmw7f81n0v4` (`user_id`),
  KEY `FK6d6agqknw564xtsa91d3259wu` (`team_id`),
  CONSTRAINT `FK6d6agqknw564xtsa91d3259wu` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`),
  CONSTRAINT `FKmodbby1xpn7sf5rmw7f81n0v4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_team`
--

LOCK TABLES `user_team` WRITE;
/*!40000 ALTER TABLE `user_team` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `refresh_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nickname` varchar(100) NOT NULL,
  `profile_image_url` varchar(500) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `grade` int NOT NULL,
  `is_deleted` bit(1) NOT NULL,
  `study_habit` varchar(50) NOT NULL,
  `point` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'asd','asdf1234','이순신','1234567890','asd1234@naver.com',0,'$2a$10$FP1oXckpXUPobReQZYYFuu1xc0GgK5S46FRpjUAdCCkUYCVusjvYW','2025-05-06 00:54:53','2025-05-26 00:43:24','이순신',NULL,NULL,0,_binary '\0','',0),(12,'qwe','qwer1234','땃쥐','12341234','qwer@qwer.com',0,'$2a$10$vr/9MK2TVo.kUl036M7OJOnbDnPG.cj8PY5KJ1W7uDIS.GIHbqJtC','2025-05-06 07:26:33','2025-09-28 16:53:53','땃쥐',NULL,NULL,5,_binary '\0','',0),(13,'zxc','zxcv1234','왜가리','0101234395','zxc@zxcv',0,'$2a$10$D6jOGuSjku6VpAyBYp6KDeT7YL12XfF3t/FD76x0coQjDrKOcGlE6','2025-05-08 07:50:23','2025-05-26 00:43:24','왜가리',NULL,NULL,0,_binary '\0','',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_room`
--

DROP TABLE IF EXISTS `video_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `video_room` (
  `room_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `host_id` bigint NOT NULL,
  `is_active` bit(1) NOT NULL,
  `team_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_room`
--

LOCK TABLES `video_room` WRITE;
/*!40000 ALTER TABLE `video_room` DISABLE KEYS */;
/*!40000 ALTER TABLE `video_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vote` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `presenter_id` bigint DEFAULT NULL,
  `score` int DEFAULT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoxmsh19268msp1gkjc4b3981u` (`room_id`),
  CONSTRAINT `FKoxmsh19268msp1gkjc4b3981u` FOREIGN KEY (`room_id`) REFERENCES `team_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote`
--

LOCK TABLES `vote` WRITE;
/*!40000 ALTER TABLE `vote` DISABLE KEYS */;
/*!40000 ALTER TABLE `vote` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-24 13:43:16
