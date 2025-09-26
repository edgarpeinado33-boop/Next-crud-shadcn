'use client'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Edit, Trash2, UserPlus } from 'lucide-react'

export default function TablaUsuarios({ usuarios, onEdit, onDelete, onNew, isLoading = false }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p>Cargando usuarios...</p>
        </CardContent>
      </Card>
    )
  }

  // Invertir el orden del array para mostrar de mayor a menor ID
  const usuariosOrdenados = [...usuarios].reverse()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>Gestiona todos los usuarios del sistema</CardDescription>
          </div>
          {/* Botón +Nuevo siempre visible arriba */}
          <Button onClick={onNew} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Nuevo Usuario
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {usuarios.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {usuariosOrdenados.map(usuario => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.id}</TableCell>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.username}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {usuario.password ? '••••••••' : 'No definido'}
                      </span>
                    </TableCell>
                    <TableCell>{usuario.edad}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(usuario)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(usuario)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}