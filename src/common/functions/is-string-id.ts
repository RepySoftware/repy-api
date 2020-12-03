export function isStringId(id: any): boolean {
    return typeof (id) === 'string' || (Array.isArray(id) && id.every(x => typeof (x) === 'string'));
}