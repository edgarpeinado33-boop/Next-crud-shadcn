'use client'
import { useState, useEffect } from 'react'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export default function FormularioCargoUsuario({ item = null, usuarios = [], cargos = [], onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({ id_usuario: '', id_cargo: '', fecha_inicio: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => { 
    if (item) {
      setFormData({ ...item })
    } else {
      setFormData({ id_usuario: '', id_cargo: '', fecha_inicio: '' })
    }
  }, [item])

  const handleChange = (field, value) => { 
    setFormData(prev => ({ ...prev, [field]: value })); 
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined })) 
  }

  const validar = () => {
    const newErrors = {}
    if (!formData.id_usuario) newErrors.id_usuario = 'Usuario requerido'
    if (!formData.id_cargo) newErrors.id_cargo = 'Cargo requerido'
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'Fecha inicio requerida'
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
        <Label>Cargo</Label>
        <Select value={formData.id_cargo} onValueChange={value => handleChange('id_cargo', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar cargo" />
          </SelectTrigger>
          <SelectContent>
            {cargos.map(cargo => (
              <SelectItem key={cargo.id} value={cargo.id.toString()}>
                {cargo.cargo} {/* Cambiado a cargo.cargo */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.id_cargo && <p className="text-red-500 text-sm">{errors.id_cargo}</p>}
      </div>
      
      <div className="space-y-1">
        <Label>Fecha Inicio</Label>
        <Input 
          type="date" 
          value={formData.fecha_inicio} 
          onChange={e => handleChange('fecha_inicio', e.target.value)} 
        />
        {errors.fecha_inicio && <p className="text-red-500 text-sm">{errors.fecha_inicio}</p>}
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