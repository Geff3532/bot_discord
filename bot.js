const discord = require('discord.js');
const fs = require('fs');

const api = require('./api.js');
const convert = require('./fileconvert.js');
const cupge = require('C:/Bot Yes we can/Liste CUPGE.json'); // NON FOURNI
const discord_info = require('./discord_info.json');
const nb_message = require('./discord_info.json').nb_message;
const guild_role = require('./discord_info.json').guild_role;
const divers = require('./divers.js');
const music = require('./music.js');
const start_slash = require('./start_slash.js');
const token = require('C:/Bot Yes we can/auth.json');  // NON FOURNI
const velib = require('./velib.json');

const Client = new discord.Client;
let play;

Client.on('ready', () =>
{
    console.log('bot operationnel');
    Client.user.setActivity({name: 'Rocket League', type: 'STREAMING'});
    start_slash.initialise_permissions(Client,'804064035708207174');
    Client.api.applications(Client.user.id).guilds('804064035708207174').commands.post({
        data : {
            name:'play-playlist',
            description:"joue une playlist selon son numéro",
            options: [
                {type:4, name:"playlist",description:"numero de la playlist",required:true}
            ]
        }
    });
});

Client.on('message', async message => 
{
    console.log(message.channel.name+'\n'+message.author.username+' : '+message.content);
    if (message.channel.type == 'dm') return
    if (nb_message[message.guild.id] == undefined) nb_message[message.guild.id] = 1
    else nb_message[message.guild.id] += 1
    discord_info.nb_message = nb_message;
    fs.writeFile('./.vscode/discord_info.json',JSON.stringify(discord_info,null,2),err =>
    { 
        if (err != null) console.log(err)
    });          
    divers.anti_spam(message);      
});

Client.ws.on('INTERACTION_CREATE', async interaction => 
{
    const command = interaction.data.name.toLowerCase(); 
    const args = interaction.data.options;
    const channel = Client.guilds.resolve(interaction.guild_id).channels.resolve(interaction.channel_id);
    const ephemeral = ( discord_info.interaction[interaction.member.user.id] == undefined ) ? false : discord_info.interaction[interaction.member.user.id];
    
    const delete_interaction = async () => {
        Client.api.webhooks(Client.user.id,interaction.token).messages['@original'].delete();
    }

    const edit = async (message) => {
        let type = (typeof message == 'object') ? 'embeds' : 'content'; 
        let json = {headers: {"Content-type": "application/json"},data: {type:4}}; json.data[type] = message;
        if (ephemeral) json.data['flags'] = 64;
        Client.api.webhooks(Client.user.id, interaction.token).messages['@original'].patch(json);
    }

    const get = async () => {
        return Client.api.webhooks(Client.user.id,interaction.token).messages['@original'].get();
    }

    const send = async (message) => { 
        let type = (typeof message == 'object') ? 'embeds' : 'content'; 
        let json = {data: {type:4, data: {}}}; json.data.data[type] = message;
        if (ephemeral) json.data.data['flags'] = 64;
        Client.api.interactions(interaction.id, interaction.token).callback.post(json);
    }

    const send_thinking = async () => {
        let json = {data: {type:5, data:{}}}; if (ephemeral) json.data['data']['flags'] = 64;
        Client.api.interactions(interaction.id, interaction.token).callback.post(json);
    }

    const send_private = async (message) => { 
        let type = (typeof message == 'object') ? 'embeds' : 'content'; 
        let json = {data: {type:4, data: {flags:64}}}; json.data.data[type] = message;
        Client.api.interactions(interaction.id, interaction.token).callback.post(json);
    }

    switch(command)
    {
        case 'age': 
        {
            send(divers.age(Client.users.resolve(interaction.member.user.id)));
            break;
        }

        case 'boucle': 
        {
            if (play == undefined) return send_private('Pas de playlist')
            play.setBoucle(args[0].value);
            send((args[0].value == true) ? 'La chanson tourne en boucle' : 'La chanson ne tourne plus en boucle')
            break;
        }

        case 'cleanall':
        {
            let save_channel = channel.clone();
            (await save_channel).setPosition(channel.rawPosition);
            channel.delete('Pour le fun xd');
            break;
        }

        case 'clear': 
        {
            let number = (args == undefined) ? 20 : args[0].value;
            channel.bulkDelete(number).then(e => 
            {
                send_thinking();
                delete_interaction();
            }).catch(err => edit('Erreur lors de la suppression : '+err)); 
            break;
        }

        case 'covid':
        {
            send_thinking();
            api.covid(channel,(embed) => edit([embed]));
            break;
        }

        case 'disconnect': 
        {
            if (play == undefined) return send_private('Pas de playlist')
            play.delete(); play = undefined;
            send('Bot déconnecté');
            break;
        }

        case 'dic':
        {
            let word = args[0].value;
            send_thinking();
            api.dic(channel,word,(embed) => edit([embed]));
            break;
        }

        case 'display-playlist': 
        {
            send_thinking();
            divers.display_playlist(args[0].value,rep => edit(rep));
            break;
        }

        case 'edit-playlist': 
        {
            send_thinking();
            divers.edit_playlist(args[0].value.split(',')).then(list => {
                if (typeof list == 'string') return edit(list)
                divers.title_playlist(channel,list,interaction.member.user.id,rep => edit(rep))
            });
            break;
        }

        case 'edt':
        {
            let regex = new RegExp('^[0-3][0-9]/[0-1][0-9]$');
            let date = args[0].value;
            let groupe = args[0].value;
            if (!regex.test(date)) return send_private('Date invalide')
            send_thinking();
            divers.edt(date,groupe,rep => edit(rep));
            break;
        }

        case 'ephemeral':
        {
            discord_info['interaction'][interaction.member.user.id] = args[0].value;
            fs.writeFile('./.vscode/discord_info.json',JSON.stringify(discord_info,null,2),err => {
                if (err != null) return send_private(err)
            });
            send_private('Mis à jour effectué');
            break;
        }

        case 'fichier':
        {
            send_thinking();
            if (args[0].name == 'pdf2json')
            {
                if (fs.existsSync("C:/Bot Yes we can/"+args[0].options[0].value) && args[0].options[0].value.split('.')[1] == 'pdf') 
                {
                    convert.pdftable2json(args[0].options[0].value,args[0].options[1].value,(args[0].options[2] == undefined) ? false : args[0].options[2].value,rep => edit(rep));
                }
                else edit('Fichier indisponible ou mal ecris');   
            }
            if (args[0].name == 'send')
            {
                if (fs.existsSync("C:/Bot Yes we can/"+args[0].options[0].value)) 
                {
                    edit('Fichier trouvé');
                    return channel.send(new discord.MessageAttachment("C:/Bot Yes we can/"+args[0].options[0].value));
                }
                edit('Fichier indisponible ou mal ecris');   
            }
            if (args[0].name == 'save')
            {
                channel.awaitMessages(m => m.author.id == interaction.member.user.id, { time: 60000, max: 1, errors: ['time'] }).then(response => 
                {
                    if (response.array()[0].attachments.size == 0) return edit('Echec, pas de fichier')
                    let beta = response.array()[0].attachments.array()[0];
                    if (!beta.url.startsWith('https')) return edit('Protocole http find. Https expected')
                    convert.download(beta.url,beta.name).then(rep => edit(rep)).catch(err => edit('Temps écoulé : '+err));
                });
            }
            if (args[0].name == 'transform') 
            {
                if (fs.existsSync("C:/Bot Yes we can/"+args[0].options[0].value) && args[0].options[0].value.split('.')[1] == 'json') 
                {
                    divers.transform_fichier(args[0].options[0].value,args[0].options[1].value,rep => edit(rep));
                }
                else edit('Fichier indisponible ou mal ecris');   
            }
            break;
        }

        case 'geocode': 
        {
            let location = args[0].value;
            let state = args[1].value;
            send_thinking();
            api.findgeocode(channel,location,state,(embed,data) => edit([embed]));
            break;
        }

        case 'html':
        {
            let file = args[0].value;
            let ordre = args[1].value;
            let column = (args[2] == undefined) ? null : args[2].value;
            fs.stat(`./${file}`,(err,stat) => 
            {
                if (err || file.split('.')[1] != 'json') send_private('Pas de fichier correspondant ou format invalide')
                else {
                    send('Conversion en cours');
                    api.html(channel,ordre,column,file);
                }
            });
            break;
        }

        case 'info': 
        {
            send_thinking();
            let type = args[0].name; 
            if (type == 'up' || type == 'td') type = type.toUpperCase()
            let key = args[0].options[0].value.toLowerCase();
            let colle_status = (args[0].options[1] != undefined) ? args[0].options[1].value : null;
            if (['nom','prenom','UP'].includes(type)) divers.InformationCUPGE(type,key,colle_status).then(d => edit(d)).catch(e => 
            {
                liste = [];
                for (let i = 0; i < cupge.length; i++)
                {
                    liste.push(cupge[i][type]);
                }
                rep = divers.distance_levensthein(liste,key,3)
                if (rep.length > 0) edit(`${e}\nVouliez vous dire :\n${rep.join('\n')}`)
                else edit(e)
            });
            else edit(divers.InformationCUPGE2(type,key))
            break;
        }

        case 'like':
        {
            let number = args[0].value;
            let research = channel.messages.cache.filter(m => m.author.id == interaction.member.user.id).keyArray();
            if (number > research.length) return send_private('Nombre supérieure au cache disponible, qui est de '+research.length)
            send_private('Likes en cours 😍 !') 
            research = research.slice(research.length-number,research.length).reverse();
            for (let i = 0; i < research.length; i++)
            {
                channel.messages.cache.find(m => m.id == research[i]).react('😍');
            }
            break;
        }

        case 'loop':  
        {
            if (play == undefined) return send_private('Pas de playlist');
            play.setLoop(args[0].value);
            send((args[0].value == true) ? 'La playlist tourne en boucle' : 'La playlist ne tourne plus en boucle')
            break;
        }

        case 'meteo': 
        {
            let ville = (args == undefined) ? 'Paris' : args[0].value;
            send_thinking();
            api.meteo(ville).then(result => 
            {
                edit([result[0]]);
                Client.api.webhooks(Client.user.id,interaction.token).messages['@original'].get().then(m => 
                {
                    api.snif_meteo(new discord.Message(Client,m,channel),result[1]);
                });
            }).catch(err => send(err));
            break;
        }

        case 'move-out':
        {
            let member = Client.guilds.resolve(interaction.guild_id).members.resolve(args[0].value);
            if (member.voice.channel == undefined) return send_private('Cette personne n\'est pas dans un vocal')
            let channels_available = member.guild.channels.cache.filter(channel => channel.type == "voice" && channel.id != member.voice.channel.id).keyArray();
            if (channels_available.length == 0) member.voice.kick('Pour le kiff').then(e => send_private('Intrus éjecté')).catch(e => send_private('Erreur '+e))
            else member.voice.setChannel(channels_available[0]).then(e => send_private('Intrus éjecté')).catch(e => send_private('Erreur '+e))
            break;
        }

        case 'ping':
        { 
            send(`Ping : ${Client.ws.ping} ms`);
            break;
        }

        case 'play':
        {
            let member = Client.guilds.resolve(interaction.guild_id).members.resolve(interaction.member.user.id);
            if (member.voice.channel == undefined) return send_private('Vous n\'etes pas connecter a un vocal')
            member.voice.channel.join().then(connection => 
            {
                send(`Connecté au vocal 🔊 ${member.voice.channel.name}`)
                if (play == undefined) 
                {
                    play = new music.Music(connection,args[0].value.split(','));
                    play.initialize().then( () => play.PlayMusic());
                }
                else play.addMusic(args[0].value.split(','))
                play.update();
            })
            break;
        }

        case 'play-playlist': 
        {
            let member = Client.guilds.resolve(interaction.guild_id).members.resolve(interaction.member.user.id);
            if (member.voice.channel == undefined) return send_private('Vous n\'etes pas connecter a un vocal')
            if (play != undefined) return send_private('Un titre est déja en cours')
            member.voice.channel.join().then(connection => 
            {
                send(`Connecté au vocal 🔊 ${member.voice.channel.name}`);
                const playlist = require('./playlist.json');
                if (playlist[args[0].value-1] == undefined) return send_private('Pas de playlist existante')
                let musics = [];
                for (let song of playlist[args[0].value-1].songs)
                {
                    musics.push(song.url);
                }
                play = new music.Music(connection,musics);
                play.PlayMusic();
            });
            break;
        }

        case 'playlist':
        {
            if (play == undefined) return send_private('Pas de playlist en cours')
            send(await play.Playlist());
            break;
        }

        case 'pop': 
        {
            if (play == undefined) return send_private('Pas de playlist en cours')
            let number = args[0].value;
            if (number < 0 || number >= play.liste.length) send_private('Numéro invalide')
            play.pop(number);
            send(`Chanson **${number}** supprimé`);
            break;
        }

        case 'private-message': 
        {
            let destinataire = args[0].value;
            let text = args[1].value;
            Client.users.resolve(destinataire).createDM().then(m => m.send(text).then(r => send_private('Fait')).catch(e => send_private('Echec : '+e)));
            break;
        }

        case 'skip': 
        {
            if (play == undefined) return send_private('Pas de playlist')
            let number = (args == undefined) ? 2 : args[0].value;
            if (number <= 1 || number > play.liste.length) return send_private('Numéro invalide')
            play.skip(number-1);
            send(`Skip à la chanson ${number}`);
            break;
        }

        case 'stats':
        {
            let guild = Client.guilds.resolve(interaction.guild_id);
            send('Nombre de messages envoyes : '+nb_message[guild.id]+'\nNous sommes **'+guild.memberCount+'** sur le serveur');
            break;
        }

        case 'subtitles': 
        {
            let url = args[0].value.split('/').pop();
            let language = args[1].value;
            let title = (args[2] == undefined) ? 'output' : args[2].value; let message;
            if (url == undefined) message = "url invalide"
            if (language.length > 3) message = "langue invalide"
            message = (message == undefined) ? 'Requete api en cours' : message;
            send(message);
            api.subtitles(channel,url,language,title);
            break;
        }

        case 'summary': 
        {
            let url = args[0].value;
            let name = (args[1] == undefined) ? 'New summary' : args[1].value;
            if (!url.startsWith('http')) return send('Url adress unavailable')
            send('Fichier creer');
            api.summary(channel,url,name);
            break;
        }

        case 'trad':
        {
            let text = args[0].value;
            let sl = args[1].value;
            let tl = args[2].value;
            send_thinking();
            await api.translate(escape(text),sl,tl,rep => edit(rep));
            break;
        }

        case 'velib': 
        {
            if (args[0].name == 'search')
            {
                send_thinking();
                let adress = args[0].options[0].value;
                let distance = args[0].options[1].value;
                api.velib(adress,distance,rep => edit(rep));
            }
            if (args[0].name == 'add')
            {
                send('Recherche en cours.\nValidez la recherche par ✅ ou annuler la par ❌ dans les 2min');
                let location = args[0].options[0].value;
                api.findgeocode(channel,location,'FR',(embed,data) => 
                {
                    edit([embed]);
                    velib.push(data);
                    get().then(rep => 
                    {
                        let message = channel.messages.cache.find(m => m.id == rep.id);
                        message.react('✅').then(m => message.react('❌'));
                        const filter = reaction => reaction.me == false && (reaction._emoji.name == '✅' || reaction._emoji.name == '❌');
                        const collector = new discord.ReactionCollector(message,filter,{time: 120000, max:1});
                        collector.on('collect', response => {
                            if (response._emoji.name == '✅') {
                                fs.writeFileSync('./.vscode/velib.json',JSON.stringify(velib,null,2));
                                start_slash.initialise_velib(Client,channel.guild.id);
                                edit('Fichier màj.\nLa fonction /velib search sera màj dans max 1min, le temps depend de discord');
                            }
                            else {
                                velib.pop();
                                edit('Echec de la maj');
                            }
                        });
                        collector.on('end',collect => 
                        {
                            if (collect.keyArray().length == 0) channel.send('Fin du temps')
                        });
                    });
                });
            }
            break;
        }
    }
});

Client.on('guildMemberAdd', member =>
{
    let channel = member.guild.channels.cache.find(ch => ch.type == 'text');
    if (!channel) return console.log('Channel indefini')
    channel.send(`Bienvenue **${member.displayName}** dans ce serveur **${member.guild.name}**\nTu n'as aucun role pour l'instant. Par defaut tes notifications sont *${member.guild.defaultMessageNotifications}* et ton status est *${member.user.presence.status}*.\nSur ce serveur le fitre de contenu est *${member.guild.explicitContentFilter}*, la region du serveur est *${member.guild.region}* et le niveau de verification est : *${member.guild.verificationLevel}*.\nNous sommes maintenant **${member.guild.memberCount}** sur ce serveur.`);
    const role = member.guild.roles.cache.find(r => r.name == guild_role[member.guild.id]);
    member.roles.add([role],'Role de bienvenue !').then(go => 
    {
        channel.send(`<@!${member.id}>, ${member.displayName} as recu un nouveau role : ${role.name}!`)
    }).catch( err => {
        console.log(err);
        channel.send(`<@!${member.id}>, Contacter une admin pour recevoir votre role`);
    });
});

Client.on('guildMemberRemove', member =>
{
    let channel = member.guild.channels.cache.find(ch => ch.type == 'text');
    if (!channel) return console.log('Channel indefini')
    channel.send(`${member.user.username}#${member.user.discriminator} surnommé ${member.nickname ||'indéfini'} a quitté le serveur. Bon voyage !`)
});

Client.login(token.token);

process.on('unhandledRejection', error => 
{   
    try {
        Client.users.cache.get('520340448196296722').createDM().then(m => m.send(error.message));
        console.log('Unhandled promise rejection:', error);
    } catch (err) {
        console.log(err);
    }
});
