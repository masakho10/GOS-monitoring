
create database monitoring;

use monitoring;

CREATE TABLE interface (
    interface_id INT PRIMARY KEY auto_increment,
    nom VARCHAR(50),
    mode_interfacage VARCHAR(50),
    type_interface VARCHAR(50),
    label_reference_id VARCHAR(50),
    application_id INT,
    FOREIGN KEY (application_id) REFERENCES application(application_id)
);

CREATE TABLE application (
    application_id INT PRIMARY KEY auto_increment,
    nom VARCHAR(50),
    entite VARCHAR(50),
    frequence_MAJ VARCHAR(50)
);



CREATE TABLE log (
    log_id INT PRIMARY KEY auto_increment,
    message_erreur TEXT,
    origine VARCHAR(50),
    status ENUM('S', 'E'),
    date_creation DATE,
    date_MAJ DATE,
    interface_id INT,
    FOREIGN KEY (interface_id) REFERENCES interface(interface_id)
);

CREATE TABLE superviser (
    application_id INT,
    utilisateur_id INT,
    PRIMARY KEY (application_id, utilisateur_id),
    FOREIGN KEY (application_id) REFERENCES application(application_id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(utilisateur_id)
);

CREATE TABLE utilisateur (
    utilisateur_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email_utilisateur VARCHAR(100) NOT NULL,
    role ENUM('Administrateur','Technicien')
);

INSERT INTO utilisateur ( nom, prenom, email_utilisateur, role) VALUES
('Sagne', 'Aicha', 'aicha@sonatel.com', 'Technicien'),
('Sakho', 'Mouhamed', 'mouhamed@sonatel.com', 'Technicien');
('Ndiaye', 'Aziz', 'aziz@sonatel.com', 'Administrateur'),
('Gueye', 'Karim', 'karim@sonatel', 'Administrateur');
-- Insertion des interfaces
INSERT INTO interface (nom, mode_interfacage, type_interface,application_id) VALUES
('client','echange de fichiers', 'entrante',1),
('enteteFacture','echange de fichiers', 'entrante',1),
('ligneFacture','echange de fichiers', 'entrante',1),
('stock','echange de fichiers', 'entrante',1),
('payment','echange de fichiers', 'entrante',1);



-- Liaisons interface-utilisateur
INSERT INTO superviser (application_id, utilisateur_id) VALUES (1, 1),(1, 2),(1, 3),(1, 4);

-- Insertion des auxiliaires
INSERT INTO auxiliaire (auxiliaire_id, nom, frequence_de_MAJ, date_de_creation, date_de_MAJ, interface_id) VALUES
(1, 'stock', 'Quotidienne', '2024-01-01', '2024-06-01', 1),
(2, 'facture', 'Hebdomadaire', '2024-02-01', '2024-06-08', 2);

-- Insertion des logs
INSERT INTO log (log_id, message_erreur, origine, log_status, alert_status, email_utilisateur, auxiliaire_id) VALUES
(1, 'Erreur A', 'Module X', 'E', 'High', 'aicha@esp.sn', 1),
(2, 'Erreur B', 'Module Y', 'S', 'Low', 'mouhamed@esp.sn', 2);



INSERT INTO  log (message_erreur, origine, status,date_creation, date_MAJ) SELECT INTERFACE_ERROR_MESSAGE, ORIGINE, INTERFACE_STATUS, ORGANIZATION_CREATION_DATE, ROW_UPDATE_DATE FROM xxocm_customers_tbl;

INSERT INTO  log (message_erreur, origine, status,date_creation, date_MAJ) SELECT ERROR_MESSAGE, ORIGINE, INTERFACE_STATUS, ROW_CREATION_DATE, ROW_UPDATE_DATE FROM xxocm_invoice_load_header_tbl;

INSERT INTO  log (message_erreur, origine, status,date_creation, date_MAJ) SELECT ERROR_MESSAGE, ORIGINE, INTERFACE_STATUS, ROW_CREATION_DATE, ROW_UPDATE_DATE FROM xxocm_invoice_load_lines_tbl;

INSERT INTO  log (message_erreur, origine, status,date_creation, date_MAJ) SELECT ERROR_MSG, ORIGINE, INTERFACE_STATUS, CREATION_DATE, UPDATE_DATE FROM xxocm_mvt_stock_zsmart;

INSERT INTO  log (message_erreur, origine, status,date_creation, date_MAJ) SELECT ERROR_MESSAGE, ORIGINE, INTERFACE_STATUS, ROW_CREATION_DATE, ROW_UPDATE_DATE FROM xxocm_payments_tbl;

INSERT INTO log (message_erreur, origine, status, date_creation, date_MAJ, interface_id)
SELECT INTERFACE_ERROR_MESSAGE, ORIGINE, INTERFACE_STATUS, ORGANIZATION_CREATION_DATE, ROW_UPDATE_DATE, 1
FROM xxocm_customers_tbl;

INSERT INTO log (message_erreur, origine, status, date_creation, date_MAJ, interface_id)
SELECT ERROR_MESSAGE, ORIGINE, INTERFACE_STATUS, ROW_CREATION_DATE, ROW_UPDATE_DATE, 2
FROM xxocm_invoice_load_header_tbl;

INSERT INTO log (message_erreur, origine, status, date_creation, date_MAJ, interface_id)
SELECT ERROR_MESSAGE, ORIGINE, INTERFACE_STATUS, ROW_CREATION_DATE, ROW_UPDATE_DATE, 3 FROM xxocm_invoice_load_lines_tbl;

INSERT INTO log (message_erreur, origine, status, date_creation, date_MAJ, interface_id)
SELECT ERROR_MSG, ORIGINE, INTERFACE_STATUS, CREATION_DATE, UPDATE_DATE, 4 FROM xxocm_mvt_stock_zsmart;

INSERT INTO log (message_erreur, origine, status, date_creation, date_MAJ, interface_id)
SELECT ERROR_MESSAGE, ORIGINE, INTERFACE_STATUS, ROW_CREATION_DATE, ROW_UPDATE_DATE, 5 FROM xxocm_payments_tbl;

UPDATE log SET interface_id = 1 WHERE log_id BETWEEN 1 AND 117;

SELECT * FROM log WHERE log_id BETWEEN 118 AND 4839;


UPDATE log SET interface_id = 1;

SELECT * FROM log LIMIT 1589 OFFSET 1843;

INSERT INTO application (nom, entite, frequence_MAJ) VALUES ('zsmart', 'Cameroun','1heure');

INSERT INTO interface (nom, mode_interfacage, type_interface,application_id) VALUES
('client','echange de fichiers', 'entrante',1),
('enteteFacture','echange de fichiers', 'entrante',1),
('ligneFacture','echange de fichiers', 'entrante',1),
('stock','echange de fichiers', 'entrante',1),
('payment','echange de fichiers', 'entrante',1);


