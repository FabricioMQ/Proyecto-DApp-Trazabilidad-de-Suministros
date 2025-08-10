// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistroUsuarios {
    address public propietario;

    enum TipoUsuario { Ninguno, Productor, Transportista, Distribuidor }
    mapping(address => TipoUsuario) private usuarios;

    event UsuarioRegistrado(address  usuario, TipoUsuario tipo);
    event TipoUsuarioActualizado(address  usuario, TipoUsuario nuevoTipo);

    modifier soloPropietario() {
        require(msg.sender == propietario, "No eres el propietario");
        _;
    }

    constructor() {
        propietario = msg.sender;
    }

    function registrarUsuario(address usuario, TipoUsuario tipo) external soloPropietario {
        require(tipo != TipoUsuario.Ninguno, "Tipo invalido");
        require(usuarios[usuario] == TipoUsuario.Ninguno, "Usuario ya registrado");

        usuarios[usuario] = tipo;
        emit UsuarioRegistrado(usuario, tipo);
    }

    function actualizarTipoUsuario(address usuario, TipoUsuario nuevoTipo) external soloPropietario {
        require(usuarios[usuario] != TipoUsuario.Ninguno, "Usuario no registrado");
        require(nuevoTipo != TipoUsuario.Ninguno, "Tipo invalido");

        usuarios[usuario] = nuevoTipo;
        emit TipoUsuarioActualizado(usuario, nuevoTipo);
    }

    function obtenerTipoUsuario(address usuario) external view returns (TipoUsuario) {
        return usuarios[usuario];
    }
}
