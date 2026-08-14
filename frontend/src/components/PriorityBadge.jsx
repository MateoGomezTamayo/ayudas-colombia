const classes = {
  alta: 'bg-red-100 text-red-800',
  media: 'bg-orange-100 text-orange-800',
  baja: 'bg-green-100 text-green-800',
}

const labels = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export default function PriorityBadge({ prioridad }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        classes[prioridad] ?? 'bg-gray-100 text-gray-800'
      }`}
    >
      {labels[prioridad] ?? prioridad}
    </span>
  )
}
