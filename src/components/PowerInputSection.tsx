import { Input } from './Input'
import { CIRCUIT_TYPE_LABELS, CIRCUIT_SUGGESTIONS, PHASE_TYPE_LABELS } from '../types/circuit'
import type { CircuitType, PhaseType, InputMode } from '../types/circuit'
import { calculateCurrentSinglePhase, calculateCurrentThreePhase } from '../logic/calculations'
import { POWER_FACTOR_PRESETS, POWER_FACTOR_LABELS } from '../constants/electricalData'

interface PowerInputSectionProps {
  name: string
  type: CircuitType
  inputMode: InputMode
  phaseType: PhaseType
  powerKW: string
  currentA: string
  powerFactor: string
  onNameChange: (value: string) => void
  onTypeChange: (value: CircuitType) => void
  onInputModeChange: (value: InputMode) => void
  onPhaseTypeChange: (value: PhaseType) => void
  onPowerKWChange: (value: string) => void
  onCurrentAChange: (value: string) => void
  onPowerFactorChange: (value: string) => void
}

export const PowerInputSection = ({
  name,
  type,
  inputMode,
  phaseType,
  powerKW,
  currentA,
  powerFactor,
  onNameChange,
  onTypeChange,
  onInputModeChange,
  onPhaseTypeChange,
  onPowerKWChange,
  onCurrentAChange,
  onPowerFactorChange
}: PowerInputSectionProps) => {
  const suggestion = CIRCUIT_SUGGESTIONS[type]

  // Oblicz IB automatycznie gdy wprowadzono moc
  const calculatedIB = inputMode === 'power' && powerKW
    ? phaseType === 'single'
      ? calculateCurrentSinglePhase(parseFloat(powerKW), 230, parseFloat(powerFactor) || 1.0)
      : calculateCurrentThreePhase(parseFloat(powerKW), 400, parseFloat(powerFactor) || 0.93)
    : 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">📝</span>
        1. Dane obwodu
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEWA KOLUMNA - Podstawowe dane */}
        <div className="space-y-4">
          <Input
            label="Nazwa obwodu"
            value={name}
            onChange={onNameChange}
            type="text"
            placeholder="np. Pompa ciepła"
          />

          <div>
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

          {/* Przełącznik faz */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typ zasilania
            </label>
            <div className="flex gap-3">
              {Object.entries(PHASE_TYPE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => onPhaseTypeChange(key as PhaseType)}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                    phaseType === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA - Moc lub Prąd */}
        <div className="space-y-4">
          {/* Przełącznik trybu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wprowadź dane jako:
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => onInputModeChange('power')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                  inputMode === 'power'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚡ Moc [kW]
              </button>
              <button
                onClick={() => onInputModeChange('current')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                  inputMode === 'current'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔌 Prąd [A]
              </button>
            </div>
          </div>

          {/* Pole mocy lub prądu */}
          {inputMode === 'power' ? (
            <>
              <Input
                label="Moc odbiornika"
                value={powerKW}
                onChange={onPowerKWChange}
                type="number"
                unit="kW"
                placeholder="Wprowadź moc"
              />

              {/* Dropdown z presetami cosφ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Współczynnik mocy (cosφ) - preset
                </label>
                <select
                  onChange={(e) => {
                    const preset = e.target.value as keyof typeof POWER_FACTOR_PRESETS
                    if (preset && preset !== 'custom') {
                      onPowerFactorChange(POWER_FACTOR_PRESETS[preset].toString())
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="custom">Własna wartość...</option>
                  {Object.entries(POWER_FACTOR_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input manualny dla cosφ */}
              <Input
                label="Współczynnik mocy (cosφ) - wartość"
                value={powerFactor}
                onChange={onPowerFactorChange}
                type="number"
                unit=""
                placeholder={phaseType === 'single' ? '1.0' : '0.93'}
              />

              {/* Walidacja cosφ */}
              {powerFactor && (parseFloat(powerFactor) <= 0 || parseFloat(powerFactor) > 1.0) && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-sm font-medium text-red-800">
                    ⚠️ Nieprawidłowa wartość cosφ!
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Współczynnik mocy musi być w zakresie (0, 1]
                  </p>
                </div>
              )}

              {calculatedIB > 0 && (
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-sm font-medium text-green-800">
                    💡 Obliczony prąd I<sub>B</sub> = <strong>{calculatedIB.toFixed(2)} A</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {phaseType === 'single'
                      ? `I_B = (${powerKW} × 1000) / (230 × ${powerFactor || 1.0})`
                      : `I_B = (${powerKW} × 1000) / (√3 × 400 × ${powerFactor || 0.93})`
                    }
                  </p>
                </div>
              )}
            </>
          ) : (
            <Input
              label="Prąd obliczeniowy IB"
              value={currentA}
              onChange={onCurrentAChange}
              type="number"
              unit="A"
              placeholder="Wprowadź prąd"
            />
          )}
        </div>
      </div>

      {/* Sugestia */}
      {suggestion && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            <strong>💡 Sugestia dla {CIRCUIT_TYPE_LABELS[type]}:</strong><br/>
            Przewód: <strong>{suggestion.crossSection} mm²</strong> |
            Zabezpieczenie: <strong>{suggestion.characteristic}{suggestion.In}</strong><br/>
            <span className="text-xs text-blue-600">{suggestion.reason}</span>
          </p>
        </div>
      )}
    </div>
  )
}

