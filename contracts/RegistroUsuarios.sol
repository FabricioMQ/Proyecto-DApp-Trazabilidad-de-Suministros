// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistroUsuarios {
    // Guarda la direccion de quien creo el contrato 
    address private  immutable propietario;
    //enum para los tipos de usuario que se pueden registrar
    enum TipoUsuario { Ninguno, Productor, Transportista, Distribuidor }
    mapping(address => TipoUsuario) private usuarios;
    //eventos para usuarios registrados y actualizacion de usuarios
    event UsuarioRegistrado(address indexed usuario, TipoUsuario  tipo);
    event TipoUsuarioActualizado(address indexed usuario, TipoUsuario  nuevoTipo);

    // Para restrigir las funciones y que solo el propiedario pueda ejecutarlas
    modifier soloPropietario() {
        require(msg.sender == propietario, "No eres el propietario");
        _;
    }

    constructor() {
        propietario = msg.sender;
    }

    //funcion para registrar un usuario
    function registrarUsuario(address usuario, TipoUsuario tipo) external soloPropietario {
        require(tipo != TipoUsuario.Ninguno, "Tipo invalido");
        require(usuarios[usuario] == TipoUsuario.Ninguno, "Usuario ya registrado");

        usuarios[usuario] = tipo;
        emit UsuarioRegistrado(usuario, tipo);
    }
    //funcion para actualizar un usuario
    function actualizarTipoUsuario(address usuario, TipoUsuario nuevoTipo) external soloPropietario {
        require(usuarios[usuario] != TipoUsuario.Ninguno, "Usuario no registrado");
        require(nuevoTipo != TipoUsuario.Ninguno, "Tipo invalido");

        usuarios[usuario] = nuevoTipo;
        emit TipoUsuarioActualizado(usuario, nuevoTipo);
    }
    //funcion para ver informacion sobre un usuario
    function obtenerTipoUsuario(address usuario) external view returns (TipoUsuario) {
        return usuarios[usuario];
    }
}
