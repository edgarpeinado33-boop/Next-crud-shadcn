'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import TablaCargosUsuarios from './TablaCargosUsuarios'
import FormularioCargoUsuario from './FormularioCargoUsuario'
import DialogoConfirmacion from '../usuarios/DialogoConfirmacion'
import { 
  obtenerCargosUsuarios, 
  crearCargoUsuario, 
  actualizarCargoUsuario, 
  eliminarCargoUsuario 
} from '@/lib/cargos_usuarios'
import { obtenerUsuarios } from '@/lib/usuarios'
import { obtenerCargos } from '@/lib/cargos'

export default function CargosUsuariosPage() {
  const [items, setItems] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [cargos, setCargos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalFormulario, setModalFormulario] = useState(false)
  const [modalConfirmacion, setModalConfirmacion] = useState(false)
  const [editando, setEditando] = useState(null)
  const [eliminando, setEliminando] = useState(null)

  useEffect(() => { 
    cargarDatos() 
  }, [])

  const cargarDatos = async () => {
    setIsLoading(true)
    
    // Cargar datos en paralelo
    const [cargosUsuariosRes, usuariosRes, cargosRes] = await Promise.all([
      obtenerCargosUsuarios(),
      obtenerUsuarios(),
      obtenerCargos()
    ])

    if (cargosUsuariosRes.error) toast.error(cargosUsuariosRes.error)
    else setItems(cargosUsuariosRes.data || [])

    if (usuariosRes.error) toast.error(usuariosRes.error)
    else setUsuarios(usuariosRes.data || [])

    if (cargosRes.error) toast.error(cargosRes.error)
    else setCargos(cargosRes.data || [])

    setIsLoading(false)
  }

  const handleNuevo = () => { setEditando(null); setModalFormulario(true) }
  const handleEditar = (item) => { setEditando(item); setModalFormulario(true) }
  const handleEliminar = (item) => { setEliminando(item); setModalConfirmacion(true) }

  const handleSubmit = async (datos) => {
    setIsSubmitting(true)
    const result = editando ? await actualizarCargoUsuario(editando.id, datos) : await crearCargoUsuario(datos)
    if (result.error) toast.error(result.error)
    else { toast.success('Operación exitosa'); setModalFormulario(false); cargarDatos() }
    setIsSubmitting(false)
  }

  const handleConfirmarEliminar = async () => {
    if (!eliminando) return
    setIsSubmitting(true)
    const result = await eliminarCargoUsuario(eliminando.id)
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

  // Función para obtener nombre de cargo por ID
  const obtenerNombreCargo = (idCargo) => {
    const cargo = cargos.find(c => c.id === parseInt(idCargo))
    return cargo ? cargo.cargo : `Cargo ${idCargo}` // Cambiado a cargo.cargo
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Cargos Usuarios</h1>
      <TablaCargosUsuarios 
        items={items} 
        usuarios={usuarios}
        cargos={cargos}
        onNew={handleNuevo} 
        onEdit={handleEditar} 
        onDelete={handleEliminar} 
        isLoading={isLoading} 
      />
      
      {/* Modal de formulario */}
      <Dialog open={modalFormulario} onOpenChange={cerrarModalFormulario}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Registro' : 'Nuevo Registro'}</DialogTitle>
          </DialogHeader>
          <FormularioCargoUsuario 
            item={editando} 
            usuarios={usuarios}
            cargos={cargos}
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
        description={eliminando ? `¿Eliminar registro del usuario ${obtenerNombreUsuario(eliminando.id_usuario)}?` : ''} 
        isDestructive 
        isLoading={isSubmitting} 
      />
    </div>
  )
}