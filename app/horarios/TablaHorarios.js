
'use client'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Edit, Trash2, UserPlus } from 'lucide-react'

export default function TablaHorarios({ items, onNew, onEdit, onDelete, isLoading = false }) {
  if (isLoading) return <Card><CardContent>Cargando...</CardContent></Card>

  // Función para formatear la hora mostrando segundos
  const formatTime = (time) => {
    if (!time) return '-';
    // Si la hora no tiene segundos, agregar :00
    if (time && time.includes(':') && time.split(':').length === 2) {
      return time + ':00';
    }
    return time;
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Horarios</CardTitle>
          <CardDescription>Gestión de horarios de la empresa</CardDescription>
        </div>
        <Button onClick={onNew} className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Nuevo</Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? <p>No hay horarios registrados</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora Ingreso</TableHead>
                <TableHead>Hora Salida</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(i => (
                <TableRow key={i.id}>
                  <TableCell>{formatTime(i.hora_ingreso)}</TableCell>
                  <TableCell>{formatTime(i.hora_salida)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(i)}><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => onDelete(i)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
