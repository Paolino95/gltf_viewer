export const constructList = list => {
    const result = [];

    for (const item in list)
        result.push({ text: list[item].id, value: list[item].id });

    return result;
};
