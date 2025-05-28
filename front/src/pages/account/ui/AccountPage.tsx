import { useParams } from "react-router";
import styles from "./AccountPage.module.css";
import { useQuery } from "@tanstack/react-query";
import { getAccount, getTransactionsForAccount } from "@shared/api/api";
import { useEffect } from "react";
import { useAppStore } from "@entities/app";
import { format } from "date-fns";
import { Address } from "@ton/core";

export const AccountPage = () => {
  const addr = useParams<{ address: string }>().address ?? "";
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const { data: accountData, isLoading: isAccountLoading } = useQuery({
    queryKey: ["account", addr],
    queryFn: () => getAccount(addr)
  });

  const { data: transactionData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["account_transactions", addr],
    queryFn: () => getTransactionsForAccount(addr, 0, 100)
  });

  useEffect(() => {
    setIsLoading(isAccountLoading || isTransactionsLoading);
  }, [isAccountLoading, isTransactionsLoading]);

  if (!accountData && !isAccountLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.pageContainer}>404</div>
      </div>
    );
  }

  if (!accountData || !transactionData) {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <div className={styles.stats}>
          <span>Address</span>
          <span>{Address.parse(accountData.address).toString()}</span>

          <span>Balance</span>
          <span>{accountData.balance}</span>
        </div>

        <div className={styles.tableWrapper}>
          <div>
            <h4>Account transactions</h4>
          </div>

          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>LT</th>
                  <th>Hash</th>
                </tr>
              </thead>

              <tbody>
                {transactionData.map((t) => (
                  <tr>
                    <td>{format(t.now * 1000, "yyyy-MM-dd HH:mm:ss")}</td>
                    <td>{t.lt}</td>
                    <td>{t.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
