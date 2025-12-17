import { Badge } from './Badge'
import { NOMINAL_CURRENTS } from '../constants/electricalData'
import { CABLE_CAPACITY_A1 } from '../constants/cableTables'
import { CHARACTERISTIC_LABELS, type ProtectionCharacteristic } from '../types/circuit'
import { checkGoldenRule } from '../logic/circuitValidation'

interface CalculationSectionProps {
  IB: number
  In: number
  Iz: number
  characteristic: ProtectionCharacteristic
  crossSection: number
  onInChange: (value: number) => void
  onCharacteristicChange: (value: ProtectionCharacteristic) => void
  onCrossSectionChange: (value: number) => void
}

export const CalculationSection = ({
  IB,
  In,
  Iz,
  characteristic,
  crossSection,
  onInChange,
  onCharacteristicChange,
  onCrossSectionChange
}: CalculationSectionProps) => {
  const isValid = checkGoldenRule(IB, In, Iz)

  // Obliczanie procenta wykorzystania
  const utilizationPercent = Iz > 0 ? (In / Iz) * 100 : 0
  const loadPercent = Iz > 0 ? (IB / Iz) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">⚡</span>
        2. Obliczenia i weryfikacja (Złota zasada)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Wybór zabezpieczenia In */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prąd znamionowy zabezpieczenia In
          </label>
          <select
            value={In}
            onChange={(e) => onInChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>Wybierz...</option>
            {NOMINAL_CURRENTS.map(current => (
              <option key={current} value={current}>
                {current} A
              </option>
            ))}
          </select>
        </div>

        {/* Wybór charakterystyki */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Charakterystyka
          </label>
          <select
            value={characteristic}
            onChange={(e) => onCharacteristicChange(e.target.value as ProtectionCharacteristic)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(CHARACTERISTIC_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Wybór przekroju */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Przekrój przewodu
          </label>
          <select
            value={crossSection}
            onChange={(e) => onCrossSectionChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>Wybierz...</option>
            {CABLE_CAPACITY_A1.map(cable => (
              <option key={cable.crossSection} value={cable.crossSection}>
                {cable.crossSection} mm² (Iz = {cable.copperIz}A)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Warunek złotej zasady */}
      <div className={`p-4 rounded-lg border-2 ${isValid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          {isValid ? '✅' : '❌'} Złota zasada: IB ≤ In ≤ Iz
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-sm text-gray-600">IB (Obciążenie)</div>
            <div className="text-2xl font-bold text-blue-600">{IB.toFixed(1)} A</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">In (Zabezpieczenie)</div>
            <div className="text-2xl font-bold text-orange-600">{In} A</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Iz (Przewód)</div>
            <div className="text-2xl font-bold text-green-600">{Iz} A</div>
          </div>
        </div>

        {/* Pasek postępu */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Wykorzystanie przewodu względem Iz:</div>
          <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
            {/* Pasek IB */}
            <div
              className="absolute h-full bg-blue-500 opacity-50"
              style={{ width: `${Math.min(loadPercent, 100)}%` }}
            />
            {/* Pasek In */}
            <div
              className="absolute h-full bg-orange-500 opacity-70"
              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
            {/* Etykiety */}
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">
              {utilizationPercent > 0 && `${utilizationPercent.toFixed(0)}%`}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {!isValid && (
          <div className="mt-4 text-sm text-red-800">
            <strong>⚠️ Ostrzeżenie:</strong><br/>
            {In > Iz && 'Prąd znamionowy zabezpieczenia In przekracza obciążalność przewodu Iz!'}
            {IB > In && ' Prąd obciążenia IB przekracza prąd zabezpieczenia In!'}
          </div>
        )}

        {isValid && (
          <div className="mt-4 flex gap-2">
            <Badge variant="success">Warunek spełniony</Badge>
            <Badge variant="info">Zapas: {((Iz - In) / Iz * 100).toFixed(1)}%</Badge>
          </div>
        )}
      </div>
    </div>
  )
}

