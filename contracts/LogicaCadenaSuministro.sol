// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Todas estas interfaces  definen las funciones esperada de cada contrato 
interface IRegistroProductos {
    function existeProducto(uint idProducto) external view returns (bool);
    function obtenerPoseedor(uint idProducto) external view returns (address);
    function crearProductoDesdeLogica(uint idProducto, string calldata descripcion, address poseedorInicial) external;
    function actualizarPoseedor(uint idProducto, address nuevoPoseedor) external;
}

interface IRegistroUsuarios {
    enum TipoUsuario { Ninguno, Productor, Transportista, Distribuidor }
    function obtenerTipoUsuario(address usuario) external view returns (TipoUsuario);
}

interface IGestorPermisos {
    function otorgarPermiso(uint idProducto, address usuario) external;
    function revocarPermiso(uint idProducto, address usuario) external;
    function tienePermiso(uint idProducto, address usuario) external view returns (bool);
}

interface IRegistroAuditoria {
    function registrarCambioEstado(uint idProducto, string calldata estadoAnterior, string calldata nuevoEstado) external;
    function registrarMovimiento(uint idProducto, address desde, address hacia) external;
}

contract LogicaCadenaSuministro {
    IRegistroProductos private  immutable registroProductos;
    IRegistroUsuarios private  immutable registroUsuarios;
    IGestorPermisos private  immutable gestorPermisos;
    IRegistroAuditoria private  immutable registroAuditoria;
    // Mapping que guarda el estado de cada producto seria el 1 del producto y si su estado 
    mapping(uint => string) private estadosProducto;

    //eventos para cuando se actualiza el estado de producto ,se transfiere o se crea
    event EstadoProductoActualizado(uint indexed idProducto, string nuevoEstado);
    event ProductoTransferido(uint indexed idProducto, address indexed desde, address indexed hacia);
    event ProductoCreado(uint indexed idProducto, string descripcion, address indexed productor);

    //Esta restriccion es para que solo la persona que tiene permiso en x producto pueda modificarlo 
    modifier soloConPermiso(uint idProducto) {
        require(gestorPermisos.tienePermiso(idProducto, msg.sender), "No tienes permiso para modificar este producto");
        _;
    }

    // El constructor recibe las direcciones de los otros contratos
    constructor(
        address _registroProductos,
        address _registroUsuarios,
        address _gestorPermisos,
        address _registroAuditoria
    ) {
        //Es esta parte se crea las interfaces en el constructor y se guardan en un tipo de dato de cada interface con el address para vicular
        registroProductos = IRegistroProductos(_registroProductos);
        registroUsuarios = IRegistroUsuarios(_registroUsuarios);
        gestorPermisos = IGestorPermisos(_gestorPermisos);
        registroAuditoria = IRegistroAuditoria(_registroAuditoria);
    }
    //Esta funcion crea el producto  y usa los otros contratos 
    function crearProducto(uint idProducto, string calldata descripcion) external {
        IRegistroUsuarios.TipoUsuario tipo = registroUsuarios.obtenerTipoUsuario(msg.sender);
        require(tipo == IRegistroUsuarios.TipoUsuario.Productor, "Solo productores pueden crear productos");
        require(!registroProductos.existeProducto(idProducto), "Producto ya existe");

        registroProductos.crearProductoDesdeLogica(idProducto, descripcion, msg.sender);

        gestorPermisos.otorgarPermiso(idProducto, msg.sender);

        emit ProductoCreado(idProducto, descripcion, msg.sender);
    }
    // Esta funcion acttualiza el estado del producto 
    function actualizarEstadoProducto(uint idProducto, string calldata nuevoEstado) external {
        require(registroProductos.existeProducto(idProducto), "Producto no existe");

        // Verificar que el usuario tenga permiso para modificar este producto
        require(gestorPermisos.tienePermiso(idProducto, msg.sender), "No tienes permiso para modificar este producto");

        IRegistroUsuarios.TipoUsuario tipo = registroUsuarios.obtenerTipoUsuario(msg.sender);
        require(tipo != IRegistroUsuarios.TipoUsuario.Ninguno, "Usuario no registrado");

        string memory estadoAnterior = estadosProducto[idProducto];
        estadosProducto[idProducto] = nuevoEstado;

        registroAuditoria.registrarCambioEstado(idProducto, estadoAnterior, nuevoEstado);
        emit EstadoProductoActualizado(idProducto, nuevoEstado);
    }
    //esta funcion es para transferir el producto la logica es de productor a transportitas y este a distribuidor 
    function transferirProducto(uint idProducto, address hacia) external {
        require(registroProductos.existeProducto(idProducto), "Producto no existe");

        // Verificar que el usuario tenga permiso para modificar este producto
        require(gestorPermisos.tienePermiso(idProducto, msg.sender), "No tienes permiso para modificar este producto");

        address poseedorActual = registroProductos.obtenerPoseedor(idProducto);
        require(msg.sender == poseedorActual, "No eres quien posee el producto");

        IRegistroUsuarios.TipoUsuario tipoActual = registroUsuarios.obtenerTipoUsuario(msg.sender);
        IRegistroUsuarios.TipoUsuario tipoDestino = registroUsuarios.obtenerTipoUsuario(hacia);

        require(tipoDestino != IRegistroUsuarios.TipoUsuario.Ninguno, "Destinatario no registrado");

        require(
            (tipoActual == IRegistroUsuarios.TipoUsuario.Productor && tipoDestino == IRegistroUsuarios.TipoUsuario.Transportista) ||
            (tipoActual == IRegistroUsuarios.TipoUsuario.Transportista && tipoDestino == IRegistroUsuarios.TipoUsuario.Distribuidor),
            "Transferencia no permitida entre estos roles"
        );

        // Actualizar poseedor
        registroProductos.actualizarPoseedor(idProducto, hacia);

        // Revocar permiso al poseedor anterior y otorgar permiso al nuevo poseedor
        gestorPermisos.revocarPermiso(idProducto, msg.sender);
        gestorPermisos.otorgarPermiso(idProducto, hacia);

        registroAuditoria.registrarMovimiento(idProducto, msg.sender, hacia);
        emit ProductoTransferido(idProducto, msg.sender, hacia);
    }

}
