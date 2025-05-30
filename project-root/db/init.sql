-- Creazione del database
CREATE DATABASE IF NOT EXISTS armonizzazione_percorsi;
USE armonizzazione_percorsi;

-- Tabella dei corsi di laurea
CREATE TABLE CorsoDiLaurea (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Tabella degli insegnamenti
CREATE TABLE Insegnamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    corso_id INT,
    FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id) ON DELETE CASCADE
);

-- Tabella degli argomenti
CREATE TABLE Argomento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descrizione VARCHAR(255) NOT NULL,
    UNIQUE(descrizione)
);

-- Associazione tra insegnamenti e argomenti (molti-a-molti)
CREATE TABLE InsegnamentoArgomento (
    insegnamento_id INT,
    argomento_id INT,
    PRIMARY KEY (insegnamento_id, argomento_id),
    FOREIGN KEY (insegnamento_id) REFERENCES Insegnamento(id) ON DELETE CASCADE,
    FOREIGN KEY (argomento_id) REFERENCES Argomento(id) ON DELETE CASCADE
);

-- Tabella Utenti (Include docenti e amministratori, senza presidente)
CREATE TABLE Utente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Hash della password per sicurezza
    ruolo ENUM('docente', 'amministratore') NOT NULL  -- Rimosso 'presidente'
);

-- Collegamento tra docente e insegnamento
CREATE TABLE DocenteInsegnamento (
    docente_id INT,
    insegnamento_id INT,
    PRIMARY KEY (docente_id, insegnamento_id),
    FOREIGN KEY (docente_id) REFERENCES Utente(id) ON DELETE CASCADE,
    FOREIGN KEY (insegnamento_id) REFERENCES Insegnamento(id) ON DELETE CASCADE
);

-- Collegamento tra corsi di laurea e insegnamenti condivisi
CREATE TABLE CorsoDiLaureaInsegnamento (
    corso_id INT,
    insegnamento_id INT,
    PRIMARY KEY (corso_id, insegnamento_id),
    FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id) ON DELETE CASCADE,
    FOREIGN KEY (insegnamento_id) REFERENCES Insegnamento(id) ON DELETE CASCADE
);

-- Collegamento tra amministratori e corsi (Gestione e assegnazioni)
CREATE TABLE IncaricatoCorso (
    amministratore_id INT,
    corso_id INT,
    PRIMARY KEY (amministratore_id, corso_id),
    FOREIGN KEY (amministratore_id) REFERENCES Utente(id) ON DELETE CASCADE,
    FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id) ON DELETE CASCADE
);

-- Tabella per argomenti obbligatori per corso di laurea
CREATE TABLE ArgomentoObbligatorio (
    corso_id INT,
    argomento_id INT,
    PRIMARY KEY (corso_id, argomento_id),
    FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id) ON DELETE CASCADE,
    FOREIGN KEY (argomento_id) REFERENCES Argomento(id) ON DELETE CASCADE
);