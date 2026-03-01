import React from "react";

export default function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  // Calcul du nombre total de pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "5px",
    marginTop: "20px",
    marginBottom: "20px",
  };

  const buttonStyle = {
    padding: "5px 10px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    cursor: "pointer",
    borderRadius: "4px",
  };

  const activeStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "white",
    borderColor: "#2563eb",
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        style={currentPage === 1 ? { ...buttonStyle, opacity: 0.5, cursor: "not-allowed" } : buttonStyle}
      >
        Précédent
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          style={currentPage === number ? activeStyle : buttonStyle}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
        style={
          currentPage === Math.ceil(totalItems / itemsPerPage)
            ? { ...buttonStyle, opacity: 0.5, cursor: "not-allowed" }
            : buttonStyle
        }
      >
        Suivant
      </button>
    </div>
  );
}