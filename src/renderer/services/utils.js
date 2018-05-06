export function arrayToObject(array, index = 'id'){
    return array.reduce((obj, item) => {
        obj[item[index]] = item;
        return obj;
    }, {});
}