import { useState } from "react";
import OwnersList from "./OwnersList";
import OwnerForm from "./OwnerForm";
import "./owners.css";

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);

  const addOwner = (owner) => {
    setOwners([...owners, owner]);
  };

  const deleteOwner = (id) => {
    setOwners(owners.filter(o => o.id !== id));
  };

  return (
    <div className="page">
      <h1>Gestion des propriétaires</h1>

      <div className="grid">
        <OwnerForm onAdd={addOwner} />
        <OwnersList owners={owners} onDelete={deleteOwner} />
      </div>
    </div>
  );
}
