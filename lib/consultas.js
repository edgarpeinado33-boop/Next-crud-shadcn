import { supabase } from './supabase'

// 1. Listar todos los usuarios con el cargo "Gerente"
export const obtenerGerentes = async () => {
  try {
    console.log('🔍 Buscando usuarios gerentes...');
    
    // Primero obtener los IDs de cargos que son "Gerente"
    const { data: cargos, error: errorCargos } = await supabase
      .from("cargos")
      .select("id")
      .eq("cargo", "Gerente");

    if (errorCargos) {
      console.error('Error al obtener cargos gerentes:', errorCargos);
      return { data: [], error: errorCargos.message };
    }

    const cargoIds = cargos?.map(c => c.id) || [];
    console.log('📋 IDs de cargos gerentes:', cargoIds);
    
    if (!cargoIds.length) {
      console.log('⚠️ No se encontraron cargos con nombre "Gerente"');
      return { data: [], error: null };
    }

    // Obtener las relaciones cargos_usuarios
    const { data: cargosUsuarios, error: errorCargosUsuarios } = await supabase
      .from("cargos_usuarios")
      .select("id_usuario")
      .in("id_cargo", cargoIds);

    if (errorCargosUsuarios) {
      console.error('Error al obtener cargos_usuarios:', errorCargosUsuarios);
      return { data: [], error: errorCargosUsuarios.message };
    }

    const usuarioIds = cargosUsuarios?.map(cu => cu.id_usuario) || [];
    console.log('👤 IDs de usuarios gerentes:', usuarioIds);
    
    if (!usuarioIds.length) {
      console.log('⚠️ No se encontraron usuarios asignados a cargos gerentes');
      return { data: [], error: null };
    }

    // Obtener los datos completos de los usuarios
    const { data: usuariosData, error: errorUsuarios } = await supabase
      .from("usuarios")
      .select("id, nombre, email, username, edad")
      .in("id", usuarioIds);

    if (errorUsuarios) {
      console.error('Error al obtener usuarios:', errorUsuarios);
      return { data: [], error: errorUsuarios.message };
    }

    console.log('✅ Usuarios gerentes encontrados:', usuariosData?.length || 0);
    return { data: usuariosData || [], error: null };

  } catch (error) {
    console.error('❌ Error inesperado en obtenerGerentes:', error);
    return { data: [], error: error.message };
  }
}

// 2. Listar todos los usuarios que ganan más de 5000
export const obtenerUsuariosSueldoAlto = async () => {
  try {
    console.log('💰 Buscando usuarios con sueldo > 5000...');
    
    // Obtener cargos con sueldo mayor a 5000
    const { data: cargos, error: errorCargos } = await supabase
      .from("cargos")
      .select("id, cargo, sueldo")
      .gt("sueldo", 5000)
      .order("sueldo", { ascending: false });

    if (errorCargos) {
      console.error('Error al obtener cargos con sueldo alto:', errorCargos);
      return { data: [], error: errorCargos.message };
    }

    const cargoIds = cargos?.map(c => c.id) || [];
    console.log('📋 Cargos con sueldo > 5000:', cargos);
    
    if (!cargoIds.length) {
      console.log('⚠️ No se encontraron cargos con sueldo mayor a 5000');
      return { data: [], error: null };
    }

    // Obtener las relaciones cargos_usuarios
    const { data: cargosUsuarios, error: errorCargosUsuarios } = await supabase
      .from("cargos_usuarios")
      .select("id_usuario, id_cargo")
      .in("id_cargo", cargoIds);

    if (errorCargosUsuarios) {
      console.error('Error al obtener cargos_usuarios:', errorCargosUsuarios);
      return { data: [], error: errorCargosUsuarios.message };
    }

    const usuarioIds = cargosUsuarios?.map(cu => cu.id_usuario) || [];
    console.log('👤 IDs de usuarios con sueldo alto:', usuarioIds);
    
    if (!usuarioIds.length) {
      console.log('⚠️ No se encontraron usuarios asignados a cargos con sueldo alto');
      return { data: [], error: null };
    }

    // Obtener los datos completos de los usuarios y combinar con información del cargo
    const { data: usuariosData, error: errorUsuarios } = await supabase
      .from("usuarios")
      .select("id, nombre, email, username, edad")
      .in("id", usuarioIds);

    if (errorUsuarios) {
      console.error('Error al obtener usuarios:', errorUsuarios);
      return { data: [], error: errorUsuarios.message };
    }

    // Combinar datos de usuarios con información de sus cargos
    const datosCombinados = usuariosData.map(usuario => {
      const relacion = cargosUsuarios.find(cu => cu.id_usuario === usuario.id);
      const cargo = cargos.find(c => c.id === relacion?.id_cargo);
      
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        username: usuario.username,
        edad: usuario.edad,
        cargo: cargo?.cargo || 'N/A',
        sueldo: cargo?.sueldo || 'N/A'
      };
    });

    // Ordenar por sueldo descendente
    datosCombinados.sort((a, b) => parseFloat(b.sueldo) - parseFloat(a.sueldo));
    
    console.log('✅ Usuarios con sueldo alto encontrados:', datosCombinados.length);
    return { data: datosCombinados, error: null };

  } catch (error) {
    console.error('❌ Error inesperado en obtenerUsuariosSueldoAlto:', error);
    return { data: [], error: error.message };
  }
}

// 3. Listar todos los usuarios que ganan entre 3000 y 6000
export const obtenerUsuariosSueldoMedio = async () => {
  try {
    console.log('💰 Buscando usuarios con sueldo entre 3000 y 6000...');
    
    // Obtener cargos con sueldo entre 3000 y 6000
    const { data: cargos, error: errorCargos } = await supabase
      .from("cargos")
      .select("id, cargo, sueldo")
      .gte("sueldo", 3000)
      .lte("sueldo", 6000)
      .order("sueldo", { ascending: false });

    if (errorCargos) {
      console.error('Error al obtener cargos con sueldo medio:', errorCargos);
      return { data: [], error: errorCargos.message };
    }

    const cargoIds = cargos?.map(c => c.id) || [];
    console.log('📋 Cargos con sueldo 3000-6000:', cargos);
    
    if (!cargoIds.length) {
      console.log('⚠️ No se encontraron cargos con sueldo entre 3000 y 6000');
      return { data: [], error: null };
    }

    // Obtener las relaciones cargos_usuarios
    const { data: cargosUsuarios, error: errorCargosUsuarios } = await supabase
      .from("cargos_usuarios")
      .select("id_usuario, id_cargo")
      .in("id_cargo", cargoIds);

    if (errorCargosUsuarios) {
      console.error('Error al obtener cargos_usuarios:', errorCargosUsuarios);
      return { data: [], error: errorCargosUsuarios.message };
    }

    const usuarioIds = cargosUsuarios?.map(cu => cu.id_usuario) || [];
    console.log('👤 IDs de usuarios con sueldo medio:', usuarioIds);
    
    if (!usuarioIds.length) {
      console.log('⚠️ No se encontraron usuarios asignados a cargos con sueldo medio');
      return { data: [], error: null };
    }

    // Obtener los datos completos de los usuarios y combinar con información del cargo
    const { data: usuariosData, error: errorUsuarios } = await supabase
      .from("usuarios")
      .select("id, nombre, email, username, edad")
      .in("id", usuarioIds);

    if (errorUsuarios) {
      console.error('Error al obtener usuarios:', errorUsuarios);
      return { data: [], error: errorUsuarios.message };
    }

    // Combinar datos de usuarios con información de sus cargos
    const datosCombinados = usuariosData.map(usuario => {
      const relacion = cargosUsuarios.find(cu => cu.id_usuario === usuario.id);
      const cargo = cargos.find(c => c.id === relacion?.id_cargo);
      
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        username: usuario.username,
        edad: usuario.edad,
        cargo: cargo?.cargo || 'N/A',
        sueldo: cargo?.sueldo || 'N/A'
      };
    });

    // Ordenar por sueldo descendente
    datosCombinados.sort((a, b) => parseFloat(b.sueldo) - parseFloat(a.sueldo));
    
    console.log('✅ Usuarios con sueldo medio encontrados:', datosCombinados.length);
    return { data: datosCombinados, error: null };

  } catch (error) {
    console.error('❌ Error inesperado en obtenerUsuariosSueldoMedio:', error);
    return { data: [], error: error.message };
  }
}

// 4. Listar los usuarios que llegaron tarde (después de las 08:00:00)
export const obtenerLlegadasTarde = async () => {
  try {
    console.log('⏰ Buscando llegadas tarde...');
    
    const { data: tickeos, error } = await supabase
      .from("tickeos")
      .select("id, id_usuario, fecha, hora, tipo, usuarios(nombre, email)")
      .eq("tipo", "entrada")
      .gt("hora", "08:00:00")
      .order("fecha", { ascending: false })
      .order("hora", { ascending: false });

    if (error) {
      console.error('Error al obtener llegadas tarde:', error);
      return { data: [], error: error.message };
    }

    console.log('✅ Llegadas tarde encontradas:', tickeos?.length || 0);

    const datosProcesados = (tickeos || []).map(item => ({
      id_usuario: item.id_usuario,
      nombre: item.usuarios?.nombre || 'N/A',
      email: item.usuarios?.email || 'N/A',
      fecha: item.fecha,
      hora_entrada: item.hora,
      hora_limite: '08:00:00',
      estado: 'Llegada tarde'
    }));

    return { data: datosProcesados, error: null };

  } catch (error) {
    console.error('❌ Error inesperado en obtenerLlegadasTarde:', error);
    return { data: [], error: error.message };
  }
}

// 5. Listar los usuarios que se fueron temprano (antes de las 17:30:00)
export const obtenerSalidasTemprano = async () => {
  try {
    console.log('⏰ Buscando salidas temprano...');
    
    const { data: tickeos, error } = await supabase
      .from("tickeos")
      .select("id, id_usuario, fecha, hora, tipo, usuarios(nombre, email)")
      .eq("tipo", "salida")
      .lt("hora", "17:30:00")
      .order("fecha", { ascending: false })
      .order("hora", { ascending: false });

    if (error) {
      console.error('Error al obtener salidas temprano:', error);
      return { data: [], error: error.message };
    }

    console.log('✅ Salidas temprano encontradas:', tickeos?.length || 0);

    const datosProcesados = (tickeos || []).map(item => ({
      id_usuario: item.id_usuario,
      nombre: item.usuarios?.nombre || 'N/A',
      email: item.usuarios?.email || 'N/A',
      fecha: item.fecha,
      hora_salida: item.hora,
      hora_limite: '17:30:00',
      estado: 'Salida temprana'
    }));

    return { data: datosProcesados, error: null };

  } catch (error) {
    console.error('❌ Error inesperado en obtenerSalidasTemprano:', error);
    return { data: [], error: error.message };
  }
}