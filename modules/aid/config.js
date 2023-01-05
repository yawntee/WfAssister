

var plugin = function (api) {

    api.require("common");
    api.require("host", ["房间", "战斗", "菜单", "放弃"]);
    api.require("parter", ["房间"]);

    api.trigger("铃铛", (env) => {
        click(47, 34);
    });

    api.trigger("铃铛信息", (env) => {
        sleep(200);
        if (env.filter && env.filter.length > 0) {
            var region = [226, 337, 284, 33];
            for (var boss in constant.bosses) {
                if (api.findImage(boss, region)) {
                    if (env.filter.indexOf(boss) != -1) {
                        click(520, 1070);
                        sleep(1000);
                        return;
                    }
                }
            }
            click(200, 1070);
        } else
            click(520, 1070);
        sleep(1000);
    });

}

module.exports = plugin;