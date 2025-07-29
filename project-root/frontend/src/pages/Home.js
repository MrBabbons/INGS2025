import React from "react";

export default function Home() {
  return (
    <div className="container mt-5">
      <h1>Benvenuto in Armonizzazione Percorsi</h1>
      <p>
        Questa piattaforma ti permette di:
      </p>
      <ul>
        <li>Gestire corsi di laurea e i loro insegnamenti</li>
        <li>Assegnare docenti referenti ai corsi</li>
        <li>Permettere ai docenti di selezionare gli argomenti del loro insegnamento</li>
        <li>Visualizzare report di sovrapposizioni, copertura e lista minima</li>
      </ul>
    </div>
  );
}
