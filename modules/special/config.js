const clrs = {
    story: [187, 144, -8097454, [[82, 60, -11363725], [194, -10, -529458], [234, -1, -541094], [292, -14, -529458], [447, -8, -124]]],
    character: [-1055951, [[-33, 50, -1668608], [-6, 89, -1075687]]],
    chapter: [-25055, [[5, 0, -1041], [12, 0, -25055], [17, -1, -1], [23, 0, -25063], [29, 0, -25063], [37, 1, -14733], [43, -3, -1], [49, -3, -1], [53, 0, -25063], [59, -2, -1], [63, -2, -24023]]]
};

var plugin = function (api) {

    api.require("common");

    switch (api.env.special) {
        case "自动刷角色故事":
            api.triggerByColors("story", clrs.story, (env) => {
                sleep(env.high_speed ? 300 : 500);
                if (rs = api.findColors.apply(api, clrs.character)) {
                    click(rs.x, rs.y);
                } else {
                    api.stop();
                }
            });
            api.trigger("玛纳板", (env) => {
                sleep(env.high_speed ? 300 : 500);
                if (rs = api.findColors.apply(api, clrs.chapter)) {
                    click(rs.x, rs.y);
                } else {
                    back();
                }
            });
            api.trigger("报酬", () => click(360, 824));
            api.trigger("default", () => api.clickImage("跳过"));
            break;
        case "自动抽无限池":
            api.trigger("OK", () => click(522, 825));
            api.trigger("抽取", (env) => (click(563, 619), sleep(env.high_speed ? 6000 : 8000)));
            api.trigger("抽空", () => {
                if (api.detectImage("重置")) {
                    click(614, 269);
                    return;
                }
                api.stop();
            });
            break;
    }

}

module.exports = plugin;