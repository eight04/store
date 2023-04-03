import type { Store } from "../store.mjs";

export type StoresValues<S extends Store[]> = {
  [K in keyof S]: S[K] extends Store ? ReturnType<S[K]["get"]> : never
};
export type StoreDelta<T extends Store> = T extends Store ? Parameters<T["set"]>[0] : never;
export type StoresDeltas<S extends Store[]> = {
  [K in keyof S]: S[K] extends Store ? StoreDelta<S[K]> : never
};
export type OneOf<T extends any[]> = T[number];

/**
 * Pipe one or more source stores into target store.
 */
export function pipe<S extends Store[], T extends Store>({
  sources,
  target,
  onChange
}: {
  sources: S;
  target: T;
  onChange: (delta: OneOf<StoresDeltas<S>>, index: number) => StoreDelta<T> | null;
}) {
  sources.forEach((source, index) => {
    const handleChange = (delta: OneOf<StoresDeltas<S>>) => {
      const newDelta = onChange(delta, index);
      if (newDelta) {
        target.set(newDelta);
      }
    };
    source.on("change", handleChange);
    target._destroy.push(() => source.off("change", handleChange));
  });
}


