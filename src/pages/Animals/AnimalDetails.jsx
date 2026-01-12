import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOwners } from "../api/owners.api";
import { getAnimals } from "../api/animals.api";

export default function AnimalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const animalsData = await getAnimals();
    const ownersData = await getOwners();

    const found = animalsData.find((a) => a.id === Number(id));
    setAnimal(found);
    setOwners(ownersData);
  };

  if (!animal) return <p>Animal introuvable</p>;

  const owner = owners.find((o) => o.id === animal.ownerId);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Détails de l’animal</h2>

      <p><strong>Nom :</strong> {animal.name}</p>
      <p><strong>Espèce :</strong> {animal.species}</p>
      <p><strong>Âge :</strong> {animal.age}</p>

      {owner && (
        <p>
          <strong>Propriétaire :</strong> {owner.name} ({owner.phone})
        </p>
      )}

      <button
        onClick={() => navigate("/animals")}
        style={{
          marginTop: "15px",
          padding: "6px 12px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Retour
      </button>
    </div>
  );
}
