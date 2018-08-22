// 工程配置
(function () {
    // 注册滚动条
    BI.Plugin.registerWidget("bi.grid_table_scrollbar", function (ob) {
        if (BI.isIE9Below()) {
            return BI.extend(ob, {type: "bi.native_table_scrollbar"});
        }
        return ob;

    });
    BI.Plugin.registerWidget("bi.grid_table_horizontal_scrollbar", function (ob) {
        if (BI.isIE9Below()) {
            return BI.extend(ob, {type: "bi.native_table_horizontal_scrollbar"});
        }
        return ob;

    });

    // 注册控件
    BI.Plugin.registerWidget("bi.grid_table", function (ob) {
        // 非chrome下滚动条滑动效果不好，禁止掉
        if (!(BI.isChrome() && BI.isWindows() && !BI.isEdge())) {
            return BI.extend(ob, {type: "bi.quick_grid_table"});
        }
        return ob;

    });
    BI.Plugin.registerWidget("bi.collection_table", function (ob) {
        // 非chrome下滚动条滑动效果不好，禁止掉
        if (!(BI.isChrome() && BI.isWindows() && !BI.isEdge())) {
            return BI.extend(ob, {type: "bi.quick_collection_table"});
        }
        return ob;

    });
    // IE8下滚动条用原生的
    _global.$ && $(function () {
        if (BI.isIE9Below()) {
            BI.GridTableScrollbar.SIZE = 18;
        }
    });
})();/**
 * 过滤条件抽象类
 *
 * @class BI.AbstractFilterItem
 * @extend BI.Widget
 */
BI.AbstractFilterItem = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-filter-item bi-border-right bi-border-bottom"
    },

    isSelectedCondition: function () {
        return this.emptyItem && this.emptyItem.isVisible();
    },

    setSelectedCondition: function (b) {
        if (b) {
            if (!this.emptyItem) {
                this.emptyItem = BI.createWidget({
                    type: "bi.absolute",
                    height: 40,
                    cls: "filter-item-empty-item bi-border-top",
                    items: [{
                        el: {
                            type: "bi.center_adapt",
                            cls: "empty-filter-item-leaf"
                        }
                    }],
                    hgap: 10,
                    vgap: 5
                });
                BI.createWidget({
                    type: "bi.vertical",
                    element: this,
                    items: [this.emptyItem],
                    scrolly: false
                });
            }
        }
        this.emptyItem && this.emptyItem.setVisible(b);
    }
});
BI.extend(BI.AbstractFilterItem, {
    FILTER_OPERATION_FORMULA: 1,
    FILTER_OPERATION_CONDITION: 2,
    FILTER_OPERATION_CONDITION_AND: 3,
    FILTER_OPERATION_CONDITION_OR: 4,
    FILTER_OPERATION_FORMULA_AND: 5,
    FILTER_OPERATION_FORMULA_OR: 6
});/**
 * Created by Urthur on 2017/11/21.
 */
!(function () {
    var Expander = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-filter-expander",
            el: {},
            popup: {}
        },

        render: function () {
            var self = this, o = this.options;
            return {
                type: "bi.filter_expander",
                el: o.el,
                popup: o.popup,
                id: o.id,
                value: o.value,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    }
                }],
                ref: function (_ref) {
                    self.expander = _ref;
                }
            };
        },

        populate: function () {
            this.expander.populate.apply(this.expander, arguments);
        },

        getValue: function () {
            var val = this.expander.getValue();
            return {
                filterType: val.type,
                filterValue: val.value,
                id: val.id
            };
        }
    });
    BI.shortcut("bi.and.or.filter.expander", Expander);
}());/**
 * @class BI.FilterExpander
 * @extend BI.AbstractFilterItem
 * 过滤树的一个expander节点
 */
!(function () {
    var FilterExpander = BI.inherit(BI.AbstractFilterItem, {
        _constant: {
            EXPANDER_WIDTH: 30
        },

        props: {
            baseCls: "bi-filter-expander-item bi-filter-expander bi-border-left bi-border-bottom",
            el: {},
            popup: {}
        },

        render: function () {
            var self = this, o = this.options;
            var value = o.el.value, text = "";
            if (value === BI.Filter.FILTER_TYPE.AND) {
                text = BI.i18nText("BI-Basic_And");
            } else {
                text = BI.i18nText("BI-Basic_Or");
            }
            return {
                type: "bi.horizontal_adapt",
                cls: "filter-item-empty-item",
                columnSize: [this._constant.EXPANDER_WIDTH, ""],
                verticalAlign: BI.VerticalAlign.Middle,
                items: [{
                    type: "bi.text_button",
                    cls: "condition-and-or",
                    text: text,
                    value: value,
                    id: o.id,
                    width: this._constant.EXPANDER_WIDTH,
                    height: "100%",
                    ref: function (_ref) {
                        self.expander = _ref;
                    },
                    listeners: [{
                        eventName: BI.TextButton.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, "", self);
                        }
                    }]
                }, BI.extend(o.popup, {
                    ref: function (_ref) {
                        self.conditionsView = _ref;
                    },
                    listeners: [{
                        eventName: BI.Controller.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                        }
                    }]
                })]
            };
        },

        getValue: function () {
            return {
                type: this.expander.getValue(),
                value: this.conditionsView.getValue(),
                id: this.options.id
            };
        },

        populate: function () {
            this.conditionsView.populate.apply(this.conditionsView, arguments);
        }
    });
    BI.shortcut("bi.filter_expander", FilterExpander);
}());
/**
 * 过滤
 *
 * Created by GUY on 2015/11/20.
 * @class BI.Filter
 * @extend BI.Widget
 */
BI.Filter = BI.inherit(BI.Widget, {

    constants: {
        FIELD_TYPE_NUMBER: 1,
        FIELD_TYPE_STRING: 0,
        FIELD_TYPE_DATE: 2
    },

    props: {
        baseCls: "bi-filter",
        expander: {},
        items: [],
        el: {},
        itemCreator: BI.empty
    },

    _store: function () {
        return BI.Models.getModel("bi.model.material.filter");
    },

    watch: {

    },

    render: function () {
        var self = this, o = this.options;
        return BI.extend({
            type: "bi.filter_operation",
            expander: o.expander,
            listeners: [{
                eventName: "EVENT_OPERATION",
                action: function (type) {
                    switch (type) {
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                            self.store.addCondition();
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_CONDITION);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND:
                            self.store.addAndCondition();
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_CONDITION);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR:
                            self.store.addOrCondition();
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_CONDITION, 1);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                            self.store.addFormula();
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_FORMULA);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND:
                            self.store.addAndFormula();
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_FORMULA);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR:
                            self.store.addOrFormula();
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_FORMULA, 1);
                            break;
                    }
                }
            }, {
                eventName: "BI.FilterOperation.EVENT_DESTROY_ITEM",
                action: function (id) {
                    self._removeCondition(id);
                }
            }],
            ref: function (_ref) {
                self.filter = _ref;
            }
        }, o.el);
    },

    mounted: function () {
        this.tree = new BI.Tree();
        this.tree.initTree(this.options.items);
        this._populate(this.tree.toJSONWithNode());
    },

    _createEmptyNode: function (type) {
        var node = new BI.Node(BI.UUID());
        node.set("data", {
            value: type
        });
        return node;
    },

    _insertAndOrCondition: function (id, formulaOrField, type) {
        var ANDOR = ["AND", "OR"];
        type || (type = 0);
        var finded = this.tree.search(id);
        if (BI.isNotNull(finded)) {
            var data = finded.get("data");
            var parent = finded.getParent();
            var index = parent.getChildIndex(finded.id);
            var pdata = parent.get("data") || {};
            var node = this._createEmptyNode(formulaOrField);
            if (data.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                this.tree.addNode(finded, node);
                return;
            }
            if (data.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]]) {
                if (pdata.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                    parent.addChild(node, index + 1);
                    return;
                }
            }
            if ((data.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]] && pdata.value !== BI.Filter.FILTER_TYPE[ANDOR[type]])
                || pdata.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]]
                || (pdata.value !== BI.Filter.FILTER_TYPE.AND && pdata.value !== BI.Filter.FILTER_TYPE.OR)) {
                var andor = new BI.Node(BI.UUID());
                andor.set("data", {
                    value: BI.Filter.FILTER_TYPE[ANDOR[type]],
                    children: [finded.get("data"), node.get("data")]
                });
                parent.removeChildByIndex(index);
                parent.addChild(andor, index);
                andor.addChild(finded);
                andor.addChild(node);
                return;
            }
            parent.addChild(node, index + 1);
        }
    },

    _removeCondition: function (id) {
        var finded = this.tree.search(id);
        if (BI.isNotNull(finded)) {
            var parent = finded.getParent();
            parent.removeChild(id);
            if (parent.getChildrenLength() <= 1) {
                var prev = parent.getParent();
                if (BI.isNotNull(prev)) {
                    var index = prev.getChildIndex(parent.id);
                    prev.removeChildByIndex(index);
                    if (parent.getChildrenLength() === 1) {
                        prev.addChild(parent.getFirstChild(), index);
                    }
                }
            }
            this._populate(this.tree.toJSONWithNode());
            this.fireEvent("EVENT_CHANGE");
        }
    },

    _addAndOrCondition: function (formulaOrField, type) {
        var ANDOR = ["AND", "OR"];
        type || (type = 0);
        var currentSelectItem = this.filter.getCurrentSelectItem();
        if (BI.isNotNull(currentSelectItem)) {
            var id = currentSelectItem.attr("id");
            this._insertAndOrCondition(id, formulaOrField, type);
        } else {
            var node = this._createEmptyNode(formulaOrField);
            var root = this.tree.getRoot();
            var child = root.getLastChild();
            if (BI.isNotNull(child)) {
                var data = child.get("data");
                if (data.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                    this.tree.addNode(child, node);
                } else {
                    var andor = new BI.Node(BI.UUID());
                    andor.set("data", {
                        value: BI.Filter.FILTER_TYPE[ANDOR[type]],
                        children: [child.get("data"), node.get("data")]
                    });
                    root.removeChild(child.id);
                    this.tree.addNode(andor);
                    this.tree.addNode(andor, child);
                    this.tree.addNode(andor, node);
                }
            } else {
                this.tree.addNode(node);
            }
        }
        this._populate(this.tree.toJSONWithNode());
        this.fireEvent("EVENT_CHANGE");
    },

    _populate: function (items) {
        this.filter.defaultState();
        var o = this.options;
        o.items = items;
        BI.Tree.traversal(items, function (i, item) {
            o.itemCreator(item);
        });
        this.filter.populate.apply(this.filter, [items]);
    },

    populate: function (conditions) {
        this.tree.initTree(conditions);
        this._populate(this.tree.toJSONWithNode());
    },

    getValue: function () {
        return this.filter.getValue();
    }
});

BI.shortcut("bi.filter", BI.Filter);

BI.Filter.FILTER_TYPE = {};
BI.Filter.FILTER_TYPE.FORMULA = 33;
BI.Filter.FILTER_TYPE.AND = 34;
BI.Filter.FILTER_TYPE.OR = 35;
BI.Filter.FILTER_TYPE.EMPTY_FORMULA = 36;
BI.Filter.FILTER_TYPE.EMPTY_CONDITION = 37;
/**
 * Created by windy on 2017/3/28.
 */
!(function () {
    var FilterList = BI.inherit(BI.ButtonTree, {
        props: {
            baseCls: "bi-button-map"
        },

        _createBtns: function (items) {
            var o = this.options;
            var buttons = BI.createWidgets(BI.createItems(items, {type: "bi.text_button", once: o.chooseType === 0}));
            var keys = BI.map(items, function (i, item) {
                item = BI.stripEL(item);
                if (!(item.id || item.value)) {
                    throw new Error("item must have 'id' or 'value' as its property");
                }
                return item.id || item.value;
            });
            return BI.zipObject(keys, buttons);
        },

        setValue: function (v) {
            v = BI.isArray(v) ? v : [v];
            BI.each(this.buttons, function (val, item) {
                if (!BI.isFunction(item.setSelected)) {
                    item.setValue(v);
                    return;
                }
                if (v.contains(val)) {
                    item.setSelected && item.setSelected(true);
                } else {
                    item.setSelected && item.setSelected(false);
                }
            });
        },

        setNotSelectedValue: function (v) {
            v = BI.isArray(v) ? v : [v];
            BI.each(this.buttons, function (val, item) {
                if (!BI.isFunction(item.setSelected)) {
                    item.setNotSelectedValue(v);
                    return;
                }
                if (v.contains(val)) {
                    item.setSelected && item.setSelected(false);
                } else {
                    item.setSelected && item.setSelected(true);
                }
            });
        },

        populate: function (items) {
            var self = this;
            var args = [].slice.call(arguments);
            var linkHashMap = new BI.LinkHashMap();
            var val = function (item) {
                return item.id || item.value;
            };
            if (!this.buttons) {
                this.buttons = {};
            }
            // 所有已存在的和新添加的
            var willCreated = [];
            BI.each(items, function (i, item) {
                item = BI.stripEL(item);
                if (self.buttons[val(item)]) {
                    var ob = self.buttons[val(item)];
                    args[0] = item.items;
                    args[2] = item;
                    ob.populate && ob.populate.apply(ob, args);
                } else {
                    willCreated.push(item);
                }
            });
            // 创建新元素
            args[0] = willCreated;
            var newBtns = this._btnsCreator.apply(this, args);

            // 整理
            var array = [];
            BI.each(items, function (i, item) {
                item = BI.stripEL(item);
                var button = self.buttons[val(item)] || newBtns[val(item)];
                linkHashMap.add(val(item), button);
                array.push(button);
            });
            this.buttons = linkHashMap.map;

            BI.DOM.hang(this.buttons);
            this.element.empty();

            var packages = this._packageItems(items, this._packageBtns(array));
            BI.createWidget(BI.extend({element: this}, this._packageLayout(packages)));
        },

        getIndexByValue: function () {
            throw new Error("Can not use getIndexByValue");
        }
    });
    BI.shortcut("bi.filter_list", FilterList);
}());!(function () {
    var Model = BI.inherit(Fix.Model, {

        state: function () {
            return {

            };
        },

        computed: {

        },

        actions: {
            addCondition: function () {

            },

            addAndCondition: function () {

            },

            addOrCondition: function () {

            },

            addFormula: function () {

            },

            addAndFormula: function () {

            },

            addOrFormula: function () {

            }
        }
    });
    BI.model("bi.model.material.filter", Model);
})();/**
 * 过滤条件
 *
 * Created by GUY on 2015/9/25.
 * @class BI.FilterOperation
 * @extend BI.Widget
 */
!(function () {
    var OPERATION_ADD_CONDITION = 0, OPERATION_ADD_ANDOR_CONDITION = 1;
    var FilterOperation = BI.inherit(BI.Widget, {
        _defaultConfig: function () {
            return BI.extend(FilterOperation.superclass._defaultConfig.apply(this, arguments), {
                constants: {
                    FORMULA_COMBO: [{
                        text: BI.i18nText("BI-Conf_Formula_And"),
                        value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND
                    }, {
                        text: BI.i18nText("BI-Conf_Formula_Or"),
                        value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR
                    }],
                    CONDITION_COMBO: [{
                        text: BI.i18nText("BI-Conf_Condition_And"),
                        value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND
                    }, {
                        text: BI.i18nText("BI-Conf_Condition_Or"),
                        value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR
                    }]
                }
            });
        },

        props: {
            baseCls: "bi-filter-operation",
            expander: {},
            items: [],
            selections: [BI.AbstractFilterItem.FILTER_OPERATION_CONDITION, BI.AbstractFilterItem.FILTER_OPERATION_FORMULA],
            itemsCreator: BI.emptyFn
        },

        _store: function () {
            return BI.Models.getModel("bi.model.material.filter_operation");
        },

        render: function () {
            var self = this, o = this.options;
            this.currentSelected = null;

            return {
                type: "bi.vtape",
                items: [{
                    el: {
                        type: "bi.tab",
                        showIndex: OPERATION_ADD_CONDITION,
                        cardCreator: BI.bind(this._createTabs, this),
                        ref: function (_ref) {
                            self.buttonComboTab = _ref;
                        }
                    },
                    height: 40
                }, {
                    el: {
                        type: "bi.absolute",
                        scrollable: true,
                        items: [{
                            el: {
                                type: "bi.left",
                                items: [{
                                    type: "bi.filter_pane",
                                    expander: o.expander,
                                    items: o.items,
                                    itemsCreator: o.itemsCreator,
                                    listeners: [{
                                        eventName: "EVENT_CHANGE",
                                        action: function (type, value, obj) {
                                            if (type === BI.Events.CLICK) {
                                                if (BI.isNotNull(self.currentSelected) && self.currentSelected === obj) {
                                                    self.store.setSelectedCondition(!obj.isSelectedCondition());
                                                    obj.setSelectedCondition(!obj.isSelectedCondition());
                                                } else {
                                                    if (BI.isNotNull(self.currentSelected)) {
                                                        self.store.setSelectedCondition(false);
                                                        self.currentSelected.setSelectedCondition(false);
                                                    }
                                                    self.currentSelected = obj;
                                                    self.store.setSelectedCondition(true);
                                                    obj.setSelectedCondition(true);
                                                }
                                                if (self.currentSelected.isSelectedCondition()) {
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_ANDOR_CONDITION);
                                                } else {
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
                                                }
                                            }
                                            if (type === BI.Events.DESTROY) {
                                                if (self.currentSelected === obj) {
                                                    self.currentSelected = null;
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
                                                }
                                                self.fireEvent("BI.FilterOperation.EVENT_DESTROY_ITEM", value, obj);
                                            }
                                        }
                                    }],
                                    ref: function (_ref) {
                                        self.filter = _ref;
                                    }
                                }]
                            },
                            top: 0,
                            right: 2,
                            bottom: 0,
                            left: 0
                        }]
                    }
                }]
            };
        },

        _createTabs: function (v) {
            var self = this;
            switch (v) {
                case OPERATION_ADD_CONDITION:
                    return {
                        type: "bi.button_group",
                        items: BI.createItems(self._createButtons(), {
                            type: "bi.icon_text_item",
                            height: 30,
                            iconWrapperWidth: 16,
                            textLgap: 10,
                            width: 120
                        }),
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                        layouts: [{
                            type: "bi.left",
                            vgap: 5
                        }],
                        listeners: [{
                            eventName: BI.ButtonGroup.EVENT_CHANGE,
                            action: function (value, obj) {
                                if (BI.isEmptyArray(self.filter.getValue())) {
                                    self.filter.element.addClass("bi-border-top bi-border-right");
                                }
                                self.fireEvent("EVENT_OPERATION", obj.getValue());
                                self.defaultState();
                            }
                        }]
                    };
                case OPERATION_ADD_ANDOR_CONDITION:
                    return {
                        type: "bi.button_group",
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                        items: self._buildOperationButton(),
                        layouts: [{
                            type: "bi.left",
                            vgap: 5
                        }]
                    };
            }
        },

        _createButtons: function () {
            var buttons = [];
            BI.each(this.options.selections, function (i, type) {
                switch (type) {
                    case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                        buttons.push({
                            text: BI.i18nText("BI-Conf_Add_Formula"),
                            value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA,
                            cls: "operation-trigger filter-formula-font"
                        });
                        break;
                    case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                        buttons.push({
                            text: BI.i18nText("BI-Conf_Add_Condition"),
                            value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION,
                            cls: "operation-trigger filter-condition-font"
                        });
                        break;
                }
            });
            return buttons;
        },

        _buildOperationButton: function () {
            var self = this, combos = [];
            BI.each(this.options.selections, function (i, type) {
                var text = "", cls = "", items = [];
                switch (type) {
                    case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                        text = BI.i18nText("BI-Conf_Add_Formula");
                        cls = "filter-formula-font";
                        items = self.options.constants.FORMULA_COMBO;
                        break;
                    case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                    default:
                        text = BI.i18nText("BI-Conf_Add_Condition");
                        cls = "filter-condition-font";
                        items = self.options.constants.CONDITION_COMBO;
                        break;
                }

                var trigger = BI.createWidget({
                    type: "bi.icon_text_icon_item",
                    iconCls1: "operation-trigger " + cls,
                    iconCls2: "pull-down-font",
                    leftIconWrapperWidth: 16,
                    text: text,
                    height: 30,
                    width: 120
                });
                combos.push({
                    type: "bi.combo",
                    el: trigger,
                    popup: {
                        el: {
                            type: "bi.button_group",
                            chooseType: BI.ButtonGroup.CHOOSE_TYPE_NONE,
                            items: BI.createItems(items, {
                                type: "bi.single_select_item",
                                height: 25
                            }),
                            layouts: [{
                                type: "bi.vertical"
                            }]
                        }
                    },
                    listeners: [{
                        eventName: BI.Combo.EVENT_CHANGE,
                        action: function (value, obj) {
                            if (BI.isEmptyArray(self.filter.getValue())) {
                                self.filter.element.addClass("bi-border-top bi-border-right");
                            }

                            switch (value) {
                                case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND:
                                case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR:
                                    trigger.setText(BI.i18nText("BI-Conf_Add_Condition"));
                                    break;
                                case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND:
                                case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR:
                                    trigger.setText(BI.i18nText("BI-Conf_Add_Formula"));
                                    break;
                                default:
                                    trigger.setText();
                            }
                            self.fireEvent("EVENT_OPERATION", obj.getValue());
                            self.defaultState();
                            this.hideView();
                        }
                    }]
                });
            });
            return combos;
        },

        defaultState: function () {
            if (BI.isNotNull(this.currentSelected)) {
                this.store.setSelectedCondition(false);
                this.currentSelected.setSelectedCondition(false);
            }
            this.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
        },

        getCurrentSelectItem: function () {
            if (BI.isNotNull(this.currentSelected) && this.currentSelected.isSelectedCondition()) {
                return this.currentSelected;
            }
        },

        populate: function (items) {
            this.filter.populate.apply(this.filter, arguments);
        },

        getValue: function () {
            return this.filter.getValue();
        }
    });
    BI.shortcut("bi.filter_operation", FilterOperation);
}());
!(function () {
    var Model = BI.inherit(Fix.Model, {

        state: function () {
            return {
                selectedCondition: false
            };
        },

        computed: {

        },

        actions: {
            setSelectedCondition: function (selected) {
                this.model.setSelectedCondition = selected;
            }
        }
    });
    BI.model("bi.model.material.filter_operation", Model);
})();/**
 * @class BI.FilterPane
 * @extend BI.Widget
 * 过滤面板
 */
!(function () {
    var FilterPane = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-filter-pane",
            expander: {},
            items: [],
            itemsCreator: BI.emptyFn
        },

        render: function () {
            var self = this, o = this.options;
            return {
                type: "bi.custom_tree",
                cls: BI.isNotEmptyArray(o.items) ? "bi-border-right bi-border-top" : "",
                expander: BI.extend({
                    type: "bi.filter_expander",
                    el: {},
                    popup: {
                        type: "bi.custom_tree"
                    }
                }, o.expander),
                el: {
                    type: "bi.filter_list",
                    cls: "filter-list-pane",
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                    layouts: [{
                        type: "bi.vertical",
                        scrolly: false
                    }]
                },
                items: o.items,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent("EVENT_CHANGE", arguments);
                    }
                }],
                ref: function (_ref) {
                    self.tree = _ref;
                }
            };
        },

        populate: function (items) {
            if (BI.isNotEmptyArray(items)) {
                this.element.addClass("bi-border-right bi-border-top");
            } else {
                this.element.removeClass("bi-border-right bi-border-top");
            }
            this.tree.populate.apply(this.tree, arguments);
        },

        getValue: function () {
            return this.tree.getValue();
        }
    });
    BI.shortcut("bi.filter_pane", FilterPane);
}());
/**
 * 预览表列
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTableCell
 * @extends BI.Widget
 */
BI.WarningLabel = BI.inherit(BI.Single, {

    props: {
        baseCls: "bi-warning-label",
        textAlign: "center",
        whiteSpace: "nowrap", // normal  or  nowrap
        forceCenter: false, // 是否无论如何都要居中, 不考虑超出边界的情况, 在未知宽度和高度时有效
        textWidth: null,
        textHeight: null,
        hgap: 0,
        vgap: 0,
        lgap: 0,
        rgap: 0,
        tgap: 0,
        bgap: 0,
        text: ""
    },


    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.label",
            ref: function () {
                self.label = this;
            },
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace, // normal  or  nowrap
            forceCenter: o.forceCenter, // 是否无论如何都要居中, 不考虑超出边界的情况, 在未知宽度和高度时有效
            textWidth: o.textWidth,
            textHeight: o.textHeight,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap
        };
    },

    mounted: function () {
        var o = this.options;
        if(BI.isKey(o.text)) {
            this.setText(this._digest(o.text));
        }
    },

    _digest: function (text) {
        text = text || "";
        return text.replaceAll("\\$\\{(.*?)\\}", function (ori, str) {
            return "<span class='warning-label'>" + str + "</span>";
        });
    },

    setText: function (v) {
        this.options.text = v;
        this.label.text.text.element.html(this._digest(v));
    },

    getText: function () {
        return this.options.text;
    },

    setValue: function (v) {
        this.label.setValue(v);
    }
});
BI.shortcut("bi.warning_label", BI.WarningLabel);/**
 *
 * 原生表格滚动条，为了IE8的兼容
 *
 * Created by GUY on 2016/1/12.
 * @class BI.NativeTableScrollbar
 * @extends BI.Widget
 */
BI.NativeTableScrollbar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.NativeTableScrollbar.superclass._defaultConfig.apply(this, arguments), {
            attributes: {
                tabIndex: 0
            },
            contentSize: 0,
            defaultPosition: 0,
            position: 0,
            size: 0
        });
    },

    render: function () {
        var self = this, o = this.options;
        // 把滚动台size改掉
        this.element.width(36);

        var throttle = BI.throttle(function () {
            self.fireEvent(BI.NativeTableScrollbar.EVENT_SCROLL, self.element.scrollTop());
        }, 150, {leading: false});
        this.element.scroll(function () {
            throttle();
        });
        return {
            type: "bi.default",
            scrolly: true,
            items: [{
                type: "bi.layout",
                width: 1,
                ref: function (_ref) {
                    self.inner = _ref;
                }
            }]
        };
    },

    mounted: function () {
        this._populate();
    },

    _populate: function () {
        var self = this, o = this.options;
        if (o.size < 1 || o.contentSize <= o.size) {
            this.setVisible(false);
            return;
        }
        this.setVisible(true);
        try {
            this.element.scrollTop(o.position);
        } catch (e) {

        }
        this.inner.element.height(o.contentSize);
    },

    setContentSize: function (contentSize) {
        this.options.contentSize = contentSize;
    },

    setPosition: function (position) {
        this.options.position = position;
    },

    setSize: function (size) {
        this.setHeight(size);
        this.options.size = size;
    },

    populate: function () {
        this._populate();
    }
});
BI.NativeTableScrollbar.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.native_table_scrollbar", BI.NativeTableScrollbar);


BI.NativeTableHorizontalScrollbar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.NativeTableHorizontalScrollbar.superclass._defaultConfig.apply(this, arguments), {
            attributes: {
                tabIndex: 0
            },
            contentSize: 0,
            position: 0,
            size: 0
        });
    },

    render: function () {
        var self = this, o = this.options;
        // 把滚动台size改掉
        this.element.height(36);

        var throttle = BI.throttle(function () {
            self.fireEvent(BI.NativeTableScrollbar.EVENT_SCROLL, self.element.scrollLeft());
        }, 150, {leading: false});
        this.element.scroll(function () {
            throttle();
        });
        return {
            type: "bi.default",
            scrollx: true,
            items: [{
                type: "bi.layout",
                height: 1,
                ref: function (_ref) {
                    self.inner = _ref;
                }
            }]
        };
    },

    setContentSize: function (contentSize) {
        this.options.contentSize = contentSize;
    },

    setPosition: function (position) {
        this.options.position = position;
    },

    setSize: function (size) {
        this.setWidth(size);
        this.options.size = size;
    },

    _populate: function () {
        var self = this, o = this.options;
        if (o.size < 1 || o.contentSize <= o.size) {
            this.setVisible(false);
            return;
        }
        this.setVisible(true);
        try {
            this.element.scrollLeft(o.position);
        } catch (e) {

        }
        this.inner.element.width(o.contentSize);
    },

    populate: function () {
        this._populate();
    }
});
BI.NativeTableHorizontalScrollbar.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.native_table_horizontal_scrollbar", BI.NativeTableHorizontalScrollbar);/**
 *
 * 表格
 *
 * Created by GUY on 2015/9/22.
 * @class BI.TableCell
 * @extends BI.Single
 */
BI.TableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-cell",
            textAlign: "left",
            text: ""
        });
    },

    _init: function () {
        BI.TableCell.superclass._init.apply(this, arguments);
        var o = this.options;
        BI.createWidget({
            type: "bi.label",
            element: this,
            whiteSpace: o.whiteSpace || "nowrap",
            textAlign: this.options.textAlign,
            height: this.options.height,
            text: this.options.text,
            value: this.options.value,
            lgap: o.lgap,
            rgap: o.rgap,
            hgap: o.hgap || 5
        });
    }
});

BI.shortcut("bi.table_cell", BI.TableCell);/**
 *
 * 表格单元格
 *
 * Created by GUY on 2016/1/12.
 * @class BI.CollectionTableCell
 * @extends BI.Widget
 */
BI.CollectionTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CollectionTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-collection-table-cell bi-border-right bi-border-bottom",
            width: 0,
            height: 0,
            _left: 0,
            _top: 0,
            cell: {}
        });
    },

    _init: function () {
        BI.CollectionTableCell.superclass._init.apply(this, arguments);
        var o = this.options;
        this.cell = BI.createWidget(BI.extend({
            type: "bi.label"
        }, o.cell, {
            cls: (o.cell.cls || "") + " collection-table-cell-wrapper",
            width: o.width - (o._left === 0 ? 1 : 0) - 1,
            height: o.height - (o._top === 0 ? 1 : 0) - 1
        }));
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.cell,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    setWidth: function (width) {
        BI.CollectionTableCell.superclass.setWidth.apply(this, arguments);
        var o = this.options;
        this.cell.setWidth(o.width - (o._left === 0 ? 1 : 0) - 1);
    },

    setHeight: function (height) {
        BI.CollectionTableCell.superclass.setHeight.apply(this, arguments);
        var o = this.options;
        this.cell.setHeight(o.height - (o._top === 0 ? 1 : 0) - 1);
    }
});

BI.shortcut("bi.collection_table_cell", BI.CollectionTableCell);/**
 * CollectionTable
 *
 * Created by GUY on 2016/1/12.
 * @class BI.CollectionTable
 * @extends BI.Widget
 */
BI.CollectionTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CollectionTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-collection-table",
            headerRowSize: 25,
            rowSize: 25,
            columnSize: [],
            isNeedFreeze: false,
            freezeCols: [],
            isNeedMerge: false,
            mergeCols: [],
            mergeRule: BI.emptyFn,
            header: [],
            items: [],
            regionColumnSize: []
        });
    },

    render: function () {
        var self = this, o = this.options;
        this._width = 0;
        this._height = 0;
        this._scrollBarSize = BI.DOM.getScrollWidth();
        this.topLeftCollection = BI.createWidget({
            type: "bi.collection_view",
            cellSizeAndPositionGetter: function (index) {
                return self.topLeftItems[index];
            }
        });
        this.topLeftCollection.on(BI.CollectionView.EVENT_SCROLL, function (scroll) {
            self.bottomLeftCollection.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.topRightCollection = BI.createWidget({
            type: "bi.collection_view",
            cellSizeAndPositionGetter: function (index) {
                return self.topRightItems[index];
            }
        });
        this.topRightCollection.on(BI.CollectionView.EVENT_SCROLL, function (scroll) {
            self.bottomRightCollection.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.bottomLeftCollection = BI.createWidget({
            type: "bi.collection_view",
            cellSizeAndPositionGetter: function (index) {
                return self.bottomLeftItems[index];
            }
        });
        this.bottomLeftCollection.on(BI.CollectionView.EVENT_SCROLL, function (scroll) {
            self.bottomRightCollection.setScrollTop(scroll.scrollTop);
            self.topLeftCollection.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.bottomRightCollection = BI.createWidget({
            type: "bi.collection_view",
            cellSizeAndPositionGetter: function (index) {
                return self.bottomRightItems[index];
            }
        });
        this.bottomRightCollection.on(BI.CollectionView.EVENT_SCROLL, function (scroll) {
            self.bottomLeftCollection.setScrollTop(scroll.scrollTop);
            self.topRightCollection.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.topLeft = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.topLeftCollection]
        });
        this.topRight = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.topRightCollection]
        });
        this.bottomLeft = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.bottomLeftCollection]
        });
        this.bottomRight = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.bottomRightCollection]
        });
        this.contextLayout = BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.topLeft,
                top: 0,
                left: 0
            }, {
                el: this.topRight,
                top: 0
            }, {
                el: this.bottomLeft,
                left: 0
            }, {
                el: this.bottomRight
            }]
        });

        this.topScrollbar = BI.createWidget({
            type: "bi.grid_table_scrollbar",
            width: BI.GridTableScrollbar.SIZE
        });
        this.topScrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function (scrollTop) {
            self.bottomLeftCollection.setScrollTop(scrollTop);
            self.bottomRightCollection.setScrollTop(scrollTop);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.leftScrollbar = BI.createWidget({
            type: "bi.grid_table_horizontal_scrollbar",
            height: BI.GridTableScrollbar.SIZE
        });
        this.leftScrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function (scrollLeft) {
            self.topLeftCollection.setScrollLeft(scrollLeft);
            self.bottomLeftCollection.setScrollLeft(scrollLeft);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.rightScrollbar = BI.createWidget({
            type: "bi.grid_table_horizontal_scrollbar",
            height: BI.GridTableScrollbar.SIZE
        });
        this.rightScrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function (scrollLeft) {
            self.topRightCollection.setScrollLeft(scrollLeft);
            self.bottomRightCollection.setScrollLeft(scrollLeft);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.scrollBarLayout = BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.topScrollbar,
                right: 0,
                top: 0
            }, {
                el: this.leftScrollbar,
                left: 0
            }, {
                el: this.rightScrollbar
            }]
        });
        this._width = o.width - BI.GridTableScrollbar.SIZE;
        this._height = o.height - BI.GridTableScrollbar.SIZE;
    },

    mounted: function () {
        var o = this.options;
        if (o.items.length > 0 || o.header.length > 0) {
            this._digest();
            this._populate();
        }
    },

    _getFreezeColLength: function () {
        var o = this.options;
        return o.isNeedFreeze === true ? BI.clamp(o.freezeCols.length, 0, o.columnSize.length) : 0;
    },

    _getFreezeHeaderHeight: function () {
        var o = this.options;
        if (o.header.length * o.headerRowSize >= this._height) {
            return 0;
        }
        return o.header.length * o.headerRowSize;
    },

    _getActualItems: function () {
        var o = this.options;
        if (o.header.length * o.headerRowSize >= this._height) {
            return o.header.concat(o.items);
        }
        return o.items;
    },

    _populateScrollbar: function () {
        var o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0,
            summaryColumnSizeArray = [];
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });
        this.topScrollbar.setContentSize(this._getActualItems().length * o.rowSize);
        this.topScrollbar.setSize(this._height - this._getFreezeHeaderHeight());
        this.topScrollbar.setPosition(this.bottomRightCollection.getScrollTop());
        this.topScrollbar.populate();

        this.leftScrollbar.setContentSize(totalLeftColumnSize);
        this.leftScrollbar.setSize(regionSize);
        this.leftScrollbar.setPosition(this.bottomLeftCollection.getScrollLeft());
        this.leftScrollbar.populate();

        this.rightScrollbar.setContentSize(totalRightColumnSize);
        this.rightScrollbar.setSize(this._width - regionSize);
        this.rightScrollbar.setPosition(this.bottomRightCollection.getScrollLeft());
        this.rightScrollbar.populate();

        var items = this.scrollBarLayout.attr("items");
        items[0].top = this._getFreezeHeaderHeight();
        items[1].top = this._height;
        items[2].top = this._height;
        items[2].left = regionSize;
        this.scrollBarLayout.attr("items", items);
        this.scrollBarLayout.resize();
    },

    _populateTable: function () {
        var self = this, o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0,
            summaryColumnSizeArray = [];
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });

        var otlw = regionSize;
        var otlh = this._getFreezeHeaderHeight();
        var otrw = this._width - regionSize;
        var otrh = this._getFreezeHeaderHeight();
        var oblw = regionSize;
        var oblh = this._height - otlh;
        var obrw = this._width - regionSize;
        var obrh = this._height - otrh;

        var tlw = otlw + this._scrollBarSize;
        var tlh = otlh + this._scrollBarSize;
        var trw = otrw + this._scrollBarSize;
        var trh = otrh + this._scrollBarSize;
        var blw = oblw + this._scrollBarSize;
        var blh = oblh + this._scrollBarSize;
        var brw = obrw + this._scrollBarSize;
        var brh = obrh + this._scrollBarSize;

        var digest = function (el) {
            el.element.css({
                overflow: "scroll",
                overflowX: "scroll",
                overflowY: "scroll"
            });
        };

        this.topLeft.setWidth(otlw);
        this.topLeft.setHeight(otlh);
        this.topRight.setWidth(otrw);
        this.topRight.setHeight(otrh);
        this.bottomLeft.setWidth(oblw);
        this.bottomLeft.setHeight(oblh);
        this.bottomRight.setWidth(obrw);
        this.bottomRight.setHeight(obrh);

        this.topLeftCollection.setWidth(tlw);
        this.topLeftCollection.setHeight(tlh);
        this.topRightCollection.setWidth(trw);
        this.topRightCollection.setHeight(trh);
        this.bottomLeftCollection.setWidth(blw);
        this.bottomLeftCollection.setHeight(blh);
        this.bottomRightCollection.setWidth(brw);
        this.bottomRightCollection.setHeight(brh);

        digest(this.topLeftCollection);
        digest(this.topRightCollection);
        digest(this.bottomLeftCollection);
        digest(this.bottomRightCollection);

        var items = this.contextLayout.attr("items");
        items[1].left = regionSize;
        items[2].top = this._getFreezeHeaderHeight();
        items[3].left = regionSize;
        items[3].top = this._getFreezeHeaderHeight();
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();

        var leftHeader = [], rightHeader = [], leftItems = [], rightItems = [];
        var run = function (positions, items, rendered) {
            BI.each(positions, function (i, item) {
                var cell = {
                    type: "bi.collection_table_cell",
                    cell: items[item.row][item.col]
                };
                rendered.push(cell);
            });
        };
        run(this.topLeftItems, o.header, leftHeader);
        run(this.topRightItems, o.header, rightHeader);
        run(this.bottomLeftItems, this._getActualItems(), leftItems);
        run(this.bottomRightItems, this._getActualItems(), rightItems);

        this.topLeftCollection._populate(leftHeader);
        this.topRightCollection._populate(rightHeader);
        this.bottomLeftCollection._populate(leftItems);
        this.bottomRightCollection._populate(rightItems);
    },

    _digest: function () {
        var o = this.options;
        var freezeColLength = this._getFreezeColLength();
        // 如果表头位置不够，取消表头冻结
        if (this._getFreezeHeaderHeight() <= 0) {
            this.topLeftItems = [];
            this.topRightItems = [];
            this.bottomLeftItems = this._serialize(this._getActualItems(), 0, freezeColLength, o.rowSize, o.columnSize, o.mergeCols, BI.range(o.header.length));
            this.bottomRightItems = this._serialize(this._getActualItems(), freezeColLength, o.columnSize.length, o.rowSize, o.columnSize, o.mergeCols, BI.range(o.header.length));
        } else {
            this.topLeftItems = this._serialize(o.header, 0, freezeColLength, o.headerRowSize, o.columnSize, o.mergeCols);
            this.topRightItems = this._serialize(o.header, freezeColLength, o.columnSize.length, o.headerRowSize, o.columnSize, true);
            this.bottomLeftItems = this._serialize(o.items, 0, freezeColLength, o.rowSize, o.columnSize, o.mergeCols);
            this.bottomRightItems = this._serialize(o.items, freezeColLength, o.columnSize.length, o.rowSize, o.columnSize, o.mergeCols);
        }
    },

    _serialize: function (items, startCol, endCol, rowHeight, columnSize, mergeCols, mergeRows) {
        mergeCols = mergeCols || [];
        mergeRows = mergeRows || [];
        var self = this, o = this.options;
        var result = [], cache = {}, preCol = {}, preRow = {}, map = {};
        var summaryColumnSize = [];
        for (var i = startCol; i < endCol; i++) {
            if (i === startCol) {
                summaryColumnSize[i] = columnSize[i];
            } else {
                summaryColumnSize[i] = summaryColumnSize[i - 1] + columnSize[i];
            }
        }
        var mergeRow = function (i, j) {
            preCol[j]._height += rowHeight;
            preCol[j].__mergeRows.push(i);
        };

        var mergeCol = function (i, j) {
            preRow[i]._width += columnSize[j];
            preRow[i].__mergeCols.push(j);
        };

        var createOneEl = function (r, c) {
            var width = columnSize[c];
            var height = rowHeight;
            map[r][c]._row = r;
            map[r][c]._col = c;
            map[r][c]._width = width;
            map[r][c]._height = height;
            preCol[c] = map[r][c];
            preCol[c].__mergeRows = [r];
            preRow[r] = map[r][c];
            preRow[r].__mergeCols = [c];

            result.push({
                x: summaryColumnSize[c] - columnSize[c],
                y: +r * rowHeight,
                item: map[r][c]
            });
        };

        BI.each(items, function (i, cols) {
            for (var j = startCol; j < endCol; j++) {
                if (!cache[i]) {
                    cache[i] = {};
                }
                if (!map[i]) {
                    map[i] = {};
                }
                cache[i][j] = cols[j];
                map[i][j] = {};
                if (mergeCols === true || mergeCols.indexOf(j) > -1 || mergeRows === true || mergeRows.indexOf(i) > -1) {
                    if (i === 0 && j === startCol) {
                        createOneEl(0, startCol);
                    } else if (j === startCol && i > 0) {
                        var isNeedMergeRow = o.mergeRule(cache[i][j], cache[i - 1][j]);
                        if (isNeedMergeRow === true) {
                            mergeRow(i, j);
                            preRow[i] = preCol[j];
                        } else {
                            createOneEl(i, j);
                        }
                    } else if (i === 0 && j > startCol) {
                        var isNeedMergeCol = o.mergeRule(cache[i][j], cache[i][j - 1]);
                        if (isNeedMergeCol === true) {
                            mergeCol(i, j);
                            preCol[j] = preRow[i];
                        } else {
                            createOneEl(i, j);
                        }
                    } else {
                        var isNeedMergeRow = o.mergeRule(cache[i][j], cache[i - 1][j]);
                        var isNeedMergeCol = o.mergeRule(cache[i][j], cache[i][j - 1]);
                        if (isNeedMergeCol && isNeedMergeRow) {
                            continue;
                            // mergeRow(i, j);//优先合并列
                        }
                        if (isNeedMergeCol) {
                            mergeCol(i, j);
                        }
                        if (isNeedMergeRow) {
                            mergeRow(i, j);
                        }
                        if (!isNeedMergeCol && !isNeedMergeRow) {
                            createOneEl(i, j);
                        }
                    }
                } else {
                    createOneEl(i, j);
                }
            }
        });
        return BI.map(result, function (i, item) {
            return {
                x: item.x,
                y: item.y,
                row: item.item._row,
                col: item.item._col,
                width: item.item._width,
                height: item.item._height
            };
        });
    },

    _populate: function () {
        if (this._width <= 0 || this._height <= 0) {
            return;
        }
        if (this._isNeedDigest === true) {
            this._digest();
        }
        this._isNeedDigest = false;
        this._populateTable();
        this._populateScrollbar();
    },

    getRegionSize: function () {
        var o = this.options;
        var regionSize = o.regionColumnSize[0] || 0;
        if (o.isNeedFreeze === false || o.freezeCols.length === 0) {
            return 0;
        }
        if (!regionSize) {
            BI.each(o.freezeCols, function (i, col) {
                regionSize += o.columnSize[col];
            });
        }
        return regionSize;
    },

    setVerticalScroll: function (scrollTop) {
        this.bottomLeftCollection.setScrollTop(scrollTop);
        this.bottomRightCollection.setScrollTop(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.topLeftCollection.setScrollLeft(scrollLeft);
        this.bottomLeftCollection.setScrollLeft(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.topRightCollection.setScrollLeft(scrollLeft);
        this.bottomRightCollection.setScrollLeft(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.bottomRightCollection.getScrollTop();
    },

    getLeftHorizontalScroll: function () {
        return this.bottomLeftCollection.getScrollLeft();
    },

    getRightHorizontalScroll: function () {
        return this.bottomRightCollection.getScrollLeft();
    },

    setWidth: function (width) {
        BI.CollectionTable.superclass.setWidth.apply(this, arguments);
        this._width = this.options.width - BI.GridTableScrollbar.SIZE;
    },

    setHeight: function (height) {
        BI.CollectionTable.superclass.setHeight.apply(this, arguments);
        this._height = this.options.height - BI.GridTableScrollbar.SIZE;
    },

    setColumnSize: function (columnSize) {
        this._isNeedDigest = true;
        this.options.columnSize = columnSize;
    },

    setRegionColumnSize: function (regionColumnSize) {
        this._isNeedDigest = true;
        this.options.regionColumnSize = regionColumnSize;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    getRegionColumnSize: function () {
        return this.options.regionColumnSize;
    },

    populate: function (items, header) {
        if (items && items !== this.options.items) {
            this._isNeedDigest = true;
            this.options.items = items;
            this._restore();
        }
        if (header && header !== this.options.header) {
            this._isNeedDigest = true;
            this.options.header = header;
            this._restore();
        }
        this._populate();
    },

    _restore: function () {
        this.topLeftCollection.restore();
        this.topRightCollection.restore();
        this.bottomLeftCollection.restore();
        this.bottomRightCollection.restore();
    },

    restore: function () {
        this._restore();
    }
});
BI.shortcut("bi.collection_table", BI.CollectionTable);/**
 * QuickCollectionTable
 *
 * Created by GUY on 2016/1/12.
 * @class BI.QuickCollectionTable
 * @extends BI.CollectionTable
 */
BI.QuickCollectionTable = BI.inherit(BI.CollectionTable, {
    _defaultConfig: function () {
        return BI.extend(BI.QuickCollectionTable.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-quick-collection-table"
        });
    },

    render: function () {
        BI.QuickCollectionTable.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.topLeftCollection.setOverflowX(false);
        this.topLeftCollection.setOverflowY(false);
        this.topRightCollection.setOverflowX(false);
        this.topRightCollection.setOverflowY(false);
        this.bottomLeftCollection.setOverflowX(false);
        this.bottomLeftCollection.setOverflowY(false);
        this.bottomRightCollection.setOverflowX(false);
        this.bottomRightCollection.setOverflowY(false);
    },

    mounted: function () {
        BI.QuickCollectionTable.superclass.mounted.apply(this, arguments);
        var self = this;
        this._topLeftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelLeft, this),
            BI.bind(this._shouldHandleLeftX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._topRightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelRight, this),
            BI.bind(this._shouldHandleRightX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._bottomLeftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelLeft, this),
            BI.bind(this._shouldHandleLeftX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._bottomRightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelRight, this),
            BI.bind(this._shouldHandleRightX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this.topLeftCollection.element.mousewheel(function (e) {
            self._topLeftWheelHandler.onWheel(e.originalEvent);
        });
        this.topRightCollection.element.mousewheel(function (e) {
            self._topRightWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomLeftCollection.element.mousewheel(function (e) {
            self._bottomLeftWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomRightCollection.element.mousewheel(function (e) {
            self._bottomRightWheelHandler.onWheel(e.originalEvent);
        });
    },

    _shouldHandleLeftX: function (delta) {
        if (delta > 0) {
            return this.bottomLeftCollection.getScrollLeft() < this.bottomLeftCollection.getMaxScrollLeft();
        }
        return this.bottomLeftCollection.getScrollLeft() > 0;
        
    },

    _shouldHandleRightX: function (delta) {
        if (delta > 0) {
            return this.bottomRightCollection.getScrollLeft() < this.bottomRightCollection.getMaxScrollLeft();
        }
        return this.bottomRightCollection.getScrollLeft() > 0;
        
    },

    _shouldHandleY: function (delta) {
        if (delta > 0) {
            return this.bottomRightCollection.getScrollTop() < this.bottomRightCollection.getMaxScrollTop();
        }
        return this.bottomRightCollection.getScrollTop() > 0;
        
    },

    _onWheelLeft: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomLeftCollection.getScrollTop();
        var scrollLeft = this.bottomLeftCollection.getScrollLeft();
        scrollTop += deltaY;
        scrollLeft += deltaX;
        this.bottomLeftCollection.setScrollTop(scrollTop);
        this.bottomRightCollection.setScrollTop(scrollTop);
        this.topLeftCollection.setScrollLeft(scrollLeft);
        this.bottomLeftCollection.setScrollLeft(scrollLeft);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _onWheelRight: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomRightCollection.getScrollTop();
        var scrollLeft = this.bottomRightCollection.getScrollLeft();
        scrollTop += deltaY;
        scrollLeft += deltaX;
        this.bottomLeftCollection.setScrollTop(scrollTop);
        this.bottomRightCollection.setScrollTop(scrollTop);
        this.topRightCollection.setScrollLeft(scrollLeft);
        this.bottomRightCollection.setScrollLeft(scrollLeft);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _populateTable: function () {
        var self = this, o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0,
            summaryColumnSizeArray = [];
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });

        var otlw = regionSize;
        var otlh = this._getFreezeHeaderHeight();
        var otrw = this._width - regionSize;
        var otrh = this._getFreezeHeaderHeight();
        var oblw = regionSize;
        var oblh = this._height - otlh;
        var obrw = this._width - regionSize;
        var obrh = this._height - otrh;

        this.topLeft.setWidth(otlw);
        this.topLeft.setHeight(otlh);
        this.topRight.setWidth(otrw);
        this.topRight.setHeight(otrh);
        this.bottomLeft.setWidth(oblw);
        this.bottomLeft.setHeight(oblh);
        this.bottomRight.setWidth(obrw);
        this.bottomRight.setHeight(obrh);

        this.topLeftCollection.setWidth(otlw);
        this.topLeftCollection.setHeight(otlh);
        this.topRightCollection.setWidth(otrw);
        this.topRightCollection.setHeight(otrh);
        this.bottomLeftCollection.setWidth(oblw);
        this.bottomLeftCollection.setHeight(oblh);
        this.bottomRightCollection.setWidth(obrw);
        this.bottomRightCollection.setHeight(obrh);

        var items = this.contextLayout.attr("items");
        items[1].left = regionSize;
        items[2].top = this._getFreezeHeaderHeight();
        items[3].left = regionSize;
        items[3].top = this._getFreezeHeaderHeight();
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();

        var leftHeader = [], rightHeader = [], leftItems = [], rightItems = [];
        var run = function (positions, items, rendered) {
            BI.each(positions, function (i, item) {
                var cell = {
                    type: "bi.collection_table_cell",
                    cell: items[item.row][item.col]
                };
                rendered.push(cell);
            });
        };
        run(this.topLeftItems, o.header, leftHeader);
        run(this.topRightItems, o.header, rightHeader);
        run(this.bottomLeftItems, this._getActualItems(), leftItems);
        run(this.bottomRightItems, this._getActualItems(), rightItems);

        this.topLeftCollection.populate(leftHeader);
        this.topRightCollection.populate(rightHeader);
        this.bottomLeftCollection.populate(leftItems);
        this.bottomRightCollection.populate(rightItems);
    }
});
BI.shortcut("bi.quick_collection_table", BI.QuickCollectionTable);/**
 *
 * 表格单元格
 *
 * Created by GUY on 2016/1/12.
 * @class BI.GridTableCell
 * @extends BI.Widget
 */
BI.GridTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.GridTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-grid-table-cell  bi-border-right bi-border-bottom",
            width: 0,
            height: 0,
            _rowIndex: 0,
            _columnIndex: 0,
            _left: 0,
            _top: 0,
            cell: {}
        });
    },

    _init: function () {
        BI.GridTableCell.superclass._init.apply(this, arguments);
        var o = this.options;
        this.cell = BI.createWidget(BI.extend({
            type: "bi.label"
        }, o.cell, {
            cls: (o.cell.cls || "") + "grid-table-cell-wrapper",
            width: o.width - (o._columnIndex === 0 ? 1 : 0) - 1,
            height: o.height - (o._rowIndex === 0 ? 1 : 0) - 1
        }));
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.cell,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    setWidth: function (width) {
        BI.GridTableCell.superclass.setWidth.apply(this, arguments);
        var o = this.options;
        this.cell.setWidth(o.width - (o._columnIndex === 0 ? 1 : 0) - 1);
    },

    setHeight: function (height) {
        BI.GridTableCell.superclass.setHeight.apply(this, arguments);
        var o = this.options;
        this.cell.setHeight(o.height - (o._rowIndex === 0 ? 1 : 0) - 1);
    }
});

BI.shortcut("bi.grid_table_cell", BI.GridTableCell);/**
 * GridTable
 *
 * Created by GUY on 2016/1/12.
 * @class BI.GridTable
 * @extends BI.Widget
 */
BI.GridTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.GridTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-grid-table",
            headerRowSize: 25,
            rowSize: 25,
            columnSize: [],
            isNeedFreeze: false,
            freezeCols: [],
            header: [],
            items: [],
            regionColumnSize: []
        });
    },

    render: function () {
        var self = this, o = this.options;
        this._width = 0;
        this._height = 0;
        this._scrollBarSize = BI.DOM.getScrollWidth();
        var rowHeightGetter = function () {
            return o.rowSize;
        };
        var columnLeftWidthGetter = function (index) {
            return o.columnSize[index];
        };
        var columnRightWidthGetter = function (index) {
            return o.columnSize[index + self._getFreezeColLength()];
        };
        this.topLeftGrid = BI.createWidget({
            type: "bi.grid_view",
            rowHeightGetter: rowHeightGetter,
            columnWidthGetter: columnLeftWidthGetter
        });
        this.topLeftGrid.on(BI.GridView.EVENT_SCROLL, function (scroll) {
            self.bottomLeftGrid.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.topRightGrid = BI.createWidget({
            type: "bi.grid_view",
            rowHeightGetter: rowHeightGetter,
            columnWidthGetter: columnRightWidthGetter
        });
        this.topRightGrid.on(BI.GridView.EVENT_SCROLL, function (scroll) {
            self.bottomRightGrid.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.bottomLeftGrid = BI.createWidget({
            type: "bi.grid_view",
            rowHeightGetter: rowHeightGetter,
            columnWidthGetter: columnLeftWidthGetter
        });
        this.bottomLeftGrid.on(BI.GridView.EVENT_SCROLL, function (scroll) {
            self.bottomRightGrid.setScrollTop(scroll.scrollTop);
            self.topLeftGrid.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.bottomRightGrid = BI.createWidget({
            type: "bi.grid_view",
            rowHeightGetter: rowHeightGetter,
            columnWidthGetter: columnRightWidthGetter
        });
        this.bottomRightGrid.on(BI.GridView.EVENT_SCROLL, function (scroll) {
            self.bottomLeftGrid.setScrollTop(scroll.scrollTop);
            self.topRightGrid.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.topLeft = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.topLeftGrid]
        });
        this.topRight = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.topRightGrid]
        });
        this.bottomLeft = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.bottomLeftGrid]
        });
        this.bottomRight = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.bottomRightGrid]
        });
        this.contextLayout = BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.topLeft,
                top: 0,
                left: 0
            }, {
                el: this.topRight,
                top: 0
            }, {
                el: this.bottomLeft,
                left: 0
            }, {
                el: this.bottomRight
            }]
        });

        this.topScrollbar = BI.createWidget({
            type: "bi.grid_table_scrollbar",
            width: BI.GridTableScrollbar.SIZE
        });
        this.topScrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function (scrollTop) {
            self.bottomLeftGrid.setScrollTop(scrollTop);
            self.bottomRightGrid.setScrollTop(scrollTop);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.leftScrollbar = BI.createWidget({
            type: "bi.grid_table_horizontal_scrollbar",
            height: BI.GridTableScrollbar.SIZE
        });
        this.leftScrollbar.on(BI.GridTableHorizontalScrollbar.EVENT_SCROLL, function (scrollLeft) {
            self.topLeftGrid.setScrollLeft(scrollLeft);
            self.bottomLeftGrid.setScrollLeft(scrollLeft);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.rightScrollbar = BI.createWidget({
            type: "bi.grid_table_horizontal_scrollbar",
            height: BI.GridTableScrollbar.SIZE
        });
        this.rightScrollbar.on(BI.GridTableHorizontalScrollbar.EVENT_SCROLL, function (scrollLeft) {
            self.topRightGrid.setScrollLeft(scrollLeft);
            self.bottomRightGrid.setScrollLeft(scrollLeft);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.scrollBarLayout = BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.topScrollbar,
                right: 0,
                top: 0
            }, {
                el: this.leftScrollbar,
                left: 0
            }, {
                el: this.rightScrollbar
            }]
        });
        this._width = o.width - BI.GridTableScrollbar.SIZE;
        this._height = o.height - BI.GridTableScrollbar.SIZE;
        this.header = this._getHeader();
        this.items = this._getItems();
    },

    mounted: function () {
        var o = this.options;
        if (o.items.length > 0 || o.header.length > 0) {
            this._populate();
        }
    },

    _getFreezeColLength: function () {
        var o = this.options;
        return o.isNeedFreeze === true ? BI.clamp(o.freezeCols.length, 0, o.columnSize.length) : 0;
    },

    _getFreezeHeaderHeight: function () {
        var o = this.options;
        if (o.header.length * o.headerRowSize >= this._height) {
            return 0;
        }
        return o.header.length * o.headerRowSize;
    },

    _getActualItems: function () {
        var o = this.options;
        if (o.header.length * o.headerRowSize >= this._height) {
            return o.header.concat(o.items);
        }
        return o.items;
    },

    _populateScrollbar: function () {
        var o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0,
            summaryColumnSizeArray = [];
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });
        this.topScrollbar.setContentSize(this._getActualItems().length * o.rowSize);
        this.topScrollbar.setSize(this._height - this._getFreezeHeaderHeight());
        this.topScrollbar.setPosition(Math.min(this.bottomLeftGrid.getScrollTop(), this.bottomRightGrid.getScrollTop()));
        this.topScrollbar.populate();

        this.leftScrollbar.setContentSize(totalLeftColumnSize);
        this.leftScrollbar.setSize(regionSize);
        this.leftScrollbar.setPosition(this.bottomLeftGrid.getScrollLeft());
        this.leftScrollbar.populate();

        this.rightScrollbar.setContentSize(totalRightColumnSize);
        this.rightScrollbar.setSize(this._width - regionSize);
        this.rightScrollbar.setPosition(this.bottomRightGrid.getScrollLeft());
        this.rightScrollbar.populate();

        var items = this.scrollBarLayout.attr("items");
        items[0].top = this._getFreezeHeaderHeight();
        items[1].top = this._height;
        items[2].top = this._height;
        items[2].left = regionSize;
        this.scrollBarLayout.attr("items", items);
        this.scrollBarLayout.resize();
    },

    _getHeader: function () {
        var o = this.options;
        var freezeColLength = this._getFreezeColLength();
        var leftHeader = [], rightHeader = [];
        BI.each(o.header, function (i, cols) {
            leftHeader[i] = [];
            rightHeader[i] = [];
            BI.each(cols, function (j, col) {
                var cell = {
                    type: "bi.grid_table_cell",
                    cell: col
                };
                if (j < freezeColLength) {
                    leftHeader[i].push(cell);
                } else {
                    rightHeader[i].push(cell);
                }
            });
        });
        return [leftHeader, rightHeader];
    },

    _getItems: function () {
        var o = this.options;
        var freezeColLength = this._getFreezeColLength();
        var leftItems = [], rightItems = [];
        BI.each(this._getActualItems(), function (i, cols) {
            leftItems[i] = [];
            rightItems[i] = [];
            BI.each(cols, function (j, col) {
                var cell = {
                    type: "bi.grid_table_cell",
                    cell: col
                };
                if (j < freezeColLength) {
                    leftItems[i].push(cell);
                } else {
                    rightItems[i].push(cell);
                }
            });
        });
        return [leftItems, rightItems];
    },

    _populateTable: function () {
        var self = this, o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0,
            summaryColumnSizeArray = [];
        var freezeColLength = this._getFreezeColLength();
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });

        var otlw = regionSize;
        var otlh = this._getFreezeHeaderHeight();
        var otrw = this._width - regionSize;
        var otrh = this._getFreezeHeaderHeight();
        var oblw = regionSize;
        var oblh = this._height - otlh;
        var obrw = this._width - regionSize;
        var obrh = this._height - otrh;

        var tlw = otlw + this._scrollBarSize;
        var tlh = otlh + this._scrollBarSize;
        var trw = otrw + this._scrollBarSize;
        var trh = otrh + this._scrollBarSize;
        var blw = oblw + this._scrollBarSize;
        var blh = oblh + this._scrollBarSize;
        var brw = obrw + this._scrollBarSize;
        var brh = obrh + this._scrollBarSize;

        var digest = function (el) {
            el.element.css({
                overflow: "scroll",
                overflowX: "scroll",
                overflowY: "scroll"
            });
        };

        this.topLeft.setWidth(otlw);
        this.topLeft.setHeight(otlh);
        this.topRight.setWidth(otrw);
        this.topRight.setHeight(otrh);
        this.bottomLeft.setWidth(oblw);
        this.bottomLeft.setHeight(oblh);
        this.bottomRight.setWidth(obrw);
        this.bottomRight.setHeight(obrh);

        this.topLeftGrid.setWidth(tlw);
        this.topLeftGrid.setHeight(tlh);
        this.topRightGrid.setWidth(trw);
        this.topRightGrid.setHeight(trh);
        this.bottomLeftGrid.setWidth(blw);
        this.bottomLeftGrid.setHeight(blh);
        this.bottomRightGrid.setWidth(brw);
        this.bottomRightGrid.setHeight(brh);

        digest(this.topLeftGrid);
        digest(this.topRightGrid);
        digest(this.bottomLeftGrid);
        digest(this.bottomRightGrid);

        this.topLeftGrid.setEstimatedColumnSize(freezeColLength > 0 ? totalLeftColumnSize / freezeColLength : 0);
        this.topLeftGrid.setEstimatedRowSize(o.headerRowSize);
        this.topRightGrid.setEstimatedColumnSize((o.columnSize.length - freezeColLength) > 0 ? (totalRightColumnSize / (o.columnSize.length - freezeColLength)) : 0);
        this.topRightGrid.setEstimatedRowSize(o.headerRowSize);
        this.bottomLeftGrid.setEstimatedColumnSize(freezeColLength > 0 ? totalLeftColumnSize / freezeColLength : 0);
        this.bottomLeftGrid.setEstimatedRowSize(o.rowSize);
        this.bottomRightGrid.setEstimatedColumnSize((o.columnSize.length - freezeColLength) > 0 ? (totalRightColumnSize / (o.columnSize.length - freezeColLength)) : 0);
        this.bottomRightGrid.setEstimatedRowSize(o.rowSize);

        this.topLeftGrid.setColumnCount(freezeColLength);
        this.topRightGrid.setColumnCount(o.columnSize.length - freezeColLength);
        this.bottomLeftGrid.setColumnCount(freezeColLength);
        this.bottomRightGrid.setColumnCount(o.columnSize.length - freezeColLength);

        var items = this.contextLayout.attr("items");
        items[1].left = regionSize;
        items[2].top = this._getFreezeHeaderHeight();
        items[3].left = regionSize;
        items[3].top = this._getFreezeHeaderHeight();
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();

        this.topLeftGrid._populate(this.header[0]);
        this.topRightGrid._populate(this.header[1]);
        this.bottomLeftGrid._populate(this.items[0]);
        this.bottomRightGrid._populate(this.items[1]);
    },

    _populate: function () {
        if (this._width <= 0 || this._height <= 0) {
            return;
        }
        this._populateTable();
        this._populateScrollbar();
    },

    getRegionSize: function () {
        var o = this.options;
        var regionSize = o.regionColumnSize[0] || 0;
        if (o.isNeedFreeze === false || o.freezeCols.length === 0) {
            return 0;
        }
        if (!regionSize) {
            BI.each(o.freezeCols, function (i, col) {
                regionSize += o.columnSize[col];
            });
        }
        return regionSize;
    },

    setVerticalScroll: function (scrollTop) {
        this.bottomLeftGrid.setScrollTop(scrollTop);
        this.bottomRightGrid.setScrollTop(scrollTop);
        this._populateScrollbar();
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.topLeftGrid.setScrollLeft(scrollLeft);
        this.bottomLeftGrid.setScrollLeft(scrollLeft);
        this._populateScrollbar();
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.topRightGrid.setScrollLeft(scrollLeft);
        this.bottomRightGrid.setScrollLeft(scrollLeft);
        this._populateScrollbar();
    },

    getVerticalScroll: function () {
        return this.bottomRightGrid.getScrollTop();
    },

    getLeftHorizontalScroll: function () {
        return this.bottomLeftGrid.getScrollLeft();
    },

    getRightHorizontalScroll: function () {
        return this.bottomRightGrid.getScrollLeft();
    },

    setWidth: function (width) {
        BI.GridTable.superclass.setWidth.apply(this, arguments);
        this._width = this.options.width - BI.GridTableScrollbar.SIZE;
    },

    setHeight: function (height) {
        BI.GridTable.superclass.setHeight.apply(this, arguments);
        this._height = this.options.height - BI.GridTableScrollbar.SIZE;
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this._isNeedDigest = true;
    },

    setRegionColumnSize: function (regionColumnSize) {
        this.options.regionColumnSize = regionColumnSize;
        this._isNeedDigest = true;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    getRegionColumnSize: function () {
        return this.options.regionColumnSize;
    },

    populate: function (items, header) {
        var headerChanged = this.options.header !== header;
        var itemsChanged = this.options.items !== items;
        if(header && headerChanged) {
            this.options.header = header;
        }
        if(items && itemsChanged) {
            this.options.items = items;
        }
        if (items && itemsChanged) {
            this.items = this._getItems();
            this._restore();
        }
        if (header && headerChanged) {
            this.header = this._getHeader();
            this._restore();
        }
        this._populate();
    },

    _restore: function () {
        this.topLeftGrid.restore();
        this.topRightGrid.restore();
        this.bottomLeftGrid.restore();
        this.bottomRightGrid.restore();
    },

    restore: function () {
        this._restore();
    }
});
BI.shortcut("bi.grid_table", BI.GridTable);
/**
 * QuickGridTable
 *
 * Created by GUY on 2016/1/12.
 * @class BI.QuickGridTable
 * @extends BI.GridTable
 */
BI.QuickGridTable = BI.inherit(BI.GridTable, {
    _defaultConfig: function () {
        return BI.extend(BI.QuickGridTable.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-quick-grid-table"
        });
    },

    render: function () {
        BI.QuickGridTable.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.topLeftGrid.setOverflowX(false);
        this.topLeftGrid.setOverflowY(false);
        this.topRightGrid.setOverflowX(false);
        this.topRightGrid.setOverflowY(false);
        this.bottomLeftGrid.setOverflowX(false);
        this.bottomLeftGrid.setOverflowY(false);
        this.bottomRightGrid.setOverflowX(false);
        this.bottomRightGrid.setOverflowY(false);
    },

    mounted: function () {
        BI.QuickGridTable.superclass.mounted.apply(this, arguments);
        var self = this;
        this._topLeftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelLeft, this),
            BI.bind(this._shouldHandleLeftX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._topRightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelRight, this),
            BI.bind(this._shouldHandleRightX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._bottomLeftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelLeft, this),
            BI.bind(this._shouldHandleLeftX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._bottomRightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelRight, this),
            BI.bind(this._shouldHandleRightX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this.topLeftGrid.element.mousewheel(function (e) {
            self._topLeftWheelHandler.onWheel(e.originalEvent);
        });
        this.topRightGrid.element.mousewheel(function (e) {
            self._topRightWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomLeftGrid.element.mousewheel(function (e) {
            self._bottomLeftWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomRightGrid.element.mousewheel(function (e) {
            self._bottomRightWheelHandler.onWheel(e.originalEvent);
        });
    },

    _shouldHandleLeftX: function (delta) {
        if (delta > 0) {
            return this.bottomLeftGrid.getScrollLeft() < this.bottomLeftGrid.getMaxScrollLeft();
        }
        return this.bottomLeftGrid.getScrollLeft() > 0;
        
    },

    _shouldHandleRightX: function (delta) {
        if (delta > 0) {
            return this.bottomRightGrid.getScrollLeft() < this.bottomRightGrid.getMaxScrollLeft();
        }
        return this.bottomRightGrid.getScrollLeft() > 0;
        
    },

    _shouldHandleY: function (delta) {
        if (delta > 0) {
            return this.bottomRightGrid.getScrollTop() < this.bottomRightGrid.getMaxScrollTop();
        }
        return this.bottomRightGrid.getScrollTop() > 0;
        
    },

    _onWheelLeft: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomLeftGrid.getScrollTop();
        var scrollLeft = this.bottomLeftGrid.getScrollLeft();
        scrollTop += deltaY;
        scrollLeft += deltaX;
        this.bottomLeftGrid.setScrollTop(scrollTop);
        this.bottomRightGrid.setScrollTop(scrollTop);
        this.topLeftGrid.setScrollLeft(scrollLeft);
        this.bottomLeftGrid.setScrollLeft(scrollLeft);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _onWheelRight: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomRightGrid.getScrollTop();
        var scrollLeft = this.bottomRightGrid.getScrollLeft();
        scrollTop += deltaY;
        scrollLeft += deltaX;
        this.bottomLeftGrid.setScrollTop(scrollTop);
        this.bottomRightGrid.setScrollTop(scrollTop);
        this.topRightGrid.setScrollLeft(scrollLeft);
        this.bottomRightGrid.setScrollLeft(scrollLeft);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _populateTable: function () {
        var self = this, o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0,
            summaryColumnSizeArray = [];
        var freezeColLength = this._getFreezeColLength();
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });

        var otlw = regionSize;
        var otlh = this._getFreezeHeaderHeight();
        var otrw = this._width - regionSize;
        var otrh = this._getFreezeHeaderHeight();
        var oblw = regionSize;
        var oblh = this._height - otlh;
        var obrw = this._width - regionSize;
        var obrh = this._height - otrh;

        this.topLeft.setWidth(otlw);
        this.topLeft.setHeight(otlh);
        this.topRight.setWidth(otrw);
        this.topRight.setHeight(otrh);
        this.bottomLeft.setWidth(oblw);
        this.bottomLeft.setHeight(oblh);
        this.bottomRight.setWidth(obrw);
        this.bottomRight.setHeight(obrh);

        this.topLeftGrid.setWidth(otlw);
        this.topLeftGrid.setHeight(otlh);
        this.topRightGrid.setWidth(otrw);
        this.topRightGrid.setHeight(otrh);
        this.bottomLeftGrid.setWidth(oblw);
        this.bottomLeftGrid.setHeight(oblh);
        this.bottomRightGrid.setWidth(obrw);
        this.bottomRightGrid.setHeight(obrh);

        this.topLeftGrid.setEstimatedColumnSize(freezeColLength > 0 ? totalLeftColumnSize / freezeColLength : 0);
        this.topLeftGrid.setEstimatedRowSize(o.headerRowSize);
        this.topRightGrid.setEstimatedColumnSize((o.columnSize.length - freezeColLength) > 0 ? (totalRightColumnSize / (o.columnSize.length - freezeColLength)) : 0);
        this.topRightGrid.setEstimatedRowSize(o.headerRowSize);
        this.bottomLeftGrid.setEstimatedColumnSize(freezeColLength > 0 ? totalLeftColumnSize / freezeColLength : 0);
        this.bottomLeftGrid.setEstimatedRowSize(o.rowSize);
        this.bottomRightGrid.setEstimatedColumnSize((o.columnSize.length - freezeColLength) > 0 ? (totalRightColumnSize / (o.columnSize.length - freezeColLength)) : 0);
        this.bottomRightGrid.setEstimatedRowSize(o.rowSize);

        this.topLeftGrid.setColumnCount(freezeColLength);
        this.topRightGrid.setColumnCount(o.columnSize.length - freezeColLength);
        this.bottomLeftGrid.setColumnCount(freezeColLength);
        this.bottomRightGrid.setColumnCount(o.columnSize.length - freezeColLength);

        var items = this.contextLayout.attr("items");
        items[1].left = regionSize;
        items[2].top = this._getFreezeHeaderHeight();
        items[3].left = regionSize;
        items[3].top = this._getFreezeHeaderHeight();
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();

        var leftHeader = [], rightHeader = [], leftItems = [], rightItems = [];
        BI.each(o.header, function (i, cols) {
            leftHeader[i] = [];
            rightHeader[i] = [];
            BI.each(cols, function (j, col) {
                var cell = {
                    type: "bi.grid_table_cell",
                    cell: col
                };
                if (j < freezeColLength) {
                    leftHeader[i].push(cell);
                } else {
                    rightHeader[i].push(cell);
                }
            });
        });
        BI.each(this._getActualItems(), function (i, cols) {
            leftItems[i] = [];
            rightItems[i] = [];
            BI.each(cols, function (j, col) {
                var cell = {
                    type: "bi.grid_table_cell",
                    cell: col
                };
                if (j < freezeColLength) {
                    leftItems[i].push(cell);
                } else {
                    rightItems[i].push(cell);
                }
            });
        });

        this.topLeftGrid.populate(leftHeader);
        this.topRightGrid.populate(rightHeader);
        this.bottomLeftGrid.populate(leftItems);
        this.bottomRightGrid.populate(rightItems);
    }
});
BI.shortcut("bi.quick_grid_table", BI.QuickGridTable);/**
 *
 * 表格滚动条
 *
 * Created by GUY on 2016/1/12.
 * @class BI.GridTableScrollbar
 * @extends BI.Widget
 */
BI.GridTableScrollbar = BI.inherit(BI.Widget, {
    _const: {
        FACE_MARGIN: 4,
        FACE_MARGIN_2: 4 * 2,
        FACE_SIZE_MIN: 30,
        KEYBOARD_SCROLL_AMOUNT: 40
    },
    _defaultConfig: function () {
        return BI.extend(BI.GridTableScrollbar.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "scrollbar-layout-main public-scrollbar-main",
            attributes: {
                tabIndex: 0
            },
            contentSize: 0,
            defaultPosition: 0,
            isOpaque: false,
            orientation: "vertical",
            position: 0,
            size: 0
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.focused = false;
        this.isDragging = false;
        this.face = BI.createWidget({
            type: "bi.layout",
            cls: "scrollbar-layout-face public-scrollbar-face "
            + (this._isHorizontal() ? "scrollbar-layout-face-horizontal" : "scrollbar-layout-face-vertical")
        });
        this.contextLayout = BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.face,
                left: 0,
                top: 0
            }]
        });
    },

    mounted: function () {
        var self = this, o = this.options;
        var onWheel = o.orientation === "horizontal" ? this._onWheelX : this._onWheelY;
        this._wheelHandler = new BI.WheelHandler(
            BI.bind(onWheel, this),
            BI.bind(this._shouldHandleX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._mouseMoveTracker = new BI.MouseMoveTracker(
            BI.bind(this._onMouseMove, this),
            BI.bind(this._onMouseMoveEnd, this),
            _global.document
        );
        this.element.on("mousedown", BI.bind(this._onMouseDown, this));
        this.element.on("mousewheel", function (e) {
            self._wheelHandler.onWheel(e.originalEvent);
        });
        this.element.on("keydown", BI.bind(this._onKeyDown, this));
        this.element.on("focus", function () {
            self.focused = true;
            self._populate();
        });
        this.element.on("blur", function () {
            self.focused = false;
            self._populate();
        });
        if (this._isHorizontal()) {
            this.element.addClass("scrollbar-layout-main-horizontal");
        } else {
            this.element.addClass("scrollbar-layout-main-vertical");
        }
        this._populate();
    },

    _isHorizontal: function () {
        return this.options.orientation === "horizontal";
    },

    _getScale: function () {
        var o = this.options;
        var scale = o.size / o.contentSize;
        var faceSize = o.size * scale;

        if (faceSize < this._const.FACE_SIZE_MIN) {
            scale = (o.size - this._const.FACE_SIZE_MIN) / (o.contentSize - o.size);
        }
        return scale;
    },

    _getFaceSize: function () {
        var o = this.options;
        var scale = o.size / o.contentSize;
        var faceSize = o.size * scale;

        if (faceSize < this._const.FACE_SIZE_MIN) {
            faceSize = this._const.FACE_SIZE_MIN;
        }
        return faceSize;
    },

    _shouldHandleX: function (delta) {
        return this.options.orientation === "horizontal" ?
            this._shouldHandleChange(delta) :
            false;
    },

    _shouldHandleY: function (delta) {
        return this.options.orientation !== "horizontal" ?
            this._shouldHandleChange(delta) :
            false;
    },

    _shouldHandleChange: function (delta) {
        return this.options.position + delta !== this.options.position;
    },

    _onWheelY: function (deltaX, deltaY) {
        this._onWheel(deltaY);
    },

    _onWheelX: function (deltaX, deltaY) {
        this._onWheel(deltaX);
    },

    _onWheel: function (delta) {
        var maxPosition = this.options.contentSize - this.options.size;
        this.options.position += delta;
        if (this.options.position < 0) {
            this.options.position = 0;
        } else if (this.options.position > maxPosition) {
            this.options.position = maxPosition;
        }
        this._populate();
        this.fireEvent(BI.GridTableScrollbar.EVENT_SCROLL, this.options.position);
    },

    _onMouseDown: function (e) {
        if (e.target !== this.face.element[0]) {
            var position = this._isHorizontal() ? e.offsetX : e.offsetY;
            position /= this._getScale();
            this.options.position = BI.clamp(position - (this._getFaceSize() * 0.5 / this._getScale()), 0, this.options.contentSize - this.options.size);
            this._populate();
            this.fireEvent(BI.GridTableScrollbar.EVENT_SCROLL, this.options.position);
        } else {
            this._mouseMoveTracker.captureMouseMoves(e);
        }
        try {
            this.element[0].focus();
        } catch (e) {

        }
    },

    _onMouseMove: function (deltaX, deltaY) {
        var delta = this._isHorizontal() ? deltaX : deltaY;
        delta /= this._getScale();
        this.options.position = BI.clamp(this.options.position + delta, 0, this.options.contentSize - this.options.size);
        this.isDragging = this._mouseMoveTracker.isDragging();
        this._populate();
        this.fireEvent(BI.GridTableScrollbar.EVENT_SCROLL, this.options.position);
    },

    _onMouseMoveEnd: function (event) {
        this._mouseMoveTracker.releaseMouseMoves();
        if (this.isDragging === true) {
            this.isDragging = false;
            this._populate();
        }
    },

    _onKeyDown: function (event) {
        var Keys = {
            BACKSPACE: 8,
            TAB: 9,
            RETURN: 13,
            ALT: 18,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46,
            COMMA: 188,
            PERIOD: 190,
            A: 65,
            Z: 90,
            ZERO: 48,
            NUMPAD_0: 96,
            NUMPAD_9: 105
        };
        var keyCode = event.keyCode;

        if (keyCode === Keys.TAB) {
            return;
        }

        var distance = 40;
        var direction = 0;

        if (this._isHorizontal()) {
            switch (keyCode) {
                case Keys.HOME:
                    direction = -1;
                    distance = this.options.contentSize;
                    break;

                case Keys.LEFT:
                    direction = -1;
                    break;

                case Keys.RIGHT:
                    direction = 1;
                    break;

                default:
                    return;
            }
        }

        if (!this._isHorizontal()) {
            switch (keyCode) {
                case Keys.SPACE:
                    if (event.shiftKey) {
                        direction = -1;
                    } else {
                        direction = 1;
                    }
                    break;

                case Keys.HOME:
                    direction = -1;
                    distance = this.options.contentSize;
                    break;

                case Keys.UP:
                    direction = -1;
                    break;

                case Keys.DOWN:
                    direction = 1;
                    break;

                case Keys.PAGE_UP:
                    direction = -1;
                    distance = this.options.size;
                    break;

                case Keys.PAGE_DOWN:
                    direction = 1;
                    distance = this.options.size;
                    break;

                default:
                    return;
            }
        }

        this.options.position = BI.clamp(this.options.position + (distance * direction), 0, this.options.contentSize - this.options.size);
        event.preventDefault();
        this._populate();
        this.fireEvent(BI.GridTableScrollbar.EVENT_SCROLL, this.options.position);
    },

    _populate: function () {
        var self = this, o = this.options;
        if (o.size < 1 || o.contentSize <= o.size) {
            this.setVisible(false);
            return;
        }
        this.setVisible(true);

        var size = o.size;
        var isHorizontal = this._isHorizontal();
        var isActive = this.focused || this.isDragging;

        var faceSize = this._getFaceSize();
        var isOpaque = o.isOpaque;
        this.element[isOpaque === true ? "addClass" : "removeClass"]("public-scrollbar-main-opaque");
        this.element[isActive === true ? "addClass" : "removeClass"]("public-scrollbar-main-active");

        this.face.element[isActive === true ? "addClass" : "removeClass"]("public-scrollbar-face-active");

        var position = o.position * this._getScale() + this._const.FACE_MARGIN;

        var items = this.contextLayout.attr("items");
        if (isHorizontal) {
            this.setWidth(size);
            this.face.setWidth(faceSize - this._const.FACE_MARGIN_2);
            items[0].left = position;
            items[0].top = 0;
        } else {
            this.setHeight(size);
            this.face.setHeight(faceSize - this._const.FACE_MARGIN_2);
            items[0].left = 0;
            items[0].top = position;
        }
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();
    },

    setContentSize: function (contentSize) {
        this.options.contentSize = contentSize;
    },

    setPosition: function (position) {
        this.options.position = position;
    },

    setSize: function (size) {
        this.options.size = size;
    },

    populate: function () {
        this._populate();
    }
});
BI.GridTableScrollbar.SIZE = 10;
BI.GridTableScrollbar.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.grid_table_scrollbar", BI.GridTableScrollbar);


BI.GridTableHorizontalScrollbar = BI.inherit(BI.Widget, {
    _const: {
        FACE_MARGIN: 4,
        FACE_MARGIN_2: 4 * 2,
        FACE_SIZE_MIN: 30,
        KEYBOARD_SCROLL_AMOUNT: 40
    },
    _defaultConfig: function () {
        return BI.extend(BI.GridTableHorizontalScrollbar.superclass._defaultConfig.apply(this, arguments), {
            attributes: {
                tabIndex: 0
            },
            contentSize: 0,
            position: 0,
            size: 0
        });
    },

    _init: function () {
        BI.GridTableHorizontalScrollbar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.scrollbar = BI.createWidget({
            type: "bi.grid_table_scrollbar",
            orientation: "horizontal",
            isOpaque: true,
            position: o.position,
            contentSize: o.contentSize,
            size: o.size
        });
        this.scrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function () {
            self.fireEvent(BI.GridTableHorizontalScrollbar.EVENT_SCROLL, arguments);
        });
        BI.createWidget({
            type: "bi.absolute",
            cls: "horizontal-scrollbar",
            element: this,
            width: o.size,
            height: BI.GridTableScrollbar.SIZE,
            items: [{
                el: {
                    type: "bi.absolute",
                    scrollable: false,
                    height: BI.GridTableScrollbar.SIZE,
                    items: [{
                        el: this.scrollbar,
                        left: 0,
                        top: 0
                    }]
                },
                top: 0,
                left: 0,
                right: 0
            }]
        });
    },

    setContentSize: function (contentSize) {
        this.options.contentSize = contentSize;
        this.scrollbar.setContentSize(contentSize);
    },

    setPosition: function (position) {
        this.options.position = position;
        this.scrollbar.setPosition(position);
    },

    setSize: function (size) {
        this.setWidth(size);
        this.options.size = size;
        this.scrollbar.setSize(size);
    },

    populate: function () {
        this.scrollbar.populate();
        var o = this.options;
        if (o.size < 1 || o.contentSize <= o.size) {
            this.setVisible(false);
            return;
        }
        this.setVisible(true);
    }
});
BI.GridTableHorizontalScrollbar.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.grid_table_horizontal_scrollbar", BI.GridTableHorizontalScrollbar);/**
 *
 * 表格
 *
 * Created by GUY on 2015/9/22.
 * @class BI.TableHeaderCell
 * @extends BI.Single
 */
BI.TableHeaderCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-header-cell",
            text: ""
        });
    },

    _init: function () {
        BI.TableHeaderCell.superclass._init.apply(this, arguments);
        var o = this.options;
        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign || "center",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value,
            lgap: o.lgap,
            rgap: o.rgap,
            hgap: o.hgap || 5
        });
    }
});

BI.shortcut("bi.table_header_cell", BI.TableHeaderCell);/**
 *
 * 表格
 *
 * 能处理静态宽度以及动态宽度的表， 百分比宽度的表请使用PreviewTable
 *
 * Created by GUY on 2015/9/22.
 * @class BI.Table
 * @extends BI.Widget
 */
BI.Table = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Table.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table",
            logic: { // 冻结的页面布局逻辑
                dynamic: false
            },

            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false, // 是否需要合并单元格
            mergeCols: [], // 合并的单元格列号
            mergeRule: function (row1, row2) { // 合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: false,

            header: [],
            footer: false,
            items: [] // 二维数组
        });
    },

    _calculateWidth: function (width) {
        if (!width || width === "0") {
            return "";
        }
        width = BI.parseFloat(width);
        if (width < 0) {
            width = 0;
        }
        return width > 1.01 ? width : (width * 100 + "%");
    },

    _calculateHeight: function (height) {
        return height ? height : "";
    },

    _isRightFreeze: function () {
        return BI.isNotEmptyArray(this.options.freezeCols) && BI.first(this.options.freezeCols) !== 0;
    },

    _createTopLeft: function () {
        var o = this.options, isRight = this._isRightFreeze();
        this.topLeftColGroupTds = {};
        this.topLeftBodyTds = {};
        this.topLeftBodyItems = {};
        var table = this._table();
        var colgroup = this._createColGroup(this.columnLeft, this.topLeftColGroupTds);
        var body = this.topLeftBody = this._body();
        body.element.append(this._createHeaderCells(this.topLeftItems, this.columnLeft, this.mergeLeft, this.topLeftBodyTds, this.topLeftBodyItems));
        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, body]
        });
        if (isRight) {
            var w = 0;
            BI.each(o.columnSize, function (i, col) {
                if (!o.freezeCols.contains(i)) {
                    w += col;
                }
            });
            if (BI.isNumeric(w) && w > 1) {
                w = BI.parseFloat(w) + o.columnSize.length - o.freezeCols.length;
            }
        }
        return (this.topLeftContainer = BI.createWidget({
            type: "bi.adaptive",
            width: this._calculateWidth(w),
            items: [table]
        }));
    },

    _createTopRight: function () {
        var o = this.options, isRight = this._isRightFreeze();
        this.topRightColGroupTds = {};
        this.topRightBodyTds = {};
        this.topRightBodyItems = {};
        var table = this._table();
        var colgroup = this._createColGroup(this.columnRight, this.topRightColGroupTds);
        var body = this.topRightBody = this._body();
        body.element.append(this._createHeaderCells(this.topRightItems, this.columnRight, this.mergeRight, this.topRightBodyTds, this.topRightBodyItems, this.columnLeft.length));
        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, body]
        });
        if (!isRight) {
            var w = 0;
            BI.each(o.columnSize, function (i, col) {
                if (!o.freezeCols.contains(i)) {
                    w += col;
                }
            });
            if (BI.isNumeric(w)) {
                w = BI.parseFloat(w) + o.columnSize.length - o.freezeCols.length;
            }
        }
        return (this.topRightContainer = BI.createWidget({
            type: "bi.adaptive",
            width: w || undefined,
            items: [table]
        }));
    },

    _createBottomLeft: function () {
        var o = this.options, isRight = this._isRightFreeze();
        this.bottomLeftColGroupTds = {};
        this.bottomLeftBodyTds = {};
        this.bottomLeftBodyItems = {};
        var table = this._table();
        var colgroup = this._createColGroup(this.columnLeft, this.bottomLeftColGroupTds);
        var body = this._createBottomLeftBody();
        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, body]
        });
        if (isRight) {
            var w = 0;
            BI.each(o.columnSize, function (i, col) {
                if (!o.freezeCols.contains(i)) {
                    w += col;
                }
            });
            if (BI.isNumeric(w) && w > 1) {
                w = BI.parseFloat(w) + o.columnSize.length - o.freezeCols.length;
            }
        }
        return (this.bottomLeftContainer = BI.createWidget({
            type: "bi.adaptive",
            width: this._calculateWidth(w),
            items: [table]
        }));
    },

    _createBottomLeftBody: function () {
        var body = this.bottomLeftBody = this._body();
        body.element.append(this._createCells(this.bottomLeftItems, this.columnLeft, this.mergeLeft, this.bottomLeftBodyTds, this.bottomLeftBodyItems));
        return body;
    },

    _createBottomRight: function () {
        var o = this.options, isRight = this._isRightFreeze();
        this.bottomRightColGroupTds = {};
        this.bottomRightBodyTds = {};
        this.bottomRightBodyItems = {};
        var table = this._table();
        var colgroup = this._createColGroup(this.columnRight, this.bottomRightColGroupTds);
        var body = this._createBottomRightBody();
        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, body]
        });
        if (!isRight) {
            var w = 0;
            BI.each(o.columnSize, function (i, col) {
                if (!o.freezeCols.contains(i)) {
                    w += col;
                }
            });
            if (BI.isNumeric(w) && w > 1) {
                w = BI.parseFloat(w) + o.columnSize.length - o.freezeCols.length;
            }
        }
        return (this.bottomRightContainer = BI.createWidget({
            type: "bi.adaptive",
            width: this._calculateWidth(w),
            items: [table]
        }));
    },

    _createBottomRightBody: function () {
        var body = this.bottomRightBody = this._body();
        body.element.append(this._createCells(this.bottomRightItems, this.columnRight, this.mergeRight, this.bottomRightBodyTds, this.bottomRightBodyItems, this.columnLeft.length));
        return body;
    },

    _createFreezeTable: function () {
        var self = this, o = this.options;
        var isRight = this._isRightFreeze();
        var split = this._split(o.header);
        this.topLeftItems = split.left;
        this.topRightItems = split.right;
        split = this._split(o.items);
        this.bottomLeftItems = split.left;
        this.bottomRightItems = split.right;

        this.columnLeft = [];
        this.columnRight = [];
        BI.each(o.columnSize, function (i, size) {
            if (o.freezeCols.contains(i)) {
                self[isRight ? "columnRight" : "columnLeft"].push(size);
            } else {
                self[isRight ? "columnLeft" : "columnRight"].push(size);
            }
        });
        this.mergeLeft = [];
        this.mergeRight = [];
        BI.each(o.mergeCols, function (i, col) {
            if (o.freezeCols.contains(col)) {
                self[isRight ? "mergeRight" : "mergeLeft"].push(col);
            } else {
                self[isRight ? "mergeLeft" : "mergeRight"].push(col);
            }
        });

        var topLeft = this._createTopLeft();
        var topRight = this._createTopRight();
        var bottomLeft = this._createBottomLeft();
        var bottomRight = this._createBottomRight();

        this.scrollTopLeft = BI.createWidget({
            type: "bi.adaptive",
            cls: "scroll-top-left",
            width: "100%",
            height: "100%",
            scrollable: false,
            items: [topLeft]
        });
        this.scrollTopRight = BI.createWidget({
            type: "bi.adaptive",
            cls: "scroll-top-right",
            width: "100%",
            height: "100%",
            scrollable: false,
            items: [topRight]
        });
        this.scrollBottomLeft = BI.createWidget({
            type: "bi.adaptive",
            cls: "scroll-bottom-left",
            width: "100%",
            height: "100%",
            scrollable: isRight || null,
            scrollx: !isRight,
            items: [bottomLeft]
        });
        this.scrollBottomRight = BI.createWidget({
            type: "bi.adaptive",
            cls: "scroll-bottom-right",
            width: "100%",
            height: "100%",
            scrollable: !isRight || null,
            scrollx: isRight,
            items: [bottomRight]
        });
        this.topLeft = BI.createWidget({
            type: "bi.adaptive",
            cls: "top-left",
            scrollable: false,
            items: [this.scrollTopLeft]
        });
        this.topRight = BI.createWidget({
            type: "bi.adaptive",
            cls: "top-right",
            scrollable: false,
            items: [this.scrollTopRight]
        });
        this.bottomLeft = BI.createWidget({
            type: "bi.adaptive",
            cls: "bottom-left",
            // scrollable: false,
            items: [this.scrollBottomLeft]
        });
        this.bottomRight = BI.createWidget({
            type: "bi.adaptive",
            cls: "bottom-right",
            scrollable: false,
            items: [this.scrollBottomRight]
        });

        var headerHeight = o.header.length * ((o.headerRowSize || o.rowSize) + 1) + 1;
        var leftWidth = BI.sum(o.freezeCols, function (i, col) {
            return o.columnSize[col] > 1 ? o.columnSize[col] + 1 : o.columnSize[col];
        });

        this._resize = function () {
            if (self.scrollBottomLeft.element.is(":visible")) {
                self.scrollBottomLeft.element.css({"overflow-x": "auto"});
                self.scrollBottomRight.element.css({"overflow-x": "auto"});
                self.setColumnSize(o.columnSize);
                if (isRight) {
                    self.scrollBottomLeft.element.css({"overflow-y": "auto"});
                } else {
                    self.scrollBottomRight.element.css({"overflow-y": "auto"});
                }
                if (self.scrollBottomLeft.element.hasHorizonScroll() || self.scrollBottomRight.element.hasHorizonScroll()) {
                    self.scrollBottomLeft.element.css("overflow-x", "scroll");
                    self.scrollBottomRight.element.css("overflow-x", "scroll");
                }
                if (self.scrollBottomRight.element.hasVerticalScroll()) {
                    self.scrollTopRight.element.css("overflow-y", "scroll");
                } else {
                    self.scrollTopRight.element.css("overflow-y", "hidden");
                }
                if (self.scrollBottomLeft.element.hasVerticalScroll()) {
                    self.scrollTopLeft.element.css("overflow-y", "scroll");
                } else {
                    self.scrollTopLeft.element.css("overflow-y", "hidden");
                }
                self.scrollTopLeft.element[0].scrollLeft = self.scrollBottomLeft.element[0].scrollLeft;
                self.scrollTopRight.element[0].scrollLeft = self.scrollBottomRight.element[0].scrollLeft;
                self.scrollBottomLeft.element[0].scrollTop = self.scrollBottomRight.element[0].scrollTop;
            }
        };

        var regionColumnSize = o.regionColumnSize;
        if (o.freezeCols.length === 0) {
            regionColumnSize = isRight ? ["fill", 0] : [0, "fill"];
        } else if (o.freezeCols.length >= o.columnSize.length) {
            regionColumnSize = isRight ? [0, "fill"] : ["fill", 0];
        }
        this.partitions = BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("table", BI.extend({}, o.logic, {
            rows: 2,
            columns: 2,
            columnSize: regionColumnSize || (isRight ? ["fill", leftWidth] : [leftWidth, "fill"]),
            rowSize: [headerHeight, "fill"],
            items: [[{
                el: this.topLeft
            }, {
                el: this.topRight
            }], [{
                el: this.bottomLeft
            }, {
                el: this.bottomRight
            }]]
        }))));

        this._initFreezeScroll();
        BI.ResizeDetector.addResizeListener(this, function () {
            self._resize();
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE);
        });
    },

    mounted: function () {
        this._resize && this._resize();
        this.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT);
    },

    _initFreezeScroll: function () {
        var self = this, o = this.options;
        scroll(this.scrollBottomRight.element, this.scrollTopRight.element, this.scrollBottomLeft.element);

        // scroll(this.scrollBottomLeft.element, this.scrollTopLeft.element, this.scrollBottomRight.element);

        function scroll (scrollElement, scrollTopElement, otherElement) {
            scrollElement.scroll(function (e) {
                otherElement.scrollTop(scrollElement.scrollTop());
                scrollTopElement.scrollLeft(scrollElement.scrollLeft());
                self.fireEvent(BI.Table.EVENT_TABLE_SCROLL);
            });
        }
    },

    resize: function () {
        this._resize && this._resize();
    },

    _createCells: function (items, columnSize, mergeCols, TDs, Ws, start, rowSize) {
        var self = this, o = this.options, preCol = {}, preRow = {}, preRW = {}, preCW = {}, map = {};
        columnSize = columnSize || o.columnSize;
        mergeCols = mergeCols || o.mergeCols;
        TDs = TDs || {};
        Ws = Ws || {};
        start = start || 0;
        rowSize || (rowSize = o.rowSize);
        var frag = document.createDocumentFragment();
        BI.each(items, function (i, rows) {
            var tr = $("<tr>").addClass((i & 1) === 0 ? "odd" : "even");
            BI.each(rows, function (j, row) {
                if (!map[i]) {
                    map[i] = {};
                }
                if (!TDs[i]) {
                    TDs[i] = {};
                }
                if (!Ws[i]) {
                    Ws[i] = {};
                }
                map[i][j] = row;

                if (o.isNeedMerge && mergeCols.contains(j)) {
                    if (i === 0 && j === 0) {
                        createOneEl(0, 0);
                    } else if (j === 0 && i > 0) {
                        var isNeedMergeRow = o.mergeRule(map[i][j], map[i - 1][j]);
                        if (isNeedMergeRow === true) {
                            mergeRow(i, j);
                            preRow[i] = preCol[j];
                            preRW[i] = preCW[j];
                        } else {
                            createOneEl(i, j);
                        }
                    } else if (i === 0 && j > 0) {
                        var isNeedMergeCol = o.mergeRule(map[i][j], map[i][j - 1]);
                        if (isNeedMergeCol === true) {
                            mergeCol(i, j);
                            preCol[j] = preRow[i];
                            preCW[j] = preRW[i];
                        } else {
                            createOneEl(i, j);
                        }
                    } else {
                        var isNeedMergeRow = o.mergeRule(map[i][j], map[i - 1][j]);
                        var isNeedMergeCol = o.mergeRule(map[i][j], map[i][j - 1]);
                        if (isNeedMergeCol && isNeedMergeRow) {
                            return;
                        }
                        if (isNeedMergeCol) {
                            mergeCol(i, j);
                        }
                        if (isNeedMergeRow) {
                            mergeRow(i, j);
                        }
                        if (!isNeedMergeCol && !isNeedMergeRow) {
                            createOneEl(i, j);
                        }
                    }
                } else {
                    createOneEl(i, j);
                }
            });

            function mergeRow (i, j) {
                var height = (preCol[j].attr("height") | 0) + rowSize + 1;
                preCol[j].attr("height", height).css("height", height);
                // preCW[j].element.css("height", height);
                var rowspan = ((preCol[j].attr("rowspan") || 1) | 0) + 1;
                preCol[j].attr("rowspan", rowspan);
                preCol[j].__mergeRows.pushDistinct(i);
                TDs[i][j] = preCol[j];
                Ws[i][j] = preCW[j];
            }

            function mergeCol (i, j) {
                if (columnSize[j]) {
                    var width = preRow[i].attr("width") | 0;
                    if (width > 1.05 && columnSize[j]) {
                        width = width + columnSize[j] + 1;
                        if (j === columnSize.length - 1) {
                            width--;
                        }
                    } else {
                        width = width + columnSize[j];
                    }
                    width = self._calculateWidth(width);
                    preRow[i].attr("width", width).css("width", width);
                    preRW[i].element.width(width);
                }
                var colspan = ((preRow[i].attr("colspan") || 1) | 0) + 1;
                preRow[i].attr("colspan", colspan);
                preRow[i].__mergeCols.pushDistinct(j);
                TDs[i][j] = preRow[i];
                Ws[i][j] = preRW[i];
            }

            function createOneEl (r, c) {
                var width = self._calculateWidth(columnSize[c]);
                if (width > 1.05 && c === columnSize.length - 1) {
                    width--;
                }
                var height = self._calculateHeight(rowSize);
                var td = $("<td>").attr("height", height)
                    .attr("width", width).css({width: width, height: height, position: "relative"})
                    .addClass((c & 1) === 0 ? "odd-col" : "even-col")
                    .addClass(r === 0 ? "first-row" : "")
                    .addClass(c === 0 ? "first-col" : "")
                    .addClass(c === rows.length - 1 ? "last-col" : "");
                var w = BI.createWidget(map[r][c], {
                    type: "bi.table_cell",
                    textAlign: "left",
                    width: BI.isNumeric(width) ? width : "",
                    height: BI.isNumeric(height) ? height : "",
                    _row: r,
                    _col: c + start
                });
                self.addWidget(w.getName(), w);
                w._mount();
                w.element.css("position", "relative");
                td.append(w.element);
                tr.append(td);
                preCol[c] = td;
                preCol[c].__mergeRows = [r];
                preCW[c] = w;
                preRow[r] = td;
                preRow[r].__mergeCols = [c];
                preRW[r] = w;
                TDs[r][c] = td;
                Ws[r][c] = w;
            }

            frag.appendChild(tr[0]);
        });
        return frag;
    },

    _createColGroupCells: function (columnSize, store) {
        var self = this, o = this.options;
        columnSize = columnSize || o.columnSize;
        store = store || {};
        var frag = document.createDocumentFragment();
        BI.each(columnSize, function (i, size) {
            var width = self._calculateWidth(size);
            var col = $("<col>").attr("width", width).css("width", width);
            store[i] = col;
            frag.appendChild(col[0]);
        });
        return frag;
    },

    _createHeaderCells: function (items, columnSize, mergeCols, TDs, Ws, start) {
        var self = this, o = this.options;
        start || (start = 0);
        var frag = this._createCells(items, columnSize, BI.range(o.columnSize.length), TDs, Ws, start, o.headerRowSize || o.rowSize);

        return frag;
    },

    _createFooterCells: function (items, columnSize, TDs, Ws) {
        var o = this.options;
        var frag = this._createCells(items, columnSize, [], TDs, Ws, 0);
        return frag;
    },

    _createColGroup: function (columnSize, store, widgets) {
        var self = this, o = this.options;
        this.colgroup = this._colgroup();
        this.colgroup.element.append(this._createColGroupCells(columnSize, store, widgets));
        return this.colgroup;
    },

    _createHeader: function () {
        var self = this, o = this.options;
        if (o.header === false) {
            return;
        }
        this.header = this._header();
        this.header.element.append(this._createHeaderCells(o.header, null, null, this.headerTds, this.headerItems));
        return this.header;
    },

    _createFooter: function (columnSize, store, widgets) {
        var self = this, o = this.options;
        if (o.footer === false) {
            return;
        }
        this.footer = this._footer();
        this.footer.element.append(this._createFooterCells(o.footer, null, this.footerTds, this.footerItems));
        return this.footer;
    },


    _createBody: function () {
        var self = this, o = this.options;
        this.body = this._body();
        this.body.element.append(this._createCells(o.items, null, null, this.bodyTds, this.bodyItems));
        return this.body;
    },

    _createNormalTable: function () {
        var self = this, o = this.options, table = this._table();
        this.colgroupTds = {};
        this.headerTds = {};
        this.footerTds = {};
        this.bodyTds = {};

        this.headerItems = {};
        this.footerItems = {};
        this.bodyItems = {};
        var colgroup = this._createColGroup(null, this.colgroupTds);
        var header = this._createHeader();
        var footer = this._createFooter();
        var body = this._createBody();

        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, header, footer, body]
        });

        var w = BI.sum(this.options.columnSize) || undefined;
        w = this._calculateWidth(w);
        if (BI.isNumeric(w) && w > 1) {
            w += o.columnSize.length;
        }
        this.tableContainer = BI.createWidget({
            type: "bi.adaptive",
            width: this._calculateWidth(w),
            items: [table]
        });

        this.scrollBottomRight = BI.createWidget({
            type: "bi.adaptive",
            width: "100%",
            height: "100%",
            cls: "scroll-bottom-right",
            scrollable: true,
            items: [this.tableContainer]
        });

        BI.createWidget({
            type: "bi.adaptive",
            cls: "bottom-right",
            element: this,
            scrollable: false,
            items: [this.scrollBottomRight]
        });

        this._initNormalScroll();
        BI.nextTick(function () {
            if (self.element.is(":visible")) {
                self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT);
            }
        });
    },

    _initNormalScroll: function () {
        var self = this;
        this.scrollBottomRight.element.scroll(function (e) {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL);
        });
    },

    _split: function (items) {
        var o = this.options, left = [], right = [], isRight = this._isRightFreeze();
        BI.each(items, function (i, rows) {
            left.push([]);
            right.push([]);
            BI.each(rows, function (j, cell) {
                if (o.freezeCols.contains(j)) {
                    (isRight ? right : left)[i].push(cell);
                } else {
                    (isRight ? left : right)[i].push(cell);
                }
            });
        });
        return {
            left: left,
            right: right
        };
    },

    _table: function () {
        return BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            cls: "table",
            attribute: {cellspacing: 0, cellpadding: 0}
        });
    },

    _header: function () {
        return BI.createWidget({
            type: "bi.layout",
            cls: "header",
            tagName: "thead"
        });
    },

    _footer: function () {
        return BI.createWidget({
            type: "bi.layout",
            cls: "footer",
            tagName: "tfoot"
        });
    },

    _body: function () {
        return BI.createWidget({
            type: "bi.layout",
            tagName: "tbody",
            cls: "body"
        });
    },

    _colgroup: function () {
        return BI.createWidget({
            type: "bi.layout",
            tagName: "colgroup"
        });
    },

    render: function () {
        if (this.options.items.length > 0 || this.options.header.length > 0) {
            this.populate(this.options.items);
        }
    },

    setColumnSize: function (columnSize) {
        var self = this, o = this.options;
        var isRight = this._isRightFreeze();
        o.columnSize = columnSize || [];
        if (o.isNeedFreeze) {
            var columnLeft = [];
            var columnRight = [];
            BI.each(o.columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    isRight ? columnRight.push(size) : columnLeft.push(size);
                } else {
                    isRight ? columnLeft.push(size) : columnRight.push(size);
                }
            });
            var topleft = 0, topright = 1, bottomleft = 2, bottomright = 3;
            var run = function (direction) {
                var colgroupTds, bodyTds, bodyItems, sizes;
                switch (direction) {
                    case topleft:
                        colgroupTds = self.topLeftColGroupTds;
                        bodyTds = self.topLeftBodyTds;
                        bodyItems = self.topLeftBodyItems;
                        sizes = columnLeft;
                        break;
                    case topright:
                        colgroupTds = self.topRightColGroupTds;
                        bodyTds = self.topRightBodyTds;
                        bodyItems = self.topRightBodyItems;
                        sizes = columnRight;
                        break;
                    case bottomleft:
                        colgroupTds = self.bottomLeftColGroupTds;
                        bodyTds = self.bottomLeftBodyTds;
                        bodyItems = self.bottomLeftBodyItems;
                        sizes = columnLeft;
                        break;
                    case bottomright:
                        colgroupTds = self.bottomRightColGroupTds;
                        bodyTds = self.bottomRightBodyTds;
                        bodyItems = self.bottomRightBodyItems;
                        sizes = columnRight;
                        break;
                }
                BI.each(colgroupTds, function (i, colgroup) {
                    var width = colgroup.attr("width") | 0;
                    if (sizes[i] !== "" && width !== sizes[i]) {
                        var w = self._calculateWidth(sizes[i]);
                        colgroup.attr("width", w).css("width", w);
                        BI.each(bodyTds, function (j, items) {
                            if (items[i]) {
                                if (items[i].__mergeCols.length > 1) {
                                    var wid = 0;
                                    BI.each(sizes, function (t, s) {
                                        if (items[i].__mergeCols.contains(t)) {
                                            wid += s;
                                        }
                                    });
                                    wid = self._calculateWidth(wid);
                                    if (wid > 1) {
                                        wid += items[i].__mergeCols.length - 1;
                                    }
                                    if (BI.isNumeric(wid)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].attr("width", wid - 1).css("width", wid - 1);
                                        } else {
                                            items[i].attr("width", wid).css("width", wid);
                                        }
                                    } else {
                                        items[i].attr("width", "").css("width", "");
                                    }
                                } else {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                }
                            }
                        });
                        BI.each(bodyItems, function (j, items) {
                            if (items[i]) {
                                if (bodyTds[j][i].__mergeCols.length > 1) {
                                    var wid = 0;
                                    BI.each(sizes, function (t, s) {
                                        if (bodyTds[j][i].__mergeCols.contains(t)) {
                                            wid += s;
                                        }
                                    });
                                    wid = self._calculateWidth(wid);
                                    if (wid > 1) {
                                        wid += bodyTds[j][i].__mergeCols.length - 1;
                                    }
                                    if (BI.isNumeric(wid)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                        } else {
                                            items[i].element.attr("width", wid).css("width", wid);
                                        }
                                    } else {
                                        items[i].element.attr("width", "").css("width", "");
                                    }
                                } else {
                                    if (BI.isNumeric(w)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].element.attr("width", w - 1).css("width", w - 1);
                                        } else {
                                            items[i].element.attr("width", w).css("width", w);
                                        }
                                    } else {
                                        items[i].element.attr("width", "").css("width", "");
                                    }
                                }
                            }
                        });
                    }
                });
            };
            run(topleft);
            run(topright);
            run(bottomleft);
            run(bottomright);

            var lw = 0, rw = 0;
            this.columnLeft = [];
            this.columnRight = [];
            BI.each(o.columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    lw += size;
                    self[isRight ? "columnRight" : "columnLeft"].push(size);
                } else {
                    rw += size;
                    self[isRight ? "columnLeft" : "columnRight"].push(size);
                }
            });
            lw = this._calculateWidth(lw);
            rw = this._calculateWidth(rw);

            if (BI.isNumeric(lw)) {
                lw = BI.parseFloat(lw) + o.freezeCols.length;
            }
            if (BI.isNumeric(rw)) {
                rw = BI.parseFloat(rw) + o.columnSize.length - o.freezeCols.length;
            }
            this.topLeftContainer.element.width(isRight ? rw : lw);
            this.bottomLeftContainer.element.width(isRight ? rw : lw);
            this.topRightContainer.element.width(isRight ? lw : rw);
            this.bottomRightContainer.element.width(isRight ? lw : rw);
            this.scrollTopLeft.element[0].scrollLeft = this.scrollBottomLeft.element[0].scrollLeft;
            this.scrollTopRight.element[0].scrollLeft = this.scrollBottomRight.element[0].scrollLeft;
        } else {
            BI.each(this.colgroupTds, function (i, colgroup) {
                var width = colgroup.attr("width") | 0;
                if (o.columnSize[i] !== "" && width !== o.columnSize[i]) {
                    var w = self._calculateWidth(o.columnSize[i]);
                    colgroup.attr("width", w).css("width", w);
                    BI.each(self.bodyTds, function (j, items) {
                        if (items[i]) {
                            if (items[i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (items[i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += items[i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].attr("width", "").css("width", "");
                                }
                            } else {
                                if (i == BI.size(items) - 1) {
                                    items[i].attr("width", w - 1).css("width", w - 1);
                                } else {
                                    items[i].attr("width", w).css("width", w);
                                }
                            }
                        }
                    });
                    BI.each(self.headerTds, function (j, items) {
                        if (items[i]) {
                            if (items[i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (items[i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += items[i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].attr("width", "").css("width", "");
                                }
                            } else {
                                if (i == BI.size(items) - 1) {
                                    items[i].attr("width", w - 1).css("width", w - 1);
                                } else {
                                    items[i].attr("width", w).css("width", w);
                                }
                            }
                        }
                    });
                    BI.each(self.footerTds, function (j, items) {
                        if (items[i]) {
                            if (items[i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (items[i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += items[i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].attr("width", "").css("width", "");
                                }
                            } else {
                                if (i == BI.size(items) - 1) {
                                    items[i].attr("width", w - 1).css("width", w - 1);
                                } else {
                                    items[i].attr("width", w).css("width", w);
                                }
                            }
                        }
                    });
                    BI.each(self.bodyItems, function (j, items) {
                        if (items[i]) {
                            if (self.bodyTds[j][i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (self.bodyTds[j][i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += self.bodyTds[j][i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            } else {
                                if (BI.isNumeric(w)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].element.attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            }
                        }
                    });
                    BI.each(self.headerItems, function (j, items) {
                        if (items[i]) {
                            if (self.headerTds[j][i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (self.headerTds[j][i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += self.headerTds[j][i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            } else {
                                if (BI.isNumeric(w)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].element.attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            }
                        }
                    });
                    BI.each(self.footerItems, function (j, items) {
                        if (items[i]) {
                            if (self.footerTds[j][i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (self.footerTds[j][i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += self.footerTds[j][i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            } else {
                                if (BI.isNumeric(w)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].element.attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            }
                        }
                    });
                }
            });
            var w = this._calculateWidth(BI.sum(o.columnSize));
            if (w > 1.05) {
                w += o.columnSize.length;
            }
            if (w > 1.05) {
                this.tableContainer.element.width(w);
            }
        }
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    getCalculateColumnSize: function () {
        var self = this, o = this.options;
        var columnSize = [];
        if (o.isNeedFreeze === true) {
            if (BI.size(this.bottomLeftBodyTds) > 0 || BI.size(this.bottomRightBodyTds) > 0) {
                if (!BI.any(this.bottomLeftBodyTds, function (i, tds) {
                        if (!BI.any(tds, function (i, item) {
                                if (item.__mergeCols.length > 1) {
                                    return true;
                                }
                            })) {
                            BI.each(tds, function (i, item) {
                                var width = item.width() / item.__mergeCols.length;
                                if (i == BI.size(tds) - 1) {
                                    width++;
                                }
                                columnSize.push(width);
                            });
                            return true;
                        }
                    })) {
                    BI.each(this.bottomLeftBodyTds[0], function (i, item) {
                        var width = item.width() / item.__mergeCols.length;
                        if (i == BI.size(self.bottomLeftBodyTds[0]) - 1) {
                            width++;
                        }
                        columnSize.push(width);
                    });
                }
                if (!BI.any(this.bottomRightBodyTds, function (i, tds) {
                        if (!BI.any(tds, function (i, item) {
                                if (item.__mergeCols.length > 1) {
                                    return true;
                                }
                            })) {
                            BI.each(tds, function (i, item) {
                                var width = item.width() / item.__mergeCols.length;
                                if (i == BI.size(tds) - 1) {
                                    width++;
                                }
                                columnSize.push(width);
                            });
                            return true;
                        }
                    })) {
                    BI.each(this.bottomRightBodyTds[0], function (i, item) {
                        var width = item.width() / item.__mergeCols.length;
                        if (i == BI.size(self.bottomRightBodyTds[0]) - 1) {
                            width++;
                        }
                        columnSize.push(width);
                    });
                }
                return columnSize;
            }
            if (!BI.any(this.topLeftBodyTds, function (i, tds) {
                    if (!BI.any(tds, function (i, item) {
                            if (item.__mergeCols.length > 1) {
                                return true;
                            }
                        })) {
                        BI.each(tds, function (i, item) {
                            var width = item.width() / item.__mergeCols.length;
                            if (i == BI.size(tds) - 1) {
                                width++;
                            }
                            columnSize.push(width);
                        });
                        return true;
                    }
                })) {
                BI.each(this.topLeftBodyTds[BI.size(this.topLeftBodyTds) - 1], function (i, item) {
                    var width = item.width() / item.__mergeCols.length;
                    if (i == BI.size(self.topLeftBodyTds[BI.size(self.topLeftBodyTds) - 1]) - 1) {
                        width++;
                    }
                    columnSize.push(width);
                });
            }
            if (!BI.any(this.topRightBodyTds, function (i, tds) {
                    if (!BI.any(tds, function (i, item) {
                            if (item.__mergeCols.length > 1) {
                                return true;
                            }
                        })) {
                        BI.each(tds, function (i, item) {
                            var width = item.width() / item.__mergeCols.length;
                            if (i == BI.size(tds) - 1) {
                                width++;
                            }
                            columnSize.push(width);
                        });
                        return true;
                    }
                })) {
                BI.each(this.topRightBodyTds[BI.size(this.topRightBodyTds) - 1], function (i, item) {
                    var width = item.width() / item.__mergeCols.length;
                    if (i == BI.size(self.topRightBodyTds[BI.size(self.topRightBodyTds) - 1]) - 1) {
                        width++;
                    }
                    columnSize.push(width);
                });
            }
        } else {
            BI.each(this.headerTds[BI.size(this.headerTds) - 1], function (i, item) {
                var width = item.width() / item.__mergeCols.length;
                if (i == BI.size(self.headerTds[BI.size(self.headerTds) - 1]) - 1) {
                    width++;
                }
                columnSize.push(width);
            });
        }
        return columnSize;
    },

    setHeaderColumnSize: function (columnSize) {
        var self = this, o = this.options;
        var isRight = this._isRightFreeze();
        if (o.isNeedFreeze) {
            var columnLeft = [];
            var columnRight = [];
            BI.each(columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    isRight ? columnRight.push(size) : columnLeft.push(size);
                } else {
                    isRight ? columnLeft.push(size) : columnRight.push(size);
                }
            });
            var topleft = 0, topright = 1;
            var run = function (direction) {
                var colgroupTds, bodyTds, bodyItems, sizes;
                switch (direction) {
                    case topleft:
                        colgroupTds = self.topLeftColGroupTds;
                        bodyTds = self.topLeftBodyTds;
                        bodyItems = self.topLeftBodyItems;
                        sizes = columnLeft;
                        break;
                    case topright:
                        colgroupTds = self.topRightColGroupTds;
                        bodyTds = self.topRightBodyTds;
                        bodyItems = self.topRightBodyItems;
                        sizes = columnRight;
                        break;
                }
                BI.each(colgroupTds, function (i, colgroup) {
                    var width = colgroup.attr("width") | 0;
                    if (width !== sizes[i]) {
                        var w = self._calculateWidth(sizes[i]);
                        colgroup.attr("width", w).css("width", w);
                        BI.each(bodyTds, function (j, items) {
                            if (items[i]) {
                                if (items[i].__mergeCols.length > 1) {
                                    var wid = 0;
                                    BI.each(sizes, function (t, s) {
                                        if (items[i].__mergeCols.contains(t)) {
                                            wid += s;
                                        }
                                    });
                                    wid = self._calculateWidth(wid);
                                    if (wid > 1) {
                                        wid += items[i].__mergeCols.length - 1;
                                    }
                                    if (BI.isNumeric(wid)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].attr("width", wid - 1).css("width", wid - 1);
                                        } else {
                                            items[i].attr("width", wid).css("width", wid);
                                        }
                                    } else {
                                        items[i].attr("width", "").css("width", "");
                                    }
                                } else {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                }
                            }
                        });
                        BI.each(bodyItems, function (j, items) {
                            if (items[i]) {
                                if (bodyTds[j][i].__mergeCols.length > 1) {
                                    var wid = 0;
                                    BI.each(sizes, function (t, s) {
                                        if (bodyTds[j][i].__mergeCols.contains(t)) {
                                            wid += s;
                                        }
                                    });
                                    wid = self._calculateWidth(wid);
                                    if (wid > 1) {
                                        wid += bodyTds[j][i].__mergeCols.length - 1;
                                    }
                                    if (BI.isNumeric(wid)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                        } else {
                                            items[i].element.attr("width", wid).css("width", wid);
                                        }
                                    } else {
                                        items[i].element.attr("width", "").css("width", "");
                                    }
                                } else {
                                    if (BI.isNumeric(w)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].element.attr("width", w - 1).css("width", w - 1);
                                        } else {
                                            items[i].element.attr("width", w).css("width", w);
                                        }
                                    } else {
                                        items[i].element.attr("width", "").css("width", "");
                                    }
                                }
                            }
                        });
                    }
                });
            };
            run(topleft);
            run(topright);

            var lw = 0, rw = 0;
            BI.each(columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    lw += size;
                } else {
                    rw += size;
                }
            });
            lw = this._calculateWidth(lw);
            rw = this._calculateWidth(rw);

            if (BI.isNumeric(lw)) {
                lw = BI.parseFloat(lw) + o.freezeCols.length;
            }
            if (BI.isNumeric(rw)) {
                rw = BI.parseFloat(rw) + columnSize.length - o.freezeCols.length;
            }
            this.topLeftContainer.element.width(isRight ? rw : lw);
            this.topRightContainer.element.width(isRight ? lw : rw);
            this.scrollTopLeft.element[0].scrollLeft = this.scrollBottomLeft.element[0].scrollLeft;
            this.scrollTopRight.element[0].scrollLeft = this.scrollBottomRight.element[0].scrollLeft;
        } else {
            BI.each(this.colgroupTds, function (i, colgroup) {
                var width = colgroup.attr("width") | 0;
                if (width !== columnSize[i]) {
                    var w = self._calculateWidth(columnSize[i]);
                    colgroup.attr("width", w).css("width", w);
                    BI.each(self.headerTds, function (j, items) {
                        if (items[i]) {
                            if (items[i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(columnSize, function (t, s) {
                                    if (items[i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += items[i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].attr("width", "").css("width", "");
                                }
                            } else {
                                if (i == BI.size(items) - 1) {
                                    items[i].attr("width", w - 1).css("width", w - 1);
                                } else {
                                    items[i].attr("width", w).css("width", w);
                                }
                            }
                        }
                    });
                    BI.each(self.headerItems, function (j, items) {
                        if (items[i]) {
                            if (self.headerTds[j][i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(columnSize, function (t, s) {
                                    if (self.headerTds[j][i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += self.headerTds[j][i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            } else {
                                if (BI.isNumeric(w)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].element.attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            }
                        }
                    });
                }
            });
            var cW = this._calculateWidth(BI.sum(columnSize));
            if (cW > 1.05) {
                cW = cW + columnSize.length;
            }
            this.tableContainer.element.width(cW);
        }
    },

    setRegionColumnSize: function (columnSize) {
        var self = this, o = this.options;
        o.regionColumnSize = columnSize;
        if (o.freezeCols.length === 0) {
            if (o.isNeedFreeze) {
                this.partitions.attr("columnSize", this._isRightFreeze() ? ["fill", 0] : [0, "fill"]);
                this.partitions.resize();
            } else {
                this.tableContainer.element.width(columnSize[0]);
            }
        } else if (o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
            if (o.isNeedFreeze) {
                this.partitions.attr("columnSize", columnSize);
                this.partitions.resize();
            } else {
                this.tableContainer.element.width(columnSize[0]);
            }
        } else {
            if (o.isNeedFreeze) {
                this.partitions.attr("columnSize", this._isRightFreeze() ? [0, "fill"] : ["fill", 0]);
                this.partitions.resize();
            } else {
                this.tableContainer.element.width(columnSize[0]);
            }
        }
    },

    getRegionColumnSize: function () {
        return this.options.regionColumnSize;
    },

    getCalculateRegionColumnSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollBottomLeft.element.width(), this.scrollBottomRight.element.width()];
        }
        return [this.scrollBottomRight.element.width()];
    },

    getCalculateRegionRowSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollTopRight.element.height(), this.scrollBottomRight.element.height()];
        }
        return [this.scrollBottomRight.element.height()];
    },

    getClientRegionColumnSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollBottomLeft.element[0].clientWidth, this.scrollBottomRight.element[0].clientWidth];
        }
        return [this.scrollBottomRight.element[0].clientWidth];
    },

    getClientRegionRowSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollBottomLeft.element[0].clientHeight, this.scrollBottomRight.element[0].clientHeight];
        }
        return [this.scrollBottomRight.element[0].clientHeight];
    },

    getScrollRegionColumnSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollBottomLeft.element[0].scrollWidth, this.scrollBottomRight.element[0].scrollWidth];
        }
        return [this.scrollBottomRight.element[0].scrollWidth];
    },

    getScrollRegionRowSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            if (o.freezeCols.length < o.columnSize.length) {
                return [this.scrollTopRight.element[0].scrollHeight, this.scrollBottomRight.element[0].scrollHeight];
            }
            return [this.scrollTopLeft.element[0].scrollHeight, this.scrollBottomLeft.element[0].scrollHeight];

        }
        return [this.scrollBottomRight.element[0].scrollHeight];
    },

    hasVerticalScroll: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return this.scrollBottomRight.element.hasVerticalScroll() || this.scrollBottomLeft.element.hasVerticalScroll();
        }
        return this.scrollBottomRight.element.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        var o = this.options;
        if (o.isNeedFreeze) {
            if (this.scrollBottomRight.element[0].scrollTop !== scrollTop) {
                this.scrollBottomRight.element[0].scrollTop = scrollTop;
            }
            if (this.scrollBottomLeft.element[0].scrollTop !== scrollTop) {
                this.scrollBottomLeft.element[0].scrollTop = scrollTop;
            }
        } else {
            if (this.scrollBottomRight.element[0].scrollTop !== scrollTop) {
                this.scrollBottomRight.element[0].scrollTop = scrollTop;
            }
        }
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        var o = this.options;
        if (o.isNeedFreeze) {
            if (this.scrollBottomLeft.element[0].scrollLeft !== scrollLeft) {
                this.scrollBottomLeft.element[0].scrollLeft = scrollLeft;
            }
            if (this.scrollTopLeft.element[0].scrollLeft !== scrollLeft) {
                this.scrollTopLeft.element[0].scrollLeft = scrollLeft;
            }
        } else {
            if (this.scrollBottomRight.element[0].scrollLeft !== scrollLeft) {
                this.scrollBottomRight.element[0].scrollLeft = scrollLeft;
            }
        }
    },

    setRightHorizontalScroll: function (scrollLeft) {
        var o = this.options;
        if (o.isNeedFreeze) {
            if (this.scrollBottomRight.element[0].scrollLeft !== scrollLeft) {
                this.scrollBottomRight.element[0].scrollLeft = scrollLeft;
            }
            if (this.scrollTopRight.element[0].scrollLeft !== scrollLeft) {
                this.scrollTopRight.element[0].scrollLeft = scrollLeft;
            }
        } else {
            if (this.scrollBottomRight.element[0].scrollLeft !== scrollLeft) {
                this.scrollBottomRight.element[0].scrollLeft = scrollLeft;
            }
        }
    },

    getVerticalScroll: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return this.scrollBottomRight.element[0].scrollTop || this.scrollBottomLeft.element[0].scrollTop;
        }
        return this.scrollBottomRight.element[0].scrollTop;
    },

    getLeftHorizontalScroll: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return this.scrollBottomLeft.element[0].scrollLeft;
        }
        return this.scrollBottomRight.element[0].scrollLeft;
    },

    getRightHorizontalScroll: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return this.scrollBottomRight.element[0].scrollLeft;
        }
        return this.scrollBottomRight.element[0].scrollLeft;
    },

    getColumns: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return {
                topLeft: this.topLeftBodyItems,
                topRight: this.topRightBodyItems,
                bottomLeft: this.bottomLeftBodyItems,
                bottomRight: this.bottomRightBodyItems
            };
        }
        return {
            header: this.headerItems,
            body: this.bodyItems,
            footer: this.footerItems
        };

    },

    _empty: function () {
        this.scrollBottomRight && this.scrollBottomRight.destroy();
        BI.each(this.partitions && this.partitions._children, function (name, child) {
            child && child.destroy();
        });
    },

    populate: function (items, header) {
        this.options.items = items || [];
        if (header) {
            this.options.header = header;
        }
        this._empty();
        if (this.options.isNeedFreeze) {
            this._createFreezeTable();
        } else {
            this._createNormalTable();
        }
    }
})
;
BI.Table.EVENT_TABLE_AFTER_INIT = "EVENT_TABLE_AFTER_INIT";
BI.Table.EVENT_TABLE_RESIZE = "EVENT_TABLE_RESIZE";
BI.Table.EVENT_TABLE_SCROLL = "EVENT_TABLE_SCROLL";
BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE = "EVENT_TABLE_BEFORE_COLUMN_RESIZE";
BI.Table.EVENT_TABLE_COLUMN_RESIZE = "EVENT_TABLE_COLUMN_RESIZE";
BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE = "EVENT_TABLE_AFTER_COLUMN_RESIZE";

BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE = "EVENT_TABLE_BEFORE_REGION_RESIZE";
BI.Table.EVENT_TABLE_REGION_RESIZE = "EVENT_TABLE_REGION_RESIZE";
BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE = "EVENT_TABLE_AFTER_REGION_RESIZE";
BI.shortcut("bi.table_view", BI.Table);
/**
 *
 * 表格单元格
 *
 * Created by GUY on 2016/1/12.
 * @class BI.ResizableTableCell
 * @extends BI.Widget
 */
BI.ResizableTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ResizableTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-resizable-table-cell",
            cell: {},
            minSize: 15,
            // suitableSize,
            maxSize: Number.MAX_VALUE,
            start: BI.emptyFn,
            resize: BI.emptyFn,
            stop: BI.emptyFn
        });
    },

    _init: function () {
        BI.ResizableTableCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.cell = BI.createWidget(BI.extend({type: "bi.label"}, o.cell, {width: o.width, height: o.height}));

        var startDrag = false;
        var size = 0, offset = 0, defaultSize = o.width;

        function optimizeSize (s) {
            var optSize = BI.clamp(s, o.minSize, o.maxSize || Number.MAX_VALUE);
            // if (o.suitableSize) {
            //     if (Math.abs(o.suitableSize - optSize) < 5) {
            //         optSize = o.suitableSize;
            //         self.handler.element.addClass("suitable");
            //     } else {
            //         self.handler.element.removeClass("suitable");
            //     }
            // }
            return optSize;
        }

        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX, deltaY) {
            if (mouseMoveTracker.isDragging()) {
                startDrag = true;
                offset += deltaX;
                size = optimizeSize(defaultSize + offset);
                self.handler.element.addClass("dragging");
                o.resize(size);
            }
        }, function () {
            if (startDrag === true) {
                size = optimizeSize(size);
                o.stop(size);
                size = 0;
                offset = 0;
                defaultSize = o.width;
                startDrag = false;
            }
            self.handler.element.removeClass("dragging");
            self.handler.element.removeClass("suitable");
            mouseMoveTracker.releaseMouseMoves();
        }, _global.document);
        this.handler = BI.createWidget({
            type: "bi.absolute",
            cls: "resizable-table-cell-resizer-container",
            width: 6,
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "resizable-table-cell-resizer-knob",
                    width: 4
                },
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.handler.element.on("mousedown", function (event) {
            defaultSize = o.width;
            optimizeSize(defaultSize);
            mouseMoveTracker.captureMouseMoves(event);
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.cell,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: this.handler,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    setWidth: function (width) {
        BI.ResizableTableCell.superclass.setWidth.apply(this, arguments);
        var o = this.options;
        this.cell.setWidth(o.width);
    },

    setHeight: function (height) {
        BI.ResizableTableCell.superclass.setHeight.apply(this, arguments);
        var o = this.options;
        this.cell.setHeight(o.height);
    }
});
BI.shortcut("bi.resizable_table_cell", BI.ResizableTableCell);/**
 *
 * 可调整列宽的grid表格
 *
 * Created by GUY on 2016/1/12.
 * @class BI.ResizableTable
 * @extends BI.Widget
 */
BI.ResizableTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ResizableTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-resizable-table",
            el: {
                type: "bi.grid_table"
            },
            isNeedFreeze: false,
            isNeedResize: true,
            isResizeAdapt: false,
            headerRowSize: 25,
            rowSize: 25,
            isNeedMerge: true, // 是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,
            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            freezeCols: [],
            header: [],
            items: [],
            regionColumnSize: []
        });
    },

    _init: function () {
        BI.ResizableTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.resizer = BI.createWidget({
            type: "bi.layout",
            cls: "resizable-table-resizer",
            invisible: true,
            width: 2
        });
        this.regionResizerHandler = this._createResizerHandler();
        this.table = BI.createWidget(o.el, {
            type: "bi.grid_table",
            element: this,
            width: o.width,
            height: o.height,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            columnSize: o.columnSize,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: BI.bind(this._mergeRule, this),

            header: this._formatHeader(o.header),
            items: o.items,
            regionColumnSize: o.regionColumnSize
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.regionResizerHandler,
                left: 0,
                top: 0,
                bottom: 0
            }, {
                el: this.resizer,
                left: 0,
                top: 0
            }]
        });
        this._populate();
    },

    _mergeRule: function (row1, row2) {
        var o = this.options;
        if (row1.type === "bi.resizable_table_cell") {
            row1 = row1.cell;
        }
        if (row2.type === "bi.resizable_table_cell") {
            row2 = row2.cell;
        }
        return o.mergeRule(row1, row2);
    },

    _createResizerHandler: function () {
        var self = this, o = this.options;
        var regionResizerHandler = BI.createWidget({
            type: "bi.absolute",
            cls: "resizable-table-region-resizer",
            invisible: true,
            width: 6,
            items: [{
                el: {
                    type: "bi.layout",
                    width: 2,
                    cls: "resizable-table-region-resizer-knob"
                },
                left: 2,
                top: 0,
                bottom: 0
            }]
        });
        var size = 0, offset = 0, defaultSize = 0, start = false;
        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX, deltaY) {
            if (mouseMoveTracker.isDragging()) {
                start = true;
                offset += deltaX;
                size = BI.clamp(defaultSize + offset, 30, o.width - 40);

                self.regionResizerHandler.element.addClass("dragging");
                self._setRegionResizerHandlerPosition(size - 3, 0);
            }

        }, function () {
            if (start === true) {
                o.regionColumnSize[0] = BI.clamp(size, 30, o.width - 40);
                self.table.setRegionColumnSize(o.regionColumnSize);
                if (o.isResizeAdapt === true) {
                    var freezeColumnSize = self._getFreezeColumnSize();
                    o.columnSize[self._getFreezeColLength() - 1] += o.regionColumnSize[0] - freezeColumnSize;
                    self.table.setColumnSize(o.columnSize);
                }
                // self.table.populate();
                self._populate();
                self.regionResizerHandler.element.removeClass("dragging");
                self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE);
                start = false;
            }
            mouseMoveTracker.releaseMouseMoves();
        }, _global.document);
        regionResizerHandler.element.on("mousedown", function (event) {
            defaultSize = size = self._getRegionSize();
            offset = 0;
            self._setResizerPosition(0, 0);
            mouseMoveTracker.captureMouseMoves(event);
        });
        return regionResizerHandler;
    },

    _setResizerPosition: function (left, top) {
        this.resizer.element.css({
            left: left + "px",
            top: top + "px"
        });
    },

    _setRegionResizerHandlerPosition: function (left, top) {
        this.regionResizerHandler.element.css({
            left: left + "px",
            top: top + "px"
        });
    },

    _getRegionSize: function () {
        var o = this.options;
        var regionSize = o.regionColumnSize[0] || 0;
        if (o.isNeedFreeze === false || o.freezeCols.length === 0) {
            return 0;
        }
        if (!regionSize) {
            BI.each(o.freezeCols, function (i, col) {
                regionSize += o.columnSize[col];
            });
        }
        return regionSize;
    },

    _getRegionRowSize: function () {
        var o = this.options;
        return [o.header.length * o.headerRowSize,
            Math.min(o.height - o.header.length * o.headerRowSize, o.items.length * o.rowSize)];
    },

    _getFreezeColLength: function () {
        var o = this.options;
        return o.isNeedFreeze === true ? BI.clamp(o.freezeCols.length, 0, o.columnSize.length) : 0;
    },

    _getFreezeColumnSize: function () {
        var columnSize = this.options.columnSize;
        var sum = 0;
        for (var i = 0, len = this._getFreezeColLength(); i < len; i++) {
            sum += columnSize[i];
        }
        return sum;
    },

    _getResizerLeft: function (j) {
        var left = 0;
        var columnSize = this.options.columnSize;
        var freezeColLength = this._getFreezeColLength();
        for (var i = (j >= freezeColLength ? freezeColLength : 0); i < j; i++) {
            left += columnSize[i] || 0;
        }
        if (j >= freezeColLength) {
            left += this.table.getRegionSize();
            left -= this.table.getRightHorizontalScroll();
        } else {
            left -= this.table.getLeftHorizontalScroll();
        }
        return left;
    },

    _formatHeader: function (header) {
        var self = this, o = this.options;
        var result = [];
        var resize = function (j, size) {
            self.resizer.setVisible(true);
            var height = o.headerRowSize + self._getRegionRowSize()[1];
            self.resizer.setHeight(height);
            // TODO 不知道为什么加入这段代码会使得列宽调整出问题
            // if (o.minColumnSize[j]) {
            //     if (size === o.minColumnSize[j]) {
            //         self.resizer.element.addClass("suitable");
            //     } else {
            //         self.resizer.element.removeClass("suitable");
            //     }
            // }
            self._setResizerPosition(self._getResizerLeft(j) + size, (o.header.length - 1) * o.headerRowSize);
        };
        var stop = function (j, size) {
            self.resizer.setVisible(false);
            var columnSize = o.columnSize.slice();
            columnSize[j] = size;
            o.columnSize = columnSize;
            self.table.setColumnSize(columnSize);
            // self.table.populate();
            self._populate();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE);
        };
        BI.each(header, function (i, cols) {
            if (i === header.length - 1) {
                result[i] = [];
                BI.each(cols, function (j, col) {
                    if (j === self._getFreezeColLength() - 1 || j === cols.length - 1) {
                        result[i][j] = col;
                    } else {
                        result[i][j] = {
                            type: "bi.resizable_table_cell",
                            cell: col,
                            suitableSize: o.minColumnSize[j],
                            maxSize: o.maxColumnSize[j],
                            resize: BI.bind(resize, null, j),
                            stop: BI.bind(stop, null, j)
                        };
                        if (o.isNeedMerge) {
                            var r = i;
                            while (r > 0 && self._mergeRule(result[r][j], result[r - 1][j])) {
                                result[r - 1][j] = {
                                    type: "bi.resizable_table_cell",
                                    cell: result[r - 1][j],
                                    suitableSize: o.minColumnSize[j],
                                    maxSize: o.maxColumnSize[j],
                                    resize: BI.bind(resize, null, j),
                                    stop: BI.bind(stop, null, j)
                                };
                                r--;
                            }
                        }
                    }
                });
            } else {
                result.push(cols);
            }
        });
        return result;
    },

    _populate: function () {
        var o = this.options;
        var regionSize = this._getRegionSize();
        if (regionSize > 0) {
            this.regionResizerHandler.setVisible(true);
            this._setRegionResizerHandlerPosition(regionSize - 3, 0);
        } else {
            this.regionResizerHandler.setVisible(false);
        }
    },

    setWidth: function (width) {
        BI.ResizableTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.ResizableTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function () {
        BI.ResizableTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header) {
        if (items) {
            this.options.items = items;
        }
        if (header) {
            this.options.header = header;
            if (this.options.isNeedResize) {
                header = this._formatHeader(header);
            }
        }
        this.table.populate(items, header);
        this._populate();
    }
});

BI.shortcut("bi.resizable_table", BI.ResizableTable);/**
 * 自适应宽度的表格
 *
 * Created by GUY on 2016/2/3.
 * @class BI.AdaptiveTable
 * @extends BI.Widget
 */
BI.AdaptiveTable = BI.inherit(BI.Widget, {

    _const: {
        perColumnSize: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AdaptiveTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-adaptive-table",
            el: {
                type: "bi.resizable_table"
            },
            isNeedResize: true,
            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false, // 是否需要合并单元格
            mergeCols: [], // 合并的单元格列号
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],

            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            header: [],
            items: [], // 二维数组

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.AdaptiveTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: false,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: data.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: data.columnSize,

            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: data.regionColumnSize,

            header: o.header,
            items: o.items,
            // 交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            self._populate();
            self.table.populate();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });

        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.columnSize = this.getColumnSize();
            self._populate();
            self.table.populate();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _getFreezeColLength: function () {
        var o = this.options;
        return o.isNeedFreeze === true ? BI.clamp(o.freezeCols.length, 0, o.columnSize.length) : 0;
    },

    _digest: function () {
        var o = this.options;
        var columnSize = o.columnSize.slice();
        var regionColumnSize = o.regionColumnSize.slice();
        var freezeCols = o.freezeCols.slice();
        var regionSize = o.regionColumnSize[0];
        var freezeColLength = this._getFreezeColLength();
        if (!regionSize || regionSize > o.width - 10 || regionSize < 10) {
            var rs = BI.sum(columnSize, function (i, size) {
                if (i < freezeColLength) {
                    return size;
                }
                return 0;
            });
            regionSize = BI.clamp(rs, 1 / 5 * o.width, 4 / 5 * o.width);
        }
        if (freezeColLength === 0) {
            regionSize = 0;
        }
        if (freezeCols.length >= columnSize.length) {
            freezeCols = [];
        }
        if (!BI.isNumber(columnSize[0])) {
            columnSize = o.minColumnSize.slice();
        }
        var summaryFreezeColumnSize = 0, summaryColumnSize = 0;
        BI.each(columnSize, function (i, size) {
            if (i < freezeColLength) {
                summaryFreezeColumnSize += size;
            }
            summaryColumnSize += size;
        });
        if (freezeColLength > 0) {
            columnSize[freezeColLength - 1] = BI.clamp(regionSize - (summaryFreezeColumnSize - columnSize[freezeColLength - 1]),
                o.minColumnSize[freezeColLength - 1] || 10, o.maxColumnSize[freezeColLength - 1] || Number.MAX_VALUE);
        }
        if (columnSize.length > 0) {
            columnSize[columnSize.length - 1] = BI.clamp(o.width - BI.GridTableScrollbar.SIZE - regionSize - (summaryColumnSize - summaryFreezeColumnSize - columnSize[columnSize.length - 1]),
                o.minColumnSize[columnSize.length - 1] || 10, o.maxColumnSize[columnSize.length - 1] || Number.MAX_VALUE);
        }
        regionColumnSize[0] = regionSize;

        return {
            freezeCols: freezeCols,
            columnSize: columnSize,
            regionColumnSize: regionColumnSize
        };
    },

    _populate: function () {
        var o = this.options;
        var data = this._digest();
        o.regionColumnSize = data.regionColumnSize;
        o.columnSize = data.columnSize;
        this.table.setColumnSize(data.columnSize);
        this.table.setRegionColumnSize(data.regionColumnSize);
        this.table.attr("freezeCols", data.freezeCols);
    },

    setWidth: function (width) {
        BI.AdaptiveTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.AdaptiveTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (regionColumnSize) {
        this.options.regionColumnSize = regionColumnSize;
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key, value) {
        var v = BI.AdaptiveTable.superclass.attr.apply(this, arguments);
        if (key === "freezeCols") {
            return v;
        }
        return this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items) {
        var self = this, o = this.options;
        this._populate();
        this.table.populate.apply(this.table, arguments);
    },

    destroy: function () {
        this.table.destroy();
        BI.AdaptiveTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut("bi.adaptive_table", BI.AdaptiveTable);/**
 *
 * 层级树状结构的表格
 *
 * Created by GUY on 2016/8/12.
 * @class BI.DynamicSummaryLayerTreeTable
 * @extends BI.Widget
 */
BI.DynamicSummaryLayerTreeTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DynamicSummaryLayerTreeTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-dynamic-summary-layer-tree-table",

            el: {
                type: "bi.resizable_table"
            },
            isNeedResize: true, // 是否需要调整列宽
            isResizeAdapt: true, // 是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true, // 是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            // 行表头
            rowHeaderCreator: null,

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            footer: false,
            items: [],

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;// 纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _createHeader: function (vDeep) {
        var self = this, o = this.options;
        var header = o.header || [], crossHeader = o.crossHeader || [];
        var items = BI.TableTree.formatCrossItems(o.crossItems, vDeep, o.headerCellStyleGetter);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [crossHeader[row]];
            result.push(c.concat(node || []));
        });
        var rowHeaderCreator = BI.isFunction(o.rowHeaderCreator) ? o.rowHeaderCreator() : o.rowHeaderCreator;
        if (header && header.length > 0) {
            var newHeader = this._formatColumns(header);
            var deep = this._getHDeep();
            if (deep <= 0) {
                newHeader.unshift(rowHeaderCreator || {
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Row_Header"),
                    styleGetter: o.headerCellStyleGetter
                });
            } else {
                newHeader[0] = rowHeaderCreator || {
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Row_Header"),
                    styleGetter: o.headerCellStyleGetter
                };
            }
            result.push(newHeader);
        }
        return result;
    },

    _formatItems: function (nodes, header, deep) {
        var self = this, o = this.options;
        var result = [];

        function track (node, layer) {
            node.type || (node.type = "bi.layer_tree_table_cell");
            node.layer = layer;
            var next = [node];
            next = next.concat(node.values || []);
            if (next.length > 0) {
                result.push(next);
            }
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    track(child, layer + 1);
                });
            }
        }

        BI.each(nodes, function (i, node) {
            BI.each(node.children, function (j, c) {
                track(c, 0);
            });
            if (BI.isArray(node.values)) {
                var next = [{
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Summary_Values"),
                    styleGetter: function () {
                        return o.summaryCellStyleGetter(true);
                    }
                }].concat(node.values);
                result.push(next);
            }
        });
        return BI.DynamicSummaryTreeTable.formatSummaryItems(result, header, o.crossItems, 1);
    },

    _formatColumns: function (columns, deep) {
        if (BI.isNotEmptyArray(columns)) {
            deep = deep || this._getHDeep();
            return columns.slice(Math.max(0, deep - 1));
        }
        return columns;
    },

    _formatFreezeCols: function () {
        if (this.options.freezeCols.length > 0) {
            return [0];
        }
        return [];
    },

    _formatColumnSize: function (columnSize, deep) {
        if (columnSize.length <= 0) {
            return [];
        }
        var result = [0];
        deep = deep || this._getHDeep();
        BI.each(columnSize, function (i, size) {
            if (i < deep) {
                result[0] += size;
                return;
            }
            result.push(size);
        });
        return result;
    },

    _recomputeColumnSize: function () {
        var o = this.options;
        o.regionColumnSize = this.table.getRegionColumnSize();
        var columnSize = this.table.getColumnSize().slice();
        if (o.freezeCols.length > 1) {
            for (var i = 0; i < o.freezeCols.length - 1; i++) {
                columnSize.splice(1, 0, 0);
            }
        }
        o.columnSize = columnSize;
    },

    _digest: function () {
        var o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        var data = this._formatItems(o.items, header, deep);
        var columnSize = o.columnSize.slice();
        var minColumnSize = o.minColumnSize.slice();
        var maxColumnSize = o.maxColumnSize.slice();
        BI.removeAt(columnSize, data.deletedCols);
        BI.removeAt(minColumnSize, data.deletedCols);
        BI.removeAt(maxColumnSize, data.deletedCols);
        return {
            header: data.header,
            items: data.items,
            columnSize: this._formatColumnSize(columnSize, deep),
            minColumnSize: this._formatColumns(minColumnSize, deep),
            maxColumnSize: this._formatColumns(maxColumnSize, deep),
            freezeCols: this._formatFreezeCols()
        };
    },

    _init: function () {
        BI.DynamicSummaryLayerTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,
            isNeedFreeze: o.isNeedFreeze,
            freezeCols: data.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: [],
            mergeRule: o.mergeRule,
            columnSize: data.columnSize,
            minColumnSize: data.minColumnSize,
            maxColumnSize: data.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: o.regionColumnSize,
            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self._recomputeColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self._recomputeColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    setWidth: function (width) {
        BI.DynamicSummaryLayerTreeTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.DynamicSummaryLayerTreeTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key, value) {
        var self = this;
        if (BI.isObject(key)) {
            BI.each(key, function (k, v) {
                self.attr(k, v);
            });
            return;
        }
        BI.DynamicSummaryLayerTreeTable.superclass.attr.apply(this, arguments);
        switch (key) {
            case "columnSize":
            case "minColumnSize":
            case "maxColumnSize":
            case "freezeCols":
            case "mergeCols":
                return;
        }
        this.table.attr.apply(this.table, [key, value]);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items;
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var data = this._digest();
        this.table.setColumnSize(data.columnSize);
        this.table.attr("minColumnSize", data.minColumnSize);
        this.table.attr("maxColumnSize", data.maxColumnSize);
        this.table.attr("freezeCols", data.freezeCols);
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.DynamicSummaryLayerTreeTable.superclass.destroy.apply(this, arguments);
    }
});

BI.shortcut("bi.dynamic_summary_layer_tree_table", BI.DynamicSummaryLayerTreeTable);/**
 *
 * 树状结构的表格
 *
 * Created by GUY on 2015/8/12.
 * @class BI.DynamicSummaryTreeTable
 * @extends BI.Widget
 */
BI.DynamicSummaryTreeTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DynamicSummaryTreeTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-dynamic-summary-tree-table",
            el: {
                type: "bi.resizable_table"
            },

            isNeedResize: true, // 是否需要调整列宽
            isResizeAdapt: true, // 是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true, // 是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            footer: false,
            items: [],

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;// 纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _init: function () {
        BI.DynamicSummaryTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,

            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            var columnSize = this.getColumnSize();
            var length = o.columnSize.length - columnSize.length;
            o.columnSize = columnSize.slice();
            o.columnSize  = o.columnSize.concat(BI.makeArray(length, 0));
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            var columnSize = this.getColumnSize();
            var length = o.columnSize.length - columnSize.length;
            o.columnSize = columnSize.slice();
            o.columnSize  = o.columnSize.concat(BI.makeArray(length, 0));
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _digest: function () {
        var o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = BI.TableTree.formatHeader(o.header, o.crossHeader, o.crossItems, deep, vDeep, o.headerCellStyleGetter);
        var items = BI.DynamicSummaryTreeTable.formatHorizontalItems(o.items, deep, false, o.summaryCellStyleGetter);
        var data = BI.DynamicSummaryTreeTable.formatSummaryItems(items, header, o.crossItems, deep);
        var columnSize = o.columnSize.slice();
        var minColumnSize = o.minColumnSize.slice();
        var maxColumnSize = o.maxColumnSize.slice();
        BI.removeAt(columnSize, data.deletedCols);
        BI.removeAt(minColumnSize, data.deletedCols);
        BI.removeAt(maxColumnSize, data.deletedCols);
        return {
            header: data.header,
            items: data.items,
            columnSize: columnSize,
            minColumnSize: minColumnSize,
            maxColumnSize: maxColumnSize
        };
    },

    setWidth: function (width) {
        BI.DynamicSummaryTreeTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.DynamicSummaryTreeTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key) {
        BI.DynamicSummaryTreeTable.superclass.attr.apply(this, arguments);
        switch (key) {
            case "minColumnSize":
            case "maxColumnSize":
                return;
        }
        this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items;
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var data = this._digest();
        this.table.setColumnSize(data.columnSize);
        this.table.attr("minColumnSize", data.minColumnSize);
        this.table.attr("maxColumnSize", data.maxColumnSize);
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.DynamicSummaryTreeTable.superclass.destroy.apply(this, arguments);
    }
});

BI.extend(BI.DynamicSummaryTreeTable, {

    formatHorizontalItems: function (nodes, deep, isCross, styleGetter) {
        var result = [];

        function track (store, node) {
            var next;
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var next;
                    if (store != -1) {
                        next = store.slice();
                        next.push(node);
                    } else {
                        next = [];
                    }
                    track(next, child);
                });
                if (store != -1) {
                    next = store.slice();
                    next.push(node);
                } else {
                    next = [];
                }
                if ((store == -1 || node.children.length > 1) && BI.isNotEmptyArray(node.values)) {
                    var summary = {
                        text: BI.i18nText("BI-Summary_Values"),
                        type: "bi.table_style_cell",
                        styleGetter: function () {
                            return styleGetter(store === -1);
                        }
                    };
                    for (var i = next.length; i < deep; i++) {
                        next.push(summary);
                    }
                    if (!isCross) {
                        next = next.concat(node.values);
                    }
                    if (next.length > 0) {
                        if (!isCross) {
                            result.push(next);
                        } else {
                            for (var k = 0, l = node.values.length; k < l; k++) {
                                result.push(next);
                            }
                        }
                    }
                }
                return;
            }
            if (store != -1) {
                next = store.slice();
                for (var i = next.length; i < deep; i++) {
                    next.push(node);
                }
            } else {
                next = [];
            }
            if (!isCross && BI.isArray(node.values)) {
                next = next.concat(node.values);
            }
            if (isCross && BI.isArray(node.values)) {
                for (var i = 0, len = node.values.length; i < len - 1; i++) {
                    if (next.length > 0) {
                        result.push(next);
                    }
                }
            }
            if (next.length > 0) {
                result.push(next);
            }
        }

        BI.each(nodes, function (i, node) {
            track(-1, node);
        });
        // 填充空位
        BI.each(result, function (i, line) {
            var last = BI.last(line);
            for (var j = line.length; j < deep; j++) {
                line.push(last);
            }
        });
        return result;
    },

    formatSummaryItems: function (items, header, crossItems, deep) {
        // 求纵向需要去除的列
        var cols = [];
        var leaf = 0;

        function track (node) {
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    track(child);
                });
                if (BI.isNotEmptyArray(node.values)) {
                    if (node.children.length === 1) {
                        for (var i = 0; i < node.values.length; i++) {
                            cols.push(leaf + i + deep);
                        }
                    }
                    leaf += node.values.length;
                }
                return;
            }
            if (node.values && node.values.length > 1) {
                leaf += node.values.length;
            } else {
                leaf++;
            }
        }

        BI.each(crossItems, function (i, node) {
            track(node);
        });

        if (cols.length > 0) {
            var nHeader = [], nItems = [];
            BI.each(header, function (i, node) {
                var nNode = node.slice();
                BI.removeAt(nNode, cols);
                nHeader.push(nNode);
            });
            BI.each(items, function (i, node) {
                var nNode = node.slice();
                BI.removeAt(nNode, cols);
                nItems.push(nNode);
            });
            header = nHeader;
            items = nItems;
        }
        return {items: items, header: header, deletedCols: cols};
    }
});

BI.shortcut("bi.dynamic_summary_tree_table", BI.DynamicSummaryTreeTable);/**
 * Created by GUY on 2016/5/7.
 * @class BI.LayerTreeTableCell
 * @extends BI.Single
 */
BI.LayerTreeTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LayerTreeTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-layer-tree-table-cell",
            layer: 0,
            text: ""
        });
    },

    _init: function () {
        BI.LayerTreeTableCell.superclass._init.apply(this, arguments);
        var o = this.options;
        BI.createWidget({
            type: "bi.label",
            element: this.element,
            textAlign: "left",
            whiteSpace: "nowrap",
            height: o.height,
            text: o.text,
            value: o.value,
            lgap: 5 + 30 * o.layer,
            rgap: 5
        });
    }
});

BI.shortcut("bi.layer_tree_table_cell", BI.LayerTreeTableCell);/**
 *
 * 层级树状结构的表格
 *
 * Created by GUY on 2016/5/7.
 * @class BI.LayerTreeTable
 * @extends BI.Widget
 */
BI.LayerTreeTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LayerTreeTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-layer-tree-table",
            el: {
                type: "bi.resizable_table"
            },

            isNeedResize: false, // 是否需要调整列宽
            isResizeAdapt: true, // 是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true, // 是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],

            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            rowHeaderCreator: null,

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [],

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;// 纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _createHeader: function (vDeep) {
        var self = this, o = this.options;
        var header = o.header || [], crossHeader = o.crossHeader || [];
        var items = BI.TableTree.formatCrossItems(o.crossItems, vDeep, o.headerCellStyleGetter);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [crossHeader[row]];
            result.push(c.concat(node || []));
        });
        if (header && header.length > 0) {
            var newHeader = this._formatColumns(header);
            var deep = this._getHDeep();
            if (deep <= 0) {
                newHeader.unshift(o.rowHeaderCreator || {
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Row_Header"),
                    styleGetter: o.headerCellStyleGetter
                });
            } else {
                newHeader[0] = o.rowHeaderCreator || {
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Row_Header"),
                    styleGetter: o.headerCellStyleGetter
                };
            }
            result.push(newHeader);
        }
        return result;
    },

    _formatItems: function (nodes) {
        var self = this, o = this.options;
        var result = [];

        function track (node, layer) {
            node.type || (node.type = "bi.layer_tree_table_cell");
            node.layer = layer;
            var next = [node];
            next = next.concat(node.values || []);
            if (next.length > 0) {
                result.push(next);
            }
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    track(child, layer + 1);
                });
            }
        }

        BI.each(nodes, function (i, node) {
            BI.each(node.children, function (j, c) {
                track(c, 0);
            });
            if (BI.isArray(node.values)) {
                var next = [{
                    type: "bi.table_style_cell", text: BI.i18nText("BI-Summary_Values"), styleGetter: function () {
                        return o.summaryCellStyleGetter(true);
                    }
                }].concat(node.values);
                result.push(next);
            }
        });
        return result;
    },

    _formatColumns: function (columns, deep) {
        if (BI.isNotEmptyArray(columns)) {
            deep = deep || this._getHDeep();
            return columns.slice(Math.max(0, deep - 1));
        }
        return columns;
    },

    _formatFreezeCols: function () {
        if (this.options.freezeCols.length > 0) {
            return [0];
        }
        return [];
    },

    _formatColumnSize: function (columnSize, deep) {
        if (columnSize.length <= 0) {
            return [];
        }
        var result = [0];
        deep = deep || this._getHDeep();
        BI.each(columnSize, function (i, size) {
            if (i < deep) {
                result[0] += size;
                return;
            }
            result.push(size);
        });
        return result;
    },

    _digest: function () {
        var o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        return {
            header: this._createHeader(vDeep),
            items: this._formatItems(o.items),
            columnSize: this._formatColumnSize(o.columnSize, deep),
            minColumnSize: this._formatColumns(o.minColumnSize, deep),
            maxColumnSize: this._formatColumns(o.maxColumnSize, deep),
            freezeCols: this._formatFreezeCols()
        };
    },

    _init: function () {
        BI.LayerTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,
            isNeedFreeze: o.isNeedFreeze,
            freezeCols: data.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: [],
            mergeRule: o.mergeRule,
            columnSize: data.columnSize,
            minColumnSize: data.minColumnSize,
            maxColumnSize: data.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: o.regionColumnSize,
            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    setWidth: function (width) {
        BI.LayerTreeTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.LayerTreeTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        var columnSize = this.table.getColumnSize();
        var deep = this._getHDeep();
        var pre = [];
        if (deep > 0) {
            pre = BI.makeArray(deep, columnSize[0] / deep);
        }
        return pre.concat(columnSize.slice(1));
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key, value) {
        var self = this;
        if (BI.isObject(key)) {
            BI.each(key, function (k, v) {
                self.attr(k, v);
            });
            return;
        }
        BI.LayerTreeTable.superclass.attr.apply(this, arguments);
        switch (key) {
            case "columnSize":
            case "minColumnSize":
            case "maxColumnSize":
            case "freezeCols":
            case "mergeCols":
                return;
        }
        this.table.attr.apply(this.table, [key, value]);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        o.items = items || [];
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var data = this._digest();
        this.table.setColumnSize(data.columnSize);
        this.table.attr("freezeCols", data.freezeCols);
        this.table.attr("minColumnSize", data.minColumnSize);
        this.table.attr("maxColumnSize", data.maxColumnSize);
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.LayerTreeTable.superclass.destroy.apply(this, arguments);
    }
});

BI.shortcut("bi.layer_tree_table", BI.LayerTreeTable);/**
 *
 * Created by GUY on 2016/5/26.
 * @class BI.TableStyleCell
 * @extends BI.Single
 */
BI.TableStyleCell = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.TableStyleCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-style-cell",
            styleGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.TableStyleCell.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            height: o.height,
            textAlign: "left",
            forceCenter: true,
            hgap: 5,
            text: o.text
        });
        this._digestStyle();
    },

    _digestStyle: function () {
        var o = this.options;
        var style = o.styleGetter();
        if (style) {
            this.text.element.css(style);
        }
    },

    setText: function (text) {
        this.text.setText(text);
    },

    populate: function () {
        this._digestStyle();
    }
});
BI.shortcut("bi.table_style_cell", BI.TableStyleCell);/**
 *
 * 树状结构的表格
 *
 * Created by GUY on 2015/9/22.
 * @class BI.TableTree
 * @extends BI.Widget
 */
BI.TableTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TableTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-tree",
            el: {
                type: "bi.resizable_table"
            },
            isNeedResize: true, // 是否需要调整列宽
            isResizeAdapt: true, // 是否需要在调整列宽或区域宽度的时候它们自适应变化

            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true, // 是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [],

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;// 纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _init: function () {
        BI.TableTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,

            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _digest: function () {
        var self = this, o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = BI.TableTree.formatHeader(o.header, o.crossHeader, o.crossItems, deep, vDeep, o.headerCellStyleGetter);
        var items = BI.TableTree.formatItems(o.items, deep, false, o.summaryCellStyleGetter);
        return {
            header: header,
            items: items
        };
    },

    setWidth: function (width) {
        BI.TableTree.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.TableTree.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function () {
        BI.TableTree.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items || [];
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var data = this._digest();
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.TableTree.superclass.destroy.apply(this, arguments);
    }
});

BI.extend(BI.TableTree, {
    formatHeader: function (header, crossHeader, crossItems, hDeep, vDeep, styleGetter) {
        var items = BI.TableTree.formatCrossItems(crossItems, vDeep, styleGetter);
        var result = [];
        for (var i = 0; i < vDeep; i++) {
            var c = [];
            for (var j = 0; j < hDeep; j++) {
                c.push(crossHeader[i]);
            }
            result.push(c.concat(items[i] || []));
        }
        if (header && header.length > 0) {
            result.push(header);
        }
        return result;
    },

    formatItems: function (nodes, deep, isCross, styleGetter) {
        var self = this;
        var result = [];

        function track (store, node) {
            var next;
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var next;
                    if (store != -1) {
                        next = store.slice();
                        next.push(node);
                    } else {
                        next = [];
                    }
                    track(next, child);
                });
                if (store != -1) {
                    next = store.slice();
                    next.push(node);
                } else {
                    next = [];
                }
                if (/** (store == -1 || node.children.length > 1) &&**/ BI.isNotEmptyArray(node.values)) {
                    var summary = {
                        text: BI.i18nText("BI-Summary_Values"),
                        type: "bi.table_style_cell",
                        styleGetter: function () {
                            return styleGetter(store === -1);
                        }
                    };
                    for (var i = next.length; i < deep; i++) {
                        next.push(summary);
                    }
                    if (!isCross) {
                        next = next.concat(node.values);
                    }
                    if (next.length > 0) {
                        if (!isCross) {
                            result.push(next);
                        } else {
                            for (var k = 0, l = node.values.length; k < l; k++) {
                                result.push(next);
                            }
                        }
                    }
                }

                return;
            }
            if (store != -1) {
                next = store.slice();
                for (var i = next.length; i < deep; i++) {
                    next.push(node);
                }
            } else {
                next = [];
            }
            if (!isCross && BI.isArray(node.values)) {
                next = next.concat(node.values);
            }
            if (isCross && BI.isArray(node.values)) {
                for (var i = 0, len = node.values.length; i < len - 1; i++) {
                    if (next.length > 0) {
                        result.push(next);
                    }
                }
            }
            if (next.length > 0) {
                result.push(next);
            }
        }

        BI.each(nodes, function (i, node) {
            track(-1, node);
        });
        // 填充空位
        BI.each(result, function (i, line) {
            var last = BI.last(line);
            for (var j = line.length; j < deep; j++) {
                line.push(last);
            }
        });
        return result;
    },

    formatCrossItems: function (nodes, deep, styleGetter) {
        var items = BI.TableTree.formatItems(nodes, deep, true, styleGetter);
        return BI.unzip(items);
    },

    maxDeep: function (nodes) {
        function track (deep, node) {
            var d = deep;
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    d = Math.max(d, track(deep + 1, child));
                });
            }
            return d;
        }

        var deep = 1;
        if (BI.isObject(nodes)) {
            BI.each(nodes, function (i, node) {
                deep = Math.max(deep, track(1, node));
            });
        }
        return deep;
    }
});

BI.shortcut("bi.tree_table", BI.TableTree);(function () {
    var clamp = function (min, value, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    };

    var BUFFER_ROWS = 5;
    var NO_ROWS_SCROLL_RESULT = {
        index: 0,
        offset: 0,
        position: 0,
        contentHeight: 0
    };

    BI.TableScrollHelper = function (rowCount,
        defaultRowHeight,
        viewportHeight,
        rowHeightGetter) {
        this._rowOffsets = BI.PrefixIntervalTree.uniform(rowCount, defaultRowHeight);
        this._storedHeights = new Array(rowCount);
        for (var i = 0; i < rowCount; ++i) {
            this._storedHeights[i] = defaultRowHeight;
        }
        this._rowCount = rowCount;
        this._position = 0;
        this._contentHeight = rowCount * defaultRowHeight;
        this._defaultRowHeight = defaultRowHeight;
        this._rowHeightGetter = rowHeightGetter ?
            rowHeightGetter : function () {
                return defaultRowHeight;
            };
        this._viewportHeight = viewportHeight;

        this._updateHeightsInViewport(0, 0);
    };

    BI.TableScrollHelper.prototype = {
        constructor: BI.TableScrollHelper,
        setRowHeightGetter: function (rowHeightGetter) {
            this._rowHeightGetter = rowHeightGetter;
        },

        setViewportHeight: function (viewportHeight) {
            this._viewportHeight = viewportHeight;
        },

        getContentHeight: function () {
            return this._contentHeight;
        },

        _updateHeightsInViewport: function (firstRowIndex,
            firstRowOffset) {
            var top = firstRowOffset;
            var index = firstRowIndex;
            while (top <= this._viewportHeight && index < this._rowCount) {
                this._updateRowHeight(index);
                top += this._storedHeights[index];
                index++;
            }
        },

        _updateHeightsAboveViewport: function (firstRowIndex) {
            var index = firstRowIndex - 1;
            while (index >= 0 && index >= firstRowIndex - BUFFER_ROWS) {
                var delta = this._updateRowHeight(index);
                this._position += delta;
                index--;
            }
        },

        _updateRowHeight: function (rowIndex) {
            if (rowIndex < 0 || rowIndex >= this._rowCount) {
                return 0;
            }
            var newHeight = this._rowHeightGetter(rowIndex);
            if (newHeight !== this._storedHeights[rowIndex]) {
                var change = newHeight - this._storedHeights[rowIndex];
                this._rowOffsets.set(rowIndex, newHeight);
                this._storedHeights[rowIndex] = newHeight;
                this._contentHeight += change;
                return change;
            }
            return 0;
        },

        getRowPosition: function (rowIndex) {
            this._updateRowHeight(rowIndex);
            return this._rowOffsets.sumUntil(rowIndex);
        },

        scrollBy: function (delta) {
            if (this._rowCount === 0) {
                return NO_ROWS_SCROLL_RESULT;
            }
            var firstRow = this._rowOffsets.greatestLowerBound(this._position);
            firstRow = clamp(firstRow, 0, Math.max(this._rowCount - 1, 0));
            var firstRowPosition = this._rowOffsets.sumUntil(firstRow);
            var rowIndex = firstRow;
            var position = this._position;

            var rowHeightChange = this._updateRowHeight(rowIndex);
            if (firstRowPosition !== 0) {
                position += rowHeightChange;
            }
            var visibleRowHeight = this._storedHeights[rowIndex] -
                (position - firstRowPosition);

            if (delta >= 0) {

                while (delta > 0 && rowIndex < this._rowCount) {
                    if (delta < visibleRowHeight) {
                        position += delta;
                        delta = 0;
                    } else {
                        delta -= visibleRowHeight;
                        position += visibleRowHeight;
                        rowIndex++;
                    }
                    if (rowIndex < this._rowCount) {
                        this._updateRowHeight(rowIndex);
                        visibleRowHeight = this._storedHeights[rowIndex];
                    }
                }
            } else if (delta < 0) {
                delta = -delta;
                var invisibleRowHeight = this._storedHeights[rowIndex] - visibleRowHeight;

                while (delta > 0 && rowIndex >= 0) {
                    if (delta < invisibleRowHeight) {
                        position -= delta;
                        delta = 0;
                    } else {
                        position -= invisibleRowHeight;
                        delta -= invisibleRowHeight;
                        rowIndex--;
                    }
                    if (rowIndex >= 0) {
                        var change = this._updateRowHeight(rowIndex);
                        invisibleRowHeight = this._storedHeights[rowIndex];
                        position += change;
                    }
                }
            }

            var maxPosition = this._contentHeight - this._viewportHeight;
            position = clamp(position, 0, maxPosition);
            this._position = position;
            var firstRowIndex = this._rowOffsets.greatestLowerBound(position);
            firstRowIndex = clamp(firstRowIndex, 0, Math.max(this._rowCount - 1, 0));
            firstRowPosition = this._rowOffsets.sumUntil(firstRowIndex);
            var firstRowOffset = firstRowPosition - position;

            this._updateHeightsInViewport(firstRowIndex, firstRowOffset);
            this._updateHeightsAboveViewport(firstRowIndex);

            return {
                index: firstRowIndex,
                offset: firstRowOffset,
                position: this._position,
                contentHeight: this._contentHeight
            };
        },

        _getRowAtEndPosition: function (rowIndex) {
            // We need to update enough rows above the selected one to be sure that when
            // we scroll to selected position all rows between first shown and selected
            // one have most recent heights computed and will not resize
            this._updateRowHeight(rowIndex);
            var currentRowIndex = rowIndex;
            var top = this._storedHeights[currentRowIndex];
            while (top < this._viewportHeight && currentRowIndex >= 0) {
                currentRowIndex--;
                if (currentRowIndex >= 0) {
                    this._updateRowHeight(currentRowIndex);
                    top += this._storedHeights[currentRowIndex];
                }
            }
            var position = this._rowOffsets.sumTo(rowIndex) - this._viewportHeight;
            if (position < 0) {
                position = 0;
            }
            return position;
        },

        scrollTo: function (position) {
            if (this._rowCount === 0) {
                return NO_ROWS_SCROLL_RESULT;
            }
            if (position <= 0) {
                // If position less than or equal to 0 first row should be fully visible
                // on top
                this._position = 0;
                this._updateHeightsInViewport(0, 0);

                return {
                    index: 0,
                    offset: 0,
                    position: this._position,
                    contentHeight: this._contentHeight
                };
            } else if (position >= this._contentHeight - this._viewportHeight) {
                // If position is equal to or greater than max scroll value, we need
                // to make sure to have bottom border of last row visible.
                var rowIndex = this._rowCount - 1;
                position = this._getRowAtEndPosition(rowIndex);
            }
            this._position = position;

            var firstRowIndex = this._rowOffsets.greatestLowerBound(position);
            firstRowIndex = clamp(firstRowIndex, 0, Math.max(this._rowCount - 1, 0));
            var firstRowPosition = this._rowOffsets.sumUntil(firstRowIndex);
            var firstRowOffset = firstRowPosition - position;

            this._updateHeightsInViewport(firstRowIndex, firstRowOffset);
            this._updateHeightsAboveViewport(firstRowIndex);

            return {
                index: firstRowIndex,
                offset: firstRowOffset,
                position: this._position,
                contentHeight: this._contentHeight
            };
        },

        /**
         * Allows to scroll to selected row with specified offset. It always
         * brings that row to top of viewport with that offset
         */
        scrollToRow: function (rowIndex, offset) {
            rowIndex = clamp(rowIndex, 0, Math.max(this._rowCount - 1, 0));
            offset = clamp(offset, -this._storedHeights[rowIndex], 0);
            var firstRow = this._rowOffsets.sumUntil(rowIndex);
            return this.scrollTo(firstRow - offset);
        },

        /**
         * Allows to scroll to selected row by bringing it to viewport with minimal
         * scrolling. This that if row is fully visible, scroll will not be changed.
         * If top border of row is above top of viewport it will be scrolled to be
         * fully visible on the top of viewport. If the bottom border of row is
         * below end of viewport, it will be scrolled up to be fully visible on the
         * bottom of viewport.
         */
        scrollRowIntoView: function (rowIndex) {
            rowIndex = clamp(rowIndex, 0, Math.max(this._rowCount - 1, 0));
            var rowBegin = this._rowOffsets.sumUntil(rowIndex);
            var rowEnd = rowBegin + this._storedHeights[rowIndex];
            if (rowBegin < this._position) {
                return this.scrollTo(rowBegin);
            } else if (this._position + this._viewportHeight < rowEnd) {
                var position = this._getRowAtEndPosition(rowIndex);
                return this.scrollTo(position);
            }
            return this.scrollTo(this._position);
        }
    };

})();
/**
 * 预览表列
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTableCell
 * @extends BI.Widget
 */
BI.PreviewTableCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table-cell",
            text: ""
        });
    },

    _init: function () {
        BI.PreviewTableCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign || "left",
            whiteSpace: o.whiteSpace || "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value,
            lgap: o.lgap,
            rgap: o.rgap,
            hgap: o.hgap || 5
        });
    }
});
BI.shortcut("bi.preview_table_cell", BI.PreviewTableCell);/**
 * 预览表
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTableHeaderCell
 * @extends BI.Widget
 */
BI.PreviewTableHeaderCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table-header-cell",
            text: ""
        });
    },

    _init: function () {
        BI.PreviewTableHeaderCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign || "left",
            whiteSpace: o.whiteSpace || "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value,
            lgap: o.lgap,
            rgap: o.rgap,
            hgap: o.hgap || 5
        });
    }
});
BI.shortcut("bi.preview_table_header_cell", BI.PreviewTableHeaderCell);/**
 * 预览表
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTable
 * @extends BI.Widget
 */
BI.PreviewTable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table",
            isNeedFreeze: false,
            freezeCols: [],
            rowSize: null,
            columnSize: [],
            headerRowSize: 30,
            header: [],
            items: []
        });
    },

    _init: function () {
        BI.PreviewTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this,
            isNeedResize: false,

            isResizeAdapt: false,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            rowSize: o.rowSize,
            columnSize: o.columnSize,
            headerRowSize: o.headerRowSize,

            header: BI.map(o.header, function (i, items) {
                return BI.map(items, function (j, item) {
                    return BI.extend({
                        type: "bi.preview_table_header_cell"
                    }, item);
                });
            }),
            items: BI.map(o.items, function (i, items) {
                return BI.map(items, function (j, item) {
                    return BI.extend({
                        type: "bi.preview_table_cell"
                    }, item);
                });
            })
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self._adjustColumns();
        });
        this._adjustColumns();
    },

    // 是否有自适应调节的列，即列宽为""
    _hasAdaptCol: function (columnSize) {
        return BI.any(columnSize, function (i, size) {
            return size === "";
        });
    },

    _isPercentage: function (columnSize) {
        return columnSize[0] <= 1;
    },

    _adjustColumns: function () {
        var self = this, o = this.options;
        if (o.isNeedFreeze === true) {
            // 如果存在百分比的情况
            if (this._isPercentage(o.columnSize)) {
                if (this._hasAdaptCol(o.columnSize)) {
                    var findCols = [], remain = 0;
                    BI.each(o.columnSize, function (i, size) {
                        if (size === "") {
                            findCols.push(i);
                        } else {
                            remain += size;
                        }
                    });
                    remain = 1 - remain;
                    var average = remain / findCols.length;
                    BI.each(findCols, function (i, col) {
                        o.columnSize[col] = average;
                    });
                }
                var isRight = BI.first(o.freezeCols) !== 0;
                var freezeSize = [], notFreezeSize = [];
                BI.each(o.columnSize, function (i, size) {
                    if (o.freezeCols.contains(i)) {
                        freezeSize.push(size);
                    } else {
                        notFreezeSize.push(size);
                    }
                });
                var sumFreezeSize = BI.sum(freezeSize), sumNotFreezeSize = BI.sum(notFreezeSize);
                BI.each(freezeSize, function (i, size) {
                    freezeSize[i] = size / sumFreezeSize;
                });
                BI.each(notFreezeSize, function (i, size) {
                    notFreezeSize[i] = size / sumNotFreezeSize;
                });
                this.table.setRegionColumnSize(isRight ? ["fill", sumFreezeSize] : [sumFreezeSize, "fill"]);
                this.table.setColumnSize(isRight ? (notFreezeSize.concat(freezeSize)) : (freezeSize.concat(notFreezeSize)));
            }
        } else {
            // 如果存在自适应宽度的列或者是百分比计算的列，需要将整个表宽设为100%
            if (this._hasAdaptCol(o.columnSize) || this._isPercentage(o.columnSize)) {
                this.table.setRegionColumnSize(["100%"]);
            }
        }
    },

    setColumnSize: function (columnSize) {
        return this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        return this.table.setHeaderColumnSize(columnSize);
    },

    setRegionColumnSize: function (columnSize) {
        return this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        return this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        return this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        return this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    getColumns: function () {
        return this.table.getColumns();
    },

    populate: function (items, header) {
        if (items) {
            items = BI.map(items, function (i, items) {
                return BI.map(items, function (j, item) {
                    return BI.extend({
                        type: "bi.preview_table_cell"
                    }, item);
                });
            });
        }
        if (header) {
            header = BI.map(header, function (i, items) {
                return BI.map(items, function (j, item) {
                    return BI.extend({
                        type: "bi.preview_table_header_cell"
                    }, item);
                });
            });
        }
        this.table.populate(items, header);
        this._adjustColumns();
    }
});
BI.PreviewTable.EVENT_CHANGE = "PreviewTable.EVENT_CHANGE";
BI.shortcut("bi.preview_table", BI.PreviewTable);/**
 * 自适应宽度的表格
 *
 * Created by GUY on 2016/2/3.
 * @class BI.ResponisveTable
 * @extends BI.Widget
 */
BI.ResponisveTable = BI.inherit(BI.Widget, {

    _const: {
        perColumnSize: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.ResponisveTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-responsive-table",
            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为true时生效
            logic: { // 冻结的页面布局逻辑
                dynamic: false
            },

            isNeedMerge: false, // 是否需要合并单元格
            mergeCols: [], // 合并的单元格列号
            mergeRule: function (row1, row2) { // 合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: false,

            header: [],
            footer: false,
            items: [], // 二维数组

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.ResponisveTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this,
            logic: o.logic,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            header: o.header,
            footer: o.footer,
            items: o.items,
            // 交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self._initRegionSize();
            self.table.resize();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self._resizeRegion();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_REGION_RESIZE, function () {
            // important:在冻结并自适应列宽的情况下要随时变更表头宽度
            if (o.isNeedResize === true && self._isAdaptiveColumn()) {
                self._resizeHeader();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });

        this.table.on(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, function () {
            self._resizeBody();
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self._resizeRegion();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _initRegionSize: function () {
        var o = this.options;
        if (o.isNeedFreeze === true) {
            var regionColumnSize = this.table.getRegionColumnSize();
            var maxWidth = this.table.element.width();
            if (!regionColumnSize[0] || (regionColumnSize[0] === "fill") || regionColumnSize[0] > maxWidth || regionColumnSize[1] > maxWidth) {
                var freezeCols = o.freezeCols;
                if (freezeCols.length === 0) {
                    this.table.setRegionColumnSize([0, "fill"]);
                } else if (freezeCols.length > 0 && freezeCols.length < o.columnSize.length) {
                    var size = maxWidth / 3;
                    if (freezeCols.length > o.columnSize.length / 2) {
                        size = maxWidth * 2 / 3;
                    }
                    this.table.setRegionColumnSize([size, "fill"]);
                } else {
                    this.table.setRegionColumnSize(["fill", 0]);
                }
            }
        }
    },

    _getBlockSize: function () {
        var o = this.options;
        var columnSize = this.table.getCalculateColumnSize();
        if (o.isNeedFreeze === true) {
            var columnSizeLeft = [], columnSizeRight = [];
            BI.each(columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    columnSizeLeft.push(size);
                } else {
                    columnSizeRight.push(size);
                }
            });
            // 因为有边框，所以加上数组长度的参数调整
            var sumLeft = BI.sum(columnSizeLeft) + columnSizeLeft.length,
                sumRight = BI.sum(columnSizeRight) + columnSizeRight.length;
            return {
                sumLeft: sumLeft,
                sumRight: sumRight,
                left: columnSizeLeft,
                right: columnSizeRight
            };
        }
        return {
            size: columnSize,
            sum: BI.sum(columnSize) + columnSize.length
        };
    },

    _isAdaptiveColumn: function (columnSize) {
        return !(BI.last(columnSize || this.table.getColumnSize()) > 1.05);
    },

    _resizeHeader: function () {
        var self = this, o = this.options;
        if (o.isNeedFreeze === true) {
            // 若是当前处于自适应调节阶段
            if (this._isAdaptiveColumn()) {
                var columnSize = this.table.getCalculateColumnSize();
                this.table.setHeaderColumnSize(columnSize);
            } else {
                var regionColumnSize = this.table.getClientRegionColumnSize();
                var block = this._getBlockSize();
                var sumLeft = block.sumLeft, sumRight = block.sumRight;
                var columnSizeLeft = block.left, columnSizeRight = block.right;
                columnSizeLeft[columnSizeLeft.length - 1] += regionColumnSize[0] - sumLeft;
                columnSizeRight[columnSizeRight.length - 1] += regionColumnSize[1] - sumRight;

                var newLeft = BI.clone(columnSizeLeft), newRight = BI.clone(columnSizeRight);
                newLeft[newLeft.length - 1] = "";
                newRight[newRight.length - 1] = "";
                this.table.setColumnSize(newLeft.concat(newRight));

                block = self._getBlockSize();
                if (columnSizeLeft[columnSizeLeft.length - 1] < block.left[block.left.length - 1]) {
                    columnSizeLeft[columnSizeLeft.length - 1] = block.left[block.left.length - 1];
                }
                if (columnSizeRight[columnSizeRight.length - 1] < block.right[block.right.length - 1]) {
                    columnSizeRight[columnSizeRight.length - 1] = block.right[block.right.length - 1];
                }

                self.table.setColumnSize(columnSizeLeft.concat(columnSizeRight));
            }
        } else {
            if (!this._isAdaptiveColumn()) {
                var regionColumnSize = this.table.getClientRegionColumnSize();
                var block = this._getBlockSize();
                var sum = block.sum;
                var size = block.size;

                size[size.length - 1] += regionColumnSize[0] - sum;

                var newSize = BI.clone(size);
                newSize[newSize.length - 1] = "";
                this.table.setColumnSize(newSize);
                block = this._getBlockSize();

                if (size[size.length - 1] < block.size[block.size.length - 1]) {
                    size[size.length - 1] = block.size[block.size.length - 1];
                }
                this.table.setColumnSize(size);
            }
        }
    },

    _resizeBody: function () {
        if (this._isAdaptiveColumn()) {
            var columnSize = this.table.getCalculateColumnSize();
            this.setColumnSize(columnSize);
        }
    },

    _adjustRegion: function () {
        var o = this.options;
        var regionColumnSize = this.table.getCalculateRegionColumnSize();
        if (o.isNeedFreeze === true && o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
            var block = this._getBlockSize();
            var sumLeft = block.sumLeft, sumRight = block.sumRight;
            if (sumLeft < regionColumnSize[0] || regionColumnSize[0] >= (sumLeft + sumRight)) {
                this.table.setRegionColumnSize([sumLeft, "fill"]);
            }
            this._resizeRegion();
        }
    },

    _resizeRegion: function () {
        var o = this.options;
        var regionColumnSize = this.table.getCalculateRegionColumnSize();
        if (o.isNeedFreeze === true && o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
            var maxWidth = this.table.element.width();
            if (regionColumnSize[0] < 15 || regionColumnSize[1] < 15) {
                var freezeCols = o.freezeCols;
                var size = maxWidth / 3;
                if (freezeCols.length > o.columnSize.length / 2) {
                    size = maxWidth * 2 / 3;
                }
                this.table.setRegionColumnSize([size, "fill"]);
            }
        }
    },


    resize: function () {
        this.table.resize();
        this._resizeRegion();
        this._resizeHeader();
    },

    setColumnSize: function (columnSize) {
        this.table.setColumnSize(columnSize);
        this._adjustRegion();
        this._resizeHeader();
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        this.table.setHeaderColumnSize(columnSize);
        this._adjustRegion();
        this._resizeHeader();
    },

    setRegionColumnSize: function (columnSize) {
        this.table.setRegionColumnSize(columnSize);
        this._resizeHeader();
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    getColumns: function () {
        return this.table.getColumns();
    },

    attr: function () {
        BI.ResponisveTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    populate: function (items) {
        var self = this, o = this.options;
        this.table.populate.apply(this.table, arguments);
        if (o.isNeedFreeze === true) {
            BI.nextTick(function () {
                self._initRegionSize();
                self.table.resize();
                self._resizeHeader();
            });
        }
    }
});
BI.shortcut("bi.responsive_table", BI.ResponisveTable);