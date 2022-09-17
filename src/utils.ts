export const slog = {
    debug: (obj?: any) => console.log(`[DEBUG] ${obj}`),
    netdebug: (obj?: any) => console.log(`[NETDEBUG] ${obj}`),
    error: (obj?: any) => console.log(`[ERR] ${obj}`)
}