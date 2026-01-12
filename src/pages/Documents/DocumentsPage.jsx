const documents = [
  {
    id: 1,
    name: "Ordonnance Rex.pdf",
    consultation: "Vaccination",
  },
  {
    id: 2,
    name: "Analyse Mimi.jpg",
    consultation: "Contrôle",
  },
];

export default function DocumentsPage() {
  return (
    <div>
      <h1>Documents</h1>

      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            {doc.name}  
            <br />
            Consultation : {doc.consultation}
          </li>
        ))}
      </ul>
    </div>
  );
}
