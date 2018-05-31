import '../img/icon-128.png'

fetch('https://api.coinmarketcap.com/v2/ticker/')
    .then((response) => response.json())
    .then((raw) => {
        chrome.storage.sync.set({'loaded': true, 'coins': transformData(raw.data)}, function () {});
    });

const transformData = data => {
    const result = {};
    const arrayOfObjects = Object.keys(data).map(key => {
        return data[key]
    });

    for (const {name, quotes} of arrayOfObjects)
        result[name.toLowerCase()] = {value: quotes['USD'].price};

    return JSON.stringify(result);
};