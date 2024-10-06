-- MySQL dump 10.13  Distrib 8.4.0, for Win64 (x86_64)
--
-- Host: localhost    Database: dpms_serv
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `status` enum('active','completed','onHold') NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `progress` int DEFAULT '0',
  `dueDate` datetime DEFAULT NULL,
  `projectManagerId` int DEFAULT NULL,
  `duration_weeks` int GENERATED ALWAYS AS (timestampdiff(WEEK,`start_date`,`end_date`)) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  KEY `idx_projectManagerId` (`projectManagerId`),
  KEY `idx_userId` (`userId`),
  CONSTRAINT `fk_project_manager` FOREIGN KEY (`projectManagerId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_project_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` (`id`, `project_id`, `name`, `description`, `status`, `createdAt`, `updatedAt`, `userId`, `start_date`, `end_date`, `progress`, `dueDate`, `projectManagerId`) VALUES (26,NULL,'Project Alpha','Description for Project Alpha','active','2024-08-05 20:14:33','2024-08-05 20:14:33',1,'2024-08-05 20:14:33','2024-09-04 20:14:33',0,'2024-09-10 00:00:00',NULL),(27,NULL,'Project Beta','Description for Project Beta','active','2024-08-05 20:14:33','2024-08-05 20:14:33',4,'2024-08-05 20:14:33','2024-10-04 20:14:33',0,'2024-09-10 00:00:00',NULL),(28,NULL,'Project Gamma','Description for Project Gamma','active','2024-08-05 20:14:47','2024-08-05 20:14:47',3,'2024-08-05 20:14:47','2024-11-03 20:14:47',0,'2024-09-10 00:00:00',NULL),(29,NULL,'Project Delta','Description for Project Delta','active','2024-08-05 20:14:47','2024-08-05 20:14:47',6,'2024-08-05 20:14:47','2024-12-03 20:14:47',0,'2024-09-10 00:00:00',NULL),(30,NULL,'Fake Project','Testing creation','active','2024-08-13 09:17:03','2024-08-13 09:17:03',1,'2024-08-14 00:00:00','2024-11-19 00:00:00',0,NULL,3),(31,NULL,'Fake Project 2','ANother creation test','active','2024-08-13 14:37:15','2024-08-13 14:37:15',1,'2024-09-25 00:00:00','2025-06-24 00:00:00',0,NULL,3),(32,NULL,'Fake 3','This time with more than one task','active','2024-08-13 14:38:15','2024-08-13 14:38:15',1,'2024-12-25 00:00:00','2025-01-21 00:00:00',0,NULL,6),(33,NULL,'Fakest one ','Added new fields','active','2024-08-14 02:21:05','2024-08-14 02:21:05',1,'2024-08-15 00:00:00','2024-10-23 00:00:00',0,NULL,3),(48,NULL,'Ceru','Coolest','active','2024-08-14 04:03:19','2024-08-14 04:03:19',1,'2024-08-16 00:00:00','2025-10-23 00:00:00',0,NULL,3),(49,NULL,'Demo Projedt','Project demonstration description','active','2024-08-14 06:38:05','2024-08-14 06:38:05',1,'2024-08-15 00:00:00','2025-10-21 00:00:00',0,NULL,39);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `posting_date` date DEFAULT NULL,
  `status` enum('notStarted','inProgress','completed') NOT NULL,
  `assigned_to_user_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `due_date` date DEFAULT NULL,
  `start_date` date NOT NULL DEFAULT '2024-01-01',
  `duration_hours` float GENERATED ALWAYS AS (timestampdiff(HOUR,`start_date`,`due_date`)) STORED,
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_assigned_to_user_id` (`assigned_to_user_id`),
  CONSTRAINT `fk_task_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_user` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` (`id`, `task_id`, `name`, `description`, `posting_date`, `status`, `assigned_to_user_id`, `project_id`, `createdAt`, `updatedAt`, `due_date`, `start_date`) VALUES (3,NULL,'Task 1 for Alpha','Description for Task 1',NULL,'notStarted',2,26,'2024-08-05 18:25:58','2024-08-05 18:25:58','2024-08-12','2024-08-01'),(4,NULL,'Task 2 for Alpha','Description for Task 2',NULL,'inProgress',3,26,'2024-08-05 18:25:58','2024-08-05 18:25:58','2024-08-19','2024-08-01'),(5,NULL,'Task 1 for Beta','Description for Task 1',NULL,'completed',5,27,'2024-08-05 18:26:26','2024-08-05 18:26:26','2024-08-12','2024-08-01'),(6,NULL,'Task 2 for Beta','Description for Task 2',NULL,'notStarted',6,27,'2024-08-05 18:26:26','2024-08-05 18:26:26','2024-08-19','2024-08-01'),(7,NULL,'Fake task 1','Description for Fake Task 1',NULL,'inProgress',7,30,'2024-08-13 07:17:03','2024-08-13 07:17:03','2024-08-20','2024-08-01'),(8,NULL,'Fake task 2','Description for Fake Task 2',NULL,'notStarted',8,31,'2024-08-13 12:37:15','2024-08-13 12:37:15','2024-08-21','2024-08-01'),(9,NULL,'Fake task 3','Description for Fake Task 3',NULL,'completed',9,32,'2024-08-13 12:38:15','2024-08-13 12:38:15','2024-08-22','2024-08-01'),(10,NULL,'Fake task 4','Description for Fake Task 4',NULL,'inProgress',10,32,'2024-08-13 12:38:15','2024-08-13 12:38:15','2024-08-23','2024-08-01'),(11,NULL,'Fake task 5','Description for Fake Task 5',NULL,'notStarted',11,33,'2024-08-14 00:21:05','2024-08-14 00:21:05','2024-08-24','2024-08-01'),(12,NULL,'U & I',NULL,NULL,'notStarted',NULL,48,'2024-08-14 04:03:19','2024-08-14 04:03:19',NULL,'2024-01-01'),(13,NULL,'Demo Task',NULL,NULL,'notStarted',NULL,49,'2024-08-14 06:38:05','2024-08-14 06:38:05',NULL,'2024-01-01'),(14,NULL,'Additional Task',NULL,NULL,'notStarted',NULL,49,'2024-08-14 06:38:05','2024-08-14 06:38:05',NULL,'2024-01-01');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks_backup`
--

DROP TABLE IF EXISTS `tasks_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks_backup` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `description` text,
  `status` enum('notStarted','inProgress','completed','onHold') DEFAULT 'notStarted',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `due_date` datetime DEFAULT NULL,
  `assigned_to_user_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `duration_hours` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks_backup`
--

LOCK TABLES `tasks_backup` WRITE;
/*!40000 ALTER TABLE `tasks_backup` DISABLE KEYS */;
INSERT INTO `tasks_backup` VALUES (3,'Task 1 for Alpha','Description for Task 1','notStarted','2024-08-05 20:25:58','2024-08-05 20:25:58','2024-08-12 20:25:58',2,26,'2024-01-01',5396),(4,'Task 2 for Alpha','Description for Task 2','notStarted','2024-08-05 20:25:58','2024-08-05 20:25:58','2024-08-19 20:25:58',3,26,'2024-01-01',5564),(5,'Task 1 for Beta','Description for Task 1','notStarted','2024-08-05 20:26:26','2024-08-05 20:26:26','2024-08-12 20:26:26',5,27,'2024-01-01',5396),(6,'Task 2 for Beta','Description for Task 2','notStarted','2024-08-05 20:26:26','2024-08-05 20:26:26','2024-08-19 20:26:26',6,27,'2024-01-01',5564),(7,'Fake task 1',NULL,'notStarted','2024-08-13 09:17:03','2024-08-13 09:17:03',NULL,NULL,30,'2024-01-01',NULL),(8,'Fake task 2',NULL,'notStarted','2024-08-13 14:37:15','2024-08-13 14:37:15',NULL,NULL,31,'2024-01-01',NULL),(9,'fake 4',NULL,'notStarted','2024-08-13 14:38:15','2024-08-13 14:38:15',NULL,NULL,32,'2024-01-01',NULL),(10,'fake 55',NULL,'notStarted','2024-08-13 14:38:15','2024-08-13 14:38:15',NULL,NULL,32,'2024-01-01',NULL),(11,'Fakest task',NULL,'notStarted','2024-08-14 02:21:05','2024-08-14 02:21:05',NULL,NULL,33,'2024-01-01',NULL);
/*!40000 ALTER TABLE `tasks_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('consultant','projectManager','director') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2eus','bngzus001@myuct.ac.za','$2a$10$nJ8DLlPeAAnZ12AzoCnVK.utQgKzHVFl9YREKLL63zuSIeWHpVPpO','director','2024-07-18 09:53:34','2024-07-18 09:53:34'),(2,'Alice Johnson','alice.johnson@example.com','$2b$10$zEzSBuTKwTNVj1EU0vaf5O3mlIdbtvh5ek35Kbsk7h6c0DElBsCEO','consultant','2024-07-19 17:01:40','2024-07-22 12:26:54'),(3,'Bob Smith','bob.smith@example.com','$2b$10$Xffe4kwm6IDviqF0obGlh.FR5ANKMkHSOl5OhqQ1iBdPFPTtmpfE2','projectManager','2024-07-19 17:01:40','2024-07-22 12:26:54'),(4,'Carol White','carol.white@example.com','$2b$10$31534KXhfubFt8eJPb34N.AttTN4XC086/ia8oKS44IMFVd36r6qS','director','2024-07-19 17:01:40','2024-07-22 12:26:54'),(5,'David Brown','david.brown@example.com','$2b$10$aaBx76.udQ1uGm9JfQEH/e9NYT8ffoHyllRpIY3H9ugh55a7aifSe','consultant','2024-07-19 17:01:40','2024-07-22 12:26:54'),(6,'Emma Davis','emma.davis@example.com','$2b$10$9Y.VkYwKoRUJysaxKWdcYO78TxWVKrEvQJ0UD0S9ng97FV2r4zB/S','projectManager','2024-07-19 17:01:40','2024-07-22 12:26:54'),(7,'Frank Wilson','frank.wilson@example.com','$2b$10$YalZYFm6YpIadfEkcjmMOeHTWW9p0XqB8CKPge.Zl1SBNvvwkUMIi','director','2024-07-19 17:01:40','2024-07-22 12:26:54'),(8,'Grace Taylor','grace.taylor@example.com','$2b$10$1ww0sEvVIZue1CM/cgDkQuuyqenRiDHq.dUCOifeIvut.UJsYy4nS','consultant','2024-07-19 17:01:40','2024-07-22 12:26:54'),(9,'Henry Miller','henry.miller@example.com','$2b$10$tWOgqzkFs1j7x7CvQG6QwuR0w0Ji0Wm7ewDgPglwdFzYibqJ28yMG','projectManager','2024-07-19 17:01:40','2024-07-22 12:26:54'),(10,'Ivy Anderson','ivy.anderson@example.com','$2b$10$uhAAkAyeQgKwTV9mT8m3z.AUbGLTJdNG57ea.PUn5KEJvjJfxeo92','director','2024-07-19 17:01:40','2024-07-22 12:26:54'),(11,'Jack Harris','jack.harris@example.com','$2b$10$LFLLl4Of.EV8DplJlmfUWevjQQvsVKMP6tD3FXp5vMTTqSlfOdbQW','consultant','2024-07-19 17:01:40','2024-07-22 12:26:54'),(12,'Kara Lewis','kara.lewis@example.com','$2b$10$9UPkmpStf6zPVyC8h6laaOKhLMYvNMaU.5v.UVqLPg1.YnTqVFmwy','projectManager','2024-07-19 17:01:40','2024-07-22 12:26:54'),(13,'Liam Clark','liam.clark@example.com','$2b$10$.HDCQa8K/PgW8oakuALRPexpt5ZJwr1C0vL0duJuIqVUq/AAGROfG','director','2024-07-19 17:01:40','2024-07-22 12:26:54'),(14,'Earl Sunderland','earsun001@myuct.ac.za','$2a$10$IzVGfyhEogpH2KsU3v5u3.nXm4wiTT1gIpqpOYH/t2oIwfpK5FhXe','director','2024-07-22 09:37:25','2024-07-22 09:37:25'),(39,'lutho mbutho','ltombt001@myuct.ac.za','$2a$10$PKrJX.A62dIdSZ157gaQouVRDfzn0d.S/OotoC4Fb4I6Wx.0cXY8O','projectManager','2024-07-22 13:40:59','2024-07-22 13:40:59'),(40,'kawakhe','introvertextrovert888@gmail.com','$2a$10$w73pODlTr0l5Y.v5C6952uKB80J1/11VQcQA5gTZklyHieaT5b8Cq','director','2024-08-02 10:01:15','2024-08-02 10:01:15'),(41,'CHPTAD002','tchipara78@gmail.com','$2a$10$IWFlA..EZIqvq/6k/9A1RODYI5UReIYI.Cf.9qG9LHIbph6DNMO.K','projectManager','2024-08-12 11:29:35','2024-08-12 11:29:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-05  0:59:52
