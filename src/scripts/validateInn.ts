const validateInn = (value: string) => {
    if (!value) return true;

    const inn = value;

    let isCorrect = false;
    let checkdigit;
    let firstCheckdigit;
    let secondCheckdigit;

    const countCheckdigit = (str: string, coefficients: number[]) => {
        const checksum = coefficients.reduce((sum, coefficient, index) => sum + coefficient * Number(str[index]), 0);

        return (checksum % 11) % 10;
    };

    switch (inn.length) {
        case 10:
            checkdigit = countCheckdigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
            if (checkdigit === parseInt(inn[9], 10)) {
                isCorrect = true;
            }
            break;
        case 12:
            firstCheckdigit = countCheckdigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
            secondCheckdigit = countCheckdigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
            if (firstCheckdigit === parseInt(inn[10], 10) && secondCheckdigit === parseInt(inn[11], 10)) {
                isCorrect = true;
            }
            break;
        default:
    }

    return isCorrect;
};

export default validateInn;
