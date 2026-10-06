import app from '../app.js'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { clearDatabase } from './clearDatabase.js'

import { ClienteFactory } from '../../test/factories/ClienteFactory.js'
import clienteRepository from '../repositories/clienteRepository.js'
import veiculoRepository from '../repositories/veiculoRepository.js'
import { MontadoraFactory } from '../../test/factories/MontadoraFactory.js'
import { VeiculoFactory } from '../../test/factories/VeiculoFactory.js'

describe('API de montadoras', () => {

    beforeEach(async () => {
        vi.clearAllMocks();
    });

    afterEach(async () => {
        await clearDatabase();
        vi.resetAllMocks();
    });

    // CT-001
    it('deve cadastrar um cliente com sucesso', async () => {
        const response = await request(app)
            .post('/clientes')
            .send({
                nome: 'João Silva',
                cpf: '12345678900',
                cep: '01001000',
                numero: '100',
                complemento: 'Casa'
            });

        expect(response.status).toBe(201);
    });
    // CT-002
    it('deve editar um cliente com sucesso', async () => {
        const cliente = await ClienteFactory.create(
            'João Silva',
            '12345678900',
            '01001000',
            'Praça da Sé',
            'Sé',
            'São Paulo',
            'SP',
            '100',
            'Casa'
        );

        vi.spyOn(clienteRepository, 'editar').mockResolvedValue({
            affectedRows: 1
        });

        const response = await request(app)
            .put(`/clientes?id=${cliente.id}`)
            .send({
                nome: 'João Santos',
                cpf: '98765432100',
                cep: '01001000',
                numero: '200',
                complemento: 'Apartamento'
            });

        expect(response.status).toBe(200);
        expect(clienteRepository.editar).toHaveBeenCalledTimes(1);
    });

    // CT-003
    it('deve cadastrar um veículo com sucesso', async () => {

        const cliente = await ClienteFactory.create(
            'João Silva',
            '12345678900',
            '01001000',
            'Praça da Sé',
            'Sé',
            'São Paulo',
            'SP',
            '100',
            'Casa'
        );

        const montadora = await MontadoraFactory.create(
            'Toyota',
            'Japão'
        );

        const response = await request(app)
            .post('/veiculos')
            .send({
                modelo: 'Corolla',
                placa: 'ABC1234',
                ano: 2025,
                cor: 'Prata',
                valor: 120000,
                idCliente: cliente.id,
                idMontadora: montadora.id
            });

        expect(response.status).toBe(201);
    });

    // CT-004
    it('deve cadastrar uma nova montadora com sucesso', async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({
                nome: 'Hyundai',
                pais: 'Coreia do Sul'
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('insertId');
    });

    // CT-005
    it('deve listar todos os clientes já cadastrados', async () => {

        await ClienteFactory.create(
            'João Silva',
            '12345678900',
            '01001000',
            'Praça da Sé',
            'Sé',
            'São Paulo',
            'SP',
            '100',
            'Casa'
        );

        const response = await request(app)
            .get('/clientes');

        expect(response.status).toBe(200);
    });

    // CT-006
    it('deve excluir um cliente com sucesso', async () => {

        const cliente = await ClienteFactory.create(
            'João Silva',
            '12345678900',
            '01001000',
            'Praça da Sé',
            'Sé',
            'São Paulo',
            'SP',
            '100',
            'Casa'
        );

        const response = await request(app)
            .delete(`/clientes/${cliente.id}`);

        expect(response.status).toBe(200);
    });

    // CT-007
    it('deve excluir um veículo com sucesso', async () => {

        const cliente = await ClienteFactory.create(
            'João Silva',
            '12345678900',
            '01001000',
            'Praça da Sé',
            'Sé',
            'São Paulo',
            'SP',
            '100',
            'Casa'
        );

        const montadora = await MontadoraFactory.create(
            'Toyota',
            'Japão'
        );

        const veiculo = await VeiculoFactory.create(
            'Corolla',
            'ABC1234',
            2025,
            'Prata',
            120000,
            cliente.id,
            montadora.id
        );

        const response = await request(app)
            .delete(`/veiculos/${veiculo.id}`);

        expect(response.status).toBe(200);
    });

    // CT-008
    it('deve editar uma montadora com sucesso', async () => {
        const montadora = await MontadoraFactory.create(
            'Toyota',
            'Japão'
        );

        const response = await request(app)
            .put(`/montadoras?id=${montadora.id}`)
            .send({
                nome: 'Hyundai',
                pais: 'Coreia do Sul'
            });

        expect(response.status).toBe(200);
    });

    // CT-009
    it('deve excluir uma montadora com sucesso', async () => {

        const montadora = await MontadoraFactory.create(
            'Toyota',
            'Japão'
        );

        const response = await request(app)
            .delete(`/montadoras/${montadora.id}`);

        expect(response.status).toBe(200);
    });

    // CT-010
    it('deve editar um veículo com sucesso', async () => {

        const cliente = await ClienteFactory.create(
            'João Silva',
            '12345678900',
            '01001000',
            'Praça da Sé',
            'Sé',
            'São Paulo',
            'SP',
            '100',
            'Casa'
        );

        const montadora = await MontadoraFactory.create(
            'Toyota',
            'Japão'
        );

        const veiculo = await VeiculoFactory.create(
            'Corolla',
            'ABC1234',
            2025,
            'Prata',
            120000,
            cliente.id,
            montadora.id
        );

        vi.spyOn(veiculoRepository, 'editar').mockResolvedValue({
            affectedRows: 1
        });

        const response = await request(app)
            .put(`/veiculos?id=${veiculo.id}`)
            .send({
                modelo: 'Hilux',
                placa: 'XYZ5678',
                ano: 2026,
                cor: 'Preto',
                valor: 180000,
                idCliente: cliente.id,
                idMontadora: montadora.id
            });

        expect(response.status).toBe(200);
        expect(veiculoRepository.editar).toHaveBeenCalledTimes(1);
    });

});