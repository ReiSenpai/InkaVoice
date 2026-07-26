import React from 'react';
import { Redirect } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function IndexScreen() {
  const { token } = useUser();

  // Si NO hay token (usuario nuevo o que no ha iniciado sesión)
  // Lo enviamos a la pantalla de bienvenida
  if (!token) {
    return <Redirect href="/welcome" />;
  }

  // Si SÍ hay token (usuario con sesión activa)
  // Lo enviamos directo al sistema de pestañas (Home)
  return <Redirect href="/(tabs)" />;
}