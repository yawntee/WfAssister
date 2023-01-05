const regions = {
    list: [0, 371, device.width, device.height - 371]
}

var plugin = function (api) {

    api.require("common");
    api.require("host", ["主城", "单人", "点数", "战斗", "菜单", "放弃", "失败"]);

    api.trigger("主城", () => click(108, 1105));

    api.trigger("活动", (env) => {
        if (env.mode == "深层") {
            api.clickImage("深层");
            return;
        }
        var pos;
        if (pos = api.scrollFind(() => api.findImage(env.level + "迷宫"), 1))
            click(pos.x, pos.y);
    });

    function scrollFindLevel(env) {
        var img = api.getTemplate(env.level), top = regions.list[0];
        var pos = api.scrollFind(() => {
            var rs = api.findAllImage(env.level, [195, top, 320, device.height - top], false).matches;
            for (var i in rs) {
                var point = rs[i].point;
                if (api.findImage(env.difficulty, [195, point.y - 10, 320, img.h + 10])) {
                    return point;
                }
            }
            return null;
        }, 4);
        if (pos) click(pos.x, pos.y);
    }

    api.trigger("关卡", (env) => {
        if (env.mode == "深层") {
            scrollFindLevel(env);
        } else {
            api.clickImage(env.difficulty);
        }
    });
}

module.exports = plugin;