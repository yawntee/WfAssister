const framework = require("./framework");

framework.run("./modules/boss", {
    boss: "猫头鹰",
    difficulty: "初级",
    mode:"多人",
    spot:true,
    recruit:[true,false,false],
    timeout:10000,
    flip:true
});