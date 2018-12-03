export function makePromiseCancable<T>(myPromise: Promise<T>): [Promise<T>, () => void] {
  let cancel: () => void;
  const cancelPromise = new Promise<T>((_, reject) => {
    cancel = reject;
  });
  return [Promise.race([myPromise, cancelPromise]), cancel!]
}
