-- Questo script SQL crea le tabelle necessarie per il database di armonizzazione dei percorsi formativi
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
    descrizione TEXT NOT NULL,
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

-- Tabella dei docenti
CREATE TABLE Docente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Collegamento tra docente e insegnamento
CREATE TABLE DocenteInsegnamento (
    docente_id INT,
    insegnamento_id INT,
    PRIMARY KEY (docente_id, insegnamento_id),
    FOREIGN KEY (docente_id) REFERENCES Docente(id) ON DELETE CASCADE,
    FOREIGN KEY (insegnamento_id) REFERENCES Insegnamento(id) ON DELETE CASCADE
);

-- Tabella dei presidenti (o vicari) dei corsi di laurea
CREATE TABLE PresidenteCorso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    docente_id INT,
    corso_id INT,
    FOREIGN KEY (docente_id) REFERENCES Docente(id),
    FOREIGN KEY (corso_id) REFERENCES CorsoDiLaurea(id),
    UNIQUE(corso_id)
);
