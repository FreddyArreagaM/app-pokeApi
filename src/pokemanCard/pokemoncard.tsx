import React from 'react';
import './pokemoncard.css'

interface Props {
  name: string;
  url:string;
}

const PokemonCard: React.FC<Props> = ({ name, url}) => {
  return (
    <div className='card'>
      <div className='card-content'>
      <img src={url} alt={name} className='pokemones'/>
      <p>{name}</p>
      </div>
    </div>
  );
};

export default PokemonCard;
