export const prepareValuesForSelect = (data: { id: number; name: string }[]) =>
    data.map(i => ({ value: `${i.id}`, label: `${i.name}` }));
