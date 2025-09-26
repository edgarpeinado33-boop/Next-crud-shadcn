'use client'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Edit, Trash2, UserPlus } from 'lucide-react'

export default function TablaCargos({ cargos, onEdit, onDelete, onNew, isLoading = false }) {
  if (isLoading) return <Card><CardContent>Cargando...</CardContent></Card>

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Cargos</CardTitle>
          <CardDescription>Gestión de cargos</CardDescription>
        </div>
        <Button onClick={onNew} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Nuevo
        </Button>
      </CardHeader>
      <CardContent>
        {cargos.length === 0 ? <p>No hay cargos</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cargo</TableHead>
                <TableHead>Sueldo</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargos.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.cargo}</TableCell>
                  <TableCell>{c.sueldo}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(c)}><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => onDelete(c)}><Trash2 className="h-4 w-4" /></Button>
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
