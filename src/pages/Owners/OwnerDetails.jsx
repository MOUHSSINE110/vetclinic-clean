import { useParams } from "react-router-dom";
import { owners } from "./ownersData";

export default function OwnerDetails() {
  const { id } = useParams();
  const owner = owners.find(o => o.id === Number(id));

  if (!owner) return <p>Propriétaire introuvable</p>;

  return (
    <div className="page">
      <h2>Détails Propriétaire</h2>
      <p><b>Nom :</b> {owner.fullName}</p>
      <p><b>Téléphone :</b> {owner.phone}</p>
      <p><b>Email :</b> {owner.email}</p>
      <p><b>Adresse :</b> {owner.address}</p>
    </div>
  );
}
