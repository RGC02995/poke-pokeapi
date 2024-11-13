import css from "./layout.module.scss";
import { Header } from "../header/Header";
import { useEffect } from "react";
import axios from "axios";
import { URL_POKEMON } from "../../../api/apiRest";
import { useState } from "react";
import { Card } from "../card/Card";
import * as FaIcons from "react-icons/fa";
import { array } from "prop-types";

export const LayoutHome = () => {
  const [arrayPokemon, setArrayPokemon] = useState([]);
  const [globalPokemon, setGlobalPokemon] = useState([]);
  const [xpage, setXpage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const api = async () => {
      const limit = 15;
      const xp = (xpage - 1) * limit;
      const apiPoke = await axios.get(
        `${URL_POKEMON}/?offset=${xp}&limit=${limit}`
      );
      setArrayPokemon(apiPoke.data.results);
    };
    api();
    getGlobalPokemons();
  }, [xpage]);

  const getGlobalPokemons = async () => {
    const res = await axios.get(`${URL_POKEMON}?offset=0&limit=1000`);
    const promises = res.data.results.map((pokemon) => {
      return pokemon;
    });

    const result = await Promise.all(promises);
    setGlobalPokemon(result);
  };

  const filterPokemon =
    search?.length > 0
      ? globalPokemon?.filter((pokemon) => pokemon?.name?.includes(search))
      : arrayPokemon;

  const obtenerSearch = (e) => {
    const texto = e.toLowerCase();
    setSearch(texto);
    console.log(search);

    setXpage(1);
  };
  return (
    <div className={css.layout}>
      <Header obtenerSearch={obtenerSearch} />

      <section className={css.section_pagination}>
        <div className={css.div_pagination}>
          <span
            className={css.item_izq}
            onClick={() => {
              if (xpage == 1) {
                return;
              }
              setXpage(xpage - 1);
            }}
          >
            <FaIcons.FaAngleLeft />
          </span>

          <span className={css.item}> {xpage} </span>
          <span className={css.item}> DE </span>
          <span className={css.item}>
            {Math.round(globalPokemon?.length / 15)}
          </span>
          <span
            className={css.item_drch}
            onClick={() => {
              if (xpage == 67) {
                return;
              }
              setXpage(xpage + 1);
            }}
          >
            <FaIcons.FaAngleRight />
          </span>
        </div>
      </section>

      <div className={css.card_content}>
        {filterPokemon.map((card, index) => {
          return <Card key={index} card={card} />;
        })}
      </div>
    </div>
  );
};
