import { Input } from './Input'
import { Badge } from './Badge'
import { TRIP_MULTIPLIERS } from '../constants/electricalData'
import { checkShortCircuitProtection, calculateMaxZs, calculateTripCurrent } from '../logic/circuitValidation'
import type { ProtectionCharacteristic } from '../types/circuit'

interface SafetySectionProps {
  In: number
  characteristic: ProtectionCharacteristic
  Zs: string
  onZsChange: (value: string) => void
}

export const SafetySection = ({
  In,
  characteristic,
  Zs,
  onZsChange
}: SafetySectionProps) => {
  const U0 = 230 // Napięcie fazowe [V]
  const multiplier = TRIP_MULTIPLIERS[characteristic]
  const Ia = calculateTripCurrent(In, multiplier)
  const maxZs = In > 0 ? calculateMaxZs(U0, Ia) : 0
  const ZsValue = parseFloat(Zs) || 0
  const isValid = ZsValue > 0 && In > 0 ? checkShortCircuitProtection(ZsValue, U0, Ia) : null

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">🔒</span>
        3. Bezpieczeństwo (SWZ i Termika)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Impedancja pętli zwarcia Zs"
          value={Zs}
          onChange={onZsChange}
          type="number"
          unit="Ω"
          placeholder="Wprowadź Zs"
        />

        <div className="flex flex-col justify-end pb-4">
          <div className="text-sm text-gray-600">Prąd wyzwalający Ia:</div>
          <div className="text-2xl font-bold text-purple-600">
            {Ia.toFixed(1)} A
          </div>
          <div className="text-xs text-gray-500">
            ({characteristic} × {In}A = {multiplier} × {In}A)
          </div>
        </div>
      </div>

      {/* Warunek SWZ */}
      {In > 0 && (
        <div className={`p-4 rounded-lg border-2 ${
          isValid === null ? 'bg-gray-50 border-gray-300' :
          isValid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        }`}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            {isValid === null ? '⏳' : isValid ? '✅' : '❌'}
            Warunek skuteczności wyłączenia zwarcia: Zs ≤ U₀/Ia
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Zmierzona Zs:</div>
              <div className="text-xl font-bold text-blue-600">
                {ZsValue > 0 ? `${ZsValue.toFixed(3)} Ω` : '- Ω'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Maksymalna Zs:</div>
              <div className="text-xl font-bold text-green-600">
                {maxZs.toFixed(3)} Ω
              </div>
            </div>
          </div>

          {/* Pasek wizualizacji */}
          {ZsValue > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Porównanie Zs:</div>
              <div className="w-full bg-gray-200 rounded-full h-6 relative">
                <div
                  className={`h-full rounded-full transition-all ${
                    isValid ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((ZsValue / maxZs) * 100, 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">
                  {((ZsValue / maxZs) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          )}

          {isValid === false && (
            <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
              <p className="text-sm text-red-800">
                <strong>⚠️ Warunek niespełniony!</strong><br/>
                Zs = {ZsValue.toFixed(3)} Ω &gt; {maxZs.toFixed(3)} Ω<br/>
                <strong>Sugestie:</strong>
              </p>
              <ul className="list-disc list-inside text-xs text-red-700 mt-2 space-y-1">
                <li>Zwiększ przekrój przewodu (mniejsza rezystancja)</li>
                <li>Zmień charakterystykę z C na B (mniejszy Ia = większy dozwolony Zs)</li>
                <li>Sprawdź połączenie ochronne PE</li>
                <li>Rozważ zastosowanie wyłącznika różnicowoprądowego</li>
              </ul>
            </div>
          )}

          {isValid === true && (
            <div className="mt-4 flex gap-2">
              <Badge variant="success">Warunek SWZ spełniony</Badge>
              <Badge variant="info">
                Zapas: {((1 - ZsValue / maxZs) * 100).toFixed(1)}%
              </Badge>
            </div>
          )}
        </div>
      )}

      {In === 0 && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
          <p className="text-sm text-yellow-800">
            ℹ️ Wybierz zabezpieczenie In w sekcji 2, aby przeprowadzić weryfikację SWZ
          </p>
        </div>
      )}
    </div>
  )
}

