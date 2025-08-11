// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistroProductos {
    // Guarda la direccion de quien creo el contrato 
    address public propietario;
    // Guarda la direccion central o contrato que puede ejecutar este contrato , es por segurida
    address public logicaCadenaSuministro;
    //estrucutra del producto
    struct Producto {
        uint id; //Id del producto
        string descripcion; //descripcion del producto por ejemplo caja de manzana 2 kg
        address actualPoseedor; //direccion de quien tiene el producto actualmente
        bool existe;
    }
    //mapping para guardar los productos
    mapping(uint => Producto) private productos;

    //eventos que guarda los productos creados y si el producto se actualiza 
    event ProductoCreado(uint indexed idProducto, string indexed descripcion, address indexed poseedor);
    event PoseedorProductoActualizado(uint indexed idProducto, address indexed nuevoPoseedor);

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
    //esta funcion es para crear producto , solol la logica puede ejecutarlo 
    function crearProductoDesdeLogica(uint idProducto, string calldata descripcion, address poseedorInicial) external soloLogicaCadenaSuministro {
        require(!productos[idProducto].existe, "Producto ya existe");

        productos[idProducto] = Producto(idProducto, descripcion, poseedorInicial, true);
        emit ProductoCreado(idProducto, descripcion, poseedorInicial);
    }
    //Esta funcion es para actualizar el que tiene el producto , solo logica puede ejecutarlo
    function actualizarPoseedor(uint idProducto, address nuevoPoseedor) external soloLogicaCadenaSuministro {
        require(productos[idProducto].existe, "Producto no existe");

        productos[idProducto].actualPoseedor = nuevoPoseedor;
        emit PoseedorProductoActualizado(idProducto, nuevoPoseedor);
    }
    //Para comprobar si existe un producto cualquiera puede ejecutarlo
    function existeProducto(uint idProducto) external view returns (bool) {
        return productos[idProducto].existe;
    }
    //Para ver quien es el possedor de un producto actualmente
    function obtenerPoseedor(uint idProducto) external view returns (address) {
        require(productos[idProducto].existe, "Producto no existe");
        return productos[idProducto].actualPoseedor;
    }
    //Para obtener la descripcion de un producto actualemtne
    function obtenerDescripcion(uint idProducto) external view returns (string memory) {
        require(productos[idProducto].existe, "Producto no existe");
        return productos[idProducto].descripcion;
    }
}
