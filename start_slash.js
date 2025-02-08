const velib = require('./velib.json');

const initialise_velib = (Client,guild) =>
{
    velib_choice = []
    for (place of velib)
    {
        velib_choice.push({name:place.Adresse,value:place.Adresse});
    }
    Client.api.applications(Client.user.id).guilds(guild).commands.post({
        data: {
            name: "velib",
            description: "Search velib around a localisation",
            options: [
                {type:1, name:"search",description:"Search velib localisation in Paris", options: [
                    {type:3,name:"location",description:"adress you choice between the available",required:true,choices:velib_choice},
                    {type:4,name:"distance",description:"perimeter from research in meters. If it too small they will be no result", required:true}
                ]},
                {type:1, name:"add",description:"add a new address to the velib file !", options : [
                    {type:3,name:"location",description:"new location's adress",required:true}
                ]}
            ]
        }
    });
};

const initialise_permissions = (Client,guild) => 
{
    Client.api.applications[Client.user.id].guilds[guild].commands.get().then(rep => 
    {
        let commands = [rep.find(m => m.name == 'cleanall').id,rep.find(m => m.name == 'fichier').id];
        for (let command of commands)
        {
            Client.api.applications(Client.user.id).guilds(guild).commands[command].permissions.put({
                headers : 
                {
                    "Content-Type": "application/json"
                },
                data: {
                    permissions: [
                    {
                        id: '520340448196296722',
                        type: 1,
                        permission: true
                    }
                ]}
            });
        }
    });
}

const initialise = (Client,guild) => 
{
    for (command of json)
    {
        Client.api.applications(Client.user.id).guilds(guild).commands.post(command);
    }
    initialise_velib(Client,guild);
    initialise_permissions(Client,guild);
}

module.exports.initialise = initialise;
module.exports.initialise_permissions = initialise_permissions;
module.exports.initialise_velib = initialise_velib;

const json = [
    {
        data: {
            name: "html",
            description: "transform a local file to a lisible html file",
            options: 
            [
                {type:3,name:"file",description:"the name's file you would like transform",required:true},
                {type:3,name:"organize",description:"organize the file",required:true,choices:[{name:'décroissant',value:'-'},{name:"croissant",value:'+'},{name:"pas d'ordre",value:'no'}]},
                {type:3,name:"column",description:"name's column to organize"}
            ]
        }
    },
    {
        data: {
            name: "summary",
            description: "summarize a text from a html web page like a press's article",
            options: 
            [
                {type:3,name:"url",description:"the url adress from the site",required:true},
                {type:3,name:"title",description:"the title's summary or just New summary if the title isn't defined",required:false}
            ]
        }
    },
    {
        data: {
            name: "covid",
            description: "A lot of statistiques about COVID-19"
        }
    },
    {
        data: {
            name: "ping",
            description: "Ping's bot"
        }
    },
    {
        data: {
            name: "geocode",
            description: "Obtains coordonates from a adress in the world",
            options: [
                {type:3,name:"location",description:"the address from the location you want to geolocalise",required:true},
                {type:3,name:"country",description:"the code of the country like FR, UK or USA", required:true}
            ]
        }
    },
    {
        data: {
            name: "subtitles",
            description: "See subtitles from a youtube video",
            options: [
                {type:3,name:"url",description:"url from youtube video. If it isn't a youtube url it can be not supported",required:true},
                {type:3,name:'language',description:"language from the subtitles. Use a 2 letters code like en, fr, es",required:true},
                {type:3,name:"title",description:"title of the document. Optional",required:false}
            ]
        }
    },
    {
        data: {
            name: "trad",
            description: "Translate a text into another language",
            options: [
                {type:3,name:"text",description:"Text to translate, max 2000 characters",required:true},
                {type:3,name:"source-language",description:"language of the text with 2 digi-code like en, fr, es",required:true},
                {type:3,name:"destination-language",description:"translate language destination with 2 digi-code like en, fr, es",required:true}
            ]
        }
    },
    {
        data: {
            name: "clear",
            description: "Clear messages from a channel",
            options: [
                {type:4,name:"number",description:"Number message to delete or 20 by default. 100 is the maximum",required:false},
            ]
        }
    },
    {
        data: {
            name: "info",
            description: "information sur cupge",
            options: [
                {type:1,name:"prenom",description:"recherche par prenom",options:[
                    {type:3,name:"prenom",description:"prenom a rechercher",required:true},
                    {type:3,name:"colle",description:"information sur les colle",required:false,choices:[
                        {name:"math",value:"math"},{name:"meca",value:"meca"},{name:"all",value:"all"}
                    ]}
                ]},
                {type:1,name:"nom",description:"recherche par nom",options:[
                    {type:3,name:"nom",description:"nom a rechercher",required:true},
                    {type:3,name:"colle",description:"information sur les colle",required:false,choices:[
                        {name:"math",value:"math"},{name:"meca",value:"meca"},{name:"all",value:"all"}
                    ]}
                ]},
                {type:1,name:"up",description:"recherche par numero etudiant",options:[
                    {type:4,name:"up",description:"numero etudiant a rechercher",required:true},
                    {type:3,name:"colle",description:"information sur les colle",required:false,choices:[
                        {name:"math",value:"math"},{name:"meca",value:"meca"},{name:"all",value:"all"}
                    ]}
                ]},
                {type:1,name:"td",description:"recherche par groupe de td",options:[
                    {type:3,name:"td",description:"groupe de td a rechercher",required:true,choices:[
                        {name:"1a",value:"1a"},{name:"1b",value:"1b"},{name:"2a",value:"2a"},{name:"2b",value:"2b"}
                    ]}
                ]},
                {type:1,name:"colle",description:"recherche par groupe de colle",options:[
                    {type:3,name:"colle",description:"groupe de colle a rechercher",required:true,choices:[
                        {name:"1A",value:"1A"},{name:"1B",value:"1B"},{name:"1C",value:"1C"},{name:"1D",value:"1D"},
                        {name:"1E",value:"1E"},{name:"1F",value:"1F"},{name:"1G",value:"1G"},{name:"1H",value:"1H"},
                        {name:"1I",value:"1I"},{name:"1J",value:"1J"},{name:"2A",value:"2A"},{name:"2B",value:"2B"},
                        {name:"2C",value:"2C"},{name:"2D",value:"2D"},{name:"2E",value:"2E"},{name:"2F",value:"2F"},
                        {name:"2G",value:"2G"},{name:"2H",value:"2H"},{name:"2I",value:"2I"},{name:"2J",value:"2J"}
                    ]}
                ]}
            ]
        }
    },
    {
        data: {
            name: "age",
            description: "your age in discord"
        }
    },
    {
        data: {
            name: "stats",
            description: "stats from this guild"
        }
    },
    {
        data: {
            name: "meteo",
            description: "Prediction sur 3 jours de la meteo, avec les réactions 0, 1 et 2. 0 pour aujourd'hui, 1 demain ect..",
            options: [
                {type:3,name:'lieu',description:`Par défaut c'est Paris. Sinon on peut entrer : ville, coordonnées, code postal, code metar)`,required:false}
            ]
        }
    },
    {
        data: {
            name: "play",
            description: "Joue une video youtube",
            options : [
                {type:3,name:'titre',description:"Ecrivez un ou plusieurs titres séparer par une vigule",required:false}
            ]
        }
    },
    {
        data: {
            name: "playlist",
            description: "Affiche la playlist en cours"
        }
    },
    {
        data: {
            name: "disconnect",
            description: "Deconnecte le bot du vocal"
        }
    },
    {
        data: {
            name: "skip",
            description: "passe a un autre titre de la playlist, selon son numero, voir /playlist",
            options: [
                {type:4,name:"numero",description:"numéro de la chanson, ou la suivante si rien n'est indiqué",required:false}
            ]
        }
    },
    {
        data: {
            name: "loop",
            description: "La playlist tourne en boucle",
            options: [
                {type:5,name:"valeur",description:"true pour lancer la boucle, false pour l'arreter",required:true}
            ]
        }
    },
    {
        data: {
            name: "boucle",
            description: "La chanson tourne en boucle",
            options: [
                {type:5,name:"valeur",description:"true pour lancer la boucle, false pour l'arreter",required:true}
            ]
        }
    },
    {
        data: {
            name: "pop",
            description: "Supprime une chanson de la liste",
            options: [
                {type:4,name:"numero",description:"numero de la chanson, voir /playlist",required:true}
            ]
        }
    },
    {
        data: {
            name: "move-out",
            description: "Ejecter discretement une personne de son vocal vers un autre",
            options: [
                {type:6,name:"victime",description:"nom de la victime",required:true}
            ]
        }
    },
    {
        data: {
            name: "like",
            description: "Demande au bot de liker tes messages",
            options: [
                {type:4,name:"nombre",description:"nombre de tes messages à liker",required:true}
            ]
        }
    },  
    {
        data: {
            name: "edt",
            description: "Demande au bot l\'emploi du temps",
            options: [
                {type:3,name:"date",description:"date au format JJ/MM",required:true},
                {type:4,name:"groupe",description:"emploi du temps du groupe",required:true, choices:[
                    {name:1,value:1},{name:2,value:2}
                ]},
            ]
        }
    },
    {
        data: {
            name: "ephemeral",
            description: "Choisis si tout les interactions seront privés. Par defaut c'est false",
            options: [
                {type:5,name:"choice",description:"true pour les interactions privés, false pour publiques. Certaines fontions restent publiques",required:true}
            ]
        }
    },
    {
        data: {
            name:'fichier',
            description:'Manipule des fichiers, reservé à l\'admin',
            default_permission:false,
            options:[
                {type:1,name:"pdf2json",description:"Transforme tableau pdf en json",options:[
                    {type:3,name:"fichier",description:"nom du fichier",required:true},
                    {type:4,name:"nombre",description:"nombre de colonne",required:true},
                    {type:4,name:"titre",description:"nombre de lignes du titre a supprimer",required:false},
                ]},
                {type:1,name:'save',description:'Sauvegarder un fichier envoyé dans les 60s'},
                {type:1,name:'send',description:'Envoit un fichier sur le channel',options:[
                    {type:3,name:'fichier',description:'nom du fichier',required:true}
                ]},
                {type:1,name:'transform',description:'Transformer un fichier json',options:[
                    {type:3,name:'fichier',description:'nom du fichier',required:true},
                    {type:3,name:'colonne',description:'nom de la colonne a transformer',required:true}
                ]}
            ]
        }
    },
    {
        data: {
            name:'edit-playlist',
            description:"creer une playlist enregistrable",
            options:[
                {type:3,name:"sons",description:"ecrivez le titre des sons séparés par des virgules",required:true}
            ]
        }
    },
    {
        data: {
            name: "cleanall",
            description: "Nettoyer l'integralité d'un channel text",
            default_permission: false
        }
    },
    {
        data : {
            name:'display-playlist',
            description:"affiche une playlist selon son numéro ou son nom",
            options: [
                {type:3, name:"playlist",description:"nom ou numero de la playlist",required:true}
            ]
        }
    },
    {
        data : {
            name:'play-playlist',
            description:"joue une playlist selon son numéro",
            options: [
                {type:4, name:"playlist",description:"numero de la playlist",required:true}
            ]
        }
    }
]