import axios from 'axios';

export async function consultarCep(cep) {
    const cepLimpo = String(cep ?? '').replace(/\D+/g, '');

    if (cepLimpo.length !== 8) {
        throw new Error('CEP inválido');
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.data || response.data.erro) {
        throw new Error('CEP não encontrado');
    }

    return {
        cep: cepLimpo,
        logradouro: response.data.logradouro || '',
        bairro: response.data.bairro || '',
        cidade: response.data.localidade || '',
        uf: response.data.uf || ''
    };
}