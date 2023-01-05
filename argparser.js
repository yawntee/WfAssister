// const constant = require("./constant");

var argparser = {};

var paths = {};
var templates = {};

function putTemplate(name, x, y, img) {
    templates[name] = {
        x: x,
        y: y,
        w: img.getWidth(),
        h: img.getHeight(),
        img: img,
        persist: true
    }
}

argparser.appendTemplates = (module) => Object.assign(module.templates, templates);

argparser.parse = function () {
    var args = {};
    Object.assign(args, common());
    Object.assign(args, paths[args.path]());
    return args;
}

function common() {
    return {
        package: $ui.ver_origin.isChecked() ? "com.leiting.wf" : "com.leiting.wf.bilibili",
        high_speed: $ui.high_speed.isChecked(),
        path: constant.paths[$ui.viewpager.getCurrentItem()],
        spot: $ui.spot.isChecked(),
        flip: $ui.flip.isChecked(),
        flip_sec: Number($ui.flip_sec.getText()) * 5,
        potion: $ui.potion.isChecked(),
        shutdown: $ui.shutdown.isChecked()
    };
}

paths["boss"] = function () {
    var obj = {};
    switch (obj.mode = $ui.modes.findViewById($ui.modes.getCheckedRadioButtonId()).getText()) {
        case "房主":
        case "灵车":
            if ($ui.each.isChecked() || $ui.follow.isChecked() || $ui.random.isChecked())
                obj.recruit = [$ui.each.isChecked(), $ui.follow.isChecked(), $ui.random.isChecked()];
            obj.just_go = $ui.just_go.isChecked();
        case "单人":
            obj.level = $ui.level.cur; //大蛇，管理者、白虎、弧魔、寄居蟹、魔像、不死王、猫头鹰、海妖、机器人
            obj.difficulty = $ui.difficulty.cur; //初级、中级、高级、高级+、超级
            obj.act_level = constant.act_bosses.indexOf(obj.level) != -1
            obj.goback = true;
            obj.module = "host";
            break;
        case "房客":
            putTemplate("房间特征", 0, 0, $ui.feature.cur);
            obj.dest = "房间特征";
            obj.act_level = $ui.act_level.isChecked();
            obj.goback = $ui.goback.isChecked();
            obj.module = "parter";
            break;
        case "迷宫":
        case "深层":
            obj.level = $ui.level.cur;
            obj.difficulty = $ui.difficulty.cur;
            obj.goback = true;
            obj.module = "maze";
            return obj;
    }
    if ($ui.timeout.isChecked()) obj.timeout = Number($ui.timeout_sec.getText());
    return obj;
}

paths["aid"] = function () {
    return {
        filter: Object.keys($ui.filter.options),
        module: "aid"
    };
}

paths["special"] = function () {
    return {
        special: $ui.special.findViewById($ui.special.getCheckedRadioButtonId()).attr("text"),
        module: "special"
    }
}

module.exports = argparser;