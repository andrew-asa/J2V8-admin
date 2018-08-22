/*!webui - 1.0.0 - author - 2018-08-22 19:21:15 *//**
 * author: young
 * createdDate: 2018/3/15
 * description: 获取后台计算相关 主要为控件和组件获取数据
 */

!(function () {
    BI.Utils = BI.Utils || {};
    var moduleRouter = "/design" + (BI.pool.moduleRouter || "");
    BI.extend(BI.Utils, {

        getWidgetData: function (widgetSetting, callback) {
            this._reqPost("/widget/data", widgetSetting, callback);
        },

        getTargetRangeWidthDimensions: function (data, callback) {
            this._reqPost("/dimensions/target/range", data, callback);
        },

        getFormulaResult: function (data, callback) {
            this._reqPost("/formula/result", data, callback);
        },

        getDimensionRange: function (data, callback) {
            this._reqPost("/dimension/range", data, callback);
        },

        getDimensionDomain: function (data, callback) {
            this._reqPost("/dimension/domain", data, callback);
        },

        getGisOptions: function (callback) {
            this._reqGet("/map/layers", {}, callback);
        },

        getSummaryValuesByTargetIds: function (settings, callback) {
            this._reqPost("/widget/data/summary", settings, callback);
        },

        getJumpFieldInfoByFieldIds: function (setting, callback) {
            this._reqPost("/widget/jump/fields", setting, function (res) {
                callback(res.data);
            });
        },

        getAllReportList: function (callback, complete) {
            this._reqGet("/dashboard/list/all", "", callback, complete);
        },

        getGeoData: function (options, callback) {
            this._reqPost("/widget/map/geometry", options, callback);
        },

        getTooltipInfo: function (options, callback) {
            this._reqPost("/widget/chart/tooltip", options, callback, null, {noProgress: true});
        },

        getGeoPath: function (options, callback) {
            this._reqPost("/widget/map/folder", options, callback);
        },

        getFieldDataById: function (options, callback) {
            var _callback = function (tableData) {
                var data = [];

                BI.some(tableData.data.fields, function (idx, item) {
                    if (item.id === options.fieldId) {
                        BI.each(tableData.data.data, function (index, arr) {
                            data.push(arr[idx]);
                        });
                        return true;
                    }
                });

                tableData.data = BI.union(data);

                callback(tableData);
            };

            BI.Utils.getFields4Design(options.tableName, _callback);
        },

        // 用于控件中的自定义排序
        getDimensionDataByDimension: function (tableName, dimension, callback) {
            var view = {};
            view[BICst.REGION.DIMENSION1] = [dimension.id];
            view[BICst.REGION.TARGET1] = [];

            var dimensions = {};
            dimensions[dimension.id] = dimension;

            var widget = {
                dimensions: dimensions,
                type: BICst.DESIGN.WIDGET.TABLE,
                view: view,
                wId: BI.UUID(),
                tableName: tableName,
                parameter: BI.Utils.getParamCalculation(),
                page: -1,
                reportId: this.getCurrentTemplateId(),
                realData: true
            };

            this.getWidgetData(widget, function (res) {
                callback(BI.map(BI.first(res.data.items).children, "text"));
            });
        },

        getDimensionDataById: function (did, callback) {
            var wid = this.getWidgetIdBydId(did);
            var widget = BI.deepClone(BI.designModel.widgets[wid]);
            var dimensions = widget.dimensions;
            var dimension = widget.dimensions[did];
            dimension.drillSequence = [];
            dimension.filter = {};
            dimension.used = true;
            widget.type = BICst.DESIGN.WIDGET.TABLE;
            widget.wId = wid;
            widget.page = -1;
            widget.dimensions = {};
            widget.dimensions[did] = dimension;
            widget.view = {};
            widget.view[BICst.REGION.DIMENSION1] = [did];
            widget.parameter = BI.Utils.getParamCalculation();
            widget.reportId = this.getCurrentTemplateId();
            widget.realData = true;

            var targetIds = this.getAllTargetDimensionIds(wid);
            BI.each(targetIds, function (idx, targetId) {
                widget.dimensions[targetId] = dimensions[targetId];
                widget.dimensions[targetId].filter = {};
                if (!BI.has(widget.view, BICst.REGION.TARGET1)) {
                    widget.view[BICst.REGION.TARGET1] = [];
                }
                widget.view[BICst.REGION.TARGET1].push(targetId);
            });

            this.getWidgetData(widget, function (res) {
                callback(BI.map(BI.first(res.data.items).children, "text"));
            });
        },

        getDimensionGroupDataById: function (did, callback) {
            var wid = this.getWidgetIdBydId(did);
            var widget = Fix.toJSON(BI.designModel.widgets[wid]);
            var dimensions = widget.dimensions;
            var dimension = widget.dimensions[did];
            dimension.drillSequence = [];
            dimension.fieldId = BI.Utils.getMeasureSwitchFieldById(did);
            dimension.filter = {};
            dimension.group = {
                type: BICst.DESIGN.GROUP.ID_GROUP
            };
            dimension.used = true;
            widget.type = BICst.DESIGN.WIDGET.TABLE;
            widget.wId = wid;
            widget.page = -1;
            widget.dimensions = {};
            widget.dimensions[did] = dimension;
            widget.view = {};
            widget.parameter = BI.Utils.getParamCalculation();
            widget.view[BICst.REGION.DIMENSION1] = [did];
            widget.reportId = this.getCurrentTemplateId();
            widget.realData = true;

            var targetIds = this.getAllTargetDimensionIds(wid);
            BI.each(targetIds, function (idx, targetId) {
                widget.dimensions[targetId] = dimensions[targetId];
                widget.dimensions[targetId].filter = {};
                if (!BI.has(widget.view, BICst.REGION.TARGET1)) {
                    widget.view[BICst.REGION.TARGET1] = [];
                }
                widget.view[BICst.REGION.TARGET1].push(targetId);
            });

            this.getWidgetData(widget, function (res) {
                callback(BI.map(BI.first(res.data.items).children, "text"));
            });
        },

        getDimensionGroupSortById: function (did, callback) {
            var wid = this.getWidgetIdBydId(did);
            var widget = Fix.toJSON(BI.designModel.widgets[wid]);
            var dimensions = widget.dimensions;
            var dimension = widget.dimensions[did];
            dimension.drillSequence = [];
            dimension.filter = {};
            dimension.sort = {};
            dimension.used = true;
            widget.type = BICst.DESIGN.WIDGET.TABLE;
            widget.wId = wid;
            widget.page = -1;
            widget.dimensions = {};
            widget.dimensions[did] = dimension;
            widget.view = {};
            widget.view[BICst.REGION.DIMENSION1] = [did];
            widget.reportId = this.getCurrentTemplateId();
            widget.realData = true;

            var targetIds = this.getAllTargetDimensionIds(wid);
            BI.each(targetIds, function (idx, targetId) {
                widget.dimensions[targetId] = dimensions[targetId];
                widget.dimensions[targetId].filter = {};
                if (!BI.has(widget.view, BICst.REGION.TARGET1)) {
                    widget.view[BICst.REGION.TARGET1] = [];
                }
                widget.view[BICst.REGION.TARGET1].push(targetId);
            });

            this.getWidgetData(widget, function (res) {
                callback(BI.map(BI.first(res.data.items).children, "text"));
            });
        },

        setCurrentSelectPackageID: function (pId) {
            var key = BICst.CACHE.PACKAGE_PREFIX + BI.Utils.getCurrentTemplateId();
            BI.Cache.setItem(key, pId);
        },

        getFilterWidgetSortTypesByDimensions: function (dimensions) {
            var sortTypes = [];

            BI.each(dimensions, function (dId, dimension) {
                if (!BI.has(dimension, "sort")) return;

                switch (dimension.sort.type) {
                    case BICst.DESIGN.SORT.FILTER_ASC:
                    case BICst.DESIGN.SORT.ASC:
                        sortTypes.push(BICst.DESIGN.SORT.ASC);
                        break;
                    case BICst.DESIGN.SORT.FILTER_DESC:
                    case BICst.DESIGN.SORT.DESC:
                        sortTypes.push(BICst.DESIGN.SORT.DESC);
                        break;
                    case BICst.DESIGN.SORT.FILTER_CUSTOM:
                        sortTypes.push(BICst.DESIGN.SORT.FILTER_CUSTOM);
                        break;
                    default:
                        break;
                }
            });

            return BI.uniq(sortTypes);
        },

        getControlCalculations: function (targetWId) {
            var self = this,
                filterValues = [];
            // 控件
            var widgetIds = this.getAllWidgetIds();
            BI.each(widgetIds, function (i, id) {
                if (!self.isControlWidgetByWidgetId(id)) return;

                // 自己不添加自己的过滤条件
                if (id === targetWId) return;

                // 如果存在targetWId且是非过滤组件且不在控制范围
                if (BI.isNotNull(targetWId) && !self.isControlWidgetByWidgetId(targetWId) && !self.isUnderControlRangeById(id, targetWId)) return;

                var type = self.getWidgetTypeById(id);
                var value = self.getWidgetValueById(id);
                if (BI.isNull(value)) return;

                if (BI.contains([BICst.DESIGN.WIDGET.TREE, BICst.DESIGN.WIDGET.TREE_LABEL, BICst.DESIGN.WIDGET.TREE_LIST], type)) {
                    filterValues.push({
                        filterType: BICst.ANALYSIS_FILTER_STRING.BELONG_WIDGET_VALUE,
                        filterValue: {
                            widgetId: id
                        }
                    });
                } else {
                    var dimensionIds = self.getAllDimensionIDs(id);
                    BI.each(dimensionIds, function (i, dimId) {
                        var fValue = value,
                            fType = "";
                        if (BI.isNull(fValue) || BI.isEmptyString(value) || BI.isEmptyObject(value) || !checkValueValid(type, value)) {
                            return;
                        }
                        var filter = null;
                        var fieldId = self.getFieldIdBydId(dimId);
                        switch (type) {
                            case BICst.DESIGN.WIDGET.STRING:
                            case BICst.DESIGN.WIDGET.STRING_LIST:
                            case BICst.DESIGN.WIDGET.STRING_LABEL:
                                fType = BICst.ANALYSIS_FILTER_STRING.BELONG_WIDGET_VALUE;
                                filter = {
                                    filterType: fType,
                                    filterValue: {
                                        widgetId: id
                                    },
                                    fieldId: fieldId
                                };
                                break;
                            case BICst.DESIGN.WIDGET.SINGLE_SLIDER:
                            case BICst.DESIGN.WIDGET.INTERVAL_SLIDER:
                            case BICst.DESIGN.WIDGET.NUMBER:
                                fType = BICst.ANALYSIS_FILTER_NUMBER.BELONG_WIDGET_VALUE;
                                filter = {
                                    filterType: fType,
                                    filterValue: {
                                        widgetId: id
                                    },
                                    fieldId: fieldId
                                };
                                break;
                            case BICst.DESIGN.WIDGET.DATE_INTERVAL:
                            case BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL:
                            case BICst.DESIGN.WIDGET.YEAR:
                            case BICst.DESIGN.WIDGET.MONTH:
                            case BICst.DESIGN.WIDGET.QUARTER:
                            case BICst.DESIGN.WIDGET.DATE:
                            case BICst.DESIGN.WIDGET.DATE_PANE:
                                fType = BICst.ANALYSIS_FILTER_DATE.BELONG_WIDGET_VALUE;
                                filter = {
                                    filterType: fType,
                                    filterValue: {
                                        widgetId: id
                                    },
                                    fieldId: fieldId
                                };
                                break;
                            default:
                                break;
                        }
                        BI.isNotNull(filter) && filterValues.push(filter);
                    });
                }

                if (type === BICst.DESIGN.WIDGET.GENERAL_QUERY) {
                    if (BI.isNotNull(parseFilter(value))) {
                        filterValues.push(value);
                    }
                }
            });
            return filterValues;

            function checkValueValid (type, value) {
                switch (type) {
                    case BICst.DESIGN.WIDGET.NUMBER:
                        return !(BI.isEmptyString(value.min) && BI.isEmptyString(value.max));
                    case BICst.DESIGN.WIDGET.DATE_PANE:
                        var v = value.value || value;
                        if(value.type === BICst.DATE_TYPE.STATIC) {
                            return BI.isNotNull(v.year) && BI.isNotNull(v.month) && BI.isNotNull(v.day);
                        }
                        return true;
                    default:
                        return true;
                }
            }
        },

        _getGenerateWidget: function (configuration, options, config) {
            return {
                bounds: {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                },
                wId: configuration.wId || BI.UUID(),
                name: "__StatisticWidget__" + BI.UUID(),
                dimensions: configuration.dimensions || {},
                filter: configuration.filter || {},
                fields: configuration.fields || [],
                tableName: configuration.tableName,
                type: configuration.type || BICst.DESIGN.WIDGET.TABLE,
                view: configuration.view || {},
                value: configuration.value,
                measures: configuration.measures,
                page: -1,
                options: options || {},
                config: config || {},
                reportId: this.getCurrentTemplateId(),
                widgetIdValueMap: configuration.widgetIdValueMap,
                realData: true
            };
        },

        getWidgetDataByWidgetInfo: function (configuration, callback, options, config) {
            var data = this._getGenerateWidget(configuration, options, config);
            this.getWidgetData(data, function (res) {
                callback(res.data || {});
            });
        },

        getWidgetDataByWidgetInfoWithParam: function (configuration, callback, options, config) {
            var data = this._getGenerateWidget(configuration, options, config);
            data.parameter = this.getParamCalculation();
            this.getWidgetData(data, function (res) {
                callback(res.data || {});
            });
        },

        // 计算所有参数过滤的值
        getParamCalculation: function () {
            var paramFilterValue = {};
            var widgets = Fix.toJSON(BI.designModel.widgets);
            var parameterPool = BI.pool.parameterPool;
            BI.each(widgets, function (wId, widget) {
                if (widget.useParameter !== true) return;

                var widgetType = widget.type;
                var widgetValue = Fix.toJSON(widget.value);
                var params = widget.parameterValue;

                var yearValue, monthValue, quarterValue, startValue, endValue, startYearValue, startMonthValue,
                    endYearValue, endMonthValue;

                switch (widgetType) {
                    case BICst.DESIGN.WIDGET.YEAR:
                    case BICst.DESIGN.WIDGET.DATE:
                    case BICst.DESIGN.WIDGET.DATE_PANE:
                    case BICst.DESIGN.WIDGET.STRING:
                    case BICst.DESIGN.WIDGET.STRING_LABEL:
                    case BICst.DESIGN.WIDGET.STRING_LIST:
                        if (BI.isNull(BI.first(params))) return;

                        paramFilterValue[BI.first(params)] = {
                            type: widgetType,
                            parameterType: parameterPool.parameter[BI.first(params)],
                            value: widgetValue
                        };
                        return;
                    case BICst.DESIGN.WIDGET.MONTH:
                        // 多个参数的要进行拆分
                        if (BI.isNotNull(params[0])) {
                            if (BI.isNull(widgetValue)) {
                                yearValue = widgetValue;
                            } else {
                                yearValue = {
                                    type: widgetValue.type,
                                    value: {
                                        year: widgetValue.value.year
                                    }
                                };
                            }

                            paramFilterValue[params[0]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[0]],
                                value: yearValue
                            };
                        }

                        if (BI.isNotNull(params[1])) {
                            if (BI.isNull(widgetValue)) {
                                monthValue = widgetValue;
                            } else {
                                monthValue = {
                                    type: widgetValue.type,
                                    value: {
                                        month: widgetValue.value.month
                                    }
                                };
                            }

                            paramFilterValue[params[1]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[1]],
                                value: monthValue
                            };
                        }
                        break;
                    case BICst.DESIGN.WIDGET.QUARTER:
                        if (BI.isNotNull(params[0])) {
                            if (BI.isNull(widgetValue)) {
                                yearValue = widgetValue;
                            } else {
                                yearValue = {
                                    type: widgetValue.type,
                                    value: {
                                        year: widgetValue.value.year
                                    }
                                };
                            }

                            paramFilterValue[params[0]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[0]],
                                value: yearValue
                            };
                        }

                        if (BI.isNotNull(params[1])) {
                            if (BI.isNull(widgetValue)) {
                                quarterValue = widgetValue;
                            } else {
                                quarterValue = {
                                    type: widgetValue.type,
                                    value: {
                                        quarter: widgetValue.value.quarter
                                    }
                                };
                            }
                            paramFilterValue[params[1]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[1]],
                                value: quarterValue
                            };
                        }
                        break;
                    case BICst.DESIGN.WIDGET.DATE_INTERVAL:
                        if (BI.isNotNull(params[0])) {
                            if (BI.isNull(widgetValue)) {
                                startValue = widgetValue;
                            } else {
                                startValue = {
                                    start: widgetValue.start
                                };
                            }

                            paramFilterValue[params[0]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[0]],
                                value: startValue
                            };
                        }

                        if (BI.isNotNull(params[1])) {
                            if (BI.isNull(widgetValue)) {
                                endValue = widgetValue;
                            } else {
                                endValue = {
                                    start: widgetValue.end
                                };
                            }

                            paramFilterValue[params[1]] = {
                                parameterType: parameterPool.parameter[params[1]],
                                type: widgetType,
                                value: endValue
                            };
                        }
                        break;
                    case BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL:
                        if (BI.isNotNull(params[0])) {
                            if (BI.isNull(widgetValue)) {
                                startYearValue = widgetValue;
                            } else if (BI.isNull(widgetValue.start)) {
                                startYearValue = {
                                    start: widgetValue.start
                                };
                            } else {
                                startYearValue = {
                                    start: {
                                        type: widgetValue.start.type,
                                        value: {
                                            year: widgetValue.start.value.year
                                        }
                                    }
                                };
                            }

                            paramFilterValue[params[0]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[0]],
                                value: startYearValue
                            };
                        }

                        if (BI.isNotNull(params[1])) {
                            if (BI.isNull(widgetValue)) {
                                startMonthValue = widgetValue;
                            } else if (BI.isNull(widgetValue.start)) {
                                startMonthValue = {
                                    start: widgetValue.start
                                };
                            } else {
                                startMonthValue = {
                                    start: {
                                        type: widgetValue.start.type,
                                        value: {
                                            month: widgetValue.start.value.month
                                        }
                                    }
                                };
                            }

                            paramFilterValue[params[1]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[1]],
                                value: startMonthValue
                            };
                        }

                        if (BI.isNotNull(params[2])) {
                            if (BI.isNull(widgetValue)) {
                                endYearValue = widgetValue;
                            } else if (BI.isNull(widgetValue.end)) {
                                endYearValue = {
                                    end: widgetValue.end
                                };
                            } else {
                                endYearValue = {
                                    end: {
                                        type: widgetValue.end.type,
                                        value: {
                                            year: widgetValue.end.value.year
                                        }
                                    }
                                };
                            }

                            paramFilterValue[params[2]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[2]],
                                value: endYearValue
                            };
                        }

                        if (BI.isNotNull(params[3])) {
                            if (BI.isNull(widgetValue)) {
                                endMonthValue = widgetValue;
                            } else if (BI.isNull(widgetValue.end)) {
                                endMonthValue = {
                                    end: widgetValue.end
                                };
                            } else {
                                endMonthValue = {
                                    end: {
                                        type: widgetValue.end.type,
                                        value: {
                                            month: widgetValue.end.value.month
                                        }
                                    }
                                };
                            }

                            paramFilterValue[params[3]] = {
                                type: widgetType,
                                parameterType: parameterPool.parameter[params[3]],
                                value: endMonthValue
                            };
                        }
                        break;
                    default:
                }
            });

            return paramFilterValue;
        },

        getWidgetCalculationByID: function (wid, opts) {
            var self = this;
            opts = opts || {};
            var widget = Fix.toJSON(BI.designModel.widgets[wid]) || {};
            widget.parameter = this.getParamCalculation();
            widget.templateStyle = BI.Utils.getActualTemplateStyle();
            widget.wId = wid;
            var filterValues = [];

            // 所有控件过滤条件（考虑有查询按钮的情况
            filterValues = filterValues.concat(
                this.isQueryControlExist() && !this.isControlWidgetByWidgetId(wid) ?
                    BI.SharingPool.get("controlFilters") : this.getControlCalculations(wid));

            // 考虑明细过滤的日期类型
            var fields = widget.measures;
            BI.each(fields, function (tId, field) {
                if (BI.isNotNull(field)) {
                    if (BI.isNotNull(field.filter)) {
                        parseFilter(field.filter);
                    }
                    if (BI.isNotNull(field.detailFilter)) {
                        parseFilter(field.detailFilter);
                    }
                }
            });
            if(widget.type === BICst.DESIGN.WIDGET.DETAIL) {
                BI.each(widget.settings.tableAttr.filterValue, function (dId) {
                    parseFilter(widget.settings.tableAttr.filterValue[dId]);
                });
            }

            widget.filter = {filterType: BICst.ANALYSIS_FILTER_TYPE.AND, filterValue: filterValues};

            // 构造联动 缓存一个所有已联动的组件数组
            var linkage = widget.linkage;
            if (!opts.isLinkWidget) {
                BI.each(linkage, function (linkId, ob) {
                    if (!BI.Utils.isWidgetExistById(linkId)) {
                        return;
                    }
                    ob.widget = self.getWidgetCalculationByID(linkId, {isLinkWidget: true});
                    ob.clicked = BI.Utils.getClickedOfWidget(linkId);
                });
            }
            widget.widgetIdValueMap = {};
            BI.each(BI.Utils.getAllWidgetIds(), function (idx, wId) {
                var type = BI.Utils.getWidgetTypeById(wId);
                if (BI.Utils.isControlWidgetByWidgetId(wId) && type !== BICst.DESIGN.WIDGET.GENERAL_QUERY) {
                    var value = BI.Utils.getWidgetValueById(wId);
                    if (BI.contains([BICst.DESIGN.WIDGET.DATE_INTERVAL, BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL], type)) {
                        widget.widgetIdValueMap[wId + "_start"] = {
                            type: type,
                            value: {
                                start: value && value.start
                            }
                        };
                        widget.widgetIdValueMap[wId + "_end"] = {
                            type: type,
                            value: {
                                end: value && value.end
                            }
                        };
                    }
                    widget.widgetIdValueMap[wId] = BI.designModel.widgets[wId];
                }
            });
            widget.realData = BI.Utils.isUnderPreviewMode();
            return widget;
        },

        getWidgetDataByID: (function () {
            var cache = {};
            return function (wid, callbacks, options, config) {
                options || (options = {});
                var key = BI.UUID();
                if (!BI.Utils.isControlWidgetByWidgetId(wid)) {
                    key = wid;
                }
                cache[key] = callbacks;
                var widgetSetting = BI.Utils.getWidgetCalculationByID(wid);
                BI.Utils.getWidgetData(BI.extend(widgetSetting, options, {
                    globalFilter: BI.isEmptyObject(BI.designData.filter) ? null : BI.designData.filter,
                    sessionId: BI.sessionId,
                    reportId: BI.Utils.getCurrentTemplateId()
                }), function (data) {
                    if (cache[key] === callbacks) {
                        callbacks.success(data);
                        delete cache[key];
                    } else {
                        callbacks.error && callbacks.error(data);
                    }
                });
            };
        })(),

        getWidgetDetailDataByID: function (wId, widget, callback, options, config) {
            var widgetSetting = BI.extend({}, BI.Utils.getWidgetCalculationByID(wId), widget);
            BI.Utils.getWidgetData(BI.extend({}, widgetSetting, options, {
                globalFilter: BI.isEmptyObject(BI.designModel.filter) ? null : BI.designModel.filter,
                sessionId: BI.sessionId,
                type: BICst.DESIGN.WIDGET.TABLE,
                reportId: this.getCurrentTemplateId(),
                realData: true
            }), callback);
        },

        // 把指定组件的控件过滤条件转化成文本
        getControlWidgetValueTextByID: function (wIdOrdId) {
            var dId, wId;
            if (BI.Utils.isWidgetExistById(wIdOrdId)) {
                wId = wIdOrdId;
            } else {
                wId = BI.Utils.getWidgetIdBydId(wIdOrdId);
                dId = wIdOrdId;
            }
            var widgetValue = BI.Utils.getWidgetValueById(wId);
            var widgetType = BI.Utils.getWidgetTypeById(wId);
            var text = "";
            if (BI.isNull(widgetValue) || BI.isEmptyObject(widgetValue) || BI.isEmptyArray(widgetValue)) {
                return BI.i18nText("BI-Design_All");
            }
            switch (widgetType) {
                case BICst.DESIGN.WIDGET.STRING:
                case BICst.DESIGN.WIDGET.STRING_LIST:
                case BICst.DESIGN.WIDGET.STRING_LABEL:
                    if (BI.isNull(widgetValue.value) || widgetValue.value.length === 0) {
                        return BI.i18nText("BI-Design_All");
                    }
                    var valueFrom = widgetValue.type === BI.Selection.Multi ? "value" : "assist";
                    return _formatStringText(widgetValue[valueFrom]);
                case BICst.DESIGN.WIDGET.SINGLE_SLIDER:
                case BICst.DESIGN.WIDGET.INTERVAL_SLIDER:
                    return getNumberSliderRangeText(widgetValue);
                case BICst.DESIGN.WIDGET.NUMBER:
                    return getNumberRangeText(widgetValue);
                case BICst.DESIGN.WIDGET.DATE_INTERVAL:
                    widgetValue.showTime = BI.Utils.getWidgetShowTimeById(wId);
                    return getDateRangeText(widgetValue);
                case BICst.DESIGN.WIDGET.MONTH:
                    return getYearMonthText(widgetValue);
                case BICst.DESIGN.WIDGET.QUARTER:
                    return getYearQuarterText(widgetValue);
                case BICst.DESIGN.WIDGET.YEAR:
                    return getYearText(widgetValue);
                case BICst.DESIGN.WIDGET.DATE:
                case BICst.DESIGN.WIDGET.DATE_PANE:
                    widgetValue.showTime = BI.Utils.getWidgetShowTimeById(wId);
                    return getDateText(widgetValue);
                case BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL:
                    widgetValue.showTime = BI.Utils.getWidgetShowTimeById(wId);
                    return getYearMonthIntervalText(widgetValue);
                case BICst.DESIGN.WIDGET.TREE:
                case BICst.DESIGN.WIDGET.TREE_LIST:
                    if (BI.isNotNull(dId)) {
                        var region = BI.Utils.getRegionDimensionIdsBydId(dId);
                        // 只显示层级<=当前被绑定字段的勾选值
                        var level = region.indexOf(dId);
                        var textArr = getChildrenNodeText(widgetValue, 0, level);
                        return _formatStringText(textArr);
                    }
                    // 先把4.1的抄过来
                    return _getTreeFilterText(wId);

                case BICst.DESIGN.WIDGET.TREE_LABEL:
                    if (BI.isNotNull(dId)) {
                        var region = BI.Utils.getRegionDimensionIdsBydId(dId);
                        // 只显示层级<=当前被绑定字段的勾选值
                        var level = region.indexOf(dId);
                        var targetArr = widgetValue[level];
                        if (targetArr.indexOf(BICst.LIST_LABEL_TYPE.ALL) !== -1) {
                            text = BI.i18nText("BI-Design_All");
                        } else {
                            text = _formatStringText(targetArr);
                        }
                        return text;
                    }
                    return _getTreeLabelFilterText(wId);

                default:
                    return widgetValue;
            }
        },

        // 把指定组件的控件的联动条件转化成文本
        getLinkageValueTextByID: function (wId, bindDId) {
            var linkageFilters = BI.Utils.getLinkageOfWidget(wId);
            var text = BI.i18nText("BI-Design_All");
            BI.find(linkageFilters, function (fromWId) {
                var clicked = BI.Utils.getClickedOfWidget(fromWId) || {};
                if (BI.isNotNull(clicked.value)) {
                    var dIds = BI.map(clicked.value, "dId");
                    var index = dIds.indexOf(bindDId);
                    if (index !== -1) {
                        var value = clicked.value[index];
                        var groupType = BI.Utils.getResultDimensionGroupTypeById(value.dId);
                        if (BI.Utils.getResultDimensionTypeById(value.dId) === BICst.DESIGN.DIMENSION_TYPE.DATE) {
                            groupType = groupType || BICst.GROUP.YMD;
                        }
                        text = BI.Format.formatValueByGroup(value.text, groupType);
                        return true;
                    }
                }
            });
            return text;
        },

        doJumpByUrl: function (url, options) {
            options = options || {};
            var target = "_blank";
            var dialog;
            if (options.openPosition === BICst.DESIGN.JUMP_POSITION.CURRENT_WINDOW) {
                target = "_self";
            }
            if (options.openPosition === BICst.DESIGN.JUMP_POSITION.DIALOG) {
                dialog = previewTemplateDialog(options.name);
                target = options.name;
            }
            url = url || "";
            var fieldIds = BI.map(url.match(/\$\{.*?\}/g), function (idx, str) {
                return str.substring(2, str.length - 1);
            });
            if (target === "_blank") {
                var tab = window.open("", target);
                if (BI.isNotEmptyArray(fieldIds)) {
                    BI.Utils.getJumpFieldInfoByFieldIds({
                        fieldIds: fieldIds,
                        clicked: options.clicked,
                        linkedWidget: options.linkedWidget
                    }, doJump);
                } else {
                    doJump();
                }
            } else {
                if (BI.isNotEmptyArray(fieldIds)) {
                    BI.Utils.getJumpFieldInfoByFieldIds({
                        fieldIds: fieldIds,
                        clicked: options.clicked,
                        linkedWidget: options.linkedWidget
                    }, doJump);
                } else {
                    doJump();
                }
            }

            function doJump (res) {
                var urlInfo = editUrl(url, res);
                var resultUrl = BI.Format.formatAddress(urlInfo.prefix) + BI.reduce(urlInfo.params, function (value, result, key) {
                    var linkChar = BI.isEmptyString(result) ? "?" : "&";
                    return result + linkChar + key + "=" + value;
                }, "");
                if (target === "_blank") {
                    tab.location.href = resultUrl;
                } else if (target === "_self") {
                    this.location.href = resultUrl;
                } else {
                    dialog.setSrc(resultUrl);
                }
            }

            function editUrl (url, replaceMap) {
                url = url || "";
                var urlSplit = url.split(/\?/);
                // BI-15575 表名中可能有空格，使得fieldId中也有空格，不能直接去空格
                var prefix = (urlSplit[0] || "").replace(/\s+/g, "");
                // BI-17532 需要支持以前明细表的超链写法
                prefix = prefix.replaceAll("\\$\\{.*?\\}", function (str) {
                    var id = str.substring(2, str.length - 1);
                    if (BI.has(replaceMap, id)) {
                        var items = replaceMap[id];
                        return BI.isArray(items) ? items[0] : items;
                    }
                });
                var param = urlSplit[1] || "";
                // 取得每一项
                var items = BI.isEmptyString(param) ? [] : param.split("&");
                var newParams = {};
                BI.each(items, function (i, item) {
                    if (BI.isEmptyString(item)) {
                        return;
                    }
                    var it = item.split("=");
                    var name = it[0];
                    var value = it[1];
                    // 自己写的静态参数值不做替换
                    if (BI.isNull(value.match(/\$\{.*?\}/))) {
                        newParams[name] = value;
                    } else {
                        if (name.length > 0) {
                            var fieldId = value.substring(2, value.length - 1);
                            // 多于一个时不传值
                            if (BI.has(replaceMap, fieldId) && replaceMap[fieldId].length <= 1) {
                                var replaceText = replaceMap[fieldId];
                                newParams[name] = BI.isArray(replaceText) ? replaceText[0] : replaceText;
                            }
                        }
                    }
                });
                return {
                    prefix: prefix,
                    params: newParams
                };
            }
        },

        doJumpByTemplateId: function (tId, options) {
            options = options || {};
            var target = "_blank";
            if (options.openPosition === BICst.DESIGN.JUMP_POSITION.CURRENT_WINDOW) {
                target = "_self";
            }
            if (options.openPosition === BICst.DESIGN.JUMP_POSITION.DIALOG) {
                previewTemplateDialog(options.name);
                target = options.name;
            }
            var paramObj = {};
            if (BI.isNotNull(options.clicked)) {
                paramObj.clicked = options.clicked;
            }
            var linkedWidget = BI.deepClone(options.linkedWidget);
            if (BI.isNotNull(linkedWidget)) {
                paramObj.linkedWidget = linkedWidget;
                paramObj.linkedWidget.globalFilter = BI.isEmptyObject(BI.designModel.filter) ? null : BI.designModel.filter;

                var fields = BI.get(linkedWidget, "fields", []);
                var measures = BI.get(linkedWidget, "measures", []);

                BI.each(fields, function (index, field) {
                    field.name = BI.Utils.getFieldTransferName(field.source || field.id);
                });

                BI.each(measures, function (index, field) {
                    field.name = BI.Utils.getFieldTransferName(field.source || field.id);
                });
            }
            BI.Func.doActionByForm(moduleRouter + "/report/" + tId + "/edit", paramObj, {
                target: target
            });
        },

        getDefaultFilterValue: function (filterType) {
            switch (filterType) {
                case BICst.ANALYSIS_FILTER_NUMBER.BELONG_VALUE:
                case BICst.ANALYSIS_FILTER_NUMBER.NOT_BELONG_VALUE:
                    return {
                        min: "",
                        max: "",
                        closeMin: true,
                        closeMax: false
                    };
                case BICst.ANALYSIS_FILTER_NUMBER.LARGE:
                case BICst.ANALYSIS_FILTER_NUMBER.SMALL:
                case BICst.ANALYSIS_FILTER_NUMBER.LARGE_OR_EQUAL:
                case BICst.ANALYSIS_FILTER_NUMBER.SMALL_OR_EQUAL:
                    return {
                        type: BICst.ANALYSIS_FILTER_NUMBER_VALUE.SETTLED,
                        value: ""
                    };
                case BICst.ANALYSIS_FILTER_STRING.BELONG_VALUE:
                case BICst.ANALYSIS_FILTER_STRING.NOT_BELONG_VALUE:
                case BICst.ANALYSIS_FILTER_NUMBER.BELONG_STRING_VALUE:
                case BICst.ANALYSIS_FILTER_NUMBER.NOT_BELONG_STRING_VALUE:
                case BICst.ANALYSIS_FILTER_DATE.BELONG_STRING_VALUE:
                case BICst.ANALYSIS_FILTER_DATE.NOT_BELONG_STRING_VALUE:
                    return {
                        type: BI.Selection.Multi,
                        value: []
                    };
                case BICst.ANALYSIS_FILTER_STRING.CONTAIN:
                case BICst.ANALYSIS_FILTER_STRING.NOT_CONTAIN:
                case BICst.ANALYSIS_FILTER_STRING.BEGIN_WITH:
                case BICst.ANALYSIS_FILTER_STRING.NOT_BEGIN_WITH:
                case BICst.ANALYSIS_FILTER_STRING.END_WITH:
                case BICst.ANALYSIS_FILTER_STRING.NOT_END_WITH:
                case BICst.ANALYSIS_FILTER_STRING.TOP_N:
                case BICst.ANALYSIS_FILTER_STRING.BOTTOM_N:
                case BICst.ANALYSIS_FILTER_NUMBER.EQUAL_TO:
                case BICst.ANALYSIS_FILTER_NUMBER.NOT_EQUAL_TO:
                case BICst.ANALYSIS_FILTER_NUMBER.TOP_N:
                case BICst.ANALYSIS_FILTER_NUMBER.BOTTOM_N:
                case BICst.ANALYSIS_FILTER_DATE.TOP_N:
                case BICst.ANALYSIS_FILTER_DATE.BOTTOM_N:
                case BICst.ANALYSIS_FILTER_DATE.CONTAIN:
                case BICst.ANALYSIS_FILTER_DATE.NOT_CONTAIN:
                case BICst.ANALYSIS_FILTER_DATE.BEGIN_WITH:
                case BICst.ANALYSIS_FILTER_DATE.NOT_BEGIN_WITH:
                case BICst.ANALYSIS_FILTER_DATE.END_WITH:
                case BICst.ANALYSIS_FILTER_DATE.NOT_END_WITH:
                    return "";
                case BICst.ANALYSIS_FILTER_STRING.IS_NULL:
                case BICst.ANALYSIS_FILTER_STRING.NOT_NULL:
                case BICst.ANALYSIS_FILTER_DATE.IS_NULL:
                case BICst.ANALYSIS_FILTER_DATE.NOT_NULL:
                case BICst.ANALYSIS_FILTER_NUMBER.IS_NULL:
                case BICst.ANALYSIS_FILTER_NUMBER.NOT_NULL:
                    return [];
                default:
                    return;
            }
        },

        getContentWidgetUsedTable: function (wId) {
            var content = BI.designModel.widgets[wId].content || "";
            var altArray = content.match(/\$[\{][^\}]*[\}]/g);
            var tableNames = [];
            BI.each(altArray, function (idx, str) {
                var obj = JSON.parse(str.substring(1, str.length));
                var id = obj.alt;
                var dId;
                if(BI.Utils.isDimensionExist(id)) {
                    dId = id;
                } else {
                    dId = BI.Utils.getDimensionIdByDimensionGroupId(null, id);
                }
                if(BI.Utils.isDimensionExist(dId)) {
                    var type = BI.Utils.getWidgetTypeById(BI.Utils.getWidgetIdBydId(dId));
                    if(BI.Utils.isStaticWidgetByWidgetType(type)) {
                        tableNames.pushDistinct(BI.Utils.getTableNameWidgetId(BI.Utils.getWidgetIdBydId(dId)));
                    }
                }
            });
            return tableNames;
        }
    });


    // format date type filter, group指定日期分组
    function parseFilter (filter, groupType) {
        var filterType = filter.filterType,
            filterValue = filter.filterValue;
        if (filterType === BICst.ANALYSIS_FILTER_TYPE.AND || filterType === BICst.ANALYSIS_FILTER_TYPE.OR) {
            BI.each(filterValue, function (i, value) {
                parseFilter(value, groupType);
            });
        }
        // wId的需要转化控件值
        if(BI.isNotNull(filterValue) && BI.has(filterValue, "wId")) {
            var filterWId = filterValue.wId;
            var wValue = BI.Utils.isWidgetExistById(filterWId) ? BI.Utils.getWidgetValueById(filterWId) : null;
            wValue = wValue || BI.Utils.getDefaultFilterValue(filterType);
            switch (filterType) {
                case BICst.ANALYSIS_FILTER_DATE.BELONG_DATE_WIDGET_VALUE:
                case BICst.ANALYSIS_FILTER_DATE.NOT_BELONG_DATE_WIDGET_VALUE:
                    var type = BI.Utils.getWidgetTypeById(filterWId);
                    filter.filterValue = {
                        widget: {
                            type: type,
                            value: wValue,
                            point: BI.contains([BICst.DESIGN.WIDGET.DATE_INTERVAL, BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL], type) ? BICst.DATE_TIME_TYPE.INTERVAL : BICst.DATE_TIME_TYPE.POINT
                        },
                        offset: filterValue.offset
                    };
                    break;
                case BICst.ANALYSIS_FILTER_DATE.LESS_THAN_DATE_WIDGET_VALUE:
                case BICst.ANALYSIS_FILTER_DATE.MORE_THAN_DATE_WIDGET_VALUE:
                case BICst.ANALYSIS_FILTER_DATE.EQUAL_TO_DATE_WIDGET_VALUE:
                case BICst.ANALYSIS_FILTER_DATE.NOT_EQUAL_TO_DATE_WIDGET_VALUE:
                    var value = BI.isNull(wValue) ? null : (filterValue.startOrEnd === 1 ? wValue.start : (filterValue.startOrEnd === 2 ? wValue.end : wValue));
                    filter.filterValue = {
                        widget: {
                            type: BI.Utils.getWidgetTypeById(filterWId),
                            value: value,
                            point: BICst.DATE_TIME_TYPE.POINT
                        },
                        offset: filterValue.offset
                    };
                    break;
            }
        }
        return filter;
    }

    function getChildrenNodeText (ob, layer, level) {
        var text = [];
        var keys = BI.Func.getSortedResult(BI.map(BI.keys(ob), function (idx, value) {
            return {
                value: value
            };
        }));
        BI.each(BI.map(keys, "value"), function (idx, name) {
            if (level === layer || (level > layer && BI.isEmptyObject(ob[name]))) {
                text.push(name);
                return;
            }
            if (level > layer) {
                var childNodesText = getChildrenNodeText(ob[name], layer + 1, level);
                text = BI.concat(text, childNodesText);
            }
        });
        return text;
    }

    function _formatStringText (array) {
        var text = "";
        switch (array.length) {
            case 0:
                break;
            case 1:
                text = array[0];
                break;
            case 2:
                text = array.join("&");
                break;
            case 3:
                text = array.join(",");
                break;
            default:
                text = array.slice(0, 3).join(",") + BI.i18nText("BI-Design_Filter_And_Other_More");
                break;
        }
        return text;
    }

    function getNumberSliderRangeText (filterValue) {
        var text = "";
        var min = filterValue.min,
            max = filterValue.max;
        if (BI.isNotNull(min) && BI.isNotNull(max)) {
            if (BI.isEqual(min, max)) {
                text = min;
            } else {
                text = min + "~" + max;
            }
        }
        return text;
    }

    function getNumberRangeText (filterValue) {
        var text = "";
        var min = filterValue.min,
            max = filterValue.max;
        if (BI.isNotNull(min) && BI.isNotEmptyString(min) && BI.isNotNull(max) && BI.isNotEmptyString(max)) {
            if (BI.isEqual(min, max)) {
                text = min;
            } else {
                text = min + "~" + max;
            }
        } else if (BI.isNotNull(min) && BI.isNotEmptyString(min)) {
            text = min + "~" + BI.i18nText("BI-Basic_Positive_Endless");
        } else if (BI.isNotNull(max) && BI.isNotEmptyString(max)) {
            text = "-" + BI.i18nText("BI-Basic_Endless") + "~" + max;
        } else {
            text = BI.i18nText("BI-Design_All");
        }
        return text;
    }

    function getYearText (widgetValue) {
        widgetValue = widgetValue || {};
        var value = widgetValue.value;
        var text = BI.i18nText("BI-Design_All");
        switch (widgetValue.type) {
            case BICst.DATE_TYPE.STATIC:
                text = value.year;
                break;
            case BICst.DATE_TYPE.DYNAMIC:
                var date = BI.Func.getCalculationDateShowValue(value);
                if (BI.isNotNull(date)) {
                    text = date.print("%Y");
                }
                break;
            default:
                break;
        }
        return text;
    }

    function getYearMonthText (widgetValue) {
        var text = BI.i18nText("BI-Design_All");
        widgetValue = widgetValue || {};
        var value = widgetValue.value;

        switch (widgetValue.type) {
            case BICst.DATE_TYPE.STATIC:
                if (BI.isNumeric(value.year) && BI.isNumeric(value.month)) {
                    text = value.year + "-" + value.month;
                } else if (BI.isNumeric(value.year)) {
                    text = value.year;
                } else if (BI.isNumeric(value.month)) {
                    text = value.month;
                } else {
                    text = BI.i18nText("BI-Design_All");
                }
                break;
            case BICst.DATE_TYPE.DYNAMIC:
                var date = BI.Func.getCalculationDateShowValue(value);
                if (BI.isNotNull(date)) {
                    text = date.print("%Y-%X");
                }
                break;
            default:
                break;
        }
        return text;
    }

    function getYearQuarterText (widgetValue) {
        widgetValue = widgetValue || {};
        var text = BI.i18nText("BI-Design_All");
        var value = widgetValue.value;

        switch (widgetValue.type) {
            case BICst.DATE_TYPE.STATIC:
                if (BI.isNumeric(value.year) && BI.isNumeric(value.quarter)) {
                    text = value.year + "-" + value.quarter;
                } else if (BI.isNumeric(value.year)) {
                    text = value.year;
                } else if (BI.isNumeric(value.quarter)) {
                    text = value.quarter;
                }
                break;
            case BICst.DATE_TYPE.DYNAMIC:
                var date = BI.Func.getCalculationDateShowValue(value);
                if (BI.isNotNull(date)) {
                    text = date.print("%Y-%Q");
                }
                break;
            default:
                break;
        }
        return text;
    }

    function getDateText (widgetValue) {
        widgetValue = widgetValue || {};
        var text = BI.i18nText("BI-Design_All");
        var value = widgetValue.value;
        var date;
        switch (widgetValue.type) {
            case BICst.DATE_TYPE.STATIC:
                // text = value.year + "-" + value.month + "-" + value.day;
                date = BI.getDate(value.year, (value.month - 1), value.day, value.hour || 0, value.minute || 0, value.second || 0);
                break;
            case BICst.DATE_TYPE.DYNAMIC:
                date = BI.Func.getCalculationDateShowValue(value);
                break;
            default:
                break;
        }
        if (BI.isNotNull(date)) {
            text = widgetValue.showTime === BICst.SHOW_TIME.SHOW ? date.print("%Y-%X-%d %H:%M:%S") : date.print("%Y-%X-%d");
        }
        return text;
    }

    function getYearMonthIntervalText (widgetValue) {
        widgetValue = widgetValue || {};
        var start = widgetValue.start,
            end = widgetValue.end;
        var sStart = "",
            sEnd = "";
        var text = "";
        if (BI.isNotNull(start)) {
            sStart = getDateText(BI.extend(start, {
                showTime: widgetValue.showTime
            }));
        }
        if (BI.isNotNull(end)) {
            sEnd = getDateText(BI.extend(end, {
                showTime: widgetValue.showTime
            }));
        }
        if (BI.isNotEmptyString(sStart) && BI.isNotEmptyString(sEnd)) {
            text = BI.isEqual(sStart, sEnd) ? sStart : (sStart + BI.i18nText("BI-Basic_To") + sEnd);
        } else if (BI.isNotEmptyString(sStart)) {
            text = sStart + BI.i18nText("BI-Design_Behind");
        } else if (BI.isNotEmptyString(sEnd)) {
            text = sEnd + BI.i18nText("BI-Design_Front");
        } else {
            text = BI.i18nText("BI-Design_All");
        }
        return text;
    }

    function getDateRangeText (filterValue) {
        filterValue = filterValue || {};
        var start = filterValue.start,
            end = filterValue.end;
        var sStart = "",
            sEnd = "";
        var text = "";
        if (BI.isNotNull(start)) {
            sStart = getDateText(BI.extend(start, {
                showTime: filterValue.showTime
            }));
        }
        if (BI.isNotNull(end)) {
            sEnd = getDateText(BI.extend(end, {
                showTime: filterValue.showTime
            }));
        }
        if (BI.isNotEmptyString(sStart) && BI.isNotEmptyString(sEnd)) {
            text = BI.isEqual(sStart, sEnd) ? sStart : (sStart + BI.i18nText("BI-Basic_To") + sEnd);
        } else if (BI.isNotEmptyString(sStart)) {
            text = sStart + BI.i18nText("BI-Design_Behind");
        } else if (BI.isNotEmptyString(sEnd)) {
            text = sEnd + BI.i18nText("BI-Design_Front");
        } else {
            text = BI.i18nText("BI-Design_All");
        }
        return text;
    }

    function _getTreeFilterText (wId) {
        var widgetValue = BI.Utils.getWidgetValueById(wId);
        var text = "";
        BI.each(widgetValue, function (name, children) {
            var childNodes = getChildrenNode(children);
            text += name + (childNodes === "" ? "" : (":" + childNodes)) + "; ";
        });
        if (text !== "") {
            text = BI.i18nText("BI-Basic_In") + " " + text;
        }
        return text;

        function getChildrenNode (ob) {
            var text = "";
            var index = 0, size = BI.size(ob);
            BI.each(ob, function (name, children) {
                index++;
                var childNodes = getChildrenNode(children);
                text += name + (childNodes === "" ? "" : (":" + childNodes)) + (index === size ? "" : ",");
            });
            return text;
        }
    }

    function _getTreeLabelFilterText (wId) {
        var text = "";
        var widgetValue = BI.Utils.getWidgetValueById(wId);
        var textValue = BI.filter(widgetValue, function (index, values) {
            return values.indexOf(BICst.LIST_LABEL_TYPE.ALL) < 0;
        });
        if (textValue.length === 0) {
            return text;
        }
        textValue = descartes(textValue);
        BI.each(textValue, function (index, values) {
            BI.each(values, function (idx, value) {
                text += value + (idx === 0 ? values.length > 1 ? ":" : "" : idx === values.length - 1 ? "" : ",");
            });
            text += ";";
        });
        if (text !== "") {
            text = BI.i18nText("BI-Basic_In") + " " + text;
        }
        return text;

        function descartes (arr) {
            if (!BI.isArray(arr)) {
                arr = [];
            }
            return arr.reduce(function (a, b) {
                return a.map(function (x) {
                    return b.map(function (y) {
                        return x.concat(y);
                    });
                }).reduce(function (a, b) {
                    return a.concat(b);
                }, []);
            }, [[]]);
        }
    }



    function previewTemplateDialog (dId) {
        var popover = null;
        var body = BI.createWidget({
            type: "bi.iframe",
            ref: function (ref) {
                ref.setName(dId);
            }
        });
        BI.Popovers.create(dId, {
            type: "bi.bar_popover",
            ref: function () {
                popover = this;
            },
            body: {
                type: "bi.absolute",
                items: [{
                    el: body,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }]
            },
            footer: {
                type: "bi.right_vertical_adapt",
                lgap: 10,
                items: [{
                    type: "bi.button",
                    text: BI.i18nText("BI-Basic_Close"),
                    level: "ignore",
                    handler: function () {
                        popover.close();
                        BI.Popovers.remove(dId);
                    }
                }]
            },
            listeners: [{
                eventName: BI.Popover.EVENT_CLOSE,
                action: function () {
                    BI.Popovers.remove(dId);
                }
            }]
        }).open(dId);
        return body;
    }
})();
/**
 * author: young
 * createdDate: 2018/3/15
 * description: 源数据相关的utils方法 如：
 * getFieldNameById 会有回调，请求到的数据会缓存，优先使用缓存
 */

!(function () {
    BI.Utils = BI.Utils || {};
    var moduleRouter = "/design" + (BI.pool.moduleRouter || "");

    BI.extend(BI.Utils, {

        getPack4Design: function (packId, callback, complete) {
            this._reqGet("/packs/" + packId, "", function (res) {
                callback(res);
            }, complete);
        },

        getTableNameByFieldIdInPool: function (fieldId) {
            return BI.findKey(BI.pool.dataPool.tables, function (tableName, table) {
                return BI.find(table.fields, function (idx, field) {
                    return field.id === fieldId;
                });
            });
        },

        getFieldTypeById: function (fieldId, callback) {
            if (BI.isNotNull(BI.pool.fields[fieldId])) {
                callback(BI.pool.fields[fieldId].type);
            } else {
                this.getFieldById(fieldId, function (field) {
                    if (BI.isNotNull(field)) {
                        callback(field.type);
                    }
                });
            }
        },

        getFieldById: function (fieldId, callback) {
            if (BI.isNotNull(BI.pool.fields[fieldId])) {
                callback(BI.pool.fields[fieldId]);
            } else {
                var self = this;
                BI.Utils.getTablesByFieldIds([fieldId], function (res) {
                    BI.each(res, function (idx, table) {
                        self._addTable(table);
                    });
                    callback(BI.pool.fields[fieldId]);
                });
            }
        },

        getFieldsOfTable: function (tableName, callback) {
            BI.Utils.getFields4Design(tableName, function (res) {
                callback(res.data.fields);
            });
        },

        getRelations: function (callback) {
            if (BI.isNotNull(BI.pool.relations)) {
                callback(BI.pool.relations);
            } else {
                BI.Utils.reqRelations4Design(function (res) {
                    BI.pool.relations = res.relations;
                    callback(BI.pool.relations);
                });
            }
        },

        getAllTableFieldsInfoByKeyword: function (data, callback, complete) {
            this._reqPost(BI.Utils.getEncodeURL("/packs/tables/{keyword}", data.keyword), data, function (res) {
                callback(res.data.tables);
            }, complete);
        },

        getAllTableFieldsInfoByTableIds: function (data, callback, complete) {
            var self = this;
            this._reqPost(BI.Utils.getEncodeURL("/tables/{keyword}/fields", data.keyword), data, function (res) {
                BI.each(res.data.tables, function (idx, table) {
                    if (!BI.has(BI.pool.tables[table.name])) {
                        self._addTable(BI.extend({}, {
                            fields: table.fields,
                            name: table.name
                        }));
                    }
                });
                callback(res.data.tables);
            }, complete);
        },

        getFields4Design: function (tableName, callback, complete) {
            this._reqGet(BI.Utils.getEncodeURL("/pack/{tableName}/fields", tableName), "", function (res) {
                callback && callback(res);
            }, complete);
        },

        getTable4Design: function (tableName, callback, complete) {
            this._reqGet(BI.Utils.getEncodeURL("/pack/{tableName}/info", tableName), "", function (res) {
                BI.Utils.syncTable2Pool(res.data.table);
                BI.Utils.syncNoAuthFields2Pool(res.data.noAuthFields);
                callback && callback(res);
            }, complete);
        },

        getGroups4Design: function (callback, complete) {
            var self = this;
            this._reqGet("/groups", "", function (res) {
                BI.each(res.data, function (index, group) {
                    self._addGroup(group);
                });
                callback(res);
            }, complete);
        },

        _addGroup: function (group) {
            BI.pool.groups[group.id] = group;
        },

        _addPackage: function (pack) {
            var self = this;
            BI.pool.packages[pack.id] = pack;
            BI.each(pack.tables, function (id, table) {
                self._addTable(table);
            });
        },

        _addTable: function (table) {
            var self = this;
            BI.pool.tables[table.name] = table.fields;
            BI.each(table.fields, function (id, field) {
                self._addField(BI.extend({}, field, {tableName: table.name}));
            });
        },

        _addField: function (field) {
            BI.pool.fields[field.id] = field;
        }
    });

    // req
    BI.extend(BI.Utils, {

        saveSettings4Design: function (settings, callback, complete) {
            this._reqPost("/save", settings, function (res) {
                callback(res);
            }, complete);
        },

        reqRelations4Design: function (callback, complete) {
            // todo 先用的配置的接口
            BI.reqGet("/conf/relations", "", callback, complete);
        },

        getPackGroupInfo: function (callback, complete) {
            this._reqGet("/groups/info", "", callback, complete);
        },

        // 判断用户的公式是否正确
        getFormulaValidation: function (data, callback, complete) {
            BI.reqPost("/conf/analysis/expression", data, function (res) {
                callback(res);
            }, complete);
        },

        // 上传图片
        postImages: function (attachId, callback, complete) {
            this._reqPost("/image/" + attachId + "/save", {}, function (res) {
                callback(res);
            }, complete);
        },

        // 获取当前模板中用到的表及其主表和子表
        getTablesByTemplateId: function (data, callback, complete) {
            this._reqPost("/template/tables", data, function (res) {
                callback(res.data.tables);
            }, complete);
        },

        getAllRelatedTablesByTable: function (tableName, callback, complete) {
            this._reqGet(BI.Utils.getEncodeURL("/relations/tables/{tableName}", tableName), "", function (res) {
                callback(res.data.tables);
            }, complete);
        },

        getPackIdByTableName: function (tableName, callback, complete) {
            this._reqGet(BI.Utils.getEncodeURL("/{tableName}/pack", tableName), "", function (res) {
                callback(res.data);
            }, complete);
        },

        getTablesByFieldIds: function (fieldIds, callback, complete) {
            this._reqPost("/tables/fields", {
                fieldIds: fieldIds
            }, function (res) {
                callback(res.data.tables);
            }, complete);
        },

        getAllTemplates: function (callback, complete) {
            this._reqPost("/templates", {}, function (res) {
                callback(res.data);
            }, complete);
        },

        searchWidgetsByName: function (name, callback, complete) {
            this._reqPost("/widgets", {
                name: name
            }, function (res) {
                callback(res.data);
            }, complete);
        },

        reqWidgetsByTemplateId: function (template, callback, complete) {
            this._reqPost("/widgets/templates", {
                reportId: template.reportId,
                createBy: template.createBy
            }, function (res) {
                callback(res.data);
            }, complete);
        },

        // 获取所有无权限的fields
        getAllNoAuthFields: function (data, callback, complete) {
            this._reqPost("/unauthorized/fields", data, function (res) {
                BI.pool.noAuthFields = res.data || [];
                callback();
            }, complete);
        },

        updateSession: function (callback) {
            BI.socket.emit("updateReportSession", {
                reportId: BI.designModel.reportId,
                sessionId: BI.sessionId
            }, callback);
        },

        closeSession: function (callback, complete) {
            this._reqPostSync("/widget/template/session/" + BI.sessionId + "/shutdown", {
                reportId: BI.designModel.reportId,
                sessionId: BI.sessionId
            }, function () {
                callback();
            }, complete);
        },

        reportSaveAs: function (from, to, callback, complete) {
            BI.reqPost("/platform/dashboard/saveas", {
                from: from,
                to: to
            }, callback, complete);
        },

        _reqGet: function (url, data, success, complete, opt) {
            return BI.reqGet(moduleRouter + url, data, success, complete, opt);
        },

        _reqPost: function (url, data, success, complete, opt) {
            return BI.reqPost(moduleRouter + url, data, success, complete, opt);
        },

        _reqPostSync: function (url, data, success, complete, opt) {
            return BI.reqPostSync(moduleRouter + url, data, success, complete, opt);
        }
    });
})();
!(function () {
    BI.Utils = BI.Utils || {};

    BI.extend(BI.Utils, {

        isDimensionValidById: function (dId) {
            return BI.Utils.getDimensionState(dId) === BICst.FIELD_STATE.NORMAL;
        },

        getDimensionState: function (dId) {
            if (!BI.Utils.isDimensionExist(dId)) {
                return BICst.DIMENSION_STATE.NORMAL;
            }
            var wId = BI.Utils.getWidgetIdBydId(dId);
            var type = this.getSwitchDimensionRedMarkTypeById(dId);
            var fields = this.getFieldsOfWidget(wId);
            var fieldId = this.getMeasureSwitchFieldById(dId);
            var filedType = this.getFieldTypeByDimensionType(type);
            if (type === BICst.DESIGN.DIMENSION_TYPE.DATA_MINING) {
                return BICst.DIMENSION_STATE.NORMAL;
            }

            var fieldState = this.getFieldStateOfWidget(wId, fieldId);

            // 判断字段丢失
            switch (fieldState) {
                case BICst.FIELD_STATE.NO_AUTH:
                    return BICst.FIELD_STATE.NO_AUTH;
                case BICst.FIELD_STATE.AGG_IN_DETAIL:
                    return BICst.DIMENSION_STATE.AGG_IN_DETAIL;
                case BICst.FIELD_STATE.FIELD_TYPE_ERROR:
                    return BICst.DIMENSION_STATE.FIELD_TYPE_ERROR;
                case BICst.FIELD_STATE.NORMAL:
                    break;
                default:
                    return BICst.DIMENSION_STATE.FIELD_MISS;
            }

            var result = BI.find(fields, function (idx, field) {
                return field.id === fieldId && field.type === filedType;
            });
            return BI.isNotNull(result) ? BICst.DIMENSION_STATE.NORMAL : BICst.DIMENSION_STATE.FIELD_TYPE_ERROR;
        },

        getDimensionConfBydIdAndFieldId: function (dId, fId) {
            var wId = BI.Utils.getWidgetIdBydId(dId);
            if (this.isControlWidgetByWidgetId(wId)) {
                // 控件的过滤设置等存dimension中
                return this._getDimensionById(dId);
            }
            var dType = BI.Utils.getDimensionTypeById(dId);
            // 非维度字段对应的field
            var field = BI.Utils.getFieldByIdOfWidget(wId, BI.Utils.getFieldIdBydId(dId));
            var mIds = BI.map(BI.designModel.widgets[wId].measures, "id");
            var cal;
            switch (dType) {
                case BICst.DESIGN.DIMENSION_TYPE.DATA_MINING:
                    return {};
                // 组件的过滤设置存measure上
                case BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_NUMBER:
                case BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_CAL:
                case BICst.DESIGN.DIMENSION_TYPE.STRING:
                case BICst.DESIGN.DIMENSION_TYPE.DATE:
                    // 维度字段对应的field可能是维度切换后或者钻取后的当前字段
                    field = BI.Utils.getFieldByIdOfWidget(wId, fId);
                    // 维度切换后或者钻取后的当前字段对应的维度分组
                    var msGroupType = "group_" + this.getDimensionGroupTypeBydIdAndFieldId(dId, fId);
                    if (!mIds.contains(field.id) || !field.group || !field.group[msGroupType]) {
                        return {};
                    }
                    return field.group[msGroupType];
                case BICst.DESIGN.DIMENSION_TYPE.COUNTER:
                    // 记录数
                    var counterDepKey = "counterDep_" + BI.Utils.getDimensionCounterDepById(dId);
                    cal = "cal_" + BI.Utils.getDimensionCalculationTypeById(dId);
                    if (!mIds.contains(field.id)) {
                        return {};
                    }
                    if (field.group && field.group[counterDepKey] && field.group[counterDepKey]["cal"] && field.group[counterDepKey]["cal"][cal]) {
                        return field.group[counterDepKey]["cal"][cal];
                    }
                    return {};
                default:
                    var groupType = "summary_" + BI.Utils.getDimensionGroupTypeById(dId);
                    cal = "cal_" + BI.Utils.getDimensionCalculationTypeById(dId);
                    if (!mIds.contains(field.id)) {
                        return {};
                    }
                    if (field.group && field.group[groupType] && field.group[groupType]["cal"] && field.group[groupType]["cal"][cal]) {
                        return field.group[groupType]["cal"][cal];
                    }
                    return {};
            }
        },

        getDimensionGroupTypeBydIdAndFieldId: function (dId, fieldId) {
            if (BI.Utils.getFieldIdBydId(dId) === fieldId) {
                return BI.Utils.getDimensionGroupTypeById(dId);
            }
            var measureConf = BI.Utils._getDimensionOperatorsBydId(dId);
            var drillFields = measureConf.drillFields || {};
            if (drillFields[fieldId] && drillFields[fieldId].group && drillFields[fieldId].group.type) {
                return drillFields[fieldId].group.type;
            }
            return BI.Utils.getDefaultGroupTypeByFieldIdOfWidget(BI.Utils.getWidgetIdBydId(dId), fieldId);
        },

        getDimensionNameBydIdAndFieldId: function (dId, fieldId, notDisplayName) {
            var wId = this.getWidgetIdBydId(dId);
            if (BI.Utils.getDimensionTypeById(dId) === BICst.DESIGN.DIMENSION_TYPE.DATA_MINING) {
                var dataMining = BI.designModel.widgets[wId].dataMining;
                if (dataMining.algorithmName === BICst.RAPID_DATA_MINING.ALGORITHM.KMEANS) {
                    return dataMining.clusterName;
                }
            }
            if (this.isControlWidgetByWidgetId(wId)) {
                return this._getDimensionById(dId).name;
            }
            var name;
            if (notDisplayName === true) {
                name = this.getFieldNameByIdOfWidget(wId, fieldId)
                    || this.getOriginFieldNameById(fieldId);
            } else {
                name = BI.Utils.getDimensionConfBydIdAndFieldId(dId, fieldId).displayName
                    || this.getFieldNameByIdOfWidget(wId, fieldId)
                    || this.getOriginFieldNameById(fieldId);
            }

            var geoName = "";
            switch (BI.Utils.getDimensionGroupTypeById(dId)) {
                case BICst.DESIGN.GROUP.LONGITUDE:
                    if (BI.Utils.isDrillDimensionById(dId)) {
                        name = BI.Utils.getDrillNameByIdOfWidget(wId, BI.Utils.getFieldIdBydId(dId));
                    }
                    geoName = BI.i18nText("BI-Design_Longitude_With_Brackets");
                    break;
                case BICst.DESIGN.GROUP.LATITUDE:
                    if (BI.Utils.isDrillDimensionById(dId)) {
                        name = BI.Utils.getDrillNameByIdOfWidget(wId, BI.Utils.getFieldIdBydId(dId));
                    }
                    geoName = BI.i18nText("BI-Design_Latitude_With_Brackets");
                    break;
                default:
                    break;
            }
            return name + geoName;
        },

        _getDimensionOperatorsBydId: function (dId) {
            // 只根据group找dimension的配置，不考虑维度切换、钻取联动后dimension的配置
            var fId = BI.Utils.getFieldIdBydId(dId);
            return BI.Utils.getDimensionConfBydIdAndFieldId(dId, fId);
        },

        _getResultDimensionOperatorBydId: function (dId) {
            // 考虑维度切换、钻取联动后dimension的配置,获取维度过滤、排序
            var fId = BI.Utils.getResultDimensionFieldIdById(dId);
            return BI.Utils.getDimensionConfBydIdAndFieldId(dId, fId);
        },

        _getSwitchDimensionOperatorBydId: function (dId) {
            // 只考虑维度切换、不考虑钻取联动后dimension的配置,获取维度过滤、排序
            var fId = BI.Utils.getMeasureSwitchFieldById(dId);
            return BI.Utils.getDimensionConfBydIdAndFieldId(dId, fId);
        },

        // 维度下拉钻取顺序drillOrder、钻取drillSequence、维度切换switchField、子维度的分组drillFields放到钻取目录的第一个节点对应的分组配置，
        // 普通维度指标字段下拉配置用这些方法
        // 调用this._getDimensionOperatorsBydId(dId)
        getMeasureDrillFieldsById: function (dId) {
            var dim = BI.Utils._getDimensionOperatorsBydId(dId);
            if (BI.isNotNull(dim)) {
                return dim.drillFields || {};
            }
        },

        getMeasureDrillOrderById: function (dId) {
            var dim = this._getDimensionOperatorsBydId(dId);
            if (BI.isNotNull(dim)) {
                return dim.drillOrder || BICst.DRILL_ORDER.FIXED;
            }
        },

        getMeasureDrillSequenceById: function (dId) {
            var dim = this._getDimensionOperatorsBydId(dId);
            if (BI.isNotNull(dim)) {
                return dim.drillSequence || [];
            }
        },

        getMeasureSwitchFieldById: function (dId) {
            var dim = this._getDimensionOperatorsBydId(dId);
            if (BI.isNotNull(dim)) {
                return dim.switchFieldId || BI.Utils.getFieldIdBydId(dId);
            }
        },

        getMeasureRepeatCalById: function (dId) {
            var dim = this._getDimensionOperatorsBydId(dId);
            if (BI.isNotNull(dim)) {
                return dim.repeatCal;
            }
        },

        // 其他属性除值轴设置外的维度指标下拉设置存在对应字段的分组配置
        // 去配置分两种场景，维度切换之后当前维度字段的配置和做了钻取、联动之后当前维度字段的配置
        // 想用获取维度切换后当前维度字段的配置调用this._getSwitchDimensionOperatorBydId(dId)
        getSwitchMeasureSettingById: function (dId) {
            var operator = this._getSwitchDimensionOperatorBydId(dId);
            return operator.settings || {};
        },

        getSwitchMeasureStackById: function (dId) {
            var operator = this.getSwitchMeasureSettingById(dId);
            if (BI.isNotNull(operator)) {
                return operator.stack;
            }
        },

        getSwitchMeasureFilterById: function (dId) {
            var operator = this._getSwitchDimensionOperatorBydId(dId);
            if (BI.isNotNull(operator)) {
                return BI.deepClone(operator.filter);
            }
        },

        getSwitchMeasureSortById: function (dId) {
            var operator = this._getSwitchDimensionOperatorBydId(dId);
            if (BI.isNotNull(operator)) {
                return BI.deepClone(operator.sort);
            }
        },

        // 想用获取钻取之后最终结果维度字段的配置调用this._getResultDimensionOperatorBydId(dId)
        // 普通的维度字段和指标字段调用这个
        getResMeasureFilterById: function (dId) {
            var operator = this._getResultDimensionOperatorBydId(dId);
            if (BI.isNotNull(operator)) {
                return BI.deepClone(operator.filter);
            }
        },

        getResMeasureSortById: function (dId) {
            var operator = this._getResultDimensionOperatorBydId(dId);
            if (BI.isNotNull(operator)) {
                return BI.deepClone(operator.sort);
            }
        },

        getResMeasureSettingsById: function (dId) {
            // 获取最终的settings
            var operator = this._getResultDimensionOperatorBydId(dId);
            return operator.settings || {};
        },

        getResMeasureShowMissingTimeById: function (dId) {
            var operator = this._getResultDimensionOperatorBydId(dId);
            if (BI.isNotNull(operator)) {
                return operator.showMissingTime;
            }
        },

        // 放到维度上的配置
        // 普通维度指标字段的分组和钻取维度的第一个字段的分组放dimension.group.type
        getDimensionGroupTypeById: function (dId) {
            var dim = this._getDimensionById(dId);
            if (BI.isNotNull(dim) && BI.isNotNull(dim.group) && BI.isNotNull(dim.group.type)) {
                return dim.group.type;
            }
            return BI.Utils.getDefaultGroupTypeByFieldIdOfWidget(BI.Utils.getWidgetIdBydId(dId), BI.Utils.getFieldIdBydId(dId));
        },

        getTargetMetricTypeById: function (dId) {
            var dim = this._getDimensionById(dId);
            if (BI.isNotNull(dim)) {
                return dim.metric;
            }
        },

        getDimensionTypeById: function (dId) {
            var dim = this._getDimensionById(dId);
            if (BI.isNotNull(dim)) {
                return dim.type;
            }
        },

        getFieldIdBydId: function (dId) {
            var dim = this._getDimensionById(dId);
            if (BI.isNotNull(dim)) {
                return dim.fieldId;
            }
        },

        getDimensionCounterDepById: function (dId) {
            var dim = this._getDimensionById(dId);
            if (BI.isNotNull(dim)) {
                return dim.counterDep || BICst.DESIGN.COUNTER_DEP.TOTAL_ROWS;
            }
            return BICst.DESIGN.COUNTER_DEP.TOTAL_ROWS;
        },

        getDimensionCalculationTypeById: function (dId) {
            var dim = this._getDimensionById(dId);
            if (BI.isNotNull(dim) && BI.isNotNull(dim.calculation) && BI.isNotNull(dim.calculation.type)) {
                return dim.calculation.type;
            }
            return BICst.DESIGN.RAPID_CALCULATE_TYPE.NONE;
        },

        // 获取维度的type、维度的分组、维度的值轴设置
        // 维度上需要通过维度切换和结果的配置进行计算的配置
        getSwitchDimensionTypeById: function (dId) {
            var type = BI.Utils.getDimensionTypeById(dId);
            switch (type) {
                case BICst.DESIGN.DIMENSION_TYPE.DATA_MINING:
                    return type;
                default:
                    break;
            }
            var fieldId = BI.Utils.getMeasureSwitchFieldById(dId);
            var wId = BI.Utils.getWidgetIdBydId(dId);
            return BI.Utils.getDimensionTypeByFieldType(BI.Utils.getFieldTypeByIdOfWidget(wId, fieldId));
        },

        // 获取widget中保存的维度类型，用于判断field类型改变
        getSwitchDimensionRedMarkTypeById: function (dId) {
            var type = BI.Utils.getDimensionTypeById(dId);
            switch (type) {
                case BICst.DESIGN.DIMENSION_TYPE.DATA_MINING:
                    return type;
                default:
                    break;
            }
            var fieldId = BI.Utils.getMeasureSwitchFieldById(dId);
            var fId = BI.Utils.getFieldIdBydId(dId);
            var wId = BI.Utils.getWidgetIdBydId(dId);
            var drillDir = BI.Utils.getDrillDirByIdOfWidget(wId, fId);
            BI.each(drillDir, function (idx, drill) {
                if (drill.id === fieldId) {
                    type = BI.Utils.getDimensionTypeByFieldType(drill.type);
                }
            });
            return type;
        },

        // 获取维度切换之后当前字段分组
        getSwitchDimensionGroupTypeById: function (dId) {
            var switchFieldId = BI.Utils.getMeasureSwitchFieldById(dId);
            return BI.Utils.getDimensionGroupTypeBydIdAndFieldId(dId, switchFieldId);
        },

        getSwitchDimensionConfById: function (dId) {
            var dim = BI.Utils._getDimensionById(dId);
            var fieldId = BI.Utils.getMeasureSwitchFieldById(dId);
            if (BI.isNotNull(dim) && fieldId === BI.Utils.getFieldIdBydId(dId)) {
                return BI.deepClone(dim);
            }
            return dim.drillDimensions[fieldId] || {};
        },

        getSwitchDimensionSettingById: function (dId) {
            var dimConf = BI.Utils.getSwitchDimensionConfById(dId);
            return dimConf.settings || {};
        },

        getResultDimensionTypeById: function (dId) {
            var self = this;
            var wId = this.getWidgetIdBydId(dId);
            var type = this.getDimensionTypeById(dId);
            var operator = this._getDimensionOperatorsBydId(dId);

            if (operator.switchFieldId) {
                type = self.getDimensionTypeByFieldType(this.getFieldTypeByIdOfWidget(wId, operator.switchFieldId));
            }
            if (operator.drillSequence && operator.drillSequence.length > 0) {
                var fieldId = BI.last(operator.drillSequence).to;
                type = self.getDimensionTypeByFieldType(this.getFieldTypeByIdOfWidget(wId, fieldId));
            }
            return type;
        },

        getResultDimensionFieldIdById: function (dId) {
            var fieldId = this.getMeasureSwitchFieldById(dId);
            var operator = this._getDimensionOperatorsBydId(dId);
            if (operator.drillSequence && operator.drillSequence.length > 0) {
                fieldId = BI.last(operator.drillSequence).to;
            }
            return fieldId;
        },

        getResultDimensionConfById: function (dId) {
            var dim = this._getDimensionById(dId);
            var fieldId = this.getResultDimensionFieldIdById(dId);

            if (BI.isNotNull(dim) && fieldId === BI.Utils.getFieldIdBydId(dId)) {
                return BI.deepClone(dim);
            }
            return dim.drillDimensions[fieldId] || {};
        },

        getResultDimensionGroupTypeById: function (dId) {
            var resFieldId = BI.Utils.getResultDimensionFieldIdById(dId);
            return BI.Utils.getDimensionGroupTypeBydIdAndFieldId(dId, resFieldId);
        },

        getResDimensionSettingById: function (dId) {
            var dim = this.getResultDimensionConfById(dId);
            return dim.settings || {};
        },

        getDimensionSharedAxisById: function (dId) {
            var setting = BI.Utils.getResDimensionSettingById(dId);
            var viewAttr = BI.Utils.getWidgetViewAttrById(BI.Utils.getWidgetIdBydId(dId));
            var regionType = BI.Utils.getRegionTypeById(dId);

            // 指标聚合状态下才有共享轴
            if (viewAttr[regionType].type === BICst.DESIGN.VIEW_ATTR.PARALLEL) {
                return;
            }
            if (setting.valueAxis && setting.valueAxis.sharedAxis) {
                return setting.valueAxis.sharedAxis;
            }
            return BICst.CHART.SHARE_VALUE_AXIS.LEFT;
        },

        // 其他
        getDetailDimensionFilterById: function (dId) {
            var wId = this.getWidgetIdBydId(dId);
            var settings = this.getWidgetSettingsById(wId);
            var filterValue = settings.tableAttr.filterValue;
            return filterValue[dId];
        },

        isDrillDimensionById: function (dId) {
            var fId = this.getFieldIdBydId(dId);
            var wId = this.getWidgetIdBydId(dId);
            return BI.Utils.isDrillField(wId, fId);
        },

        isAggCalculateTarget: function (dId) {
            var fId = this.getFieldIdBydId(dId);
            var wId = this.getWidgetIdBydId(dId);

            return this.checkFieldIsAgg(wId, fId);
        },

        getCalculateTargetIdsById: function (dId) {
            var fId = this.getFieldIdBydId(dId);
            var wId = this.getWidgetIdBydId(dId);
            return this.getCalculateTargetIdsByFieldIdOfWidget(wId, fId);
        },

        getCalculateTypeById: function (dId) {
            var dimension = this._getDimensionById(dId);
            return dimension.calculation ? dimension.calculation.type : null;
        },

        _getDimensionById: function (dId) {
            var wId = this.getWidgetIdBydId(dId);
            if (!this.isWidgetExistById(wId)) {
                return;
            }
            var widget = BI.designModel.widgets[wId];
            return BI.find(widget.dimensions, function (i, dim) {
                return dim.id === dId;
            });
        },

        isDimensionExist: function (dId) {
            return this.getAllDimensionIDs().contains(dId);
        },

        _getDimensionNameById: function (dId, notDisplayName) {
            var switchField = BI.Utils.getMeasureSwitchFieldById(dId);
            return BI.Utils.getDimensionNameBydIdAndFieldId(dId, switchField, notDisplayName);
        },

        getDimensionNameById: function (dId) {
            return this._getDimensionNameById(dId);
        },

        getDimensionDisplayNameById: function (dId) {
            var switchField = BI.Utils.getMeasureSwitchFieldById(dId);

            return BI.Utils.getDimensionConfBydIdAndFieldId(dId, switchField).displayName;
        },

        getDimensionNameTipById: function (dId) {
            // tip显示转义名 不考虑显示名
            return this._getDimensionNameById(dId, true);
        },

        getWidgetIdBydId: function (dId) {
            var self = this;
            if (!this.dimension2WidgetMap) {
                this.dimension2WidgetMap = {};
            }
            if (BI.isNotNull(this.dimension2WidgetMap[dId])) {
                return this.dimension2WidgetMap[dId];
            }
            var widgets = this.getAllWidgetIds();
            var wid = BI.find(widgets, function (i, wid) {
                var dims = self.getAllDimensionIDs(wid);
                return BI.find(dims, function (j, id) {
                    return dId === id;
                });
            });
            this.dimension2WidgetMap[dId] = wid;
            return wid;
        },

        // 获取dimension所在区域的所有dimensionId
        getRegionDimensionIdsBydId: function (dId) {
            var wId = BI.Utils.getWidgetIdBydId(dId);
            var view = BI.Utils.getWidgetViewById(wId);
            var regionType = BI.findKey(view, function (regionType, dIds) {
                if (BI.contains(dIds, dId)) {
                    return true;
                }
            });
            return view[regionType];
        },

        getDimensionStringCustomGroupValueById: function (dId) {
            var dim = BI.Utils.getDimensionByDIdGroupType(dId, BICst.GROUP.CUSTOM_GROUP);

            if (BI.isNotNull(dim)) {
                return BI.deepClone(dim.customGroup);
            }
        },

        getDimensionNumberCustomGroupValueById: function (dId) {
            var dim = this.getDimensionByDIdGroupType(dId, BICst.GROUP.NUMBER_GROUP);
            if (BI.isNotNull(dim)) {
                return BI.deepClone(dim.customGroup);
            }
        },

        isCalculateTargetById: function (dId) {
            return this.getDimensionTypeById(dId) === BICst.DESIGN.DIMENSION_TYPE.CAL_TARGET;
        },

        getRegionTypeById: function (dId) {
            var wid = this.getWidgetIdBydId(dId);
            var widget = BI.designModel.widgets[wid] || {};
            return BI.findKey(widget.view, function (regionType, dIds) {
                if (BI.contains(dIds, dId)) {
                    return true;
                }
            });
        },

        isTargetById: function (dId) {
            var type = BI.Utils.getDimensionTypeById(dId);
            switch (type) {
                case BICst.DESIGN.DIMENSION_TYPE.NUMBER:
                case BICst.DESIGN.DIMENSION_TYPE.COUNTER:
                case BICst.DESIGN.DIMENSION_TYPE.CAL_TARGET:
                    return true;
                case BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_NUMBER:
                case BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_CAL:
                case BICst.DESIGN.DIMENSION_TYPE.DATE:
                case BICst.DESIGN.DIMENSION_TYPE.STRING:
                default:
                    return false;
            }
        },

        isDimInView: function (dId) {
            var wId = this.getWidgetIdBydId(dId);
            var view = this.getWidgetViewById(wId);
            return BI.some(view, function (id, dims) {
                return dims.contains(dId);
            });
        },

        isLatitudeDimension: function (dId) {
            return this.getDimensionGroupTypeById(dId) === BICst.DESIGN.GROUP.LATITUDE;
        },

        isLongitudeDimension: function (dId) {
            return this.getDimensionGroupTypeById(dId) === BICst.DESIGN.GROUP.LONGITUDE;
        },

        isLatitudeTarget: function (dId) {
            var wId = BI.Utils.getWidgetIdBydId(dId);
            var field = BI.Utils.getFieldByIdOfWidget(wId, BI.Utils.getFieldIdBydId(dId));

            return field && field.geoType === BICst.DESIGN.TARGET_FIELD_GEO.LATITUDE;
        },

        isLongitudeTarget: function (dId) {
            var wId = BI.Utils.getWidgetIdBydId(dId);
            var field = BI.Utils.getFieldByIdOfWidget(wId, BI.Utils.getFieldIdBydId(dId));

            return field && field.geoType === BICst.DESIGN.TARGET_FIELD_GEO.LONGITUDE;
        },

        // 判断某一个字段是否已经转化为地理角色字段
        isGeometricDimension: function (dId) {
            return this.isLatitudeDimension(dId) || this.isLongitudeDimension(dId)
                || this.isLatitudeTarget(dId) || this.isLongitudeTarget(dId);
        },

        // 是否为指标名称字段
        isTargetNameFieldById: function (dId) {
            return BI.Utils.getDimensionTypeById(dId) === BICst.DESIGN.DIMENSION_TYPE.TARGET_NAME;
        },

        isClusterDimById: function (dId) {
            return BI.Utils.getDimensionTypeById(dId) === BICst.DESIGN.DIMENSION_TYPE.DATA_MINING;
        },

        getFieldNameByDId: function (dId) {
            var wId = this.getWidgetIdBydId(dId);
            var fieldId = this.getFieldIdBydId(dId);
            return this.getFieldNameByIdOfWidget(wId, fieldId);
        },

        getSamePropertyDimensionGroupBydIds: function (dIds) {
            var self = this;
            dIds = dIds || [];
            var stringMap = {}, numberMap = {}, counterMap = {};
            var wId;
            if (BI.isNotEmptyArray(dIds)) {
                wId = BI.Utils.getWidgetIdBydId(dIds[0]);
            }
            BI.each(dIds, function (idx, dId) {
                switch (BI.Utils.getDimensionTypeById(dId)) {
                    case BICst.DESIGN.DIMENSION_TYPE.STRING:
                    case BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_NUMBER:
                    case BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_CAL:
                    case BICst.DESIGN.DIMENSION_TYPE.DATE:
                    case BICst.DESIGN.DIMENSION_TYPE.DATA_MINING:
                        groupString(dId);
                        break;
                    case BICst.DESIGN.DIMENSION_TYPE.COUNTER:
                        groupCounter(dId);
                        break;
                    default:
                        groupNumber(dId);
                        break;
                }
            });
            var result = BI.extend(numberMap, counterMap, stringMap);
            var map = {};
            BI.each(result, function (key, array) {
                map[BI.UUID()] = {
                    group: key,
                    dimensionIds: array
                };
            });
            return map;

            function groupString (dId) {
                var fieldId = self.getMeasureSwitchFieldById(dId);
                var key = wId + "_" + fieldId + "_" + BI.Utils.getSwitchDimensionGroupTypeById(dId);
                if (BI.isNull(stringMap[key])) {
                    stringMap[key] = [];
                }
                stringMap[key].push(dId);
            }

            function groupNumber (dId) {
                var fieldId = self.getMeasureSwitchFieldById(dId);
                var groupType = BI.Utils.getSwitchDimensionGroupTypeById(dId) || BICst.SUMMARY_TYPE.SUM;
                var key = wId + "_" + fieldId + "_" + groupType + "_" + self.getDimensionCalculationTypeById(dId);
                if (BI.isNull(numberMap[key])) {
                    numberMap[key] = [];
                }
                numberMap[key].push(dId);
            }

            function groupCounter (dId) {
                var counterDepKey = self.getDimensionCounterDepById(dId);
                var key = wId + "_" + counterDepKey + "_" + self.getDimensionCalculationTypeById(dId);
                if (BI.isNull(counterMap[key])) {
                    counterMap[key] = [];
                }
                counterMap[key].push(dId);
            }
        },

        getDimensionsGroupIdBydId: function (dId) {
            var wId = BI.Utils.getWidgetIdBydId(dId);
            return BI.findKey(BI.designModel.widgets[wId].dimensionGroups, function (idx, obj) {
                return BI.contains(obj.dimensionIds, dId);
            });
        },

        // '年月日' '年周数' '年月' '年季度' '年'时,才可进行时序预测
        isSupportForecastingDateById: function (dId) {
            switch (BI.Utils.getSwitchDimensionGroupTypeById(dId)) {
                case BICst.DESIGN.GROUP.YMD:
                case BICst.DESIGN.GROUP.YW:
                case BICst.DESIGN.GROUP.YM:
                case BICst.DESIGN.GROUP.YS:
                case BICst.DESIGN.GROUP.Y:
                    return true;
                default:
                    return false;
            }
        },

        getForecastingDateUnitById: function (dId) {
            switch (BI.Utils.getSwitchDimensionGroupTypeById(dId)) {
                case BICst.DESIGN.GROUP.YMD:
                    return BI.i18nText("BI-Basic_Multi_Date_DAY");
                case BICst.DESIGN.GROUP.YW:
                    return BI.i18nText("BI-Basic_Multi_Date_Week");
                case BICst.DESIGN.GROUP.YM:
                    return BI.i18nText("BI-Basic_Multi_Date_Month");
                case BICst.DESIGN.GROUP.YS:
                    return BI.i18nText("BI-Basic_Quarter");
                case BICst.DESIGN.GROUP.Y:
                    return BI.i18nText("BI-Basic_Multi_Date_Year");
                default:
                    return "";
            }
        },

        // 根据dId和groupType获取对应分组信息
        getDimensionByDIdGroupType: function (dId, groupType) {
            var wId = this.getWidgetIdBydId(dId);

            var mIds = BI.map(BI.designModel.widgets[wId].measures, "id");

            var field = this.getFieldByIdOfWidget(wId, this.getMeasureSwitchFieldById(dId));
            var msGroupType = "group_" + ((groupType) || this.getDefaultGroupTypeByFieldIdOfWidget(wId, field.id));
            if (!mIds.contains(field.id) || !field.group || !field.group[msGroupType]) {
                return {};
            }
            return field.group[msGroupType];
        },

        getDrillDimensionFilterById: function (dId) {
            var wId = BI.Utils.getWidgetIdBydId(dId);
            var fId = this.getFieldIdBydId(dId);

            var filters = {};

            BI.each(BI.map(BI.Utils.getDrillDirByIdOfWidget(wId, fId), "id"), function (index, fieldId) {
                var groupType = BI.Utils.getDimensionGroupTypeBydIdAndFieldId(dId, fieldId);

                var msGroupType = "group_" + groupType;
                var field = BI.Utils.getFieldByIdOfWidget(wId, fieldId);

                if (BI.isNull(field.group)) return;

                if (BI.isNull(field.group[msGroupType])) return;
                var filter = field.group[msGroupType].filter;

                if (BI.isNull(filter)) return;

                filters[fieldId] = filter;
            });

            return filters;
        }
    });
})();
/**
 * @author: Teller
 * @createdAt: 2018/5/27 下午3:14
 * @Description: 过滤相关
 */

BI.Utils = BI.Utils || {};

BI.extend(BI.Utils, {
    getFilterItemsByWidgetId: function (wId, removeClickValue) {
        var allWidgetIds = BI.Utils.getAllWidgetIds();
        var self = this, items = [];
        var widget = BI.designModel.widgets[wId] || {};
        // 找到所有控件的过滤条件
        BI.each(allWidgetIds, function (i, id) {
            if (BI.Utils.isControlWidgetByWidgetId(id)) {
                // 通用查询
                if (BI.Utils.getWidgetTypeById(id) === BICst.DESIGN.WIDGET.GENERAL_QUERY) {
                    var value = BI.Utils.getWidgetValueById(id);
                    var item = self._parseGeneralQueryFilter(value);
                    if (BI.isNotNull(item)) {
                        items.push(item);
                    }
                } else {
                    var text = BI.Utils.getControlWidgetValueTextByWid(id);
                    if (BI.isNotNull(text) && text !== "") {
                        items.push({
                            type: "bi.design.filter_pane.control_item",
                            iconCls: BI.Utils.getWidgetIconById(id),
                            cls: "bi-split-right bi-split-bottom",
                            wId: id,
                            text: text,
                            id: BI.UUID()
                        });
                    }
                }
            }
        });

        // 组件的联动条件
        var linkWidgets = widget.linkage;
        BI.each(linkWidgets, function (linkId) {
            if (!BI.Utils.isWidgetExistById(linkId) ||
                BI.isEmpty(BI.Utils.getClickedOfWidget(linkId))) {
                return;
            }
            items.push({
                type: "bi.design.table_chart.filter_pane.linkage_item",
                cls: "bi-split-bottom bi-split-right",
                id: BI.UUID(),
                wId: linkId,
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function (v) {
                        if (BI.isFunction(removeClickValue)) {
                            removeClickValue(v);
                        }
                    }
                }]
            });
        });

        // todo 跳转条件
        // 表头上设置的指标过滤条件
        var targetFilter = widget.filterValue;
        BI.each(targetFilter, function (tId, filter) {
            items.push(self._parseTargetFilter(tId, filter));
        });

        // 表头上设置的过滤条件，还要加上所有dimension的过滤条件
        var wType = BI.Utils.getWidgetTypeById(wId);

        // 明细表表头过滤
        if (wType === BICst.DESIGN.WIDGET.DETAIL) {
            var filters = BI.Utils.getWidgetFilterById(wId);

            BI.each(filters, function (tId, filter) {
                var child = self._parseDetailHeaderFilter(tId, filter, wId);

                items.push(child);
            });
        }

        var dimIds = BI.Utils.getAllDimensionIDs(wId);
        BI.each(dimIds, function (i, dimId) {
            if (BI.Utils.isDimensionExist(dimId)) {
                // drill时需要特殊处理
                if (BI.Utils.isDrillDimensionById(dimId)) {
                    var fValues = BI.Utils.getDrillDimensionFilterById(dimId);

                    BI.each(fValues, function (fId, fValue) {
                        if (fValue && BI.isNotEmptyObject(fValue) && wType !== BICst.DESIGN.WIDGET.DETAIL) {
                            var child = self._parseDrillFilter(dimId, fId, fValue, wId);
                            BI.isNotNull(child) && items.push(child);
                        }
                    });

                } else {
                    var fValue = BI.Utils.getResMeasureFilterById(dimId);

                    if (fValue && BI.isNotEmptyObject(fValue) && wType !== BICst.DESIGN.WIDGET.DETAIL) {
                        var child = self._parseDimensionFilter(dimId, fValue, wId);
                        BI.isNotNull(child) && items.push(child);
                    }
                }
            }
        });

        return this.wrapperFilterItems(items);
    },

    wrapperFilterItems: function (items) {
        var filterValues = [];
        if (BI.size(items) > 1) {
            filterValues.push({
                value: BICst.ANALYSIS_FILTER_TYPE.AND,
                children: items,
                id: BI.UUID()
            });
        } else {
            filterValues = items;
        }

        return filterValues;
    },

    getLinkItemsTextByWId: function (wId) {
        var texts = [];

        var clicked = BI.Utils.getClickedOfWidget(wId);
        if (BI.isNotNull(clicked) && BI.isNotNull(clicked.value)) {
            BI.each(clicked.value, function (i, v) {
                var dimensionName = "";

                var text = v.text;

                if (BI.Utils.isDrillDimensionById(v.dId)) {
                    dimensionName = BI.Utils.getFieldDisplayName(BI.Utils.getFieldByIdOfWidget(wId, v.fieldId));
                } else {
                    dimensionName = BI.Utils.getDimensionNameById(v.dId);
                }

                // 时间类型需要reformat
                if (BI.Utils.getFieldTypeByIdOfWidget(wId, v.fieldId) === BICst.COLUMN.DATE) {
                    text = BI.Format.formatValueByGroup(text, BI.Utils.getResultDimensionGroupTypeById(v.dId));
                }

                texts.push({
                    text: dimensionName + "=" + text,
                    value: v
                });
            });
        }

        return texts;
    },

    getFilterValue4ExportByWid: function (wId, nameMap) {
        var self = this;
        var items = this.getFilterItemsByWidgetId(wId);

        function transformItem (item) {
            var value, opt = {};
            if (item.type === "bi.design.table_chart.filter_pane.dim_filter") {
                if (BI.isNotNull(item.tId)) {
                    opt.tId = item.tId;
                } else {
                    opt.fieldId = item.fieldId;
                }
                value = {
                    type: BICst.ANALYSIS_FILTER_TYPE.NONE,
                    text: self.transformFilterItemsToText(item.filter, opt).text
                };
            } else if (item.type === "bi.design.table_chart.filter_pane.drill_filter") {
                opt = {
                    wId: item.wId,
                    tId: item.tId,
                    fieldId: item.fieldId,
                    isDrillFilter: true
                };
                value = {
                    type: BICst.ANALYSIS_FILTER_TYPE.NONE,
                    text: self.transformFilterItemsToText(item.filter, opt).text
                };
            } else if (BI.isNotNull(item.children)) {
                value = {
                    type: item.value,
                    children: []
                };

                BI.each(item.children, function (idx, child) {
                    value.children.push(transformItem(child));
                });
            } else if (item.type === "bi.design.table_chart.filter_pane.linkage_item") {
                BI.each(BI.Utils.getLinkItemsTextByWId(item.wId), function (index, textObj) {
                    value = {
                        type: BICst.ANALYSIS_FILTER_TYPE.NONE,
                        text: [nameMap[item.wId], textObj.text].join(" ")
                    };
                });
            } else {
                value = {
                    type: BICst.ANALYSIS_FILTER_TYPE.NONE,
                    text: (item.type === "bi.design.filter_pane.control_item" ? nameMap[item.wId] + " " : "") + item.text
                };
            }

            return value;
        }

        var filterValue = [];

        BI.each(items, function (index, item) {
            filterValue.push(transformItem(item));
        });

        return filterValue;
    },

    _parseGeneralQueryFilter: function (filter) {
        var self = this;
        if (BI.isNull(filter)) {
            return;
        }
        if (filter.filterType === BICst.ANALYSIS_FILTER_TYPE.AND || filter.filterType === BICst.ANALYSIS_FILTER_TYPE.OR) {
            var children = [];
            BI.each(filter.filterValue, function (i, value) {
                var child = self._parseGeneralQueryFilter(value);
                if (BI.isNotNull(child)) {
                    children.push(self._parseGeneralQueryFilter(value));
                }
            });
            return {
                id: BI.UUID(),
                value: filter.filterType,
                children: children
            };
        } else if (BI.isNotNull(filter.fieldId)) {
            return {
                id: BI.UUID(),
                type: "bi.design.table_chart.filter_pane.dim_filter",
                cls: "bi-split-bottom bi-split-right",
                fieldId: filter.fieldId,
                filter: filter
            };
        }
    },

    _parseDrillFilter: function (dimId, fieldId, filter, wId) {
        var self = this;
        if (filter.filterType === BICst.ANALYSIS_FILTER_TYPE.AND || filter.filterType === BICst.ANALYSIS_FILTER_TYPE.OR) {
            var children = [];
            BI.each(filter.filterValue, function (i, value) {
                var child = self._parseDrillFilter(dimId, fieldId, value, wId);
                BI.isNotNull(child) && children.push(child);
            });
            return {
                id: BI.UUID(),
                value: filter.filterType,
                children: children
            };
        }

        if (filter.filterType === BICst.ANALYSIS_FILTER_TYPE.FORMULA) {
            filter.dimensionGroupIdMap = {};

            var isNull = BI.some(filter.formulaIds, function (index, formulaId) {
                var did = BI.Utils.getDimensionIdByDimensionGroupId(wId, formulaId);
                filter.dimensionGroupIdMap[formulaId] = did;

                return BI.isNull(did);
            });

            if (isNull) return null;
        }

        return {
            id: BI.UUID(),
            type: "bi.design.table_chart.filter_pane.drill_filter",
            cls: "bi-split-bottom bi-split-right",
            fieldId: fieldId,
            tId: dimId,
            wId: wId,
            filter: filter
        };
    },

    _parseDimensionFilter: function (dimId, filter, wId) {
        var self = this;
        if (filter.filterType === BICst.ANALYSIS_FILTER_TYPE.AND || filter.filterType === BICst.ANALYSIS_FILTER_TYPE.OR) {
            var children = [];
            BI.each(filter.filterValue, function (i, value) {
                var child = self._parseDimensionFilter(dimId, value, wId);
                BI.isNotNull(child) && children.push(child);
            });
            return {
                id: BI.UUID(),
                value: filter.filterType,
                children: children
            };
        }
        var dId;

        if (filter.filterType === BICst.ANALYSIS_FILTER_TYPE.FORMULA) {
            dId = BI.Utils.getDimensionIdByDimensionGroupId(wId, dimId);

            filter.dimensionGroupIdMap = {};

            var isNull = BI.some(filter.formulaIds, function (index, formulaId) {
                var did = BI.Utils.getDimensionIdByDimensionGroupId(wId, formulaId);
                filter.dimensionGroupIdMap[formulaId] = did;

                return BI.isNull(did);
            });

            if (isNull) return null;
        } else {
            dId = BI.Utils.getDimensionIdByDimensionGroupId(wId, filter.targetId);
        }

        return BI.isNotNull(dId) ? {
            id: BI.UUID(),
            type: "bi.design.table_chart.filter_pane.dim_filter",
            cls: "bi-split-bottom bi-split-right",
            tId: dId || dimId,
            filter: filter
        } : null;
    },

    _parseDetailHeaderFilter: function (tId, filter, wId) {
        var self = this;
        if (filter.filterType === BICst.ANALYSIS_FILTER_TYPE.AND || filter.filterType === BICst.ANALYSIS_FILTER_TYPE.OR) {
            var children = [];
            BI.each(filter.filterValue, function (i, value) {
                var child = self._parseDetailHeaderFilter(tId, value, wId);
                BI.isNotNull(child) && children.push(child);
            });
            return {
                id: BI.UUID(),
                value: filter.filterType,
                children: children
            };
        }

        return {
            id: BI.UUID(),
            type: "bi.design.table_chart.filter_pane.dim_filter",
            cls: "bi-split-bottom bi-split-right",
            tId: tId,
            filter: filter,
            wId: wId
        };
    },

    transformFilterItemsToText: function (filter, opt) {
        var relation = "", value = "";
        var tId = opt.tId, fieldId = opt.fieldId, isDrillFilter = opt.isDrillFilter, wId = opt.wId;
        var v, sType;

        function formatDateBelongValue () {
            if (isDrillFilter) {
                value = BI.Utils.getDimensionDateTextByGroupType(filter.filterValue.value, BI.Utils.getDimensionGroupTypeBydIdAndFieldId(tId, fieldId));
            } else {
                value = BI.Utils.getDimensionDateText(filter.filterValue.value, tId);
            }
        }

        switch (filter.filterType) {
            // formula
            case BICst.ANALYSIS_FILTER_TYPE.FORMULA:
                relation = BI.i18nText("BI-Basic_Fulfil");
                value = filter.filterValue;
                value = value.replaceAll("\\$\\{.*?\\}", function (dimensionStr) {
                    var dimensionId = dimensionStr.substring(2, dimensionStr.length - 1);

                    return BI.Utils.getDimensionNameById(filter.dimensionGroupIdMap[dimensionId]);
                });
                break;
            // number
            case BICst.ANALYSIS_FILTER_NUMBER.BELONG_VALUE:
                relation = BI.i18nText("BI-Basic_In");
                value = BI.Utils.getNumberRangeText(filter.filterValue);
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.NOT_BELONG_VALUE:
                relation = BI.i18nText("BI-Basic_Not_In");
                value = BI.Utils.getNumberRangeText(filter.filterValue);
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.EQUAL_TO:
                relation = BI.i18nText("BI-Basic_Equal");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.NOT_EQUAL_TO:
                relation = BI.i18nText("BI-Basic_Not_Equal_To");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.LARGE:
                relation = BI.i18nText("BI-Basic_More_Than");
                value = filter.filterValue.value;
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.SMALL:
                relation = BI.i18nText("BI-Basic_Less_Than");
                value = filter.filterValue.value;
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.LARGE_OR_EQUAL:
                relation = BI.i18nText("BI-Basic_More_And_Equal");
                value = filter.filterValue.value;
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.SMALL_OR_EQUAL:
                relation = BI.i18nText("BI-Basic_Less_And_Equal");
                value = filter.filterValue.value;
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.IS_NULL:
                relation = BI.i18nText("BI-Basic_Is_Null");
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.NOT_NULL:
                relation = BI.i18nText("BI-Basic_Not_Null");
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.TOP_N:
                relation = BI.i18nText("BI-Basic_String_Top_N");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_NUMBER.BOTTOM_N:
                relation = BI.i18nText("BI-Basic_String_Bottom_N");
                value = filter.filterValue;
                break;

            // string
            case BICst.ANALYSIS_FILTER_STRING.BELONG_VALUE:
                v = filter.filterValue;
                sType = v.type;
                relation = sType === BI.Selection.All ? BI.i18nText("BI-Basic_Not_In") : BI.i18nText("BI-Basic_In");
                value = v.value;
                break;
            case BICst.ANALYSIS_FILTER_STRING.NOT_BELONG_VALUE:
                v = filter.filterValue;
                sType = v.type;
                relation = sType === BI.Selection.All ? BI.i18nText("BI-Basic_In") : BI.i18nText("BI-Basic_Not_In");
                value = v.value;
                break;
            case BICst.ANALYSIS_FILTER_STRING.CONTAIN:
                relation = BI.i18nText("BI-Basic_Contain");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_STRING.NOT_CONTAIN:
                relation = BI.i18nText("BI-Basic_Not_Contain");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_STRING.IS_NULL:
                relation = BI.i18nText("BI-Basic_Is_Null");
                break;
            case BICst.ANALYSIS_FILTER_STRING.NOT_NULL:
                relation = BI.i18nText("BI-Basic_Not_Null");
                break;
            case BICst.ANALYSIS_FILTER_STRING.BEGIN_WITH:
                relation = BI.i18nText("BI-Basic_Begin_With");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_STRING.END_WITH:
                relation = BI.i18nText("BI-Basic_End_With");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_STRING.TOP_N:
                relation = BI.i18nText("BI-Basic_String_Top_N");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_STRING.BOTTOM_N:
                relation = BI.i18nText("BI-Basic_String_Bottom_N");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_STRING.NOT_BEGIN_WITH:
                relation = BI.i18nText("BI-Basic_Not_Begin_With");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_STRING.NOT_END_WITH:
                relation = BI.i18nText("BI-Basic_Not_End_With");
                value = filter.filterValue;
                break;
            // date
            case BICst.ANALYSIS_FILTER_DATE.BELONG_VALUE:
                relation = BI.i18nText("BI-Basic_In");
                value = BI.Utils.getDateRangeText(filter.filterValue);
                break;
            case BICst.ANALYSIS_FILTER_DATE.NOT_BELONG_VALUE:
                relation = BI.i18nText("BI-Basic_Not_In");
                value = BI.Utils.getDateRangeText(filter.filterValue);
                break;
            case BICst.ANALYSIS_FILTER_DATE.LESS_THAN:
                relation = BI.i18nText("BI-Basic_Date_Less_Than");
                value = BI.Utils.getDateText(filter.filterValue);
                break;
            case BICst.ANALYSIS_FILTER_DATE.MORE_THAN:
                relation = BI.i18nText("BI-Basic_Date_More_Than");
                value = BI.Utils.getDateText(filter.filterValue);
                break;
            case BICst.ANALYSIS_FILTER_DATE.EQUAL_TO:
                relation = BI.i18nText("BI-Basic_Equal");
                value = BI.Utils.getDateText(filter.filterValue);
                break;
            case BICst.ANALYSIS_FILTER_DATE.NOT_EQUAL_TO:
                relation = BI.i18nText("BI-Basic_Not_Equal_To");
                value = BI.Utils.getDateText(filter.filterValue);
                break;
            case BICst.ANALYSIS_FILTER_DATE.IS_NULL:
                relation = BI.i18nText("BI-Basic_Is_Null");
                break;
            case BICst.ANALYSIS_FILTER_DATE.NOT_NULL:
                relation = BI.i18nText("BI-Basic_Not_Null");
                break;
            case BICst.ANALYSIS_FILTER_DATE.CONTAIN:
                relation = BI.i18nText("BI-Basic_Contain");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_DATE.NOT_CONTAIN:
                relation = BI.i18nText("BI-Basic_Not_Contain");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_DATE.TOP_N:
                relation = BI.i18nText("BI-Basic_String_Top_N");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_DATE.BOTTOM_N:
                relation = BI.i18nText("BI-Basic_String_Bottom_N");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_DATE.BEGIN_WITH:
                relation = BI.i18nText("BI-Basic_Begin_With");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_DATE.END_WITH:
                relation = BI.i18nText("BI-Basic_End_With");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_DATE.NOT_BEGIN_WITH:
                relation = BI.i18nText("BI-Basic_Not_Begin_With");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_DATE.NOT_END_WITH:
                relation = BI.i18nText("BI-Basic_Not_End_With");
                value = filter.filterValue;
                break;
            case BICst.ANALYSIS_FILTER_DATE.BELONG_DATE_WIDGET_VALUE:
                relation = BI.i18nText("BI-Basic_In");
                value = BI.Utils.getDateWidgetFilterText(filter.filterValue, filter.filterType);
                break;
            case BICst.ANALYSIS_FILTER_DATE.NOT_BELONG_DATE_WIDGET_VALUE:
                relation = BI.i18nText("BI-Basic_Not_In");
                value = BI.Utils.getDateWidgetFilterText(filter.filterValue, filter.filterType);
                break;
            case BICst.ANALYSIS_FILTER_DATE.LESS_THAN_DATE_WIDGET_VALUE:
                relation = BI.i18nText("BI-Basic_Date_Less_Than");
                value = BI.Utils.getDateWidgetFilterText(filter.filterValue, filter.filterType);
                break;
            case BICst.ANALYSIS_FILTER_DATE.MORE_THAN_DATE_WIDGET_VALUE:
                relation = BI.i18nText("BI-Basic_Date_More_Than");
                value = BI.Utils.getDateWidgetFilterText(filter.filterValue, filter.filterType);
                break;
            case BICst.ANALYSIS_FILTER_DATE.BELONG_STRING_VALUE:
                v = filter.filterValue || {};
                sType = v.type;
                relation = sType === BI.Selection.All ? BI.i18nText("BI-Basic_Not_In") : BI.i18nText("BI-Basic_In");
                formatDateBelongValue();
                break;
            case BICst.ANALYSIS_FILTER_DATE.NOT_BELONG_STRING_VALUE:
                v = filter.filterValue || {};
                sType = v.type;
                relation = sType === BI.Selection.All ? BI.i18nText("BI-Basic_In") : BI.i18nText("BI-Basic_Not_In");
                formatDateBelongValue();
                break;
            default:
                break;
        }
        var name = "";
        if (isDrillFilter) {
            try {
                name = BI.Utils.getFieldNameByIdOfWidget(wId, fieldId);
            } catch (error) {
                name = "";
            }
        } else if (BI.isNotNull(tId)) {
            name = BI.Utils.getDimensionNameById(tId) || BI.Utils.getFieldNameByDId(tId);
        } else {
            name = BI.Utils.getTableNameByFieldIdInPool(fieldId) + "." + BI.Utils.getFieldNameByIdInDataPool(fieldId);
        }

        return {
            relation: relation,
            value: value,
            name: name,
            text: [name, relation, value].join(" ")
        };
    },

    getDimensionDateText: function (value, dId) {
        return BI.map(value, function (idx, v) {
            return BI.Format.formatValueByGroup(v, BI.Utils.getResultDimensionGroupTypeById(dId));
        });
    },

    getDimensionDateTextByGroupType: function (value, groupType) {
        return BI.map(value, function (idx, v) {
            return BI.Format.formatValueByGroup(v, groupType);
        });
    },

    getDrillItems: function (wId) {
        var dIds = BI.Utils.getAllDimensionIDs(wId);
        var items = [];
        BI.each(dIds, function (i, dId) {
            // BI-30206 经纬度维度的钻取信息不显示在过滤面板上
            if (BI.Utils.isLongitudeDimension(dId) || BI.Utils.isLatitudeDimension(dId)) {
                return;
            }
            var drill = BI.Utils.getMeasureDrillSequenceById(dId);
            BI.each(drill, function (j, d) {
                BI.each(d.attachedFilters, function (index, filter) {
                    var groupType = BI.Utils.getDimensionGroupTypeBydIdAndFieldId(filter.targetId, filter.fieldId);

                    items.push({
                        type: "bi.label",
                        text: BI.Utils.getDimensionNameBydIdAndFieldId(filter.targetId, filter.fieldId) + "=" + BI.Format.formatValueByGroup(filter.value, groupType),
                        height: 30,
                        hgap: 5
                    });
                });

                var fromGroupType = BI.Utils.getDimensionGroupTypeBydIdAndFieldId(dId, d.from);
                items.push({
                    type: "bi.label",
                    text: BI.Utils.getDimensionNameBydIdAndFieldId(dId, d.from) + "=" + BI.Format.formatValueByGroup(d.value, fromGroupType),
                    height: 30,
                    hgap: 5
                });
            });
        });
        if (items.length > 0) {
            items.splice(0, 0, {
                type: "bi.label",
                text: BI.i18nText("BI-Design_Drill_Colon"),
                height: 30
            });
        }
        return items;
    }
});
/**
 * author: young
 * createdDate: 2018/4/27
 * description:
 */
!(function () {
    BI.Utils = BI.Utils || {};
    BI.extend(BI.Utils, {
        getNumberRangeText: function (filterValue) {
            var text = "";
            var closeMin = filterValue.closeMin, closeMax = filterValue.closeMax, min = filterValue.min,
                max = filterValue.max;
            if (BI.isNotNull(min) && BI.isNotEmptyString(min) && BI.isNotNull(max) && BI.isNotEmptyString(max)) {
                text = min + (closeMin ? "<=" : "<") + BI.i18nText("BI-Basic_Value") + (closeMax ? "<=" : "<") + max;
            } else if (BI.isNotNull(min) && BI.isNotEmptyString(min)) {
                text = min + (closeMin ? "<=" : "<") + BI.i18nText("BI-Basic_Value");
            } else if (BI.isNotNull(max) && BI.isNotEmptyString(max)) {
                text = BI.i18nText("BI-Basic_Value") + (closeMax ? "<=" : "<") + max;
            }
            return text;
        },

        getDateRangeText: function (filterValue) {
            if (BI.isNull(filterValue)) {
                return BI.i18nText("BI-Basic_Unrestricted");
            }
            var start = filterValue.start, end = filterValue.end;
            var sStart = "", sEnd = "";
            if (BI.isNotNull(start)) {
                sStart = this.getDateText(start);
            }
            if (BI.isNotNull(end)) {
                sEnd = this.getDateText(end);
            }
            return sStart + "-" + sEnd;
        },

        getDateWidgetFilterText: function (filterValue, filterType) {
            var wId = filterValue.wId;

            if (!BI.Utils.isWidgetExistById(wId)) return;

            var startOrEnd = filterValue.startOrEnd;
            var offset = filterValue.offset;
            var startText = BI.i18nText("BI-Basic_Unrestricted"), endText = BI.i18nText("BI-Basic_Unrestricted");

            var widgetType = BI.Utils.getWidgetTypeById(wId);
            var widgetValue = BI.deepClone(BI.Utils.getWidgetValueById(wId));
            var text = BI.i18nText("BI-Basic_Unrestricted");
            var date;

            function getRangeText () {
                return startText + " - " + endText;
            }

            if (filterType === BICst.ANALYSIS_FILTER_DATE.BELONG_DATE_WIDGET_VALUE || filterType === BICst.ANALYSIS_FILTER_DATE.NOT_BELONG_DATE_WIDGET_VALUE) {
                date = this._getDateControlValue(widgetType, widgetValue, offset);

                if (BI.isNull(date)) {
                    return getRangeText();
                }

                if (BI.isNotNull(date.start)) {
                    startText = this._getDateTextByValue(this._formatDateToObj(date.start));
                }

                if (BI.isNotNull(date.end)) {
                    endText = this._getDateTextByValue(this._formatDateToObj(date.end));
                }

                return getRangeText();
            }

            var position = parseInt(offset.position) === 2 ? "start" : "end";

            switch (widgetType) {
                case BICst.DESIGN.WIDGET.DATE:
                case BICst.DESIGN.WIDGET.DATE_PANE:
                case BICst.DESIGN.WIDGET.MONTH:
                case BICst.DESIGN.WIDGET.QUARTER:
                case BICst.DESIGN.WIDGET.YEAR:
                    date = this._getDateControlValue(widgetType, widgetValue, offset);
                    break;
                case BICst.DESIGN.WIDGET.DATE_INTERVAL:
                    switch (startOrEnd) {
                        case 2:
                            date = this._getDateControlValue(BICst.DESIGN.WIDGET.DATE, widgetValue.end, offset);
                            break;
                        case 1:
                        default:
                            date = this._getDateControlValue(BICst.DESIGN.WIDGET.DATE, widgetValue.start, offset);
                            break;
                    }
                    break;
                case BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL:
                    switch (startOrEnd) {
                        case 2:
                            date = this._getDateControlValue(BICst.DESIGN.WIDGET.MONTH, widgetValue.end, offset);
                            break;
                        case 1:
                        default:
                            date = this._getDateControlValue(BICst.DESIGN.WIDGET.MONTH, widgetValue.start, offset);
                    }
                    break;
                default:
            }

            var resultDate = date[position];
            if (BI.isNotNull(resultDate)) {
                text = this._getDateTextByValue(this._formatDateToObj(resultDate));
            }

            return text;
        },

        parseComplexDate: function (v) {

            function _parseComplexDateCommon (v) {
                var type = v.type, value = v.value;
                var date = BI.getDate();
                var currY = date.getFullYear(), currM = date.getMonth(), currD = date.getDate();
                if (BI.isNull(type) && BI.isNotNull(v.year)) {
                    return BI.getDate(v.year, v.month, v.day);
                }
                switch (type) {
                    case BICst.DATE_TYPE.MULTI_DATE_YEAR_PREV:
                        return BI.getDate(currY - 1 * value, currM, currD);
                    case BICst.DATE_TYPE.MULTI_DATE_YEAR_AFTER:
                        return BI.getDate(currY + 1 * value, currM, currD);
                    case BICst.DATE_TYPE.MULTI_DATE_YEAR_BEGIN:
                        return BI.getDate(currY, 0, 1);
                    case BICst.DATE_TYPE.MULTI_DATE_YEAR_END:
                        return BI.getDate(currY, 11, 31);

                    case BICst.DATE_TYPE.MULTI_DATE_MONTH_PREV:
                        return BI.getDate().getBeforeMultiMonth(value);
                    case BICst.DATE_TYPE.MULTI_DATE_MONTH_AFTER:
                        return BI.getDate().getAfterMultiMonth(value);
                    case BICst.DATE_TYPE.MULTI_DATE_MONTH_BEGIN:
                        return BI.getDate(currY, currM, 1);
                    case BICst.DATE_TYPE.MULTI_DATE_MONTH_END:
                        return BI.getDate(currY, currM, (date.getLastDateOfMonth()).getDate());

                    case BICst.DATE_TYPE.MULTI_DATE_QUARTER_PREV:
                        return BI.getDate().getBeforeMulQuarter(value);
                    case BICst.DATE_TYPE.MULTI_DATE_QUARTER_AFTER:
                        return BI.getDate().getAfterMulQuarter(value);
                    case BICst.DATE_TYPE.MULTI_DATE_QUARTER_BEGIN:
                        return BI.getDate().getQuarterStartDate();
                    case BICst.DATE_TYPE.MULTI_DATE_QUARTER_END:
                        return BI.getDate().getQuarterEndDate();

                    case BICst.DATE_TYPE.MULTI_DATE_WEEK_PREV:
                        return date.getOffsetDate(-7 * value);
                    case BICst.DATE_TYPE.MULTI_DATE_WEEK_AFTER:
                        return date.getOffsetDate(7 * value);

                    case BICst.DATE_TYPE.MULTI_DATE_DAY_PREV:
                        return date.getOffsetDate(-1 * value);
                    case BICst.DATE_TYPE.MULTI_DATE_DAY_AFTER:
                        return date.getOffsetDate(1 * value);
                    case BICst.DATE_TYPE.MULTI_DATE_DAY_TODAY:
                        return date;

                    case BICst.DATE_TYPE.MULTI_DATE_PARAM:
                        var wWid = value.wId, se = value.startOrEnd;
                        if (BI.isNotNull(wWid) && BI.isNotNull(se)) {
                            var wWValue = BI.Utils.getWidgetValueById(wWid);
                            if (se === BI.MultiDateParamPane.start && BI.isNotNull(wWValue.start)) {
                                return BI.getDate(wWValue.start.year, wWValue.start.month, wWValue.start.day);
                            }
                            return BI.getDate(wWValue.end.year, wWValue.end.month, wWValue.end.day);
                        }
                        if (BI.isNotNull(value.year) && BI.isNotNull(value.month) && BI.isNotNull(value.day)) {
                            return BI.getDate(value.year, value.month, value.day);
                        }
                        break;
                    case BICst.DATE_TYPE.MULTI_DATE_CALENDAR:
                        return BI.getDate(value.year, value.month, value.day);
                    default:
                }
            }

            function _parseComplexDate4Param (value) {
                var wid = value.wId, se = value.startOrEnd;
                if (BI.isNotNull(wid) && BI.isNotNull(se)) {
                    var wValue = BI.Utils.getWidgetValueById(wid);
                    if (se === BI.MultiDateParamPane.start && BI.isNotNull(wValue.start)) {
                        return _parseComplexDateCommon(wValue.start);
                    }
                    return _parseComplexDateCommon(wValue.end);

                }
                return _parseComplexDateCommon(BI.Utils.getWidgetValueById());
            }

            if (v.type === BICst.DATE_TYPE.MULTI_DATE_PARAM) {
                return _parseComplexDate4Param(v);
            }
            return _parseComplexDateCommon(v);
        },

        getYearText: function (widgetValue) {
            var dateFilterValue = this._calcDateTypeValue(widgetValue);

            return dateFilterValue.year;
        },

        getQuarterText: function (widgetValue) {
            var year, quarter, text = "";

            var dateFilterValue = this._calcDateTypeValue(widgetValue);
            year = dateFilterValue.year; quarter = dateFilterValue.quarter;


            if (BI.isNumeric(year) && BI.isNumeric(quarter)) {
                text = year + " " + BI.i18nText("BI-Basic_No_Quarter", quarter);
            } else if (BI.isNumeric(year)) {
                text = year;
            } else if (BI.isNumeric(quarter)) {
                text = BI.i18nText("BI-Basic_No_Quarter", quarter);
            }
            return text;
        },

        getMonthText: function (widgetValue) {
            var year, month, text = "";

            var dateFilterValue = this._calcDateTypeValue(widgetValue);
            year = dateFilterValue.year; month = dateFilterValue.month;

            if (BI.isNumeric(year) && BI.isNumeric(month)) {
                text = year + "/" + month;
            } else if (BI.isNumeric(year)) {
                text = year;
            } else if (BI.isNumeric(month)) {
                text = month;
            }

            return text;
        },

        getDateText: function (widgetValue) {
            var fValue = widgetValue || {};
            var value = this._calcDateTypeValue(fValue);

            return this._getDateTextByValue(value);
        },

        _getDateTextByValue: function (value) {
            var sStart = "";

            if (BI.isNotNull(value.year) && BI.isNotNull(value.month) && BI.isNotNull(value.day)) {
                if (BI.isNotNull(value.hour) && BI.isNotNull(value.minute) && BI.isNotNull(value.second)) {
                    sStart = BI.getDate(value.year, value.month - 1, value.day, value.hour, value.minute, value.second).print("%Y-%X-%d %H:%M:%S");
                } else {
                    sStart = value.year + "/" + value.month + "/" + value.day;
                }
            } else {
                var date = BI.Utils.parseComplexDate(value);
                sStart = BI.isNotNull(date) ? (date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()) : "";
            }

            return sStart;
        },

        getYearMonthIntervalText: function (filterValue) {
            var start = filterValue.start, end = filterValue.end;
            var sStart = "", sEnd = "";
            if (BI.isNotNull(start)) {
                sStart = this.getMonthText(start);
            }
            if (BI.isNotNull(end)) {
                sEnd = this.getMonthText(end);
            }
            return sStart + "-" + sEnd;
        },

        getControlWidgetValueTextByWid: function (wid) {

            function getNumberSliderRangeText (filterValue) {
                var text = "";
                var min = filterValue.min, max = filterValue.max;
                if (BI.isNotNull(min) && BI.isNotNull(max)) {
                    text = min + "<=" + BI.i18nText("BI-Basic_Value") + "<=" + max;
                }
                return text;
            }

            function descartes (arr) {
                if (!BI.isArray(arr)) {
                    arr = [];
                }
                return arr.reduce(function (a, b) {
                    return a.map(function (x) {
                        return b.map(function (y) {
                            return x.concat(y);
                        });
                    }).reduce(function (a, b) {
                        return a.concat(b);
                    }, []);
                }, [[]]);
            }

            function getChildrenNode (ob) {
                var text = "";
                var index = 0, size = BI.size(ob);
                BI.each(ob, function (name, children) {
                    index++;
                    var childNodes = getChildrenNode(children);
                    text += name + (childNodes === "" ? "" : (":" + childNodes)) + (index === size ? "" : ",");
                });
                return text;
            }

            var widgetValue = BI.Utils.getWidgetValueById(wid);
            var widgetType = BI.Utils.getWidgetTypeById(wid);
            var text = "";
            if (BI.isNull(widgetValue)) {
                return text;
            }

            switch (widgetType) {
                case BICst.DESIGN.WIDGET.STRING:
                case BICst.DESIGN.WIDGET.STRING_LIST:
                    if (BI.isNull(widgetValue.value) || widgetValue.value.length === 0) {
                        return text;
                    }
                    if (widgetValue.type === BI.Selection.Multi) {
                        text = BI.i18nText("BI-Basic_In") + " " + widgetValue.value;
                    } else if (widgetValue.type === BI.Selection.All) {
                        text = BI.i18nText("BI-Basic_Not_In") + " " + widgetValue.value;
                    }
                    return text;
                case BICst.DESIGN.WIDGET.STRING_LABEL:
                    return BI.i18nText("BI-Basic_In") + " " + widgetValue.value.join("");
                case BICst.DESIGN.WIDGET.SINGLE_SLIDER:
                case BICst.DESIGN.WIDGET.INTERVAL_SLIDER:
                    return getNumberSliderRangeText(widgetValue);
                case BICst.DESIGN.WIDGET.NUMBER:
                    return BI.Utils.getNumberRangeText(widgetValue);
                case BICst.DESIGN.WIDGET.DATE:
                case BICst.DESIGN.WIDGET.DATE_PANE:
                    return BI.Utils.getDateText(widgetValue);
                case BICst.DESIGN.WIDGET.MONTH:
                    return this.getMonthText(widgetValue);
                case BICst.DESIGN.WIDGET.QUARTER:
                    return this.getQuarterText(widgetValue);
                case BICst.DESIGN.WIDGET.YEAR:
                    return this.getYearText(widgetValue);
                case BICst.DESIGN.WIDGET.DATE_INTERVAL:
                    return BI.Utils.getDateRangeText(widgetValue);
                case BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL:
                    return this.getYearMonthIntervalText(widgetValue);
                case BICst.DESIGN.WIDGET.TREE:
                case BICst.DESIGN.WIDGET.TREE_LIST:
                    BI.each(widgetValue, function (name, children) {
                        var childNodes = getChildrenNode(children);
                        text += name + (childNodes === "" ? "" : (":" + childNodes)) + "; ";
                    });
                    if (text !== "") {
                        text = BI.i18nText("BI-Basic_In") + " " + text;
                    }
                    return text;
                case BICst.DESIGN.WIDGET.TREE_LABEL:
                    var textValue = BI.filter(widgetValue, function (index, values) {
                        return values.indexOf(BICst.LIST_LABEL_TYPE.ALL) < 0;
                    });
                    if (textValue.length === 0) {
                        return text;
                    }
                    textValue = descartes(textValue);
                    BI.each(textValue, function (index, values) {
                        BI.each(values, function (idx, value) {
                            text += value + (idx === 0 ? values.length > 1 ? ":" : "" : idx === values.length - 1 ? "" : ",");
                        });
                        text += ";";
                    });
                    if (text !== "") {
                        text = BI.i18nText("BI-Basic_In") + " " + text;
                    }
                    return text;
                default:
                    return widgetValue;
            }
        },

        _calcDateTypeValue: function (widgetValue) {
            var dateFilterValue = widgetValue.value;

            if (widgetValue.type === BI.DynamicDateCombo.Dynamic) {
                dateFilterValue = this._getDynamicValue(dateFilterValue);
            }

            return dateFilterValue;
        },

        _getDynamicValue: function (value) {
            var dynamicDateValue = BI.DynamicDateHelper.getCalculation(value);

            return this._formatDateToObj(dynamicDateValue);
        },

        _getDateControlValue: function (widgetType, widgetValue, offset) {
            var date = null;
            // 为空直接返回无限制
            if (BI.isNull(widgetValue)) {
                return {
                    yDate: null,
                    start: null,
                    end: null
                };
            }

            var value = widgetValue.value;
            var type = widgetValue.type;

            if (type === BI.DynamicDateCombo.Dynamic) {
                value = this._getDynamicValue(value);
            }

            switch (widgetType) {
                case BICst.DESIGN.WIDGET.YEAR:
                    if (BI.isNumeric(value.year)) {
                        // 年取1月1日
                        date = BI.getDate(value.year, 0, 1);
                    }
                    break;
                case BICst.DESIGN.WIDGET.MONTH:
                    if (BI.isNumeric(value.year)) {
                        // 月取当月1号
                        date = BI.getDate(value.year, BI.isNumeric(value.month) ? value.month - 1 : 0, 1);
                    }
                    break;
                case BICst.DESIGN.WIDGET.QUARTER:
                    if (BI.isNumeric(value.year)) {
                        var quarter = value.quarter;
                        date = BI.getDate(value.year, BI.isNumeric(quarter) ? (quarter * 3 - 1) : 0, 1);
                    }
                    break;
                case BICst.DESIGN.WIDGET.DATE:
                case BICst.DESIGN.WIDGET.DATE_PANE:
                    if (BI.isNotNull(value)) {
                        date = BI.getDate(value.year, value.month - 1, value.day);
                    }
                    break;
                case BICst.DESIGN.WIDGET.DATE_INTERVAL:
                    return {
                        start: this._getDateControlValue(BICst.DESIGN.WIDGET.DATE, widgetValue.start, offset).yDate,
                        end: this._getDateControlValue(BICst.DESIGN.WIDGET.DATE, widgetValue.end, offset).yDate
                    };
                case BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL:
                    return {
                        start: this._getDateControlValue(BICst.DESIGN.WIDGET.MONTH, widgetValue.start, offset).yDate,
                        end: this._getDateControlValue(BICst.DESIGN.WIDGET.MONTH, widgetValue.end, offset).yDate
                    };
                default:
            }

            return this._getOffsetStartEndDate(date, offset);
        },

        _getOffsetStartEndDate: function (date, offset) {
            var startDate, endDate, yDate;
            yDate = startDate = endDate = date;

            if (BI.isNull(date)) {
                return {
                    yDate: yDate,
                    start: startDate,
                    end: endDate
                };
            }

            if (BI.isNotNull(offset)) {
                // 年
                if (BI.isNotNull(offset.year)) {
                    yDate = BI.getDate((yDate.getFullYear() + parseInt(offset.year)), yDate.getMonth(), yDate.getDate());
                    startDate = BI.getDate((startDate.getFullYear() + parseInt(offset.year)), 0, 1);
                    endDate = BI.getDate(startDate.getFullYear(), 11, 31);
                }

                // 季度
                if (BI.isNotNull(offset.quarter)) {
                    yDate = yDate.getOffsetMonth(parseInt(offset.quarter) * 3);
                    startDate = yDate.getQuarterStartDate();
                    endDate = endDate.getQuarterEndDate();
                }

                // 月
                if (BI.isNotNull(offset.month)) {
                    yDate = yDate.getOffsetMonth(parseInt(offset.month));
                    startDate = BI.getDate(yDate.getFullYear(), yDate.getMonth(), 1);
                    endDate = BI.getDate(yDate.getFullYear(), yDate.getMonth(), (yDate.getLastDateOfMonth()).getDate());
                }

                // 周
                if (BI.isNotNull(offset.week)) {
                    yDate = yDate.getOffsetDate(parseInt(offset.week) * 7);
                    startDate = yDate.getWeekStartDate();
                    endDate = startDate.getWeekEndDate();
                }

                if (BI.isNotNull(offset.day)) {
                    yDate = yDate.getOffsetDate(parseInt(offset.day));
                    startDate = yDate;
                    endDate = yDate;
                }
            }

            return {
                yDate: yDate,
                start: startDate,
                end: endDate
            };
        },

        _formatDateToObj: function (date) {
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                quarter: date.getQuarter()
            };
        }
    });
})();
/**
 * author: young
 * createdDate: 2018/7/20
 * description: 共享池utils相关
 */
!(function () {
    BI.Utils = BI.Utils || {};
    BI.extend(BI.Utils, {

        isNoAuthField: function (fieldId) {
            return BI.contains(BI.pool.authPool.noAuthFields, fieldId);
        },

        isNoAuthTable: function (tableName) {
            return BI.contains(BI.pool.authPool.noAuthTables, tableName);
        },

        getFieldTransferName: function (id) {
            return BI.pool.transferPool.fields[id];
        },

        // 由fieldId获取field转义名，没有转义返回原始名
        // 遍历表去找字段可能比较消耗，之后找过的field可以放bufferpool缓存起来
        getFieldNameByIdInDataPool: function (fieldId) {
            var self = this;
            var name = "";
            BI.find(BI.pool.dataPool.tables, function (tableName, info) {
                var field = BI.find(info.fields, function (idx, field) {
                    return field.id === fieldId;
                });
                if (BI.isNotNull(field)) {
                    name = self.getFieldTransferName(fieldId) || field.name;
                    return true;
                }
            });
            return name;
        },

        getTableNameByFieldIdInDataPool: function (fieldId) {
            return BI.findKey(BI.pool.dataPool.tables, function (tableName, info) {
                return BI.find(info.fields, function (idx, field) {
                    return field.id === fieldId;
                });
            });
        },

        getTableTransferName: function (id) {
            return BI.pool.transferPool.tables[id];
        },

        getFieldsByTableName: function (tableName) {
            var table = BI.pool.dataPool.tables[tableName];
            var fields = [];
            if (BI.isNotNull(table)) {
                BI.each(table.fields, function (i, field) {
                    if (!BI.Utils.isNoAuthField(field.id)) {
                        field.transferName = null;
                        fields.push(BI.deepClone(field));
                    }
                });
            }
            return fields;
        },

        isTableExist: function (tableName) {
            return BI.isNotNull(BI.pool.dataPool.tables[tableName]);
        },

        isOriginFieldExist: function (fieldId) {
            return BI.some(BI.pool.dataPool.tables, function (tableName, table) {
                return BI.some(table.fields, function (i, field) {
                    return fieldId === field.id;
                });
            });
        },

        getOriginFieldById: function (fieldId) {
            var field = null;
            BI.some(BI.pool.dataPool.tables, function (tableName, table) {
                return BI.some(table.fields, function (i, f) {
                    if (f.id === fieldId) {
                        field = f;
                        return true;
                    }
                });
            });
            return field;
        },

        syncTable2Pool: function (table) {
            if (BI.isNull(table)) return;

            BI.pool.dataPool.tables[table.name] = table;
        },

        syncNoAuthFields2Pool: function (noAuthFields) {
            BI.each(noAuthFields, function (i, fieldId) {
                if (!BI.pool.authPool.noAuthFields.contains(fieldId)) {
                    BI.pool.authPool.noAuthFields.push(fieldId);
                }
            });
        }

    });
})();
!(function () {
    BI.Utils = BI.Utils || {};

    BI.extend(BI.Utils, {

        getDefaultChartColor: function () {
            return ["#5caae4", "#70cc7f", "#ebbb67", "#e97e7b", "#6ed3c9"];
        },

        getChartColorConfig: function () {
            return BI.pool.confPool.plateChartColor || BICst.DEFAULT_CHART_COLOR_LIST;
        },

        // plate 平台样式
        getPlateStyle: function () {
            // var key = BI.pool.confPool.plateConfig || "DEFAULT";
            // var styles = BI.Constants.getConstant("bi.constant.design.prediction.styles");
            // return BI.deepClone(styles[key]);
            return {};
        },

        getPlateTemplateThemeId: function () {
            return BI.Utils.getPlateStyle().id;
        },

        getPlateTemplateTheme: function () {
            return BI.Utils.getPlateStyle().theme;
        },

        getPlateWidgetGap: function () {
            return BI.Utils.getPlateStyle().widgetGap;
        },

        getPlateTemplateBackground: function () {
            return BI.Utils.getPlateStyle().templateBackground;
        },

        getPlateWidgetBackground: function () {
            return BI.Utils.getPlateStyle().widgetBackground;
        },

        getPlateTitleBackground: function () {
            return BI.Utils.getPlateStyle().titleBackground;
        },

        getPlateTitleFont: function () {
            return BI.Utils.getPlateStyle().titleFont;
        },

        getPlateChartColor: function () {
            return BI.Utils.getPlateStyle().chart && BI.Utils.getPlateStyle().chart.chartColor;
        },

        getPlateChartGradient: function () {
            return BI.Utils.getPlateStyle().chart && BI.Utils.getPlateStyle().chart.gradient;
        },

        getPlateChartFont: function () {
            return BI.Utils.getPlateStyle().chart && BI.Utils.getPlateStyle().chart.font;
        },

        getPlateTableStyle: function () {
            return BI.Utils.getPlateStyle().table && BI.Utils.getPlateStyle().table.tableStyle;
        },

        getPlateTableThemeColor: function () {
            return BI.Utils.getPlateStyle().table && BI.Utils.getPlateStyle().table.themeColor;
        },

        getPlateTableFont: function () {
            return BI.Utils.getPlateStyle().table && BI.Utils.getPlateStyle().table.font;
        },

        getPlateControlTheme: function () {
            return BI.Utils.getPlateStyle().controlTheme;
        },

        // 模板样式
        getTemplateStyle: function () {
            return BI.designModel.templateStyle.style;
        },

        getTemplateThemeId: function () {
            return BI.Utils.getTemplateStyle().id;
        },

        getTemplateTheme: function () {
            return BI.Utils.getTemplateStyle().theme;
        },

        getTemplateWidgetGap: function () {
            return BI.Utils.getTemplateStyle().widgetGap;
        },

        getTemplateBackground: function () {
            return BI.Utils.getTemplateStyle().templateBackground;
        },

        getTemplateWidgetBackground: function () {
            return BI.Utils.getTemplateStyle().widgetBackground;
        },

        getTemplateTitleBackground: function () {
            return BI.Utils.getTemplateStyle().titleBackground;
        },

        getTemplateTitleFont: function () {
            return BI.Utils.getTemplateStyle().titleFont;
        },

        getTemplateChartColor: function () {
            return BI.Utils.getTemplateStyle().chart && BI.Utils.getTemplateStyle().chart.chartColor;
        },

        // todo
        getTemplateChartFont: function () {
            return BI.Utils.getTemplateStyle().chart && BI.Utils.getTemplateStyle().chart.font;
        },

        getTemplateChartGradient: function () {
            return BI.Utils.getTemplateStyle().chart && BI.Utils.getTemplateStyle().chart.gradient;
        },

        getTemplateTableStyle: function () {
            return BI.Utils.getTemplateStyle().table && BI.Utils.getTemplateStyle().table.tableStyle;
        },

        getTemplateTableThemeColor: function () {
            return BI.Utils.getTemplateStyle().table && BI.Utils.getTemplateStyle().table.themeColor;
        },

        getTemplateTableFont: function () {
            return BI.Utils.getTemplateStyle().table && BI.Utils.getTemplateStyle().table.font;
        },

        getTemplateControlTheme: function () {
            return BI.Utils.getTemplateStyle().controlTheme;
        },

        // 获取事实上的样式
        getActualTemplateThemeId: function () {
            return BI.Utils.getTemplateThemeId() || BI.Utils.getPlateTemplateThemeId();
        },

        getActualTemplateTheme: function () {
            return BI.Utils.getTemplateTheme() || BI.Utils.getPlateTemplateTheme();
        },

        getActualWidgetGap: function () {
            return BI.Utils.getTemplateWidgetGap() || BI.Utils.getPlateWidgetGap();
        },

        getActualTemplateBackground: function () {
            return BI.Utils.getTemplateBackground() || BI.Utils.getPlateTemplateBackground();
        },

        getActualWidgetBackground: function () {
            return BI.Utils.getTemplateWidgetBackground() || BI.Utils.getPlateWidgetBackground();
        },

        getActualTitleBackground: function () {
            return BI.Utils.getTemplateTitleBackground() || BI.Utils.getPlateTitleBackground();
        },

        getActualTitleFont: function () {
            var tmpTitleFont = BI.Utils.getTemplateTitleFont(), plateTitleFont = BI.Utils.getPlateTitleFont();
            if (tmpTitleFont.type === BICst.AUTO_CUSTOM.AUTO) {
                return BI.extend(plateTitleFont, {
                    type: tmpTitleFont.type
                });
            }
            return {
                type: tmpTitleFont.type,
                fontFamily: BI.isNotNull(tmpTitleFont.fontFamily) ? tmpTitleFont.fontFamily : plateTitleFont.fontFamily,
                fontSize: BI.isNotNull(tmpTitleFont.fontSize) ? tmpTitleFont.fontSize : plateTitleFont.fontSize,
                bold: BI.isNotNull(tmpTitleFont.bold) ? tmpTitleFont.bold : plateTitleFont.bold,
                italic: BI.isNotNull(tmpTitleFont.italic) ? tmpTitleFont.italic : plateTitleFont.italic,
                underline: BI.isNotNull(tmpTitleFont.underline) ? tmpTitleFont.underline : plateTitleFont.underline,
                fontColor: BI.isNotEmptyString(tmpTitleFont.fontColor) ? tmpTitleFont.fontColor : plateTitleFont.fontColor,
                fontAlign: BI.isNotNull(tmpTitleFont.fontAlign) ? tmpTitleFont.fontAlign : plateTitleFont.fontAlign
            };

        },

        getActualChartColor: function () {
            return BI.Utils.getTemplateChartColor() || BI.Utils.getPlateChartColor();
        },

        getActualChartFont: function () {
            var tmpChartFont = BI.Utils.getTemplateChartFont(), plateChartFont = BI.Utils.getPlateChartFont();
            if (tmpChartFont.type === BICst.AUTO_CUSTOM.AUTO) {
                return BI.extend(plateChartFont, {
                    type: tmpChartFont.type
                });
            }
            return {
                type: tmpChartFont.type,
                fontFamily: BI.isNotNull(tmpChartFont.fontFamily) ? tmpChartFont.fontFamily : plateChartFont.fontFamily,
                fontSize: BI.isNotNull(tmpChartFont.fontSize) ? tmpChartFont.fontSize : plateChartFont.fontSize,
                bold: BI.isNotNull(tmpChartFont.bold) ? tmpChartFont.bold : plateChartFont.bold,
                italic: BI.isNotNull(tmpChartFont.italic) ? tmpChartFont.italic : plateChartFont.italic,
                underline: BI.isNotNull(tmpChartFont.underline) ? tmpChartFont.underline : plateChartFont.underline,
                fontColor: BI.isNotEmptyString(tmpChartFont.fontColor) ? tmpChartFont.fontColor : plateChartFont.fontColor
            };
        },

        getActualChartGradient: function () {
            return BI.Utils.getTemplateChartGradient() || BI.Utils.getPlateChartGradient();
        },

        getActualTableStyle: function () {
            return BI.Utils.getTemplateTableStyle() || BI.Utils.getPlateTableStyle();
        },

        getActualTableThemeColor: function () {
            return BI.Utils.getTemplateTableThemeColor() || BI.Utils.getPlateTableThemeColor();
        },

        getActualTableFont: function () {
            var tmpTableFont = BI.Utils.getTemplateTableFont(), plateTableFont = BI.Utils.getPlateTableFont();
            if (tmpTableFont.type === BICst.AUTO_CUSTOM.AUTO) {
                return BI.extend(plateTableFont, {
                    type: tmpTableFont.type
                });
            }
            var tmpHeaderFont = tmpTableFont.header, tmpBodyFont = tmpTableFont.body;
            var plateHeaderFont = plateTableFont.header, plateBodyFont = plateTableFont.body;
            return {
                type: tmpTableFont.type,
                header: {
                    fontFamily: BI.isNotNull(tmpHeaderFont.fontFamily) ? tmpHeaderFont.fontFamily : plateHeaderFont.fontFamily,
                    fontSize: BI.isNotNull(tmpHeaderFont.fontSize) ? tmpHeaderFont.fontSize : plateHeaderFont.fontSize,
                    bold: BI.isNotNull(tmpHeaderFont.bold) ? tmpHeaderFont.bold : plateHeaderFont.bold,
                    italic: BI.isNotNull(tmpHeaderFont.italic) ? tmpHeaderFont.italic : plateHeaderFont.italic,
                    underline: BI.isNotNull(tmpHeaderFont.underline) ? tmpHeaderFont.underline : plateHeaderFont.underline,
                    fontColor: BI.isNotEmptyString(tmpHeaderFont.fontColor) ? tmpHeaderFont.fontColor : plateHeaderFont.fontColor,
                    fontAlign: BI.isNotNull(tmpHeaderFont.fontAlign) ? tmpHeaderFont.fontAlign : plateHeaderFont.fontAlign
                },
                body: {
                    fontFamily: BI.isNotNull(tmpBodyFont.fontFamily) ? tmpBodyFont.fontFamily : plateBodyFont.fontFamily,
                    fontSize: BI.isNotNull(tmpBodyFont.fontSize) ? tmpBodyFont.fontSize : plateBodyFont.fontSize,
                    bold: BI.isNotNull(tmpBodyFont.bold) ? tmpBodyFont.bold : plateBodyFont.bold,
                    italic: BI.isNotNull(tmpBodyFont.italic) ? tmpBodyFont.italic : plateBodyFont.italic,
                    underline: BI.isNotNull(tmpBodyFont.underline) ? tmpBodyFont.underline : plateBodyFont.underline,
                    fontColor: BI.isNotEmptyString(tmpBodyFont.fontColor) ? tmpBodyFont.fontColor : plateBodyFont.fontColor,
                    dimFontAlign: BI.isNotNull(tmpBodyFont.dimFontAlign) ? tmpBodyFont.dimFontAlign : plateBodyFont.dimFontAlign,
                    tarFontAlign: BI.isNotNull(tmpBodyFont.tarFontAlign) ? tmpBodyFont.tarFontAlign : plateBodyFont.tarFontAlign
                }
            };
        },

        getActualControlTheme: function () {
            return BI.Utils.getTemplateControlTheme() || BI.Utils.getPlateControlTheme();
        },

        // 获取事实上的全局样式
        getActualTemplateStyle: function () {
            return {
                id: BI.Utils.getActualTemplateThemeId(),
                theme: BI.Utils.getActualTemplateTheme(),
                widgetGap: BI.Utils.getActualWidgetGap(),
                templateBackground: BI.Utils.getActualTemplateBackground(),
                widgetBackground: BI.Utils.getActualWidgetBackground(),
                titleBackground: BI.Utils.getActualTitleBackground(),
                titleFont: BI.Utils.getActualTitleFont(),
                chart: {
                    chartColor: BI.Utils.getActualChartColor(),
                    font: BI.Utils.getActualChartFont(),
                    gradient: BI.Utils.getActualChartGradient()
                },
                table: {
                    tableStyle: BI.Utils.getActualTableStyle(),
                    themeColor: BI.Utils.getActualTableThemeColor(),
                    font: BI.Utils.getActualTableFont()
                },
                controlTheme: BI.Utils.getActualControlTheme()
            };
        },

        // 组件样式
        getTitleBackgroundById: function (wId) {
            return BI.designModel.widgets[wId].settings.titleBackground;
        },
        getWidgetBackgroundById: function (wId) {
            return BI.designModel.widgets[wId].settings.widgetBackground;
        },

        getWidgetTitleFontType: function (wId) {
            return BI.designModel.widgets[wId].settings.nameStyleType;
        },

        getTableStyleSettingsById: function (wId) {
            return BI.designModel.widgets[wId].settings.tableStyle;
        },

        getTableStyleById: function (wId) {
            return BI.Utils.getTableStyleSettingsById(wId).style;
        },

        getTableThemeById: function (wId) {
            return BI.Utils.getTableStyleSettingsById(wId).themeColor;
        },

        getTableFontById: function (wId) {
            return BI.Utils.getTableStyleSettingsById(wId).font;
        },

        // 全局样式的结果样式
        getResTableStyleTypeById: function (wId) {
            var style = BI.Utils.getTableStyleById(wId);
            return style ? style : BI.Utils.getActualTableStyle();
        },

        getResTableThemeColorById: function (wId) {
            return BI.Utils.getTableThemeById(wId) || BI.Utils.getActualTableThemeColor();
        },

        getResTableFontById: function (wId) {
            var tableFont = BI.Utils.getTableFontById(wId), actualTableFont = BI.Utils.getActualTableFont();
            if (tableFont.type === BICst.AUTO_CUSTOM.AUTO) {
                return BI.extend(actualTableFont, {
                    type: tableFont.type
                });
            }
            var headerFont = tableFont.header, bodyFont = tableFont.body;
            var actualHeaderFont = actualTableFont.header, actualBodyFont = actualTableFont.body;
            return {
                type: tableFont.type,
                header: {
                    fontFamily: BI.isNotNull(headerFont.fontFamily) ? headerFont.fontFamily : actualHeaderFont.fontFamily,
                    fontSize: BI.isNotNull(headerFont.fontSize) ? headerFont.fontSize : actualHeaderFont.fontSize,
                    bold: BI.isNotNull(headerFont.bold) ? headerFont.bold : actualHeaderFont.bold,
                    italic: BI.isNotNull(headerFont.italic) ? headerFont.italic : actualHeaderFont.italic,
                    underline: BI.isNotNull(headerFont.underline) ? headerFont.underline : actualHeaderFont.underline,
                    fontColor: BI.isNotEmptyString(headerFont.fontColor) ? headerFont.fontColor : actualHeaderFont.fontColor,
                    fontAlign: BI.isNotNull(headerFont.fontAlign) ? headerFont.fontAlign : actualHeaderFont.fontAlign
                },
                body: {
                    fontFamily: BI.isNotNull(bodyFont.fontFamily) ? bodyFont.fontFamily : actualBodyFont.fontFamily,
                    fontSize: BI.isNotNull(bodyFont.fontSize) ? bodyFont.fontSize : actualBodyFont.fontSize,
                    bold: BI.isNotNull(bodyFont.bold) ? bodyFont.bold : actualBodyFont.bold,
                    italic: BI.isNotNull(bodyFont.italic) ? bodyFont.italic : actualBodyFont.italic,
                    underline: BI.isNotNull(bodyFont.underline) ? bodyFont.underline : actualBodyFont.underline,
                    fontColor: BI.isNotEmptyString(bodyFont.fontColor) ? bodyFont.fontColor : actualBodyFont.fontColor,
                    dimFontAlign: BI.isNotNull(bodyFont.dimFontAlign) ? bodyFont.dimFontAlign : actualBodyFont.dimFontAlign,
                    tarFontAlign: BI.isNotNull(bodyFont.tarFontAlign) ? bodyFont.tarFontAlign : actualBodyFont.tarFontAlign
                }
            };
        },

        getResTableHeaderFontById: function (wId) {
            return BI.Utils.getResTableFontById(wId).header;
        },

        getResTableBodyFontById: function (wId) {
            return BI.Utils.getResTableFontById(wId).body;
        },

        getResTitleBackgroundById: function (wId) {
            return BI.Utils.getTitleBackgroundById(wId) || BI.Utils.getActualTitleBackground();
        },

        getResWidgetBackgroundById: function (wId) {
            return BI.Utils.getWidgetBackgroundById(wId) || BI.Utils.getActualWidgetBackground();
        }
    });
})();
/**
 * author: young
 * createdDate: 2018/3/15
 * description: 直接可获取的信息，一般为模板组件相关
 * 基本原则：utils出去的值不是可直接监听的，view/model中都可以调用
 */

!(function () {
    BI.Utils = BI.Utils || {};
    var Buffer = {};
    BI.extend(BI.Utils, {

        getWidgetsByTemplateId: function (template, callback) {
            if (template.reportId === this.getCurrentTemplateId()) {
                callback(Data.designModel.widgets);
            } else {
                this.reqWidgetsByTemplateId(template, function (data) {
                    callback(data);
                });
            }
        },

        getCurrentTemplateId: function () {
            return BI.designData.reportId || "";
        },

        getAllUsedTablesByTemplateId: function (tId, callback) {
            var key = "TEMPLATE_";
            var cache = Buffer[key + tId];
            if (BI.isNotNull(cache)) {
                callback(cache);
                return;
            }
            BI.Utils.getTablesByTemplateId({
                reportId: tId,
                createBy: BI.designModel.createBy
            }, function (tables) {
                Buffer[key] = tables || [];
                callback(Buffer[key]);
            });
        },

        getAllWidgetIds: function () {
            return BI.keys(BI.designModel.widgets);
        },

        getAllControlWidgetIds: function () {
            return BI.keys(BI.filter(BI.designModel.widgets, function (wId) {
                return BI.Utils.isControlWidgetByWidgetId(wId);
            }));
        },

        getLinkageGroup: function () {
            return Fix.toJSON(BI.designModel.linkageGroup);
        },

        _getWidgetCalculationTargetIdsByWIds: function (wIds, callback) {
            wIds = BI.isArray(wIds) ? wIds : [wIds];
            var self = this, map4Req = {};
            BI.each(wIds, function (idx, wId) {
                var name = "";
                var widget = BI.designModel.widgets[wId];
                if (BI.isNotNull(widget)) {
                    name = BI.designModel.widgets[wId].name;
                }
                if (BI.Utils.getWidgetTypeById(wId) === BICst.DESIGN.WIDGET.CONTENT) {
                    name = BI.designModel.widgets[wId].content || "";
                }
                var strArr = name.match(/\$[\{][^\}]*[\}]/g);
                if (BI.isNotNull(strArr)) {
                    BI.each(strArr, function (i, str) {
                        var obj = JSON.parse(str.substring(1, str.length));
                        var id = obj.alt;
                        // 指标才需要到后台计算
                        var dId = BI.Utils.getDimensionIdByDimensionGroupId(null, id);
                        if (!self.isWidgetExistById(id) && BI.isNotNull(dId) && self.isTargetById(dId)) {
                            if (!BI.has(map4Req, wId)) {
                                var targetWId = BI.Utils.getWidgetIdBydId(dId);
                                var widget = BI.Utils.getWidgetCalculationByID(targetWId);
                                var sourceWidget = BI.Utils.getWidgetCalculationByID(wId);
                                if (!BI.Utils.isWidgetsInSameLinkageGroup([wId, targetWId])) {
                                    widget.linkage = {};
                                    widget.customLinkConf = {};
                                }
                                // 手动设置联动是双向的 = =
                                var targetCustomLinkConf = widget.customLinkConf || {};
                                BI.each(sourceWidget.customLinkConf, function (id, conf) {
                                    targetCustomLinkConf[id] = targetCustomLinkConf[id] || [];
                                    targetCustomLinkConf[id] = BI.concat(targetCustomLinkConf[id], conf);
                                });
                                widget.customLinkConf = targetCustomLinkConf;

                                var extendLinkage = {};
                                // 去除无效的clicked
                                BI.each(sourceWidget.linkage, function (idx, linkage) {
                                    if (linkage.clicked && BI.Utils.isDimensionExist(linkage.clicked.dId)) {
                                        extendLinkage[idx] = linkage;
                                    }
                                });

                                if (BI.isNotNull(extendLinkage) && BI.isNotEmptyObject(extendLinkage) && BI.Utils.isWidgetsInSameLinkageGroup([wId, targetWId])) {
                                    widget.linkage = BI.extend(widget.linkage, extendLinkage);
                                }
                                map4Req[targetWId] = map4Req[targetWId] || {
                                    widget: widget,
                                    targetIds: []
                                };
                            }
                            map4Req[targetWId].targetIds.pushDistinct(dId);
                        }
                    });
                }
            });
            if (BI.size(map4Req) === 0) {
                callback();
            } else {
                BI.Utils.getSummaryValuesByTargetIds(map4Req, function (res) {
                    callback(res.data);
                });
            }
        },

        getWidgetResultFilterById: function (wId) {
            return this.getWidgetById(wId).resultFilter || [];
        },

        getWidgetShowTitleById: function (wId) {
            return BI.designModel.widgets[wId].showTitle;
        },

        getWidgetShowTimeById: function (wId) {
            return BI.designModel.widgets[wId].showTime;
        },

        getWidgetOverlapById: function (wId) {
            return BI.designModel.widgets[wId].allowOverlap;
        },

        getWidgetOpenJumpById: function (wId) {
            return BI.designModel.widgets[wId].openJump;
        },

        // 此方法支持wId的数组，传入是数组，则返回一组string
        // 传入一个id，兼容之前的写法，则返回一个string
        getWidgetNameById: function (wIds, callback, options) {
            options = options || {
                keepStyle: false,
                content: false
            };
            wIds = BI.isArray(wIds) ? wIds : [wIds];
            var self = this;
            var names = {};
            this._getWidgetCalculationTargetIdsByWIds(wIds, function (map) {
                BI.each(wIds, function (idx, wId) {
                    var name = "";
                    var widget = BI.designModel.widgets[wId];
                    if (BI.isNotNull(widget)) {
                        name = BI.designModel.widgets[wId].name;
                    }
                    if (BI.Utils.getWidgetTypeById(wId) === BICst.DESIGN.WIDGET.CONTENT && options.content) {
                        name = BI.designModel.widgets[wId].content || "";
                    }
                    var regexStr = options.keepStyle ? BICst.REGULAR_STRING.PLACE_HOLDER : BICst.REGULAR_STRING.PLACE_HOLDER + "|" + BICst.REGULAR_STRING.HTML_STYLE_TAG;
                    names[wId] = BI.htmlDecode(name.replaceAll(regexStr, function (imageStr) {
                        if (imageStr.startWith("${")) {
                            var obj = JSON.parse(imageStr.substring(1, imageStr.length));
                            var id = obj.alt;
                            if (!self.isWidgetExistById(id) && !self.isDimensionExist(id) && !self.isDimensionGroupIdExist(null, id)) {
                                return "<!" + BI.i18nText("BI-Design_Element_Is_Deleted") + "!>";
                            }
                            // 绑定的是控件,组件不能直接绑定
                            if (self.isWidgetExistById(id)) {
                                if (self.isUnderControlRangeById(id, wId)) {
                                    return self.getControlWidgetValueTextByID(id);
                                }

                                return BI.i18nText("BI-Design_All");
                            }
                            var dId = self.isDimensionExist(id) ? id : self.getDimensionIdByDimensionGroupId(null, id);
                            var fromWId = self.getWidgetIdBydId(dId);
                            if (self.isControlWidgetByWidgetId(fromWId)) {
                                if (self.isUnderControlRangeById(fromWId, wId)) {
                                    return self.getControlWidgetValueTextByID(id);
                                }

                                return BI.i18nText("BI-Design_All");
                            }
                            return self.isTargetById(dId) ? self._getFormatTargetValue(dId, map[dId]) : self.getLinkageValueTextByID(wId, dId);
                        }
                        return "";
                    }));
                });
                callback(names);
            });
        },

        // target类型的格式化
        _getFormatTargetValue: function (dId, text) {
            var setting = BI.Utils.getSwitchMeasureSettingById(dId);
            return BI.Format.numberFormat(text, {
                formatStyle: setting.formatStyle,
                formatDecimal: setting.formatDecimal,
                numLevel: setting.numLevel,
                numSeparators: setting.numSeparators,
                unit: setting.unit
            });
        },

        getJumpByID: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].jump || []);
        },

        checkWidgetNameByID: function (name, wId) {
            return !BI.some(BI.designModel.widgets, function (idx, widget) {
                return wId !== idx && widget.name === name;
            });
        },

        getWidgetById: function (wId) {
            return BI.designModel.widgets[wId] || {};
        },

        getWidgetTypeById: function (wId) {
            return BI.Utils.getWidgetById(wId).type;
        },

        // 获取指定widget的拷贝,拷贝信息只包含widget的自身信息，如维度指标及其相关属性
        // 不包含widget间的信息,如widget间的联动什么的
        getWidgetCopy: function (widget) {
            if (BI.isNotNull(widget)) {
                var wid = widget.wId;
                var oldName = widget.name;
                widget.name = BI.Func.createDistinctName(BI.designModel.widgets, widget.name);
                if (oldName.match(/<\/p>(?=((?!<\/p>).)*$)/g)) {
                    var startIndex = oldName.length;
                    // 最后一行如果有换行需要把换行去掉
                    var end = oldName.substring(oldName.length - 8, oldName.length - 4) === "<br>" ? oldName.length - 8 : oldName.length - 4;
                    widget.name = oldName.substring(0, end) + widget.name.substring(startIndex) + "</p>";
                }
                widget.name = BI.Func.createDistinctName(BI.designModel.widgets, widget.name);
                widget.wId = BI.UUID();
                widget.timeStamp = Date.now();
                if (BI.has(widget, "clicked")) {
                    widget.clicked = {};
                }
                if (BI.has(widget, "linkage")) {
                    widget.linkage = {};
                }
                var dimTarIdMap = {};
                BI.each(widget.dimensions, function (dimensionId) {
                    dimTarIdMap[dimensionId] = BI.UUID();
                });
                if (BI.has(widget, "parameterValue")) {
                    var params = BI.map(BI.pool.parameterPool.allParameter, "value");

                    BI.each(BI.designModel.widgets, function (widgetID, widget) {
                        if (!widget.useParameter) return;

                        var value = widget.parameterValue;

                        BI.each(value, function (index, param) {
                            if (BI.isNull(param)) return;
                            BI.remove(params, param);
                        });
                    });

                    BI.each(widget.parameterValue, function (index, param) {
                        if (BI.contains(params, param)) return;

                        widget.parameterValue[index] = undefined;
                    });
                }

                var regexStr = BI.concat(BI.keys(dimTarIdMap), [wid]).join("|");
                var widgetStr = JSON.stringify(widget);
                var resultWidgetStr = BI.isEmptyString(regexStr) ? widgetStr : widgetStr.replaceAll(regexStr, function (str) {
                    return dimTarIdMap[str] || widget.wId;
                });
                return JSON.parse(resultWidgetStr);
            }
        },

        getWidgetCopyByID: function (wid) {
            var widget = BI.deepClone(BI.designModel.widgets[wid]);
            return this.getWidgetCopy(widget);
        },

        getWidgetViewById: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].view);
        },

        getWidgetBoundsById: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].bounds);
        },

        getWidgetCustomLinkConfById: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].customLinkConf || {});
        },

        getWidgetSettingsById: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].settings || {});
        },

        getWidgetViewAttrById: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].viewAttr || {});
        },

        getLinkageOfWidget: function (wId) {
            return BI.designModel.widgets[wId].linkage || {};
        },

        getClickedOfWidget: function (wId) {
            return BI.designModel.widgets[wId].clicked || {};
        },

        getTableNameWidgetId: function (wId) {
            return BI.designModel.widgets[wId].tableName;
        },

        getAllDimDimensionIds: function (wId) {
            var self = this;
            var allDims = this.getAllDimensionIDs(wId);
            return BI.filter(allDims, function (i, dId) {
                return !self.isTargetById(dId);
            });
        },

        getAllDimensionIDs: function (wId) {
            var ids = [];
            if (!wId) {
                BI.each(BI.designModel.widgets, function (wId, widget) {
                    ids = BI.concat(ids, BI.keys(widget.dimensions));
                });
                return ids;
            }
            if (this.isWidgetExistById(wId)) {
                ids = BI.keys(BI.designModel.widgets[wId].dimensions);
            }
            return ids;
        },

        getWidgetIconByWidget: function (widget) {
            var wType = widget.type;

            if (wType !== BICst.DESIGN.WIDGET.CHART) return BI.Func.getWidgetFontClass(wType);

            var chartAttr = (widget.settings || {}).chartAttr;
            var types = [];
            BI.each(chartAttr, function (dId, dimension) {
                types.push(dimension.type);
            });

            types = BI.uniq(types);

            if (BI.size(types) !== 1) return "approximate-many-icon";

            switch (BI.first(types)) {
                case BICst.CHART.ATTR.CHART_TYPE.INTERVAL:
                    return "approximate-interval-icon";
                case BICst.CHART.ATTR.CHART_TYPE.POINT:
                    return "approximate-point-icon";
                case BICst.CHART.ATTR.CHART_TYPE.HEAT_MAP:
                    return "approximate-heatmap-icon";
                case BICst.CHART.ATTR.CHART_TYPE.LINE:
                    return "approximate-line-icon";
                case BICst.CHART.ATTR.CHART_TYPE.AREA:
                    return "approximate-area-icon";
                case BICst.CHART.ATTR.CHART_TYPE.SQUARE:
                    return "approximate-square-icon";
                case BICst.CHART.ATTR.CHART_TYPE.PIE:
                    return "approximate-pie-icon";
                case BICst.CHART.ATTR.CHART_TYPE.TEXT:
                    return "approximate-text-icon";
                case BICst.CHART.ATTR.CHART_TYPE.MAP:
                    return "approximate-map-icon";
                case BICst.CHART.ATTR.CHART_TYPE.FUNNEL:
                    return "approximate-funnel-icon";
                case BICst.CHART.ATTR.CHART_TYPE.GAUGE:
                    return "approximate-gauge-icon";
                default:
                    return "approximate-many-icon";
            }
        },

        getWidgetIconById: function (wId) {
            return this.getWidgetIconByWidget(this.getWidgetById(wId));
        },

        getAllUsedFieldIdsAndWidgetId: function () {
            var allDIds = this.getAllDimensionIDs();
            var fields = [];
            var self = this;
            BI.each(allDIds, function (i, dId) {
                fields.push({
                    fId: self.getFieldIdBydId(dId),
                    wId: self.getWidgetIdBydId(dId)
                });
            });
            return fields;
        },

        getGlobalExportData: function (callback) {
            BI.Utils.getWidgetNameById(BI.filter(BI.Utils.getAllWidgetIds(), function (index, wId) {
                return BI.Utils.isStaticWidgetByWidgetType(BI.Utils.getWidgetTypeById(wId));
            }), function (names) {
                var widgets = {};
                BI.each(names, function (id, name) {
                    widgets[id] = BI.extend(BI.Utils.getWidgetCalculationByID(id), {
                        wId: BI.UUID(),
                        name: name,
                        globalFilter: BI.designData.filter
                    });
                });
                callback({
                    widgets: widgets
                });
            });
        },

        getExportData4WidgetByWid: function (wId, callback) {
            this.getWidgetNameById(BI.Utils.getAllWidgetIds(), function (names) {
                var widget = BI.extend(BI.Utils.getWidgetCalculationByID(wId), {
                    wId: BI.UUID(),
                    name: names[wId],
                    globalFilter: BI.designData.filter
                });

                var filterValue = BI.Utils.getFilterValue4ExportByWid(wId, names);
                var drillItems = BI.Utils.getDrillItems(wId);
                if (BI.size(drillItems) > 0) {
                    filterValue.push({
                        type: 1,
                        text: BI.map(drillItems, "text").join(" ")
                    });
                }

                callback({
                    // sessionId: Data.SharingPool.get("sessionId"),
                    widget: widget,
                    // reportName: Data.SharingPool.get('reportName'),
                    // FIXME: 方法已写好，等后台适配
                    filterValue: filterValue
                });
            });
        },

        getLastSelectedTableName: function () {
            var lastSelected = null;
            var lastTime = null;
            BI.map(BI.designModel.widgets, function (idx, widget) {
                if (BI.isNotNull(widget.tableName) && widget.timeStamp > lastTime) {
                    lastSelected = widget.tableName || lastSelected;
                    lastTime = widget.timeStamp;
                }
            });
            return lastSelected ? BI.Cache.getItem("lastSelectedTableName") || lastSelected : lastSelected;
        },

        isDrillField: function (wId, fId) {
            var drillDir = BI.Utils.getDrillDirByIdOfWidget(wId, fId);
            return drillDir.length > 1 && BI.Utils.getWidgetTypeById(wId) !== BICst.DESIGN.WIDGET.DETAIL;
        },

        getDrillDirByIdOfWidget: function (wId, fId) {
            var field = this.getFieldByIdOfWidget(wId, fId);
            return (field && field.drillDir) || [];
        },

        getDrillNameByIdOfWidget: function (wId, fId) {
            var field = this.getFieldByIdOfWidget(wId, fId);
            return (field && field.drillName) || "";
        },

        getAllDrillNames: function (wId) {
            var measures = BI.Utils.getWidgetById(wId).measures;

            var names = [];

            BI.each(measures, function (index, measure) {
                if (BI.isNull(measure.drillName)) return;

                names.push(measure.drillName);
            });

            return names;
        },

        checkFieldIsAggByDId: function (wId, dId) {
            return this.checkFieldIsAgg(wId, BI.Utils.getFieldIdBydId(dId));
        },

        getCalculateTargetIdsByFieldIdOfWidget: function (wId, fId) {
            if (this.isCalculateFieldByFieldIdOfWidget(wId, fId)) {
                var field = this.getFieldByIdOfWidget(wId, fId);
                return field.targetIds;
            }
        },

        getCalculateValueByFieldIdOfWidget: function (wId, fId) {
            if (this.isCalculateFieldByFieldIdOfWidget(wId, fId)) {
                var field = this.getFieldByIdOfWidget(wId, fId);
                return BI.get(field.calculate, "value");
            }
        },

        isCalculateField4UseByFieldIdOfWidget: function (wId, fId) {
            var field = this.getFieldByIdOfWidget(wId, fId) || {};
            return field.type === BICst.COLUMN.CALCULATE;
        },

        isCalculateFieldByFieldIdOfWidget: function (wId, fId) {
            var field = this.getFieldByIdOfWidget(wId, fId) || {};
            return BI.contains([BICst.COLUMN.CALCULATE, BICst.COLUMN.TRANSFORM_FROM_CALC], field.type);
        },

        // 一个计算指标所用到的所有的指标
        getAllUsedCalTargets: function (wId, fId) {
            var allUsedCalTargets = [];

            var field = this.getFieldByIdOfWidget(wId, fId);

            if (BI.isNull(field)) return allUsedCalTargets;

            if (field.type !== BICst.COLUMN.CALCULATE) return allUsedCalTargets;

            BI.each(field.targetIds, function (index, tId) {
                allUsedCalTargets = allUsedCalTargets.concat([tId], BI.Utils.getAllUsedCalTargets(wId, tId));
            });

            return BI.uniq(allUsedCalTargets);
        },

        getUnavailableCalTargets: function (wId, fId) {
            var unavailableCalTargets = [];

            if (BI.isNull(fId)) return unavailableCalTargets;

            var field = this.getFieldByIdOfWidget(wId, fId);

            if (BI.isNull(field)) return unavailableCalTargets;

            if (field.type !== BICst.COLUMN.CALCULATE) return unavailableCalTargets;

            BI.each(this.getFieldsOfWidget(wId), function (index, field) {
                if (field.type !== BICst.COLUMN.CALCULATE || field.id === fId) return;

                var usedCalTargets = BI.Utils.getAllUsedCalTargets(wId, field.id);

                if (!BI.contains(usedCalTargets, fId)) return;

                unavailableCalTargets.push(field.id);
            });

            return unavailableCalTargets;
        },

        checkFieldIsAgg: function (wId, fId) {
            var field = this.getFieldByIdOfWidget(wId, fId);

            if (BI.isNull(field)) return false;

            if (field.type !== BICst.COLUMN.CALCULATE) return false;

            var isAgg = false;

            // 判断是否用到了AGG函数
            if (field.calculate && field.calculate.type === BICst.DESIGN.CAL_TARGET.FORMULA) {
                isAgg = BI.Utils.checkIfUsedAggFunc(field.calculate.value);
            }

            if (isAgg) return true;

            return this.checkTargetIdsIsAgg(wId, field.targetIds, isAgg, 0);
        },

        checkIfUsedAggFunc: function (formulaStr) {
            var aggFuncNames = BI.deepClone(BICst.AGG_FUNC);

            return BI.some(aggFuncNames, function (index, funcName) {
                var formula = formulaStr.toUpperCase();

                return formula.indexOf(funcName) !== -1;
            });
        },

        checkTargetIdsIsAgg: function (wId, targetIds, isAgg, index) {
            if (BI.isNull(index)) index = 0;

            if (isAgg === true) return isAgg;

            var length = BI.size(targetIds);

            if (index === length) return isAgg;

            return this.checkTargetIdsIsAgg(wId, targetIds, this.checkFieldIsAgg(wId, targetIds[index]), index + 1);
        },

        isWidgetExistById: function (wId) {
            return this.getAllWidgetIds().contains(wId);
        },

        isQueryControlExist: function () {
            var self = this,
                isQueryExist = false;

            BI.some(this.getAllWidgetIds(), function (i, wId) {
                if (self.getWidgetTypeById(wId) === BICst.DESIGN.WIDGET.QUERY) {
                    return isQueryExist = true;
                }
            });
            return isQueryExist;
        },

        isGeneralQueryExist: function () {
            var self = this,
                isGeneralQueryExist = false;

            BI.some(this.getAllWidgetIds(), function (i, wId) {
                if (self.getWidgetTypeById(wId) === BICst.DESIGN.WIDGET.GENERAL_QUERY) {
                    return isGeneralQueryExist = true;
                }
            });
            return isGeneralQueryExist;
        },

        isResetControlExist: function () {
            var self = this,
                isResetExist = false;

            BI.some(this.getAllWidgetIds(), function (i, wId) {
                if (self.getWidgetTypeById(wId) === BICst.DESIGN.WIDGET.RESET) {
                    return isResetExist = true;
                }
            });
            return isResetExist;
        },

        isQueryAutoQueryWhenFresh: function () {
            var self = this, autoQuery = true;

            // 编辑模式下视为自动查询视为打开
            if (!this.isUnderPreviewMode()) {
                return true;
            }

            BI.map(this.getAllWidgetIds(), function (i, wId) {
                if (self.getWidgetTypeById(wId) === BICst.DESIGN.WIDGET.QUERY) {
                    var widget = BI.designModel.widgets[wId] || {};
                    autoQuery = widget.autoQuery;

                    return true;
                }
            });

            return autoQuery;
        },

        // 判断是否在编辑模式下
        isUnderPreviewMode: function () {
            var isEdit = BI.designData.isEdit;
            if (BI.isNull(isEdit)) {
                isEdit = true;
            }
            return !isEdit;
        },

        isControlWidgetByWidgetId: function (wId) {
            var widgetType = this.getWidgetTypeById(wId);
            return this.isControlWidgetByWidgetType(widgetType);
        },

        isControlWidgetByWidgetType: function (widgetType) {
            var controlTypes = [
                BICst.DESIGN.WIDGET.STRING,
                BICst.DESIGN.WIDGET.STRING_LIST,
                BICst.DESIGN.WIDGET.NUMBER,
                BICst.DESIGN.WIDGET.SINGLE_SLIDER,
                BICst.DESIGN.WIDGET.INTERVAL_SLIDER,
                BICst.DESIGN.WIDGET.DATE_INTERVAL,
                BICst.DESIGN.WIDGET.MONTH,
                BICst.DESIGN.WIDGET.QUARTER,
                BICst.DESIGN.WIDGET.TREE,
                BICst.DESIGN.WIDGET.TREE_LIST,
                BICst.DESIGN.WIDGET.STRING_LABEL,
                BICst.DESIGN.WIDGET.TREE_LABEL,
                BICst.DESIGN.WIDGET.YEAR,
                BICst.DESIGN.WIDGET.DATE,
                BICst.DESIGN.WIDGET.DATE_PANE,
                BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL,
                BICst.DESIGN.WIDGET.GENERAL_QUERY
            ];
            return controlTypes.contains(widgetType);
        },

        isExtendWidgetByWidgetType: function (widgetType) {
            return widgetType === BICst.DESIGN.WIDGET.CONTENT ||
                widgetType === BICst.DESIGN.WIDGET.WEB ||
                widgetType === BICst.DESIGN.WIDGET.IMAGE ||
                widgetType === BICst.DESIGN.WIDGET.DETAIL;
        },

        isTableWidget: function (wId) {
            var type = this.getWidgetTypeById(wId);
            return type === BICst.DESIGN.WIDGET.TABLE ||
                type === BICst.DESIGN.WIDGET.CROSS_TABLE ||
                type === BICst.DESIGN.WIDGET.DETAIL;
        },

        // 是否是统计组件
        isStaticWidgetByWidgetType: function (type) {
            return type === BICst.DESIGN.WIDGET.TABLE ||
                type === BICst.DESIGN.WIDGET.CROSS_TABLE ||
                type === BICst.DESIGN.WIDGET.DETAIL ||
                type === BICst.DESIGN.WIDGET.CHART;
        },

        isInstantControlWidgetByWidgetId: function (wId) {
            var widgetType = this.getWidgetTypeById(wId);
            return this.isInstantControlWidgetByWidgetType(widgetType);
        },

        isInstantControlWidgetByWidgetType: function (widgetType) {
            var instantTypes = [
                BICst.DESIGN.WIDGET.STRING_LABEL,
                BICst.DESIGN.WIDGET.TREE_LABEL,
                BICst.DESIGN.WIDGET.TREE_LIST,
                BICst.DESIGN.WIDGET.STRING_LIST,
                BICst.DESIGN.WIDGET.SINGLE_SLIDER,
                BICst.DESIGN.WIDGET.DATE_PANE,
                BICst.DESIGN.WIDGET.INTERVAL_SLIDER
            ];
            return instantTypes.contains(widgetType);
        },

        isSpecialWidgetByWidgetId: function (wId) {
            var widgetType = this.getWidgetTypeById(wId);
            return this.isSpecialWidgetByWidgetType(widgetType);
        },

        isSpecialWidgetByWidgetType: function (widgetType) {
            var specialTypes = [
                BICst.DESIGN.WIDGET.CONTENT,
                BICst.DESIGN.WIDGET.IMAGE,
                BICst.DESIGN.WIDGET.WEB
            ];
            return specialTypes.contains(widgetType);
        },

        getWidgetValueById: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].value);
        },

        getWidgetFilterById: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].settings.tableAttr.filterValue || {});
        },

        getWidgetSortSequence: function (wId) {
            return BI.designModel.widgets[wId].sortSequence;
        },

        getWidgetControlRangeById: function (wId) {
            return Fix.toJSON(BI.designModel.widgets[wId].controlRange || {});
        },

        getDimensionTypeByFieldType: function (type) {
            switch (type) {
                case BICst.COLUMN.STRING:
                    return BICst.DESIGN.DIMENSION_TYPE.STRING;
                case BICst.COLUMN.TARGET_NAME:
                    return BICst.DESIGN.DIMENSION_TYPE.TARGET_NAME;
                case BICst.COLUMN.DATE:
                    return BICst.DESIGN.DIMENSION_TYPE.DATE;
                case BICst.COLUMN.NUMBER:
                    return BICst.DESIGN.DIMENSION_TYPE.NUMBER;
                case BICst.COLUMN.COUNTER:
                    return BICst.DESIGN.DIMENSION_TYPE.COUNTER;
                case BICst.COLUMN.CALCULATE:
                    return BICst.DESIGN.DIMENSION_TYPE.CAL_TARGET;
                case BICst.COLUMN.TRANSFORM_FROM_NUMBER:
                    return BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_NUMBER;
                case BICst.COLUMN.TRANSFORM_FROM_CALC:
                    return BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_CAL;
                default:
                    break;
            }
        },

        getFieldTypeByDimensionType: function (type) {
            switch (type) {
                case BICst.DESIGN.DIMENSION_TYPE.STRING:
                    return BICst.COLUMN.STRING;
                case BICst.DESIGN.DIMENSION_TYPE.TARGET_NAME:
                    return BICst.COLUMN.TARGET_NAME;
                case BICst.DESIGN.DIMENSION_TYPE.DATE:
                    return BICst.COLUMN.DATE;
                case BICst.DESIGN.DIMENSION_TYPE.NUMBER:
                    return BICst.COLUMN.NUMBER;
                case BICst.DESIGN.DIMENSION_TYPE.COUNTER:
                    return BICst.COLUMN.COUNTER;
                case BICst.DESIGN.DIMENSION_TYPE.CAL_TARGET:
                    return BICst.COLUMN.CALCULATE;
                case BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_NUMBER:
                    return BICst.COLUMN.TRANSFORM_FROM_NUMBER;
                case BICst.DESIGN.DIMENSION_TYPE.TRANSFORM_FROM_CAL:
                    return BICst.COLUMN.TRANSFORM_FROM_CALC;
                default:
                    break;
            }
        },

        getFieldIconByIdOfWidget: function (wId, id) {
            var fieldType = this.getFieldTypeByIdOfWidget(wId, id);
            return this.getFieldIconByFieldType(fieldType);
        },

        getFieldIconByFieldType: function (fieldType) {
            switch (fieldType) {
                case BICst.COLUMN.STRING:
                    return "string-field-font";
                case BICst.COLUMN.NUMBER:
                    return "number-field-font";
                case BICst.COLUMN.DATE:
                    return "date-field-font";
                case BICst.COLUMN.COUNTER:
                    return "number-field-font";
                default:
                    return "string-field-font";
            }
        },

        getDefaultGroupTypeByFieldIdOfWidget: function (wId, fId) {
            var type = BI.Utils.getFieldTypeByIdOfWidget(wId, fId);
            switch (type) {
                case BICst.COLUMN.STRING:
                case BICst.COLUMN.TARGET_NAME:
                    return BICst.DESIGN.GROUP.ID_GROUP;
                case BICst.COLUMN.TRANSFORM_FROM_CALC:
                case BICst.COLUMN.TRANSFORM_FROM_NUMBER:
                    return BICst.GROUP.NUMBER_GROUP;
                case BICst.COLUMN.DATE:
                    return BI.Utils.getFieldGroupTypeByIdOfWidget(wId, fId) || BICst.DESIGN.GROUP.YMD;
                case BICst.COLUMN.NUMBER:
                case BICst.COLUMN.CALCULATE:
                    return BICst.DESIGN.SUMMARY_TYPE.SUM;
                case BICst.COLUMN.COUNTER:
                    return BICst.DESIGN.GROUP.ID_GROUP;
                default:
                    return BICst.DESIGN.GROUP.ID_GROUP;
            }
        },

        isDimensionRegionByRegionType: function (regionType) {
            return BI.parseInt(regionType) < BI.parseInt(BICst.REGION.TARGET1);
        },

        isTargetFieldById: function (wId, fId) {
            var field = this.getFieldByIdOfWidget(wId, fId);
            switch (field.type) {
                case BICst.COLUMN.NUMBER:
                case BICst.COLUMN.COUNTER:
                case BICst.COLUMN.CALCULATE:
                    return true;
                default:
                    return false;
            }
        },

        // 所有的表格属性使用的是相同的指标
        isColorAttrSameTargetById: function (wId) {
            var colorAttr = BI.designModel.widgets[wId].settings.tableAttr.color;
            var allEmpty = true, allNotEmpty = true, dims = [], colors = [];
            BI.some(colorAttr, function (id, attr) {
                if (id === BICst.DESIGN.TABLE_ATTR_ALL) {
                    return;
                }
                if (attr.dims.length > 0) {
                    allEmpty = false;
                } else {
                    allNotEmpty = false;
                }
                dims = dims.concat(attr.dims);
                colors = colors.concat(attr.color);
            });
            if (allNotEmpty) {
                return this.isSameTargetOfTargetIds(dims);
            }
            if (allEmpty) {
                return BI.uniq(colors).length === 1 && colors[0] !== "";
            }
            return false;
        },

        isShapeAttrSameTargetById: function (wId) {
            var shapeAttr = BI.designModel.widgets[wId].settings.tableAttr.shape;
            var allEmpty = true, allNotEmpty = true, dims = [], shapes = [];
            BI.some(shapeAttr, function (id, attr) {
                if (id === BICst.DESIGN.TABLE_ATTR_ALL) {
                    return;
                }
                if (attr.dims.length > 0) {
                    allEmpty = false;
                } else {
                    allNotEmpty = false;
                }
                dims = dims.concat(attr.dims);
                shapes = shapes.concat(attr.shape);
            });
            if (allNotEmpty) {
                return this.isSameTargetOfTargetIds(dims);
            }
            if (allEmpty) {
                return BI.uniq(shapes).length === 1 && shapes[0] !== BICst.DESIGN.SHAPE_TYPE.NONE;
            }
            return false;
        },

        // 是否为“相同”指标
        isSameTargetOfTargetIds: function (targetIds) {

            function getTargetAttr (tId) {
                var wId = BI.Utils.getWidgetIdBydId(tId);
                var widget = BI.designModel.widgets[wId];
                var dim = widget.dimensions[tId];
                if (!dim) {
                    return null;
                }
                var dimGroup = dim.group;
                var fieldId = BI.Utils.getFieldIdBydId(tId);
                var field = BI.Utils.getFieldByIdOfWidget(wId, fieldId);
                var dimCalculation = BI.Utils.getDimensionCalculationTypeById(tId);
                var groupPrefix = "summary_", calculatePrefix = "cal_";

                dimGroup = groupPrefix + (dimGroup ? dimGroup.type : BICst.SUMMARY_TYPE.SUM);
                dimCalculation = calculatePrefix + dimCalculation;
                var attr = {};
                if (BI.isNotNull(field.group) && BI.isNotNull(field.group[dimGroup]) &&
                    BI.isNotNull(field.group[dimGroup].cal)) {
                    attr = field.group[dimGroup].cal[dimCalculation];
                }
                return {
                    dimGroup: dimGroup,
                    dimCalculation: dimCalculation,
                    fieldId: field.id,
                    attr: attr
                };
            }

            if (!BI.isArray(targetIds) || targetIds.length <= 1) {
                return true;
            }
            var preTarAttr = getTargetAttr(targetIds[0]);
            return BI.every(targetIds, function (i, tId) {
                // 分组、快速计算相同 && fields中该组合下的属性相同
                var targetAttr = getTargetAttr(tId);
                if (BI.isNull(preTarAttr) && BI.isNull(targetAttr)) {
                    return true;
                }
                if (BI.isEqual(preTarAttr, targetAttr)) {
                    return true;
                }
            });
        },

        getAllTargetDimensionIds: function (wId) {
            var self = this;
            var allDims = this.getAllDimensionIDs(wId);
            return BI.filter(allDims, function (i, dId) {
                return self.isTargetById(dId);
            });
        },

        broadcastAllWidgets2Reset: function () {
            BI.each(this.getAllWidgetIds(), function (i, widgetId) {
                BI.Broadcasts.send(BICst.BROADCAST.RESET_PREFIX + widgetId);
            });
        },

        broadcastAllControlWidgets2Reset: function () {
            var self = this;
            BI.each(this.getAllWidgetIds(), function (i, widgetId) {
                if (self.isControlWidgetByWidgetId(widgetId)) {
                    BI.Broadcasts.send(BICst.BROADCAST.RESET_PREFIX + widgetId);
                }
            });
        },

        broadcastAllWidgets2Refresh: function (force, wId) {
            var self = this;
            var allWidgetIds = this.getAllWidgetIds();
            if (force === true || this.isQueryControlExist() === false) {
                BI.each(allWidgetIds, function (i, widgetId) {
                    if (!self.isControlWidgetByWidgetId(widgetId) || self.isInstantControlWidgetByWidgetId(widgetId) ||
                        BI.Utils.isSpecialWidgetByWidgetId(widgetId)) {
                        if (BI.isNull(wId) || wId !== widgetId) {
                            BI.Broadcasts.send(BICst.BROADCAST.REFRESH_PREFIX + widgetId);
                        }
                    }
                });
            }
        },

        isUnderControlRangeById: function (filterWId, targetWId) {
            var controlRange = this.getWidgetControlRangeById(filterWId) || {};
            var inControlRange = true;

            if (controlRange.type === BICst.DESIGN.CONTROL_RANGE_TYPE.CUSTOMIZE) {
                inControlRange = inControlRange && BI.contains(controlRange.value || [], targetWId);
            }

            return inControlRange;
        },

        // 根据分组找联动组件
        getLinkageWidgetsOfGroup: function (wId) {
            var linkWidgets = [];
            var allWIds = this.getAllWidgetIds();
            var linkageGroup = this.getLinkageGroup();
            if (BI.isNull(linkageGroup)) {
                linkWidgets = allWIds;
            } else {
                // 新加入的组件没有自动放入到任何分组中，但默认在第一个分组中
                BI.each(allWIds, function (i, id) {
                    var found = BI.some(linkageGroup, function (j, group) {
                        return BI.some(group, function (k, ob) {
                            return id === ob.widgetId;
                        });
                    });
                    if (!found) {
                        linkageGroup[0] = linkageGroup[0] || [];
                        linkageGroup[0].push({widgetId: id});
                    }
                });
                // 相同分组中组件
                BI.some(linkageGroup, function (i, group) {
                    var found = BI.some(group, function (i, widget) {
                        return widget.widgetId === wId;
                    });
                    if (found) {
                        BI.each(group, function (i, widget) {
                            linkWidgets.push(widget.widgetId);
                        });
                        return true;
                    }
                });
            }
            return linkWidgets;
        },

        isWidgetsInSameLinkageGroup: function (wIds) {
            var linkageGroup = this.getLinkageGroup();
            var notInAnyGroup = true;
            var findInExistGroup = BI.any(linkageGroup, function (idx, group) {
                var groupWIds = BI.map(group, "widgetId");
                var length = BI.intersection(groupWIds, wIds).length;
                if (length !== 0) {
                    notInAnyGroup = false;
                }
                if (wIds.length === length) {
                    return true;
                }
            });
            return findInExistGroup || notInAnyGroup;
        },

        // 找到当前所有能联动到的组件
        getAllLinkageWidgets: function (wId, callback) {
            var self = this;
            var linkWidgets = this.getLinkageWidgetsOfGroup(wId);
            var tableName = this.getTableNameWidgetId(wId);
            var linkConf = this.getWidgetCustomLinkConfById(wId);

            function isValidCustomLinkConf (conf, linkTables) {
                // 字段丢失、字段没有权限、未选择字段、字段类型不一致
                if (conf.length === 0) {
                    return false;
                }
                return !BI.some(conf, function (i, dep) {
                    var from = dep.from, to = dep.to;
                    if (from === BICst.COMMON.EMPTY_FIELD || to === BICst.COMMON.EMPTY_FIELD) {
                        return true;
                    }
                    if (BI.Utils.isNoAuthField(from) || BI.Utils.isNoAuthField(to)) {
                        return true;
                    }
                    var fromField = BI.Utils.getOriginFieldById(from),
                        toField = BI.Utils.getOriginFieldById(to);
                    var fromFields = BI.Utils.getFieldsByTableName(tableName);
                    var toFields = [];
                    BI.each(linkTables, function (i, tableName) {
                        toFields = toFields.concat(BI.Utils.getFieldsByTableName(tableName));
                    });
                    var isFromFieldExist = BI.some(fromFields, function (i, field) {
                        return field.id === from;
                    });
                    var isToFieldExist = BI.some(toFields, function (i, field) {
                        return field.id === to;
                    });
                    if (!isFromFieldExist || !isToFieldExist) {
                        return true;
                    }
                    if (fromField.type !== toField.type) {
                        return true;
                    }
                });
            }

            // 异步获取（缓存）所有关联
            BI.Utils.getRelations(function (relations) {
                var foreignTables = self.getForeignTablesOfTable(tableName, relations);
                var links = [];
                BI.each(linkWidgets, function (i, id) {
                    if (id === wId || !BI.Utils.isWidgetExistById(id)) {
                        return;
                    }
                    if (BI.Utils.getWidgetTypeById(id) === BICst.DESIGN.WIDGET.CONTENT) {
                        var linkTables = BI.Utils.getContentWidgetUsedTable(id);
                        if (BI.isNotNull(linkConf[id])) {
                            if (isValidCustomLinkConf(linkConf[id], linkTables)) {
                                links.push(id);
                            }
                        } else if (BI.contains(linkTables, tableName) || BI.isNotEmptyArray(BI.intersection(linkTables, foreignTables))) {
                            links.push(id);
                        }
                    } else {
                        var linkTable = self.getTableNameWidgetId(id);
                        // 相同表 & 子表
                        if (BI.isNotNull(linkConf[id])) {
                            if (isValidCustomLinkConf(linkConf[id], [linkTable])) {
                                links.push(id);
                            }
                        } else if (linkTable === tableName || foreignTables.contains(linkTable)) {
                            links.push(id);
                        }
                    }


                });
                callback(links);
            });
        },

        broadcastLinkWidgets2Refresh: function (wId) {
            this.getAllLinkageWidgets(wId, function (links) {
                BI.each(links, function (i, id) {
                    BI.Broadcasts.send(BICst.BROADCAST.LINKAGE_PREFIX + id, wId);
                });
            });
            var linkWidgets = this.getLinkageWidgetsOfGroup(wId);
            // 文本组件总是刷新
            BI.each(linkWidgets, function (idx, w) {
                if (BI.Utils.isWidgetExistById(w) && BI.Utils.isSpecialWidgetByWidgetId(w)) {
                    BI.Broadcasts.send(BICst.BROADCAST.LINKAGE_PREFIX + w, wId);
                }
            });
        },

        getTargetNameField: function (wId) {
            var fields = this.getFieldsOfWidget(wId);
            return BI.find(fields, function (i, field) {
                return field.type === BICst.COLUMN.TARGET_NAME;
            });
        },

        getFieldByIdOfWidget: function (wId, fieldId) {
            var fields = this.getFieldsOfWidget(wId);
            var field = BI.find(fields, function (i, field) {
                return field.id === fieldId;
            });
            return field || {};
        },

        isFieldInDrillDir: function (wId, fieldId) {
            var widget = BI.designModel.widgets[wId];
            if (!widget) {
                return false;
            }
            return BI.some(widget.measures, function (i, m) {
                var dir = BI.map(m.drillDir, "id");
                if (dir.contains(fieldId)) {
                    return true;
                }
            });
        },

        getFieldDirByIdOfWidget: function (wId, fieldId) {
            var field = this.getFieldByIdOfWidget(wId, fieldId);
            if (BI.isNotNull(field)) {
                return field.drillDir;
            }
        },

        getDimensionIdByDimensionGroupId: function (wId, id) {
            var dimensionGroups = {};
            var result;
            if (BI.isNull(wId)) {
                BI.find(this.getAllWidgetIds(), function (idx, w) {
                    result = BI.find(BI.deepClone(BI.designModel.widgets[w].dimensionGroups), function (key, value) {
                        return id === key || value.dimensionIds.contains(id);
                    });
                    return BI.isNotNull(result);
                });
            } else {
                dimensionGroups = BI.deepClone(BI.designModel.widgets[wId].dimensionGroups);
                result = BI.find(dimensionGroups, function (key, value) {
                    return id === key || value.dimensionIds.contains(id);
                });
            }
            if (BI.isNotNull(result)) {
                return result.dimensionIds[0];
            }
        },

        isDimensionGroupIdExist: function (wId, id) {
            if (BI.isNull(wId)) {
                var result = BI.find(this.getAllWidgetIds(), function (idx, wId) {
                    return BI.has(BI.designModel.widgets[wId].dimensionGroups, id);
                });
                return BI.isNotNull(result);
            }
            return BI.has(BI.designModel.widgets[wId].dimensionGroups, id);
        },

        getFieldNameByIdOfWidget: function (wId, fieldId) {
            var field = this.getFieldByIdOfWidget(wId, fieldId);
            if (BI.isNotEmptyObject(field)) {
                var geoName = "";
                switch (field.geoType) {
                    case BICst.DESIGN.TARGET_FIELD_GEO.LONGITUDE:
                        geoName = BI.i18nText("BI-Design_Longitude_With_Brackets");
                        break;
                    case BICst.DESIGN.TARGET_FIELD_GEO.LATITUDE:
                        geoName = BI.i18nText("BI-Design_Latitude_With_Brackets");
                        break;
                    default:
                        break;
                }
                return (field.transferName || BI.Utils.getFieldTransferName(field.id) || field.name) + geoName;
            }
        },

        getFieldTypeByIdOfWidget: function (wId, fieldId) {
            var field = this.getFieldByIdOfWidget(wId, fieldId);
            if (BI.isNotNull(field)) {
                return field.type;
            }
        },

        getFieldGroupTypeByIdOfWidget: function (wId, fieldId) {
            var field = this.getFieldByIdOfWidget(wId, fieldId);
            if (BI.isNotNull(field)) {
                return field.fieldGroupType;
            }
        },

        getFieldFilterByDid: function (dId) {
            var wId = this.getWidgetIdBydId(dId);
            var fieldId = this.getFieldIdBydId(dId);
            return this.getFieldFilterByIdOfWidget(wId, fieldId);
        },

        getFieldFilterByIdOfWidget: function (wId, fieldId) {
            var field = this.getFieldByIdOfWidget(wId, fieldId);
            if (BI.isNotNull(field)) {
                return BI.Utils.getWidgetTypeById(wId) === BICst.DESIGN.WIDGET.DETAIL ? field.detailFilter : field.filter;
            }
        },

        getFieldSortByIdOfWidget: function (wId, fieldId) {
            var field = this.getFieldByIdOfWidget(wId, fieldId);
            if (BI.isNotNull(field)) {
                return field.sort;
            }
        },

        getOriginFieldsOfWidget: function (wId) {
            var tableName = this.getTableNameWidgetId(wId);
            return BI.filter(this.getFieldsByTableName(tableName), function (idx, field) {
                return field.type !== BICst.COLUMN.COUNTER && field.type !== BICst.COLUMN.TARGET_NAME;
            });
        },

        // 获取组件中所有的结果字段
        getFieldsOfWidget: function (wId) {
            var widget = BI.designModel.widgets[wId];
            var tableName = widget.tableName;
            var fields = BI.deepClone(this.getFieldsByTableName(tableName)) || [],
                measures = BI.deepClone(widget.measures) || [],
                copiedMap = {};
            BI.each(measures, function (i, fieldOP) {
                var overwrite = BI.some(fields, function (j, oField) {
                    if (fieldOP.id === oField.id) {
                        fields[j] = fieldOP;

                        if (BI.Utils.calcOriginalFieldType(fields[j].type) !== oField.type) {
                            fields[j].type = oField.type;
                        }
                        return true;
                    }
                    // 复制的字段type改变
                    if (fieldOP.source === oField.id) {
                        if (BI.Utils.calcOriginalFieldType(fieldOP.type) !== BI.Utils.calcOriginalFieldType(oField.type) && fieldOP.type !== BICst.COLUMN.CALCULATE) {
                            fieldOP.type = oField.type;
                        }
                    }
                });
                if (overwrite) return;

                if (fieldOP.copied !== true) {
                    fields.push(fieldOP);

                    return;
                }

                if (BI.isNull(copiedMap[fieldOP.source])) copiedMap[fieldOP.source] = [];

                copiedMap[fieldOP.source].push(fieldOP);
            });

            var resultFields = [];

            BI.each(fields, function (index, field) {
                resultFields.push(field);

                var id = field.source || field.id;
                if (BI.isNull(copiedMap[id])) return;

                resultFields = resultFields.concat(copiedMap[id]);
                delete copiedMap[id];
            });
            BI.each(copiedMap, function (idx, map) {
                resultFields = resultFields.concat(map);
            });
            return resultFields;
        },

        calcOriginalFieldType: function (type) {
            switch (type) {
                case BICst.COLUMN.TRANSFORM_FROM_NUMBER:
                    return BICst.COLUMN.NUMBER;
                default:
                    return type;
            }
        },

        isFieldOfWidgetExist: function (wId, fieldId) {
            var fields = this.getFieldsOfWidget(wId);
            var result = BI.find(fields, function (idx, field) {
                return field.id === fieldId;
            });
            return BI.isNotNull(result);
        },

        getFieldStateOfWidget: function (wId, fieldId) {
            if (BI.Utils.isNoAuthField(fieldId)) {
                return BICst.FIELD_STATE.NO_AUTH;
            }
            var fields = this.getFieldsOfWidget(wId);
            var fieldType = BI.Utils.getFieldTypeByIdOfWidget(wId, fieldId);
            var result = BI.find(fields, function (idx, field) {
                BI.each(field.drillDir, function (idx, drill) {
                    if (drill.id === fieldId) {
                        fieldType = drill.type;
                    }
                });
                return field.id === fieldId || field.source === fieldId;
            });
            var validation = true;
            if (BI.isNull(result)) {
                return BICst.FIELD_STATE.FIELD_MISS;
            }

            if (fieldType !== BI.Utils.getFieldTypeByIdOfWidget(wId, fieldId)) {
                return BICst.FIELD_STATE.FIELD_TYPE_ERROR;
            }

            // 复制的指标
            if (result.copied) {
                return this.getFieldStateOfWidget(wId, result.source);
            }

            // 计算指标
            var wType = BI.Utils.getWidgetTypeById(wId);
            // 明细表聚合计算指标标红
            if (result.type === BICst.COLUMN.CALCULATE || result.type === BICst.COLUMN.TRANSFORM_FROM_CALC) {
                if (wType === BICst.DESIGN.WIDGET.DETAIL && BI.Utils.checkFieldIsAgg(wId, fieldId)) {
                    return BICst.FIELD_STATE.AGG_IN_DETAIL;
                }

                var allPossibleIds = [];

                BI.each(BI.Utils.getAllControlWidgetIds(), function (index, wId) {
                    allPossibleIds.push(wId);
                    allPossibleIds.push(wId + "_start");
                    allPossibleIds.push(wId + "_end");
                });

                validation = !BI.any(result.targetIds, function (idx, targetId) {
                    return BI.Utils.getFieldStateOfWidget(wId, targetId) !== BICst.FIELD_STATE.NORMAL && BI.contains(allPossibleIds, targetId);
                });

                return validation ? BICst.FIELD_STATE.NORMAL : BICst.FIELD_STATE.FIELD_MISS;
            }

            validation = BI.Utils.isOriginFieldExist(result.source || result.id);

            return validation ? BICst.FIELD_STATE.NORMAL : BICst.FIELD_STATE.FIELD_MISS;
        },

        getTipTextByFieldState: function (state) {
            var tipText = "";
            switch (state) {
                case BICst.DIMENSION_STATE.FIELD_MISS:
                    tipText = BI.i18nText("BI-Design_Current_Field_Lost");
                    break;
                case BICst.FIELD_STATE.NO_AUTH:
                    return BI.i18nText("BI-Basic_Field_No_Auth");
                case BICst.DIMENSION_STATE.FIELD_TYPE_ERROR:
                    tipText = BI.i18nText("BI-Conf_Field_Type_Changed");
                    break;
                case BICst.DIMENSION_STATE.AGG_IN_DETAIL:
                    tipText = BI.i18nText("BI-Design_Detail_Table_Not_Support_AGG");
                    break;
                case BICst.DIMENSION_STATE.GROUP_TYPE_ERROR:
                    tipText = BI.i18nText("BI-Design_Group_Type_Lost");
                    break;
                default:
                    tipText = "";
            }
            return tipText;
        },

        getAllCalculateFieldsOfWId: function (wId) {
            return BI.filter(BI.Utils.getFieldsOfWidget(wId), function (index, field) {
                return BI.contains([BICst.COLUMN.CALCULATE, BICst.COLUMN.TRANSFORM_FROM_CALC], field.type);
            });
        },

        getRealFormulaByFieldIdOfWId: function (wId, fieldId, map) {
            if (BI.isNull(map)) {
                var allCalculateFields = BI.Utils.getAllCalculateFieldsOfWId(wId);

                map = {};

                BI.each(allCalculateFields, function (index, field) {
                    map[field.id] = field;
                });
            }

            var formula = BI.Utils.getCalculateValueByFieldIdOfWidget(wId, fieldId);

            if (BI.isEmptyString(formula) || BI.isNull(formula)) return;

            var targetIds = BI.Utils.getCalculateTargetIdsByFieldIdOfWidget(wId, fieldId);

            BI.each(targetIds, function (index, tId) {
                if (!BI.Utils.isCalculateField4UseByFieldIdOfWidget(wId, tId)) return;

                var replaceStr = BI.Utils.getRealFormulaByFieldIdOfWId(wId, tId, map);

                formula = formula.replaceAll("\\$\\{.*?\\}", function (targetStr) {
                    var target = targetStr.substring(2, targetStr.length - 1);

                    if (target !== tId) return targetStr;

                    return "(" + replaceStr + ")";
                });
            });

            return formula;
        },

        getFields4CalcTargetValueTextMap: function (wId) {
            var fields = BI.Utils.getFieldsOfWidget(wId);
            var wType = BI.Utils.getWidgetTypeById(wId);

            var map = {};

            BI.each(fields, function (index, field) {
                var type;

                switch (field.type) {
                    case BICst.COLUMN.CALCULATE:
                        type = BICst.COLUMN.NUMBER;
                        break;
                    case BICst.COLUMN.STRING:
                    case BICst.COLUMN.NUMBER:
                    case BICst.COLUMN.DATE:
                        type = field.type;
                        break;
                    default:
                }

                if (BI.isNull(type)) return;

                map[field.id] = {
                    type: type,
                    isAgg: BI.Utils.checkFieldIsAgg(wId, field.id),
                    hasDetailFilter: BI.isNotNull(field[wType === BICst.DESIGN.WIDGET.DETAIL ? "detailFilter" : "filter"])
                };
            });

            BI.each(BI.Utils.getAllWidgetIds(), function (index, widgetId) {
                var widgetType = BI.Utils.getWidgetTypeById(widgetId);
                if (BI.Utils.isIntervalDateWidgetType(widgetType)) {
                    map[widgetId + "_start"] = {
                        type: BICst.COLUMN.DATE,
                        isAgg: false
                    };
                    map[widgetId + "_end"] = {
                        type: BICst.COLUMN.DATE,
                        isAgg: false
                    };
                } else if (BI.Utils.isDateWidgetType(widgetType)) {
                    map[widgetId] = {
                        type: BICst.COLUMN.DATE,
                        isAgg: false
                    };
                }
            });

            return map;
        },

        checkCalTargetValidationByFId: function (wId, fieldId, cb) {
            if (!BI.Utils.isCalculateFieldByFieldIdOfWidget(wId, fieldId)) {
                cb(BICst.FIELD_STATE.NORMAL);

                return;
            }

            BI.Utils.checkCalculationValidation(wId, fieldId, function (state) {
                cb(state);
            });
        },

        checkCalculationValidation: function (wId, fieldId, callback) {
            var map = BI.Utils.getFields4CalcTargetValueTextMap(wId);

            var realFormula = BI.Utils.getRealFormulaByFieldIdOfWId(wId, fieldId);

            var tIds = BI.uniq(realFormula.match(/\$\{.*?\}/g));

            var hasMissedField = BI.some(tIds, function (index, tId) {
                return !BI.has(map, tId.substring(2, tId.length - 1));
            });

            if (hasMissedField) {
                callback(BICst.FIELD_STATE.FIELD_MISS);

                return;
            }

            BI.Func.checkFormulaValidation({
                str: realFormula.replace(/\$\{.*?\}/g, "$a"),
                origin: realFormula,
                fieldsMap: map
            }, function (validate) {
                if (validate) {
                    callback(BICst.FIELD_STATE.NORMAL);

                    return;
                }

                var usedTargetIds = BI.Utils.getCalculateTargetIdsByFieldIdOfWidget(wId, fieldId);

                var iteratorChecker = function (index, valid, cb) {
                    if (valid === false) {
                        cb(valid);
                        return;
                    }

                    if (index === BI.size(usedTargetIds)) {
                        cb(valid);
                        return;
                    }

                    var usedTargetId = usedTargetIds[index];

                    if (!BI.Utils.isCalculateField4UseByFieldIdOfWidget(wId, usedTargetId)) {
                        iteratorChecker(index + 1, valid, cb);

                        return;
                    }

                    var usedTargetFormula = BI.Utils.getRealFormulaByFieldIdOfWId(wId, usedTargetId);

                    BI.Func.checkFormulaValidation({
                        str: usedTargetFormula.replace(/\$\{.*?\}/g, "$a"),
                        origin: usedTargetFormula,
                        fieldsMap: map
                    }, function (valid) {
                        iteratorChecker(index + 1, valid, cb);
                    });
                };

                iteratorChecker(0, true, function (valid) {
                    callback(valid ? BICst.FIELD_STATE.WRONG_FORMULA : BICst.FIELD_STATE.FIELD_MISS);
                });
            });
        },

        isIntervalDateWidgetType: function (widgetType) {
            return BI.contains([BICst.DESIGN.WIDGET.DATE_INTERVAL, BICst.DESIGN.WIDGET.YEAR_MONTH_INTERVAL], widgetType);
        },

        isDateWidgetType: function (widgetType) {
            return BI.contains([BICst.DESIGN.WIDGET.QUARTER, BICst.DESIGN.WIDGET.MONTH, BICst.DESIGN.WIDGET.YEAR,
                BICst.DESIGN.WIDGET.DATE_PANE, BICst.DESIGN.WIDGET.DATE], widgetType);
        },

        exportSingleWidget: function (wId, data, callback) {
            BI.$import(BI.fineServletURL + "/file?path=/com/finebi/web/js/export.min.js&type=plain&parser=plain");
            if (BI.isIE9Below()) {
                BI.Utils.exportFile(BI.ExportExcelURL, data, callback);
            } else {
                var el = $(".bi-fit-widget ." + wId);
                el.removeClass("selected");
                html2canvas(el, {
                    useCORS: true,
                    logging: false,
                    iframeTimeOut: 1500
                }).then(function (canvas) {
                    el.addClass("selected");
                    BI.Utils.exportFile(BI.ExportExcelURL, BI.extend(data, {
                        base64: canvas.toDataURL().replaceAll("data:image/png;base64,", "")
                    }), callback);
                });
            }
        },

        exportFile: function (url, data, cb) {
            var browserExport = !BI.isIE() || !(BI.isIE() && BI.getIEVersion() < 10);
            if (browserExport) {
                BI.downloadProgress(url, data, function () {
                    if (this.status === 200 && this.response !== null) {
                        var contentDisposition = this.getResponseHeader("Content-Disposition");
                        var fileName = contentDisposition && contentDisposition.substring(contentDisposition.indexOf("filename") + 9);
                        fileName = decodeURIComponent(escape(fileName));
                        $.exportSaveAs(this.response, fileName);
                    }
                    cb(false);
                });
                cb(true);
            } else {
                BI.Func.doActionByForm(url, data);
            }
        }
    });
})();
!(function () {
    var Service = BI.inherit(BI.OB, {
        getWidgetMap: function (template) {
            var store = this._initStore(template);
            var result = {};
            BI.each(store.widgets, function (idx, widget) {
                result[widget.wId] = BI.Utils.getWidgetCalculationByID(widget.wId);
            });
            return result;
        },

        _initStore: function (template) {
            console.log("init");
            BI.designData = template;
            BI.designModel = {
                templateStyle: BI.designData.templateStyle,
                widgets: BI.designData.widgets,
                linkageGroup: BI.designData.linkageGroup,
                layoutRatio: BI.designData.layoutRatio || {
                    x: 0,
                    y: 0
                },
                freeLayoutRatio: BI.designData.freeLayoutRatio || {
                    x: 0,
                    y: 0
                },
                reportName: BI.designData.reportName,
                reportId: BI.designData.reportId
            };

            // 是否打开页面时自动查询
            if (BI.Utils.isQueryAutoQueryWhenFresh()) {
                BI.SharingPool.put("controlFilters", BI.Utils.getControlCalculations());
            }

            return BI.designModel;
        }
    });
    BI.service("bi.service.static.calculate", Service);
})();