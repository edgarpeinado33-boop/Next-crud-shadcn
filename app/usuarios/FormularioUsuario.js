'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Button } from '@/app/components/ui/button'

export default function FormularioUsuario({ usuario = null, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({ 
    nombre: '', 
    username: '', 
    email: '', 
    password: '', 
    edad: '' 
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (usuario) {
      setFormData({ 
        ...usuario, 
        edad: usuario.edad?.toString() || '',
        password: '' // No mostrar password existente por seguridad
      })
    } else {
      setFormData({ 
        nombre: '', 
        username: '', 
        email: '', 
        password: '', 
        edad: '' 
      })
    }
  }, [usuario])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validar = () => {
    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido'
    if (!formData.username.trim()) newErrors.username = 'Username requerido'
    if (!formData.email.trim()) newErrors.email = 'Email requerido'
    if (!formData.edad || parseInt(formData.edad) <= 0) newErrors.edad = 'Edad válida requerida'
    
    // Solo validar password si es nuevo usuario o si se está cambiando
    if (!usuario && !formData.password.trim()) {
      newErrors.password = 'Password requerido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (validar()) {
      const datosEnviar = { 
        ...formData, 
        edad: parseInt(formData.edad) 
      }
      
      // Si es edición y no se cambió el password, no enviarlo
      if (usuario && !formData.password) {
        delete datosEnviar.password
      }
      
      onSubmit(datosEnviar)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label>Nombre *</Label>
        <Input 
          value={formData.nombre} 
          onChange={e => handleInputChange('nombre', e.target.value)} 
          placeholder="Ingrese el nombre completo"
        />
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
      </div>
      
      <div className="space-y-1">
        <Label>Username *</Label>
        <Input 
          value={formData.username} 
          onChange={e => handleInputChange('username', e.target.value)} 
          placeholder="Ingrese el nombre de usuario"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
      </div>
      
      <div className="space-y-1">
        <Label>Email *</Label>
        <Input 
          type="email"
          value={formData.email} 
          onChange={e => handleInputChange('email', e.target.value)} 
          placeholder="ejemplo@correo.com"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      
      <div className="space-y-1">
        <Label>Password {!usuario && '*'}</Label>
        <Input 
          type="password"
          value={formData.password} 
          onChange={e => handleInputChange('password', e.target.value)} 
          placeholder={usuario ? "Dejar vacío para mantener actual" : "Ingrese la contraseña"}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        {usuario && (
          <p className="text-xs text-gray-500">Dejar vacío para mantener la contraseña actual</p>
        )}
      </div>
      
      <div className="space-y-1">
        <Label>Edad *</Label>
        <Input 
          type="number" 
          min="1"
          value={formData.edad} 
          onChange={e => handleInputChange('edad', e.target.value)} 
          placeholder="Ingrese la edad"
        />
        {errors.edad && <p className="text-red-500 text-sm">{errors.edad}</p>}
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Guardando...' : (usuario ? 'Actualizar' : 'Crear')}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}