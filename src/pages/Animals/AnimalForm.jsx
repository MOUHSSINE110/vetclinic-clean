export default function AnimalForm({
  owners,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editingId,
}) {
  return (
    <form onSubmit={onSubmit}>
      <h3>{editingId ? "Modifier un animal" : "Ajouter un animal"}</h3>

      <div>
        <strong>Nom :</strong>
        <input
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      <div>
        <strong>Espèce :</strong>
        <input
          name="species"
          value={formData.species}
          onChange={(e) =>
            setFormData({ ...formData, species: e.target.value })
          }
          required
        />
      </div>

      <div>
        <strong>Propriétaire :</strong>
        <select
          required
          value={formData.ownerId}
          onChange={(e) =>
            setFormData({ ...formData, ownerId: e.target.value })
          }
        >
          <option value="">-- Sélectionner --</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">
        {editingId ? "Mettre à jour" : "Ajouter"}
      </button>

      {editingId && (
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      )}
    </form>
  );
}
