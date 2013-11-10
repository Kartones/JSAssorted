var Game = {};

Game.Entity = function () {
    this._color = undefined;
    this._name = undefined;
    this._strength = undefined;
    this._vitality = undefined;
    this._defense = undefined;
    this._image = undefined;
    this._baseDOMId = undefined;

    this.getName = function () {
        return this._name;
    }
    this.getStrength = function () {
        return this._strength;
    }
    this.getVitality = function () {
        return this._vitality;
    }
    this.setVitality = function (NewVitality) {
        this._vitality = Math.max(0, NewVitality);
    }
    this.getDefense = function () {
        return this._defense;
    }
    this.isDead = function () {
        return this._vitality === 0;
    }
    this.RenderStats = function () {
        document.getElementById(this._baseDOMId + "Str").innerHTML = this._strength;
        document.getElementById(this._baseDOMId + "Def").innerHTML = this._defense;
        document.getElementById(this._baseDOMId + "Vit").innerHTML = this._vitality;
        if (this._vitality === 0) {
            document.getElementById(this._baseDOMId + "Vit").className = "killed";
        }
    }
    this.RenderAvatar = function () {
        var areaDOMItem = document.getElementById(this._baseDOMId + "Area");
        var avatarDOMItem = document.getElementById(this._baseDOMId + "Avatar");

        var avatarImage = document.getElementById(this._baseDOMId + "AvatarImage");

        if (!avatarImage) {
            avatarImage = document.createElement("img");
            avatarImage.id = this._baseDOMId + "AvatarImage";
            avatarImage.src = this._image;

            var that = this;
            function RenderCanvas() {
                window.URL.revokeObjectURL(this.src);
                var avatarCanvas = document.getElementById(that._baseDOMId + "Canvas");
                avatarCanvas.width = this.width;
                avatarCanvas.height = this.height;
                var canvasContext = avatarCanvas.getContext('2d');
                canvasContext.drawImage(this, 0, 0);

                // Recoloring
                var contents = canvasContext.getImageData(0, 0, avatarCanvas.width, avatarCanvas.height);
                var imageData = contents.data;
                var brightnessFactor = 1.6;
                var red, green, blue;
                for (var y = 0; y < avatarCanvas.height; y++) {
                    for (var x = 0; x < avatarCanvas.width; x++) {
                        red = imageData[((avatarCanvas.width * y) + x) * 4];
                        green = imageData[((avatarCanvas.width * y) + x) * 4 + 1];
                        blue = imageData[((avatarCanvas.width * y) + x) * 4 + 2];
                        // if alpha is not transparent...
                        if (imageData[((avatarCanvas.width * y) + x) * 4 + 3] > 0) {
                            imageData[((avatarCanvas.width * y) + x) * 4] = (red / 255) * that._color[0] * brightnessFactor;
                            imageData[((avatarCanvas.width * y) + x) * 4 + 1] = (green / 255) * that._color[1] * brightnessFactor;
                            imageData[((avatarCanvas.width * y) + x) * 4 + 2] = (blue / 255) * that._color[2] * brightnessFactor;
                        }
                    }
                }
                canvasContext.putImageData(contents, 0, 0);

                avatarDOMItem.removeChild(this);
                avatarDOMItem.style.width = 128;
                avatarDOMItem.style.height = 128;

                // All ready, show
                areaDOMItem.className = "playerCard";
                document.getElementById("ActionsArea").className = "actions";
            }

            avatarImage.onload = RenderCanvas;
            avatarDOMItem.appendChild(avatarImage);
        }
    }
};

Game.Player = function () {
    Game.Entity.apply(this, arguments);

    this.PopulateFromHash = function (Hash) {
        this._color = [
                        parseInt(Hash.substr(0, 2), 16),
                        parseInt(Hash.substr(2, 2), 16),
                        parseInt(Hash.substr(4, 2), 16)
                      ];

        var tempValue1 = parseInt(Hash.substr(6, 2), 16);
        var tempValue2 = parseInt(Hash.substr(8, 2), 16);
        // Strength always lower than vitality to not kill in one hit
        this._strength = Math.min(tempValue1, tempValue2);
        this._vitality = Math.max(tempValue1, tempValue2) * 2;

        tempValue1 = parseInt(Hash.substr(10, 2), 16);
        // Defense always <= than strength to not have too much defense
        this._defense = Math.min(tempValue1, this._strength);

        this._image = "player.png";
        this._baseDOMId = "Player1";
        this._name = "Player";
    };
};
Game.Player.prototype = new Game.Entity();

Game.Monster = function () {
    Game.Entity.apply(this, arguments);

    this.PopulateFromPlayer = function (PlayerEntity) {
        // >1 harder
        var difficulty = 1.5;

        this._color = [
                        Math.floor((Math.random() * 255) + 0),
                        Math.floor((Math.random() * 255) + 0),
                        Math.floor((Math.random() * 255) + 0)
                      ];

        // Always based on player stats
        this._strength = Math.floor((Math.random() * (PlayerEntity.getStrength() * difficulty)) + 1);
        this._vitality = Math.floor((Math.random() * (PlayerEntity.getVitality() * difficulty)) + 1);
        this._defense = Math.floor((Math.random() * (PlayerEntity.getDefense() * difficulty)) + 1);

        this._image = "monster.png";
        this._baseDOMId = "Player2";
        this._name = "Monster";
    };
};
Game.Monster.prototype = new Game.Entity();

// Non-global instances
Game.Data = {
    Player1: undefined,
    Player2: undefined
};

Game.Engine = {

    States: {
        Playing: 1,
        Ended: 2
    },

    Actions: {
        Attack: 1,
        SuperAttack: 2,
        Heal: 3
    },

    State: undefined,

    Init: function () {
        window.URL = window.URL || window.webkitURL;

        document.getElementById("fileSelect").addEventListener("click", function (e) {
            document.getElementById("fileElem").click();
            e.preventDefault();
        }, false);

        document.getElementById("attackAction").addEventListener("click", function (e) {
            Game.Engine.ProcessAction(Game.Engine.Actions.Attack, Game.Data.Player1, Game.Data.Player2);
            e.preventDefault();
        }, false);
        document.getElementById("superAttackAction").addEventListener("click", function (e) {
            Game.Engine.ProcessAction(Game.Engine.Actions.SuperAttack, Game.Data.Player1, Game.Data.Player2);
            e.preventDefault();
        }, false);
        document.getElementById("healAction").addEventListener("click", function (e) {
            Game.Engine.ProcessAction(Game.Engine.Actions.Heal, Game.Data.Player1, Game.Data.Player2);
            e.preventDefault();
        }, false);
    },

    ProcessAction: function (Action, Actor, Subject) {
        if (Game.Engine.State === Game.Engine.States.Playing) {
            switch (Action) {
                case Game.Engine.Actions.Attack:
                    Game.Engine.ProcessActionAttack(Actor, Subject);
                    break;
                case Game.Engine.Actions.SuperAttack:
                    Game.Engine.ProcessActionSuperAttack(Actor, Subject);
                    break;
                case Game.Engine.Actions.Heal:
                    Game.Engine.ProcessActionHeal(Actor);
                    break;
            }
            // Update
            Actor.RenderStats();
            Subject.RenderStats();
            if (Actor.isDead() || Subject.isDead()) {
                Game.Engine.State = Game.Engine.States.Ended;
            } else {
                // AI turn, so invert actor & subject
                Game.Engine.ProcessAI(Subject, Actor);
            }

            if (Actor.isDead() || Subject.isDead()) {
                Game.Engine.State = Game.Engine.States.Ended;
                Game.Engine.LogLine(
                    (Actor.isDead() ? Actor.getName() : Subject.getName()) + " has been killed!"
                );
            }
        }
    },

    ProcessAI: function (Actor, Subject) {
        var action = Math.floor((Math.random() * 10) + 1);

        switch (action) {
            // 10% chance       
            case 1:
                Game.Engine.ProcessActionHeal(Actor);
                break;
            // 20% chance       
            case 2:
            case 3:
                Game.Engine.ProcessActionSuperAttack(Actor, Subject);
                break;
            // 70% chance       
            default:
                Game.Engine.ProcessActionAttack(Actor, Subject);
                break;
        }

        // Update again
        Actor.RenderStats();
        Subject.RenderStats();
    },

    ProcessActionAttack: function (Actor, Subject) {
        var damage = Math.max(1, Actor.getStrength() - Subject.getDefense());
        Subject.setVitality(Subject.getVitality() - damage);

        Game.Engine.LogLine(
            Actor.getName() + " attacked " + Subject.getName() + " for " + damage + " damage."
        );
    },

    ProcessActionSuperAttack: function (Actor, Subject) {
        var damage = Math.max(3, Actor.getStrength() * 3 - Subject.getDefense());
        Subject.setVitality(Subject.getVitality() - damage);
        Actor.setVitality(Actor.getVitality() - Actor.getStrength());

        Game.Engine.LogLine(
            Actor.getName() + " super-attacked " + Subject.getName() + " for " + damage + " damage."
        );
    },

    ProcessActionHeal: function (Actor) {
        var healPoints = Actor.getDefense();
        Actor.setVitality(Actor.getVitality() + healPoints);

        Game.Engine.LogLine(
            Actor.getName() + " healed " + healPoints + " life."
        );
    },

    LogLine: function (Content) {
        var logItems = document.getElementsByClassName("logLine");

        if (logItems[0].className === "logLine") {
            logItems[0].innerHTML = Content;
            logItems[0].className = "logLine lastLog";
            logItems[1].className = "logLine";
        } else {
            logItems[1].innerHTML = Content;
            logItems[0].className = "logLine";
            logItems[1].className = "logLine lastLog";
        }
    },

    ProcessBarcode: function (inputFiles) {
        // Grab 1st file
        if (inputFiles.length) {
            var img = document.getElementById("barcodeImage");
            var firstTime = !img;
            if (firstTime) {
                img = document.createElement("img");
                img.id = "barcodeImage";
                Game.Debug.SetLoadedBarcodeImage(img);
            }
            img.src = window.URL.createObjectURL(inputFiles[0]);
            img.onload = function (e) {
                window.URL.revokeObjectURL(this.src);

                // Loaded, now process
                var barcodeValue = Game.Helpers.BarcodeReader.GetBarcodeFromImage("barcodeImage");
                var md5Hash = Game.Helpers.MD5.Hash(barcodeValue);

                if (Game.Debug.IsEnabled()) {
                    Game.Debug.SetBarcodeNumber(barcodeValue);
                    Game.Debug.SetBarcodeMD5(md5Hash);
                    Game.Debug.UpdateDebugPanel();
                } else {
                    this.parentNode.removeChild(this);
                }

                var uploadArea = document.getElementById("uploadArea");
                uploadArea.parentNode.removeChild(uploadArea);

                Game.Engine.CreatePlayers(md5Hash);
            }
        }
    },

    CreatePlayers: function (MD5Hash) {
        Game.Data.Player1 = new Game.Player();
        Game.Data.Player1.PopulateFromHash(MD5Hash);
        Game.Data.Player2 = new Game.Monster();
        Game.Data.Player2.PopulateFromPlayer(Game.Data.Player1);

        Game.Data.Player1.RenderAvatar();
        Game.Data.Player1.RenderStats();
        Game.Data.Player2.RenderAvatar();
        Game.Data.Player2.RenderStats();

        Game.Engine.State = Game.Engine.States.Playing;
    }
};

// No longer used
Game.Debug = {
    _enabled: false,
    _barcodeNumber: undefined,
    _barcodeMD5: undefined,

    Enable: function () {
        this._enabled = true;
        document.getElementById("debugPanel").className = "";
    },

    IsEnabled: function () {
        return this._enabled;
    },

    GetBarcodeNumber: function () {
        return this._barcodeNumber;
    },

    SetBarcodeNumber: function (NewValue) {
        this._barcodeNumber = NewValue;
    },

    GetBarcodeMD5: function () {
        return this._barcodeMD5;
    },

    SetBarcodeMD5: function (NewValue) {
        this._barcodeMD5 = NewValue;
    },

    SetLoadedBarcodeImage: function(ImageDOMItem) {
        document.getElementById("debugPanel").appendChild(ImageDOMItem);
    },

    UpdateDebugPanel: function () {
        document.getElementById("barcodeValue").innerHTML = this._barcodeNumber;
        document.getElementById("md5Value").innerHTML = this._barcodeMD5;
    }
};

Game.Helpers = {};

Game.Helpers.BarcodeReader = {
    /*
    *    Copyright (c) 2010 Tobias Schneider
    *    https://gist.github.com/421369
    *    This script is freely distributable under the terms of the MIT license.
    */
    GetBarcodeFromImage: function (imgOrId) {
        var doc = document,
            img = "object" == typeof imgOrId ? imgOrId : doc.getElementById(imgOrId),
            canvas = doc.createElement("canvas"),
            width = img.width,
            height = img.height,
            ctx = canvas.getContext("2d"),
            spoints = [1, 9, 2, 8, 3, 7, 4, 6, 5],
            numLines = spoints.length,
            slineStep = height / (numLines + 1),
            round = Math.round;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);
        while (numLines--) {
            var pxLine = ctx.getImageData(0, slineStep * spoints[numLines], width, 2).data,
                sum = [],
                min = 0,
                max = 0;
            for (var row = 0; row < 2; row++) {
                for (var col = 0; col < width; col++) {
                    var i = ((row * width) + col) * 4,
                        g = ((pxLine[i] * 3) + (pxLine[i + 1] * 4) + (pxLine[i + 2] * 2)) / 9,
                        s = sum[col];
                    pxLine[i] = pxLine[i + 1] = pxLine[i + 2] = g;
                    sum[col] = g + (undefined == s ? 0 : s);
                }
            }
            for (var i = 0; i < width; i++) {
                var s = sum[i] = sum[i] / 2;
                if (s < min) { min = s; }
                if (s > max) { max = s; }
            }
            var pivot = min + ((max - min) / 2),
                bmp = [];
            for (var col = 0; col < width; col++) {
                var matches = 0;
                for (var row = 0; row < 2; row++) {
                    if (pxLine[((row * width) + col) * 4] > pivot) { matches++; }
                }
                bmp.push(matches > 1);
            }
            var curr = bmp[0],
                count = 1,
                lines = [];
            for (var col = 0; col < width; col++) {
                if (bmp[col] == curr) { count++; }
                else {
                    lines.push(count);
                    count = 1;
                    curr = bmp[col];
                }
            }
            var code = '',
                bar = ~ ~((lines[1] + lines[2] + lines[3]) / 3),
            /* UPC set */
                u = {
                    "3211": '0',
                    "2221": '1',
                    "2122": '2',
                    "1411": '3',
                    "1132": '4',
                    "1231": '5',
                    "1114": '6',
                    "1312": '7',
                    "1213": '8',
                    "3112": '9'
                };
            for (var i = 1, l = lines.length; i < l; i++) {
                if (code.length < 6) { var group = lines.slice(i * 4, (i * 4) + 4); }
                else { var group = lines.slice((i * 4) + 5, (i * 4) + 9); }
                var digits = [
                    round(group[0] / bar),
                    round(group[1] / bar),
                    round(group[2] / bar),
                    round(group[3] / bar)
                ];
                code += u[digits.join('')] || u[digits.reverse().join('')] || 'X';
                if (12 == code.length) { return code; break; }
            }
            if (-1 == code.indexOf('X')) { return code || false; }
        }
        return false;
    }
};

Game.Helpers.MD5 = {
    /*
    *  MD5 (Message-Digest Algorithm)
    *  http://www.webtoolkit.info/
    */
    Hash: function (string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) { return (x & y) | ((~x) & z); }
        function G(x, y, z) { return (x & z) | (y & (~z)); }
        function H(x, y, z) { return (x ^ y ^ z); }
        function I(x, y, z) { return (y ^ (x | (~z))); }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a; BB = b; CC = c; DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    }
};