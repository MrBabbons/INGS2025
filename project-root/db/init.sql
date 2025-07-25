-- 1. DB
CREATE DATABASE IF NOT EXISTS armonizzazione_percorsi;
USE armonizzazione_percorsi;

-- 2. Utenti (docenti, amministratori)
CREATE TABLE Utente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  ruolo ENUM('docente','amministratore') NOT NULL
);

-- 3. Corsi di Laurea (con presidente)
CREATE TABLE CorsoDiLaurea (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  presidente_id INT NULL,
  FOREIGN KEY (presidente_id) REFERENCES Utente(id) ON DELETE SET NULL
);

-- 4. Insegnamenti
CREATE TABLE Insegnamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  corso_id INT,
  FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id) ON DELETE CASCADE
);

-- 5. Argomenti globali
CREATE TABLE Argomento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descrizione VARCHAR(255) NOT NULL,
  UNIQUE(descrizione)
);

-- 6. M:N Insegnamento - Argomento
CREATE TABLE InsegnamentoArgomento (
  insegnamento_id INT,
  argomento_id INT,
  PRIMARY KEY (insegnamento_id, argomento_id),
  FOREIGN KEY (insegnamento_id) REFERENCES Insegnamento(id) ON DELETE CASCADE,
  FOREIGN KEY (argomento_id) REFERENCES Argomento(id) ON DELETE CASCADE
);

-- 7. Argomenti obbligatori per corso
CREATE TABLE ArgomentoObbligatorio (
  corso_id INT,
  argomento_id INT,
  PRIMARY KEY (corso_id, argomento_id),
  FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id) ON DELETE CASCADE,
  FOREIGN KEY (argomento_id) REFERENCES Argomento(id) ON DELETE CASCADE
);

-- 8. Argomenti obbligatori per insegnamento
CREATE TABLE InsegnamentoArgomentoObb (
  insegnamento_id INT,
  argomento_id INT,
  PRIMARY KEY (insegnamento_id, argomento_id),
  FOREIGN KEY (insegnamento_id) REFERENCES Insegnamento(id) ON DELETE CASCADE,
  FOREIGN KEY (argomento_id) REFERENCES Argomento(id) ON DELETE CASCADE
);

-- 9. Docente - Insegnamento
CREATE TABLE DocenteInsegnamento (
  docente_id INT,
  insegnamento_id INT,
  PRIMARY KEY (docente_id, insegnamento_id),
  FOREIGN KEY (docente_id) REFERENCES Utente(id) ON DELETE CASCADE,
  FOREIGN KEY (insegnamento_id) REFERENCES Insegnamento(id) ON DELETE CASCADE
);

-- 10. CorsoDiLaurea - Insegnamento (corsi che condividono insegnamenti)
CREATE TABLE CorsoDiLaureaInsegnamento (
  corso_id INT,
  insegnamento_id INT,
  PRIMARY KEY (corso_id, insegnamento_id),
  FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id) ON DELETE CASCADE,
  FOREIGN KEY (insegnamento_id) REFERENCES Insegnamento(id) ON DELETE CASCADE
);

-- 11. Admin incaricati - Corso
CREATE TABLE IncaricatoCorso (
  amministratore_id INT,
  corso_id INT,
  PRIMARY KEY (amministratore_id, corso_id),
  FOREIGN KEY (amministratore_id) REFERENCES Utente(id) ON DELETE CASCADE,
  FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id) ON DELETE CASCADE
);
-- 12. Insegnamento - Anno e Semestre
ALTER TABLE Insegnamento
  ADD COLUMN anno    TINYINT  NULL,
  ADD COLUMN semestre TINYINT NULL;
