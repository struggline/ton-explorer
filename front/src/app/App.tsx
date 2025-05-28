import { useAppStore } from "@entities/app";
import { Header } from "@widgets/header";
import { Outlet } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./App.module.css";

export const App = () => {
  const isLoading = useAppStore((state) => state.isLoading);

  return (
    <>
      <Header />

      <Outlet />

      <AnimatePresence mode="wait">{isLoading && <Loader />}</AnimatePresence>
    </>
  );
};

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={styles.loader}
    >
      <div className={styles.spinner} />
    </motion.div>
  );
};
