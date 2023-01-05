var utils = {};

utils.assert = function (exp) {
    if (exp == null || exp == undefined || exp == NaN) throw Error("Illegal data");
    return exp;
}

utils.readData = (path) => {
    var names = $files.listDir(path, function (name) {
        return name.endsWith(".png")
    }).map((val) => $files.getNameWithoutExtension(val));
    var map = {};
    for (let name of names) {
        var img = $images.read($files.join(path, name + ".png"));
        var pos = $files.read($files.join(path, name + ".txt")).split(',').map((val) => Number(val));
        map[name] = {
            x: pos[0],
            y: pos[1],
            w: img.getWidth(),
            h: img.getHeight(),
            img: img
        };
    }
    return map;
}

function reverse(img, threshold) {
    var gray = $images.grayscale(img);
    var reversed = $images.threshold(gray, threshold, 255, "BINARY_INV");
    gray.recycle();
    return reversed;
}

var findImage = utils.findImage = function (img, options) {
    var screen = captureScreen();
    var rs = $images.findImage(screen, img, options);
    if (!rs && options && options.reverse) {
        var reversed = reverse(screen, 153),
            gray = $images.grayscale(img);
        options.threshold = 0.86;
        rs = $images.findImage(reversed, gray, options);
        reversed.recycle();
        gray.recycle();
    }
    screen.recycle();
    if (rs) {
        rs.x += img.getWidth() >>> 1;
        rs.y += img.getHeight() >>> 1;
    }
    return rs;
}

utils.findTemplate = (template, options) => findImage(template.img, options);

utils.findAllTemplate = (template, options) => {
    var screen = captureScreen();
    var rs = $images.matchTemplate(screen, template.img, options);
    screen.recycle();
    return rs;
}

utils.detectTemplate = (template, threshold) => findImage(template.img, {
    region: [template.x, template.y, template.w, template.h],
    threshold: threshold
});

utils.findColors = (firstColor, colors, options) => {
    var screen = captureScreen();
    var rs = $images.findMultiColors(screen, firstColor, colors, options);
    screen.recycle();
    return rs;
}

utils.detectColor = (x, y, color, threshold) => {
    var screen = captureScreen();
    var rs = $images.detectsColor(screen, color, x, y, threshold);
    screen.recycle();
    return rs;
}

utils.detectMultiColors = (x, y, firstColor, colors, threshold) => {
    var screen = captureScreen();
    var rs = $images.detectsMultiColors(screen, x, y, firstColor, colors, { threshold: threshold });
    screen.recycle();
    return rs;
}

utils.scrollFind = (callback, maxCount, high_speed) => {
    var rs, w = device.width >> 2, h = device.height >>> 1;
    sleep(high_speed ? 300 : 500);
    if (rs = callback()) return rs;
    for (var i = 0; i < maxCount; i++) {
        swipe(w, h + 75, w, h - 75, 300);
        sleep(high_speed ? 1300 : 2000);
        if (rs = callback()) return rs;
    }
    swipe(w, h - 200, w, device.height - 30, 300);
    sleep(500);
    return null;
}

module.exports = utils;