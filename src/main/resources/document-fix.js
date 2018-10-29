!(function () {
    var oldImage = BI.Img;
    BI.shortcut("bi.old_img", oldImage);
    BI.Img = BI.inherit(BI.Single, {
        _defaultConfig: function () {
            var conf = BI.Img.superclass._defaultConfig.apply(this, arguments);
            return BI.extend(conf, {
                tagName: "img",
                baseCls: (conf.baseCls || "") + " bi-img display-block",
                src: "",
                attributes: {},
                width: "100%",
                height: "100%"
            });
        },

        beforeInit: function (callback) {
            this.setSrc(this.options.src);
            callback();
        },

        render: function () {
            return BI.extend({}, this.options, {
                type: "bi.old_img"
            })
        },

        setSrc: function (src) {
            this.options.src = src;
            this.element.attr("src", src);
        },

        getSrc: function () {
            return this.options.src;
        }
    });

    BI.shortcut("bi.img", BI.Img);
})();
