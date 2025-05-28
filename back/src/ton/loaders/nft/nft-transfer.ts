import { Address, beginCell, BitString, Builder, Cell, ExternalAddress, Slice } from "@ton/core";
import { verifyOpCode } from "..";
import { NFT_TRANSFER_OPCODE } from "../../lib/opcodes";
import { NftTransferMsgBody } from "./types";

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
// nothing$0 {X:Type} = Maybe X;

// just$1 {X:Type} value:X = Maybe X;

export type Maybe<X> = Maybe_nothing<X> | Maybe_just<X>;

export interface Maybe_nothing<X> {
    readonly kind: "Maybe_nothing";
}

export interface Maybe_just<X> {
    readonly kind: "Maybe_just";
    readonly value: X;
}

// left$0 {X:Type} {Y:Type} value:X = Either X Y;

// right$1 {X:Type} {Y:Type} value:Y = Either X Y;

export type Either<X, Y> = Either_left<X, Y> | Either_right<X, Y>;

export interface Either_left<X, Y> {
    readonly kind: "Either_left";
    readonly value: X;
}

export interface Either_right<X, Y> {
    readonly kind: "Either_right";
    readonly value: Y;
}

/*
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
*/

export interface Anycast {
    readonly kind: "Anycast";
    readonly depth: number;
    readonly rewrite_pfx: BitString;
}

// transfer query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell)  forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)  = InternalMsgBody;

export interface InternalMsgBody {
    readonly kind: "InternalMsgBody";
    readonly query_id: bigint;
    readonly new_owner: Address | ExternalAddress | null;
    readonly response_destination: Address | ExternalAddress | null;
    readonly custom_payload: Maybe<Cell>;
    readonly forward_amount: bigint;
    readonly forward_payload: Either<Cell, Cell>;
}

// nothing$0 {X:Type} = Maybe X;

// just$1 {X:Type} value:X = Maybe X;

export function loadMaybe<X>(slice: Slice, loadX: (slice: Slice) => X): Maybe<X> {
    if (slice.remainingBits >= 1 && slice.preloadUint(1) == 0b0) {
        slice.loadUint(1);
        return {
            kind: "Maybe_nothing"
        };
    }
    if (slice.remainingBits >= 1 && slice.preloadUint(1) == 0b1) {
        slice.loadUint(1);
        let value: X = loadX(slice);
        return {
            kind: "Maybe_just",
            value: value
        };
    }
    throw new Error(
        'Expected one of "Maybe_nothing", "Maybe_just" in loading "Maybe", but data does not satisfy any constructor'
    );
}

export function storeMaybe<X>(
    maybe: Maybe<X>,
    storeX: (x: X) => (builder: Builder) => void
): (builder: Builder) => void {
    if (maybe.kind == "Maybe_nothing") {
        return (builder: Builder) => {
            builder.storeUint(0b0, 1);
        };
    }
    if (maybe.kind == "Maybe_just") {
        return (builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeX(maybe.value)(builder);
        };
    }
    throw new Error(
        'Expected one of "Maybe_nothing", "Maybe_just" in loading "Maybe", but data does not satisfy any constructor'
    );
}

// left$0 {X:Type} {Y:Type} value:X = Either X Y;

// right$1 {X:Type} {Y:Type} value:Y = Either X Y;

export function loadEither<X, Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): Either<X, Y> {
    if (slice.remainingBits >= 1 && slice.preloadUint(1) == 0b0) {
        slice.loadUint(1);
        let value: X = loadX(slice);
        return {
            kind: "Either_left",
            value: value
        };
    }
    if (slice.remainingBits >= 1 && slice.preloadUint(1) == 0b1) {
        slice.loadUint(1);
        let value: Y = loadY(slice);
        return {
            kind: "Either_right",
            value: value
        };
    }
    throw new Error(
        'Expected one of "Either_left", "Either_right" in loading "Either", but data does not satisfy any constructor'
    );
}

export function storeEither<X, Y>(
    either: Either<X, Y>,
    storeX: (x: X) => (builder: Builder) => void,
    storeY: (y: Y) => (builder: Builder) => void
): (builder: Builder) => void {
    if (either.kind == "Either_left") {
        return (builder: Builder) => {
            builder.storeUint(0b0, 1);
            storeX(either.value)(builder);
        };
    }
    if (either.kind == "Either_right") {
        return (builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeY(either.value)(builder);
        };
    }
    throw new Error(
        'Expected one of "Either_left", "Either_right" in loading "Either", but data does not satisfy any constructor'
    );
}

/*
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
*/

export function loadAnycast(slice: Slice): Anycast {
    let depth: number = slice.loadUint(bitLen(30));
    let rewrite_pfx: BitString = slice.loadBits(depth);
    if (!(depth >= 1)) {
        throw new Error('Condition (depth >= 1) is not satisfied while loading "Anycast" for type "Anycast"');
    }
    return {
        kind: "Anycast",
        depth: depth,
        rewrite_pfx: rewrite_pfx
    };
}

export function storeAnycast(anycast: Anycast): (builder: Builder) => void {
    return (builder: Builder) => {
        builder.storeUint(anycast.depth, bitLen(30));
        builder.storeBits(anycast.rewrite_pfx);
        if (!(anycast.depth >= 1)) {
            throw new Error(
                'Condition (anycast.depth >= 1) is not satisfied while loading "Anycast" for type "Anycast"'
            );
        }
    };
}

// transfer query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell)  forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)  = InternalMsgBody;

export function loadNftTransferMsgBody(slice: Slice): NftTransferMsgBody {
    const op = verifyOpCode(slice, NFT_TRANSFER_OPCODE);

    let query_id: bigint = slice.loadUintBig(64);
    let new_owner: Address | ExternalAddress | null = slice.loadAddressAny();
    let response_destination: Address | ExternalAddress | null = slice.loadAddressAny();
    let custom_payload: Maybe<Cell> = loadMaybe<Cell>(slice, (slice: Slice) => {
        let slice1 = slice.loadRef().beginParse(true);
        return slice1.asCell();
    });
    let forward_amount: bigint = slice.loadVarUintBig(bitLen(16 - 1));
    let forward_payload: Either<Cell, Cell> = loadEither<Cell, Cell>(
        slice,
        (slice: Slice) => {
            return slice.asCell();
        },
        (slice: Slice) => {
            let slice1 = slice.loadRef().beginParse(true);
            return slice1.asCell();
        }
    );

    return {
        op,
        queryId: query_id,
        newOwner: new_owner,
        responseDestination: response_destination,
        customPayload: custom_payload,
        forwardAmount: forward_amount,
        forwardPayload: forward_payload
    };
}

export function storeInternalMsgBody(internalMsgBody: InternalMsgBody): (builder: Builder) => void {
    return (builder: Builder) => {
        builder.storeUint(0x5fcc3d14, 32);
        builder.storeUint(internalMsgBody.query_id, 64);
        builder.storeAddress(internalMsgBody.new_owner);
        builder.storeAddress(internalMsgBody.response_destination);
        storeMaybe<Cell>(internalMsgBody.custom_payload, (arg: Cell) => {
            return (builder: Builder) => {
                let cell1 = beginCell();
                cell1.storeSlice(arg.beginParse(true));
                builder.storeRef(cell1);
            };
        })(builder);
        builder.storeVarUint(internalMsgBody.forward_amount, bitLen(16 - 1));
        storeEither<Cell, Cell>(
            internalMsgBody.forward_payload,
            (arg: Cell) => {
                return (builder: Builder) => {
                    builder.storeSlice(arg.beginParse(true));
                };
            },
            (arg: Cell) => {
                return (builder: Builder) => {
                    let cell1 = beginCell();
                    cell1.storeSlice(arg.beginParse(true));
                    builder.storeRef(cell1);
                };
            }
        )(builder);
    };
}
