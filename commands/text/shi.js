const characters = `乄十士尸饣氏什礻石示世丗仕史失市汁矢辻弛乭乨似卋师式忕叓亊佀佦戺时竍识豕卶呞泽舍事使侍势呩始实実旹柹肢虱视试诗邿飠饰驶鸤姼恀适咶郝拾甚兘冟室宩尸屎峕峙恃拭施是是枾柿浉炻狮眂祏蚀贳食䴓栻眡耆铊埘师时烒眎舐莳轼逝铈匙豉釶埶液硕秲笶絁视釈徥湁饬媞提鈟湿寔崼弑戠揓殖湜湤葹谥贳遈释觢饰湿鉇铊势嗜埘嵵弑溡溮煶狮睗筮蒒莳蓍试诗跩跱轼铈鉂鉃鉐适遰赫蚀酾嘘实榯瑡硕舓誓鉽鸤翨奭箷虱銴餙餝驶鲥鳾泽筛噬嬕澨褷諟谥遾鮖鲺鍉湿鍦檡螫谥鳀铩簭鼫籂绎识鯴鼭襫醳释鯷鰘齛鲥鰤鶳洒籡襹鱰纚酾`;

module.exports = {
    name: 'shi',
    aliases: ['氏'],
    description: '施氏食獅史 (https://www.youtube.com/watch?v=9jtiw721RAg) but a new one',
    usage: '<length>',
    cooldown: 5,
    execute(message, args) {
        let length;
        if (parseInt(args[0]) && parseInt(args[0] <= 2000))
            length = parseInt(args[0]);
        else
            length = Math.floor(Math.random() * 200) + 2;

        let output = "";
        for (let i = 0; i < length; i++)
            output += characters[Math.floor(Math.random() * characters.length)];

        message.delete();
        message.channel.send(output);
    }
}