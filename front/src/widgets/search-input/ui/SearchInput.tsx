import type React from "react";
import styles from "./SearchInput.module.css";
import clsx from "clsx";
import { useState } from "react";
import { Address } from "@ton/core";
import { useNavigate } from "react-router";
import { routes } from "@shared/lib/routes";

interface SearchInputProps {
  className?: string;
  wrapperClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ className, wrapperClassName }) => {
  const navigate = useNavigate();
  const [addr, setAddr] = useState("");
  const [error, setError] = useState<string | undefined>();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!Address.isFriendly(addr) && !Address.isAddress(addr) && !Address.isRaw(addr)) {
      setError("Not an anddress");
      setTimeout(() => {
        setError(undefined);
      }, 2000);
      e.preventDefault();
      return;
    }

    navigate(routes.account.replace(":address", addr));
  }

  return (
    <form className={clsx(styles.form, wrapperClassName)} onSubmit={onSubmit}>
      <input
        className={clsx(styles.input, error && styles.errorInput, className)}
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="Search by address"
      />

      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
};
