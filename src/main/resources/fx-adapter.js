NativeCanvasPrototype = {
    set width(v) {
        this.setWidth(v);
    }, get width() {
        return this.getWidth();
    }, set height(v) {
        this.setHeight(v);
    }, get height() {
        return this.getHeight();
    }
};

NativeContextPrototype = {
    createLinearGradient: function (x, y, x2, y2) {
        return new LinearGradient(x, y, x2, y2);
    }, createRadialGradient: function (x, y, r, x2, y2, r2) {
        //在echarts中只有x y 和r2是有效值
        return new RadialGradient(x, y, r2);
    },
    _lineWidth: '',
    set lineWidth(v) {
        this._lineWidth = v;
        this.setLineWidth(v);
    }, get lineWidth() {
        return this._lineWidth;
    },
    _lineCap: '',
    set lineCap(v) {
        this._lineCap = v;
        this.setLineCap(v);
    }, get lineCap() {
        return this._lineCap;
    },
    _lineJoin: '',
    set lineJoin(v) {
        this._lineJoin = v;
        this.setLineJoin(v);
    }, get lineJoin() {
        return this._lineJoin;
    },
    _fillStyle: '',
    set fillStyle(v) {
        this._fillStyle = v;
        this.setFillStyle(v);
    }, get fillStyle() {
        return this._fillStyle;
    },
    _strokeStyle: '',
    set strokeStyle(v) {
        this._strokeStyle = v;
        this.setStrokeStyle(v);
    }, get strokeStyle() {
        return this._strokeStyle;
    },
    _textAlign: '',
    set textAlign(v) {
        this._textAlign = v;
        this.setTextAlign(v);
    }, get textAlign() {
        return this._textAlign;
    },
    _textBaseline: '',
    set textBaseline(v) {
        this._textBaseline = v;
        this.setTextBaseline(v);
    }, get textBaseline() {
        return this._textBaseline;
    },
    _font: '',
    set font(v) {
        this._font = v;
        this.setFont(v);
    }, get font() {
        return this._font;
    },
    _miterLimit: 0,
    set miterLimit(v) {
        this._miterLimit = v;
        this.setMiterLimit(v)
    },
    get miterLimit() {
        return this._miterLimit;
    },
    _globalAlpha: 0,
    set globalAlpha(v) {
        this._globalAlpha = v;
        this.setGlobalAlpha(v);
    },
    get globalAlpha() {
        return this._globalAlpha;
    },
    _globalCompositeOperation : '',
    set globalCompositeOperation(v) {
        this._globalCompositeOperation = v;
        this.setGlobalCompositeOperation(v);
    },
    get globalCompositeOperation() {
        return this._globalCompositeOperation;
    },
    _shadowColor : '',
    set shadowColor(v) {
        this._shadowColor = v;
        this.setShadowColor(v);
    },
    get shadowColor() {
        return this._shadowColor;
    },
    _shadowBlur : '',
    set shadowBlur(v) {
        this._shadowBlur = v;
        this.setShadowBlur(v);
    },
    get shadowBlur() {
        return this._shadowBlur;
    },
    _shadowOffsetX : '',
    set shadowOffsetX(v) {
        this._shadowOffsetX = v;
        this.setShadowOffsetX(v);
    },
    get shadowOffsetX() {
        return this._shadowOffsetX;
    },
    _shadowOffsetY : '',
    set shadowOffsetY(v) {
        this._shadowOffsetY = v;
        this.setShadowOffsetY(v);
    },
    get shadowOffsetY() {
        return this._shadowOffsetY;
    },
    createPattern: function (img, repeat) {
        var type = 'ImagePattern'
        if (img.hasOwnProperty('canvas_id')) {
            type = 'CanvasPattern'
        }
        return {image: img, repeat: repeat, type: type};
    }
    //globalCompositeOperation/shadowBlur/shadowColor/shadowOffsetX/shadowOffsetY
};


NativeImagePrototype = {
    set width(v) {
        this.setWidth(v);
    }, get width() {
        return this.getWidth();
    }, set height(v) {
        this.setHeight(v);
    }, get height() {
        return this.getHeight();
    },
    _src: '',
    set src(v) {
        this._src = v;
        this.setSrc(v);
    }, get src() {
        return this._src;
    },
};

Gradient = function (colorStops) {

    this.colorStops = colorStops || [];

};

Gradient.prototype = {

    constructor: Gradient,

    addColorStop: function (offset, color) {
        this.colorStops.push({

            offset: offset,

            color: color
        });
    }

};
LinearGradient = function (x, y, x2, y2, colorStops, globalCoord) {
    // Should do nothing more in this constructor. Because gradient can be
    // declard by `color: {type: 'linear', colorStops: ...}`, where
    // this constructor will not be called.

    this.x = x == null ? 0 : x;

    this.y = y == null ? 0 : y;

    this.x2 = x2 == null ? 1 : x2;

    this.y2 = y2 == null ? 0 : y2;

    // Can be cloned
    this.type = 'linear';

    Gradient.call(this, colorStops);
};

LinearGradient.prototype = {

    constructor: LinearGradient
};

inherits(LinearGradient, Gradient);

RadialGradient = function (x, y, r) {
    // Should do nothing more in this constructor. Because gradient can be
    // declard by `color: {type: 'radial', colorStops: ...}`, where
    // this constructor will not be called.

    this.x = x == null ? 0.5 : x;

    this.y = y == null ? 0.5 : y;

    this.r = r == null ? 0.5 : r;

    // Can be cloned
    this.type = 'radial';

    Gradient.call(this, null);
};

RadialGradient.prototype = {

    constructor: RadialGradient
};

inherits(RadialGradient, Gradient);

function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;

    function F() {
    }

    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();

    for (var prop in clazzPrototype) {
        clazz.prototype[prop] = clazzPrototype[prop];
    }
    clazz.prototype.constructor = clazz;
    clazz.superClass = baseClazz;
}
