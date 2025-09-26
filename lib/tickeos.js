import { supabase } from './supabase'

export async function obtenerTickeos() {
  try {
    const { data, error } = await supabase.from('tickeos').select('*').order('id', { ascending: true })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function crearTickeo(tickeo) {
  try {
    const { data, error } = await supabase.from('tickeos').insert([tickeo]).select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function actualizarTickeo(id, tickeo) {
  try {
    const { data, error } = await supabase.from('tickeos').update(tickeo).eq('id', id).select()
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function eliminarTickeo(id) {
  try {
    const { error } = await supabase.from('tickeos').delete().eq('id', id)
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}
