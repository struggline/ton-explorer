import { useAppStore } from "@entities/app";
import { getBlocks, getLatestTransactions } from "@shared/api/api";
import { routes } from "@shared/lib/routes";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { format } from "date-fns";
import { useEffect } from "react";
import { Link } from "react-router";
import { Address } from "@ton/core";
import styles from "./BlocksPage.module.css";
import { trimAddr } from "@shared/lib/utils";

export const BlocksPage = () => {
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const { data: masterchainBlocks, isLoading: isMasterchainLoading } = useQuery({
    queryKey: ["masterchain_blocks"],
    queryFn: () => getBlocks(-1, 0, 50)
  });

  const { data: workchainBlocks, isLoading: isWorkchainLoading } = useQuery({
    queryKey: ["workchain_blocks"],
    queryFn: () => getBlocks(0, 0, 50)
  });

  const { data: latestTransactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["latest_transactions"],
    queryFn: () => getLatestTransactions(0, 50)
  });

  useEffect(() => {
    setIsLoading(isMasterchainLoading || isWorkchainLoading || isTransactionsLoading);
  }, [isMasterchainLoading, isWorkchainLoading, isTransactionsLoading]);

  if (!masterchainBlocks || !workchainBlocks || !latestTransactions) {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <div className={clsx(styles.tableWrapper, styles.transactionsTable)}>
          <div>
            <h4>last transactions</h4>
          </div>

          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>When</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {latestTransactions.map((t) => (
                  <tr>
                    <td>{format(t.now * 1000, "yyyy-MM-dd HH:mm:ss")}</td>
                    <td>{trimAddr(Address.parseRaw(t.address).toString())}</td>
                    <td>
                      {t.dest ? trimAddr(Address.isRaw(t.dest) ? Address.parseRaw(t.dest).toString() : t.dest) : ""}
                    </td>
                    <td>{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={clsx(styles.tableWrapper, styles.masterchainTable)}>
          <div>
            <h4>last masterchain blocks</h4>
          </div>

          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>Seqno</th>
                  <th>Transactions</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {masterchainBlocks.map((b) => (
                  <tr>
                    <td>
                      <Link to={routes.block.replace(":id", `${b.workchain}:${b.shard}:${b.seqno}`)}>{b.seqno}</Link>
                    </td>
                    <td>23</td>
                    <td>{format(b.genUtime * 1000, "HH:mm:ss")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={clsx(styles.tableWrapper, styles.workchainTable)}>
          <div>
            <h4>last workchain blocks</h4>
          </div>

          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>Seqno</th>
                  <th>Transactions</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {workchainBlocks.map((b) => (
                  <tr>
                    <td>
                      <Link to={routes.block.replace(":id", `${b.workchain}:${b.shard}:${b.seqno}`)}>{b.seqno}</Link>
                    </td>
                    <td>{b.transactionCount}</td>
                    <td>{format(b.genUtime * 1000, "HH:mm:ss")}</td>
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
