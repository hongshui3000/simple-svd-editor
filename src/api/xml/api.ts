export const getXML = ({ path }: { path: string }) => ({
    key: ['xml', path],
    fetch: () => fetch(path).then(resp => resp.text()),
});
