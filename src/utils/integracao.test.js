import app from '../app.js'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { clearDatabase } from './clearDatabase.js'

import { ClienteFactory } from '../../test/factories/ClienteFactory.js'
import clienteRepository from '../repositories/clienteRepository.js'
import veiculoRepository from '../repositories/veiculoRepository.js'
import { MontadoraFactory } from '../../test/factories/MontadoraFactory.js'
import { VeiculoFactory } from '../../test/factories/VeiculoFactory.js'


describe('API de clientes, veículos e montadoras', () => {

    beforeEach(async () => {
        vi.clearAllMocks();
        await clearDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
        vi.resetAllMocks();
    });

    // Funções auxiliares para criar dados de teste

    async function criarCliente() {
        return await ClienteFactory.create(
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
    }

    async function criarMontadora() {
        return await MontadoraFactory.create(
            'Toyota',
            'Japão'
        );
    }

    async function criarVeiculo() {
        const cliente = await criarCliente();
        const montadora = await criarMontadora();

        return await VeiculoFactory.create(
            'Corolla',
            'ABC1234',
            2025,
            'Prata',
            120000,
            cliente.id,
            montadora.id
        );
    }
    // CLIENTES - CRIAR

    // CT-001 - Positivo
    it('CT-001 - deve cadastrar um cliente com dados válidos', async () => {
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

    // CT-002 - Negativo
    it('CT-002 - deve impedir o cadastro de cliente com dados inválidos', async () => {
        const response = await request(app)
            .post('/clientes')
            .send({
                nome: '',
                cpf: '123',
                cep: '',
                numero: '',
                complemento: 'Casa'
            });

        expect(response.status).toBe(400);
    });

    // CLIENTES - Listar

    // CT-003 - Positivo
    it('CT-003 - deve listar os clientes cadastrados', async () => {
        await criarCliente();

        const response = await request(app)
            .get('/clientes');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    // CT-004 - Negativo
    it('CT-004 - deve retornar uma lista vazia quando não existem clientes', async () => {
        const response = await request(app)
            .get('/clientes');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });

    // CLIENTES - EDITAR

    // CT-005 - Positivo
    it('CT-005 - deve editar um cliente com dados válidos', async () => {
        const cliente = await criarCliente();

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

    // CT-006 - Negativo
    it('CT-006 - deve impedir a edição de cliente com dados inválidos', async () => {
        const cliente = await criarCliente();

        const response = await request(app)
            .put(`/clientes?id=${cliente.id}`)
            .send({
                nome: '',
                cpf: '123',
                cep: '',
                numero: '',
                complemento: 'Casa'
            });

        expect(response.status).toBe(400);
    });

    // CLIENTES - DELETAR

    // CT-007 - Positivo
    it('CT-007 - deve excluir um cliente existente', async () => {
        const cliente = await criarCliente();

        const response = await request(app)
            .delete(`/clientes/${cliente.id}`);

        expect(response.status).toBe(200);
    });

    // CT-008 - Negativo
    it('CT-008 - deve impedir a exclusão de cliente inexistente', async () => {
        const response = await request(app)
            .delete('/clientes/999999');

        expect(response.status).toBe(404);
    });

    // VEÍCULOS - CRIAR

    // CT-009 - Positivo
    it('CT-009 - deve cadastrar um veículo com dados válidos', async () => {
        const cliente = await criarCliente();
        const montadora = await criarMontadora();

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

    // CT-010 - Negativo
    it('CT-010 - deve impedir o cadastro de veículo com dados inválidos', async () => {
        const response = await request(app)
            .post('/veiculos')
            .send({
                modelo: '',
                placa: '',
                ano: 2025,
                cor: 'Prata',
                valor: -100,
                idCliente: 999999,
                idMontadora: 999999
            });

        expect(response.status).toBe(400);
    });

    // VEÍCULOS - LISTAR

    // CT-011 - Positivo
    it('CT-011 - deve listar os veículos cadastrados', async () => {
        await criarVeiculo();

        const response = await request(app)
            .get('/veiculos');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    // CT-012 - Negativo
    it('CT-012 - deve retornar uma lista vazia quando não existem veículos', async () => {
        const response = await request(app)
            .get('/veiculos');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });

    // VEÍCULOS - editar

    // CT-013 - Positivo
    it('CT-013 - deve editar um veículo com dados válidos', async () => {
        const veiculo = await criarVeiculo();

        const cliente = await criarCliente();
        const montadora = await criarMontadora();

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

    // CT-014 - Negativo
    it('CT-014 - deve impedir a edição de veículo com dados inválidos', async () => {
        const veiculo = await criarVeiculo();

        const response = await request(app)
            .put(`/veiculos?id=${veiculo.id}`)
            .send({
                modelo: '',
                placa: '',
                ano: 2025,
                cor: 'Prata',
                valor: -100,
                idCliente: 999999,
                idMontadora: 999999
            });

        expect(response.status).toBe(400);
    });

    // VEÍCULOS - deletar


    // CT-015 - Positivo
    it('CT-015 - deve excluir um veículo existente', async () => {
        const veiculo = await criarVeiculo();

        const response = await request(app)
            .delete(`/veiculos/${veiculo.id}`);

        expect(response.status).toBe(200);
    });

    // CT-016 - Negativo
    it('CT-016 - deve impedir a exclusão de veículo inexistente', async () => {
        const response = await request(app)
            .delete('/veiculos/999999');

        expect(response.status).toBe(404);
    });

    // MONTADORAS - criar

    // CT-017 - Positivo
    it('CT-017 - deve cadastrar uma montadora com dados válidos', async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({
                nome: 'Hyundai',
                pais: 'Coreia do Sul'
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('insertId');
    });

    // CT-018 - Negativo
    it('CT-018 - deve impedir o cadastro de montadora com dados inválidos', async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({
                nome: '',
                pais: ''
            });

        expect(response.status).toBe(400);
    });

    // MONTADORAS - ler

    // CT-019 - Positivo
    it('CT-019 - deve listar as montadoras cadastradas', async () => {
        await criarMontadora();

        const response = await request(app)
            .get('/montadoras');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    // CT-020 - Negativo
    it('CT-020 - deve retornar uma lista vazia quando não existem montadoras', async () => {
        const response = await request(app)
            .get('/montadoras');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });

    // MONTADORAS - editar

    // CT-021 - Positivo
    it('CT-021 - deve editar uma montadora com dados válidos', async () => {
        const montadora = await criarMontadora();

        const response = await request(app)
            .put(`/montadoras?id=${montadora.id}`)
            .send({
                nome: 'Hyundai',
                pais: 'Coreia do Sul'
            });

        expect(response.status).toBe(200);
    });

    // CT-022 - Negativo
    it('CT-022 - deve impedir a edição de montadora com dados inválidos', async () => {
        const montadora = await criarMontadora();

        const response = await request(app)
            .put(`/montadoras?id=${montadora.id}`)
            .send({
                nome: '',
                pais: ''
            });

        expect(response.status).toBe(400);
    });

    // MONTADORAS - deletar

    // CT-023 - Positivo
    it('CT-023 - deve excluir uma montadora existente', async () => {
        const montadora = await criarMontadora();

        const response = await request(app)
            .delete(`/montadoras/${montadora.id}`);

        expect(response.status).toBe(200);
    });

    // CT-024 - Negativo
    it('CT-024 - deve impedir a exclusão de montadora inexistente', async () => {
        const response = await request(app)
            .delete('/montadoras/999999');

        expect(response.status).toBe(404);
    });

});
