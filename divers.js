const discord = require('discord.js');
const fs = require('fs');
const music = require('./music.js')
const playlist = require('./playlist.json')

const anti_spam = (message) => 
{
    const anti_spam = message.mentions.users.keys();
    for (let i of anti_spam)
    {
        if (message.content.split(i).length > 3)
        {
            message.delete();
            let last_spam = message.channel.messages.cache.find(m => m.author.id == '804064476647260281');
            if (last_spam != undefined && last_spam.content == 'Message censuré. Motif : Spam')
            {
                last_spam.delete();
            }
            message.channel.send('Message censuré. Motif : Spam');
        }
    }
    if (message.mentions.users.size > 0)
    {
        let day = new Date;
        let research = message.channel.messages.cache.filter(m => m.author.id == message.author.id).keyArray().slice(0,3);
        let actuel = message.mentions.users.keyArray();
        if (research.length < 3) return 
        let value = 0;
        for (let i = 0; i < 3;i++)
        {
            let compteur = false;
            let old = message.channel.messages.cache.find(m => m.id == research[i]).mentions.users.keyArray();
            for (let j = 0; j < actuel.length; j++)
            {
                if (old.includes(actuel[j]))
                {
                    compteur = true;
                }
            }
            if (compteur) value ++;
        }
        if (value > 1 && day.getTime()-message.channel.messages.cache.find(m => m.id == research[0]).createdTimestamp < 20000)
        {
            let last = message.channel.messages.cache.find(m => m.author.id == '804064476647260281');
            if (last != undefined && last.content.endsWith('Patientez 30s avant de pouvoir écrire a nouveau') && day.getTime()-last.createdTimestamp < 30000) return
            let blacklist = message.author.id;
            message.delete();
            message.reply('Vous avez été detectez comme spammeur. Patientez 30s avant de pouvoir écrire a nouveau').then( () =>
            {
                const filter = m => m.author.id === blacklist;
                const collector = new discord.MessageCollector(message.channel,filter,{time: 30000});
                collector.on('collect', response => 
                {
                    response.delete();
                });
                collector.on('end', err => 
                {
                    message.channel.send('<@!'+blacklist+'>, Vous pouvez a nouveau parler');
                });
            });
        }
    }
}
async function InformationCUPGE(type,key,colle_status)
{
    return new Promise((resolve,reject) =>
    {
        const list = require('C:/Bot Yes we can/Liste CUPGE.json');
        //const meca = require('C:/Bot Yes we can/colle meca.json');
        //const math = require('C:/Bot Yes we can/colle math.json');
        let day = new Date;
        let UP; let Nom; let Prenom; let TD; let colle; let email; let email_uni;
        for (let i = 0; i < list.length; i++)
        {
            if (list[i][type].toLowerCase() == key)
            {
                let a = list[i];
                UP = a['UP'];
                Nom = a['nom'];
                Prenom = a['prenom'];
                TD = a['TD'];
                colle = a['colle'];
                email = a['email perso'];
                email_uni = a['email universitaire'];
                photo = a['photo'];
            }
        }
        if (!UP) reject("N'es pas dans la base de données");
        const attachment = new discord.MessageAttachment('C:/Bot Yes we can/image/'+photo,'photo.jpg');
        embed = new discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('**'+Prenom+' '+Nom+'**')
            .setAuthor('Yes we can')
            .attachFiles(attachment)
            .setThumbnail('attachment://photo.jpg')
            .addField('***Informations***',' - *Groupe de TD : '+TD+'*\n - *Groupe de colle : '+colle+'*\n - *Email : '+email+'*\n - *Email-universitaire : '+email_uni+'*')
            .setFooter('Numero etudiant : '+UP)
            .setTimestamp();
        resolve([embed]);
        if (colle_status == 'meca' || colle_status == 'all')
        {
            let td = "";
            for (let i = 0; i < meca.length; i++)
            {
                if (meca[i]['groupe'] == colle)
                {
                    if (parseInt(meca[i]['value'].split('/')[1]) < day.getMonth()+1 || (parseInt(meca[i]['value'].split('/')[1]) == day.getMonth()+1 && parseInt(meca[i]['value'].split('/')[0]) < day.getDate()))
                    {
                    td += ' - ~~'+meca[i]['Date']+' à '+meca[i]['heure']+'~~\n';
                    }
                    else
                    {
                        td += ' - *'+meca[i]['Date']+' à '+meca[i]['heure']+'*\n';
                    }
                }
            }
            embed2 = new discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('**'+Prenom+' '+Nom+'**')
                .setAuthor('Yes we can')
                .addField('**Colles mécaniques**',td)
                .setFooter("Données màj le 5 février")
                .setTimestamp();   
            if (colle_status == 'meca') resolve([embed,embed2]) 
        }  
        if (colle_status == 'math' || colle_status == 'all')
        {
            let td = "";
            for (let i = 0; i < math.length; i++)
            {
                if (math[i]['groupe'] == colle)
                {
                    if (parseInt(math[i]['value'].split('/')[1]) < day.getMonth()+1 || (parseInt(math[i]['value'].split('/')[1]) == day.getMonth()+1 && parseInt(math[i]['value'].split('/')[0]) < day.getDate()))
                    {
                    td += ' - ~~'+math[i]['Date']+' à '+math[i]['heure']+'~~\n';
                    }
                    else
                    {
                        td += ' - *'+math[i]['Date']+' à '+math[i]['heure']+'*\n';
                    }
                }
            }
            embed3 = new discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('**'+Prenom+' '+Nom+'**')
                .setAuthor('Yes we can')
                .addField('**Colles mathématiques**',td)
                .setFooter("Données màj le 14 février")
                .setTimestamp();      
            if (colle_status == 'math') resolve([embed,embed3]) 
        }
        resolve([embed,embed2,embed3]);
    });   
}

const InformationCUPGE2 = (type,key) => 
{
    const list = require('C:/Bot Yes we can/Liste CUPGE.json');
    let etudiant = "";
    for (let i = 0; i < list.length; i++)
    {
        if (list[i][type] == key) etudiant += ' - *'+list[i]['prenom']+' '+list[i]['nom']+'*\n';
    }
    let embed = new discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('**CUPGE**')
        .setAuthor('Yes we can')
        .addField('**Liste '+type+' groupe '+key+'**',etudiant)
        .setTimestamp();      
    return [embed];
}

function sep3chiffres(str)
{
    str = str.toString();
    x = str.substring(str.length%3,str.length).replace(/(\d\d\d(?!$))/g,"$1"+" ");
    y = str.substring(0,str.length%3);
    if (y == "") return x
    return y+" "+x;
}

const age = (user) => 
{
    let day = new Date;
    age_total = Math.round((day.getTime() - user.createdTimestamp)/1000);
    annee = Math.floor(age_total/31536000);
    mois = Math.floor((age_total - annee*31536000)/2628000);
    jour = Math.floor((age_total - annee*31536000 - mois*2628000)/84600);
    return `Votre age discord est de **${sep3chiffres(age_total)}** secondes\nSoit **${annee}** années et **${mois}** mois et **${jour}** jours.`;
}

const edt = (time,groupe,callback) =>
{
    if (time == 'now')
    {
        const date = new Date;
        let day;
        let month = date.getMonth()+1;
        if (date.getDay() != 1)
        {
            day = date.getDate()-date.getDay()+1;
            if (day < 0)
            {
                if (month == 2 || month == 4 || month == 6 || month == 9 || month == 11)
                {
                    day += 31;
                }
                if (month == 3)
                {
                    day += 28;
                }
                if (month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
                {
                    day += 30;
                }
                if (month == 1)
                {
                    day += 31;
                    month = 13;
                }
                month --;
            }
        }
        else 
        {
            day = date.getDate();
            month = date.getMonth()+1;
        }
        if (day < 10)
        {
            day = '0'+day;
        }
        if (month < 10)
        {
            month = '0'+month;
        }
        date = day+'/'+month;
    }
    let attachment;
    if (groupe == 2)
    {
        try {
            if (fs.existsSync('.\\edts'+time.replace('/','.')+'.chakir.jpg')) {
                attachment = new discord.MessageAttachment('.\\edts'+time.replace('/','.')+'.chakir.jpg','edt.jpg');
            }else{
                return callback('Emploi du temps indisponible ou mal ecris');   
            }
        } catch(err) { console.log(err); }  
    }
    else
    {
        try {
            if (fs.existsSync('.\\edts'+time.replace('/','.')+'.jpg')) {
                attachment = new discord.MessageAttachment('.\\edts'+time.replace('/','.')+'.jpg','edt.jpg');
            }else{
                return callback('Emploi du temps indisponible ou mal ecris');   
            }
        } catch(err) { console.log(err); }  
    }
    let embed = new discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('**EMPLOI DU TEMPS SEMAINE DU '+time+'/2021**')
            .setAuthor('Yes we can')
            .attachFiles(attachment)
            .setImage('attachment://edt.jpg')
            .addField('\u200B','[Lien dse](https://www.dse.univ-paris-diderot.fr/edt-des-l-physique-cupge-phytech-enseignement-physique-chimie-epc-double-licence-physique-chimie-dlpc/)',false)
            .setTimestamp();
    callback([embed]);
}

async function transform_fichier(fichier,key,callback) 
{
    fs.readFile('C:/Bot Yes we can/'+fichier, (err,data) => 
    {
        if (err) callback(err)
        data = JSON.parse(data);
        fs.readFile('C:/Bot Yes we can/Liste CUPGE.json', (err,donnee) => 
        {
            if (err) callback(err)
            donnee = JSON.parse(donnee);
            for (let i = 0; i < data.length; i++)
            {
                for (let j = 0; j < donnee.length; j++)
                {
                    if (donnee[j]['UP'] == data[i][key]) data[i][key] = donnee[j]['prenom'] + ' ' + donnee[j]['nom']
                }
            }
            fs.writeFile('C:/Bot Yes we can/'+fichier, JSON.stringify(data,null,2), (err) => 
            {
                if (err != null) callback("Erreur lors de l'ecriture du fichier "+err)
                callback('Fichier transformer avec succès');
            });
        });
    });
}

const display_playlist = (args,callback) => 
{
    fs.readFile('./.vscode/playlist.json', (err, data) => 
    {
        if (err) callback('Erreur lors de la lecture des données : '+err);
        data = JSON.parse(data);
        let readplaylist = data.find(s => s.title == args);
        if (readplaylist == undefined) callback('Pas de playlist trouvé')
        let embed = new discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor('Yes we can')
            .setTitle(`**PLAYLIST n°${data.findIndex(m => m.title == args)+1}, Titre : ${readplaylist.title}**`)
            .setTimestamp();
        let description = "";
        for (let song of readplaylist.songs)
        {
            description += `*[${song.title}](${song.url})*\n\n`;
        }
        embed.setDescription(description);
        callback([embed]);
    });
}

async function edit_playlist(args) 
{
    let list = []; 
    for (let i = 0; i < args.length; i++)
    {
        await music.SearchOnYoutube(args[i]).then(video => {
            if (typeof video == 'string') return video
            list.push({title:video['title'],url:video['url'],time:video['duration']});
        })
    }
    return list;
}

const title_playlist = (channel,list,author,callback) => 
{
    channel.send('Donner un titre a votre playlist, vous avez 60s').then(() => 
    {
        channel.awaitMessages(m => author === m.author.id, { time: 60000, max: 1, errors: ['time'] }).then(response => 
        {
            playlist.push({title:response.first().content,songs:list});
            fs.writeFile('./.vscode/playlist.json',JSON.stringify(playlist,null,2),err => {
                if (err) callback(err);
                callback(`Playlist numero **${playlist.length}** au nom **${response.first().content}** enregistrée`);
            });
        })
        .catch(() => callback('Echec, temps écoulé'));
    });
}

const min = (array) =>
{
    if (array.length == 0) return undefined
    mini = array[0]
    for (let i = 1; i < array.length; i++) 
    {
        if (array[i] < mini) mini = array[i]
    }
    return mini
}

const minimumEditDistance = (s1,s2) => 
{
    if (s1.length > s2.length)
    {
        s1,s2 = s2,s1
    }
    distances = []
    for (i = 0; i < s1.length + 1; i++)
    {
        distances.push(i)
    }
    for (let i = 0; i < s2.length; i++)
    {
        newDistances = [i+1]
        for (let j = 0; j < s1.length; j++)
        {
            if (s1[j] == s2[i]) newDistances.push(distances[j])
            else newDistances.push(1 + min([distances[j],distances[j+1],newDistances[-1]]))
            
        }
        distances = newDistances
    }
    return distances[s1.length-1]
}

const distance_levensthein = (liste,key,maxi) => 
{
    rep = []
    for (let i = 0; i < liste.length; i++)
    {
        distance = minimumEditDistance(liste[i].toLowerCase(),key) 
        if (distance <= maxi) rep.push(liste[i])
    }
    return rep
}

module.exports.age = age;
module.exports.anti_spam = anti_spam;
module.exports.display_playlist = display_playlist;
module.exports.distance_levensthein = distance_levensthein;
module.exports.edit_playlist = edit_playlist;
module.exports.edt = edt;
module.exports.InformationCUPGE = InformationCUPGE;
module.exports.InformationCUPGE2 = InformationCUPGE2;
module.exports.sep3chiffres = sep3chiffres;
module.exports.title_playlist = title_playlist;
module.exports.transform_fichier = transform_fichier;