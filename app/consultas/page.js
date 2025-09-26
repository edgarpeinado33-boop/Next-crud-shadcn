'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Button } from '@/app/components/ui/button'
import { RefreshCw, Users, DollarSign, Clock, TrendingUp, TrendingDown } from 'lucide-react'

import { 
  obtenerGerentes,
  obtenerUsuariosSueldoAlto,
  obtenerUsuariosSueldoMedio,
  obtenerLlegadasTarde,
  obtenerSalidasTemprano
} from '@/lib/consultas'

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState({
    gerentes: [],
    sueldoAlto: [],
    sueldoMedio: [],
    llegadasTarde: [],
    salidasTemprano: []
  })
  const [isLoading, setIsLoading] = useState({
    gerentes: false,
    sueldoAlto: false,
    sueldoMedio: false,
    llegadasTarde: false,
    salidasTemprano: false
  })

  const cargarConsulta = async (tipoConsulta) => {
    setIsLoading(prev => ({ ...prev, [tipoConsulta]: true }))
    
    try {
      let resultado
      switch (tipoConsulta) {
        case 'gerentes':
          resultado = await obtenerGerentes()
          break
        case 'sueldoAlto':
          resultado = await obtenerUsuariosSueldoAlto()
          break
        case 'sueldoMedio':
          resultado = await obtenerUsuariosSueldoMedio()
          break
        case 'llegadasTarde':
          resultado = await obtenerLlegadasTarde()
          break
        case 'salidasTemprano':
          resultado = await obtenerSalidasTemprano()
          break
        default:
          throw new Error('Consulta no válida')
      }

      if (resultado.error) {
        throw new Error(resultado.error)
      }

      setConsultas(prev => ({ ...prev, [tipoConsulta]: resultado.data || [] }))
      toast.success(`${tipoConsulta} cargada correctamente (${resultado.data?.length || 0} registros)`)
    } catch (error) {
      toast.error(`Error al cargar ${tipoConsulta}: ${error.message}`)
    } finally {
      setIsLoading(prev => ({ ...prev, [tipoConsulta]: false }))
    }
  }

  const cargarTodasConsultas = () => {
    const consultas = ['gerentes', 'sueldoAlto', 'sueldoMedio', 'llegadasTarde', 'salidasTemprano']
    consultas.forEach(consulta => cargarConsulta(consulta))
  }

  useEffect(() => {
    cargarTodasConsultas()
  }, [])

  const ConsultaCard = ({ titulo, descripcion, datos, isLoading, tipo, icon: Icon }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>{titulo}</CardTitle>
              <CardDescription>{descripcion}</CardDescription>
            </div>
          </div>
          <Button 
            onClick={() => cargarConsulta(tipo)} 
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : datos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No hay datos disponibles
            <br />
            <small>Revisa la consola para más detalles</small>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(datos[0]).map(key => (
                    <TableHead key={key} className="capitalize">
                      {key.replace(/_/g, ' ')}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {datos.map((item, index) => (
                  <TableRow key={index}>
                    {Object.values(item).map((value, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {value || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-2 text-sm text-gray-500">
          Total: {datos.length} registros
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Consultas del Sistema</h1>
        <p className="text-gray-600">Reportes y análisis de datos</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={cargarTodasConsultas} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar Todas
        </Button>
      </div>

      <div className="grid gap-6">
        <ConsultaCard
          titulo="Usuarios Gerentes"
          descripcion="Lista de todos los usuarios con cargo de Gerente"
          datos={consultas.gerentes}
          isLoading={isLoading.gerentes}
          tipo="gerentes"
          icon={Users}
        />

        <ConsultaCard
          titulo="Sueldos Altos (+5000)"
          descripcion="Usuarios que ganan más de 5000"
          datos={consultas.sueldoAlto}
          isLoading={isLoading.sueldoAlto}
          tipo="sueldoAlto"
          icon={DollarSign}
        />

        <ConsultaCard
          titulo="Sueldos Medios (3000-6000)"
          descripcion="Usuarios que ganan entre 3000 y 6000"
          datos={consultas.sueldoMedio}
          isLoading={isLoading.sueldoMedio}
          tipo="sueldoMedio"
          icon={TrendingUp}
        />

        <ConsultaCard
          titulo="Llegadas Tarde"
          descripcion="Usuarios que llegaron después de las 08:00:00"
          datos={consultas.llegadasTarde}
          isLoading={isLoading.llegadasTarde}
          tipo="llegadasTarde"
          icon={Clock}
        />

        <ConsultaCard
          titulo="Salidas Temprano"
          descripcion="Usuarios que se fueron antes de las 17:30:00"
          datos={consultas.salidasTemprano}
          isLoading={isLoading.salidasTemprano}
          tipo="salidasTemprano"
          icon={TrendingDown}
        />
      </div>
    </div>
  )
}