const convert = require('./fileconvert.js');
const discord = require('discord.js');
const divers = require('./divers.js');
const fs = require('fs');
const web = require("xmlhttprequest");

const covid = (channel,callback) =>
{
    const xhr = new web.XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            data = JSON.parse(this.responseText);
            let embed = new discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor('Yes we can')
                .setTitle("Statistiques Covid au "+(data[0].lastUpdate).split('T').join(' à ').split('+').join(' à GMT+'))
                .setDescription("Cas confirmés : "+divers.sep3chiffres(data[0].confirmed)+"\nCas critiques : "+divers.sep3chiffres(data[0].critical)+"\nMorts : "+divers.sep3chiffres(data[0].deaths)+"\nGueris : "+divers.sep3chiffres(data[0].recovered))
                .setFooter('Max 50 000 requetes/mois')
                .setTimestamp();
            return callback(embed);
        }
    });
    xhr.onerror = () => {
        return channel.send("La requête a échoué "+xhr);
    };
    xhr.open("GET", "https://covid-19-data.p.rapidapi.com/totals");
    xhr.setRequestHeader("x-rapidapi-key", "d4fa0c7251msh4a4b731dfe6cd80p1b2db3jsn8038b186f6ca");
    xhr.setRequestHeader("x-rapidapi-host", "covid-19-data.p.rapidapi.com");
    xhr.send();
}

const dic = (channel,keyword,callback) =>
{
    const xhr = new web.XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let data = JSON.parse(this.responseText);
            if (data.success == false) return channel.send("Ce mot n'est pas dans la base de données")
            let embed = new discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor('Yes we can')
                .setThumbnail('http://www.lespossibles.org/wp-content/uploads/2017/02/bilingue-anglais-francais-pour-cours-prive-5898961430.jpg')
                .setTitle('Word : '+data.word+'\n*Frequency : '+data.frequency+'*')
                .setFooter('Limit : 2500 requests per day')
                .setTimestamp();
            if (data.results == undefined) return channel.send('Pas de definition associée')
            data = data.results.splice(0,10); 
            for (let i = 0; i < data.length; i++)
            {
                if (data[i].synonyms) embed.addField("Definition : "+data[i].definition,"Synonyms : "+data[i].synonyms.join(', '))
                else embed.addField("Definition : "+data[i].definition,"No Synonyms");
            }
            return callback(embed);
        }
    });
    xhr.onerror = () => {
        return message.channel.send("La requête a échoué "+xhr);
    };
    xhr.open("GET", "https://wordsapiv1.p.rapidapi.com/words/"+keyword);
    xhr.setRequestHeader("x-rapidapi-key", "d4fa0c7251msh4a4b731dfe6cd80p1b2db3jsn8038b186f6ca");
    xhr.setRequestHeader("x-rapidapi-host", "wordsapiv1.p.rapidapi.com");
    xhr.send();
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

const summary = (channel,url,name) =>
{
    request_summary(channel,url,data =>
    {
        convert.texttopdf(data,name).then(r => 
        {
            let attachment = new discord.MessageAttachment('./'+name+".pdf");
            channel.send(attachment).then(m => fs.unlink('./'+name+".pdf",callback => 
            {
                if (callback != null) console.log(callback);
            })).catch(echec => channel.send(echec));
        });
    });
}

async function request_summary(channel,url,callback)
{
    const xhr = new web.XMLHttpRequest(); //Unlimited but 20 request/hours
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", () =>
    {
        if (xhr.readyState === xhr.DONE && xhr.status == 200) 
        {
            let data = JSON.parse(xhr.responseText);
            if (data.Summary == null || data == {} || data.Summary == "Not your computer?\nUse a private browsing window to sign in.") return channel.send('Pas de reponse correspondant à votre requete') 
            data = data.Summary;
            return callback(data);
        }
    });
    xhr.open("GET", "https://summarization3.p.rapidapi.com/summary/v1/?url="+url);
    xhr.setRequestHeader("x-rapidapi-key", "d4fa0c7251msh4a4b731dfe6cd80p1b2db3jsn8038b186f6ca");
    xhr.setRequestHeader("x-rapidapi-host", "summarization3.p.rapidapi.com");
    xhr.send();
}

async function find_subtitles(channel,key,lang,callback)
{
    const xhr = new web.XMLHttpRequest(); //100 request/day
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) 
        {
            let data = JSON.parse(this.responseText);
            if (data.length == undefined  || data.length == 0) return channel.send('Sous-titres indisponibles sur cette video') 
            if (data.error) return message.channel.send(data.error);
            let rep = "Traduction to "+lang+"\n\n";
            for (let i = 0; i < data.length; i++)
            {
                rep += data[i].text+' ';
            }
            rep = rep.split('&#39;').join("'");
            rep = rep.split('&quot;').join('"');
            callback(rep);
        }
    });
    xhr.onerror = () => {
        return message.channel.send("erreur lors de l'accès à l'API");
    };
    xhr.open("GET", "https://subtitles-for-youtube.p.rapidapi.com/subtitles/"+key+"?lang="+lang);
    xhr.setRequestHeader("x-rapidapi-key", "d4fa0c7251msh4a4b731dfe6cd80p1b2db3jsn8038b186f6ca");
    xhr.setRequestHeader("x-rapidapi-host", "subtitles-for-youtube.p.rapidapi.com");
    xhr.send();
}

async function translate(key,sl,tl,callback) //300 requests/month
{
    const xhr = new web.XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open("GET", "https://google-translate20.p.rapidapi.com/translate?text="+key+"&tl="+tl+"&sl="+sl);
    xhr.setRequestHeader("x-rapidapi-key", "d4fa0c7251msh4a4b731dfe6cd80p1b2db3jsn8038b186f6ca");
    xhr.setRequestHeader("x-rapidapi-host", "google-translate20.p.rapidapi.com");
    xhr.send();
    xhr.onerror = () => {
        return callback("erreur lors de l'accès à l'API");
    };
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let data = JSON.parse(xhr.responseText);
            if (data.code != 200) return callback('Erreur '+data.error)
            let rep = "Traduction de "+sl+" à "+tl+"\n";
            for (let i = 0; i < data.data.pairs.length; i++)
            {
                rep += data.data.pairs[i].t+"\n";
            }
            callback(unescape(rep));
        }
    });
}

function findgeocode(channel,adresse,pays,callback) 
{
    const xhr = new web.XMLHttpRequest(); //Hard-Limit 1500/day
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState === xhr.DONE) {
            let data = JSON.parse(xhr.responseText);
            if (data.error) return channel.send(data.error)
            data = data.results[0];
            let embed = new discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor('Yes we can')
                .setThumbnail("https://ewebdesign.com/wp-content/uploads/2019/10/Thumbnail-Preset-@2x-2.jpg")
                .setTitle(data.address)
                .setDescription("Region : "+data.region+"\nLocalisation : "+data.location_type+"\nLatitude : "+data.location.lat+"\nLongitude : "+data.location.lng+"\n[Lien Map](https://www.google.fr/maps/@"+data.location.lat+","+data.location.lng+",19z)")
                .setFooter('API request, hard-limit : 1500 per day')
                .setTimestamp();
            return callback(embed,{"Adresse": data.address,"lat": data.location.lat,"lon": data.location.lng});
        }
    });
    xhr.onerror = () => {
        return channel.send("La requête a échoué "+xhr);
    };
    xhr.open("GET", "https://trueway-geocoding.p.rapidapi.com/Geocode?address="+escape(adresse)+"&language=fr&country="+pays);
    xhr.setRequestHeader("x-rapidapi-key", "d4fa0c7251msh4a4b731dfe6cd80p1b2db3jsn8038b186f6ca");
    xhr.setRequestHeader("x-rapidapi-host", "trueway-geocoding.p.rapidapi.com");
    xhr.send();
}

async function adresse_velib(adress,callback) 
{
    fs.readFile("./.vscode/velib.json", (err,data) =>
    {
        let rep = JSON.parse(data).find(table => table.Adresse == adress);
        rep = (rep != undefined) ? rep : false;
        return callback(rep);
    });
}

async function adresse_station(adress,distance)
{
    return new Promise((resolve, reject) =>
    {
        adresse_velib(adress,(data) => 
        {
            if (!data) reject('Coordonnées non enregistrés. Check /velib add')
            let latitude = data.lat;
            let longitude = data.lon;
            let xhr = new web.XMLHttpRequest();
            xhr.open("GET","https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json",true);
            xhr.responseType = "json";
            xhr.send();
            xhr.onerror = () => {
                reject("La requête a échoué "+xhr);
            };
            xhr.onload = () =>
            {
                if (xhr.status != 200)
                { 
                    reject("Erreur lors de la lecture des localisation : " + xhr.status);
                }
                else
                { 
                    let result = JSON.parse(xhr.responseText)["data"]["stations"];
                    let data = [];
                    for (let i = 0; i < result.length; i++)
                    {
                        let d = measure(latitude,longitude,result[i]['lat'],result[i]['lon']);
                        if ( d <= distance )
                        {
                            data.push({'station_id': result[i]['stationCode'],'name': result[i]['name'],'d':Math.round(d),'lat':result[i]['lat'],'lon':result[i]['lon']});
                        }
                    }
                    if (data.length == 0) reject('Aucun résultat dans le périmètre sélectionné')
                    data.sort( (a,b) => a['d'] - b['d'] );
                    resolve(data.splice(0,5));
                }
            }
        });
    });
}

const velib = (adress,distance,callback) =>
{
    adresse_station(adress,distance).then(data => 
    {
        let velib = new web.XMLHttpRequest();
        velib.open("GET","https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json",true);
        velib.responseType = "json";
        velib.send();
        velib.onerror = () => {
            callback("La requête a échoué "+velib);
        };
        velib.onload = () =>
        {
            if (velib.status != 200)
            { 
                callback("Erreur lors de la lecture des stations : " + velib.status);
            }
            else
            { 
                let reponse = JSON.parse(velib.responseText);
                let time = reponse['lastUpdatedOther'];
                let date = new Date(time*1000);
                let embed = new discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Disponibilités autour de : '+adress)
                    .setAuthor('Yes we can')
                    .setThumbnail("https://img.bfmtv.com/i/0/0/142/84d6b708ef2a375ef6834598c2f94.jpeg")
                    .setFooter("Màj le "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" à "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds())
                    .setTimestamp();
                reponse = reponse["data"]["stations"];
                for (let i = 0; i < data.length; i++)
                {
                    for (let j = 0; j < reponse.length; j ++)
                    {
                        if (data[i]['station_id'] == reponse[j]['stationCode'])
                        {
                            embed.addField('Station '+data[i]['station_id']+' : '+data[i]['name']+' à la distance de : '+data[i]['d']+' m','Velos disponibles : '+reponse[j]['num_bikes_available']+'\nNombre de vélos mécaniques : '+reponse[j]['num_bikes_available_types'][0]['mechanical']+'\nNombre de vélos éléctriques : '+reponse[j]['num_bikes_available_types'][1]['ebike']+'\nPlaces disponibles : '+reponse[j]['numDocksAvailable']+'\n[Lien map](https://www.google.fr/maps/@'+data[i]['lat']+','+data[i]['lon']+',17z)');
                            break;
                        }
                    }
                }
                return callback([embed]);
            }
        };
    }).catch(err => callback(err));
}

const html = (channel,ordre,column,file) => 
{
    convert.jsontohtml(ordre,column,file).then(data => 
    {
        try {
            if (fs.existsSync(`./${file.split('.')[0]}.html`)) 
            {
                attachment = new discord.MessageAttachment(`./${file.split('.')[0]}.html`);
                channel.send(attachment).then(m => fs.unlink(`./${file.split('.')[0]}.html`,callback => 
                {
                    if (callback != null) console.log(callback);
                })).catch(echec => channel.send(echec));
            }
            else
            {
                return channel.send('Fichier indisponible ou mal ecris, cf ²help listfichiers');   
            }
            return data;
        } catch(err) { console.log(err); }
    }).catch(err => channel.send(err));
}

const subtitles = (channel,key,lang,name) => 
{
    find_subtitles(channel,key,lang,data => 
    {
        convert.texttopdf(data,name).then(r => 
        {
            let attachment = new discord.MessageAttachment('./'+name+".pdf");
            channel.send(attachment).then(m => fs.unlink('./'+name+".pdf",callback => 
            {
                if (callback != null) console.log(callback);
            })).catch(echec => channel.send(echec));
        });
    });
}

const meteo = async (ville) =>
{
    return new Promise((resolve, reject) =>
    {
        const xhr = new web.XMLHttpRequest(); //Hard Limit : 1 000 000/month
        xhr.withCredentials = true;
        xhr.open("GET", "https://weatherapi-com.p.rapidapi.com/forecast.json?q="+ville+"&days=3&lang=fr");
        xhr.setRequestHeader("x-rapidapi-key", "d4fa0c7251msh4a4b731dfe6cd80p1b2db3jsn8038b186f6ca");
        xhr.setRequestHeader("x-rapidapi-host", "weatherapi-com.p.rapidapi.com");
        xhr.send();
        xhr.onerror = (err) => {
            reject("La requête a échoué : "+err);
        };
        xhr.addEventListener("readystatechange", () =>
        {
            if (xhr.readyState === xhr.DONE) 
            {
                let result = JSON.parse(xhr.responseText);
                if (result.error) reject('Error : '+result.error.message);
                let embed = new discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('**Meteo à '+result.location.name+' region '+result.location.region+' pays '+result.location.country+'\nle '+result.location.localtime+'**')
                    .setAuthor('Yes we can')
                    .setThumbnail('https:'+result.current.condition.icon)
                    .setDescription('*Lever du soleil : '+result.forecast.forecastday[0].astro.sunrise+'*\n*Coucher du soleil : '+result.forecast.forecastday[0].astro.sunset+'*\n*Visibilité : '+result.current.vis_km+' km*\n*Precipitations : '+result.current.precip_mm+" mm*\n*UV : "+result.current.uv+'*')
                    .addField('\u200B','*Condition : '+result.current.condition.text+'*\n*Pression : '+result.current.pressure_mb+' hPa*\n*Humidité : '+result.current.humidity+' %*',true)
                    .addField('\u200B','*Vent : '+result.current.wind_kph+' km/h du '+result.current.wind_degree+'*\n*Rafale : '+result.current.gust_kph+' km/h*\n*Température : '+result.current.temp_c+' °C*\n*Ressentie : '+result.current.feelslike_c+' °C*',true)
                    .setFooter('Utilisez les réactions pour afficher\nce jour en entier, où les suivants\nHard Limit Api : 1 000 000/month')
                    .setTimestamp();
                resolve([embed,result])
            }
        });
    });
}

const snif_meteo = async (message,result) =>  
{
    message.react('0️⃣').then(e => message.react('1️⃣').then(e => message.react('2️⃣'))).catch(err => console.log(err));
    let collect = message.createReactionCollector(m => m.me == false,{time:30000,max:3});
    collect.on('collect', reaction => 
    {
        if (['0️⃣','1️⃣','2️⃣'].includes(reaction._emoji.name))
        {
            let i = {'0️⃣':0,'1️⃣':1,'2️⃣':2}[reaction._emoji.name];
            let embed = new discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('**Meteo à '+result.location.name+' région : '+result.location.region+' pays : '+result.location.country+' le : '+result.forecast.forecastday[i].date+'**')
                .setAuthor('Yes we can')
                .setFooter('Hard Limit 1 000 000 requests/month')
                .setTimestamp();
            result = result.forecast.forecastday[i];
            embed.setThumbnail('https:'+result.day.condition.icon);
            embed.setDescription('*Condition : '+result.day.condition.text+'*\n*Température max : '+result.day.maxtemp_c+' °C*\n*Température min : '+result.day.mintemp_c+' °C*\n*Humidité : '+result.day.avghumidity+'*\n*Probabilité de pluie : '+result.day.daily_chance_of_rain+' %*\n*Precipitations : '+result.day.totalprecip_mm+' mm*\n*Visibilté : '+result.day.avgvis_km+' km*\n*UV : '+result.day.uv+'*');
            result = result.hour;
            for (let j = 0; j < 24; j++)
            {
                let data = result[j];
                embed.addField('**'+j+':00**',data.condition.text+'\n*Temp : '+data.temp_c+' °C*\n*Ressentie : '+data.feelslike_c+' °C*\n*Vent : '+data.wind_kph+' km/h '+data.wind_degree+'*\n*Proba pluie '+data.chance_of_rain+' %*\n*Pluie : '+data.precip_mm+' mm*',true)
            }
            message.channel.send(embed).catch(err => console.log(err));   
        }
    });     
}

module.exports.covid = covid;
module.exports.dic = dic;
module.exports.findgeocode = findgeocode;
module.exports.html = html;
module.exports.meteo = meteo;
module.exports.snif_meteo = snif_meteo;
module.exports.subtitles = subtitles;
module.exports.summary = summary;
module.exports.translate = translate;
module.exports.velib = velib;