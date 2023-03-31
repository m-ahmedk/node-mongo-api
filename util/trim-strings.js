
const trim_fields = async function (obj) {
    var list = Object.entries(obj)
    let array = new Array();

    for (let i=0; i<list.length; i++) {
        list[i][1] = list[i][1].trim();
        array.push(list[i]);
    }

    return array;
}

module.exports = trim_fields;