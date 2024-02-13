import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pokemon from '../interface/pokemon';
import './list-pokemon.css';
import PokemonCard from '../pokemanCard/pokemoncard';

const PokemonList: React.FC = () => {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    //const [imagesList, setImagesList] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchAbility, setSearchAbility] = useState<string>('');
    const [searchBaseExperience, setSearchBaseExperience] = useState<string>('');
    const [uniqueAbilities, setUniqueAbilities] = useState<string[]>([]);
    const [pokemonData, setPokemonData] = useState<any[]>([]);
    const [searchWeight, setSearchWeight] = useState<string>('');
    const [searchHeight, setSearchHeight] = useState<string>('');

    const tab = <>&nbsp;&nbsp;&nbsp;</>;

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${(currentPage - 1) * 20}&limit=20`);
                setPokemonList(response.data.results);
                
                const urls = response.data.results.map((pokemon: { url: any; }) => pokemon.url);

                const pokemonData = await Promise.all(
                    urls.map(async (url: string) => {
                        const pokemonResponse = await axios.get(url);
                        return pokemonResponse.data;
                    })
                ); 

                setPokemonData(pokemonData);

                //const imagen = pokemonData.map((img: { sprites: any; }) => img.sprites.other.home);

                //setImagesList(imagen);

                // Obtener habilidades únicas
                const abilities = pokemonData.flatMap((pokemon: { abilities: any[]; }) =>
                    pokemon.abilities.map((ability: { ability: { name: string; }; }) => ability.ability.name)
                );

                const uniqueAbilities = Array.from(new Set(abilities));

                setUniqueAbilities(uniqueAbilities);

            } catch (error) {
                console.error('Error fetching Pokemon:', error);
            }
        };

        fetchPokemon();
    }, [currentPage]);

    useEffect(() => {
        setFilteredPokemonList(pokemonData.filter((pokemon: { forms: any[], abilities: any[]; base_experience: number; weight: any[]; height: any[] }) => {
            return (
                (searchTerm === '' || pokemon.forms.some((namePokemon: {name:string; })  => namePokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) )) &&
                (searchAbility === '' || pokemon.abilities.some((ability: { ability: { name: string; }; }) => ability.ability.name === searchAbility)) &&
                (searchBaseExperience === '' || pokemon.base_experience === parseInt(searchBaseExperience)) &&
                (searchWeight === '' || pokemon.weight[0] === parseInt(searchWeight, 10)) &&
                (searchHeight === '' || pokemon.height[0]  === parseInt(searchHeight, 10))
            );
        }));
    }, [pokemonList, searchAbility, searchBaseExperience, pokemonData, searchTerm, searchWeight, searchHeight]);

    const continuar = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const retroceder = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    //Metodo para el cambio en el texto del input
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    //Metodo para el cambio en la lista de habilidades del select
    const handleAbilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchAbility(e.target.value);
    };

    //Metodo para el cambio en la lista de experiencia del select
    const handleBaseExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchBaseExperience(e.target.value);
    };

    //Metodo para el cambio en la lista de peso del select
    const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchWeight(e.target.value);
    };

    //Metodo para el cambio en la lista de peso del select
    const handleHeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchHeight(e.target.value);
    };

    // Obtener las opciones únicas de experiencia base
    const uniqueBaseExperiences: string[] = Array.from(new Set(pokemonData.map((pokemon: { base_experience: any; }) => String(pokemon.base_experience))));
    
    // Obtener las opciones únicas de pesos
    const uniqueWeights: string[]  = Array.from(new Set(pokemonData.map((pokemon: { weight: any; }) => String(pokemon.weight))));

    // Obtener las opciones únicas de alturas
    const uniqueHeights: string[] = Array.from(new Set(pokemonData.map((pokemon: { height: any; }) => String(pokemon.height))));

    //console.log(filteredPokemonList)

    const numRows = Math.ceil(filteredPokemonList.length / 4);

    //sprites/pokemon/other/home
    //<PokemonCard name={pokemon.name} image={imagesList[rowIndex * 4 + index]?.front_default} />

    const grid = Array.from({ length: numRows }, (_, rowIndex) => (
        <div key={rowIndex} className="row">
            {filteredPokemonList.slice(rowIndex * 4, rowIndex * 4 + 4).map((pokemon, index) => (
                <div key={index} className="col">
                    <PokemonCard name={pokemon.name} url={pokemon.sprites.other.home.front_default} />
                </div>
            ))}
        </div>
    ));

    return (
        <div className='contenido'>
            <h1 className='title'>Pokemon List</h1>
            <input type="text" placeholder="Buscar Pokemon" value={searchTerm} onChange={handleSearch} />
            {tab}
            <select value={searchAbility} onChange={handleAbilityChange}>
                <option value="">Todas las habilidades</option>
                {uniqueAbilities.map((ability, index) => (
                    <option key={index} value={ability}>{ability}</option>
                ))}
            </select>
            {tab}
            <select value={searchBaseExperience !== null ? String(searchBaseExperience) : ''} onChange={handleBaseExperienceChange}>
                <option value="">Experiencia Base</option>
                {uniqueBaseExperiences.map((experience, index) => (
                    <option key={index} value={String(experience)}>{experience}</option>
                ))}
            </select>
            {tab}
            <select value={searchWeight} onChange={handleWeightChange}>
                <option value="">Peso</option>
                {uniqueWeights.map((weight, index) => (
                    <option key={index} value={weight}>{weight}</option>
                ))}
            </select>
            {tab}
            <select value={searchHeight} onChange={handleHeightChange}>
                <option value="">Altura</option>
                {uniqueHeights.map((height, index) => (
                    <option key={index} value={String(height)}>{height}</option>
                ))}
            </select>

            <div className='container'>
                {grid}
            </div>

            <br />
            <br />
            <button className='btn' onClick={retroceder} disabled={currentPage === 1}> <b>Página Anterior</b></button>{''}
            {tab}{tab}
            <button className='btn' onClick={continuar}> <b>Página Siguiente</b></button>
        </div>

    );
};

export default PokemonList;



