
'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import TablaUsuarios from './TablaUsuarios'
import FormularioUsuario from './FormularioUsuario'
import DialogoConfirmacion from './DialogoConfirmacion'
import { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '@/lib/usuarios'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalFormulario, setModalFormulario] = useState(false)
  const [modalConfirmacion, setModalConfirmacion] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [usuarioEliminando, setUsuarioEliminando] = useState(null)

  useEffect(() => { cargarUsuarios() }, [])

  const cargarUsuarios = async () => {
    setIsLoading(true)
    const { data, error } = await obtenerUsuarios()
    if (error) toast.error(error)
    else setUsuarios(data || [])
    setIsLoading(false)
  }

  const handleNuevo = () => { setUsuarioEditando(null); setModalFormulario(true) }
  const handleEditar = (u) => { setUsuarioEditando(u); setModalFormulario(true) }
  const handleEliminar = (u) => { setUsuarioEliminando(u); setModalConfirmacion(true) }

  const handleSubmit = async (datos) => {
    setIsSubmitting(true)
    const result = usuarioEditando ? await actualizarUsuario(usuarioEditando.id, datos) : await crearUsuario(datos)
    if (result.error) toast.error(result.error)
    else { toast.success('Operación exitosa'); setModalFormulario(false); cargarUsuarios() }
    setIsSubmitting(false)
  }

  const handleConfirmarEliminar = async () => {
    if (!usuarioEliminando) return
    setIsSubmitting(true)
    const result = await eliminarUsuario(usuarioEliminando.id)
    if (result.error) toast.error(result.error)
    else { toast.success('Usuario eliminado'); setModalConfirmacion(false); setUsuarioEliminando(null); cargarUsuarios() }
    setIsSubmitting(false)
  }

  const cerrarModalFormulario = () => {
    if (!isSubmitting) {
      setModalFormulario(false)
      setUsuarioEditando(null)
    }
  }

  const cerrarModalConfirmacion = () => {
    if (!isSubmitting) {
      setModalConfirmacion(false)
      setUsuarioEliminando(null)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Gestión de Usuarios</h1>
      <TablaUsuarios usuarios={usuarios} onNew={handleNuevo} onEdit={handleEditar} onDelete={handleEliminar} isLoading={isLoading} />
      
      {/* Modal de formulario */}
      <Dialog open={modalFormulario} onOpenChange={cerrarModalFormulario}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          </DialogHeader>
          <FormularioUsuario 
            usuario={usuarioEditando} 
            onSubmit={handleSubmit} 
            onCancel={cerrarModalFormulario} 
            isLoading={isSubmitting} 
          />
        </DialogContent>
      </Dialog>
      
      <DialogoConfirmacion 
        open={modalConfirmacion} 
        onOpenChange={cerrarModalConfirmacion}
        onConfirm={handleConfirmarEliminar} 
        title="Eliminar Usuario" 
        description={usuarioEliminando ? `¿Eliminar a ${usuarioEliminando.nombre}?` : ''} 
        isDestructive 
        isLoading={isSubmitting} 
      />
    </div>
  )
}
