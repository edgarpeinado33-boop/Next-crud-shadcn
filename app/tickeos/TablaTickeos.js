'use client'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Edit, Trash2, UserPlus } from 'lucide-react'

export default function TablaTickeos({ items, usuarios, onNew, onEdit, onDelete, isLoading = false }) {
  
  // Función para obtener nombre de usuario por ID
  const obtenerNombreUsuario = (idUsuario) => {
    const usuario = usuarios.find(u => u.id === parseInt(idUsuario))
    return usuario ? usuario.nombre : `Usuario ${idUsuario}`
  }

  if (isLoading) return <Card><CardContent>Cargando...</CardContent></Card>

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Tickeos</CardTitle>
          <CardDescription>Gestión de ingresos y salidas</CardDescription>
        </div>
        <Button onClick={onNew} className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Nuevo</Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? <p>No hay registros</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(i => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{obtenerNombreUsuario(i.id_usuario)}</div>
                      <div className="text-sm text-gray-500">ID: {i.id_usuario}</div>
                    </div>
                  </TableCell>
                  <TableCell>{i.fecha}</TableCell>
                  <TableCell>{i.hora}</TableCell>
                  <TableCell>{i.tipo}</TableCell>
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