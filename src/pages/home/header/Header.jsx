import css from "./header.module.scss";
import pokelogo from "../../../assets/PokemonLogo.png";
import * as FaIcons from "react-icons/fa";

export const Header = ({ obtenerSearch }) => {
  return (
    <nav className={css.header}>
      <div className={css.div_header}>
        <div className={css.div_logo}>
          <img src={pokelogo} alt="logo" />
        </div>
        <div className={css.div_search}>
          <div>
            <FaIcons.FaSearch />
          </div>
          <input
            type="search"
            onChange={(e) => obtenerSearch(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
};
