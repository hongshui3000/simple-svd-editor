import Dadata from 'dadata-suggestions';

export default async function handler(req, res) {
    const {
        query: { query },
    } = req;
    const dadata = new Dadata(process.env.DADATA_API_KEY);
    const data = await dadata.address({ query });
    return res.json(data.suggestions);
}
