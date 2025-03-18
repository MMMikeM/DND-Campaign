type LogMeta = Record<string, unknown>;
export declare const debug: (message: string, meta?: LogMeta) => void;
export declare const info: (message: string, meta?: LogMeta) => void;
export declare const warn: (message: string, meta?: LogMeta) => void;
export declare const error: (message: string, meta?: LogMeta) => void;
export declare const fatal: (message: string, meta?: LogMeta) => void;
declare const _default: {
    debug: (message: string, meta?: LogMeta) => void;
    info: (message: string, meta?: LogMeta) => void;
    warn: (message: string, meta?: LogMeta) => void;
    error: (message: string, meta?: LogMeta) => void;
    fatal: (message: string, meta?: LogMeta) => void;
};
export default _default;
