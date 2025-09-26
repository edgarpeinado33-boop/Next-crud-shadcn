
'use client'
import { useState, useEffect } from 'react'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'

export default function FormularioHorario({ item = null, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({ hora_ingreso: '', hora_salida: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => { 
    if (item) {
      // Asegurarse de que la hora tenga el formato correcto HH:MM:SS
      const formatTime = (time) => {
        if (!time) return '';
        // Si ya tiene segundos, mantenerlos
        if (time.includes(':')) {
          const parts = time.split(':');
          if (parts.length === 2) {
            return time + ':00'; // Agregar segundos si no existen
          }
        }
        return time;
      };
      
      setFormData({ 
        hora_ingreso: formatTime(item.hora_ingreso),
        hora_salida: formatTime(item.hora_salida)
      })
    } else {
      setFormData({ hora_ingreso: '', hora_salida: '' })
    }
  }, [item])

  const handleChange = (field, value) => { 
    setFormData(prev => ({ ...prev, [field]: value })); 
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined })) 
  }

  const validar = () => {
    const newErrors = {}
    
    // Validar formato de hora (debe ser HH:MM:SS)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    
    if (!formData.hora_ingreso) {
      newErrors.hora_ingreso = 'Hora de ingreso requerida'
    } else if (!timeRegex.test(formData.hora_ingreso)) {
      newErrors.hora_ingreso = 'Formato inválido. Use HH:MM:SS'
    }
    
    if (!formData.hora_salida) {
      newErrors.hora_salida = 'Hora de salida requerida'
    } else if (!timeRegex.test(formData.hora_salida)) {
      newErrors.hora_salida = 'Formato inválido. Use HH:MM:SS'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => { 
    e.preventDefault(); 
    if (validar()) onSubmit(formData) 
  }

  // Función para manejar el cambio de tiempo y asegurar el formato
  const handleTimeChange = (field, value) => {
    // Si el valor tiene el formato HH:MM, agregar :SS automáticamente
    if (value && value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      value = value + ':00';
    }
    handleChange(field, value);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label>Hora Ingreso (HH:MM:SS)</Label>
        <Input 
          type="time" 
          step="1" // Esto permite seleccionar segundos
          value={formData.hora_ingreso} 
          onChange={e => handleTimeChange('hora_ingreso', e.target.value)} 
          placeholder="00:00:00"
        />
        {errors.hora_ingreso && <p className="text-red-500 text-sm">{errors.hora_ingreso}</p>}
       
      </div>
      <div className="space-y-1">
        <Label>Hora Salida (HH:MM:SS)</Label>
        <Input 
          type="time" 
          step="1" // Esto permite seleccionar segundos
          value={formData.hora_salida} 
          onChange={e => handleTimeChange('hora_salida', e.target.value)} 
          placeholder="17:00:00"
        />
        {errors.hora_salida && <p className="text-red-500 text-sm">{errors.hora_salida}</p>}
        
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>{item ? 'Actualizar' : 'Crear'}</Button>
        {onCancel && <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>Cancelar</Button>}
      </div>
    </form>
  )
}
