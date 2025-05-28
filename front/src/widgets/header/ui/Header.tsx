import { LogoIcon } from "@shared/assets";
import styles from "./Header.module.css";
import { Link, NavLink } from "react-router";
import clsx from "clsx";
import { routes } from "@shared/lib/routes";
import { SearchInput } from "@widgets/search-input";

export const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div>
        <div className={styles.navBlock}>
          <Link to={routes.home}>
            <LogoIcon className={styles.logo} />
          </Link>

          <nav className={styles.navContainer}>
            <NavLink to={routes.stats} className={({ isActive }) => clsx(isActive && styles.activeLink)}>
              stats
              <div className={styles.indicator} />
            </NavLink>
            {/* <NavLink to={routes.jettons} className={({ isActive }) => clsx(isActive && styles.activeLink)}>
              jettons
              <div className={styles.indicator} />
            </NavLink> */}
            <NavLink to={routes.blocks} className={({ isActive }) => clsx(isActive && styles.activeLink)}>
              blocks
              <div className={styles.indicator} />
            </NavLink>
          </nav>
        </div>

        <SearchInput className={styles.input} wrapperClassName={styles.inputWrapper} />
      </div>
    </header>
  );
};
