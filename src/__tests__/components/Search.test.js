import React from "react";
import { render, screen } from "@testing-library/react";
import Search from "../../components/Search";

describe('Search Component', () => {
    //Testando a renderização do input
    test('should be able to render an input', ()=>{
        render(<Search/>)
        expect(screen.getByPlaceholderText('Insira o CEP')).toBeTruthy()
    })
    //Testando a renderização do button
    test('should be able to render an button', ()=>{
        render(<Search/>)
        expect(screen.getByText('Buscar pelo CEP')).toBeTruthy()
    })
})

