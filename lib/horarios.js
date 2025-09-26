import { supabase } from './supabase'

export async function obtenerHorarios() {
  try {
    const { data, error } = await supabase.from('horarios').select('*').order('id', { ascending: true })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function crearHorario(horario) {
  try {
    const { data, error } = await supabase.from('horarios').insert([horario]).select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function actualizarHorario(id, horario) {
  try {
    const { data, error } = await supabase.from('horarios').update(horario).eq('id', id).select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function eliminarHorario(id) {
  try {
    const { error } = await supabase.from('horarios').delete().eq('id', id)
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}
