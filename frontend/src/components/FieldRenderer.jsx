export default function FieldRenderer({ field, value, onChange }) {
  const commonProps = {
    id: `campo-${field.id_campo}`,
    name: field.nombre_campo,
    required: Boolean(field.obligatorio)
  };

  return (
    <div className="form-group">
      <label htmlFor={commonProps.id}>{field.etiqueta}</label>

      {field.tipo_campo === 'texto' && (
        <input
          {...commonProps}
          type="text"
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}

      {field.tipo_campo === 'correo' && (
        <input
          {...commonProps}
          type="email"
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}

      {field.tipo_campo === 'numero' && (
        <input
          {...commonProps}
          type="number"
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}

      {field.tipo_campo === 'fecha' && (
        <input
          {...commonProps}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}

      {field.tipo_campo === 'textarea' && (
        <textarea
          {...commonProps}
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}

      {field.tipo_campo === 'archivo' && (
        <input
          {...commonProps}
          type="file"
          onChange={(e) => onChange(field, e.target.files?.[0] || null)}
        />
      )}
    </div>
  );
}
