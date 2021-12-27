var SAFN = {
    Prefix: '@.',
    CoreData: "",
    FunctionBody: "",
    Element: "",
    IfStatementBody: {},
    AsyncData: {},
    MapList: {
        'error': 'Error',
        'map': 'Map',
        'set': 'Set',
        'setvalue': 'SetValue',
        'settext': 'SetText',
        'get': 'Get',
        'setparamurl': 'SetParamUrl',
        'getparamurl': 'GetParamUrl',
        'alert': 'Alert',
        'alertdata': 'AlertData',
        'break': 'Break',
        'console': 'Concole',
        'consoledata': 'ConcoleData',
        'deletekey': 'DeleteKey',
        'callapi': 'CallApi',
        "if": "If",
        'sum': 'Sum',
        'inc': 'Inc',
        'dec': 'Dec',
        'concat': 'Concat',
        'callfn': 'CallFn',
        'ifhasvalue': "IfHasValue",
        'ifhasnotvalue': "IfHasNotValue",
        'show': 'Show',
        'hide': 'Hide',
        'click': 'Click',
        'change': 'Change',
        'focus': 'Focus',
        'showmessage': 'ShowMessage',
        'showerror': 'ShowError',
        'settable': 'SetTable',
        'settableobject': 'SetTableObject',
        'gettable': 'GetTable',
        'fortable': 'ForTable',
        'forlist': 'ForList',
        'clear': 'Clear',
        'clearclass': 'ClearClass',
        'showparam': 'ShowParam',
        'hideparam': 'HideParam',
        'visible': 'Visible',
        'unvisible': 'Unvisible',
        'visibleparam': 'VisibleParam',
        'unvisibleparam': 'UnvisibleParam',
        'sendemail': 'SendEmail',
        'abs': 'Abs',
        'throwerror': 'ThrowError',
        'addclass': 'AddClass',
        'removeclass': 'RemoveClass',
        'addcss': 'AddCss',
        'removecss': 'RemoveCss',
        'addattribute': 'AddAttribute',
        'removeattribute': 'RemoveAttribute',
        'showform': 'ShowForm',
        'getcurrentuserid': "GetCurrentUserId",
        'setbackendcache': "SetBackendCache",
        'setlocalcache': "SetLocalCache",
        'setdata': "SetData",
        'copytable': 'CopyTable',
        'maptotable': 'MapToTable'

    },
    IsCommand: function (fnName) {
        fnName = fnName.trim();
        var f = false;
        try {
            f = (fnName.trim().startsWith(SAFN.Prefix));
        } catch (err) {
        }
        return f;
    },
    Function_Body_Statement_Number_of_Open_Paranteth(functionBody, lastIndex) {
        var zadBody = functionBody.substr(0, lastIndex);
        var ls = zadBody.split('{').length - 1;
        ls = (ls < 0) ? 0 : ls;
        return ls;
    },
    Function_Body_Statement_Number_of_Close_Paranteth(functionBody, lastIndex) {
        var zadBody = functionBody.substr(0, lastIndex);
        var ls = zadBody.split('}').length - 1;
        ls = (ls < 0) ? 0 : ls;
        return ls;
    },
    Function_If_Body_Statement_Replacement: function (functionBody) {
        functionBody = functionBody.replace(/\t/g, '');
        functionBody = functionBody.replace(/\r/g, '');
        functionBody = functionBody.replace(/<br>/g, '');
        functionBody = functionBody.replace(/\n/g, '');
        functionBody = functionBody.trim();

        while (functionBody.includes('@.if')) {

            var startIndex = functionBody.indexOf('@.if');

            var rcOpenParanteth = SAFN.Function_Body_Statement_Number_of_Open_Paranteth(functionBody, startIndex);
            var rcCloseParanteth = SAFN.Function_Body_Statement_Number_of_Close_Paranteth(functionBody, startIndex);

            if (rcOpenParanteth !== rcCloseParanteth) {
                functionBody = functionBody.substr(0, startIndex) + '__IFTMP__'
                        + functionBody.substr(startIndex + 4, functionBody.length);
                continue;
            }

            var startIndexOfParan = functionBody.indexOf('{', startIndex);
            var lastIndexOfParan = getFnBodyZadPush(functionBody, startIndexOfParan);

            var zadBody = functionBody.substr(startIndex, (lastIndexOfParan - startIndex));
            var idGen = '__IF__' + makeId(6);
            SAFN.IfStatementBody[idGen] = zadBody;

            functionBody = functionBody.substr(0, startIndex) + idGen + ';'
                    + functionBody.substr(lastIndexOfParan, functionBody.length);
        }
        functionBody = functionBody.replace(/__IFTMP__/g, '@.if');
        return functionBody;
    },
    Function_For_Body_Statement_Replacement: function (functionBody) {

        functionBody = functionBody.replace(/\t/g, '');
        functionBody = functionBody.replace(/\r/g, '');
        functionBody = functionBody.replace(/<br>/g, '');
        functionBody = functionBody.replace(/\n/g, '');
        functionBody = functionBody.trim();

        while (functionBody.includes('@.for')) {

            var startIndex = functionBody.indexOf('@.for');

            var rcOpenParanteth = SAFN.Function_Body_Statement_Number_of_Open_Paranteth(functionBody, startIndex);
            var rcCloseParanteth = SAFN.Function_Body_Statement_Number_of_Close_Paranteth(functionBody, startIndex);

            if (rcOpenParanteth !== rcCloseParanteth) {
                functionBody = functionBody.substr(0, startIndex) + '__FORTMP__'
                        + functionBody.substr(startIndex + 5, functionBody.length);
                continue;
            }

            var startIndexOfParan = functionBody.indexOf('{', startIndex);
            var lastIndexOfParan = getFnBodyZadPush(functionBody, startIndexOfParan);

            var zadBody = functionBody.substr(startIndex, (lastIndexOfParan - startIndex));
            var idGen = '__FORLIST__' + makeId(6);
            SAFN.IfStatementBody[idGen] = zadBody;

            functionBody = functionBody.substr(0, startIndex) + idGen + ';'
                    + functionBody.substr(lastIndexOfParan, functionBody.length);
        }
        functionBody = functionBody.replace(/__FORTMP__/g, '@.for');
        return functionBody;
    },
    IsCommandIf: function (fnName) {
        var f = false;
        try {
            f = (fnName.trim().toLowerCase().startsWith('@.if'));
        } catch (err) {
        }
        return f;
    },
    IsCommandFor: function (fnName) {
        var f = false;
        try {
            f = (fnName.trim().toLowerCase().startsWith('@.for'));
        } catch (err) {
        }
        return f;
    },
    IsCommandCallApi: function (fnName) {
        var f = false;
        try {
            f = (fnName.trim().toLowerCase().startsWith('@.callapi'));
        } catch (err) {
        }
        return f;
    },

    GetCommandArgument: function (description) {
        var argLine = "";
        try {
            argLine = (description && description !== 'undefined') ? description.split("(")[1].split(')')[0] : '';
        } catch (err) {
        }
        return argLine;
    },
    GetFunctionBody: function (description) {
        var argLine = "";
        try {

            var startIndex = description.indexOf("{");
            var lastIndex = description.lastIndexOf('}');
            var cmd = description.substr(startIndex + 1, (lastIndex - startIndex - 1));
            argLine = (description && description !== 'undefined') ? cmd : '';
        } catch (err) {
        }
        return argLine;
    },
    GetFunctionNameLine: function (description) {
        var res = "";
        try {
            res = description.split("(")[0];
            res = res.replace(/ /g, '');
        } catch (err) {
        }
        return res;
    },
    ExecCommand: function (description, outData, element, asyncData, apiId) {

        //      description = description.trim().replace(/ /g, '');
        SAFN.FunctionBody = SAFN.GetFunctionBody(description);
        SAFN.Element = element;
        SAFN.AsyncData = asyncData;
        SAFN.ApiId = apiId;

        var callDesc = description;

        description = description.trim();
        description = description.trim().replace(SAFN.Prefix, '');
        description = description.toLowerCase();

        var mapperLine = description.split("(")[0];
        mapperLine = mapperLine.trim().replace(/\n/g, '');
        mapperLine = mapperLine.replace(/ /g, '');


        var mapper = SAFN.MapList[mapperLine];
        var argLine = [];
        argLine = SAFN.GetCommandArgument(callDesc);

        var fnName = 'SAFN.Functions.' + mapper;
        SAFN.CoreData = outData;

        var res = {};


//        try {
        if (argLine.length === 0) {
            res = eval(fnName)();
        } else {
            var argLineList = argLine.split(",");
            if (argLineList.length === 1) {
                res = eval(fnName)(argLine);
            } else if (argLineList.length > 1) {
                res = eval(fnName).apply(null, argLineList);
            }
        }
//        } catch (err) {
//        }



        var out = $.extend(outData, res);
        outData = out;
        return outData;

    },
    GetArgumentValue: function (valueCore, isTrimmed) {
        valueCore = valueCore.trim();

        var data = SAFN.CoreData;

        var val = "";
        if (valueCore.startsWith("'") && valueCore.endsWith("'")) {
            val = valueCore.substring(1, valueCore.length - 1);
        } else if (valueCore.startsWith('"') && valueCore.endsWith('"')) {
            val = valueCore.substring(1, valueCore.length - 1)
        } else {
            var dataValue = String(data[valueCore]);
            if ((dataValue)) {
                val = dataValue;
            }
        }



        try {
            val = (isTrimmed) ? val.trim() : val;
        } catch (err) {
        }
        return val;
    },

    GetArgumentPureValue: function (valueCore) {
        var val = valueCore;
        try {
            valueCore = valueCore.trim();


            val = (valueCore.startsWith("'") && valueCore.endsWith("'"))
                    ? valueCore.substring(1, valueCore.length - 1)
                    : valueCore.startsWith('"') && valueCore.endsWith('"')
                    ? valueCore.substring(1, valueCore.length - 1)
                    : valueCore;

            val = val.trim();
        } catch (err) {
        }
        return val;
    },

    ConvertFunctions: {
        CoreJS: function (fnName, outData, element, apiId, asyncData) {
            var res = eval(fnName)(outData, element, apiId, asyncData);
            try {
                if (res._table) {
                    var mergeData = mergeTableData(res._table, outData._table);
                    res._table = mergeData;
                }
            } catch (err) {
            }

            var out = $.extend(outData, res);
            outData = out;
            return outData;

        },
        Java: function (fnName, outData, element, apiId, asyncData) {
            var dataCore = {kv: {}};
            dataCore.kv = outData;
            try {
                dataCore.kv.cookie = getToken();
            } catch (err) {
            }


            var resTemp = be.ExecAPI.CallBackendApiService(fnName, dataCore);
            var res = resTemp.kv;

            try {
                if (resTemp.tbl[0].r && resTemp.tbl[0].r.length > 0) {
                    res._table = resTemp.tbl[0];
                }
            } catch (err) {
            }

            try {
                if (res._table) {
                    var mergeData = mergeTableData(res._table, outData._table);
                    res._table = mergeData;
                }
            } catch (err) {
            }
            var out = $.extend(outData, res);
            outData = out;
            return outData;
        },
        SQL: function (fnId, outData, element, apiId, asyncData) {
            var dataCore = {kv: {}};
            dataCore.kv = outData;
            try {
                dataCore.kv.cookie = getToken();
            } catch (err) {
            }


            var resTemp = be.ExecAPI.CallBackendApiServiceForSql(fnId, dataCore);
            var res = resTemp.kv;

            try {
                if (resTemp.tbl[0].r && resTemp.tbl[0].r.length > 0) {
                    res._table = resTemp.tbl[0];
                }
            } catch (err) {
            }

            try {
                if (res._table) {
                    var mergeData = mergeTableData(res._table, outData._table);
                    res._table = mergeData;
                }
            } catch (err) {
            }
            var out = $.extend(outData, res);
            outData = out;
            return outData;
        },
        ApiCall: function (fkRelatedApiId, outData, element, apiId, asyncData) {
            try {
                var backlogName = SACore.Backlogs[fkRelatedApiId]['backlogName'];
            } catch (err) {
            }
            var res = be.callApi(fkRelatedApiId, outData, element, asyncData);
            try {
                if (res._table) {
                    var mergeData = mergeTableData(res._table, outData._table);
                    res._table = mergeData;
                }
            } catch (err) {
            }
            var out = $.extend(outData, res);
            outData = out;
            return outData;
        },
    },
    Function_If_Body_Statement: function () {
        var data = SAFN.CoreData;
        var element = SAFN.Element;
        var asyncData = SAFN.AsyncData;

        var outData = {};

        var body = SAFN.FunctionBody;

        body = SAFN.Function_If_Body_Statement_Replacement(body);
        body = SAFN.Function_For_Body_Statement_Replacement(body);
        var commands = body.split(";");

        for (var i = 0; i < commands.length; i++) {
            var cmd = commands[i];

            if (cmd.length <= 3) {
                continue;
            }

            if (cmd.startsWith("__IF__")) {
                cmd = SAFN.IfStatementBody[cmd];
            } else if (cmd.startsWith("__FORLIST__")) {
                cmd = SAFN.IfStatementBody[cmd];
            }

            var res = SAFN.ExecCommand(cmd, data, element, asyncData, SAFN.ApiId);
            var out = $.extend(outData, res);
            outData = out;

        }

        return outData;

    },
    Function_For_Body_Statement: function () {
        var data = SAFN.CoreData;
        var element = SAFN.Element;
        var asyncData = SAFN.AsyncData;

        var outData = {};

        var body = SAFN.FunctionBody;
        body = SAFN.Function_If_Body_Statement_Replacement(body);
        body = SAFN.Function_For_Body_Statement_Replacement(body);
        var commands = body.split(";");

        for (var i = 0; i < commands.length; i++) {
            var cmd = commands[i];

            if (cmd.length <= 3) {
                continue;
            }

            if (cmd.startsWith("__IF__")) {
                cmd = SAFN.IfStatementBody[cmd];
            } else if (cmd.startsWith("__FORLIST__")) {
                cmd = SAFN.IfStatementBody[cmd];
            }

            var res = SAFN.ExecCommand(cmd, data, element, asyncData, SAFN.ApiId);
            var out = $.extend(outData, res);
            outData = out;

        }

        return outData;

    },
    Functions: {
        Map: function (sourceKey, destinationKey) {
            sourceKey = SAFN.GetArgumentPureValue(sourceKey);
            destinationKey = SAFN.GetArgumentPureValue(destinationKey);

            var data = SAFN.CoreData;
            var val = data[destinationKey];
            val = (val) ? val : "";
            data[sourceKey] = val;
            return data;
        },
        Sum: function () {
            var out = 0;
            var outData = {};
            for (var i = 1; i < arguments.length; i++) {
                var val = arguments[i];
                val = val.trim();
                val = SAFN.GetArgumentValue(val);
                out += (val) ? parseFloat(val) : 0;
            }
            outData[arguments[0].trim()] = String(out);
            return outData;
        },
        Inc: function () {
            var out = 1;
            var outData = {};
            for (var i = 1; i < arguments.length; i++) {
                var val = arguments[i];
                val = SAFN.GetArgumentValue(val);
                out *= (val) ? parseFloat(val) : 1;
            }
            outData[arguments[0]] = String(out);
            return outData;
        },
        Dec: function () {
            if (arguments.length < 3) {
                return 1;
            }

            var out = arguments[1];
            out = SAFN.GetArgumentValue(out);
            var outData = {};
            for (var i = 2; i < arguments.length; i++) {
                var val = arguments[i];
                val = SAFN.GetArgumentValue(val);
                out = out / parseFloat(val);
            }
            outData[arguments[0]] = String(out);
            return outData;
        },
        ShowForm: function (key) {
            key = SAFN.GetArgumentValue(key);
            var element = SAFN.Element;
            var apiId = SAFN.ApiId;
//            if ($(element).attr("onclick_trigger_id") === apiId) {
            $(element).removeAttr("onclick_trigger_id");
//            }

            new UserStory().setGUIComponentButtonGUIModal(key, element);
        },
        Concat: function () {
            var out = '';
            var outData = {};
            for (var i = 1; i < arguments.length; i++) {
                var val = arguments[i];
                val = SAFN.GetArgumentValue(val, false);
                out += val;
            }
            outData[arguments[0]] = out;
            return outData;
        },
        Set: function (key, value) {
            value = SAFN.GetArgumentPureValue(value);
            key = SAFN.GetArgumentPureValue(key);

            var data = SAFN.CoreData;
            data[key] = value;
            return data;
        },
        SetData: function (key) {
            key = SAFN.GetArgumentPureValue(key);
            var data = SAFN.CoreData;
            data[key] = JSON.stringify(data);
            return data;
        },
        RemoveAttribute: function (key) {
            var data = SAFN.CoreData;
            var element = SAFN.Element;


            key = SAFN.GetArgumentPureValue(key);

            $(element).removeAttr(key);

            return data;
        },

        AddAttribute: function (key, value) {
            var data = SAFN.CoreData;
            var element = SAFN.Element;


            value = SAFN.GetArgumentValue(value);
            key = SAFN.GetArgumentPureValue(key);

            $(element).attr(key, value);

            return data;
        },
        RemoveClass: function (key) {

            var data = SAFN.CoreData;
            var element = SAFN.Element;

            key = SAFN.GetArgumentPureValue(key);

            $(element).removeClass(key);

            return data;
        },
        AddClass: function (key) {
            var data = SAFN.CoreData;
            var element = SAFN.Element;

            key = SAFN.GetArgumentPureValue(key);

            $(element).addClass(key);

            return data;
        },
        removeCss: function (key) {
            var data = SAFN.CoreData;
            var element = SAFN.Element;

            key = SAFN.GetArgumentPureValue(key);
            $(element).css(key, '');

            return data;
        },
        AddCss: function (key, value) {
            var data = SAFN.CoreData;
            var element = SAFN.Element;


            value = SAFN.GetArgumentValue(value);
            key = SAFN.GetArgumentPureValue(key);

            $(element).css(key, value);

            return data;
        },
        Abs: function (key, value) {
            try {
                key = SAFN.GetArgumentPureValue(key);
                value = SAFN.GetArgumentPureValue(value);

                var data = SAFN.CoreData;
                var vlt = data[key];
                var yuvarlanancaq_step = Math.pow(10, value);
                var val = Math.round(vlt * yuvarlanancaq_step) / yuvarlanancaq_step;
                data[key] = String(val);
                return data;
            } catch (err) {
            }
        },
        GetCurrentUserId: function (key) {
            try {
                key = SAFN.GetArgumentPureValue(key);
                var data = SAFN.CoreData;
                data[key] = String(global_var.current_ticker_id);
                return data;
            } catch (err) {
            }
        },
        Error: function (errCode, value) {
            value = SAFN.GetArgumentPureValue(value);
            errCode = SAFN.GetArgumentPureValue(errCode);

            var data = SAFN.CoreData;

            var err = [];

            var kv = {};
            kv.code = errCode;
            kv.val = value;
            err.push(kv);

            data.err = err;

            return data;
        },

        SetValue: function (className, value) {
            className = SAFN.GetArgumentPureValue(className);
            value = SAFN.GetArgumentValue(value);
            className = className.trim();
            $('.' + className).val(value);

            return {};
        },
        SetText: function (className, value) {
            className = SAFN.GetArgumentPureValue(className);
            value = SAFN.GetArgumentValue(value);
            className = className.trim();
            $('.' + className).text(value);

            return {};
        },

        Get: function (key, value) {
            value = SAFN.GetArgumentPureValue(value);
            key = SAFN.GetArgumentPureValue(key);


            var data = SAFN.CoreData;
            data[value] = data[key];
            return data;
        },
        SetParamUrl: function (key, value) {
            value = SAFN.GetArgumentValue(value);
            key = SAFN.GetArgumentPureValue(key);

            Utility.addParamToUrl(key, value);
        },
        GetParamUrl: function (key, variable) {
            variable = SAFN.GetArgumentValue(variable);
            key = SAFN.GetArgumentPureValue(key);
            var data = SAFN.CoreData;
            data[key] = Utility.getParamFromUrl(variable);
            return data;
        },
        Alert: function (key) {
            key = SAFN.GetArgumentPureValue(key);
            var data = SAFN.CoreData;
            var value = data[key];
            alert(value);
        },
        AlertData: function () {
            var data = SAFN.CoreData;
            var zadData = JSON.stringify(data);
            alert(zadData);
        },
        Break: function () {

            throw "Break point handled!";
        },
        Console: function (arg) {
            var data = SAFN.CoreData;
            var value = data[arg];
            console.log(value);
        },
        ConsoleData: function () {
            var data = SAFN.CoreData;
            console.log(JSON.stringify(data));
        },
        DeleteKey: function (key) {
            key = SAFN.GetArgumentPureValue(key);

            var data = SAFN.CoreData;
            delete data[key];
        },
        Show: function (className) {
            className = SAFN.GetArgumentPureValue(className);

            $('.' + className).show();
        },
        Visible: function (className) {
            className = SAFN.GetArgumentPureValue(className);
            $('.' + className).css('visibility', 'visible');
        },
        Unvisible: function (className) {
            className = SAFN.GetArgumentPureValue(className);
            $('.' + className).css('visibility', 'hidden');
        },
        VisibleParam: function (key) {

            key = SAFN.GetArgumentPureValue(key);
            $("[sa-selectedfield^='" + key + "']").each(function () {

                var selectedFields = $(this).attr('sa-selectedfield').split(',');
                for (var i in selectedFields) {
                    var field = selectedFields[i].trim();
                    if (field.length > 0 && selectedFields.includes(field)) {
                        $(this).css('visibility', 'visible');
                    }
                }
            });


        },
        UnvisibleParam: function (key) {
            key = SAFN.GetArgumentPureValue(key);
            $("[sa-selectedfield^='" + key + "']").each(function () {

                var selectedFields = $(this).attr('sa-selectedfield').split(',');
                for (var i in selectedFields) {
                    var field = selectedFields[i].trim();
                    if (field.length > 0 && selectedFields.includes(field)) {
                        $(this).css('visibility', 'hidden');
                    }
                }
            });
        },
        Hide: function (className) {
            className = SAFN.GetArgumentPureValue(className);
            $('.' + className).hide();
        },
        Click: function (className) {
            className = SAFN.GetArgumentPureValue(className);
            $('.' + className).click();
        },
        Change: function (className) {
            className = SAFN.GetArgumentPureValue(className);
            $('.' + className).change();
        },
        Focus: function (key) {
            key = SAFN.GetArgumentPureValue(key);

            $("[sa-selectedfield^='" + key + "']").each(function () {

                var selectedFields = $(this).attr('sa-selectedfield').split(',');
                for (var i in selectedFields) {
                    var field = selectedFields[i].trim();
                    if (field.length > 0 && selectedFields.includes(field)) {
                        $(this).focus();
                    }
                }
            });
        },
        ShowMessage: function (msg) {
            msg = SAFN.GetArgumentValue(msg);
            Toaster.showMessage(msg);
        },
        ShowError: function (msg) {
            msg = SAFN.GetArgumentValue(msg);
            Toaster.showError(msg);
        },
        ThrowError: function (msg) {
            msg = SAFN.GetArgumentValue(msg);
            throw msg;
        },
        SetTable: function (row, col, val) {
            col = SAFN.GetArgumentPureValue(col);
            row = SAFN.GetArgumentPureValue(row);
            val = SAFN.GetArgumentPureValue(val);

            var data = SAFN.CoreData;
            var res = {"_table": {}};
            res._table.r = [];
            try {
                if (data._table) {
                    res._table = data._table;
                }
            } catch (err) {
            }

            var r = parseInt(row);
            if (res._table.r.length > 0 && res._table.r.length > r) {
                res._table.r[r][col] = val;
            } else {
                var kv = {};
                kv[col] = val;
                res._table.r.push(kv);
            }

            return res;
        },
        SetTableObject: function () {
            var col = arguments[0];
            col = SAFN.GetArgumentPureValue(col);

            var data = SAFN.CoreData;
            var res = {"_table": {}};
            res._table.r = [];
            try {
                if (data._table) {
                    res._table = data._table;
                }
            } catch (err) {
            }

            for (var i = 1; i < arguments.length; i++) {
                var val = arguments[i];
                val = SAFN.GetArgumentPureValue(val);
                var row = i - 1;

                var r = parseInt(row);
                if (res._table.r.length > 0 && res._table.r.length > r) {
                    res._table.r[r][col] = val;
                } else {
                    var kv = {};
                    kv[col] = val;
                    res._table.r.push(kv);
                }
            }

            return res;
        },
        GetTable: function (key, col, isDistict, separator) {
            key = SAFN.GetArgumentPureValue(key);
            col = SAFN.GetArgumentPureValue(col);
            separator = SAFN.GetArgumentPureValue(separator);

            var isDist = (isDistict && isDistict !== 'undefined') ? isDistict : true;
            var data = SAFN.CoreData;
            var dt = data._table.r;
            var res = [];
            for (var i = 0; i < dt.length; i++) {
                if (isDist) {
                    if (!res.includes(col) && dt[i][col]) {
                        res.push(dt[i][col]);
                    }
                } else if (dt[i][col]) {
                    res.push(dt[i][col]);
                }

            }
            var rs = {};
            var ln = res.toString();

            if (separator && separator !== 'undefined') {
                ln = ln.replace(/,/g, separator);
            }

            rs[key] = ln;
            return rs;
        },

        CallApi: function (apiId) {
            apiId = SAFN.GetArgumentPureValue(apiId);
            var data = SAFN.CoreData;
            var element = SAFN.Element;
            var asyncData = SAFN.AsyncData;

            var res = be.callApi(apiId, data, element, asyncData)
            return res;
        },
        Clear: function (key) {
            key = SAFN.GetArgumentPureValue(key);

            $("[sa-selectedfield^='" + key + "']").each(function () {

                var selectedFields = $(this).attr('sa-selectedfield').split(',');
                for (var i in selectedFields) {
                    var field = selectedFields[i].trim();
                    if (field.length > 0 && selectedFields.includes(field)) {
                        $(this).val('');
                        $(this).attr('sa-data-value', '');
                    }
                }
            });
        },
        HideParam: function (key) {
            key = SAFN.GetArgumentPureValue(key);

            $("[sa-selectedfield^='" + key + "']").each(function () {

                var selectedFields = $(this).attr('sa-selectedfield').split(',');
                for (var i in selectedFields) {
                    var field = selectedFields[i].trim();
                    if (field.length > 0 && selectedFields.includes(field)) {
                        $(this).hide();
                    }
                }
            });
        },
        ShowParam: function (key) {
            key = SAFN.GetArgumentPureValue(key);

            $("[sa-selectedfield^='" + key + "']").each(function () {

                var selectedFields = $(this).attr('sa-selectedfield').split(',');
                for (var i in selectedFields) {
                    var field = selectedFields[i].trim();
                    if (field.length > 0 && selectedFields.includes(field)) {
                        $(this).show();
                    }
                }
            });
        },
        ClearClass: function (className) {
            className = SAFN.GetArgumentPureValue(className);

            $('.' + className).val('');
            //            $('.' + className).empty();
            $('.' + className).prop('checked', false);
            $('.' + className).attr('fname', '');
            $('.' + className).each(function () {
                $(this).closest('div').find('#progress_bar_new').html('');
            });



        },
        SetBackendCache: function (key, value) {
            key = SAFN.GetArgumentPureValue(key);
            value = SAFN.GetArgumentValue(value);


            if (!key)
                return;

            var json = initJSON();
            json.kv.key = key;
            json.kv.value = value;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmSetBackendSetKeyValueProperties",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true
            });
        },
        SetLocalCache: function (key, value) {
            key = SAFN.GetArgumentPureValue(key);
            value = SAFN.GetArgumentValue(value);


            if (!key)
                return;

            localStorage.setItem(key, value);
        },

        SendEmail: function (to, subject, message, cc, bb) {
            to = SAFN.GetArgumentValue(to);
            subject = SAFN.GetArgumentValue(subject);
            message = SAFN.GetArgumentValue(message);
            cc = SAFN.GetArgumentValue(cc);
            bb = SAFN.GetArgumentValue(bb);

            if (!to || !subject || !message)
                return;

            var json = initJSON();
            json.kv.to = to;
            json.kv.subject = subject;
            json.kv.message = message;
            json.kv.cc = cc;
            json.kv.bb = bb;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmSendEmail",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: false

            });
        },

        CallFn: function (fnName) {
            fnName = SAFN.GetArgumentPureValue(fnName);

            var data = SAFN.CoreData;
            var element = SAFN.Element;
            var asyncData = SAFN.AsyncData;

            eval(fnName)(data, element, "", asyncData);
        },
        IfHasValue: function (keyCore) {
            keyCore = SAFN.GetArgumentPureValue(keyCore);
            var data = SAFN.CoreData;

            var outData = {};
            if (data[keyCore]) {
                outData = SAFN.Function_If_Body_Statement();
            }
            return outData;
        },
        IfHasNotValue: function (keyCore) {
            keyCore = SAFN.GetArgumentPureValue(keyCore);
            var data = SAFN.CoreData;

            var outData = {};
            if (!data[keyCore]) {
                outData = SAFN.Function_If_Body_Statement();
            }
            return outData;
        },
        If: function (keyCore, operation, valueCore) {

            operation = SAFN.GetArgumentPureValue(operation);
            operation = operation.replace(/ /g, '');
            operation = operation.toLowerCase();

            var value = SAFN.GetArgumentValue(valueCore);
            var key = SAFN.GetArgumentValue(keyCore);

            key = key.trim();
            value = value.trim();

            var operRes = false;

            if (operation === '=') {
                operRes = (key === value)
            } else if (operation === '!=') {
                operRes = (key !== value)
            } else if (operation === '>') {
                operRes = (parseFloat(key) > parseFloat(value));
            } else if (operation === '>') {
                operRes = (parseFloat(key) > parseFloat(value));
            } else if (operation === '<') {
                operRes = (parseFloat(key) < parseFloat(value));
            } else if (operation === '>=' || operation === '=>') {
                operRes = (parseFloat(key) >= parseFloat(value));
            } else if (operation === '<=' || operation === '=<') {
                operRes = (parseFloat(key) <= parseFloat(value));
            } else if (operation === 'in') {
                operRes = (key.includes(value));
            } else if (operation === 'notin') {
                operRes = (key.includes(value));
            }

            var outData = {};
            if (operRes) {
                outData = SAFN.Function_If_Body_Statement();
            }
            return outData;
        },
        ForTable: function () {

            var data = SAFN.CoreData;
            var fnbody = SAFN.FunctionBody;
            var dataTemp = data;

            var dt = data._table.r;
            var outdata = {};
            for (var i = 0; i < dt.length; i++) {
                var kv = dt[i];
                var tmp = $.extend(dataTemp, kv);
                SAFN.CoreData = tmp;

                SAFN.FunctionBody = fnbody;
                var out = SAFN.Function_For_Body_Statement();

                var outT = $.extend(outdata, out);
                outdata = outT;
            }

            SAFN.CoreData = dataTemp;
            return outdata;
        },
        ForList: function (tableClassName) {
            tableClassName = SAFN.GetArgumentPureValue(tableClassName);

            var data = SAFN.CoreData;
            var fnbody = SAFN.FunctionBody;
            var dataTemp = data;
            var outdata = {};

            $('table.' + tableClassName + '> tbody > tr').each(function (evt) {
                var tdEl = $(this).find('td:eq(0)');
                var initData = getGUIDataByStoryCard(tdEl);

                var tmp = $.extend(dataTemp, initData);
                SAFN.CoreData = tmp;
                SAFN.FunctionBody = fnbody;
                var out = SAFN.Function_For_Body_Statement();
                var outT = $.extend(outdata, out);
                outdata = outT;
                SAFN.CoreData = dataTemp;

            })


            return outdata;


        },

    },
    Process: {
        addIfStatement: function (el, relatedId) {

            ADDtrafter(el, relatedId);
        }
    },
    InitConvention: function (descLine) {
        try {
            var mainBody = descLine.trim();
            var res = "";
            if (SAFN.IsCommand(mainBody)) {
                var fnName = SAFN.GetFunctionNameLine(mainBody);
                fnName = fnName.toLowerCase();

                switch (fnName) {
                    case '@.callfn':
                        descLine = SAFN.Convert.CallFnStatement(mainBody);
                        break;
                    case '@.callapi':
                        descLine = SAFN.Convert.CallApiStatement(mainBody);
                        break;
                    case '@.if':
                        descLine = SAFN.Convert.IfStatement(mainBody);
                        break;
                    case '@.ifhasvalue':
                        descLine = SAFN.Convert.IfHasValueStatement(mainBody);
                        break;
                    case '@.ifhasnotvalue':
                        descLine = SAFN.Convert.IfHasNotValueStatement(mainBody);
                        break;
                    case '@.deletekey':
                        descLine = SAFN.Convert.DeleteKeyStatement(mainBody);
                        break;
                    case '@.console':
                        descLine = SAFN.Convert.ConsoleStatement(mainBody);
                        break;
                    case '@.consoledata':
                        descLine = SAFN.Convert.ConsoleDataStatement(mainBody);
                        break;
                    case '@.get':
                        descLine = SAFN.Convert.GetStatement(mainBody);
                        break;
                    case '@.set':
                        descLine = SAFN.Convert.SetStatement(mainBody);
                        break;
                    case '@.setvalue':
                        descLine = SAFN.Convert.SetValueStatement(mainBody);
                        break;
                    case '@.settext':
                        descLine = SAFN.Convert.SetTextStatement(mainBody);
                        break;
                    case '@.setparamurl':
                        descLine = SAFN.Convert.SetParamUrlStatement(mainBody);
                        break;
                    case '@.getparamurl':
                        descLine = SAFN.Convert.GetParamUrlStatement(mainBody);
                        break;
                    case '@.alert':
                        descLine = SAFN.Convert.AlertStatement(mainBody);
                        break;
                    case '@.alertdata':
                        descLine = SAFN.Convert.AlertDataStatement(mainBody);
                        break;
                    case '@.break':
                        descLine = SAFN.Convert.BreakStatement(mainBody);
                        break;
                    case '@.map':
                        descLine = SAFN.Convert.MapStatement(mainBody);
                        break;
                    case '@.sendemail':
                        descLine = SAFN.Convert.SendEmailStatement(mainBody);
                        break;
                    case '@.showerror':
                        descLine = SAFN.Convert.ShowErrorStatement(mainBody);
                        break;
                    case '@.error':
                        descLine = SAFN.Convert.ErrorStatement(mainBody);
                        break;
                    case '@.sum':
                        descLine = SAFN.Convert.SumStatement(mainBody);
                        break;
                    case '@.inc':
                        descLine = SAFN.Convert.IncStatement(mainBody);
                        break;
                    case '@.dec':
                        descLine = SAFN.Convert.DecStatement(mainBody);
                        break;
                    case '@.concat':
                        descLine = SAFN.Convert.ConcatStatement(mainBody);
                        break;
                    case '@.click':
                        descLine = SAFN.Convert.ClickStatement(mainBody);
                        break;
                    case '@.change':
                        descLine = SAFN.Convert.ChangeStatement(mainBody);
                        break;
                    case '@.focus':
                        descLine = SAFN.Convert.FocusStatement(mainBody);
                        break;
                    case '@.showmessage':
                        descLine = SAFN.Convert.ShowMessageStatement(mainBody);
                        break;
                    case '@.hide':
                        descLine = SAFN.Convert.HideStatement(mainBody);
                        break;
                    case '@.show':
                        descLine = SAFN.Convert.ShowStatement(mainBody);
                        break;
                    case '@.visible':
                        descLine = SAFN.Convert.VisibleStatement(mainBody);
                        break;
                    case '@.unvisible':
                        descLine = SAFN.Convert.UnvisibleStatement(mainBody);
                        break;
                    case '@.clear':
                        descLine = SAFN.Convert.ClearStatement(mainBody);
                        break;
                    case '@.clearclass':
                        descLine = SAFN.Convert.ClearClassStatement(mainBody);
                        break;
                    case '@.showparam':
                        descLine = SAFN.Convert.ShowParamStatement(mainBody);
                        break;
                    case '@.hideparam':
                        descLine = SAFN.Convert.HideParamStatement(mainBody);
                        break;
                    case '@.visibleparam':
                        descLine = SAFN.Convert.VisibleParamStatement(mainBody);
                        break;
                    case '@.unvisibleparam':
                        descLine = SAFN.Convert.UnvisibleParamStatement(mainBody);
                        break;
                    case '@.forlist':
                        descLine = SAFN.Convert.ForListStatement(mainBody);
                        break;
                    case '@.fortable':
                        descLine = SAFN.Convert.ForTableStatement(mainBody);
                        break;
                }
            }
            
        } catch (err) {
            console.log('getBacklogDescLineDetails error', err)
        }
        return descLine;

    },
    InitConversion: function () {



    },
    Reconvert: {
        InitMapper: function (commandLine, triggerElm) {
            var descLine = "";
            try {
                var mainBody = triggerElm;
                commandLine = commandLine.toLowerCase();
                switch (commandLine) {
                    case '@.callfn':
                        descLine = SAFN.Reconvert.CallFnStatement(mainBody);
                        break;
                    case '@.callapi':
                        descLine = SAFN.Reconvert.CallApiStatement(mainBody);
                        break;
                    case '@.if':
                        descLine = SAFN.Reconvert.IfStatement(mainBody);
                        break;
                    case '@.ifhasvalue':
                        descLine = SAFN.Reconvert.IfHasValueStatementNew(mainBody);
                        break;
                    case '@.ifhasnotvalue':
                        descLine = SAFN.Reconvert.IfHasNotValueStatementNew(mainBody);
                        break;
                    case '@.deletekey':
                        descLine = SAFN.Reconvert.DeleteKeyStatement(mainBody);
                        break;
                    case '@.console':
                        descLine = SAFN.Reconvert.ConsoleStatement(mainBody);
                        break;
                    case '@.consoledata':
                        descLine = SAFN.Reconvert.ConsoleDataStatement(mainBody);
                        break;
                    case '@.get':
                        descLine = SAFN.Reconvert.GetStatement(mainBody);
                        break;
                    case '@.set':
                        descLine = SAFN.Reconvert.SetStatement(mainBody);
                        break;
                    case '@.setvalue':
                        descLine = SAFN.Reconvert.SetValueStatement(mainBody);
                        break;
                    case '@.settext':
                        descLine = SAFN.Reconvert.SetTextStatement(mainBody);
                        break;
                    case '@.setparamurl':
                        descLine = SAFN.Reconvert.SetParamUrlStatement(mainBody);
                        break;
                    case '@.getparamurl':
                        descLine = SAFN.Reconvert.GetParamUrlStatement(mainBody);
                        break;
                    case '@.alert':
                        descLine = SAFN.Reconvert.AlertStatement(mainBody);
                        break;
                    case '@.alertdata':
                        descLine = SAFN.Reconvert.AlertDataStatement(mainBody);
                        break;
                    case '@.map':
                        descLine = SAFN.Reconvert.MapStatement(mainBody);
                        break;
                    case '@.sendemail':
                        descLine = SAFN.Reconvert.SendEmailStatement(mainBody);
                        break;
                    case '@.showerror':
                        descLine = SAFN.Reconvert.ShowErrorStatement(mainBody);
                        break;
                    case '@.error':
                        descLine = SAFN.Reconvert.ErrorStatement(mainBody);
                        break;
                    case '@.sum':
                        descLine = SAFN.Reconvert.SumStatement(mainBody);
                        break;
                    case '@.inc':
                        descLine = SAFN.Reconvert.IncStatement(mainBody);
                        break;
                    case '@.dec':
                        descLine = SAFN.Reconvert.DecStatement(mainBody);
                        break;
                    case '@.concat':
                        descLine = SAFN.Reconvert.ConcatStatement(mainBody);
                        break;
                    case '@.click':
                        descLine = SAFN.Reconvert.ClickStatement(mainBody);
                        break;
                    case '@.change':
                        descLine = SAFN.Reconvert.ChangeStatement(mainBody);
                        break;
                    case '@.focus':
                        descLine = SAFN.Reconvert.FocusStatement(mainBody);
                        break;
                    case '@.showmessage':
                        descLine = SAFN.Reconvert.ShowMessageStatement(mainBody);
                        break;
                    case '@.hide':
                        descLine = SAFN.Reconvert.HideStatement(mainBody);
                        break;
                    case '@.show':
                        descLine = SAFN.Reconvert.ShowStatement(mainBody);
                        break;
                    case '@.visible':
                        descLine = SAFN.Reconvert.VisibleStatement(mainBody);
                        break;
                    case '@.unvisible':
                        descLine = SAFN.Reconvert.UnvisibleStatement(mainBody);
                        break;
                    case '@.clear':
                        descLine = SAFN.Reconvert.ClearStatement(mainBody);
                        break;
                    case '@.clearclass':
                        descLine = SAFN.Reconvert.ClearClassStatement(mainBody);
                        break;
                    case '@.showparam':
                        descLine = SAFN.Reconvert.ShowParamStatement(mainBody);
                        break;
                    case '@.hideparam':
                        descLine = SAFN.Reconvert.HideParamStatement(mainBody);
                        break;
                    case '@.visibleparam':
                        descLine = SAFN.Reconvert.VisibleParamStatement(mainBody);
                        break;
                    case '@.unvisibleparam':
                        descLine = SAFN.Reconvert.UnvisibleParamStatement(mainBody);
                        break;
                    case '@.forlist':
                        descLine = SAFN.Reconvert.ForListStatement(mainBody);
                        break;
                    case '@.fortable':
                        descLine = SAFN.Reconvert.ForTableStatement(mainBody);
                        break;
                    default:
                        descLine = triggerElm.find('td.text-holder').first().text();
                        break;

                }
                
            } catch (err) {
                console.log('getBacklogDescLineDetails error', err)
            }
            return descLine;

        },
        IfStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');


            var key = div.find(".fns-key").first().val();
            var oper = div.find("select.fns-oper").first().val();
            var val = div.find(".fns-val").first().val();

            var body = div.find(".if-inc-table").first().find('tbody').first().children();
            var bd = '';
            body.each(function (p) {
                var childTriggerEl = $(this);
                var commandName = childTriggerEl.attr('cname');
                var txt = SAFN.Reconvert.InitMapper(commandName, childTriggerEl);
                bd += txt + ";"
            })

            var fnline = "@.if(" + key + "," + oper + "," + val + "){" + bd + "}";

            return fnline;

        },
        IfHasValueStatementNew: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');


            var key = div.find(".fns-key").val();

            var body = div.find(".ifhasvalue-inc-table").first().find('tbody').first().children();
            var bd = '';
            body.each(function (p) {
                var childTriggerEl = $(this);
                var commandName = childTriggerEl.attr('cname');
                var txt = SAFN.Reconvert.InitMapper(commandName, childTriggerEl);
                bd += txt + ";"
            })


            var fnline = "@.ifhasvalue(" + key + "){" + bd + "}";
            return fnline;

        },
        IfHasNotValueStatementNew: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();

            var body = div.find(".ifhasnotvalue-inc-table").first().find('tbody').first().children();
            var bd = '';
            body.each(function (p) {
                var childTriggerEl = $(this);
                var commandName = childTriggerEl.attr('cname');
                var txt = SAFN.Reconvert.InitMapper(commandName, childTriggerEl);
                bd += txt + ";"
            })

            var fnline = "@.ifhasnotvalue(" + key + "){" + bd + "}";
            return fnline;

        },
        ForListStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();



            var body = div.find(".forlist-inc-table").first().find('tbody').first().children();
            var bd = '';
            body.each(function (p) {
                var childTriggerEl = $(this);
                var commandName = childTriggerEl.attr('cname');
                var txt = SAFN.Reconvert.InitMapper(commandName, childTriggerEl);
                bd += txt + ";"
            })


            var fnline = "@.forlist(" + key + "){" + bd + "}";
            return fnline;
        },
        ForTableStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var body = div.find(".fortable-inc-table").first().find('tbody').first().children();
            var bd = '';
            body.each(function (p) {
                var childTriggerEl = $(this);
                var commandName = childTriggerEl.attr('cname');
                var txt = SAFN.Reconvert.InitMapper(commandName, childTriggerEl);
                bd += txt + ";"
            })


            var fnline = "@.fortable(){" + bd + "}";
            return fnline;
        },
        GetStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val").val();

            var fnline = "@.get(" + key + "," + val + ")";
            return fnline;
        },
        SetStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val").val();

            var fnline = "@.set(" + key + "," + val + ")";
            return fnline;
        },
        MapStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val").val();

            var fnline = "@.map(" + key + "," + val + ")";
            return fnline;
        },
        ConsoleStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();

            var fnline = "@.console(" + key + ")";
            return fnline;
        },
        CallFnStatement: function (triggerEl) {

            // var div = triggerEl.find('div.function-statement-container');

            var div = $(triggerEl).find('div.function-statement-container');
            var key = div.find("select.fns-key").val();
            var fnline = "@.callfn(" + key + ")";
            return fnline;
        },
        CallApiStatement: function (triggerEl) {
            var div = $(triggerEl).find('div.function-statement-container');
            var key = div.find("select.fns-key").val();
            var fnline = "@.callapi(" + key + ")";
            return fnline;
        },
        ConsoleDataStatement: function (triggerEl) {
            var fnline = "@.consoledata()";
            return fnline;
        },
        ShowErrorStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();

            var fnline = "@.showerror(" + key + ")";
            return fnline;
        },
        SumStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val");
            var val1 = '';
            for (let i = 0; i < val.length; i++) {
                if (!($(val[i]).val() === "")) {
                    if (val.length === (i + 1)) {
                        val1 += $(val[i]).val();
                    } else {
                        val1 += $(val[i]).val() + ',';
                    }
                }
            }

            var fnline = "@.sum(" + key + "," + val1 + ")";
            return fnline;
        },
        IncStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val");
            var val1 = '';
            for (let i = 0; i < val.length; i++) {
                if (!($(val[i]).val() === "")) {
                    if (val.length === (i + 1)) {
                        val1 += $(val[i]).val();
                    } else {
                        val1 += $(val[i]).val() + ',';
                    }
                }
            }

            var fnline = "@.inc(" + key + "," + val1 + ")";
            return fnline;
        },
        DecStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val");
            var val1 = '';
            for (let i = 0; i < val.length; i++) {
                if (!($(val[i]).val() === "")) {
                    if (val.length === (i + 1)) {
                        val1 += $(val[i]).val();
                    } else {
                        val1 += $(val[i]).val() + ',';
                    }
                }
            }

            var fnline = "@.dec(" + key + "," + val1 + ")";
            return fnline;
        },
        ConcatStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val");
            var val1 = '';
            for (let i = 0; i < val.length; i++) {

                if (!($(val[i]).val() === "")) {
                    if (val.length === (i + 1)) {
                        val1 += $(val[i]).val();
                    } else {
                        val1 += $(val[i]).val() + ',';
                    }
                }
            }

            var fnline = "@.concat(" + key + "," + val1 + ")";
            return fnline;
        },
        ClickStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.click(" + key + ")";
            return fnline;
        },
        DeleteKeyStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.deletekey(" + key + ")";
            return fnline;
        },
        AlertStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.alert(" + key + ")";
            return fnline;
        },
        AlertDataStatement: function (triggerEl) {

            var fnline = "@.alertdata()";
            return fnline;
        },
        BreakStatement: function (triggerEl) {

            var fnline = "@.break()";
            return fnline;
        },
        GetParamUrlStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val").val();
            var fnline = "@.getparamurl(" + key + "," + val + ")";
            return fnline;
        },
        SetValueStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.setvalue(" + key + ")";
            return fnline;
        },
        SetTextStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.settext(" + key + ")";
            return fnline;
        },
        SetParamUrlStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val").val();
            var fnline = "@.setparamurl(" + key + "," + val + ")";
            return fnline;
        },
        ChangeStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');
            var key = div.find(".fns-key").val();
            var fnline = "@.change(" + key + ")";
            return fnline;
        },
        FocusStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.focus(" + key + ")";
            return fnline;
        },
        ShowMessageStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();

            var fnline = "@.showmessage(" + key + ")";
            return fnline;
        },
        ClearStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.clear(" + key + ")";
            return fnline;
        },
        ClearClassStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.clearclass(" + key + ")";
            return fnline;
        },
        HideParamStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.hideparam(" + key + ")";
            return fnline;
        },
        VisibleParamStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.visibleparam(" + key + ")";
            return fnline;
        },
        UnvisibleParamStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');
            var cscomment = triggerEl.find('div.text-holder');
            var key = div.find(".fns-key").val();
            var fnline = "@.unvisibleparam(" + key + ")";
            return fnline;
        },
        ShowParamStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.showparam(" + key + ")";
            return fnline;
        },
        HideStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val");
            var fnline = "@.hide(" + key + ")";
            return fnline;
        },
        ShowStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.show(" + key + ")";
            return fnline;
        },
        VisibleStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.visible(" + key + ")";
            return fnline;
        },
        UnvisibleStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var fnline = "@.unvisible(" + key + ")";
            return fnline;
        },
        ErrorStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var key = div.find(".fns-key").val();
            var val = div.find(".fns-val").val();
            var fnline = "@.error(" + key + "," + val + ")";
            return fnline;
        },
        SendEmailStatement: function (triggerEl) {
            var div = triggerEl.find('div.function-statement-container');

            var to = div.find(".fns-to").val();
            var subject = div.find(".fns-subject").val();
            var message = div.find(".fns-message").val();
            var cc = div.find(".fns-cc").val();
            var bb = div.find(".fns-bb").val();

            var fnline = "@.sendemail(" + to + "," + subject + "," + message + "," + cc + "," + bb + ")";
            return fnline;
        }
    }
    ,
    Convert: {
        Common: {
            GetLineBody: function (triggerElMain) {
                var triggerEl = $(triggerElMain).closest("tr.esas-table-tr-for-zad");
                var commandName = triggerEl.attr('cname');
                var isComment = triggerEl.attr('isComment');
                var pid = triggerEl.attr('pid');
                if ((isComment) && isComment != undefined && isComment !== '1') {
                    commandName = '';
                }
                var txt = SAFN.Reconvert.InitMapper(commandName, triggerEl);
                if (pid) {
                    new UserStory().updateBacklogDescDetailsZad(txt, pid)
                }
            },
            GetLinePureBody: function (triggerElMain) {
                var triggerEl = $(triggerElMain).closest("tr.esas-table-tr-for-zad");
                var commandName = triggerEl.attr('cname');
                var isComment = triggerEl.attr('isComment');
                var pid = triggerEl.attr('pid');
                if ((isComment) && isComment != undefined && isComment !== '1') {
                    commandName = '';
                }
                var txt = SAFN.Reconvert.InitMapper(commandName, triggerEl);
                return txt
            },
            IfStatementOperations: function (oper) {
                var el = $('<select>')
                        .addClass('function-statement-container-change-event')
                        .addClass("function-statement-input-common")
                        .addClass("function-statement-input-common-4-if")
                        .addClass("fns-oper")
                        .append($('<option>').val('=').text('=').attr('selected', (oper === '=') ? true : false))
                        .append($('<option>').val('!=').text('!=').attr('selected', (oper === '!=') ? true : false))
                        .append($('<option>').val('>').text('>').attr('selected', (oper === '>') ? true : false))
                        .append($('<option>').val('>=').text('>=').attr('selected', (oper === '>=') ? true : false))
                        .append($('<option>').val('<').text('<').attr('selected', (oper === '<') ? true : false))
                        .append($('<option>').val('<=').text('<=').attr('selected', (oper === '<=') ? true : false))
                        .append($('<option>').val('in').text('Contains').attr('selected', (oper === 'in') ? true : false))
                        .append($('<option>').val('notin').text('Not contains').attr('selected', (oper === 'notin') ? true : false))

                return el;
            },
            AddTableFooter4If: function (el) {

            },
            ToggleIfAndForStatementBlock: function (el, description) {
                el.append($('<td>')
                        .append('<span class="cs-move-tr" id="inc_tr_move"><i class="fas fa-grip-vertical"></i></span>')
                        );


                if (description.startsWith("__IF__")) {
                    var zdShey = SAFN.IfStatementBody[description];
                    el.append($('<td>')
                            .addClass("text-holder")
                            .html(SAFN.InitConvention(zdShey))
                            );

                } else if (description.startsWith("__FORLIST__")) {
                    var zdShey = SAFN.IfStatementBody[description];
                    el.append($('<td>')
                            .addClass("text-holder")
                            .append(SAFN.InitConvention(zdShey)));
                } else {
                    var lnOut = SAFN.InitConvention(description);
                    el.append($('<td>').addClass("text-holder").append(lnOut));
                }

                el.append($('<td>')
                        .append($('<div>').addClass('btn-group')
                                .append($('<button>').addClass('btn dropdown-toggle fas fa-cog').attr('data-toggle', 'dropdown').attr('aria-haspopup', 'true').attr('aria-expanded', 'true').attr('aria-hidden', 'false'))
                                .append($('<div>').addClass('dropdown-menu dropdown-menu-right')
                                        .append($('<button>').addClass('dropdown-item btn btn-primary cs-copy-btn')
                                                .html('<i class="fas fas fa-copy" aria-hidden="true"></i> Copy')
                                                )
                                        .append($('<button>').addClass('dropdown-item btn btn-primary cs-addcomment-btn')
                                                .html('<i class="fas fa-eye-slash"></i> Set as Comment')
                                                )
                                        .append($('<button>').addClass('dropdown-item btn btn-primary cs-removecomment-btn')
                                                .html('<i class="fas fa-eye"></i> Remove Comment')
                                                )
                                        .append($('<button>').addClass('dropdown-item btn btn-primary tr-remove-btn').attr('id', 'tr-remove-btn')
                                                .html('<i class="fas fa-trash-alt"></i> Delete')
                                                )
                                        )


                                )

                        );
            },
        },
        AddCommandInfoToTr: function (element, commandLine) {
            var fnShey = commandLine;
            var isCommand = 0;

            var commandName = "";
            try {
                var commandLineDesc = (fnShey.startsWith('__IF__') || fnShey.startsWith('__FORLIST__'))
                        ? SAFN.IfStatementBody[fnShey]
                        : fnShey;

                isCommand = SAFN.IsCommand(commandLineDesc) ? "1" : "0";
                commandName = SAFN.GetFunctionNameLine(commandLineDesc);
            } catch (err) {
            }

            element.attr("isCommand", isCommand)
                    .attr("cname", commandName)

        },
        CallFnStatement: function (descLine) {
            var fnId = SAFN.GetCommandArgument(descLine);
            // var fnName = SACore.GetBacklogDetails(fnId, 'backlogName');
            // fnName = (fnName) ? fnName : fnId;

            var but = '';
            if (fnId.length > 0) {
                but = $("<li>")
                        .addClass('cs-select-btn-box')
                        .append($('<button>')
                                .append('<i class="fas fa-share"></i>')
                                .attr("onclick", "showJSModal('" + fnId + "')")
                                )
            } else {
                but = $("<li>")
                        .addClass('cs-select-btn-box')
                        .append($('<button>')
                                .append('<i class="fas fa-plus"></i>')
                                .attr("onclick", "addJsModalNewSt(this)")
                                )
            }
            var descBody = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-callfn")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Call Function")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>").css('display', 'inline-block')
                                            .css("padding", '0 0 0 0')
                                            .append($('<li>')
                                                    .addClass("function-statement-input-common cs-select-box")
                                                    .append($('<select>')
                                                            .addClass('function-statement-container-change-event')
                                                            .attr('data-live-search', "true")
                                                            .attr("id", 'get-callfn-select-box')
                                                            .addClass("function-statement-input-common  get-callfn-select-box fns-key ")
                                                            .append($("<option>").text(fnId).val(fnId))

                                                            )
                                                    )
                                            .append(but)
                                            )
                                    )
                            )

            return descBody;

        },
        CallApiStatement: function (descLine) {

            var backlogId = SAFN.GetCommandArgument(descLine);
            loadBacklogInputsByIdIfNotExist(backlogId);
            var pid = SACore.GetBacklogDetails(backlogId, 'fkProjectId');
            var backlogName = SACore.GetBacklogDetails(backlogId, 'backlogName');
            backlogName = (backlogName) ? backlogName : backlogId;
            var but = '';

            but = $("<li>")
                    .addClass('cs-select-btn-box')
                    .append($('<button>')
                            .append('<i class="fas fa-share"></i>')
                            .attr("onclick", "new UserStory().redirectUserStoryCore('" + backlogId + "')")
                            )

            var but2 = $("<li>")
                    .addClass('cs-select-btn-box')
                    .append($('<button>')
                            .append('<i class="fas fa-plus"></i>')
                            .attr("onclick", "addApiModal()")
                            )


            var apiListFull = loadSelecPickerOnChnageApiList(backlogId);

            var runInBackend = SACore.GetBacklogDetails(backlogId, 'runInBackend');
            var apiSyncRequest = MapApiCallAsyncType(SACore.GetBacklogDetails(backlogId, 'apiSyncRequest'));

            var apiinfo = $("<li>")
                    .addClass('cs-select-api-info')
                    .append($('<div>')
                            .addClass('api-inc-info api-info-container orange-bg')
                            .text(GetApiActionTypeText(SACore.GetBacklogDetails(backlogId, 'apiAction')))
                            )
                    .append($('<div>')
                            .addClass('api-inc-info api-info-synchrone yellow-bg')
                            .text((runInBackend === '1') ? apiSyncRequest + ' (Backend API)' : apiSyncRequest)
                            )

            var descBody = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-callapi")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Call API")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>").css('display', 'inline-block')
                                            .css("padding", '0 0 0 0')
                                            .append($('<li>')
                                                    .addClass("function-statement-input-common cs-select-box")
                                                    .append($('<select>')
                                                            .addClass('function-statement-container-change-event')
                                                            .attr('data-live-search', "true")
                                                            .attr('title', "Select Api")
                                                            .attr("id", 'get-callapi-select-box')
                                                            .addClass("function-statement-input-common select-api-box fns-key ")
                                                            .html(apiListFull)
                                                            )
                                                    )
                                            .append(apiinfo)
                                            .append(but)
                                            .append(but2)
                                            )
                                    )
                            )

            return descBody;

        },
        IfStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var oper = (argList[1]) ? argList[1] : '';
            var val = (argList[2]) ? argList[2] : '';

            var body = SAFN.GetFunctionBody(line);
            body = SAFN.Function_If_Body_Statement_Replacement(body);
            body = SAFN.Function_For_Body_Statement_Replacement(body);

            var bodyList = body.split(';');
            var table = $('<table><tbody>').addClass('if-inc-table').attr('border', 0);
            var tfoot = $('<tfoot>').addClass('if-inc-tfoot').attr('border', 0);
            var ftr = $('<td><div data-toggle="modal" data-target="#storyCardFunctionInsertBox" class="fx-shortcodes-btn"><label for="inser-funct-input"><i class="agile-icon-fx"></i></label></div><input type="text" class="form-control add-description addGeneralProcessDescription" id="ifbacklogDescText" placeholder="Add Process Description"></td>');

            // $('.if-inc-table tr').attr('in_pid');

            for (var sti in bodyList) {
                var lnSt = $('<tr>');

                var fnShey = bodyList[sti].trim();
                SAFN.Convert.AddCommandInfoToTr(lnSt, fnShey);
                SAFN.Convert.Common.ToggleIfAndForStatementBlock(lnSt, fnShey);

                if (fnShey.length > 0) {
                    table.append(lnSt);

                    updateDragDropTableTr(table)
                    $(table).find('select').selectpicker();

                }
            }

            var div = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-if-script-box")

                    .append($('<div>')
                            .addClass('d-flex justify-content-start cs-if-script-in-box')
                            .css('background-color', '#f89cbe')
                            .css('box-shadow', 'rgb(0 0 0 / 16%) 0 3px')
                            .append($('<div>').addClass('col-cs-1 d-table mr-2')
                                    .append($('<span>').addClass('cs-funcname d-table-cell')
                                            .css('color', 'rgb(0 0 0 / 52%)').css('font-weight', 'bold').text('IF'))
                                    )
                            .append($('<div>').addClass('row mr-0 ml-0')
                                    .append($('<div>')
                                            .addClass('cs-input-group')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass("cs-if-input")
                                                    .addClass("function-statement-input-common")
                                                    .addClass("function-statement-input-common-4-if")
                                                    .addClass("fns-key")
                                                    .attr('placeholder', 'Con')
                                                    .val(key)
                                                    )
                                            )
                                    .append($('<div>').addClass('cs-input-group select-if-style')
                                            .append(SAFN.Convert.Common.IfStatementOperations(oper)))
                                    .append($('<div>')
                                            .addClass('cs-input-group')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass("cs-if-input")
                                                    .addClass("fns-val")
                                                    .addClass("function-statement-input-common")
                                                    .addClass("function-statement-input-common-4-if")
                                                    .attr('placeholder', 'Con')
                                                    .val(val)
                                                    )
                                            )
                                    )
                            )
                    .append($("<div>")
                            .append(table)
                            .append(tfoot.append($('<tr>').append(ftr)))
                            )

            return div;


        },
        IfHasValueStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';

            var body = SAFN.GetFunctionBody(line);

            body = SAFN.Function_If_Body_Statement_Replacement(body);
            body = SAFN.Function_For_Body_Statement_Replacement(body);

            var bodyList = body.split(';');
            var table = $('<table><tbody>').addClass('ifhasvalue-inc-table connectSort').attr('border', 0);
            var tfoot = $('<tfoot>').addClass('if-inc-tfoot').attr('border', 0);
            var ftr = $('<td><div data-toggle="modal" data-target="#storyCardFunctionInsertBox" class="fx-shortcodes-btn"><label for="inser-funct-input"><i class="agile-icon-fx"></i></label></div><input type="text" class="form-control add-description addGeneralProcessDescription" id="ifhasvalueBacklogDescText" placeholder="Add Process Description"></td>');

            for (var sti in bodyList) {
                var lnSt = $('<tr>');
                var fnShey = bodyList[sti].trim();

                SAFN.Convert.AddCommandInfoToTr(lnSt, fnShey);
                SAFN.Convert.Common.ToggleIfAndForStatementBlock(lnSt, fnShey);

                if (fnShey.length > 0) {
                    table.append(lnSt);

                    updateDragDropTableTr(table)
                    $(table).find('select').selectpicker();
                }

            }

            // tfoot.append(ftr);

            var div = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-if-script-box")

                    .append($('<div>').addClass('d-flex justify-content-start cs-if-script-in-box')
                            .css('background-color', '#f89cbe')
                            .css('box-shadow', 'rgb(0 0 0 / 16%) 0 3px')
                            .append($('<div>').addClass('col-cs-1 d-table mr-2')
                                    .append($('<span>').addClass('cs-funcname d-table-cell')
                                            .css('color', 'rgb(0 0 0 / 52%)')
                                            .css('font-weight', 'bold')
                                            .text('IF HAS VALUE'))
                                    )
                            .append($('<div>').addClass('row mr-0 ml-0')
                                    .append($('<div>')
                                            .addClass('cs-input-group col-md-4')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass("cs-if-input")
                                                    .addClass("function-statement-input-common")
                                                    .addClass("function-statement-input-common-4-ifhasvalue")
                                                    .addClass("fns-key")
                                                    .val(key)
                                                    )
                                            )
                                    )
                            )
                    .append($("<div>")
                            .append(table)
                            .append(tfoot.append($('<tr>').append(ftr)))
                            )


            return div;


        },
        IfHasNotValueStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';

            var body = SAFN.GetFunctionBody(line);

            body = SAFN.Function_If_Body_Statement_Replacement(body);
            body = SAFN.Function_For_Body_Statement_Replacement(body);

            var bodyList = body.split(';');
            var table = $('<table><tbody>').addClass('ifhasnotvalue-inc-table').attr('border', 0);
            var tfoot = $('<tfoot>').addClass('if-inc-tfoot').attr('border', 0);
            var ftr = $('<td><div data-toggle="modal" data-target="#storyCardFunctionInsertBox" class="fx-shortcodes-btn"><label for="inser-funct-input"><i class="agile-icon-fx"></i></label></div><input type="text" class="form-control add-description addGeneralProcessDescription" id="ifhasnotvalueBacklogDescText" placeholder="Add Process Description"></td>');


            for (var sti in bodyList) {
                var lnSt = $('<tr>');
                var fnShey = bodyList[sti].trim();

                SAFN.Convert.AddCommandInfoToTr(lnSt, fnShey);
                SAFN.Convert.Common.ToggleIfAndForStatementBlock(lnSt, fnShey);

                if (fnShey.length > 0) {
                    table.append(lnSt);

                    updateDragDropTableTr(table)
                    $(table).find('select').selectpicker();
                }
            }

            var div = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-if-script-box")

                    .append($('<div>').addClass('d-flex justify-content-start cs-if-script-in-box')
                            .css('background-color', '#f89cbe')
                            .css('box-shadow', 'rgb(0 0 0 / 16%) 0 3px')
                            .append($('<div>').addClass('col-cs-1 d-table mr-2')
                                    .append($('<span>').addClass('cs-funcname d-table-cell').css('color', 'rgb(0 0 0 / 52%)').css('font-weight', 'bold').text('IF HAS NOT VALUE'))
                                    )
                            .append($('<div>').addClass('row mr-0 ml-0')
                                    .append($('<div>')
                                            .addClass('cs-input-group col-md-4')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass("cs-if-input")
                                                    .addClass("function-statement-input-common")
                                                    .addClass("function-statement-input-common-4-ifhasnotvalue")
                                                    .addClass("fns-key")
                                                    .attr('placeholder', 'ClassName')
                                                    .val(key)
                                                    )
                                            )
                                    )
                            )
                    .append($("<div>")
                            .append(table)
                            .append(tfoot.append($('<tr>').append(ftr)))
                            )


            return div;


        },

        ForListStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var ClassName = (argList[0]) ? argList[0] : '';

            var body = SAFN.GetFunctionBody(line);
            body = SAFN.Function_For_Body_Statement_Replacement(body);
            body = SAFN.Function_If_Body_Statement_Replacement(body);

            var bodyList = body.split(';');

            var table = $('<table><tbody>').addClass('forlist-inc-table').attr('border', 0);
            var tfoot = $('<tfoot>').addClass('forlist-inc-tfoot').attr('border', 0);
            var ftr = $('<td><div data-toggle="modal" data-target="#storyCardFunctionInsertBox" class="fx-shortcodes-btn"><label for="inser-funct-input"><i class="agile-icon-fx"></i></label></div><input type="text" class="form-control add-description addGeneralProcessDescription" id="forlistBacklogDescText" placeholder="Add Process Description"></td>');

            for (var sti in bodyList) {
                var lnSt = $('<tr>');
                var fnShey = bodyList[sti].trim();

                SAFN.Convert.AddCommandInfoToTr(lnSt, fnShey);
                SAFN.Convert.Common.ToggleIfAndForStatementBlock(lnSt, fnShey);

                if (fnShey.length > 0) {
                    table.append(lnSt);
                    updateDragDropTableTr(table)
                    $(table).find('select').selectpicker();
                }

            }

            var div = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-forlist-script-box")

                    .append($('<div>').addClass('d-flex justify-content-start cs-forlist-script-in-box')
                            .css('background-color', 'rgb(170 192 197)')
                            .css('box-shadow', 'none')
                            .append($('<div>').addClass('col-cs-1 d-table mr-2')
                                    .append($('<span>').addClass('cs-funcname d-table-cell')
                                            .css('color', 'rgb(0 0 0 / 52%)')
                                            .css('font-weight', 'bold')
                                            .text('FOR LIST '))
                                    )
                            .append($('<div>').addClass('d-table mr-2')
                                    .append($('<div>').addClass('cs-forlist-class-name d-table-cell align-middle')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass('cs-forlist-cn-val')
                                                    .addClass("function-statement-input-common")
                                                    .addClass("function-statement-input-common-4-forlist")
                                                    .addClass("fns-key")
                                                    .attr('placeholder', 'ClassName')
                                                    .val(ClassName)
                                                    )
                                            )
                                    )
                            )
                    .append($("<div>")
                            .append(table)
                            .append(tfoot.append($('<tr>').append(ftr)))
                            )


            return div;


        },
        ForTableStatement: function (line) {
            var body = SAFN.GetFunctionBody(line);
            body = SAFN.Function_For_Body_Statement_Replacement(body);
            body = SAFN.Function_If_Body_Statement_Replacement(body);

            var bodyList = body.split(';');

            var table = $('<table><tbody>').addClass('fortable-inc-table').attr('border', 0);
            var tfoot = $('<tfoot>').addClass('forlist-inc-tfoot').attr('border', 0);
            var ftr = $('<td><div data-toggle="modal" data-target="#storyCardFunctionInsertBox" class="fx-shortcodes-btn"><label for="inser-funct-input"><i class="agile-icon-fx"></i></label></div><input type="text" class="form-control add-description addGeneralProcessDescription" id="fortableBacklogDescText" placeholder="Add Process Description"></td>');

            for (var sti in bodyList) {
                var lnSt = $('<tr>');
                var fnShey = bodyList[sti].trim();

                SAFN.Convert.AddCommandInfoToTr(lnSt, fnShey);
                SAFN.Convert.Common.ToggleIfAndForStatementBlock(lnSt, fnShey);

                if (fnShey.length > 0) {
                    table.append(lnSt);
                    updateDragDropTableTr(table)
                    $(table).find('select').selectpicker();
                }

            }

            var div = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-forlist-script-box")

                    .append($('<div>').addClass('d-flex justify-content-start cs-forlist-script-in-box')
                            .css('background-color', 'rgb(170 192 197)')
                            .css('box-shadow', 'none')
                            .append($('<div>').addClass('col-cs-1 d-table mr-2')
                                    .append($('<span>').addClass('cs-funcname d-table-cell')
                                            .css('color', 'rgb(0 0 0 / 52%)')
                                            .css('font-weight', 'bold')
                                            .text('FOR TABLE '))
                                    )
                            )
                    .append($("<div>")
                            .append(table)
                            .append(tfoot.append($('<tr>').append(ftr)))
                            )


            return div;


        },

        ConsoleStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-console")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell").text("Console")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>").css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-console fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName"))
                                            )
                                    )
                            )
            return div;
        },
        ConsoleDataStatement: function () {
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-consoledata")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Console Data")
                                            )

                                    )
                            )
            return div;
        },
        DeleteKeyStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-deletekey")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("DeleteKey")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>").css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-deletekey fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        AlertStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-alert")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Alert")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-alert fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "Key"))
                                            )
                                    )
                            )
            return div;
        },
        AlertDataStatement: function () {
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-alertledata")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Alert Data")
                                            )

                                    )
                            )
            return div;
        },
        BreakStatement: function () {
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-break")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Break")
                                            )

                                    )
                            )
            return div;
        },
        GetStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var val = (argList[1]) ? argList[1] : '';

            var div = $("<div>")
                    .addClass("function-statement-container")
                    .addClass("cs-sum-inbox")
                    .append($("<div>")
                            .addClass("d-flex")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Get")
                                            )
                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .append($("<li>")
                                                    .css('display', 'initial')
                                                    .append($('<input>')
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-get")
                                                            .addClass("fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")))
                                            .append($("<li>")
                                                    .append($('<input>')
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("fns-val")
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-get")
                                                            .val(val)
                                                            .attr("placeholder", "Value")))
                                            )
                                    )
                            )

            return div;
        },
        SetStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var val = (argList[1]) ? argList[1] : '';

            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container")
                    .addClass("cs-sum-inbox")
                    .append($("<div>")
                            .addClass("d-flex")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Set")
                                            )
                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .append($("<li>")
                                                    .css('display', 'initial')
                                                    .append($('<input>')
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-set")
                                                            .addClass("fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")))
                                            .append($("<li>")
                                                    .append($('<input>')
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("fns-val")
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-set")
                                                            .val(val)
                                                            .attr("placeholder", "Value")))
                                            )
                                    )
                            )

            return div;
        },
        GetParamUrlStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var val = (argList[1]) ? argList[1] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-getparamurl")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("GetParamUrl")
                                            )
                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-getparamurl fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")))
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-getparamurl fns-val")
                                                            .val(val)
                                                            .attr("placeholder", "Value")
                                                            )
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        SetValueStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-setvalue")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Set Value")
                                            )
                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-setvalue fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName"))
                                            )
                                    )
                            )
            return div;
        },
        SetTextStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-settext")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Set Text")
                                            )

                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-settext fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        SetParamUrlStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var val = (argList[1]) ? argList[1] : '';

            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-setparamurl")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("SetParamUrl")
                                            )

                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-setparamurl fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")))
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-setparamurl fns-val")
                                                            .val(val)
                                                            .attr("placeholder", "Value")
                                                            )
                                                    )
                                            )
                                    )
                            )

            return div;
        },
        MapStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var val = (argList[1]) ? argList[1] : '';

            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-map")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Map")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .append($("<li>")
                                                    .append($('<input>')
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-map fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")))
                                            .append($("<li>")
                                                    .append($('<input>')
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-map fns-val")
                                                            .val(val)
                                                            .attr("placeholder", "Value")))
                                            )
                                    )
                            )

            return div;
        },
        SumStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var ul = $('<ul>').attr('id', 'sum-sortable');

            for (let i = 0; i < argList.length; i++) {
                if (argList.length < 2) {
                    var li1 = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')

                            .append($("<input>")
                                    .addClass("fns-val function-statement-input-common function-statement-input-common-4-sum")
                                    .addClass('function-statement-container-change-event')
                                    .val(argList[1] ? argList[1] : "")
                                    .attr("placeholder", "Value")
                                    )
                    var li2 = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')

                            .append($("<input>")
                                    .addClass('function-statement-container-change-event')
                                    .addClass("fns-val function-statement-input-common function-statement-input-common-4-sum")
                                    .val(argList[2] ? argList[2] : "")
                                    .attr("placeholder", "Value")
                                    )

                    ul.append(li1);
                    ul.append(li2);
                } else {
                    if (i > 0) {

                        var li = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')
                                .append($("<div>")
                                        .addClass("cs-value-trash-box")
                                        .append($("<div>")
                                                .addClass("cs-value-trash")
                                                .append($("<i>")
                                                        .addClass("fa fa-trash-o")
                                                        .attr("aria-hidden", "true")
                                                        )
                                                .text(" Delete")
                                                )
                                        )
                                .append($('<input>')
                                        .addClass('function-statement-container-change-event')
                                        .addClass("fns-val function-statement-input-common function-statement-input-common-4-sum")
                                        .val(argList[i])
                                        .attr("placeholder", "Value"))

                        ul.append(li);

                    }

                }

            }

            var div = $("<div>")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-sum")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Sum")
                                            )
                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-sum fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")))
                                            .append('<span class="cs-sumin">=</span>'))

                                    .append(ul)
                                    )

                            .append($("<div>")
                                    .addClass("col-cs-2 d-table cs-plus-btn")
                                    .append($("<div>")
                                            .addClass("d-table-cell align-middle")
                                            .append($("<a>")
                                                    .addClass("cs-btn-sum cs-add-input btn btn-primary")
                                                    .text("+")
                                                    )
                                            )
                                    )
                            )

            $(ul).sortable({
                update: function () {
                    SAFN.Reconvert.SumStatement($(this).find("input"));
                }
            });
            return div;

        },
        IncStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var ul = $('<ul>').attr('id', 'inc-sortable');

            for (let i = 0; i < argList.length; i++) {

                if (argList.length < 2) {
                    var li1 = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')

                            .append($("<input>")
                                    .addClass("fns-val function-statement-input-common function-statement-input-common-4-inc")
                                    .addClass('function-statement-container-change-event')
                                    .val(argList[1] ? argList[1] : "")
                                    .attr("placeholder", "Value")
                                    )
                    var li2 = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')

                            .append($("<input>")
                                    .addClass("fns-val function-statement-input-common function-statement-input-common-4-inc")
                                    .addClass('function-statement-container-change-event')
                                    .val(argList[2] ? argList[2] : "")
                                    .attr("placeholder", "Value")
                                    )

                    ul.append(li1);
                    ul.append(li2);
                } else {
                    if (i > 0) {

                        var li = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')
                                .append($("<div>")
                                        .addClass("cs-value-trash-box")
                                        .append($("<div>")
                                                .addClass("cs-value-trash")
                                                .append($("<i>")
                                                        .addClass("fa fa-trash-o")
                                                        .attr("aria-hidden", "true")
                                                        )
                                                .text(" Delete")
                                                )
                                        )
                                .append($('<input>')
                                        .addClass("fns-val function-statement-input-common function-statement-input-common-4-inc")
                                        .addClass('function-statement-container-change-event')
                                        .val(argList[i])
                                        .attr("placeholder", "Value"))

                        ul.append(li);

                    }

                }

            }

            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-inc")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Inc")
                                            )
                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-inc fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")))
                                            .append('<span class="cs-sumin">=</span>'))
                                    .append(ul)
                                    )
                            .append($("<div>")
                                    .addClass("col-cs-2 d-table cs-plus-btn")
                                    .append($("<div>")
                                            .addClass("d-table-cell align-middle")
                                            .append($("<a>")
                                                    .addClass("cs-btn-inc cs-add-input btn btn-primary")
                                                    .text("+")
                                                    )
                                            )
                                    )

                            )

            $(ul).sortable({
                update: function () {
                    SAFN.Reconvert.IncStatement($(this).find("input"));
                }
            });
            return div;

        },
        DecStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var ul = $('<ul>').attr('id', 'dec-sortable');

            for (let i = 0; i < argList.length; i++) {

                if (argList.length < 2) {
                    var li1 = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')

                            .append($("<input>")
                                    .addClass("fns-val function-statement-input-common function-statement-input-common-4-dec")
                                    .addClass('function-statement-container-change-event')
                                    .val(argList[1] ? argList[1] : "")
                                    .attr("placeholder", "Value")
                                    )
                    var li2 = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')

                            .append($("<input>")
                                    .addClass("fns-val function-statement-input-common function-statement-input-common-4-dec")
                                    .addClass('function-statement-container-change-event')
                                    .val(argList[2] ? argList[2] : "")
                                    .attr("placeholder", "Value")
                                    )

                    ul.append(li1);
                    ul.append(li2);
                } else {
                    if (i > 0) {

                        var li = $("<li>").addClass(' ui-sortable-placeholder cs-addons-sum-name')

                                .append($("<div>")
                                        .addClass("cs-value-trash-box")
                                        .append($("<div>")
                                                .addClass("cs-value-trash")
                                                .append($("<i>")
                                                        .addClass("fa fa-trash-o")
                                                        .attr("aria-hidden", "true")
                                                        )
                                                .text(" Delete")
                                                )
                                        )

                                .append($("<input>")
                                        .addClass("fns-val function-statement-input-common function-statement-input-common-4-dec")
                                        .addClass('function-statement-container-change-event')
                                        .val(argList[i])
                                        .attr("placeholder", "Value")
                                        )

                        ul.append(li);

                    }

                }

            }

            var div = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-dec")
                    .append($('<div>')
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Dec")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css("display", "initial")
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-dec fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")
                                                            )
                                                    )
                                            .append('<span class="cs-sumin">=</span>')
                                            )
                                    .append(ul)
                                    )

                            .append($("<div>")
                                    .addClass("col-cs-2 d-table cs-plus-btn")
                                    .append($("<div>")
                                            .addClass("d-table-cell align-middle")
                                            .append($("<a>")
                                                    .addClass("cs-btn-dec cs-add-input btn btn-primary")
                                                    .text("+")
                                                    )
                                            )
                                    )

                            )

            $(ul).sortable({
                update: function () {
                    SAFN.Reconvert.DecStatement($(this).find("input"));
                }
            });
            return div;

        },
        ConcatStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var ul = $('<ul>').attr('id', 'concat-sortable');

            for (let i = 0; i < argList.length; i++) {

                if (argList.length < 2) {
                    var li1 = $("<li>").addClass("ui-sortable-placeholder cs-addons-sum-name")

                            .append($("<input>")
                                    .addClass("fns-val function-statement-input-common function-statement-input-common-4-concat")
                                    .addClass('function-statement-container-change-event')
                                    .val(argList[1] ? argList[1] : "")
                                    .attr("placeholder", "Value")
                                    )
                    var li2 = $("<li>").addClass("ui-sortable-placeholder cs-addons-sum-name")

                            .append($("<input>")
                                    .addClass("fns-val function-statement-input-common function-statement-input-common-4-concat")
                                    .addClass('function-statement-container-change-event')
                                    .val(argList[2] ? argList[2] : "")
                                    .attr("placeholder", "Value")
                                    )

                    ul.append(li1);
                    ul.append(li2);
                } else {
                    if (i > 0) {

                        var li = $("<li>").addClass("ui-sortable-placeholder cs-addons-sum-name")

                                .append($("<div>")
                                        .addClass("cs-value-trash-box")
                                        .append($("<div>")
                                                .addClass("cs-value-trash")
                                                .append($("<i>")
                                                        .addClass("fa fa-trash-o")
                                                        .attr("aria-hidden", "true")
                                                        )
                                                .text(" Delete")
                                                )
                                        )
                                .append($("<input>")
                                        .addClass('function-statement-container-change-event')
                                        .addClass("fns-val function-statement-input-common function-statement-input-common-4-concat")
                                        .val(argList[i])
                                        .attr("placeholder", "Value"))

                        ul.append(li);

                    }

                }

            }

            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-concat")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Concat")
                                            )

                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-concat fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")
                                                            )
                                                    )
                                            .append('<span class="cs-sumin">=</span>')

                                            )
                                    .append(ul)
                                    )
                            .append($("<div>")
                                    .addClass("col-cs-2 d-table cs-plus-btn")
                                    .append($("<div>")
                                            .addClass("d-table-cell align-middle")
                                            .append($("<a>")
                                                    .addClass("cs-btn-concat cs-add-input btn btn-primary")
                                                    .text("+")
                                                    )
                                            )
                                    )

                            )


            $(ul).sortable({
                update: function () {
                    SAFN.Reconvert.ConcatStatement($(this).find("input"));
                }
            });


            return div;
        },
        ClickStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $('<div>')
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-click")
                    .append($('<div>')
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Click")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-click fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName"))
                                            )
                                    )
                            )
            return div;
        },
        ChangeStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-change")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Change")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-change fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        FocusStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-focus")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Focus")
                                            )

                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-focus fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        ShowMessageStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-showmessage")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Show Message")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-showmessage fns-key")
                                                            .css("width", "300px")
                                                            .val(key)
                                                            .attr("placeholder", "Message")
                                                            )
                                                    )

                                            )
                                    )
                            )
            return div;
        },
        ClearStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-clear")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Clear")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($("<input>")
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-clear fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        ClearClassStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-clearclass")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Clear Class")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($("<input>")
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-clearclass fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        ShowParamStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-showparam")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Show Param")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-showparam fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        HideParamStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-hideparam")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("HideParam")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-hideparam fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        VisibleParamStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-visibleparam")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("VisibleParam")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($("<input>")
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass('function-statement-container-change-event')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-visibleparam fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        UnvisibleParamStatement: function (line) {

            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-unvisibleparam")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("UnvisibleParam")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($("<input>")
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-unvisibleparam fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )
            return div;
        },
        HideStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-hide")
                    .append($('<div>')
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Hide")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($("<input>")
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-hide fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )

            return div;
        },
        VisibleStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-visible")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Visible")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-visible fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )

            return div;
        },
        UnvisibleStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-unvisible")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Unvisible")
                                            )

                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-unvisible fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName")
                                                    )
                                            )
                                    )
                            )

            return div;
        },
        ShowStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-show")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Show")
                                            )

                                    )

                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .css("padding", '0 6px 0px 0')
                                            .append($('<input>')
                                                    .addClass('function-statement-container-change-event')
                                                    .css("margin", '6px 0 0 0')
                                                    .addClass("function-statement-input-common function-statement-input-common-4-show fns-key")
                                                    .val(key)
                                                    .attr("placeholder", "ClassName"))
                                            )
                                    )
                            )

            return div;
        },
        ShowErrorStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var message = (argList[0]) ? argList[0] : '';


            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-fx-red-style cs-sum-inbox cs-sum-inbox-show")
                    .append($("<div>")
                            .addClass("d-flex ").css("background-color", "#f65c5c")
                            .append($("<div>")
                                    .addClass("col-cs-1 mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Show Error")
                                            )

                                    )

                            .append($("<div>")
                                    .addClass('col-cs-2 flex-grow-1')
                                    .append($("<ul>")
                                            .append($("<li>")
                                                    .append($('<input>')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-show fns-key")
                                                            .css("width", "300px")
                                                            .addClass('function-statement-container-change-event')
                                                            .val(message)
                                                            .attr("placeholder", "Message"))
                                                    )
                                            )
                                    )
                            )

            return div;

        },
        ErrorStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var key = (argList[0]) ? argList[0] : '';
            var val = (argList[1]) ? argList[1] : '';

            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox cs-sum-inbox-error")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Error")
                                            )

                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-error fns-key")
                                                            .val(key)
                                                            .attr("placeholder", "Key")
                                                            )
                                                    )
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common function-statement-input-common-4-error fns-val")
                                                            .val(val)
                                                            .attr("placeholder", "Value")
                                                            )
                                                    )
                                            )
                                    )
                            )

            return div;
        },
        SendEmailStatement: function (line) {
            var arg = SAFN.GetCommandArgument(line);
            var argList = arg.split(",");
            var to = (argList[0]) ? argList[0] : '';
            var subject = (argList[1]) ? argList[1] : '';
            var message = (argList[2]) ? argList[2] : '';
            var cc = (argList[3]) ? argList[3] : '';
            var bb = (argList[4]) ? argList[4] : '';


            var div = $("<div>")
                    .addClass("col-12")
                    .addClass("function-statement-container cs-sum-inbox")
                    .append($("<div>")
                            .addClass("d-flex justify-content-start")
                            .append($("<div>")
                                    .addClass("col-cs-1 d-table mr-2")
                                    .append($("<span>")
                                            .addClass("cs-funcname d-table-cell")
                                            .text("Send Email")
                                            )

                                    )
                            .append($("<div>").addClass('col-cs-2')
                                    .append($("<ul>")
                                            .css('display', 'initial')
                                            .append($('<li>')
                                                    .append($('<input>')
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-sendemail")
                                                            .addClass("fns-to")
                                                            .attr('placeholder', 'To')
                                                            .val(to))
                                                    )
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-sendemail")
                                                            .addClass("fns-subject")
                                                            .attr('placeholder', 'Subject')
                                                            .val(subject)
                                                            )
                                                    )
                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-sendemail")
                                                            .addClass("fns-message")
                                                            .attr('placeholder', 'Message Body')
                                                            .val(message)
                                                            )
                                                    )

                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-sendemail")
                                                            .addClass("fns-cc")
                                                            .attr('placeholder', 'CC')
                                                            .val(cc)
                                                            )
                                                    )

                                            .append($("<li>")
                                                    .append($("<input>")
                                                            .addClass('function-statement-container-change-event')
                                                            .addClass("function-statement-input-common")
                                                            .addClass("function-statement-input-common-4-sendemail")
                                                            .addClass("fns-bb")
                                                            .attr('placeholder', 'BB')
                                                            .val(bb)
                                                            )
                                                    )
                                            )
                                    )
                            )
            return div;


        },
    },
    
    FnStatements: {
        'If': '@.if(,,){}',
        'IfHasValue': '@.ifhasvalue(,){}',
        'IfHasNotValue': '@.ifhasnotvalue(,){}',
        'ForList': '@.forlist(,){}',
        'ForTable': '@.fortable(,){}',
        'Get': '@.get(,)',
        'GetParamUrl': '@.getparamurl(,)',
        'Consolo': '@.consolo(,)',
        'ConsoleData': '@.consoledata(,)',
        'DeleteKey': '@.deletekey(,)',
        'Alert': '@.alert(,)',
        'AlertData': '@.alertdata(,)',
        'Set': '@.set(,)',
        'SetValue': '@.setvalue(,)',
        'SetText': '@.settext(,)',
        'Map': '@.map(,)',
        'ShowError': '@.showerror()',
        'ThrowError': '@.throwerror()',
        'Error': '@.error(,)',
        'SendEmail': '@.sendemail(,)',
        'Sum': '@.sum(,)',
        'Inc': '@.inc(,)',
        'Dec': '@.dec(,)',
        'Concat': '@.concat(,)',
        'Show': '@.show(,)',
        'Hide': '@.hide(,)',
        'Click': '@.click(,)',
        'Chage': '@.change(,)',
        'Focus': '@.focus(,)',
        'Visible': '@.visible(,)',
        'Unvisible': '@.unvisible(,)',
        'ShowMessage': '@.showmessage(,)',
        'Clear': '@.clear(,)',
        'ClearClass': '@.clearclass(,)',
        'ShowParam': '@.showparam(,)',
        'HideParam': '@.hideparam(,)',
        'VisibleParam': '@.visibleparam(,)',
        'UnvisibleParam': '@.unvisibleparam(,)',
        'CallFn': '@.callfn(,)',
        'CallApi': '@.callapi(,)',
    },

}

// Add fields
$(document).on('click', '#description_table_id .cs-btn-sum', function (e) {
    $(this).closest('.cs-sum-inbox').find('ul#sum-sortable li:last-child')

            .after($("<li>")
                    .addClass("ui-sortable-placeholder cs-addons-sum-name")
                    .append($("<div>")
                            .addClass("cs-value-trash-box")
                            .append($("<div>")
                                    .addClass("cs-value-trash")
                                    .append($("<i>")
                                            .addClass("fa fa-trash-o")
                                            .attr("aria-hidden", "true")
                                            )
                                    .text(" Delete")
                                    )
                            )
                    .append($('<input>')
                            .addClass('function-statement-container-change-event')
                            .addClass("fns-val function-statement-input-common function-statement-input-common-4-sum")
                            .val('')
                            .attr("placeholder", "Value")
                            )
                    );
});

$(document).on('click', '#description_table_id .cs-btn-concat', function (e) {
    $(this).closest('.cs-sum-inbox-concat').find('ul#concat-sortable li:last-child')

            .after($("<li>")
                    .addClass("ui-sortable-placeholder cs-addons-sum-name")
                    .append($("<div>")
                            .addClass("cs-value-trash-box")
                            .append($("<div>")
                                    .addClass("cs-value-trash")
                                    .append($("<i>")
                                            .addClass("fa fa-trash-o")
                                            .attr("aria-hidden", "true")
                                            )
                                    .text(" Delete")
                                    )
                            )
                    .append($('<input>')
                            .addClass('function-statement-container-change-event')
                            .addClass("fns-val function-statement-input-common function-statement-input-common-4-concat")
                            .val('')
                            .attr("placeholder", "Value")
                            )
                    );
});

$(document).on('click', '#description_table_id .cs-btn-dec', function (e) {
    $(this).closest('.cs-sum-inbox-dec').find('ul#dec-sortable li:last-child')

            .after($("<li>")
                    .addClass("ui-sortable-placeholder cs-addons-sum-name")
                    .append($("<div>")
                            .addClass("cs-value-trash-box")
                            .append($("<div>")
                                    .addClass("cs-value-trash")
                                    .append($("<i>")
                                            .addClass("fa fa-trash-o")
                                            .attr("aria-hidden", "true")
                                            )
                                    .text(" Delete")
                                    )
                            )
                    .append($('<input>')
                            .addClass('function-statement-container-change-event')
                            .addClass("fns-val function-statement-input-common function-statement-input-common-4-dec")
                            .val('')
                            .attr("placeholder", "Value")
                            )
                    );
});
$(document).on('click', '#description_table_id .cs-btn-inc', function (e) {
    $(this).closest('.cs-sum-inbox-inc').find('ul#inc-sortable li:last-child')

            .after($("<li>")
                    .addClass("ui-sortable-placeholder cs-addons-sum-name")
                    .append($("<div>")
                            .addClass("cs-value-trash-box")
                            .append($("<div>")
                                    .addClass("cs-value-trash")
                                    .append($("<i>")
                                            .addClass("fa fa-trash-o")
                                            .attr("aria-hidden", "true")
                                            )
                                    .text(" Delete")
                                    )
                            )
                    .append($('<input>')
                            .addClass('function-statement-container-change-event')
                            .addClass("fns-val function-statement-input-common function-statement-input-common-4-inc")
                            .val('')
                            .attr("placeholder", "Value")
                            )
                    );
});


// Field deletion warning
$(document).on('click', '#description_table_id #sum-sortable .cs-value-trash', function (e) {
    if (confirm("Are you Sure??")) {
        var th = $(this).parents("#sum-sortable")
        $(this).parents('li').remove();
        var f = $(th).find('.function-statement-input-common').first();

        SAFN.Convert.Common.GetLineBody(f);
    }
});

$(document).on('click', '#description_table_id #concat-sortable .cs-value-trash', function (e) {
    if (confirm("Are you Sure? Concat input")) {
        var id_noteConcat = $(this).parents("#concat-sortable")
        $(this).parents('li').remove();
        var noteConcat = $(id_noteConcat).find('.function-statement-input-common').first();

        SAFN.Convert.Common.GetLineBody(noteConcat);
    }
});

$(document).on('click', '#description_table_id #dec-sortable .cs-value-trash', function (e) {
    if (confirm("Are you Sure? Dec input")) {
        var id_noteDec = $(this).parents("#dec-sortable")
        $(this).parents('li').remove();
        var noteDec = $(id_noteDec).find('.function-statement-input-common').first();

        SAFN.Convert.Common.GetLineBody(noteDec);
    }
});

$(document).on('click', '.cs-addcomment-btn', function (e) {
    var triggerEl = $(this).closest("tr");
    var commandName = triggerEl.attr('cname');
    var html = triggerEl.find('.text-holder');
    var pid = triggerEl.attr('pid');

    var txt = SAFN.Reconvert.InitMapper(commandName, triggerEl);
    txt = txt.replace('@.', '#.');
    triggerEl.attr('isComment', '1')

    html.html(txt);
    SAFN.Convert.Common.GetLineBody(triggerEl);
    $(this).closest("tr").find('td.text-holder').addClass('process-fx-as-comment');
});
$(document).on('click', '.cs-removecomment-btn', function (e) {

    var triggerEl = $(this).closest("tr");
    var commandName = triggerEl.attr('cname');
    var html = triggerEl.find('.text-holder');
    var pid = triggerEl.attr('pid');

    var txt = SAFN.Reconvert.InitMapper(commandName, triggerEl);
    txt = txt.replace('#.', '@.');
    triggerEl.attr('isComment', '0')

    html.html(txt);
    SAFN.Convert.Common.GetLineBody(triggerEl);

    $(this).closest("tr").find('td.text-holder').removeClass('process-fx-as-comment');



});

$(document).on('click', '.cs-copy-btn', function (e) {
    var triggerEl = $(this).closest("tr");
    var commandName = triggerEl.attr('cname');
    var html = triggerEl.find('.text-holder');
    var pid = triggerEl.attr('pid');

    var txt = SAFN.Reconvert.InitMapper(commandName, triggerEl);

    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(txt).select();
    document.execCommand("copy");
    navigator.clipboard.writeText(txt);
    $temp.remove();
    Toaster.showMessage('Script Copied! <br>' + txt)
});

function loadSelecPickerOnChnageApiList(backlogId) {
    var prid = global_var.current_project_id;
    var data = Object.keys(SACore.Backlogs);
    var tbl = $('<select>');
    for (var n = 0; n < data.length; n++) {

        var o = SACore.Backlogs[data[n]];
        //        if (prid === o.fkProjectId) {
        if (o.isApi === '1') {

            var td = $('<option>')
                    .text(o.backlogName)
                    .val(o.id)

            if (o.id === backlogId) {
                td.attr('selected', 'selected')
            }
            tbl.append(td);
        }
        //        }
    }

    return tbl.html();
}
function loadSelecPickerOnChnageFnList(element) {

    if (!global_var.current_project_id)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetJsCodeList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            var dt = [];
            try {
                dt = res.tbl[0].r
            } catch (err) {
            }
            $(element).each(function () {

                var fnid = $(this).val();

                for (var n = 0; n < dt.length; n++) {

                    var o = dt[n];

                    var td = $('<option>')
                            .text(o.fnDescription)
                            .val(o.fnDescription)

                    if (o.id === fnid) {
                        td.attr('selected', 'selected')
                    }
                    $(this).append(td);
                }
                $(this).selectpicker('refresh');
                $('.cs-sum-inbox .cs-select-box .bootstrap-select').each(function () {
                    let arrowWidth = 60;
                    let $this = $(this);
                    let style = window.getComputedStyle(this)
                    let {fontWeight, fontSize, fontFamily} = style
                    let text = $this.find("option:selected").text();
                    let $demo = $("<span>").html(text).css({
                        "font-size": fontSize,
                        "font-weight": fontWeight,
                        "font-family": fontFamily,
                        "visibility": "hidden"
                    });
                    $demo.appendTo($this.parent());
                    let width = $demo.width();
                    $demo.remove();

                    $this.width(width + arrowWidth);

                });
            })

        }
    });


    return tbl.html()
}

// if new scripts
$(document).ready(function () {


    var shortcodes = [
        '@.if(){}',
        '@.ifhasvalue(){}',
        '@.ifhasnotvalue(){}',
        '@.forlist(){}',
        '@.fortable(){}',
        '@.get()',
        '@.getparamurl()',
        '@.console()',
        '@.consoledata()',
        '@.deletekey()',
        '@.alert()',
        '@.alertdata()',
        '@.set()',
        '@.setvalue()',
        '@.settext()',
        '@.map()',
        '@.showerror()',
        '@.error()',
        '@.sendemail()',
        '@.sum()',
        '@.inc()',
        '@.dec()',
        '@.concat()',
        '@.show()',
        '@.hide()',
        '@.click()',
        '@.change()',
        '@.focus()',
        '@.visible()',
        '@.unvisible()',
        '@.showmessage()',
        '@.clear()',
        '@.clearclass()',
        '@.showparam()',
        '@.hideparam()',
        '@.visibleparam()',
        '@.unvisibleparam()',
        '@.callfn()',
        '@.callapi()',
        '@.break()'
    ];

    $(document).on('keydown', '.add-description.dev-desc', function (e) {

        var done =  $(this).attr("auto-done");
       if(done!==true){
        $(this).autocomplete({
            position: {my: "left bottom", at: "left top", collision: "flip"},
            minLength: 2,
            // source: shortcodes,
            source: shortcodes.sort((a, b) => (a > b) ? 1 : -1),
            autoFocus: true,
            select: function (event, ui) {
                $(this).change();
            
                $(".fx-shortcodes-btn .add-description").val('');
                return false;
            },
         
        }).autocomplete("option", "appendTo", ".descriptiontable").autocomplete("widget").addClass("cs-function-list");

       }
 
    $(this).attr("auto-done",true);


});




    // first table shortcode
    $(document).on('click', '.cs-function-list li.ui-menu-item', function (e) {
        $("#backlogDescriptionText").change();
    });
    // in table shortcode
    $(document).on('click', '.cs-function-list li.ui-menu-item', function (e) {
        $("#ifbacklogDescText").change();
        $("#ifbacklogDescText").val('');
    });
    $(document).on('change', function (e) {
        if (e.which == 13) {

            $(this).val(' ').change();
        }
    });


    var globElementTbody

    $(document).on("change", "select.function-statement-input-common.select-api-box", function (e) {
        var backlogId = $(this).val();
        var val = $(this).val();
        $(this).parents('tr').find(".cs-select-btn-box > button").attr("onclick", "new UserStory().redirectUserStoryCore('" + val + "')").html('<i class="fas fa-share" aria-hidden="true"></i>')
        var apiAction = GetApiActionTypeText(SACore.GetBacklogDetails(backlogId, 'apiAction'));
        var runInBackend = SACore.GetBacklogDetails(backlogId, 'runInBackend');
        var apiSyncRequest = MapApiCallAsyncType(SACore.GetBacklogDetails(backlogId, 'apiSyncRequest'));

        $(this).closest('ul').find('.api-info-container').text(apiAction);
        $(this).closest('ul').find('.api-info-synchrone ').text((runInBackend === '1') ? apiSyncRequest + '(Backend API)' : apiSyncRequest);
        SAFN.Convert.Common.GetLineBody(this);
    })

    $(document).on("change", "select.function-statement-input-common.get-callfn-select-box", function (e) {

        var val = $(this).val();
        $(this).parents('tr').find(".cs-select-btn-box > button").attr("onclick", "showJSModal('" + val + "')").html('<i class="fas fa-share" aria-hidden="true"></i>')

        SAFN.Convert.Common.GetLineBody(this);
    })

    $(document).on("change", ".cs-sum-inbox select.function-statement-input-common", function (e) {
        $.fn.textWidth = function (text, font) {
            if (!$.fn.textWidth.ZadFakeEl)
                $.fn.textWidth.ZadFakeEl = $('<span>').hide().appendTo(document.body);
            $.fn.textWidth.ZadFakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));
            return $.fn.textWidth.ZadFakeEl.width();
        };

        $(this).on('input', function () {
            var inputWidth = $(this).textWidth();
            $(this).css({
                width: inputWidth + 15
            })
        }).trigger('input');

        function inputWidth(CSelem, minW, maxW) {
            CSelem = $(this);
        }

        var SheyTargetElem = $(this);

        inputWidth(SheyTargetElem);

        SAFN.Convert.Common.GetLineBody(this);
    })
    $(document).on("change", ".cs-sum-inbox input.function-statement-input-common", function (e) {
        $.fn.textWidth = function (text, font) {
            if (!$.fn.textWidth.ZadFakeEl)
                $.fn.textWidth.ZadFakeEl = $('<span>').hide().appendTo(document.body);
            $.fn.textWidth.ZadFakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));
            return $.fn.textWidth.ZadFakeEl.width();
        };

        $(this).on('input', function () {
            var inputWidth = $(this).textWidth();
            $(this).css({
                width: inputWidth + 15
            })
        }).trigger('input');

        function inputWidth(CSelem, minW, maxW) {
            CSelem = $(this);
        }

        var SheyTargetElem = $(this);

        inputWidth(SheyTargetElem);

        SAFN.Convert.Common.GetLineBody(this);
    })
    $(document).on("change", ".cs-sum-inbox select", function (e) {

        let arrowWidth = 60;

        $.fn.resizeselect = function (settings) {
            return this.each(function () {

                $(this).change(function () {
                    let $this = $(this);
                    let style = window.getComputedStyle(this)
                    let {fontWeight, fontSize, fontFamily} = style
                    let text = $this.find("option:selected").text();
                    let $demo = $("<span>").html(text).css({
                        "font-size": fontSize,
                        "font-weight": fontWeight,
                        "font-family": fontFamily,
                        "visibility": "hidden"
                    });
                    $demo.appendTo($this.parent());
                    let width = $demo.width();
                    $demo.remove();
                    $this.width(width + arrowWidth);

                }).change();

            });
        };
        $(this).closest('.cs-sum-inbox .cs-select-box .bootstrap-select').resizeselect();
    })

    $(document).on("dblclick", "a.cs-fx-btn-shey-zad-33", function (e) {
        $('#ScInserFuncBtn').click();
    })

    $(document).on('click', '.fx-shortcodes-btn', function (e) {
        // $(this).closest('td').find('input').prop('id', 'csoff');
        globElementTbody = $(this).closest('td').find('.add-description');
    });
    var funcdata = [
        {"label": "IF", "fx": "@.if(){}", "desc": "FX It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using."},
        {"label": "IF HAS VALUE", "fx": "@.ifhasvalue(){}", "desc": "IF HAS VALUE It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using."},
        {"label": "IF HAS NOT VALUE", "fx": "@.ifhasnotvalue(){}", "desc": "IF HAS NOT VALUE It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using."},
        {"label": "FOR LIST", "fx": "@.forlist(){}", "desc": "FOR LIST It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using."},
        {"label": "FOR TABLE", "fx": "@.fortable(){}", "desc": "FOR TABLE It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using."},
        {"label": "GET", "fx": "@.get()", "desc": "GET It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using."},
        {"label": "GET PARAM URL", "fx": "@.getparamurl()", "desc": "GET PARAM URL long established fact that a reader will be distracted by the of a page when looking at its layout. The point of using"},
        {"label": "CONSOLE", "fx": "@.console()", "desc": "CONSOLE is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of 4."},
        {"label": "CONSOLE DATA", "fx": "@.consoledata()", "desc": "CONSOLE DATA established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using."},
        {"label": "DELETE KEY", "fx": "@.deletekey()", "desc": "DELETE KEY established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using."},
        {"label": "ALERT", "fx": "@.alert()", "desc": "ALERT is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using"},
        {"label": "ALERT DATA", "fx": "@.alertdata()", "desc": "ALERT DATA is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point"},
        {"label": "SET", "fx": "@.set()", "desc": "SUM is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using"},
        {"label": "SET VALUE", "fx": "@.setvalue()", "desc": "SET It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "SET TEXT", "fx": "@.settext()", "desc": "SET TEXT It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "MAP", "fx": "@.map()", "desc": "MAP It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "SHOW ERROR", "fx": "@.showerror()", "desc": "SHOW ERROR It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "ERROR", "fx": "@.error()", "desc": "ERROR It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "SEND EMAIL", "fx": "@.sendemail()", "desc": "SED EMAIL It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "SUM", "fx": "@.sum()", "desc": "SUM It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "INC", "fx": "@.inc()", "desc": "INC It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "DEC", "fx": "@.dec()", "desc": "DEC It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "CONCAT", "fx": "@.concat()", "desc": "CONCAT It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "SHOW", "fx": "@.show()", "desc": "SHOW It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "HIDE", "fx": "@.hide()", "desc": "HIDE It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "CLICK", "fx": "@.click()", "desc": "CLICK It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "CHANGE", "fx": "@.change()", "desc": "CHANGE It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "FOCUS", "fx": "@.focus()", "desc": "FOCUS It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "VISIBLE", "fx": "@.visible()", "desc": "VISABLE It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "UNVISIBLE", "fx": "@.unvisible()", "desc": "UNVISIBLE It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "SHOW MESSAGE", "fx": "@.showmessage()", "desc": "SHOW MESSAGE It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "CLEAR", "fx": "@.clear()", "desc": "CLEAR It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "CLEAR CLASS", "fx": "@.clearclass()", "desc": "CLEAR CLASS It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "SHOW PARAM", "fx": "@.showparam()", "desc": "SHOW PARAM It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "HIDE PARAM", "fx": "@.hideparam()", "desc": "HIDE PARAM It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "VISIBLE PARAM", "fx": "@.visibleparam()", "desc": "VISIBLE PARAM It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "UNVISIBLE PARAM", "fx": "@.unvisibleparam()", "desc": "UNVISIBLE PARAM It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "CALL FUNCTION", "fx": "@.callfn()", "desc": "CALL FN It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "CALL API", "fx": "@.callapi()", "desc": "CALL API It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."},
        {"label": "BREAK", "fx": "@.break()", "desc": "BREACK It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."}
    ];



    $(document).on('click', '.cs-fc-shortcode .cs-fx-btn', function (e) {
        $('.sc-insert-func-help p').text('');
        $('.sc-insert-func-help p').append($(this).attr('fxhelpdata'));
        $('.sc-insert-func-help input').val('');
        $('.sc-insert-func-help input').val($(this).attr('fxshortcodedata'));

    });

    $(document).on('keyup keydown click', '#ScInserFuncBtn', function (e) {
        var bdt = $('.sc-insert-func-help input').val();
        $(globElementTbody).val(bdt);
        $(globElementTbody).change();
    });

    $('#storyCardFunctionInsertBox').on('shown.bs.modal', function () {
        $('#insert-funct-input').focus();
        $('.insert-funct-input').autocomplete({
            // source: funcdata,
            minLength: 0,
            autoFocus: true,
            source: funcdata.sort((a, b) => (a.label > b.label) ? 1 : -1),
            create: function () {
                $(this).autocomplete('instance')._renderItem = function (ul, item) {
                    return $('<li>').append('<a class="cs-fx-btn cs-fx-btn-shey-zad-33" fxShortcodeData="' + item.fx + '" fxhelpdata="' + item.desc + '">' + item.label + '</a>')
                            .appendTo(ul);
                };
            }
        }).autocomplete("widget").addClass("cs-fc-shortcode").autocomplete({
            position: {my: "left bottom", at: "left top", collision: "flip"}
        });

        $(".insert-funct-input").autocomplete("option", "appendTo", ".sc-insert-func-result");
        $('#insert-funct-input').val('').keydown();
    })

    $(document).on('change', '.addGeneralProcessDescription', function (e) {
        var txt = $(this).val();

        if (txt.trim().length === 0) {
            return;
        }

        var comp = SAFN.InitConvention(txt);
        var tr = $('<tr>');
        SAFN.Convert.AddCommandInfoToTr(tr, txt);

        var tdTextContent = $('<td>').addClass('text-holder')
                .append($('<span>')
                        .addClass("procDescTitleNewNowAfter")
                        .css("border-radius", "5px")
                        .append(comp)
                        )

        $(this).closest('div.function-statement-container')
                .find('tbody').first()
                .append(tr.append($('<td>')
                        .append('<span class="cs-move-tr"><i class="fas fa-grip-vertical"></i></span>')
                        ).append(tdTextContent)
                        .append($('<td>')
                                .append($('<div>').addClass('btn-group')
                                        .append($('<button>').addClass('btn dropdown-togglefas fas fa-cog')
                                                .attr('type', 'button').attr('data-toggle', 'dropdown').attr('aria-haspopup', 'true').attr('aria-expanded', 'false'))
                                        .append($('<div>').addClass('dropdown-menu dropdown-menu-right')
                                                .append($('<button>').addClass('dropdown-item btn btn-primary cs-addcomment-btn')
                                                        .html('<i class="fas fas eye-slash" aria-hidden="true"></i> Set as Comment')
                                                        )
                                                .append($('<button>').addClass('dropdown-item btn btn-primary cs-removecomment-btn')
                                                        .html('<i class="fas fas fa-eye" aria-hidden="true"></i> Remove Comment')
                                                        )
                                                .append($('<button>').addClass('dropdown-item btn btn-primary cs-copy-btn')
                                                        .html('<i class="fas fas fa-copy" aria-hidden="true"></i> Copy')
                                                        )
                                                .append($('<button>').addClass('dropdown-item btn btn-primary tr-remove-btn').attr('type', 'button')
                                                        .html('<i class="fas fa-trash-alt"></i> Delete')
                                                        )
                                                )


                                        )

                                )

                        );
        $(this).focus().val('');
        SAFN.Convert.Common.GetLineBody(this);
    });

    $(document).on('change', '.add-description', function (e) {
        $('.descriptiontable table').find('select').selectpicker();
    });

    $(document).on('click', '.tr-remove-btn', function (e) {

        var funcName = $(this).closest("tr").find('.cs-funcname').html();
        var checkstr = confirm("are you sure you want to delete <b> " + funcName + "</b> ?");
        if (checkstr == true) {
            var tr = $(this).closest('tr');
            var fstEl = $(this).closest("tr.esas-table-tr-for-zad").children().first();
            //        alert(fstEl.html())
            tr.remove();
            SAFN.Convert.Common.GetLineBody(fstEl);
        } else {
            return false;
        }
    });

});

function addJsModalNewSt(elm) {
    var id = $(elm).closest("tr").attr("pid");
    addRelatedSourceCode(elm, id);
}


function updateDragDropTableTr(table) {

    $(table).find('tbody').first().sortable({
        connectWith: "tbody",
        handle: ".cs-move-tr",
        update: function (e, ui) {
            var itm = $(ui.item);
            if ($(itm).closest("tbody").attr('id') === 'description_table_body_id') {
                var idk = makeId('9')
                itm.addClass('esas-table-tr-for-zad').attr('id', idk);
                var txt = SAFN.Convert.Common.GetLinePureBody(itm.find('td').first());
                if (txt === undefined) {
                    txt = itm.find('text-holder').find('.procDescTitleNewNowAfter').text();
                }

                genEsasTrForDrag(txt, idk);
                itm.remove();
            } else {
                itemConvertSubFUnc(itm);

            }
            SAFN.Convert.Common.GetLineBody(this);
        }
    })


}




function genEsasTrForDrag(desc, idk) {

    var json = initJSON();
    json.kv.fkBacklogId = global_var.current_backlog_id;
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.description = desc;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogDescription",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {

            $("#description_table_body_id>#" + idk + "").attr('pid', res.kv.id);
            moveBacklogDescDrag();


        },
        error: function () {
            Toaster.showGeneralError();
        }
    });

}
;
function itemConvertSubFUnc(itm) {

    $(itm).find('input[type="checkbox"]').remove();
    $(itm).removeAttr('orderno').removeAttr('pid');
    $(itm).find('td:nth-child(3)').remove();
    $(itm).find('td:nth-child(3)').remove();
    $(itm).append($('<div>').addClass('btn-group')
            .append($('<button>').addClass('btn dropdown-toggle fas fa-cog').attr('data-toggle', 'dropdown').attr('aria-haspopup', 'true').attr('aria-expanded', 'true').attr('aria-hidden', 'true'))
            .append($('<div>').addClass('dropdown-menu dropdown-menu-right')
                    .append($('<button>').addClass('dropdown-item btn btn-primary cs-copy-btn')
                            .html('<i class="fas fas fa-copy" aria-hidden="true"></i> Copy')
                            )
                    .append($('<button>').addClass('dropdown-item btn btn-primary cs-addcomment-btn')
                            .html('<i class="fas fa-eye-slash"></i> Set as Comment')
                            )
                    .append($('<button>').addClass('dropdown-item btn btn-primary cs-removecomment-btn')
                            .html('<i class="fas fa-eye"></i> Remove Comment')
                            )
                    .append($('<button>').addClass('dropdown-item btn btn-primary tr-remove-btn').attr('type', 'button')
                            .html('<i class="fas fa-trash-alt"></i> Delete')
                            )
                    )


            );
    $(itm).removeClass('esas-table-tr-for-zad');
}
;
