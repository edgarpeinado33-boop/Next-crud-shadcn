
'use client'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function FormularioCargo({ cargo = null, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({ cargo: '', sueldo: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => { 
    if (cargo) {
      setFormData({ 
        ...cargo, 
        sueldo: cargo.sueldo?.toString() || '' 
      })
    } else {
      setFormData({ cargo: '', sueldo: '' })
    }
  }, [cargo])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validar = () => {
    const newErrors = {}
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo requerido'
    if (!formData.sueldo || parseFloat(formData.sueldo) <= 0) newErrors.sueldo = 'Sueldo válido requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (validar()) onSubmit({ ...formData, sueldo: parseFloat(formData.sueldo) })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label>Cargo</Label>
        <Input 
          value={formData.cargo} 
          onChange={e => handleChange('cargo', e.target.value)} 
          placeholder="Ingrese el nombre del cargo"
        />
        {errors.cargo && <p className="text-red-500 text-sm">{errors.cargo}</p>}
      </div>
      <div className="space-y-1">
        <Label>Sueldo</Label>
        <Input 
          type="number" 
          min="0"
          step="0.01"
          value={formData.sueldo} 
          onChange={e => handleChange('sueldo', e.target.value)} 
          placeholder="Ingrese el sueldo"
        />
        {errors.sueldo && <p className="text-red-500 text-sm">{errors.sueldo}</p>}
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {cargo ? 'Actualizar' : 'Crear'}
        </Button>
        {onCancel && (
          <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
