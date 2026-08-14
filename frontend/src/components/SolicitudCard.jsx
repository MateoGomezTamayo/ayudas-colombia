import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'

export default function SolicitudCard({ solicitud: s }) {
  const fecha = s.created_at
    ? new Date(s.created_at).toLocaleDateString('es-CO')
    : null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {s.ciudad}
            {s.departamento ? `, ${s.departamento}` : ''}
          </h3>
          {fecha && <p className="text-xs text-gray-400 mt-0.5">{fecha}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <PriorityBadge prioridad={s.prioridad} />
          <StatusBadge estado={s.estado} />
        </div>
      </div>

      {/* Description */}
      {s.descripcion && (
        <p className="text-xs text-gray-600 line-clamp-2">{s.descripcion}</p>
      )}

      {/* Items */}
      {s.items?.length > 0 && (
        <div className="border-t border-gray-50 pt-2">
          <p className="text-xs font-medium text-gray-500 mb-1">Productos solicitados:</p>
          <ul className="space-y-0.5">
            {s.items.slice(0, 4).map((item, i) => (
              <li key={i} className="text-xs text-gray-700">
                • {item.producto} — {item.cantidad} {item.unidad}
              </li>
            ))}
            {s.items.length > 4 && (
              <li className="text-xs text-gray-400">+{s.items.length - 4} más...</li>
            )}
          </ul>
        </div>
      )}

      {/* Contact */}
      {(s.nombre_solicitante || s.contacto) && (
        <div className="border-t border-gray-50 pt-2 text-xs text-gray-500">
          {s.nombre_solicitante && (
            <span className="font-medium text-gray-700">{s.nombre_solicitante}</span>
          )}
          {s.contacto && <span> · {s.contacto}</span>}
        </div>
      )}
    </div>
  )
}
