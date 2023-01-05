const regions = {
    list: [0, 371, device.width, device.height - 371]
}

var plugin = function (api) {

    api.require("common");
    api.require("host", ["主城", "领主战", "限时活动", "点数", "房间", "战斗", "菜单", "放弃"]);

    api.trigger("领主战", (env) => {
        var pos, diff = api.getTemplate(api.env.dest).h;
        // if (api.detectImage("限时活动")) {
        //     api.perform("限时活动");
        //     return;
        // }
        if (env.act_level) {
            click(106, 318);
            return;
        }
        if (pos = api.scrollFind(() => {
            var rs = api.findImage(env.dest, regions.list);
            if (rs && !api.detectColor(400, rs.y - diff, "#cecace")) {
                return rs;
            }
            return null;
        }, 2)) {
            click(pos.x, pos.y);
            sleep(1000);
        } else {
            sleep(500);
            click(654, 313);
        }
    });

    api.trigger("限时活动", (env) => {
        var pos, diff = api.getTemplate(api.env.dest).h >>> 1;
        if (pos = api.scrollFind(() => {
            var rs = api.findImage(env.dest);
            if (rs && !api.detectColor(400, rs.y - diff, "#cecace")) {
                return rs;
            }
            return null;
        }, 2)) {
            click(pos.x, pos.y);
            sleep(1000);
        } else {
            sleep(500);
            api.clickImage("刷新");
        }
    });

    api.trigger("房间", (env) => {
        if (api.detectColor(256, 921, "#dedfde")) click(252, 915);
    });

}

module.exports = plugin;