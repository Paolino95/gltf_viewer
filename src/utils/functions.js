export const constructList = list => {
    const result = [];

    for (const item in list)
        result.push({ text: list[item].text, value: list[item].id });

    return result;
};

// export const
