// Podstawowy komponent Input
interface InputProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'number'
  unit?: string
  placeholder?: string
}

export const Input = ({ label, value, onChange, type = 'text', unit, placeholder }: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {unit && <span className="text-sm text-gray-600">{unit}</span>}
      </div>
    </div>
  )
}

