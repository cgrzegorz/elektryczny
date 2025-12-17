interface GoldenRuleVisualizationProps {
  IB: number
  In: number
  Iz: number
  isValid: boolean
}

export const GoldenRuleVisualization = ({
  IB,
  In,
  Iz,
  isValid
}: GoldenRuleVisualizationProps) => {
  // Znajdź maksymalną wartość dla skali
  const maxValue = Math.max(IB, In, Iz) * 1.2

  // Pozycje na osi (w procentach)
  const posIB = (IB / maxValue) * 100
  const posIn = (In / maxValue) * 100
  const posIz = (Iz / maxValue) * 100

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Wizualizacja Złotej Zasady: IB ≤ In ≤ Iz
      </h3>

      {/* Oś liczbowa */}
      <div className="relative h-24 bg-gray-100 rounded-lg p-4">
        {/* Linia osi */}
        <div className="absolute top-1/2 left-4 right-4 h-2 bg-gray-300 rounded">
          {/* Zakres poprawny (od In do Iz) */}
          {isValid && (
            <div
              className="absolute h-full bg-green-300 rounded"
              style={{
                left: `${Math.min(posIn, posIz)}%`,
                width: `${Math.abs(posIz - posIn)}%`
              }}
            />
          )}
        </div>

        {/* Znacznik IB */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
          style={{ left: `calc(${posIB}% + 1rem)` }}
        >
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-md" />
            <div className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded whitespace-nowrap">
              IB = {IB.toFixed(1)}A
            </div>
          </div>
        </div>

        {/* Znacznik In */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
          style={{ left: `calc(${posIn}% + 1rem)` }}
        >
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full shadow-md ${isValid ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className={`mt-1 px-2 py-1 text-white text-xs font-bold rounded whitespace-nowrap ${isValid ? 'bg-green-500' : 'bg-red-500'}`}>
              In = {In}A
            </div>
          </div>
        </div>

        {/* Znacznik Iz */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
          style={{ left: `calc(${posIz}% + 1rem)` }}
        >
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full shadow-md" />
            <div className="mt-1 px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded whitespace-nowrap">
              Iz = {Iz}A
            </div>
          </div>
        </div>

        {/* Skala na dole */}
        <div className="absolute bottom-0 left-4 right-4 flex justify-between text-xs text-gray-500">
          <span>0A</span>
          <span>{(maxValue / 2).toFixed(0)}A</span>
          <span>{maxValue.toFixed(0)}A</span>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-3 flex gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>IB - Prąd obliczeniowy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>In - Prąd zabezpieczenia</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full" />
          <span>Iz - Obciążalność przewodu</span>
        </div>
      </div>
    </div>
  )
}

