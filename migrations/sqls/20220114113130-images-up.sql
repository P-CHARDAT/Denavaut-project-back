CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_name` varchar(50) DEFAULT NULL,
  `image_src` varchar(255) DEFAULT NULL,
   `project_id` int DEFAULT NULL,
   PRIMARY KEY (`id`),
   KEY `FK_project_id` (`project_id`),
   CONSTRAINT `FK_project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
 ) ENGINE = InnoDB DEFAULT CHARSET = latin1;
