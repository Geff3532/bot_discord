setInterval(function searchDate()
{
    if (!alarmlessons) return
    let date = new Date;
    let titre; let data; let lien; let moodle;
    if (date.getDay() == 1)
    {
        if (date.getHours() == 10 && date.getMinutes() == 35)
        {
            titre = 'GROUPE 1 ET 2\nDISTANCIEL';
            data = '> CM de Physique 2 dans 10 min !!';
            lien = '[**Lien discord CUPGE**](https://discord.com/channels/801879753095249920/801879753095249923)';
            //lien = '[**Lien Zoom**](https://u-paris.zoom.us/j/82191522589?pwd=VS9jVW50NC83TXR1OU1BV2EydEJtdz09)';
            moodle = '[*Lien Mécanique 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=14232)';
        }
        if (date.getHours() == 13 && date.getMinutes() == 35)
        {
            titre = 'GROUPE 1 ET 2\nDISTANCIEL';
            data = '> TD de Physique 2 dans 10 min !!';
            lien = '[**Lien discord CUPGE**](https://discord.com/channels/801879753095249920/801879753095249923)';
            moodle = '[*Lien Mécanique 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=14232)';
        }
        if (date.getHours() == 15 && date.getMinutes() == 50)
        {
            //titre = 'GROUPE 1\nDISTANCIEL';
            data = "> CMTD de thermodynamique";
            lien = "[**Lien Zoom**](https://zoom.us/j/92372078166?pwd=QmJoNk1qczJ3RHVyemdVVjN4bmx4UT09)";
            moodle = '[*Lien Chimie 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2515)';
        }
        if (date.getHours() == 15 && date.getMinutes() == 51)
        {
            titre = 'GROUPE 2\nDISTANCIEL';
            data = "> CMTD d'Optique dans 10 min";
            lien = '[**Zoom Optique**](https://u-paris.zoom.us/j/85833741523?pwd=SXNrL0pPOGxoOUFoZ2JsSDh0NEZLdz09)';
            moodle = '[*Lien Optique Moodle*](https://moodle.u-paris.fr/course/view.php?id=14233)';
        }
    }
    if (date.getDay() == 2)
    {
        if (date.getHours() == 8 && date.getMinutes() == 20)
        {
            titre = 'GROUPE 1\nPRESENTIEL';
            data = '> TD de Maths 2 dans 10 min !!\n> TD HALLE 027 C';
            moodle = '[*Lien cours Maths 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2523)';
        }
        if (date.getHours() == 8 && date.getMinutes() == 21)
        {
            titre = 'GROUPE 2\nPRESENTIEL';
            data = '> Cours de Physique Expérimentale dans 10 min !!\n> TD CONDORCET 172 A et 174 A groupe 1b';
            moodle = '[*Lien cours Physique Expérimentale Moodle*](https://moodle.u-paris.fr/course/view.php?id=2456)';
        }
        if (date.getHours() == 10 && date.getMinutes() == 35)
        {
            titre = 'GROUPE 2\nPRESENTIEL';
            data = '> TD de Maths 2 dans 10 min !!\n> TD HALLE 027 C';
            moodle = '[*Lien cours Maths 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2523)';
        }
        if (date.getHours() == 14 && date.getMinutes() == 15)
        {
            titre = 'GROUPE 1 ET 2\nDISTANCIEL';
            data = '> TD Projet Pro dans 10 min !!';
            lien = '[**Go discord CUPGE**](https://discord.com/channels/801879753095249920/801879753095249923)';
            moodle = '[*Lien Projet Pro Moodle*](https://moodle.u-paris.fr/course/view.php?id=13369)';
        }
        if (date.getHours() == 16 && date.getMinutes() == 20)
        {
            titre = 'GROUPE 1\nDISTANCIEL';
            data = "> CMTD d'Optique dans 10 min";
            lien = '[**Zoom Optique**](https://u-paris.zoom.us/j/85833741523?pwd=SXNrL0pPOGxoOUFoZ2JsSDh0NEZLdz09)';
            moodle = '[*Lien Optique Moodle*](https://moodle.u-paris.fr/course/view.php?id=14233)';
        }
        if (date.getHours() == 16 && date.getMinutes() == 21)
        {
            titre = 'GROUPE 2\nDISTANCIEL';
            data = "> Cours d'Anglais dans 10 min !!";
            lien = '[**Lien Anglais Zoom**](https://u-paris.zoom.us/j/82669229109?pwd=Zyt3RTdhbDVVSERTb1BnZkNBeUZaUT09)';
            moodle = '[*Lien Pcloud*](https://u.pcloud.link/publink/show?code=kZse0hXZ3D7BpM8ETlh80rNNzY39wRi1G6Q7#folder=8321062563)';
        }
    }
    if (date.getDay() == 3)
    {
        if (date.getHours() == 10 && date.getMinutes() == 20)
        {
            titre = 'GROUPE 1 ET 2\nDISTANCIEL';
            data = '> CM de Physique 2 dans 10 min !!';
            lien = '[**Go discord CUPGE**](https://discord.com/channels/801879753095249920/801879753095249923)';
            moodle = '[*Lien Mécanique 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=14232)';
        }
        if (date.getHours() == 13 && date.getMinutes() == 35)
        {
            //titre = 'GROUPE 2\nDISTANCIEL';
            //data = "> Cours de Chimie Organique dans 10 min";
            //lien = '[**Lien Zoom**](https://u-paris.zoom.us/j/87325929573?pwd=MEovYUdDQThCNThXVEFMNVlBVjhKZz09)'
            data = '> Cours de Thermo dans 10 min !!';
            lien = '[**Lien cours distanciel Zoom**](https://zoom.us/j/99216556754?pwd=dlZ2RDNrLzJ5VlovRmpIOHAvdm1SQT09)';
            moodle = '[*Lien cours Chimie 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2515)';
        }
        if (date.getHours() == 15 && date.getMinutes() == 50)
        {
            titre = 'GROUPE 1 ET 2\nDISTANCIEL';
            data = '> CM de Maths dans 10 min !!';
            lien = '[**Lien cours distanciel bbb**](https://bbb-front.math.univ-paris-diderot.fr/recherche/pie-jfw-pkb-hww)';
            moodle = '[*Lien cours Maths 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2523)';
        }
    }
    if (date.getDay() == 4)
    {
        if (date.getHours() == 8 && date.getMinutes() == 20)
        {
            titre = 'GROUPE 1\nPRESENTIEL';
            data = '> TD de Chimie 2 dans 10 min !!\n> TD HALLE 12 E';
            moodle = '[*Lien Chimie 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2515)';
        }
        if (date.getHours() == 8 && date.getMinutes() == 21)
        {
            titre = 'GROUPE 2\nPRESENTIEL';
            data = '> CMTD de Physique 2 dans 10 min !!\n> CMTD HALLE 227 C';
            moodle = '[*Lien Mécanique 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=14232)';
        }
        if (date.getHours() == 10 && date.getMinutes() == 35)
        {
            titre = 'GROUPE 1\nPRESENTIEL';
            data = '> CMTD de Physique 2 dans 10 min !!\n> CMTD HALLE 264 E';
            moodle = '[*Lien Mécanique 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=14232)';
        }
        if (date.getHours() == 10 && date.getMinutes() == 36)
        {
            titre = 'GROUPE 2\nPRESENTIEL';
            data = '> TD de Chimie 2 dans 10 min !!\n> TD HALLE 227 C';
            moodle = '[*Lien Chimie 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2515)';
        }
        if (date.getHours() == 15 && date.getMinutes() == 50)
        {
            titre = 'GROUPE 1\nDISTANCIEL';
            data = "> Cours d'Anglais dans 10 min !!";
            lien = '[**Lien Anglais Zoom**](https://u-paris.zoom.us/j/81319678336?pwd=K1J2R2pncjk0cVdYSDVlZE9SZFZDQT09)';
            moodle = '[*Lien Pcloud*](https://u.pcloud.link/publink/show?code=kZse0hXZ3D7BpM8ETlh80rNNzY39wRi1G6Q7#folder=8321062563)';
        }
    }
    if (date.getDay() == 5)
    {
        if (date.getHours() == 8 && date.getMinutes() == 20)
        {
            titre = 'GROUPE 1\nPRESENTIEL';
            data = '> Cours de Maths 2 dans 10 min !!\n> TD HALLE 418 C';
            moodle = '[*Lien cours Maths 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2523)';
        }
        if (date.getHours() == 8 && date.getMinutes() == 21)
        {
            titre = 'GROUPE 2\nPRESENTIEL';
            data = '> Cours de Physique Expérimentale dans 10 min !!\n> TD CONDORCET 172 A et 174 A groupe 1b';
            moodle = '[*Lien cours Physique Expérimentale Moodle*](https://moodle.u-paris.fr/course/view.php?id=2456)';
        }
        if (date.getHours() == 10 && date.getMinutes() == 35)
        {
            titre = 'GROUPE 1\nPRESENTIEL';
            data = '> Cours de Physique Expérimentale dans 10 min !!\n> TD CONDORCET 172 A et 174 A groupe 1b';
            moodle = '[*Lien cours Physique Expérimentale Moodle*](https://moodle.u-paris.fr/course/view.php?id=2456)';
        }
        if (date.getHours() == 10 && date.getMinutes() == 36)
        {
            titre = 'GROUPE 2\nPRESENTIEL';
            data = '> Cours de Maths 2 dans 10 min !!\n> TD HALLE 418 C';
            moodle = '[*Lien cours Maths 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2523)';
        }
        if (date.getHours() == 15 && date.getMinutes() == 50)
        {
            titre = 'GROUPE 1 ET 2\nDISTANCIEL';
            data = '> CM de Maths dans 10 min !!';
            lien = '[**Lien cours distanciel bbb**](https://bbb-front.math.univ-paris-diderot.fr/recherche/pie-jfw-pkb-hww) \nCode : 917499';
            moodle = '[*Lien cours Maths 2 Moodle*](https://moodle.u-paris.fr/course/view.php?id=2523)';
        }
    }
    if (titre != undefined)
    {
        let embed = new discord.MessageEmbed()
            .setColor(color())
            .setTitle('**RAPPEL COURS '+titre+'**')
            .setAuthor('Yes we can')
            .setThumbnail("https://media.istockphoto.com/photos/yes-we-can-picture-id186129987?k=6&m=186129987&s=612x612&w=0&h=89P_ahSZwsCXMY7hcwYQY2lb0-DGBMKdrOI-BdTGtm8=")
            .setDescription(data)
            .setFooter('Version : 1.0.0\nAuteur : moi 😇')
            .setTimestamp();
        if (lien != undefined)
        {
            embed.addField('\u200B',lien,false);
        }
        if (moodle != undefined)
        {
            embed.addField('\u200B',moodle,false);
        }
        Client.guilds.fetch('779357696439615498')
        .then(guild => 
        { 
            guild.channels.cache.find(channel => channel.id == '779357696439615502').send('@everyone',embed);
        })
        .catch(err => console.log(err));  
    }
},60000);