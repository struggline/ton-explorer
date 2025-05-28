import { beginCell, Builder, Cell, Slice } from "@ton/core";

export function bitLen(n: number) {
    return n.toString(2).length;
}

export interface Bool {
    readonly kind: "Bool";
    readonly value: boolean;
}

export function loadBool(slice: Slice): Bool {
    if (slice.remainingBits >= 1) {
        let value = slice.loadUint(1);
        return {
            kind: "Bool",
            value: value == 1
        };
    }
    throw new Error('Expected one of "BoolFalse" in loading "BoolFalse", but data does not satisfy any constructor');
}

export function storeBool(bool: Bool): (builder: Builder) => void {
    return (builder: Builder) => {
        builder.storeUint(bool.value ? 1 : 0, 1);
    };
}

export function loadBoolFalse(slice: Slice): Bool {
    if (slice.remainingBits >= 1 && slice.preloadUint(1) == 0b0) {
        slice.loadUint(1);
        return {
            kind: "Bool",
            value: false
        };
    }
    throw new Error('Expected one of "BoolFalse" in loading "BoolFalse", but data does not satisfy any constructor');
}

export function loadBoolTrue(slice: Slice): Bool {
    if (slice.remainingBits >= 1 && slice.preloadUint(1) == 0b1) {
        slice.loadUint(1);
        return {
            kind: "Bool",
            value: true
        };
    }
    throw new Error('Expected one of "BoolTrue" in loading "BoolTrue", but data does not satisfy any constructor');
}

export function copyCellToBuilder(from: Cell, to: Builder): void {
    let slice = from.beginParse();
    to.storeBits(slice.loadBits(slice.remainingBits));
    while (slice.remainingRefs) {
        to.storeRef(slice.loadRef());
    }
}
/*
block#11ef55aa global_id:int32
  info:^BlockInfo = Block;
*/

export interface Block {
    readonly kind: "Block";
    readonly global_id: number;
    readonly info: BlockInfo;
}

/*
block_info#9bc7a987 version:uint32 
  not_master:(## 1) 
  after_merge:(## 1) before_split:(## 1) 
  after_split:(## 1) 
  want_split:Bool want_merge:Bool
  key_block:Bool vert_seqno_incr:(## 1)
  flags:(## 8) { flags <= 1 }
  seq_no:# vert_seq_no:# { vert_seq_no >= vert_seqno_incr } 
  { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no } 
  shard:ShardIdent gen_utime:uint32
  start_lt:uint64 end_lt:uint64
  gen_validator_list_hash_short:uint32
  gen_catchain_seqno:uint32
  min_ref_mc_seqno:uint32
  prev_key_block_seqno:uint32
  gen_software:flags . 0?GlobalVersion
  master_ref:not_master?^BlkMasterInfo 
  prev_ref:^(BlkPrevInfo after_merge)
  prev_vert_ref:vert_seqno_incr?^(BlkPrevInfo 0)
  = BlockInfo;
*/

export interface BlockInfo {
    readonly kind: "BlockInfo";
    readonly prev_seq_no: number;
    readonly version: number;
    readonly not_master: number;
    readonly after_merge: number;
    readonly before_split: number;
    readonly after_split: number;
    readonly want_split: Bool;
    readonly want_merge: Bool;
    readonly key_block: Bool;
    readonly vert_seqno_incr: number;
    readonly flags: number;
    readonly seq_no: number;
    readonly vert_seq_no: number;
    readonly shard: ShardIdent;
    readonly gen_utime: number;
    readonly start_lt: bigint;
    readonly end_lt: bigint;
    readonly gen_validator_list_hash_short: number;
    readonly gen_catchain_seqno: number;
    readonly min_ref_mc_seqno: number;
    readonly prev_key_block_seqno: number;
    readonly gen_software: GlobalVersion | undefined;
    readonly master_ref: BlkMasterInfo | undefined;
    readonly prev_ref: BlkPrevInfo;
    readonly prev_vert_ref: BlkPrevInfo | undefined;
}

/*
shard_ident$00 shard_pfx_bits:(#<= 60) 
  workchain_id:int32 shard_prefix:uint64 = ShardIdent;
*/

export interface ShardIdent {
    readonly kind: "ShardIdent";
    readonly shard_pfx_bits: number;
    readonly workchain_id: number;
    readonly shard_prefix: bigint;
}

// capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;

export interface GlobalVersion {
    readonly kind: "GlobalVersion";
    readonly version: number;
    readonly capabilities: bigint;
}

// master_info$_ master:ExtBlkRef = BlkMasterInfo;

export interface BlkMasterInfo {
    readonly kind: "BlkMasterInfo";
    readonly master: ExtBlkRef;
}

/*
ext_blk_ref$_ end_lt:uint64
  seq_no:uint32 root_hash:bits256 file_hash:bits256 
  = ExtBlkRef;
*/

export interface ExtBlkRef {
    readonly kind: "ExtBlkRef";
    readonly end_lt: bigint;
    readonly seq_no: number;
    readonly root_hash: Buffer;
    readonly file_hash: Buffer;
}

// prev_blk_info$_ prev:ExtBlkRef = BlkPrevInfo 0;

// prev_blks_info$_ prev1:^ExtBlkRef prev2:^ExtBlkRef = BlkPrevInfo 1;

export type BlkPrevInfo = BlkPrevInfo_prev_blk_info | BlkPrevInfo_prev_blks_info;

export interface BlkPrevInfo_prev_blk_info {
    readonly kind: "BlkPrevInfo_prev_blk_info";
    readonly prev: ExtBlkRef;
}

export interface BlkPrevInfo_prev_blks_info {
    readonly kind: "BlkPrevInfo_prev_blks_info";
    readonly prev1: ExtBlkRef;
    readonly prev2: ExtBlkRef;
}

/*
block#11ef55aa global_id:int32
  info:^BlockInfo = Block;
*/

export function loadBlock(slice: Slice): Block {
    if (slice.remainingBits >= 32 && slice.preloadUint(32) == 0x11ef55aa) {
        slice.loadUint(32);
        let global_id: number = slice.loadInt(32);
        let slice1 = slice.loadRef().beginParse(true);
        let info: BlockInfo = loadBlockInfo(slice1);
        return {
            kind: "Block",
            global_id: global_id,
            info: info
        };
    }
    throw new Error('Expected one of "Block" in loading "Block", but data does not satisfy any constructor');
}

export function storeBlock(block: Block): (builder: Builder) => void {
    return (builder: Builder) => {
        builder.storeUint(0x11ef55aa, 32);
        builder.storeInt(block.global_id, 32);
        let cell1 = beginCell();
        storeBlockInfo(block.info)(cell1);
        builder.storeRef(cell1);
    };
}

/*
block_info#9bc7a987 version:uint32 
  not_master:(## 1) 
  after_merge:(## 1) before_split:(## 1) 
  after_split:(## 1) 
  want_split:Bool want_merge:Bool
  key_block:Bool vert_seqno_incr:(## 1)
  flags:(## 8) { flags <= 1 }
  seq_no:# vert_seq_no:# { vert_seq_no >= vert_seqno_incr } 
  { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no } 
  shard:ShardIdent gen_utime:uint32
  start_lt:uint64 end_lt:uint64
  gen_validator_list_hash_short:uint32
  gen_catchain_seqno:uint32
  min_ref_mc_seqno:uint32
  prev_key_block_seqno:uint32
  gen_software:flags . 0?GlobalVersion
  master_ref:not_master?^BlkMasterInfo 
  prev_ref:^(BlkPrevInfo after_merge)
  prev_vert_ref:vert_seqno_incr?^(BlkPrevInfo 0)
  = BlockInfo;
*/

export function loadBlockInfo(slice: Slice): BlockInfo {
    if (slice.remainingBits >= 32 && slice.preloadUint(32) == 0x9bc7a987) {
        slice.loadUint(32);
        let version: number = slice.loadUint(32);
        let not_master: number = slice.loadUint(1);
        let after_merge: number = slice.loadUint(1);
        let before_split: number = slice.loadUint(1);
        let after_split: number = slice.loadUint(1);
        let want_split: Bool = loadBool(slice);
        let want_merge: Bool = loadBool(slice);
        let key_block: Bool = loadBool(slice);
        let vert_seqno_incr: number = slice.loadUint(1);
        let flags: number = slice.loadUint(8);
        let seq_no: number = slice.loadUint(32);
        let vert_seq_no: number = slice.loadUint(32);
        let shard: ShardIdent = loadShardIdent(slice);
        let gen_utime: number = slice.loadUint(32);
        let start_lt: bigint = slice.loadUintBig(64);
        let end_lt: bigint = slice.loadUintBig(64);
        let gen_validator_list_hash_short: number = slice.loadUint(32);
        let gen_catchain_seqno: number = slice.loadUint(32);
        let min_ref_mc_seqno: number = slice.loadUint(32);
        let prev_key_block_seqno: number = slice.loadUint(32);
        let gen_software: GlobalVersion | undefined = flags & (1 << 0) ? loadGlobalVersion(slice) : undefined;
        let master_ref: BlkMasterInfo | undefined = not_master
            ? ((slice: Slice) => {
                  let slice1 = slice.loadRef().beginParse(true);
                  return loadBlkMasterInfo(slice1);
              })(slice)
            : undefined;
        let slice1 = slice.loadRef().beginParse(true);
        let prev_ref: BlkPrevInfo = loadBlkPrevInfo(slice1, after_merge);
        let prev_vert_ref: BlkPrevInfo | undefined = vert_seqno_incr
            ? ((slice: Slice) => {
                  let slice1 = slice.loadRef().beginParse(true);
                  return loadBlkPrevInfo(slice1, 0);
              })(slice)
            : undefined;
        if (!(flags <= 1)) {
            throw new Error('Condition (flags <= 1) is not satisfied while loading "BlockInfo" for type "BlockInfo"');
        }
        if (!(vert_seq_no >= vert_seqno_incr)) {
            throw new Error(
                'Condition (vert_seq_no >= vert_seqno_incr) is not satisfied while loading "BlockInfo" for type "BlockInfo"'
            );
        }
        return {
            kind: "BlockInfo",
            prev_seq_no: seq_no - 1,
            version: version,
            not_master: not_master,
            after_merge: after_merge,
            before_split: before_split,
            after_split: after_split,
            want_split: want_split,
            want_merge: want_merge,
            key_block: key_block,
            vert_seqno_incr: vert_seqno_incr,
            flags: flags,
            seq_no: seq_no,
            vert_seq_no: vert_seq_no,
            shard: shard,
            gen_utime: gen_utime,
            start_lt: start_lt,
            end_lt: end_lt,
            gen_validator_list_hash_short: gen_validator_list_hash_short,
            gen_catchain_seqno: gen_catchain_seqno,
            min_ref_mc_seqno: min_ref_mc_seqno,
            prev_key_block_seqno: prev_key_block_seqno,
            gen_software: gen_software,
            master_ref: master_ref,
            prev_ref: prev_ref,
            prev_vert_ref: prev_vert_ref
        };
    }
    throw new Error('Expected one of "BlockInfo" in loading "BlockInfo", but data does not satisfy any constructor');
}

export function storeBlockInfo(blockInfo: BlockInfo): (builder: Builder) => void {
    return (builder: Builder) => {
        builder.storeUint(0x9bc7a987, 32);
        builder.storeUint(blockInfo.version, 32);
        builder.storeUint(blockInfo.not_master, 1);
        builder.storeUint(blockInfo.after_merge, 1);
        builder.storeUint(blockInfo.before_split, 1);
        builder.storeUint(blockInfo.after_split, 1);
        storeBool(blockInfo.want_split)(builder);
        storeBool(blockInfo.want_merge)(builder);
        storeBool(blockInfo.key_block)(builder);
        builder.storeUint(blockInfo.vert_seqno_incr, 1);
        builder.storeUint(blockInfo.flags, 8);
        builder.storeUint(blockInfo.seq_no, 32);
        builder.storeUint(blockInfo.vert_seq_no, 32);
        storeShardIdent(blockInfo.shard)(builder);
        builder.storeUint(blockInfo.gen_utime, 32);
        builder.storeUint(blockInfo.start_lt, 64);
        builder.storeUint(blockInfo.end_lt, 64);
        builder.storeUint(blockInfo.gen_validator_list_hash_short, 32);
        builder.storeUint(blockInfo.gen_catchain_seqno, 32);
        builder.storeUint(blockInfo.min_ref_mc_seqno, 32);
        builder.storeUint(blockInfo.prev_key_block_seqno, 32);
        if (blockInfo.gen_software != undefined) {
            storeGlobalVersion(blockInfo.gen_software)(builder);
        }
        if (blockInfo.master_ref != undefined) {
            let cell1 = beginCell();
            storeBlkMasterInfo(blockInfo.master_ref)(cell1);
            builder.storeRef(cell1);
        }
        let cell1 = beginCell();
        storeBlkPrevInfo(blockInfo.prev_ref)(cell1);
        builder.storeRef(cell1);
        if (blockInfo.prev_vert_ref != undefined) {
            let cell1 = beginCell();
            storeBlkPrevInfo(blockInfo.prev_vert_ref)(cell1);
            builder.storeRef(cell1);
        }
        if (!(blockInfo.flags <= 1)) {
            throw new Error(
                'Condition (blockInfo.flags <= 1) is not satisfied while loading "BlockInfo" for type "BlockInfo"'
            );
        }
        if (!(blockInfo.vert_seq_no >= blockInfo.vert_seqno_incr)) {
            throw new Error(
                'Condition (blockInfo.vert_seq_no >= blockInfo.vert_seqno_incr) is not satisfied while loading "BlockInfo" for type "BlockInfo"'
            );
        }
    };
}

/*
shard_ident$00 shard_pfx_bits:(#<= 60) 
  workchain_id:int32 shard_prefix:uint64 = ShardIdent;
*/

export function loadShardIdent(slice: Slice): ShardIdent {
    if (slice.remainingBits >= 2 && slice.preloadUint(2) == 0b00) {
        slice.loadUint(2);
        let shard_pfx_bits: number = slice.loadUint(bitLen(60));
        let workchain_id: number = slice.loadInt(32);
        let shard_prefix: bigint = slice.loadUintBig(64);
        return {
            kind: "ShardIdent",
            shard_pfx_bits: shard_pfx_bits,
            workchain_id: workchain_id,
            shard_prefix: shard_prefix
        };
    }
    throw new Error('Expected one of "ShardIdent" in loading "ShardIdent", but data does not satisfy any constructor');
}

export function storeShardIdent(shardIdent: ShardIdent): (builder: Builder) => void {
    return (builder: Builder) => {
        builder.storeUint(0b00, 2);
        builder.storeUint(shardIdent.shard_pfx_bits, bitLen(60));
        builder.storeInt(shardIdent.workchain_id, 32);
        builder.storeUint(shardIdent.shard_prefix, 64);
    };
}

// capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;

export function loadGlobalVersion(slice: Slice): GlobalVersion {
    if (slice.remainingBits >= 8 && slice.preloadUint(8) == 0xc4) {
        slice.loadUint(8);
        let version: number = slice.loadUint(32);
        let capabilities: bigint = slice.loadUintBig(64);
        return {
            kind: "GlobalVersion",
            version: version,
            capabilities: capabilities
        };
    }
    throw new Error(
        'Expected one of "GlobalVersion" in loading "GlobalVersion", but data does not satisfy any constructor'
    );
}

export function storeGlobalVersion(globalVersion: GlobalVersion): (builder: Builder) => void {
    return (builder: Builder) => {
        builder.storeUint(0xc4, 8);
        builder.storeUint(globalVersion.version, 32);
        builder.storeUint(globalVersion.capabilities, 64);
    };
}

// master_info$_ master:ExtBlkRef = BlkMasterInfo;

export function loadBlkMasterInfo(slice: Slice): BlkMasterInfo {
    let master: ExtBlkRef = loadExtBlkRef(slice);
    return {
        kind: "BlkMasterInfo",
        master: master
    };
}

export function storeBlkMasterInfo(blkMasterInfo: BlkMasterInfo): (builder: Builder) => void {
    return (builder: Builder) => {
        storeExtBlkRef(blkMasterInfo.master)(builder);
    };
}

/*
ext_blk_ref$_ end_lt:uint64
  seq_no:uint32 root_hash:bits256 file_hash:bits256 
  = ExtBlkRef;
*/

export function loadExtBlkRef(slice: Slice): ExtBlkRef {
    let end_lt: bigint = slice.loadUintBig(64);
    let seq_no: number = slice.loadUint(32);
    let root_hash: Buffer = slice.loadBuffer(256 / 8);
    let file_hash: Buffer = slice.loadBuffer(256 / 8);
    return {
        kind: "ExtBlkRef",
        end_lt: end_lt,
        seq_no: seq_no,
        root_hash: root_hash,
        file_hash: file_hash
    };
}

export function storeExtBlkRef(extBlkRef: ExtBlkRef): (builder: Builder) => void {
    return (builder: Builder) => {
        builder.storeUint(extBlkRef.end_lt, 64);
        builder.storeUint(extBlkRef.seq_no, 32);
        builder.storeBuffer(extBlkRef.root_hash, 256 / 8);
        builder.storeBuffer(extBlkRef.file_hash, 256 / 8);
    };
}

// prev_blk_info$_ prev:ExtBlkRef = BlkPrevInfo 0;

// prev_blks_info$_ prev1:^ExtBlkRef prev2:^ExtBlkRef = BlkPrevInfo 1;

export function loadBlkPrevInfo(slice: Slice, arg0: number): BlkPrevInfo {
    if (arg0 == 0) {
        let prev: ExtBlkRef = loadExtBlkRef(slice);
        return {
            kind: "BlkPrevInfo_prev_blk_info",
            prev: prev
        };
    }
    if (arg0 == 1) {
        let slice1 = slice.loadRef().beginParse(true);
        let prev1: ExtBlkRef = loadExtBlkRef(slice1);
        let slice2 = slice.loadRef().beginParse(true);
        let prev2: ExtBlkRef = loadExtBlkRef(slice2);
        return {
            kind: "BlkPrevInfo_prev_blks_info",
            prev1: prev1,
            prev2: prev2
        };
    }
    throw new Error(
        'Expected one of "BlkPrevInfo_prev_blk_info", "BlkPrevInfo_prev_blks_info" in loading "BlkPrevInfo", but data does not satisfy any constructor'
    );
}

export function storeBlkPrevInfo(blkPrevInfo: BlkPrevInfo): (builder: Builder) => void {
    if (blkPrevInfo.kind == "BlkPrevInfo_prev_blk_info") {
        return (builder: Builder) => {
            storeExtBlkRef(blkPrevInfo.prev)(builder);
        };
    }
    if (blkPrevInfo.kind == "BlkPrevInfo_prev_blks_info") {
        return (builder: Builder) => {
            let cell1 = beginCell();
            storeExtBlkRef(blkPrevInfo.prev1)(cell1);
            builder.storeRef(cell1);
            let cell2 = beginCell();
            storeExtBlkRef(blkPrevInfo.prev2)(cell2);
            builder.storeRef(cell2);
        };
    }
    throw new Error(
        'Expected one of "BlkPrevInfo_prev_blk_info", "BlkPrevInfo_prev_blks_info" in loading "BlkPrevInfo", but data does not satisfy any constructor'
    );
}
