
const mensagensValidacao = [
    "ID inválido",
    "Nome inválido",
    "CPF inválido",
    "CEP inválido",
    "Logradouro inválido",
    "Bairro inválido",
    "Cidade inválida",
    "UF inválida",
    "Número inválido",
    "País inválido",
    "ID da montadora inválido",
    "ID do cliente inválido",
    "Modelo inválido",
    "Placa inválida",
    "Ano inválido",
    "Cor inválida",
    "Valor inválido"
];

export function tratarErroValidacao(error, res, mensagem) {
    console.error(error);

    if (mensagensValidacao.includes(error.message)) {
        return res.status(400).json({
            message: mensagem,
            error: error.message
        });
    }

    return res.status(500).json({
        message: mensagem,
        error: error.message
    });
}
