import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import App from "../../App";
import api from "../../services";
import MockAdapter from "axios-mock-adapter";
import Providers from "../../providers";

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

const apiMock = new MockAdapter(api)

describe('App page', ()=>{
    test('Should be able to submit cep', async () =>{
        apiMock.onGet('08452280').replyOnce(200, {
            bairro: "Lajeado",
            logradouro: "Rua Homero de Sousa Campos",
            estado_info: {
                area_km2: "248.221,996",
                codigo_ibge: "35",
                nome: "São Paulo"
            },
            cep: "08452280",
            cidade_info: {
                area_km2: "1521,11",
                codigo_ibge: "3550308"
            },
            estado: "SP"
        })

        render(<Providers><App/></Providers>)

        const input = screen.getByPlaceholderText('Insira o CEP')
        const button = screen.getByText('Buscar pelo CEP')
        
        fireEvent.change(input, {target: {value: '08452280'}})
        fireEvent.click(button)

        await waitFor(()=>{
            expect(input).toHaveDisplayValue('08452280')
            expect(screen.getByDisplayValue('Lajeado')).toBeTruthy()
            expect(screen.getByDisplayValue('Rua Homero de Sousa Campos')).toBeTruthy()
            expect(screen.getByDisplayValue('SP')).toBeTruthy()
        })
    })

    test('Should be able to error cep', async () =>{

        render(<Providers><App/></Providers>)

        const input = screen.getByPlaceholderText('Insira o CEP')
        const button = screen.getByText('Buscar pelo CEP')
        
        fireEvent.change(input, {target: {value: '123456'}})
        fireEvent.click(button)

        await waitFor(async ()=>{
            expect(input).toHaveDisplayValue('123456')
            expect(screen.queryByText("CEP inválido! São necessários 8 números")).toBeInTheDocument()
        })
    })

    test('Should be able to error cep 2', async () =>{

        render(<Providers><App/></Providers>)

        const input = screen.getByPlaceholderText('Insira o CEP')
        const button = screen.getByText('Buscar pelo CEP')
        
        fireEvent.change(input, {target: {value: '12345678'}})
        fireEvent.click(button)

        await waitFor(async ()=>{
            expect(input).toHaveDisplayValue('12345678')
            expect(screen.queryByText("Ops! CEP não encontrado...")).toBeInTheDocument()
        })
    })
})