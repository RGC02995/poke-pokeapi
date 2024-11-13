import { useEffect, useState } from "react";
import css from "./card.module.scss";
import {
  URL_ESPECIES,
  URL_EVOLUCIONES,
  URL_POKEMON,
} from "../../../api/apiRest";
import axios from "axios";

export const Card = ({ card }) => {
  const [itemPokemon, setItemPokemon] = useState({});
  const [speciesPokemon, setSpeciesPokemon] = useState({});
  const [evoluciones, setEvoluciones] = useState([]);

  /*Hacemos peticiones para obtener imagenes con la api de URL_POKEMON y datos del pokemon como, nombre altura... */
  useEffect(() => {
    const dataPokemon = async () => {
      const api = await axios.get(`${URL_POKEMON}/${card.name}`);
      setItemPokemon(api.data);
    };
    dataPokemon();
  }, [card]);

  /*En esta llamada antes de hacerla creamos un array de strings separando la url con la funcion split, para obtener así en penultima posicion el id del pokemon que se pasa por props, asi al usar la URL_SPECIES y hacer la llamada obtenemos más datos del pokemon como sus evoluciones, color, entre otros..*/

  useEffect(() => {
    const dataSpecies = async () => {
      const URL = card.url.split("/");
      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
      setSpeciesPokemon({
        url_especie: api?.data?.evolution_chain,
        data: api?.data,
      });
    };
    dataSpecies();
  }, [card]);

  useEffect(() => {
    async function getPokemonImagen(id) {
      const response = await axios.get(`${URL_POKEMON}/${id}`);
      return response?.data?.sprites?.other["official-artwork"]?.front_default;
    }
    if (speciesPokemon?.url_especie) {
      const obtenerEvoluciones = async () => {
        const arrayEvoluciones = [];
        const URL = speciesPokemon?.url_especie?.url?.split("/");
        const api = await axios.get(`${URL_EVOLUCIONES}/${URL[6]}`);

        const URL2 = api?.data?.chain?.species?.url?.split("/");
        const img1 = await getPokemonImagen(URL2[6]);

        arrayEvoluciones.push({
          img: img1,
          name: api?.data?.chain?.species?.name,
        });

        if (api?.data?.chain?.evolves_to?.length !== 0) {
          const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
          const ID = DATA2.url.split("/");
          const img2 = await getPokemonImagen(ID[6]);
          arrayEvoluciones.push({
            img: img2,
            name: DATA2?.name,
          });
        }

        if (api?.data?.chain?.evolves_to[0]?.evolves_to[0].length !== 0) {
          const DATA3 = api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
          const ID = DATA3?.url?.split("/");
          const img3 = await getPokemonImagen(ID[6]);
          arrayEvoluciones.push({
            img: img3,
            name: DATA3?.name,
          });
        }

        setEvoluciones(arrayEvoluciones);
      };
      obtenerEvoluciones();
    }
  }, [speciesPokemon]);

  let pokeId = itemPokemon?.id?.toString();

  if (pokeId?.length == 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId?.length == 2) {
    pokeId = "0" + pokeId;
  }

  return (
    <div className={css.card}>
      <img
        className={css.img_poke}
        src={itemPokemon?.sprites?.other["official-artwork"]?.front_default}
        alt="pokemon"
      />

      <div
        className={`bg-${speciesPokemon?.data?.color?.name} ${css.sub_card}`}
      >
        <strong className={css.id_card}># {pokeId}</strong>
        <br />
        <strong className={css.name_card}>{itemPokemon.name}</strong>
        <h4 className={css.altura_poke}>Altura: {`${itemPokemon.height}cm`}</h4>
        <h4 className={css.peso_poke}>Peso: {`${itemPokemon.weight}kg`}</h4>
        <h4 className={css.habitat_poke}>
          Habitat: {speciesPokemon?.data?.habitat?.name}
        </h4>

        <div className={css.div_stats}>
          {itemPokemon?.stats?.map((stat, index) => {
            return (
              <h6 className={css.item_stats} key={index}>
                <span className={css.name}>{stat.stat.name}</span>
                <progress value={stat.base_stat} max={110} />
                <span className={css.numero}>{stat.base_stat}</span>
              </h6>
            );
          })}
        </div>

        <div className={css.div_type_color}>
          {itemPokemon?.types?.map((type, index) => {
            return (
              <h6
                className={`color-${type.type.name} ${css.color_type}`}
                key={index}
              >
                {type.type.name}
              </h6>
            );
          })}
        </div>

        <div className={css.div_evolucion}>
          {evoluciones.map((evo, index) => {
            return (
              <div className={css.item_evo} key={index}>
                <img src={evo.img} alt="evo-img" className={css.img} />
                <h6>{evo.name}</h6>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
