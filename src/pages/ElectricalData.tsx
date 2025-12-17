import { Badge } from '../components/Badge'
import { Table } from '../components/Table'
import {
  NOMINAL_CURRENTS,
  TRIP_MULTIPLIERS,
  K_COEFFICIENTS,
  VOLTAGE_DROP_LIMITS
} from '../constants/electricalData'

export const ElectricalData = () => {
  const protectionData = NOMINAL_CURRENTS.map(current => ({
    current,
    description: current <= 16 ? 'Obwody mieszkaniowe' : 'Obwody przemysłowe'
  }))

  const protectionColumns = [
    { header: 'Prąd znamionowy In [A]', accessor: 'current' as const },
    {
      header: 'Typowe zastosowanie',
      accessor: (row: typeof protectionData[0]) => (
        <Badge variant={row.current <= 16 ? 'info' : 'warning'}>
          {row.description}
        </Badge>
      )
    },
  ]

  const tripData = Object.entries(TRIP_MULTIPLIERS).map(([char, mult]) => ({
    characteristic: char,
    multiplier: mult,
    tripCurrent: (multiplier: number, In: number) => `${multiplier} × ${In}A = ${multiplier * In}A`
  }))

  const tripColumns = [
    { header: 'Charakterystyka', accessor: 'characteristic' as const },
    { header: 'Krotność', accessor: 'multiplier' as const },
    {
      header: 'Przykład (dla In=16A)',
      accessor: (row: typeof tripData[0]) => row.tripCurrent(row.multiplier, 16)
    },
  ]

  const kData = Object.entries(K_COEFFICIENTS).map(([type, value]) => ({
    type,
    value,
    description: type.includes('copper') ? 'Miedź' : 'Aluminium',
    insulation: type.includes('PVC') ? 'PVC' : 'XLPE'
  }))

  const kColumns = [
    { header: 'Typ przewodu', accessor: 'type' as const },
    { header: 'Materiał', accessor: 'description' as const },
    { header: 'Izolacja', accessor: 'insulation' as const },
    {
      header: 'Wartość k',
      accessor: (row: typeof kData[0]) => (
        <span className="font-bold text-blue-600">{row.value}</span>
      )
    },
  ]

  const voltageDropData = Object.entries(VOLTAGE_DROP_LIMITS).map(([type, limit]) => ({
    type,
    limit,
    percentage: `${(limit * 100).toFixed(1)}%`,
    voltage230: `${(230 * limit).toFixed(2)}V`,
    voltage400: `${(400 * limit).toFixed(2)}V`
  }))

  const voltageDropColumns = [
    { header: 'Typ obwodu', accessor: 'type' as const },
    { header: 'Limit [%]', accessor: 'percentage' as const },
    { header: 'Dla 230V', accessor: 'voltage230' as const },
    { header: 'Dla 400V', accessor: 'voltage400' as const },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          📊 Dane Techniczne Elektryczne
        </h1>
        <p className="text-gray-600">
          Stałe wartości i współczynniki używane w obliczeniach instalacji elektrycznych
        </p>
      </div>

      {/* Sekcja 1: Zabezpieczenia nadprądowe */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            1. Prądy znamionowe zabezpieczeń (In)
          </h2>
          <Badge variant="info">Wartości standardowe</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Dostępne wartości prądów znamionowych wyłączników nadprądowych według norm
        </p>
        <Table
          data={protectionData}
          columns={protectionColumns}
          caption="Standardowe wartości prądów znamionowych In"
        />
      </div>

      {/* Sekcja 2: Krotności wyzwalania */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            2. Charakterystyki wyzwalania
          </h2>
          <Badge variant="warning">Krotności prądu</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Krotności prądu znamionowego, przy których następuje natychmiastowe wyzwalanie
        </p>
        <Table
          data={tripData}
          columns={tripColumns}
          caption="Charakterystyki B, C, D wyłączników nadprądowych"
        />
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500">
          <p className="text-sm text-yellow-800">
            <strong>Uwaga:</strong> Charakterystyka B - instalacje mieszkaniowe,
            C - przemysłowe (standard), D - duże prądy rozruchowe (silniki, transformatory)
          </p>
        </div>
      </div>

      {/* Sekcja 3: Współczynniki k */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            3. Współczynniki k dla przewodów
          </h2>
          <Badge variant="success">k = 115 (Cu/PVC)</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Współczynnik k używany do obliczania minimalnego przekroju ze względu na obciążalność termiczną zwarciową
        </p>
        <Table
          data={kData}
          columns={kColumns}
          caption="Wartości współczynnika k dla różnych typów przewodów"
        />
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            <strong>Wzór:</strong> S<sub>min</sub> = (I<sub>k</sub> × √t) / k, gdzie:<br/>
            S<sub>min</sub> - minimalny przekrój [mm²],
            I<sub>k</sub> - prąd zwarciowy [A],
            t - czas wyłączenia [s],
            k - współczynnik
          </p>
        </div>
      </div>

      {/* Sekcja 4: Limity spadków napięcia */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            4. Dopuszczalne spadki napięcia
          </h2>
          <Badge variant="error">Limity normowe</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Maksymalne dopuszczalne spadki napięcia w instalacjach elektrycznych
        </p>
        <Table
          data={voltageDropData}
          columns={voltageDropColumns}
          caption="Limity spadków napięcia dla różnych typów obwodów"
        />
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-sm text-red-800">
            <strong>Norma:</strong> Spadek napięcia mierzony od źródła zasilania do najdalszego punktu odbiorczego.
            Dla oświetlenia max 3%, dla pozostałych obwodów max 5%.
          </p>
        </div>
      </div>
    </div>
  )
}

