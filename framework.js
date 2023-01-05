// const utils = require("./utils");
const api = require("./api");

var framework = {};

$debug.setMemoryLeakDetectionEnabled(false);


function query(features, env, direct) {
    var screen = captureScreen(), rs = null;
    function checkFeature(feature) {
        if (Array.isArray(feature)) {
            return $images.detectsMultiColors(screen, feature[0], feature[1], feature[2], feature[3], 4);
        } else {
            return $images.findImage(screen, feature.img, {
                region: [feature.x, feature.y, feature.w, feature.h],
                threshold: 0.995
            });
        }
    }
    if (direct) {
        rs = checkFeature(features[direct]);
    } else {
        for (var i in features) {
            if (checkFeature(features[i])) {
                rs = i;
                break;
            };
        }
    }
    screen.recycle();
    return rs;
}

var running;
function perform(module) {
    var features = module.features, env = module.env, interval = env.interval, triggers = module.triggers;
    running = true;
    while (running) {
        if (currentPackage() != env.package) {
            $app.launchPackage(env.package);
            sleep(2000);
            continue;
        }
        var cur = env.cur = query(features, env);
        if (cur) {
            var trigger = triggers[cur];
            if (trigger)
                trigger(env, trigger.super);
            else if (triggers.default)
                triggers.default(env, cur);
        } else if (triggers.default)
            triggers.default(env, cur);
        sleep(interval);
    }
}

function requestPermission() {
    try {
        if (!$images.requestScreenCapture()) {
            alert("请给予截图权限");
            return false;
        }
    } catch (err) { }
    try {
        auto();
    } catch (err) {
        alert("请给予无障碍权限");
        return false;
    }
    return true;
}

framework.buildModule = function (name, uservar, callback) {
    print(uservar);
    var path = $files.join("./modules", name);
    function recycle(imgs) {
        for (var i in imgs) {
            var data = imgs[i];
            if (data.img && !data.persist) data.img.recycle();
        }
    }
    var module = {
        env: {
            interval: 1000,
            image_thres: 0.9,
            color_thres: 16
        },
        triggers: {},
        requires: [],
        gc: () => {
            recycle(module.features);
            recycle(module.templates);
            for (let i of module.requires) recycle(i);
        },
        onStop: callback
    };
    Object.assign(module.env, uservar);
    var features = module.features = utils.readData($files.join(path, "features"));
    module.templates = utils.readData($files.join(path, "templates"));
    require($files.join(path, "config.js"))(new api(module, {
        query: query,
        stop: () => {
            toastLog("脚本已停止");
            running = false
            module.gc();
            callback();
        }
    }));
    for (var name in features)
        if (!(name in module.triggers)) {
            features[name].img.recycle();
            delete features[name];
        }
    return module;
}

framework.run = function (module) {
    if (!requestPermission()) return;
    try {
        perform(module);
    } catch (err) {
        if (!running) return;
        var content = $debug.getStackTrace(err);
        print(content);
        dialogs.build({
            title: "运行错误",
            content: content,
            positive: "复制内容",
            negative: "关闭"
        }).on("positive", () => {
            setClip(content);
            toastLog("已复制到剪贴板");
        }).show();
        running = false
        module.gc();
        module.onStop();
    }
}

framework.stop = () => running = false;

module.exports = framework;