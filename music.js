const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const discord = require('discord.js');

class Music 
{
    constructor(connection,liste)
    {
        this.boucle = false;
        this.connection = connection;
        this.dispatcher = null;
        this.liste = liste;
        this.loop = false;
    }

    pop(number) 
    {
        this.liste.splice(number-1,1);
    }

    skip(number)
    {
        for (let i = 0; i < number; i++)
        {
            this.liste.push(this.liste[0]);
            this.liste.shift();
        }
        this.PlayMusic();
    }

    delete()
    {
        this.connection.disconnect();
    }

    async initialize()
    {
        await SearchOnYoutube(this.liste[0]).then(video => this.liste[0] = video['url']);
    }

    async update()
    {
        for (let i = 1; i < this.liste.length; i++)
        {
            await SearchOnYoutube(this.liste[i]).then(video => 
            {
                this.liste[i] = video['url'];
            });
        }
    }

    setLoop(boolean)
    {
        this.loop = boolean;
    }

    setBoucle(boolean)
    {
        this.boucle = boolean;
    }

    addMusic(ajout)
    {
        this.liste = this.liste.concat(ajout);
    }

    async Playlist()
    {
        let i = ""; let time = 0;
        for (let j = 0; j < this.liste.length; j++)
        {
            await ytdl.getBasicInfo(this.liste[j]).then(info =>
            {
                i += "> **"+(j+1)+"** - "+info.player_response.videoDetails.title+"\n";
                time += parseInt(info.player_response.videoDetails.lengthSeconds);
            });
        }
        let embed = new discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('**PLAYLIST**')
            .setDescription(i)
            .setFooter('Durée : ' + Math.floor(time/60) + ' min et ' + time%60 + ' s')
            .setTimestamp();
        return [embed];
    }

    PlayMusic()
    {
        this.dispatcher = this.connection.play(ytdl(this.liste[0], {quality:'highestaudio'}));
        this.dispatcher.on('finish', () => 
        {
            this.dispatcher.destroy();
            if (!this.loop && this.liste.length > 0)
            {
                this.liste.shift();
            }
            if (this.liste.length > 0)
            {
                this.PlayMusic(this.connection);
            }
            if (this.liste.length == 0)
            {
                this.connection.disconnect();
                this.liste = [];
                this.boucle = false;
            }
        });
        this.dispatcher.on('error', err => 
        {
            console.log('Erreur de dispatcher : '+err);
            this.dispatcher.destroy();
            this.liste.push(this.liste[0]);
            this.PlayMusic(this.connection);
        });
    }
}

async function SearchOnYoutube(args)
{
    const res = await ytsr(args).catch( e =>
    {
        return `Pas de resultat pour : ${args}`;
    });
    const video = res.items.filter(i => i.type == 'video')[0];
    if (!video)
    {
        return `Pas de resultat pour : ${args}`;
    }
    return video;
}

module.exports.Music = Music;
module.exports.SearchOnYoutube = SearchOnYoutube;