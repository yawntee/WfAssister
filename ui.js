"ui";

const constant = require("./constant");
var floaty = require("./floaty");
var utils = require("./utils");

$ui.layout(<drawer id="drawer">
    <vertical>
        <appbar bg="#ff6666">
            <frame>
                <toolbar id="toolbar" title="弹射助手" w="*" />
                <img id="play" src="@drawable/ic_play_arrow_black_48dp" bg="?attr/selectableItemBackground" clickable="true" layout_gravity="right|center" w="40dp" h="40dp" tint="#99ccff" />
            </frame>
            <tabs id="tabs" bg="#ff9966" />
        </appbar>
        <viewpager id="viewpager" bg="#ffffcc">
            <relative w="*" h="*">
                <scroll w="*" h="*">
                    <vertical w="*" h="*">
                        <text bg="#ffccff" w="*" gravity="center" textSize="16sp">模式</text>
                        <radiogroup id="modes" margin="0 40px" orientation="horizontal">
                            <radio id="host" text="房主" layout_weight="1" checked="true" />
                            <radio id="parter" text="房客" layout_weight="1" />
                            <radio id="no_cost" text="灵车" layout_weight="1" />
                            <radio id="single" text="单人" layout_weight="1" />
                            <radio id="maze" text="迷宫" layout_weight="1" />
                            <radio id="ruin" text="深层" layout_weight="1" />
                        </radiogroup>
                        <vertical id="levelBar">
                            <text bg="#ffccff" w="*" gravity="center" textSize="16sp">关卡</text>
                            <grid id="level" spanCount="6">
                                <img layout_gravity="center" w="*" h="48dp" margin="0 10dp" padding="0 3dp" circle="true" borderColor="#ff6666" src="file://{{$files.path('./images/'+this+'.png')}}" />
                            </grid>
                            <text bg="#ffccff" w="*" gravity="center" textSize="16sp">难度</text>
                            <grid id="difficulty" spanCount="5">
                                <radio text="{{this}}" layout_gravity="center" margin="0 10dp" />
                            </grid>
                        </vertical>
                        <vertical id="hostBar" >
                            <text bg="#ffccff" w="*" gravity="center" textSize="16sp">招募</text>
                            <horizontal margin="0 20px">
                                <checkbox id="each" layout_weight="1" text="互相关注" /><checkbox id="follow" layout_weight="1" text="关注者" /><checkbox id="random" layout_weight="1" text="随机招募" />
                            </horizontal>
                            <text bg="#ffccff" w="*" gravity="center" textSize="16sp">配置</text>
                            <checkbox id="just_go" text="满2人时开始战斗" margin="0 20px" />
                        </vertical>
                        <vertical id="parterBar" visibility="gone">
                            <text bg="#ffccff" w="*" gravity="center" textSize="16sp">配置</text>
                            <horizontal margin="0 20px">
                                <text text="目标特征:" textSize="16sp" layout_gravity="left|center" /><img id="feature" layout_gravity="center" src="@drawable/ic_image_black_48dp" bg="?attr/selectableItemBackground" clickable="true" tint="#99ccff" /><img id="help" layout_gravity="center" src="@drawable/ic_help_outline_black_48dp" w="20dp" h="20dp" tint="#cccccc" clickable="true" marginLeft="10dp" />
                            </horizontal>
                            <checkbox id="act_level" text="是否为活动关卡" />
                            <checkbox id="goback" text="结算后尝试返回房间" />
                        </vertical>
                        <vertical id="passBar">
                            <text bg="#ffccff" w="*" gravity="center" textSize="16sp">智能踢罐</text>
                            <horizontal>
                                <checkbox id="timeout" text="战斗超过" textSize="14sp" /><input id="timeout_sec" singleLine="true" inputType="number" text="20" maxLength="4" ems="3" /><text textColor="#000000" textSize="14sp">秒自动跳车</text>
                            </horizontal>
                        </vertical>
                    </vertical>
                </scroll>
            </relative>
            <frame>
                <vertical>
                    <text bg="#ffccff" w="*" gravity="center" textSize="16sp">Boss筛选</text>
                    <grid id="filter" spanCount="6">
                        <img layout_gravity="center" w="*" h="48dp" margin="0 10dp" padding="0 3dp" circle="true" borderColor="#ff6666" src="file://{{$files.path('./images/'+this+'.png')}}" />
                    </grid>
                    <text text="Tips：不选将接受所有铃铛" />
                </vertical>
            </frame>
            <frame>
                <radiogroup id="special">
                    <radio text="自动刷角色故事" checked="true" />
                    <radio text="自动抽无限池" />
                </radiogroup>
            </frame>
        </viewpager>

    </vertical>
    <vertical layout_gravity="left" bg="#ffffff" w="240dp" bg="#ff9933">
        <text bg="#ffccff" w="*" gravity="center" textSize="16sp">客户端版本</text>
        <radiogroup id="ver" orientation="horizontal">
            <radio id="ver_origin" text="官服" checked="true" layout_weight="1" />
            <radio id="ver_b" text="b服" layout_weight="1" />
        </radiogroup>
        <text bg="#ffccff" w="*" gravity="center" textSize="16sp">通用配置</text>
        <horizontal>
            <checkbox id="spot" layout_weight="1" text="使用加成点数" /><checkbox id="flip" layout_weight="1" text="开局自动点板" />
        </horizontal>
        <horizontal>
            <checkbox id='potion' text="药水补体" />
            <checkbox id='shutdown' text="体力耗尽退出游戏" />
        </horizontal>
        <horizontal>
            <text text="开局点板" /><input id="flip_sec" singleLine="true" inputType="number" text="2" maxLength="2" ems="2" /><text text="秒" />
        </horizontal>
        <text bg="#ffccff" w="*" gravity="center" textSize="16sp">全局配置</text>
        <checkbox id="root_mode" text="使用root启动无障碍" textSize="14sp" />
        <checkbox id="high_speed" text="高速模式(非高配机慎用)" />
    </vertical>
</drawer>)

//init
var store = $storages.create("wfhelper");
var bossNames = Object.keys(constant.bosses);

$ui.viewpager.setTitles(constant.pathNames);
$ui.tabs.setupWithViewPager($ui.viewpager);
$ui.toolbar.setupWithDrawer($ui.drawer);
$ui.level.setDataSource(bossNames);
$ui.difficulty.setDataSource(constant.bosses[bossNames[0]]);
$ui.filter.setDataSource(bossNames);

$ui.level.select = function (index) {
    this.cur = this.getDataSource()[index];
    this.index = index;
    var last = this.last;
    if (last) last.attr("borderWidth", 0);
    var child = this.getChildAt(index);
    this.last = child;
    child.attr("borderWidth", 12);
    settingDifficulty(this.cur);
}

$ui.difficulty.select = function (index) {
    this.cur = this.getDataSource()[index];
    this.index = index;
    var last = this.last;
    if (last) last.attr("checked", false);
    var child = this.getChildAt(index);
    this.last = child;
    child.attr("checked", true);
}

function settingDifficulty(name) {
    switch (name) {
        case "火":
        case "水":
        case "雷":
        case "风":
        case "光":
        case "暗":
        case "mana":
            var mode = $ui.modes.findViewById($ui.modes.getCheckedRadioButtonId()).attr("text");
            $ui.difficulty.setDataSource(mode == "迷宫" ? constant.mazes : constant.ruins);
            break;
        default:
            $ui.difficulty.setDataSource(constant.bosses[name]);
    }
}

$ui.filter.options = {};
$ui.feature.queue = [];
$ui.difficulty.collection = constant.bosses;

$ui.post(() => {

    $ui.level.select(0);
    $ui.difficulty.select(0);

    var ui_config = store.get("ui");

    try {
        if (ui_config) {
            for (var i = 0; i < ui_config.length; i++) {
                var item = ui_config[i];
                var obj = $ui[item.id];
                obj[item.name].apply(obj, item.params);
            }
        }
    } catch (err) {
        print($debug.getStackTrace(err));
        store.remove("ui");
        ui_config = null;
    }

    if (!$app.getAppName("com.leiting.wf")) $ui.ver_b.attr("checked", true);
});

$threads.start(function () {
    var data = store.get("data");
    if (data) $ui.feature.queue = data.map(val => $images.fromBase64(val));
    $events.on("exit", () => {
        store.put("data", $ui.feature.queue.map(val => {
            var code = $images.toBase64(val);
            val.recycle();
            return code;
        }));
    })
});


importClass(android.widget.Spinner);
importClass(android.widget.RadioGroup);

function bindChanged(view, callback) {
    // if (view instanceof Spinner) {
    //     view.setOnItemSelectedListener(new android.widget.AdapterView$OnItemSelectedListener({
    //         onItemSelected: callback
    //     }));
    // }
    if (view instanceof RadioGroup) {
        view.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener({
            onCheckedChanged: callback
        }));
    }
}

function setDataSource(spinner, arr) {
    var adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, arr);
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
    spinner.setAdapter(adapter);
}


//关卡、难度二级联动
$ui.level.on("item_click", (item, index, v, self) => {
    if (v === self.last) return;
    self.select(index);
    $ui.difficulty.select(0);
    self.last = v;
});

$ui.difficulty.on("item_click", (item, index, v, self) => self.select(index));

$ui.filter.on("item_click", (item, index, v, self) => {
    if (self.options[item]) {
        v.attr("borderWidth", 0);
        delete self.options[item];
    } else {
        v.attr("borderWidth", 12);
        self.options[item] = true;
    }
})

//模式、配置二级联动
bindChanged($ui.modes, (group, id) => {
    var text = group.findViewById(id).getText();
    var last = group.last;
    $ui.levelBar.attr("visibility", text == "房客" ? "gone" : "visible");
    $ui.hostBar.attr("visibility", text == "房主" || text == "灵车" ? "visible" : "gone");
    $ui.parterBar.attr("visibility", text == "房客" ? "visible" : "gone");
    $ui.passBar.attr("visibility", text != "迷宫" && text != "深层" ? "visible" : "gone");
    switch (text) {
        case "房主":
        case "灵车":
        case "单人":
            if (last != "迷宫" && last != "深层") break;
            $ui.level.setDataSource(bossNames);
            $ui.difficulty.setDataSource(constant.bosses[bossNames[0]]);
            $ui.post(() => {
                $ui.level.select(0);
                $ui.difficulty.select(0);
            });
            break;
        case "迷宫":
        case "深层":
            $ui.level.setDataSource(text == "迷宫" ? constant.attributes.concat("mana") : constant.attributes);
            $ui.difficulty.setDataSource(text == "迷宫" ? constant.mazes : constant.ruins);
            $ui.post(() => {
                $ui.level.select(0);
                $ui.difficulty.select(0);
            });
            break;
    }
    if (text != "房客") group.last = text;
});


//特征图片帮助按钮
$ui.help.on("click", () => {
    $dialogs.alert("特征图片", $files.read("help.txt"));
});
//root权限启动无障碍按钮
$ui.root_mode.on("check", (checked) => {
    threads.start(function () {
        $settings.setEnabled("enable_accessibility_service_by_root", checked);
    })
});


$ui.play.on("click", (v) => {
    if (floaty.show())
        v.attr("src", "@drawable/ic_stop_black_48dp");
    else if (floaty.close())
        v.attr("src", "@drawable/ic_play_arrow_black_48dp");
});
$ui.feature.on("click", () => {
    if (!$ui.feature.queue.length) {
        toast("已保存的特征图片为空");
        return;
    }
    var dialog;
    try {
        var mainView = floaty.buildView($ui.feature.queue, (val, index) => {
            var view = $ui.inflate(<frame bg="#cccccc" margin="0 10dp">
                <img id="img" clickable="true" w="*" layout_gravity="left|center" padding="0 20dp" />
                <img id="delete" src="@drawable/ic_delete_black_48dp" tint="#ff0000" clickable="true" w="24dp" h="24dp" layout_gravity="right|center" />
            </frame>);
            var img = val.getBitmap();
            view.img.setImageBitmap(img);
            view.img.on("click", () => {
                $ui.feature.cur = val;
                $ui.feature.clearColorFilter();
                $ui.feature.setImageBitmap(img);
                dialog.dismiss();
            });
            view.delete.on("click", () => {
                $ui.feature.queue.splice(index, 1);
                mainView.removeView(view);
            })
            return view;
        });
        dialog = $dialogs.build({
            title: "特征图片记录",
            customView: mainView
        }).on("cancel", () => {
            if (!$ui.feature.queue.length) {
                $ui.feature.attr("src", "@drawable/ic_image_black_48dp");
                $ui.feature.attr("tint", "#99ccff");
            }
        }).show();
    } catch (err) {
        print(err);
    }
});


$events.on("exit", () => {
    var record = [];
    function saveState(id, name, params) {
        record.push({
            id: id,
            name: name,
            params: params
        });
    }
    saveState($ui.ver.findViewById($ui.ver.getCheckedRadioButtonId()).attr("id").substring(5), "attr", ["checked", "true"]);
    saveState($ui.modes.findViewById($ui.modes.getCheckedRadioButtonId()).attr("id").substring(5), "attr", ["checked", "true"]);
    if ($ui.each.isChecked()) saveState("each", "attr", ["checked", "true"]);
    if ($ui.follow.isChecked()) saveState("follow", "attr", ["checked", "true"]);
    if ($ui.random.isChecked()) saveState("random", "attr", ["checked", "true"]);
    if ($ui.goback.isChecked()) saveState("goback", "attr", ["checked", "true"]);
    if ($ui.spot.isChecked()) saveState("spot", "attr", ["checked", "true"]);
    if ($ui.flip.isChecked()) saveState("flip", "attr", ["checked", "true"]);
    if ($ui.potion.isChecked()) saveState("potion", "attr", ["checked", "true"]);
    if ($ui.timeout.isChecked()) saveState("timeout", "attr", ["checked", "true"]);
    if ($ui.root_mode.isChecked()) saveState("root_mode", "attr", ["checked", "true"]);
    if ($ui.high_speed.isChecked()) saveState("high_speed", "attr", ["checked", "true"]);
    saveState("timeout_sec", "attr", ["text", $ui.timeout_sec.attr("text")]);
    saveState("flip_sec", "attr", ["text", $ui.flip_sec.attr("text")]);
    store.put("ui", record);
});
