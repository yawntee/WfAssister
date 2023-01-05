// const utils = require("./utils");

module.exports = function (module, interfaces) {

    var env = module.env;

    var features = module.features;

    var templates = module.templates;

    this.env = env;

    this.stop = interfaces.stop;

    this.query = (name) => interfaces.query(features, env, name);

    this.checkScreen = () => interfaces.query(features, env, env.cur);

    this.settings = (settings) => Object.assign(module.env, settings);

    this.trigger = (name, callback) => {
        callback.super = module.triggers[name];
        module.triggers[name] = callback;
    }

    this.triggerByColors = (name, params, callback) => {
        features[name] = params;
        this.trigger(name, callback);
    };

    this.getTrigger = (name) => module.triggers[name];

    this.getFeature = (name) => features[name];

    this.getTemplate = (name) => templates[name];

    this.scrollFind = (callback, maxCount, options) => utils.scrollFind(callback, maxCount, options, env.high_speed);

    this._clickImage = (template, region, reverse, threshold) => {
        var rs = utils.findTemplate(template, {
            threshold: threshold || env.image_thres,
            region: region,
            reverse: reverse
        });
        if (rs) click(rs.x, rs.y);
        return rs;
    }

    this.clickImage = (name, region, reverse, threshold) => this._clickImage(templates[name], region, reverse, threshold);

    this._findImage = (template, region, reverse, threshold) => utils.findTemplate(template, {
        threshold: threshold || env.image_thres,
        region: region,
        reverse: reverse
    });

    this.findImage = (name, region, reverse, threshold) => this._findImage(templates[name], region, reverse, threshold);

    this._findAllImage = (template, region, reverse, threshold) => utils.findAllTemplate(template, {
        threshold: threshold || env.image_thres,
        region: region,
        reverse: reverse
    })

    this.findAllImage = (name, region, reverse, threshold) => this._findAllImage(templates[name], region, reverse, threshold);

    this._detectImage = (template, threshold) => utils.detectTemplate(template, threshold || env.image_thres);

    this.detectImage = (name, threshold) => utils.detectTemplate(templates[name], threshold);

    this.findColors = (color, colors, options) => utils.findColors(color, colors, options || { threshold: env.colors_thres });

    this.detectColor = (x, y, color, threshold) => utils.detectColor(x, y, color, threshold || env.color_thres);

    this.detectColors = (x, y, firstColor, colors, threshold) => utils.detectMultiColors(x, y, firstColor, colors, threshold || env.colors_thres);

    function Proxy(parent, imports, templates) {
        this.trigger = (feature, callback) => {
            if (feature == "default") {
                parent.trigger(feature, callback);
                return;
            }
            if (!imports || imports.indexOf(feature) != -1) {
                if (!features[feature]) {
                    alert("特征图片缺失：" + feature);
                    exit();
                }
                parent.trigger(feature, callback);
            }
        }
        this.require = () => { }
        this.getTemplate = (name) => templates[name];
        this.clickImage = (name, region, reverse, threshold) => parent._clickImage(templates[name], region, reverse, threshold);
        this.findImage = (name, region, reverse, threshold) => parent._findImage(templates[name], region, reverse, threshold);
        this.detectImage = (name, threshold) => parent._detectImage(templates[name], threshold);
    }
    Proxy.prototype = this;
    this.require = (name, imports) => {
        var path = $files.join("./modules", name);
        //load features
        var featureImgs = utils.readData($files.join(path, "features"));
        for (var i in featureImgs) {
            if (features[i]) {
                alert("特征名称冲突：" + i);
                exit();
            }
            else if (!imports || imports.indexOf(i) != -1)
                features[i] = featureImgs[i];
            else
                featureImgs[i].img.recycle();
        }
        //load templates
        var templateImgs = utils.readData($files.join(path, "templates"));
        module.requires.push(templateImgs);
        require($files.join(path, "config.js"))(new Proxy(this, imports, templateImgs));
    }

    this.perform = (name) => {
        var fun = module.triggers[name];
        fun(env, fun.super);
    }
}