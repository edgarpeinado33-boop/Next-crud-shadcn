
'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import TablaCargos from './TablaCargos'
import FormularioCargo from './FormularioCargo'
import DialogoConfirmacion from '../usuarios/DialogoConfirmacion'
import { obtenerCargos, crearCargo, actualizarCargo, eliminarCargo } from '@/lib/cargos'

export default function CargosPage() {
  const [cargos, setCargos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalFormulario, setModalFormulario] = useState(false)
  const [modalConfirmacion, setModalConfirmacion] = useState(false)
  const [cargoEditando, setCargoEditando] = useState(null)
  const [cargoEliminando, setCargoEliminando] = useState(null)

  useEffect(() => { cargarCargos() }, [])

  const cargarCargos = async () => {
    setIsLoading(true)
    const { data, error } = await obtenerCargos()
    if (error) toast.error(error)
    else setCargos(data || [])
    setIsLoading(false)
  }

  const handleNuevo = () => { setCargoEditando(null); setModalFormulario(true) }
  const handleEditar = (c) => { setCargoEditando(c); setModalFormulario(true) }
  const handleEliminar = (c) => { setCargoEliminando(c); setModalConfirmacion(true) }

  const handleSubmit = async (datos) => {
    setIsSubmitting(true)
    const result = cargoEditando ? await actualizarCargo(cargoEditando.id, datos) : await crearCargo(datos)
    if (result.error) toast.error(result.error)
    else { toast.success('Operación exitosa'); setModalFormulario(false); cargarCargos() }
    setIsSubmitting(false)
  }

  const handleConfirmarEliminar = async () => {
    if (!cargoEliminando) return
    setIsSubmitting(true)
    const result = await eliminarCargo(cargoEliminando.id)
    if (result.error) toast.error(result.error)
    else { toast.success('Cargo eliminado'); setModalConfirmacion(false); setCargoEliminando(null); cargarCargos() }
    setIsSubmitting(false)
  }

  const cerrarModalFormulario = () => {
    if (!isSubmitting) {
      setModalFormulario(false)
      setCargoEditando(null)
    }
  }

  const cerrarModalConfirmacion = () => {
    if (!isSubmitting) {
      setModalConfirmacion(false)
      setCargoEliminando(null)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Gestión de Cargos</h1>
      <TablaCargos cargos={cargos} onNew={handleNuevo} onEdit={handleEditar} onDelete={handleEliminar} isLoading={isLoading} />
      
      {/* Modal de formulario */}
      <Dialog open={modalFormulario} onOpenChange={cerrarModalFormulario}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{cargoEditando ? 'Editar Cargo' : 'Nuevo Cargo'}</DialogTitle>
          </DialogHeader>
          <FormularioCargo 
            cargo={cargoEditando} 
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
        title="Eliminar Cargo" 
        description={cargoEliminando ? `¿Eliminar "${cargoEliminando.cargo}"?` : ''} 
        isDestructive 
        isLoading={isSubmitting} 
      />
    </div>
  )
}
