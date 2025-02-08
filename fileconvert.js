const fs = require('fs');
const pdf = require('pdfkit');
const extractText = require('office-text-extractor');
const pdf2json = require('pdf2json');
const http = require("https");

async function texttopdf(text,title)
{
    let promise = new Promise((resolve,reject) =>
    {
        let doc = new pdf();
        let name = "output.pdf";
        if (title != undefined) name = title+'.pdf';
        let out = fs.createWriteStream(name);
        doc.pipe(out);
        doc.fontSize(16).text(name.split('.')[0]+"\n\n");
        doc.fontSize(10).text(text);
        doc.end();
        out.on('error', err => reject(err));
        out.on('finish', () => {
            resolve(doc);
        });
    });
    return promise;
}

async function pdftable2json(name,number,opt,callback)  
{
    let abc = new pdf2json();
    abc.loadPDF('./'+name);
    let r = Array();
    abc.on("pdfParser_dataReady", data =>
    {
        if (data.data == undefined || data.data.Pages == undefined) return callback('Pas de données, pages disponibles') 
        for (let i = 0; i < data.data.Pages.length; i++)
        {
            if (data.data.Pages[i].Texts == undefined) return callback('Pas de textes dans le pdf')
            for (let j = 0; j < data.data.Pages[i].Texts.length; j++)
            {
                if (data.data.Pages[i].Texts[j].R == undefined || data.data.Pages[i].Texts[j].R[0].T == undefined) callback('Pas de textes dans les colonnes')
                r.push(data.data.Pages[i].Texts[j].R[0].T);
            }
        }
        if (opt) r.splice(0,opt);
        let titre = r.splice(0,number);
        for (let i = 0; i < titre.length; i++) {
            titre[i] = decodeURI(titre[i]).replace('Â','').replace("Ã©","é");
        }
        let json = [];
        //if (r.length % number != 0) return callback('Nombre de colonnes invalide ou lecture defaillante')
        while (r.length > 0)
        {
            let tempo = r.splice(0,number);
            let res = {};
            for (let i = 0; i < titre.length; i++)
            {
                res[titre[i]] = (unescape(tempo[i]).replace("Ã©","é")); 
            }
            json.push(res);
        }
        fs.writeFile('./'+name.split('.')[0]+'.json',JSON.stringify(json,null,2),err => 
        {
            if (err != null ) return callback(err);
            callback(`Fichier converti en ${name.split('.')[0]}.json\nTitres de colonne : ${titre.join(' , ')}`)
        });
    });
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: "wx" });
        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => {}); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });
        request.on("error", err => {
            file.close();
            fs.unlink(dest, () => {}); // Delete temp file
            reject(err.message);
        });
        file.on("finish", () => {
            resolve("Enregistré avec succès");
        });
        file.on("error", err => {
            file.close();

            if (err.code === "EEXIST") {
                reject("File already exists");
            } else {
                fs.unlink(dest, () => {}); // Delete temp file
                reject(err.message);
            }
        });
    });
}

async function jsontohtml(type,key,name) 
{
    return new Promise((resolve,reject) =>
    {
        fs.readFile(name, 'utf8', (err,data) => 
        {
            if (err) reject(err)
            data = JSON.parse(data);
            try {
                for (let i = 0; i < data.length; i++)
                {
                    console.log(i);
                    for (let j = 1; j < data.length; j++)
                    {
                        temp = data[j];
                        if ( (type == '+' && parseFloat(data[j][key]) < parseFloat(data[j-1][key])) || (type == '-' && parseFloat(data[j][key]) > parseFloat(data[j - 1][key])) )
                        {
                            console.log(data[j][key],data[j - 1][key]);
                            data[j] = data[j - 1];
                            data[j - 1] = temp;
                        }
                        if (isNaN(parseFloat(data[j][key])))
                        {
                            data.splice(j, 1);
                            data.push(temp);
                        }
                    }
                    console.log(data);
                }
            } catch (error) {
                for (let i = 0; i < data.length; i++)
                {
                    for (let j = 1; j < data.length; j++)
                    {
                        if ( (type == '+' && (data[j][key]) < (data[j-1][key])) || (type == '-' && (data[j][key]) > (data[j - 1][key])) )
                        {
                            temp = data[j];
                            data[j] = data[j - 1];
                            data[j - 1] = temp;
                        }  
                    }
                }
            }
            if (data[0] == undefined) reject("Ce n'est pas un tableau")
            let lignes = data[0].length;
            for (let i = 0; i < data.length; i++) 
            {
                if (data[i] == undefined) reject("Ligne (s) inexistante / hors du tableau")
                if (data[i].length != lignes) reject("Ce n'est pas un tableau valide")
            }
            let html = `
            <!DOCTYPE html>
            <html dir="ltr" lang="fr">
            <head>
                <title>${name.split('.')[0]}</title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                <style>
                    @charset "utf-8";
                    body {
                        margin: 0px;
                        padding: 0px;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                        color: #333;
                        font-size: 12px;
                        text-align: center;
                        background-color: #e7e7e7f5;
                    }
                    table 
                    {
                        max-width: 1100px;
                        width: 92%;
                        border-collapse: collapse;
                        line-height: 20px;
                        margin: 0 auto 50px;
                        table-layout: fixed;
                    }
                    td,th
                    {
                        padding: 8px;
                        vertical-align: top;
                        border: 1px solid rgb(220, 220, 220);
                        font-size: 14px;
                        background-color: #fff;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }
                    header
                    {
                        height: 100px;
                        background-color: rgba(91, 30, 190, 0.96);
                        color: #fff;
                    }
                    footer
                    {
                        height: 100px;
                        background-color: rgba(91, 30, 190, 0.96);
                    }
                    .title
                    {
                        display: inline-block;
                        vertical-align: middle;
                        font-size: 30px;
                        margin-top: 25px;
                    }
                    nav
                    {
                    width: 100%;
                    margin: 20px 0px 30px 0px;
                    background-color: white;
                    position: sticky;
                    top: 0px;
                    }

                    nav ul
                    {
                        list-style-type: none;
                    }

                    nav ul li
                    {
                        float: right;
                        width: 25%;
                        text-align: center;
                        position: relative;
                    }

                    nav ul::after
                    {
                        content: "";
                        display: table;
                        clear: both;
                    }

                    nav a
                    {
                        display: block;
                        text-decoration: none;
                        color: black;
                        border-bottom: 2px solid transparent;
                        padding: 10px 0px;
                    }

                    nav a:hover
                    {
                        color: orange;
                        border-bottom: 2px solid gold;
                    }

                    .sous
                    {
                        display: none;
                        box-shadow: 0px 1px 2px #CCC;
                        background-color: white;
                        position: absolute;
                        width: 100%;
                        z-index: 1000;
                    }
                    nav > ul li:hover .sous
                    {
                        display: block;
                    }
                    .sous li
                    {
                        float: none;
                        width: 100%;
                        text-align: left;
                    }
                    .sous a
                    {
                        padding: 10px;
                        border-bottom: none;
                    }
                    .sous a:hover
                    {
                        border-bottom: none;
                        background-color: RGBa(200,200,200,0.1);
                    }
                    .deroulant > a::after
                    {
                        content:" ▼";
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <header><span class="title">${name.split('.')[0]}</span></header>
            <nav>
                <ul>
                    <li>
                    <a href="mailto::BotYeswecan@gmail.com?subject=Réclamation&body=Veillez noter que toute réclamation passera par un examen préalable du contenu par le Père Noël !">Contacter le bot</a>
                    </li>
                    <li class="deroulant"><a>Moyenne &ensp;</a>
                    <ul class="sous">`;
            let keys = Object.keys(data[0]);
            for (let i = 0; i < data.length; i++) 
            {
                if (Object.keys(data[i]) == undefined) reject("Ligne (s) hors du tableau, nom de colonnes inexistant")
                //if (Object.keys(data[i]) != keys) reject("Ce n'est pas un tableau valide, nom de colonnes non constant")
            }
            for (let i = 0; i < keys.length; i++)
            {
                html += `
                    <li><a onclick='moyenne("${keys[i]}")'>${keys[i]}</a></li>`;
            }
            html += `
                    </ul>
                </li>
            </ul>
            </nav>
            <table>
                <tbody>
            <tr>`;
            for (let i = 0; i < keys.length; i++)
            {
                html += `
                <th>${keys[i].replace("Ã©,é")}</th>`;
            }
            html += `
            </tr>`;
            for (let i = 0; i < data.length; i++)
            {
                html += `<tr>`;
                for (let j = 0; j < keys.length; j++)
                {
                    html += `
                    <td>${data[i][keys[j]].replace("Ã©,é")}</td>`;
                }
                html += `
                </tr>`;
            }
            let value = {};
            for (let i = 0; i < keys.length; i++)
            {
                let compteur = 0; jn = 0;
                for (let j = 0; j < data.length; j++)
                {
                    if (!isNaN(parseFloat(data[j][keys[i]]))) 
                    {
                        let number = parseFloat(data[j][keys[i]]);
                        compteur += number;
                        jn++;
                    }
                }
                if (jn == 0) value[keys[i]] = null
                else value[keys[i]] = Math.round(compteur*100/jn)/100
            }
            html += `
                </tbody>
                </table>
                <footer>
                </footer>
                <script type="text/javascript">
                    let keys = ${JSON.stringify(value)};
                    function moyenne(s)
                    {
                        if (keys[s] != null) alert('La moyenne de '+s+' est de '+keys[s])
                        else alert('La moyenne de '+s+' est indéfini, pas de nombres dans cette colonne !')
                    }
                </script>
            </body>
            </html>`;
            fs.writeFile(`./${name.split('.')[0]}.html`,html,'utf8', err => {
                if (err != null) console.log(err)
            });
            resolve('Fichier crée');
        });
    });
}

async function csvtojson(name)
{
    return new Promise((resolve,reject) =>
    {
        fs.readFile(`./${name}`, (err,data) =>
        {
            if (err) reject(err)
            data = data.toString('utf-8').split('\n');
            for (let i = 0; i < data.length; i++) data[i] = data[i].replace('\r','')
            let key = data[0].split(',');
            let json = [];
            for (let i = 1; i < data.length; i++)
            {
                let tempo = {};
                for (let j = 0; j < key.length; j++)
                {
                    tempo[key[j]] = data[i].split(',')[j];
                    if (data[i].split(',')[j] == undefined) tempo[key[j]] = null
                }
                json.push(tempo);
            }
            fs.writeFile(`./${name.split('.')[0]}.json`,JSON.stringify(json),err => { if (err != null) reject(err)} );
            resolve(`Le fichier ${name} a été transformé avec succès en ${name.split('.')[0]}.json`);
        });
    });
}

module.exports.csvtojson = csvtojson;
module.exports.download = download;
module.exports.jsontohtml = jsontohtml;
module.exports.pdftable2json = pdftable2json;
module.exports.texttopdf = texttopdf;