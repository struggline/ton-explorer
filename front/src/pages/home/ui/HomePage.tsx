import { SearchInput } from "@widgets/search-input";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.motto}>
        Observe&nbsp;<span>The Open Network</span>
      </h1>
      <SearchInput wrapperClassName={styles.wrapperInput} />
    </div>
  );
};
