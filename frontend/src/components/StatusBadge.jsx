const classes = {
  pendiente: 'bg-gray-100 text-gray-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  cubierto: 'bg-green-100 text-green-800',
}

const labels = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  cubierto: 'Cubierto',
}

export default function StatusBadge({ estado }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        classes[estado] ?? 'bg-gray-100 text-gray-800'
      }`}
    >
      {labels[estado] ?? estado}
    </span>
  )
}
