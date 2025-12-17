import { Table } from './Table'
import { Badge } from './Badge'
import type { Circuit } from '../types/circuit'
import { CIRCUIT_TYPE_LABELS } from '../types/circuit'
import {VOLTAGE_DROP_LIMITS} from "../constants/electricalData.ts";

interface ReportSectionProps {
  circuits: Circuit[]
  onRemoveCircuit: (id: string) => void
  onClearAll: () => void
  onImportCircuits: (circuits: Circuit[]) => void
}

export const ReportSection = ({
  circuits,
  onRemoveCircuit,
  onClearAll,
  onImportCircuits
}: ReportSectionProps) => {
  const columns = [
    {
      header: 'Nazwa',
      accessor: 'name' as const,
      className: 'font-medium'
    },
    {
      header: 'Typ',
      accessor: (row: Circuit) => CIRCUIT_TYPE_LABELS[row.type]
    },
    {
      header: 'IB / Moc',
      accessor: (row: Circuit) => {
        return (
          <div className="text-sm">
            <div className="font-semibold">{row.IB.toFixed(1)} A</div>
            {row.powerKW && <div className="text-gray-500 text-xs">{row.powerKW} kW</div>}
          </div>
        )
      }
    },
    {
      header: 'Przewód',
      accessor: (row: Circuit) => {
        const materialLabel = row.material === 'copper' ? 'Cu' : 'Al'
        const methodLabel = row.installationMethod || '?'
        const cores = row.phaseType === 'three' ? '5x' : '3x'

        return (
          <div className="text-sm">
            <div className="font-semibold">{cores}{row.crossSection} mm²</div>
            <div className="text-gray-500 text-xs">{materialLabel} / {methodLabel}</div>
          </div>
        )
      }
    },
    {
      header: 'Iz [A]',
      accessor: (row: Circuit) => row.Iz.toFixed(0)
    },
    {
      header: 'Zabezpieczenie',
      accessor: (row: Circuit) => {
        const poles = row.phaseType === 'three' ? '/3P' : ''
        return `${row.characteristic}${row.In}${poles}`
      }
    },
    {
      header: 'IB≤In≤Iz',
      accessor: (row: Circuit) => {
        const goldenOk = row.goldenRuleValid
        const overloadOk = row.overloadProtectionValid !== false
        const allOk = goldenOk && overloadOk

        return (
          <div className="space-y-1">
            <Badge variant={allOk ? 'success' : 'error'}>
              {allOk ? '✓ OK' : '✗ Błąd'}
            </Badge>
          </div>
        )
      }
    },
    {
      header: 'SWZ',
      accessor: (row: Circuit) => {
        if (row.swzValid === undefined) return '-'
        return (
          <Badge variant={row.swzValid ? 'success' : 'error'}>
            {row.swzValid ? '✓' : '✗'}
          </Badge>
        )
      }
    },
    {
      header: 'ΔU [%]',
      accessor: (row: Circuit) => {
        if (!row.voltageDrop) return '-'
        const limit = VOLTAGE_DROP_LIMITS[row.type] * 100
        const isValid = row.voltageDrop <= limit
        return (
          <Badge variant={isValid ? 'success' : 'error'}>
            {row.voltageDrop.toFixed(1)}%
          </Badge>
        )
      }
    },
    {
      header: 'Zs [Ω]',
      accessor: (row: Circuit) => {
        if (!row.Zs) return '-'
        return row.Zs.toFixed(3)
      }
    },
    {
      header: 'Akcje',
      accessor: (row: Circuit) => (
        <button
          onClick={() => onRemoveCircuit(row.id)}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Usuń
        </button>
      )
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">📋</span>
        4. Raport - Tabela dokumentacyjna
      </h2>

      {circuits.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">Brak dodanych obwodów</p>
          <p className="text-sm">Dodaj pierwszy obwód używając przycisku "Dodaj do listy" powyżej</p>
        </div>
      ) : (
        <>
          <Table
            data={circuits}
            columns={columns}
            caption={`Lista ${circuits.length} obwód(ów)`}
          />

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
              onClick={() => {
                // TODO: Implementacja eksportu do PDF
                alert('Funkcja eksportu do PDF - do implementacji')
              }}
            >
              📄 Eksportuj do PDF
            </button>

            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
              onClick={() => {
                // TODO: Implementacja eksportu do Excel
                alert('Funkcja eksportu do Excel - do implementacji')
              }}
            >
              📊 Eksportuj do Excel
            </button>

            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition font-medium"
              onClick={() => {
                const data = JSON.stringify(circuits, null, 2)
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `obwody_${new Date().toISOString().split('T')[0]}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              💾 Eksportuj JSON
            </button>

            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.json'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      try {
                        const importedCircuits = JSON.parse(event.target?.result as string)
                        if (Array.isArray(importedCircuits)) {
                          onImportCircuits(importedCircuits)
                          alert(`Zaimportowano ${importedCircuits.length} obwód(ów)`)
                        } else {
                          alert('Nieprawidłowy format pliku')
                        }
                      } catch (error) {
                        alert('Błąd podczas importu pliku')
                        console.error(error)
                      }
                    }
                    reader.readAsText(file)
                  }
                }
                input.click()
              }}
            >
              📥 Importuj JSON
            </button>

            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
              onClick={() => {
                if (confirm('Czy na pewno chcesz usunąć wszystkie obwody? Ta operacja jest nieodwracalna.')) {
                  onClearAll()
                }
              }}
            >
              🗑️ Wyczyść wszystko
            </button>
          </div>

          {/* Informacja o zapisywaniu */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-800">
              💾 <strong>Automatyczne zapisywanie:</strong> Twoje obwody są automatycznie zapisywane w przeglądarce (localStorage).
              Dane pozostaną nawet po zamknięciu przeglądarki.
            </p>
          </div>

          {/* Statystyki */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Łącznie obwodów</div>
              <div className="text-2xl font-bold text-blue-800">{circuits.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Poprawnych</div>
              <div className="text-2xl font-bold text-green-800">
                {circuits.filter(c => c.goldenRuleValid && (c.swzValid === undefined || c.swzValid)).length}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Z błędami</div>
              <div className="text-2xl font-bold text-red-800">
                {circuits.filter(c => !c.goldenRuleValid || c.swzValid === false).length}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Suma IB</div>
              <div className="text-2xl font-bold text-purple-800">
                {circuits.reduce((sum, c) => sum + c.IB, 0).toFixed(1)} A
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

