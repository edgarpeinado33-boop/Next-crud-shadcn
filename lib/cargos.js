import { supabase } from './supabase'

export async function obtenerCargos() {
  try {
    const { data, error } = await supabase.from('cargos').select('*').order('id', { ascending: true })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function crearCargo(cargo) {
  try {
    const { data, error } = await supabase.from('cargos').insert([cargo]).select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function actualizarCargo(id, cargo) {
  try {
    const { data, error } = await supabase.from('cargos').update(cargo).eq('id', id).select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function eliminarCargo(id) {
  try {
    const { error } = await supabase.from('cargos').delete().eq('id', id)
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}
