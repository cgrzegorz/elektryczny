import { Badge } from './Badge'
import { GoldenRuleVisualization } from './GoldenRuleVisualization'
import { NOMINAL_CURRENTS } from '../constants/electricalData'
import { CABLE_CAPACITY_A1, type InstallationMethod, INSTALLATION_METHOD_LABELS, getCableCapacityByInstallation, getCableCapacityByInstallationDynamic } from '../constants/cableTables'
import { CHARACTERISTIC_LABELS, type ProtectionCharacteristic, type CableMaterial, type InsulationType } from '../types/circuit'
import { checkGoldenRule, checkOverloadProtectionFull } from '../logic/circuitValidation'

interface CalculationSectionProps {
  IB: number
  In: number
  Iz: number
  characteristic: ProtectionCharacteristic
  crossSection: number
  material: CableMaterial
  installationMethod: InstallationMethod
  ambientTemperature: number
  numberOfCircuitsInBundle: number
  insulationType: InsulationType
  onInChange: (value: number) => void
  onCharacteristicChange: (value: ProtectionCharacteristic) => void
  onCrossSectionChange: (value: number) => void
  onMaterialChange: (value: CableMaterial) => void
  onInstallationMethodChange: (value: InstallationMethod) => void
  onAmbientTemperatureChange: (value: number) => void
  onNumberOfCircuitsInBundleChange: (value: number) => void
  onInsulationTypeChange: (value: InsulationType) => void
}

export const CalculationSection = ({
  IB,
  In,
  Iz,
  characteristic,
  crossSection,
  material,
  installationMethod,
  ambientTemperature,
  numberOfCircuitsInBundle,
  insulationType,
  onInChange,
  onCharacteristicChange,
  onCrossSectionChange,
  onMaterialChange,
  onInstallationMethodChange,
  onAmbientTemperatureChange,
  onNumberOfCircuitsInBundleChange,
  onInsulationTypeChange
}: CalculationSectionProps) => {
  const isValid = checkGoldenRule(IB, In, Iz)
  const overloadCheck = checkOverloadProtectionFull(IB, In, Iz)

  // Obliczanie procenta wykorzystania
  const utilizationPercent = Iz > 0 ? (In / Iz) * 100 : 0
  const loadPercent = Iz > 0 ? (IB / Iz) * 100 : 0

  // Automatyczna obciążalność na podstawie sposobu ułożenia (bazowa Idd)
  const autoIz = getCableCapacityByInstallation(crossSection, installationMethod, material) || 0

  // Dynamiczna obciążalność z uwzględnieniem współczynników poprawkowych
  const dynamicIz = getCableCapacityByInstallationDynamic(
    crossSection,
    installationMethod,
    material,
    ambientTemperature,
    numberOfCircuitsInBundle,
    insulationType
  ) || 0

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

        {/* Wybór materiału */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materiał żyły
          </label>
          <select
            value={material}
            onChange={(e) => onMaterialChange(e.target.value as CableMaterial)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="copper">Miedź (Cu)</option>
            <option value="aluminum">Aluminium (Al)</option>
          </select>
        </div>

        {/* Wybór typu izolacji */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typ izolacji
          </label>
          <select
            value={insulationType}
            onChange={(e) => onInsulationTypeChange(e.target.value as InsulationType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PVC">PVC (do 70°C)</option>
            <option value="XLPE">XLPE/EPR (do 90°C)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Temperatura otoczenia */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperatura otoczenia [°C]
          </label>
          <input
            type="number"
            value={ambientTemperature}
            onChange={(e) => onAmbientTemperatureChange(Number(e.target.value))}
            min="10"
            max="80"
            step="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Standardowo: 30°C (bazowa)</p>
        </div>

        {/* Liczba obwodów w wiązce */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liczba obwodów w wiązce
          </label>
          <input
            type="number"
            value={numberOfCircuitsInBundle}
            onChange={(e) => onNumberOfCircuitsInBundleChange(Number(e.target.value))}
            min="1"
            max="20"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">1 = pojedynczy przewód</p>
        </div>
        {/* Sposób ułożenia */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sposób ułożenia przewodu
          </label>
          <select
            value={installationMethod}
            onChange={(e) => onInstallationMethodChange(e.target.value as InstallationMethod)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(INSTALLATION_METHOD_LABELS).map(([key, label]) => (
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
            {CABLE_CAPACITY_A1.map(cable => {
              const cableIz = getCableCapacityByInstallation(cable.crossSection, installationMethod, material) || 0
              return (
                <option key={cable.crossSection} value={cable.crossSection}>
                  {cable.crossSection} mm² (Iz = {cableIz > 0 ? `${cableIz}A` : '...'})
                </option>
              )
            })}
          </select>
        </div>
      </div>

      {/* Info o automatycznym Iz */}
      {autoIz > 0 && crossSection > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-blue-800 mb-2">
            <strong>💡 Automatyczny dobór Iz:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-700">Idd (bazowe):</span>
              <span className="font-semibold ml-2">{autoIz} A</span>
              <p className="text-xs text-gray-600 mt-1">
                Przekrój {crossSection} mm² ({material === 'copper' ? 'Cu' : 'Al'}), sposób ułożenia {installationMethod}
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <span className="text-gray-700">Iz (skorygowane):</span>
              <span className="font-bold text-blue-600 ml-2 text-lg">{dynamicIz} A</span>
              <p className="text-xs text-gray-600 mt-1">
                T = {ambientTemperature}°C, Obwodów = {numberOfCircuitsInBundle}, Izolacja = {insulationType}
              </p>
              {dynamicIz !== autoIz && (
                <p className="text-xs text-blue-700 mt-1">
                  Współczynnik redukcji: {((dynamicIz / autoIz) * 100).toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Warunek złotej zasady */}
      <div className={`p-4 rounded-lg border-2 ${
        IB === 0 
          ? 'bg-gray-50 border-gray-300' 
          : isValid 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
      }`}>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          {IB === 0 ? '⏳' : isValid ? '✅' : '❌'} Weryfikacja: I<sub>B</sub> ≤ I<sub>n</sub> ≤ I<sub>z</sub>
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-sm text-gray-600">IB (Obciążenie)</div>
            <div className={`text-2xl font-bold ${IB === 0 ? 'text-gray-400' : 'text-blue-600'}`}>
              {IB.toFixed(1)} A
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">In (Zabezpieczenie)</div>
            <div className={`text-2xl font-bold ${IB === 0 ? 'text-gray-400' : 'text-orange-600'}`}>
              {In} A
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Iz (Przewód)</div>
            <div className={`text-2xl font-bold ${IB === 0 ? 'text-gray-400' : 'text-green-600'}`}>
              {Iz} A
            </div>
          </div>
        </div>

        {IB === 0 && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">
              ℹ️ Wprowadź prąd obciążenia (IB) lub moc odbiornika w Sekcji 1, aby sprawdzić warunek.
            </p>
          </div>
        )}

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

        {/* Wizualizacja na osi liczbowej */}
        <GoldenRuleVisualization
          IB={IB}
          In={In}
          Iz={Iz}
          isValid={isValid}
        />
      </div>

      {/* Weryfikacja warunku przeciążeniowego (Zasada 1.45) */}
      {IB > 0 && In > 0 && Iz > 0 && (
        <div className={`mt-4 p-4 rounded-lg border-2 ${
          overloadCheck.isValid ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'
        }`}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            {overloadCheck.isValid ? '✅' : '⚠️'} Weryfikacja przeciążeniowa (Zasada 1.45)
          </h3>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600">Warunek 1: IB ≤ In</div>
                <div className={`font-semibold ${overloadCheck.condition1 ? 'text-green-600' : 'text-red-600'}`}>
                  {overloadCheck.condition1 ? '✅' : '❌'} {IB.toFixed(1)}A ≤ {In}A
                </div>
              </div>
              <div>
                <div className="text-gray-600">Warunek 2: I₂ ≤ 1.45 × Iz</div>
                <div className={`font-semibold ${overloadCheck.condition2 ? 'text-green-600' : 'text-red-600'}`}>
                  {overloadCheck.condition2 ? '✅' : '❌'} {overloadCheck.I2.toFixed(1)}A ≤ {(1.45 * Iz).toFixed(1)}A
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded">
              <p className="text-xs text-blue-800">
                <strong>ℹ️ Wyjaśnienie:</strong> I₂ = 1.45 × In = {overloadCheck.I2.toFixed(1)}A to prąd próbny zadziałania zabezpieczenia w czasie umownym.
                Warunek I₂ ≤ 1.45 × Iz zapewnia, że zabezpieczenie chroni przewód przed skutkami przeciążeń.
              </p>
            </div>

            {!overloadCheck.isValid && (
              <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Uwaga:</strong> Zabezpieczenie może nie chronić przewodu przed skutkami przeciążeń o małej wartości!
                  <br/>
                  <strong>Sugestie:</strong> Zwiększ przekrój przewodu lub zmniejsz prąd znamionowy zabezpieczenia.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

