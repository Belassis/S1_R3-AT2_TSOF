import { connection } from '../configs/Database.js';

const clienteRepository = {
    criar: async (cliente) => {
        const sql = `
            INSERT INTO clientes
                (Nome, CPF, CEP, Logradouro, Bairro, Cidade, UF, Numero, Complemento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [
            cliente.nome,
            cliente.cpf,
            cliente.cep,
            cliente.logradouro,
            cliente.bairro,
            cliente.cidade,
            cliente.uf,
            cliente.numero,
            cliente.complemento
        ];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    editar: async (cliente) => {
        const sql = `
            UPDATE clientes
            SET Nome = ?, CPF = ?, CEP = ?, Logradouro = ?, Bairro = ?, Cidade = ?, UF = ?, Numero = ?, Complemento = ?
            WHERE Id = ?;
        `;
        const values = [
            cliente.nome,
            cliente.cpf,
            cliente.cep,
            cliente.logradouro,
            cliente.bairro,
            cliente.cidade,
            cliente.uf,
            cliente.numero,
            cliente.complemento,
            cliente.id
        ];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = await clienteRepository.deletar(id);

            // Verifica se algum cliente foi excluído
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    message: "Cliente não encontrado",
                    data: {}
                });
            }

            res.status(200).json({
                message: 'Cliente deletado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao deletar cliente',
                error: error.message
            });
        }
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM clientes ORDER BY Nome;';
        const [rows] = await connection.execute(sql);
        return rows;
    }
};

export default clienteRepository;