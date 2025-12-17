import { useState } from 'react'
import { PowerInputSection } from '../components/PowerInputSection'
import { CalculationSection } from '../components/CalculationSection'
import { VoltageDropSection } from '../components/VoltageDropSection'
import { SafetySection } from '../components/SafetySection'
import { ReportSection } from '../components/ReportSection'
import { findCableCapacity, CABLE_CAPACITY_A1 } from '../constants/cableTables'
import { checkGoldenRule, checkShortCircuitProtection, calculateTripCurrent } from '../logic/circuitValidation'
import { calculateVoltageDropPercent, calculateCurrentSinglePhase, calculateCurrentThreePhase } from '../logic/calculations'
import { TRIP_MULTIPLIERS } from '../constants/electricalData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Circuit, CircuitType, ProtectionCharacteristic, PhaseType, InputMode } from '../types/circuit'

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

  // Spadek napięcia (Sekcja 2b)
  const [length, setLength] = useState('')

  // Bezpieczeństwo (Sekcja 3)
  const [Zs, setZs] = useState('')

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
  const Iz = findCableCapacity(crossSection, CABLE_CAPACITY_A1, 'copper') || 0
  const lengthValue = parseFloat(length) || 0
  const ZsValue = parseFloat(Zs) || 0

  const goldenRuleValid = checkGoldenRule(IBValue, In, Iz)
  const multiplier = TRIP_MULTIPLIERS[characteristic]
  const Ia = calculateTripCurrent(In, multiplier)
  const swzValid = ZsValue > 0 ? checkShortCircuitProtection(ZsValue, 230, Ia) : undefined

  // Obliczanie spadku napięcia
  const voltageDrop = lengthValue > 0 && crossSection > 0
    ? calculateVoltageDropPercent(IBValue, lengthValue, crossSection)
    : 0

  const handleAddCircuit = () => {
    if (!name || IBValue === 0 || In === 0 || crossSection === 0) {
      alert('Wypełnij wszystkie wymagane pola (nazwa, IB/Moc, In, przekrój)')
      return
    }

    const newCircuit: Circuit = {
      id: Date.now().toString(),
      name,
      type,
      IB: IBValue,
      In,
      characteristic,
      crossSection,
      material: 'copper',
      Iz,
      phaseType,
      powerKW: inputMode === 'power' ? parseFloat(powerKW) : undefined,
      powerFactor: inputMode === 'power' ? parseFloat(powerFactor) || (phaseType === 'single' ? 1.0 : 0.93) : undefined,
      length: lengthValue > 0 ? lengthValue : undefined,
      voltageDrop: voltageDrop > 0 ? voltageDrop : undefined,
      Zs: ZsValue > 0 ? ZsValue : undefined,
      goldenRuleValid,
      swzValid,
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
          onInChange={setIn}
          onCharacteristicChange={setCharacteristic}
          onCrossSectionChange={setCrossSection}
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
          onZsChange={setZs}
        />

        {/* Przycisk dodania do listy */}
        <div className="flex justify-center">
          <button
            onClick={handleAddCircuit}
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
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
