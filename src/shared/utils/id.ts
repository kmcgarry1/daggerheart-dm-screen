const getCryptoApi = () => (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined)

export const createIdGenerator = (prefix: string) => {
  let counter = 0

  return () => {
    const cryptoApi = getCryptoApi()
    if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
      return `${prefix}-${cryptoApi.randomUUID()}`
    }

    counter += 1
    return `${prefix}-${Date.now()}-${counter}`
  }
}
