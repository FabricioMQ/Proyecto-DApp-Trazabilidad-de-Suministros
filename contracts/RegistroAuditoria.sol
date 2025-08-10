// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistroAuditoria {
    address public propietario;
    address public logicaCadenaSuministro;

    event EstadoCambiado(uint idProducto, string estadoAnterior, string nuevoEstado, address quienCambia, uint timestamp);
    event ProductoMovido(uint idProducto,  address desde, address hacia, uint timestamp);

    modifier soloPropietario() {
        require(msg.sender == propietario, "No eres el propietario");
        _;
    }

    modifier soloLogicaCadenaSuministro() {
        require(msg.sender == logicaCadenaSuministro, "Solo LogicaCadenaSuministro puede llamar");
        _;
    }

    constructor() {
        propietario = msg.sender;
    }

    function setLogicaCadenaSuministro(address logica) external soloPropietario {
        logicaCadenaSuministro = logica;
    }

    function registrarCambioEstado(uint idProducto,string calldata estadoAnterior, string calldata nuevoEstado) external soloLogicaCadenaSuministro {
        emit EstadoCambiado(idProducto, estadoAnterior, nuevoEstado, msg.sender, block.timestamp);
    }

    function registrarMovimiento(uint idProducto,address desde, address hacia) external soloLogicaCadenaSuministro {
        emit ProductoMovido(idProducto, desde, hacia, block.timestamp);
    }
}
