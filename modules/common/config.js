const pos = {
    potion: [[390, 478], [396, 632], [404, 780]]
};
const clrs = {
    rs_start: [176, 115, -28152, [[-7, -6, -25088], [-12, -10, -22008], [-4, -17, -17912], [-3, -24, -11735], [-1, -33, -4262], [-4, -43, -1124], [-10, -50, -1074], [-18, -51, -1083], [-25, -48, -1091], [-32, -43, -1124], [-34, -37, -2189], [-36, -28, -7358], [-33, -18, -16880], [-28, -12, -19960], [-21, -8, -24064], [-13, -9, -23032]]],
    continue: [241, 1191, -12923195, [[0, 16, -12923195], [237, 1, -13513019], [237, 22, -12922171]]],
    rs_end: [97, 1190, -12923195, [[0, 25, -12923195], [236, 1, -12923195], [236, 25, -12923195], [289, 3, -12922171], [289, 28, -13513027], [526, 2, -12923195], [526, 26, -12923195]]],
    skip: [621, 42, "#ffffff", [[-1, 13, "#ffffff"], [10, 8, "#ffffff"], [10, -3, "#ffffff"], [14, 15, "#ffffff"], [29, -1, "#ffffff"], [42, 0, "#ffffff"], [45, 14, "#ffffff"], [65, -4, "#ffffff"], [65, 14, "#ffffff"]]]
}

var plugin = function (api) {

    api.settings({
        interval: 1000,
        image_thres: 0.9,
        color_thres: 16,
        colors_thres: 10
    });

    var randomClick = () => click(Math.random() * $device.width, Math.random() * $device.height);

    api.trigger("欢迎页", () => {
        if (api.query("错误")) {
            api.perform("错误");
            return;
        }
        click(348, 1114);
    });

    api.trigger("每日奖励", randomClick);

    api.trigger("升级", randomClick);

    api.trigger("公告", () => click(357, 1179));

    api.triggerByColors("结算", clrs.rs_start, (env) => {
        while (true) {
            if (api.detectColors.apply(api, clrs.rs_end)) {
                break;
            } else if (api.detectColors.apply(api, clrs.continue)) {
                click(360, 1183);
                sleep(env.high_speed ? 250 : 750);
            } else if (api.detectImage("脱离")) {
                return;
            } else {
                click(5, 5);
                sleep(env.high_speed ? 150 : 300);
            }
        }
        if (env.goback)
            click(517, 1200);
        else
            click(217, 1200);
    });

    api.trigger("体力", (env) => {
        if (env.potion) {
            for (let i of pos.potion) {
                if (api.detectColor(i[0], i[1], "#f7f7f7")) {
                    click(i[0], i[1]);
                    return;
                }
            }
        }
        if (env.shutdown) {
            while (currentPackage() == env.package) {
                back();
                sleep(800);
                api.clickImage("确定");
                api.clickImage("是");
            }
            exit();
        }
        api.stop();
    });

    api.trigger("使用", () => click(523, 927));

    api.trigger("回复", () => click(361, 913));

    api.trigger("结算_提示", () => click(360, 824));

    api.triggerByColors("skip", clrs.skip, () => click(642, 49));

    api.trigger("重连", () => click(197, 824));

    api.trigger("错误", () => click(359, 796));
}

module.exports = plugin;