import { useState } from 'react'
import { PowerInputSection } from '../components/PowerInputSection'
import { CalculationSection } from '../components/CalculationSection'
import { VoltageDropSection } from '../components/VoltageDropSection'
import { SafetySection } from '../components/SafetySection'
import { ReportSection } from '../components/ReportSection'
import { getCableCapacityByInstallation, getCableCapacityByInstallationDynamic } from '../constants/cableTables'
import { checkGoldenRule, checkShortCircuitProtection, calculateTripCurrent, checkOverloadProtectionFull } from '../logic/circuitValidation'
import { calculateVoltageDropPercentSinglePhaseByConductivity, calculateVoltageDropPercentThreePhaseByConductivity, calculateCurrentSinglePhase, calculateCurrentThreePhase } from '../logic/calculations'
import { TRIP_MULTIPLIERS, CONDUCTIVITY_70C } from '../constants/electricalData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Circuit, CircuitType, ProtectionCharacteristic, PhaseType, InputMode, CableMaterial, InstallationMethod, InsulationType } from '../types/circuit'

export const Home = () => {
  // Dane obwodu (Sekcja 1)
  const [name, setName] = useState('')
  const [type, setType] = useState<CircuitType>('sockets')
  const [inputMode, setInputMode] = useState<InputMode>('current')
  const [phaseType, setPhaseType] = useState<PhaseType>('single')
  const [powerKW, setPowerKW] = useState('')
  const [currentA, setCurrentA] = useState('')
  const [powerFactor, setPowerFactor] = useState('')

  // Obliczenia (Sekcja 2)
  const [In, setIn] = useState(16)
  const [characteristic, setCharacteristic] = useState<ProtectionCharacteristic>('B')
  const [crossSection, setCrossSection] = useState(2.5)
  const [material, setMaterial] = useState<CableMaterial>('copper')
  const [installationMethod, setInstallationMethod] = useState<InstallationMethod>('C')
  const [ambientTemperature, setAmbientTemperature] = useState(30) // temperatura bazowa
  const [numberOfCircuitsInBundle, setNumberOfCircuitsInBundle] = useState(1) // pojedynczy obwód
  const [insulationType, setInsulationType] = useState<InsulationType>('PVC') // domyślnie PVC

  // Spadek napięcia (Sekcja 2b)
  const [length, setLength] = useState('')

  // Bezpieczeństwo (Sekcja 3)
  const [Zs, setZs] = useState('')
  const [ZsSource, setZsSource] = useState('') // Impedancja źródła (złącze)
  const [ZsCalculated, setZsCalculated] = useState(0) // Obliczona Zs projektowana

  // Lista obwodów (Sekcja 4) - zapisywana w localStorage
  const [circuits, setCircuits] = useLocalStorage<Circuit[]>('elektryczny-circuits', [])

  // Obliczenia pomocnicze - IB zależy od trybu wprowadzania
  const IBValue = inputMode === 'current'
    ? parseFloat(currentA) || 0
    : inputMode === 'power' && powerKW
      ? phaseType === 'single'
        ? calculateCurrentSinglePhase(parseFloat(powerKW), 230, parseFloat(powerFactor) || 1.0)
        : calculateCurrentThreePhase(parseFloat(powerKW), 400, parseFloat(powerFactor) || 0.93)
      : 0

  // Automatyczny dobór Iz na podstawie sposobu ułożenia Z UWZGLĘDNIENIEM współczynników poprawkowych
  const Iz = getCableCapacityByInstallationDynamic(
    crossSection,
    installationMethod,
    material,
    ambientTemperature,
    numberOfCircuitsInBundle,
    insulationType
  ) || 0

  const lengthValue = parseFloat(length) || 0
  const ZsValue = parseFloat(Zs) || 0

  // Użyj zmierzonej Zs jeśli jest dostępna, w przeciwnym razie obliczonej
  const ZsToUse = ZsValue > 0 ? ZsValue : ZsCalculated

  const goldenRuleValid = checkGoldenRule(IBValue, In, Iz)
  const overloadCheck = checkOverloadProtectionFull(IBValue, In, Iz)
  const multiplier = TRIP_MULTIPLIERS[characteristic]
  const Ia = calculateTripCurrent(In, multiplier)
  const swzValid = ZsToUse > 0 ? checkShortCircuitProtection(ZsToUse, 230, Ia) : undefined

  // Obliczanie spadku napięcia z użyciem przewodności przy 70°C
  const conductivity = material === 'copper' ? CONDUCTIVITY_70C.copper : CONDUCTIVITY_70C.aluminum
  const powerFactorValue = parseFloat(powerFactor) || (phaseType === 'single' ? 1.0 : 0.93)

  const voltageDrop = lengthValue > 0 && crossSection > 0 && IBValue > 0
    ? phaseType === 'single'
      ? calculateVoltageDropPercentSinglePhaseByConductivity(IBValue, lengthValue, crossSection, 230, conductivity, powerFactorValue)
      : calculateVoltageDropPercentThreePhaseByConductivity(IBValue, lengthValue, crossSection, 400, conductivity, powerFactorValue)
    : 0

  const handleAddCircuit = () => {
    if (!name || IBValue === 0 || In === 0 || crossSection === 0) {
      alert('Wypełnij wszystkie wymagane pola (nazwa, IB/Moc, In, przekrój)')
      return
    }

    // Oblicz bazowe Idd (bez współczynników poprawkowych)
    const Idd = getCableCapacityByInstallation(crossSection, installationMethod, material) || 0

    const newCircuit: Circuit = {
      id: Date.now().toString(),
      name,
      type,
      IB: IBValue,
      In,
      characteristic,
      crossSection,
      material,
      Iz,
      phaseType,
      powerKW: inputMode === 'power' ? parseFloat(powerKW) : undefined,
      powerFactor: inputMode === 'power' ? parseFloat(powerFactor) || (phaseType === 'single' ? 1.0 : 0.93) : undefined,
      length: lengthValue > 0 ? lengthValue : undefined,
      voltageDrop: voltageDrop > 0 ? voltageDrop : undefined,
      Zs: ZsToUse > 0 ? ZsToUse : undefined,
      goldenRuleValid,
      swzValid,
      installationMethod,
      conductivityTemp: '70C',
      overloadProtectionValid: overloadCheck.isValid,
      // Nowe pola dla dynamicznego Iz
      ambientTemperature,
      numberOfCircuitsInBundle,
      insulationType,
      Idd,
    }

    setCircuits([...circuits, newCircuit])

    // Reset formularza
    setName('')
    setCurrentA('')
    setPowerKW('')
    setPowerFactor('')
    setLength('')
    setZs('')
  }

  const handleRemoveCircuit = (id: string) => {
    setCircuits(circuits.filter(c => c.id !== id))
  }

  const handleClearAll = () => {
    setCircuits([])
  }

  const handleImportCircuits = (importedCircuits: Circuit[]) => {
    setCircuits(importedCircuits)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 mb-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">⚡ Dashboard Projektowania Obwodów</h1>
          <p className="text-blue-100">
            Weryfikacja złotej zasady, warunków SWZ i dokumentacja obwodów elektrycznych
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-6">
        {/* Sekcja 1: Dane obwodu - NOWA z przełącznikiem kW/A */}
        <PowerInputSection
          name={name}
          type={type}
          inputMode={inputMode}
          phaseType={phaseType}
          powerKW={powerKW}
          currentA={currentA}
          powerFactor={powerFactor}
          onNameChange={setName}
          onTypeChange={setType}
          onInputModeChange={setInputMode}
          onPhaseTypeChange={setPhaseType}
          onPowerKWChange={setPowerKW}
          onCurrentAChange={setCurrentA}
          onPowerFactorChange={setPowerFactor}
        />

        {/* Sekcja 2: Obliczenia */}
        <CalculationSection
          IB={IBValue}
          In={In}
          Iz={Iz}
          characteristic={characteristic}
          crossSection={crossSection}
          material={material}
          installationMethod={installationMethod}
          ambientTemperature={ambientTemperature}
          numberOfCircuitsInBundle={numberOfCircuitsInBundle}
          insulationType={insulationType}
          onInChange={setIn}
          onCharacteristicChange={setCharacteristic}
          onCrossSectionChange={setCrossSection}
          onMaterialChange={setMaterial}
          onInstallationMethodChange={setInstallationMethod}
          onAmbientTemperatureChange={setAmbientTemperature}
          onNumberOfCircuitsInBundleChange={setNumberOfCircuitsInBundle}
          onInsulationTypeChange={setInsulationType}
        />

        {/* Sekcja 2b: Spadek napięcia */}
        <VoltageDropSection
          length={length}
          voltageDrop={voltageDrop}
          type={type}
          onLengthChange={setLength}
        />

        {/* Sekcja 3: Bezpieczeństwo */}
        <SafetySection
          In={In}
          characteristic={characteristic}
          Zs={Zs}
          ZsSource={ZsSource}
          length={lengthValue}
          crossSection={crossSection}
          material={material}
          onZsChange={setZs}
          onZsSourceChange={setZsSource}
          onZsCalculatedChange={setZsCalculated}
        />

        {/* Przycisk dodania do listy */}
        <div className="flex flex-col items-center gap-3">
          {!goldenRuleValid && IBValue > 0 && In > 0 && (
            <div className="px-6 py-3 bg-red-100 border-2 border-red-500 rounded-lg text-red-800 font-semibold">
              ⚠️ Nie można dodać obwodu - złota zasada nie jest spełniona (In &gt; Iz)
            </div>
          )}
          <button
            onClick={handleAddCircuit}
            disabled={!goldenRuleValid && IBValue > 0 && In > 0}
            className={`px-8 py-4 rounded-lg transition font-bold text-lg shadow-lg ${
              (!goldenRuleValid && IBValue > 0 && In > 0)
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl transform hover:scale-105'
            }`}
          >
            ➕ Dodaj obwód do listy
          </button>
        </div>

        {/* Sekcja 4: Raport */}
        <ReportSection
          circuits={circuits}
          onRemoveCircuit={handleRemoveCircuit}
          onClearAll={handleClearAll}
          onImportCircuits={handleImportCircuits}
        />
      </div>
    </div>
  )
}
