// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistroAuditoria {
    // Guarda la direccion de quien creo el contrato 
    address private  immutable propietario;  
    // Guarda la direccion central o contrato que puede ejecutar este contrato , es por segurida
    address private logicaCadenaSuministro;
    //Evento para los cambios de estado de un producto y si cambia de  usuario
    event EstadoCambiado(uint indexed idProducto, string  estadoAnterior, string  nuevoEstado, address  quienCambia, uint indexed timestamp);
    event ProductoMovido(uint indexed idProducto,  address  desde, address  hacia, uint  timestamp);
    
    // para restringir que las funciones solo el propietario las pueda ejecutar
    modifier soloPropietario() {
        require(msg.sender == propietario, "No eres el propietario");
        _;
    }
     //Para restringir que la logica de cadena en este caso el contrato principal ejecute las funciones nadie mas 
    modifier soloLogicaCadenaSuministro() {
        require(msg.sender == logicaCadenaSuministro, "Solo LogicaCadenaSuministro puede llamar");
        _;
    }

    constructor() {
        propietario = msg.sender;
    }
    // esta funcion es para indicar cual es el contrato principal
    function setLogicaCadenaSuministro(address logica) external soloPropietario {
        logicaCadenaSuministro = logica;
    }
    //Esta funcion ejecuta el evento estadocambiado que solo puede la logica puede ejecutarlo
    function registrarCambioEstado(uint idProducto,string calldata estadoAnterior, string calldata nuevoEstado,address  quienCambia) external soloLogicaCadenaSuministro {
        emit EstadoCambiado(idProducto, estadoAnterior, nuevoEstado, quienCambia, block.timestamp);
    }
    //Esta funcion ejecuta el evento productomovido que solo logica puede ejecutarlo 
    function registrarMovimiento(uint idProducto,address desde, address hacia) external soloLogicaCadenaSuministro {
        emit ProductoMovido(idProducto, desde, hacia, block.timestamp);
    }
}
