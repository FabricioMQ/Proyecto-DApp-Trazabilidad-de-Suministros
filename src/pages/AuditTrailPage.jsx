import { useState } from 'react';
import { Pagination } from 'flowbite-react';
import { useAuditTrail } from '../blockchain/hooks/useAuditTrail';

export function AuditTrailPage() {
  const { estadoLogs, movimientoLogs } = useAuditTrail();
  const [idProductoFiltro, setIdProductoFiltro] = useState('');
  const [estadoPage, setEstadoPage] = useState(1);
  const [movimientoPage, setMovimientoPage] = useState(1);
  const itemsPerPage = 10;

  const formatFechaHora = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return {
      fecha: date.toLocaleDateString(),
      hora: date.toLocaleTimeString(),
    };
  };

  const estadoFiltrados = estadoLogs
    .filter(log =>
      log.args && (idProductoFiltro === '' || log.args.idProducto?.toString() === idProductoFiltro)
    )
    .sort((a, b) => Number(b.args?.timestamp) - Number(a.args?.timestamp));

  const movimientoFiltrados = movimientoLogs
    .filter(log =>
      log.args && (idProductoFiltro === '' || log.args.idProducto?.toString() === idProductoFiltro)
    )
    .sort((a, b) => Number(b.args?.timestamp) - Number(a.args?.timestamp));

  const estadoPaginados = estadoFiltrados.slice(
    (estadoPage - 1) * itemsPerPage,
    estadoPage * itemsPerPage
  );

  const movimientoPaginados = movimientoFiltrados.slice(
    (movimientoPage - 1) * itemsPerPage,
    movimientoPage * itemsPerPage
  );

  return (
    <div className="min-h-screen p-6 space-y-10 bg-background text-text-primary">
      <h1 className="text-2xl font-bold text-primary">📊 Trazabilidad Completa</h1>

      <div className="flex items-center gap-4">
        <label htmlFor="idProducto" className="text-lg font-medium text-accent">
          Filtrar por ID de Producto:
        </label>
        <input
          id="idProducto"
          type="text"
          value={idProductoFiltro}
          onChange={(e) => {
            setIdProductoFiltro(e.target.value);
            setEstadoPage(1);
            setMovimientoPage(1);
          }}
          placeholder="Ej. 123"
          className="px-3 py-2 text-black bg-white border rounded-md border-border"
        />
      </div>

      {/* Tabla de EstadoCambiado */}
      <section>
        <h2 className="mt-6 text-xl font-semibold text-accent">🛠️ Cambios de Estado</h2>
        {estadoFiltrados.length === 0 ? (
          <p className="text-text-secondary">No hay cambios de estado para ese ID.</p>
        ) : (
          <>
            <table className="w-full mt-4 text-sm border border-border">
              <thead className="text-white bg-primary">
                <tr>
                  <th className="p-2 border border-border">ID Producto</th>
                  <th className="p-2 border border-border">Estado Anterior</th>
                  <th className="p-2 border border-border">Nuevo Estado</th>
                  <th className="p-2 border border-border">Quién Cambia</th>
                  <th className="p-2 border border-border">Fecha</th>
                  <th className="p-2 border border-border">Hora</th>
                </tr>
              </thead>
              <tbody>
                {estadoPaginados.map((log, i) => {
                  const { fecha, hora } = formatFechaHora(log.args?.timestamp);
                  return (
                    <tr key={i} className="hover:bg-gray-100">
                      <td className="p-2 border border-border">{log.args?.idProducto?.toString() ?? '—'}</td>
                      <td className="p-2 border border-border">{log.args?.estadoAnterior ?? '—'}</td>
                      <td className="p-2 border border-border">{log.args?.nuevoEstado ?? '—'}</td>
                      <td className="p-2 border border-border">{log.args?.quienCambia ?? '—'}</td>
                      <td className="p-2 border border-border">{fecha}</td>
                      <td className="p-2 border border-border">{hora}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={estadoPage}
                totalPages={Math.ceil(estadoFiltrados.length / itemsPerPage)}
                onPageChange={setEstadoPage}
                showIcons
                previousLabel="Anterior"
                nextLabel="Siguiente"
              />
            </div>
          </>
        )}
      </section>

      {/* Tabla de ProductoMovido */}
      <section>
        <h2 className="mt-6 text-xl font-semibold text-accent">🚚 Movimientos de Producto</h2>
        {movimientoFiltrados.length === 0 ? (
          <p className="text-text-secondary">No hay movimientos para ese ID.</p>
        ) : (
          <>
            <table className="w-full mt-4 text-sm border border-border">
              <thead className="text-white bg-primary">
                <tr>
                  <th className="p-2 border border-border">ID Producto</th>
                  <th className="p-2 border border-border">Desde</th>
                  <th className="p-2 border border-border">Hacia</th>
                  <th className="p-2 border border-border">Fecha</th>
                  <th className="p-2 border border-border">Hora</th>
                </tr>
              </thead>
              <tbody>
                {movimientoPaginados.map((log, i) => {
                  const { fecha, hora } = formatFechaHora(log.args?.timestamp);
                  return (
                    <tr key={i} className="hover:bg-gray-100">
                      <td className="p-2 border border-border">{log.args?.idProducto?.toString() ?? '—'}</td>
                      <td className="p-2 border border-border">{log.args?.desde ?? '—'}</td>
                      <td className="p-2 border border-border">{log.args?.hacia ?? '—'}</td>
                      <td className="p-2 border border-border">{fecha}</td>
                      <td className="p-2 border border-border">{hora}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={movimientoPage}
                totalPages={Math.ceil(movimientoFiltrados.length / itemsPerPage)}
                onPageChange={setMovimientoPage}
                showIcons
                previousLabel="Anterior"
                nextLabel="Siguiente"
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}