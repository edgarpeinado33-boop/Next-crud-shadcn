import { supabase } from './supabase'

export async function obtenerCargosUsuarios() {
  try {
    const { data, error } = await supabase.from('cargos_usuarios').select('*').order('id', { ascending: true })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function crearCargoUsuario(cargoUsuario) {
  try {
    const { data, error } = await supabase.from('cargos_usuarios').insert([cargoUsuario]).select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function actualizarCargoUsuario(id, cargoUsuario) {
  try {
    const { data, error } = await supabase.from('cargos_usuarios').update(cargoUsuario).eq('id', id).select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function eliminarCargoUsuario(id) {
  try {
    const { error } = await supabase.from('cargos_usuarios').delete().eq('id', id)
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}
