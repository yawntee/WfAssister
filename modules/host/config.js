const regions = {
    list: [0, 371, device.width, device.height - 371]
}
const clr = {
    recruit: [
        [90, 491, $colors.parseColor("#dedfde"), 95, 500],
        [90, 620, $colors.parseColor("#dedfde"), 95, 630],
        [90, 749, $colors.parseColor("#dedfde"), 95, 755]
    ],
    ready: [285, 298, -25064]
};
const clrs = {
    "ready": [285, 298, -25064, [[230, 0, -25064]]],
    "白虎": ["#ad414a", [[39, 2, "#8496a4"], [78, 0, "#6b2d4a"], [57, 14, "#00fbff"], [16, 79, "#c56d00"], [48, 102, "#efebef"]]],
    "大蛇": ["#3a4d84", [[48, 2, "#ffffff"], [94, 27, "#6ba6e6"], [47, 51, "#ffffff"], [48, 72, "#ff6def"], [48, 96, "#efebef"]]],
    "管理者": ["#adaead", [[29, 6, "#00be7b"], [88, 29, "#fff7ff"], [39, 86, "#e6e7e6"]]],
    "机器人": ["#4a4d4a", [[50, 3, "#d6cabd"], [55, 28, "#42e7de"], [51, 60, "#fff7f7"], [50, 103, "#e6ebe6"]]],
    "弧魔": ["#de75a4", [[23, 8, "#f71010"], [47, 23, "#4a4163"], [33, 39, "#521810"], [33, 71, "#081029"], [33, 84, "#e6ebe6"]]],
    "寄居蟹": ["#d6eff7", [[-41, 15, "#293d52"], [0, 36, "#845dce"], [0, 70, "#d6eff7"], [0, 94, "#0800ff"], [1, 105, "#e6ebe6"]]],
    "海妖": ["#f70031", [[-70, 15, "#adb2c5"], [1, 28, "#6396ce"], [1, 56, "#31317b"], [0, 86, "#948aa4"], [0, 102, "#efebef"]]],
    "魔像": ["#3a3931", [[-2, 25, "#847963"], [-2, 59, "#ffc200"], [-46, 86, "#ad0000"], [55, 93, "#5a0000"], [-2, 111, "#efebef"]]],
    "不死王": ["#00df00", [[-33, 12, "#9c5142"], [3, 26, "#6365ad"], [44, 46, "#7b7563"], [0, 85, "#5a5d6b"], [-1, 100, "#e6ebe6"]]],
    "猫头鹰": ["#bdae4a", [[-18, 19, "#000000"], [1, 35, "#f7ef63"], [1, 51, "#ad6d21"], [1, 107, "#efebef"]]]
}

var plugin = function (api) {

    api.require("common");

    api.trigger("主城", (env) => {
        click(617, 1107);
    });

    api.trigger("领主战", (env) => {
        var pos;
        // if (api.detectImage("限时活动")) {
        //     api.perform("限时活动");
        //     return;
        // }
        if (env.act_level) {
            click(106, 318);
            return;
        }
        if (pos = api.scrollFind(() => api.findColors.apply(api, clrs[env.level].concat({
            region: regions.list
        })), 3)) click(pos.x, pos.y);
    });

    api.trigger("限时活动", (env) => {
        var pos;
        if (pos = api.scrollFind(() => api.findImage(env.level + "_" + env.difficulty, {
            reverse: true
        }), 2))
            click(pos.x, pos.y);
    });

    api.trigger("难度", (env) => {
        api.clickImage(env.difficulty, regions.list, true);
    });

    api.trigger("模式", (env) => {
        env.mode == "单人" ? click(365, 554) : click(371, 924);
    });

    api.trigger("点数", (env) => {
        env.spot ? click(522, 825) : click(196, 825);
    });

    api.trigger("单人", (env) => {
        click(371, 1091);
    })

    api.trigger("房间", (env) => {
        var go = api.getTemplate("Go");
        if (env.recruit && api.detectImage("招募状态")) click(350, 835);
        if ((env.just_go ? api.detectColor.apply(api, clr.ready) : api.detectColors.apply(api, clrs.ready)) || api.findImage("Go", [0, go.y - 30, device.width, go.h + 30])) {
            click(377, 921);
            sleep(1000);
        }
    });

    api.trigger("招募选择", (env) => {
        var params = clr.recruit;
        sleep(env.high_speed ? 200 : 800);
        for (var i in params) {
            var arr = params[i];
            if (api.detectColor(arr[0], arr[1], arr[2]) == env.recruit[i]) {
                click(arr[3], arr[4]);
                sleep(env.high_speed ? 300 : 500);
            }
        }
        click(523, 920);
    })


    var checkFail = () => api.clickImage("失败");

    var giveup;
    api.trigger("战斗", (env) => {
        giveup = false;
        if (env.flip) {
            for (var i = 0; i < env.flip_sec; i++) {
                if (!api.checkScreen() || checkFail()) break;
                click(device.width >>> 1, device.height >>> 1);
                sleep(200);
            }
        }
        if (env.mode == "灵车") {
            giveup = true;
            while (true) {
                click(44, 81);
                if (!api.checkScreen()) return;
                sleep(200);
            }
        }
        if (env.timeout) {
            var i = env.timeout;
            while (i--) {
                if (!api.checkScreen() || checkFail()) return;
                sleep(1000);
            }
            giveup = true;
            while (true) {
                click(44, 81);
                if (!api.checkScreen() || checkFail()) break;
                sleep(200);
            }
        }
        while (api.checkScreen() && !checkFail()) sleep(env.interval);
    });

    api.trigger("菜单", (env) => {
        if (giveup)
            click(89, 1229);
        else
            click(660, 614)
    });

    api.trigger("放弃", (env) => {
        click(523, 824);
    });
}

module.exports = plugin;