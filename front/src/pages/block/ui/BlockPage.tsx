import { useBlockId } from "@app/guards/BlockIdGuard";
import { useAppStore } from "@entities/app";
import * as Collapsible from "@radix-ui/react-collapsible";
import { getBlock, getTransactionsForBlock } from "@shared/api/api";
import { routes } from "@shared/lib/routes";
import { boolToString, trimAddr } from "@shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Address } from "@ton/core";
import { format } from "date-fns";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./BlockPage.module.css";

export const BlockPage = () => {
  const navigate = useNavigate();
  const blockId = useBlockId();
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const {
    data: blockData,
    isLoading: isBlockLoading,
    refetch: refetchBlock
  } = useQuery({
    queryKey: ["block"],
    queryFn: () => getBlock(blockId)
  });

  const {
    data: blockTransactions,
    isLoading: isTransactionsLoadings,
    refetch: refetchTx
  } = useQuery({
    queryKey: ["block_transactions"],
    queryFn: () => getTransactionsForBlock(blockId, 0, 50)
  });

  useEffect(() => {
    refetchBlock();
    refetchTx();
  }, [blockId]);

  useEffect(() => {
    setIsLoading(isBlockLoading || isTransactionsLoadings);
  }, [isBlockLoading, isTransactionsLoadings]);

  function navToBlock(dir: 1 | -1) {
    navigate(routes.block.replace(":id", `${blockId.workchain}:${blockId.shard}:${blockId.seqno + dir}`));
  }

  if (!blockData || !blockTransactions) {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <div className={styles.navButtons}>
          <button onClick={() => navToBlock(-1)}>prev</button>
          <button onClick={() => navToBlock(1)}>next</button>
        </div>

        <Collapsible.Root className={styles.blockStats}>
          <span>Workchain</span>
          <span>{blockData.workchain}</span>

          <span>Shard</span>
          <span>{blockData.shard}</span>

          <span>Seqno</span>
          <span>{blockData.seqno}</span>

          <span>LT</span>
          <span>
            {blockData.startLt} ... {blockData.endLt}
          </span>

          <span>Generated at</span>
          <span>{format(blockData.genUtime * 1000, "yyyy-MM-dd HH:mm:ss")}</span>

          <span>Root hash</span>
          <span>{blockData.rootHash}</span>

          <span>File hash</span>
          <span>{blockData.fileHash}</span>

          <Collapsible.Content style={{ display: "contents" }}>
            <span>global_id</span>
            <span>{blockData.globalId}</span>

            <span>version</span>
            <span>{blockData.version}</span>

            <span>flags</span>
            <span>{blockData.flags}</span>

            <span>after_merge</span>
            <span>{boolToString(blockData.afterMerge)}</span>

            <span>after_split</span>
            <span>{boolToString(blockData.afterSplit)}</span>

            <span>before_split</span>
            <span>{boolToString(blockData.beforeSplit)}</span>

            <span>want_merge</span>
            <span>{boolToString(blockData.wantMerge)}</span>

            <span>want_split</span>
            <span>{boolToString(blockData.wantSplit)}</span>

            <span>validator_list_hash_short</span>
            <span>{blockData.genValidatorListHashShort}</span>

            <span>gen_catchain_seqno</span>
            <span>{blockData.genCatchainSeqno}</span>

            <span>min_ref_mc_seqno</span>
            <span>{blockData.minRefMcSeqno}</span>

            <span>key_block</span>
            <span>{boolToString(blockData.keyBlock)}</span>

            <span>prev_key_block_seqno</span>
            <span>{blockData.prevKeyBlockSeqno}</span>

            <span>vert_seqno</span>
            <span>{blockData.vertSeqNo}</span>
          </Collapsible.Content>
          <Collapsible.Trigger className={styles.expandButton}>more</Collapsible.Trigger>
        </Collapsible.Root>

        {blockData.shardBlocks && blockData.shardBlocks.length > 0 && (
          <div className={styles.tableWrapper}>
            <div>
              <h4>shardchain blocks</h4>
            </div>

            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>Workchain</th>
                    <th>Shard</th>
                    <th>Seqno</th>
                  </tr>
                </thead>

                <tbody>
                  {blockData.shardBlocks.map((b) => (
                    <tr>
                      <td>{b.workchain}</td>
                      <td>{b.shard}</td>
                      <td>
                        <Link to={routes.block.replace(":id", `${b.workchain}:${b.shard}:${b.seqno}`)}>{b.seqno}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className={styles.tableWrapper}>
          <div>
            <h4>Block transactions</h4>
          </div>

          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th>LT</th>
                  <th>Hash</th>
                </tr>
              </thead>

              <tbody>
                {blockTransactions.map((t) => (
                  <tr>
                    <td>{trimAddr(Address.parseRaw(t.address).toString())}</td>
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
