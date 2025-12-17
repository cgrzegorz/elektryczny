import React from 'react'
import { Input } from './Input'
import { Badge } from './Badge'
import { TRIP_MULTIPLIERS } from '../constants/electricalData'
import {
  checkShortCircuitProtection,
  calculateMaxZs,
  calculateTripCurrent,
  calculateShortCircuitCurrent,
  estimateDisconnectionTime,
  checkThermalWithstand
} from '../logic/circuitValidation'
import { RESISTIVITY } from '../constants/coefficients'
import type { ProtectionCharacteristic, CableMaterial } from '../types/circuit'

interface SafetySectionProps {
  In: number
  characteristic: ProtectionCharacteristic
  Zs: string
  ZsSource: string // Impedancja źródła (z warunków przyłączenia)
  length: number // Długość przewodu [m]
  crossSection: number // Przekrój przewodu [mm²]
  material: CableMaterial // Materiał przewodu
  onZsChange: (value: string) => void
  onZsSourceChange: (value: string) => void
  onZsCalculatedChange?: (value: number) => void // Callback dla obliczonej Zs
}

export const SafetySection = ({
  In,
  characteristic,
  Zs,
  ZsSource,
  length,
  crossSection,
  material,
  onZsChange,
  onZsSourceChange,
  onZsCalculatedChange
}: SafetySectionProps) => {
  const U0 = 230 // Napięcie fazowe [V]
  const multiplier = TRIP_MULTIPLIERS[characteristic]
  const Ia = calculateTripCurrent(In, multiplier)
  const maxZs = In > 0 ? calculateMaxZs(U0, Ia) : 0

  // Obliczeniowa Zs - suma impedancji źródła i rezystancji kabla
  const ZsSourceValue = parseFloat(ZsSource) || 0
  const resistivity = material === 'copper' ? RESISTIVITY.copper : RESISTIVITY.aluminum
  const cableResistance = crossSection > 0 && length > 0
    ? (2 * resistivity * length) / crossSection // Ω (tam i z powrotem)
    : 0
  const ZsCalculated = ZsSourceValue + cableResistance

  // Przekaż obliczoną Zs do rodzica
  React.useEffect(() => {
    if (onZsCalculatedChange && ZsCalculated > 0) {
      onZsCalculatedChange(ZsCalculated)
    }
  }, [ZsCalculated, onZsCalculatedChange])

  const ZsMeasured = parseFloat(Zs) || 0

  const ZsToCheck = ZsMeasured > 0 ? ZsMeasured : ZsCalculated
  const isValid = ZsToCheck > 0 && In > 0 ? checkShortCircuitProtection(ZsToCheck, U0, Ia) : null

  // Obliczenia termiki zwarciowej
  const Isc = ZsToCheck > 0 ? calculateShortCircuitCurrent(ZsToCheck, U0) : 0
  const disconnectionTime = Isc > 0 ? estimateDisconnectionTime(Isc, In, characteristic) : 0
  const k = material === 'copper' ? 115 : 76 // k dla Cu PVC lub Al PVC
  const thermalCheck = Isc > 0 && disconnectionTime > 0 && crossSection > 0
    ? checkThermalWithstand(Isc, disconnectionTime, crossSection, k)
    : null

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">🔒</span>
        3. Bezpieczeństwo (SWZ i Termika)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Impedancja źródła (złącze) */}
        <Input
          label="Impedancja źródła Zs(źródło)"
          value={ZsSource}
          onChange={onZsSourceChange}
          type="number"
          unit="Ω"
          placeholder="Z warunków przyłączenia"
        />

        {/* Zmierzona Zs (opcjonalnie) */}
        <Input
          label="Zmierzona Zs (opcjonalnie)"
          value={Zs}
          onChange={onZsChange}
          type="number"
          unit="Ω"
          placeholder="Po budowie"
        />

        {/* Prąd wyzwalający */}
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

      {/* Obliczeniowa Zs projektowana */}
      {ZsSourceValue > 0 && crossSection > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">📐 Zs Projektowana (obliczeniowa):</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div>• Impedancja źródła: <strong>{ZsSourceValue.toFixed(3)} Ω</strong></div>
            <div>• Rezystancja kabla ({crossSection}mm², {length}m): <strong>{cableResistance.toFixed(3)} Ω</strong></div>
            <div className="pt-2 border-t border-blue-300">
              <strong>Zs całkowita projektowana = {ZsCalculated.toFixed(3)} Ω</strong>
            </div>
          </div>
        </div>
      )}

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
              <div className="text-sm text-gray-600">
                {ZsMeasured > 0 ? 'Zmierzona Zs:' : 'Zs Projektowana:'}
              </div>
              <div className="text-xl font-bold text-blue-600">
                {ZsToCheck > 0 ? `${ZsToCheck.toFixed(3)} Ω` : '- Ω'}
              </div>
              {ZsMeasured === 0 && ZsCalculated > 0 && (
                <div className="text-xs text-blue-500 mt-1">
                  (obliczeniowa)
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-600">Maksymalna Zs:</div>
              <div className="text-xl font-bold text-green-600">
                {maxZs.toFixed(3)} Ω
              </div>
            </div>
          </div>

          {/* Pasek wizualizacji */}
          {ZsToCheck > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Porównanie Zs:</div>
              <div className="w-full bg-gray-200 rounded-full h-6 relative">
                <div
                  className={`h-full rounded-full transition-all ${
                    isValid ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((ZsToCheck / maxZs) * 100, 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">
                  {((ZsToCheck / maxZs) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          )}

          {isValid === false && (
            <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
              <p className="text-sm text-red-800">
                <strong>⚠️ Warunek niespełniony!</strong><br/>
                Zs = {ZsToCheck.toFixed(3)} Ω &gt; {maxZs.toFixed(3)} Ω<br/>
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
                Zapas: {((1 - ZsToCheck / maxZs) * 100).toFixed(1)}%
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

      {/* Sekcja weryfikacji termicznej */}
      {thermalCheck && Isc > 0 && (
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          thermalCheck.isValid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        }`}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            {thermalCheck.isValid ? '✅' : '❌'} Weryfikacja termiczna zwarcia
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Prąd zwarcia Isc:</div>
              <div className="text-lg font-bold text-red-600">
                {Isc.toFixed(0)} A
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Czas wyłączenia t:</div>
              <div className="text-lg font-bold text-orange-600">
                {disconnectionTime >= 1 ? `${disconnectionTime.toFixed(1)}s` : `${(disconnectionTime * 1000).toFixed(0)}ms`}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Przekrój S:</div>
              <div className="text-lg font-bold text-blue-600">
                {crossSection} mm²
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Współczynnik k:</div>
              <div className="text-lg font-bold text-purple-600">
                {k}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className={`p-3 rounded ${thermalCheck.isValid ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-semibold mb-1">
                Warunek: t ≤ (k² × S²) / I²
              </div>
              <div>
                {disconnectionTime.toFixed(3)}s {thermalCheck.isValid ? '≤' : '>'} {thermalCheck.maxTime.toFixed(3)}s
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded">
              <div className="text-xs text-blue-800">
                <strong>📐 Alternatywnie:</strong> Minimalny przekrój: S_min = (I × √t) / k =
                <strong> {thermalCheck.minCrossSection.toFixed(2)} mm²</strong>
                <br/>
                {crossSection >= thermalCheck.minCrossSection
                  ? `✅ Wybrany przekrój ${crossSection} mm² jest wystarczający`
                  : `❌ Wymagany przekrój minimum ${Math.ceil(thermalCheck.minCrossSection)} mm²`
                }
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-700">
                <strong>ℹ️ Energia przepuszczana:</strong> I²t = {thermalCheck.energyLetThrough.toFixed(0)} A²s
              </div>
            </div>

            {!thermalCheck.isValid && (
              <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Przewód nie wytrzyma energii zwarcia!</strong><br/>
                  <strong>Rozwiązania:</strong>
                </p>
                <ul className="list-disc list-inside text-xs text-red-700 mt-2 space-y-1">
                  <li>Zwiększ przekrój przewodu do minimum {Math.ceil(thermalCheck.minCrossSection)} mm²</li>
                  <li>Zmniejsz impedancję pętli zwarcia (lepsze połączenia, krótsze trasy)</li>
                  <li>Zastosuj szybsze zabezpieczenie (np. zmień C na B jeśli możliwe)</li>
                </ul>
              </div>
            )}

            {thermalCheck.isValid && (
              <div className="mt-3 p-3 bg-green-100 rounded">
                <p className="text-sm text-green-800">
                  ✅ Przewód wytrzyma energię zwarcia zanim zabezpieczenie zadziała!
                  <br/>
                  <span className="text-xs">
                    Zapas bezpieczeństwa: {((crossSection / thermalCheck.minCrossSection - 1) * 100).toFixed(0)}%
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

