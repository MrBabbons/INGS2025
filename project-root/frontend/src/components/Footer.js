// src/components/Footer.jsx

import React from "react";

export default function Footer() {
  return (
    <>
      {/*  
        - far diventare html/body flex-column 100% height  
        - lasciare al footer margin-top: auto  
      */}
      <style>{`
        html, body {
          height: 100%;
          margin: 0;
        }
        body {
          display: flex;
          flex-direction: column;
        }
        #root {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      `}</style>

      <footer
        className="text-center py-3 mt-auto"
        style={{ backgroundColor: "#337AB7" }}
      >
        <div className="container">
          <span className="text-white">
            © 2025 ArmonizzaPercorsi. Tutti i diritti riservati.
          </span>
        </div>
      </footer>
    </>
  );
}
