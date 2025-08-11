// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GestorPermisos {
    // Guarda la direccion de quien creo el contrato 
    address public propietario;
    // Guarda la direccion central o contrato que puede ejecutar este contrato , es por segurida
    address public logicaCadenaSuministro;

    //Mapping de los productos y quien tiene permiso sobre el en este caso guarda solo el ID 
    mapping(uint => mapping(address => bool)) private permisos;

    //Evento que indica que se otorgo permiso o revoco a un usuario en x producto 
    event PermisoOtorgado(uint indexed idProducto, address indexed usuario);
    event PermisoRevocado(uint indexed idProducto, address indexed usuario);

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

   //estra funcion es para otorgar permiso y ejecuta el evento , solo la logica 
    function otorgarPermiso(uint idProducto, address usuario) external soloLogicaCadenaSuministro {
        permisos[idProducto][usuario] = true;
        emit PermisoOtorgado(idProducto, usuario);
    }

    //esta funcion es para revocar persmiso y ejecuta el evento  solo la logica 
    function revocarPermiso(uint idProducto, address usuario) external soloLogicaCadenaSuministro {
        permisos[idProducto][usuario] = false;
        emit PermisoRevocado(idProducto, usuario);
    }
    //estra funcion es para ver que usuario tiene permiso a x producto , es publica 
    function tienePermiso(uint idProducto, address usuario) external view returns (bool) {
        return permisos[idProducto][usuario];
    }
}
