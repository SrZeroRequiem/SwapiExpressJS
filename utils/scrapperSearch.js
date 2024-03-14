const axios = require('axios');
const cheerio = require('cheerio')
const mysql = require('mysql2/promise')
let planets
async function scrapeSite(keyword) {
    const url = `https://www.starwars.com/search?q=${keyword}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];
    $('ul:first-child').each((i, elem) => {
        const text = $(elem).find('p.desc').text();
        results.push({ text });
    });
    return results
}
async function obtenerDatos(){
    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "swapi"
    })
    let datosExternos;

    try {

        datosExternos = await (await db).execute('SELECT name FROM people WHERE description IS NULL')

    } catch (error) {
        console.error('Error al obtener datos:', error);
    } finally {
    }

    return datosExternos[0];
}
function formatString(str){
    return str.replace(" ","-")
}
async function updateDesc(res){
    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "swapi"
    })
    console.log("Conected")
    res.map((p)=>{
        scrapeSite(formatString(p.name)).then(result => {
            const query = `UPDATE people SET description = ? WHERE name = ?`
            const values = [result[0].text, p.name];
            db.execute(query, values)
            console.log(p.name + " Actualizando")
            console.log(p.name + " Actualizado")
        }).catch(err => "");
    })
}
obtenerDatos().then((res)=>{
    updateDesc(res).then(r => console.log("Actualizado"))
})
