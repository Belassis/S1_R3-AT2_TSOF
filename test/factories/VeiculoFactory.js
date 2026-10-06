import { connection } from '../../src/configs/Database.js';

export class VeiculoFactory {
    static async create(modelo, placa, ano, cor, valor, idCliente, idMontadora) {
        const [result] = await connection.execute(
            'INSERT INTO veiculos (Modelo, Placa, Ano, Cor, Valor, IdCliente, IdMontadora) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [modelo, placa, ano, cor, valor, idCliente, idMontadora]
        );

        return {
            id: result.insertId,
            modelo,
            placa,
            ano,
            cor,
            valor,
            idCliente,
            idMontadora
        }
    }
}