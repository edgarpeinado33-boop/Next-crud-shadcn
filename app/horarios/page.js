
'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import TablaHorarios from './TablaHorarios'
import FormularioHorario from './FormularioHorario'
import DialogoConfirmacion from '../usuarios/DialogoConfirmacion'
import { obtenerHorarios, crearHorario, actualizarHorario, eliminarHorario } from '@/lib/horarios'

export default function HorariosPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalFormulario, setModalFormulario] = useState(false)
  const [modalConfirmacion, setModalConfirmacion] = useState(false)
  const [editando, setEditando] = useState(null)
  const [eliminando, setEliminando] = useState(null)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setIsLoading(true)
    const { data, error } = await obtenerHorarios()
    if (error) toast.error(error)
    else setItems(data || [])
    setIsLoading(false)
  }

  const handleNuevo = () => { setEditando(null); setModalFormulario(true) }
  const handleEditar = (item) => { setEditando(item); setModalFormulario(true) }
  const handleEliminar = (item) => { setEliminando(item); setModalConfirmacion(true) }

  const handleSubmit = async (datos) => {
    setIsSubmitting(true)
    const result = editando ? await actualizarHorario(editando.id, datos) : await crearHorario(datos)
    if (result.error) toast.error(result.error)
    else { toast.success('Operación exitosa'); setModalFormulario(false); cargar() }
    setIsSubmitting(false)
  }

  const handleConfirmarEliminar = async () => {
    if (!eliminando) return
    setIsSubmitting(true)
    const result = await eliminarHorario(eliminando.id)
    if (result.error) toast.error(result.error)
    else { toast.success('Eliminado'); setModalConfirmacion(false); setEliminando(null); cargar() }
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Horarios</h1>
      <TablaHorarios items={items} onNew={handleNuevo} onEdit={handleEditar} onDelete={handleEliminar} isLoading={isLoading} />
      
      {/* Modal de formulario */}
      <Dialog open={modalFormulario} onOpenChange={cerrarModalFormulario}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Horario' : 'Nuevo Horario'}</DialogTitle>
          </DialogHeader>
          <FormularioHorario 
            item={editando} 
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
        description={eliminando ? `¿Eliminar horario ID ${eliminando.id}?` : ''} 
        isDestructive 
        isLoading={isSubmitting} 
      />
    </div>
  )
}
