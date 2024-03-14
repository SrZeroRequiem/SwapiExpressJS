const axios = require("axios");
const cheerio = require("cheerio");
const translatte = require('translatte');
async function scrapeSite(keyword) {
    const url = `https://starwars.fandom.com/wiki/${keyword}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];
    const startNode = $('aside.portable-infobox.pi-background.pi-border-color.pi-theme-morado.pi-layout-default');
    const endNode = $('table.noprint.stub.plainlinks');
    const betweenNodes = startNode.nextUntil(endNode);
    const valuesBetweenNodes = betweenNodes.map((i, el) => $(el).text()).get();

// Use the map method to extract the text content of the elements

    return valuesBetweenNodes
}
function formatString(str){
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(",","_")
}
async function translatteText(str){
    const strArray = str.split(" ")
    strArray.map(async (strT) => {
        await translatte(strT, {to: 'es'}).then(res => {
            console.log(res.text)
        }).catch(err => console.log(err));
    })

}
translatteText("CR90 Corvette").then(res => console.log(res))
/*translatte('Corvette', {to: 'es'})
    .then(result => {
        console.log(formatString(result.text))
        scrapeSite(formatString(result.text)).then(result => {
            console.log(result)

        })
    })
    .catch(err => console.log(err));*/
