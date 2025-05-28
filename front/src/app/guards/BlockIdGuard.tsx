import type { BlockId } from "@shared/api/types";
import { Outlet, useOutletContext, useParams } from "react-router";

export const BlockIdGuard = () => {
  const id = useParams<{ id: string }>().id ?? "";
  const [workchain, shard, seqno] = id.split(":");

  if (workchain === undefined || shard === undefined || seqno === undefined) {
    //TODO: 404
    return null;
  }

  const blockId = {
    workchain: +workchain,
    shard,
    seqno: +seqno
  };

  return <Outlet context={blockId} />;
};

export const useBlockId = () => useOutletContext<BlockId>();
