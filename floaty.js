// const constant = require("./constant");
const argparser = require("./argparser");
const framework = require("./framework");

function floaty() {

    this.showing = false;
    this.win = null;
    this.thread = null;

    var inst = this, module;

    function checkPermission() {
        if (!auto.service) {
            $threads.start(function () {
                auto();
            });
            return false;
        }
        if (!$floaty.checkPermission()) {
            $threads.start(function () {
                alert("请给予悬浮窗权限");
                $floaty.requestPermission();
            });
            return false;
        }
        toastLog("已获取悬浮窗权限");
        return true;
    }

    function start() {
        var thread = $threads.start(function () {
            try {
                if (!$images.requestScreenCapture()) {
                    alert("无法获取截图权限！");
                    return false;
                }
                toastLog("已获取截图权限");
            } catch (err) { };
            inst.thread = thread;
            $ui.post(() => {
                inst.win.play.attr("src", "@drawable/ic_stop_black_48dp");
                inst.win.scan.setEnabled(false);
            })
            var args = argparser.parse();
            module = framework.buildModule(args.module, args, stop);
            argparser.appendTemplates(module);
            framework.run(module);
        });
    }

    function stop() {
        $ui.post(() => {
            inst.win.play.attr("src", "@drawable/ic_play_arrow_black_48dp");
            inst.win.scan.setEnabled(true);
        });
        $threads.start(function () {
            framework.stop();
            inst.thread.interrupt();
            inst.thread = null;
            module.gc();
            module = null;
        });
    }


    function scan(callback) {
        var screen = captureScreen();
        var template = $images.read("./images/flag.png");
        var imgs = $images.matchTemplate(screen, template, {
            threshold: 0.96,
            region: [0, 371, device.width, device.height - 371]
        });
        template.recycle();
        if (!imgs.first()) {
            toastLog("未扫描到房间");
            return;
        }
        var dialog;
        var view = inst.buildView(imgs.points, (val) => {
            var imgView = $ui.inflate(
                <vertical id="lay" padding="0 20dp" margin="0 10dp" bg="#cccccc" clickable="true">
                    <img id="img" />
                </vertical>
            )
            var img = $images.clip(screen, 245, val.y - 21, 260, 21);
            imgView.img.setImageBitmap(img.getBitmap());
            imgView.lay.on("click", (v) => {
                dialog.dismiss();
                callback(img);
            });
            return imgView;
        });
        dialog = $dialogs.build({
            title: "选择特征图片",
            customView: view,
            negative: "关闭",
            canceledOnTouchOutside: false
        }).show();
        screen.recycle();
    }

    this.buildView = function (arr, callback) {
        var view = $ui.inflate(<vertical></vertical>);
        for (var i in arr) view.addView(callback(arr[i], i));
        return view;
    }

    this.show = () => {
        if (this.showing) return false;
        if (!checkPermission()) return false;
        $app.launchPackage($ui.ver_origin.isChecked() ? "com.leiting.wf" : "com.leiting.wf.bilibili");
        this.win = $floaty.rawWindow(<vertical bg="#a4e2c6">
            <frame bg="#ff6666" w="*">
                <text textSize="18sp">弹射助手</text>
                <img id="shutdown" layout_gravity="right|center" marginRight="5dp" tint="#f20c00" w="20dp" h="20dp" src="@drawable/ic_close_black_48dp" bg="?attr/selectableItemBackground" clickable="true" />
            </frame>
            <horizontal>
                <button id="scan" w="60dp" h="40dp" style="Widget.AppCompat.Button.Colored" text="扫描" />
                <img id="play" tint="#44cef6" w="40dp" h="40dp" src="@drawable/ic_play_arrow_black_48dp" bg="?attr/selectableItemBackground" clickable="true" />
            </horizontal>
        </vertical>)
        this.win.setPosition(0, device.height >>> 3);

        this.win.shutdown.on("click", () => {
            this.close();
        });

        this.win.scan.on("click", () => {
            if ($ui.feature.queue.length > 9) {
                alert("最多只能存储10张特征图片");
                return;
            }
            $threads.start(function () {
                try {
                    if (!$images.requestScreenCapture()) {
                        inst.thread = null;
                        alert("无法获取截图权限！");
                        return false;
                    }
                } catch (err) { };
                scan((img) => {
                    $ui.feature.queue.unshift(img);
                    $ui.feature.cur = img;
                    toastLog("特征图片已保存并设置为当前目标");
                    $ui.feature.clearColorFilter();
                    $ui.feature.setImageBitmap(img.getBitmap());
                });
            })
        });

        this.win.play.on("click", (v) => {
            if (this.thread) {
                stop();
            } else {
                if (!$ui.viewpager.getCurrentItem() && $ui.parter.isChecked() && !$ui.feature.cur) {
                    toastLog("请先截取特征图片");
                    return;
                }
                start();
            }
        })
        this.showing = true;
        return true;
    }

    this.close = () => {
        if (!this.showing) return false;
        if (this.thread && this.thread.isAlive()) {
            stop();
            toastLog("脚本已自动停止");
        }
        $ui.post(() => {
            this.win.close();
            $ui.play.attr("src", "@drawable/ic_play_arrow_black_48dp");
        });
        $app.launchPackage(context.getPackageName());
        this.showing = false;
        return true;
    }

    this.addExtra = (path, callback) => {
        if (!this.extra[path]) this.extra[path] = [];
        this.extra[path].push(callback);
    }
}


module.exports = new floaty();