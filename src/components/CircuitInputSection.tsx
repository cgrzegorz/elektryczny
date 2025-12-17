import { Input } from './Input'
import { CIRCUIT_TYPE_LABELS, CIRCUIT_SUGGESTIONS, type CircuitType } from '../types/circuit'

interface CircuitInputSectionProps {
  name: string
  type: CircuitType
  IB: string
  onNameChange: (value: string) => void
  onTypeChange: (value: CircuitType) => void
  onIBChange: (value: string) => void
}

export const CircuitInputSection = ({
  name,
  type,
  IB,
  onNameChange,
  onTypeChange,
  onIBChange
}: CircuitInputSectionProps) => {
  const suggestion = CIRCUIT_SUGGESTIONS[type]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">📝</span>
        1. Dane obwodu
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Nazwa obwodu"
          value={name}
          onChange={onNameChange}
          type="text"
          placeholder="np. Salon - oświetlenie"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typ obwodu
          </label>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as CircuitType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(CIRCUIT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Prąd obliczeniowy IB"
          value={IB}
          onChange={onIBChange}
          type="number"
          unit="A"
          placeholder="Wprowadź prąd"
        />
      </div>

      {suggestion && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            <strong>💡 Sugestia dla {CIRCUIT_TYPE_LABELS[type]}:</strong><br/>
            Przewód: <strong>{suggestion.crossSection} mm²</strong> |
            Zabezpieczenie: <strong>B{suggestion.In}</strong><br/>
            <span className="text-xs text-blue-600">{suggestion.reason}</span>
          </p>
        </div>
      )}
    </div>
  )
}

