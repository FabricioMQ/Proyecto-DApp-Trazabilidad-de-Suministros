export function formatFriendlyError(error) {
  const raw = error?.message || '';

  if (raw.includes('reverted') && raw.includes('reason')) {
    const match = raw.match(/reason:\s(.+?)\sContract Call:/);
    if (match && match[1]) {
      return `La transacción fue revertida: ${match[1]}`;
    }
  }

  if (raw.includes('Internal JSON-RPC error')) {
    return 'Error interno al ejecutar la transacción. Verifica permisos o parámetros.';
  }

  if (raw.includes('sender')) {
    return 'No tienes permisos para ejecutar esta acción.';
  }

  return 'La transacción falló. Intenta nuevamente o revisa los datos.';
}