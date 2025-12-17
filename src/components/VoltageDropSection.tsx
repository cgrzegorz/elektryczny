import { Input } from './Input'
import { Badge } from './Badge'
import { VOLTAGE_DROP_LIMITS } from '../constants/electricalData'
import type { CircuitType } from '../types/circuit'

interface VoltageDropSectionProps {
  length: string
  voltageDrop: number
  type: CircuitType
  onLengthChange: (value: string) => void
}

export const VoltageDropSection = ({
  length,
  voltageDrop,
  type,
  onLengthChange
}: VoltageDropSectionProps) => {
  const lengthValue = parseFloat(length) || 0
  const limit = VOLTAGE_DROP_LIMITS[type] * 100 // konwersja do %
  const hasData = lengthValue > 0 && voltageDrop > 0
  const isValid = hasData && voltageDrop <= limit

  // Sprawdź co brakuje
  const missingOtherData = lengthValue > 0 && voltageDrop === 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">📏</span>
        2b. Spadek napięcia
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Długość przewodu"
          value={length}
          onChange={onLengthChange}
          type="number"
          unit="m"
          placeholder="Wprowadź długość"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dopuszczalny spadek
          </label>
          <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700 font-mono">
            {limit.toFixed(1)}%
            <span className="text-xs ml-2 text-gray-500">
              ({type === 'lighting' ? 'oświetlenie' : type === 'sockets' ? 'gniazda' : 'inne'})
            </span>
          </div>
        </div>
      </div>

      {hasData && (
        <div className={`p-4 rounded-lg border-2 ${isValid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            {isValid ? '✅' : '❌'} Wynik obliczeń
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Obliczony spadek napięcia:</span>
              <Badge variant={isValid ? 'success' : 'error'}>
                ΔU = {voltageDrop.toFixed(2)}%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Dopuszczalny limit:</span>
              <Badge variant="info">
                {limit.toFixed(1)}%
              </Badge>
            </div>

            <div className="mt-4">
              <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${isValid ? 'bg-green-500' : 'bg-red-500'} transition-all duration-300`}
                  style={{ width: `${Math.min((voltageDrop / limit) * 100, 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                  {voltageDrop.toFixed(2)}% / {limit.toFixed(1)}%
                </div>
              </div>
            </div>

            {!isValid && (
              <div className="mt-3 p-3 bg-red-100 rounded">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Uwaga:</strong> Spadek napięcia przekracza dopuszczalną wartość!
                  <br/>
                  <strong>Rozwiązania:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    <li>Zwiększ przekrój przewodu</li>
                    <li>Skróć trasę przewodu (jeśli możliwe)</li>
                    <li>Zmniejsz obciążenie obwodu</li>
                  </ul>
                </p>
              </div>
            )}

            {isValid && (
              <div className="mt-3 p-3 bg-green-100 rounded">
                <p className="text-sm text-green-800">
                  ✅ Spadek napięcia mieści się w normie!
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-xs text-blue-800">
              💡 <strong>Wzór:</strong> ΔU% = (2 × IB × ρ × L) / (S × U₀) × 100%
              <br/>
              gdzie: ρ = 0.0175 Ω·mm²/m (miedź), L = {lengthValue}m, S = {lengthValue > 0 ? 'przekrój przewodu' : '...'}
            </p>
          </div>
        </div>
      )}

      {!hasData && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
          <p className="text-gray-600 text-sm mb-2">
            <strong>ℹ️ Aby obliczyć spadek napięcia, wypełnij:</strong>
          </p>
          <ul className="list-none space-y-1 text-sm text-gray-600">
            <li className={lengthValue > 0 ? 'text-green-600' : 'text-red-600'}>
              {lengthValue > 0 ? '✅' : '❌'} Długość przewodu: {lengthValue > 0 ? `${lengthValue}m` : 'brak'}
            </li>
            <li className={voltageDrop > 0 ? 'text-green-600' : 'text-gray-600'}>
              {voltageDrop > 0 ? '✅' : '⚠️'} Dane z sekcji 1 i 2:
              {missingOtherData && ' (wprowadź prąd IB i wybierz przekrój przewodu)'}
            </li>
          </ul>
          {missingOtherData && (
            <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-xs text-yellow-800">
                💡 Długość została wprowadzona, ale brakuje danych z sekcji wyżej (IB lub przekrój przewodu)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

