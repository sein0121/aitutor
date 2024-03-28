/**
 * 네임 키값을 키로 갖는 오브젝트
 * @param {array} array
 * @returns
 */
function convArrayToObjectByKey2(array) {
    if (!Array.isArray(array)) {
        console.log('source is not array!');
        return;
    }
    const keys = {};
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        const key = i;

        if (!keys[key]) {
            keys[key] = {};
            for(var key2 in item) {
                keys[key][key2] = item[key2];
            }
        }
    }
    return keys;
}