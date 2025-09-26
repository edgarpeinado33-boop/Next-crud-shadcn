'use client'
import { useState, useEffect } from 'react'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export default function FormularioTickeo({ item = null, usuarios = [], onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({ id_usuario: '', fecha: '', hora: '', tipo: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => { 
    if (item) {
      setFormData({ ...item })
    } else {
      setFormData({ id_usuario: '', fecha: '', hora: '', tipo: '' })
    }
  }, [item])

  const handleChange = (field, value) => { 
    setFormData(prev => ({ ...prev, [field]: value })); 
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined })) 
  }

  const validar = () => {
    const newErrors = {}
    if (!formData.id_usuario) newErrors.id_usuario = 'Usuario requerido'
    if (!formData.fecha) newErrors.fecha = 'Fecha requerida'
    if (!formData.hora) newErrors.hora = 'Hora requerida'
    if (!formData.tipo) newErrors.tipo = 'Tipo requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => { 
    e.preventDefault(); 
    if (validar()) onSubmit(formData) 
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label>Usuario</Label>
        <Select value={formData.id_usuario} onValueChange={value => handleChange('id_usuario', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar usuario" />
          </SelectTrigger>
          <SelectContent>
            {usuarios.map(usuario => (
              <SelectItem key={usuario.id} value={usuario.id.toString()}>
                {usuario.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.id_usuario && <p className="text-red-500 text-sm">{errors.id_usuario}</p>}
      </div>
      
      <div className="space-y-1">
        <Label>Fecha</Label>
        <Input 
          type="date" 
          value={formData.fecha} 
          onChange={e => handleChange('fecha', e.target.value)} 
        />
        {errors.fecha && <p className="text-red-500 text-sm">{errors.fecha}</p>}
      </div>
      
      <div className="space-y-1">
        <Label>Hora</Label>
        <Input 
          type="time" 
          step="1"
          value={formData.hora} 
          onChange={e => handleChange('hora', e.target.value)} 
        />
        {errors.hora && <p className="text-red-500 text-sm">{errors.hora}</p>}
      </div>
      
      <div className="space-y-1">
        <Label>Tipo</Label>
        <Select value={formData.tipo} onValueChange={value => handleChange('tipo', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entrada">Entrada</SelectItem>
            <SelectItem value="salida">Salida</SelectItem>
          </SelectContent>
        </Select>
        {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>{item ? 'Actualizar' : 'Crear'}</Button>
        {onCancel && (
          <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}