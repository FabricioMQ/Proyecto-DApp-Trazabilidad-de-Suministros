// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GestorPermisos {
    address public propietario;
    address public logicaCadenaSuministro;

    mapping(uint => mapping(address => bool)) private permisos;

    event PermisoOtorgado(uint  idProducto, address  usuario);
    event PermisoRevocado(uint  idProducto, address  usuario);

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

   
    function otorgarPermiso(uint idProducto, address usuario) external soloLogicaCadenaSuministro {
        permisos[idProducto][usuario] = true;
        emit PermisoOtorgado(idProducto, usuario);
    }


    function revocarPermiso(uint idProducto, address usuario) external soloLogicaCadenaSuministro {
        permisos[idProducto][usuario] = false;
        emit PermisoRevocado(idProducto, usuario);
    }

    function tienePermiso(uint idProducto, address usuario) external view returns (bool) {
        return permisos[idProducto][usuario];
    }
}
