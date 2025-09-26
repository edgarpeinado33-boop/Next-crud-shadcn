import { supabase } from './supabase'

export async function obtenerUsuarios() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function crearUsuario(usuario) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function actualizarUsuario(id, usuario) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(usuario)
      .eq('id', id)
      .select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function eliminarUsuario(id) {
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}
