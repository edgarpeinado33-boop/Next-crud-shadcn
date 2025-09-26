'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import TablaTickeos from './TablaTickeos'
import FormularioTickeo from './FormularioTickeo'
import DialogoConfirmacion from '../usuarios/DialogoConfirmacion'
import { obtenerTickeos, crearTickeo, actualizarTickeo, eliminarTickeo } from '@/lib/tickeos'
import { obtenerUsuarios } from '@/lib/usuarios'

export default function TickeosPage() {
  const [items, setItems] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalFormulario, setModalFormulario] = useState(false)
  const [modalConfirmacion, setModalConfirmacion] = useState(false)
  const [editando, setEditando] = useState(null)
  const [eliminando, setEliminando] = useState(null)

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    setIsLoading(true)
    
    // Cargar datos en paralelo
    const [tickeosRes, usuariosRes] = await Promise.all([
      obtenerTickeos(),
      obtenerUsuarios()
    ])

    if (tickeosRes.error) toast.error(tickeosRes.error)
    else setItems(tickeosRes.data || [])

    if (usuariosRes.error) toast.error(usuariosRes.error)
    else setUsuarios(usuariosRes.data || [])

    setIsLoading(false)
  }

  const handleNuevo = () => { setEditando(null); setModalFormulario(true) }
  const handleEditar = (item) => { setEditando(item); setModalFormulario(true) }
  const handleEliminar = (item) => { setEliminando(item); setModalConfirmacion(true) }

  const handleSubmit = async (datos) => {
    setIsSubmitting(true)
    const result = editando ? await actualizarTickeo(editando.id, datos) : await crearTickeo(datos)
    if (result.error) toast.error(result.error)
    else { toast.success('Operación exitosa'); setModalFormulario(false); cargarDatos() }
    setIsSubmitting(false)
  }

  const handleConfirmarEliminar = async () => {
    if (!eliminando) return
    setIsSubmitting(true)
    const result = await eliminarTickeo(eliminando.id)
    if (result.error) toast.error(result.error)
    else { toast.success('Eliminado'); setModalConfirmacion(false); setEliminando(null); cargarDatos() }
    setIsSubmitting(false)
  }

  const cerrarModalFormulario = () => {
    if (!isSubmitting) {
      setModalFormulario(false)
      setEditando(null)
    }
  }

  const cerrarModalConfirmacion = () => {
    if (!isSubmitting) {
      setModalConfirmacion(false)
      setEliminando(null)
    }
  }

  // Función para obtener nombre de usuario por ID
  const obtenerNombreUsuario = (idUsuario) => {
    const usuario = usuarios.find(u => u.id === parseInt(idUsuario))
    return usuario ? usuario.nombre : `Usuario ${idUsuario}`
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Tickeos</h1>
      <TablaTickeos 
        items={items} 
        usuarios={usuarios}
        onNew={handleNuevo} 
        onEdit={handleEditar} 
        onDelete={handleEliminar} 
        isLoading={isLoading} 
      />
      
      {/* Modal de formulario */}
      <Dialog open={modalFormulario} onOpenChange={cerrarModalFormulario}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Tickeo' : 'Nuevo Tickeo'}</DialogTitle>
          </DialogHeader>
          <FormularioTickeo 
            item={editando} 
            usuarios={usuarios}
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
        title="Eliminar Registro" 
        description={eliminando ? `¿Eliminar tickeo del usuario ${obtenerNombreUsuario(eliminando.id_usuario)}?` : ''} 
        isDestructive 
        isLoading={isSubmitting} 
      />
    </div>
  )
}