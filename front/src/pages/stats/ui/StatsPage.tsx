import { useAppStore } from "@entities/app";
import { getBlockchainStats } from "@shared/api/api";
import { useQuery } from "@tanstack/react-query";
import { CommonChart } from "@widgets/chart";
import { useEffect } from "react";
import styles from "./StatsPage.module.css";
import { format } from "date-fns";

export const StatsPage = () => {
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getBlockchainStats(),
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    setIsLoading(isStatsLoading);
  }, [isStatsLoading]);

  if (!stats) {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <div className={styles.stat}>
          <h4>Masterchain height</h4>

          <div>
            <h2>{stats.blockchainHeight}</h2>
            <h5 className={styles.additionalStat}>Block time: {stats.blockTime}s</h5>
          </div>
        </div>

        <div className={styles.stat}>
          <h4>Transactions</h4>

          <div>
            <h2>{stats.transactionCount}</h2>
            <h5 className={styles.additionalStat}>{stats.tps} transactions per second</h5>
          </div>
        </div>

        <div className={styles.stat}>
          <h4>NFT Transfer</h4>

          <div>
            <h2>{stats.nftTransfers}</h2>
            <h5 className={styles.additionalStat}>{stats.nftTpm} transfers per minute</h5>
          </div>
        </div>

        <div className={styles.stat}>
          <h4>Jettons Transfer</h4>

          <div>
            <h2>{stats.jettonTransfers}</h2>
            <h5 className={styles.additionalStat}>{stats.jettonTpm} transfers per minute</h5>
          </div>
        </div>

        <div className={styles.transactionCount}>
          <h3>Transaction count</h3>
          <CommonChart
            data={stats.transactionGraph.map((p) => ({
              label: format(p.minute, "yyyy-MM-dd HH:mm:ss"),
              value: p.count
            }))}
            className={styles.chart}
            chartColor="#9c528b"
          />
        </div>

        <div className={styles.addressCount}>
          <h3>Address count</h3>
          <CommonChart
            data={stats.accountGraph.map((p) => ({ label: format(p.minute, "yyyy-MM-dd HH:mm:ss"), value: p.count }))}
            className={styles.chart}
            chartColor="#9bc4cb"
          />
        </div>

        <div className={styles.transactionCount}>
          <h3>New masterchain blocks</h3>
          <CommonChart
            data={stats.masterchainGraph.map((p) => ({
              label: format(p.minute, "yyyy-MM-dd HH:mm:ss"),
              value: p.count
            }))}
            className={styles.chart}
            chartColor="#AEC3B0"
          />
        </div>

        <div className={styles.addressCount}>
          <h3>New workchain blocks</h3>
          <CommonChart
            data={stats.workchainGraph.map((p) => ({ label: format(p.minute, "yyyy-MM-dd HH:mm:ss"), value: p.count }))}
            className={styles.chart}
            chartColor="#9D96B8"
          />
        </div>
      </div>
    </div>
  );
};
