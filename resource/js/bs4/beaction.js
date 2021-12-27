/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var be = {

    callApi: function (apiId, data, element, asyncData) {
        //if requesti is direct. Eger elementde prodesc attr varsa o zaman
        // section type Direct-dir ve container call is Front-dur.
        // bu halda butun apiler runInBackend olmalidir.
        var runInBackend = '0';
        if ($(element).attr('prodesc')) {
            runInBackend = '1';
        } else {
            loadBacklogInputsByIdIfNotExist(apiId);
            var res = {};
            if (SACore.GetBacklogDetails(apiId, "isApi") !== '1') {
                return;
            }
            runInBackend = SACore.GetBacklogDetails(apiId, "runInBackend");
        }

        if (runInBackend === '1') {
            res = be.callBackendApi(apiId, data, element, asyncData);
        } else {
            be.ShowInData4Debug(apiId, data);
            res = be.callFrontApi(apiId, data, element, asyncData);
        }

        var async = (SACore.GetBacklogDetails(apiId, 'apiSyncRequest'))
                ? SACore.GetBacklogDetails(apiId, 'apiSyncRequest')
                : 'sync';

        if (async === 'sync')
            be.ShowOutData4Debug(apiId, data);

        return res;
    },

    callBackendApi: function (apiId, coreData, element, asyncData) {
        var async = (SACore.GetBacklogDetails(apiId, 'apiSyncRequest'))
                ? SACore.GetBacklogDetails(apiId, 'apiSyncRequest')
                : 'sync';

        var isAsync = (async === 'async');

        var res = {};
        var json = initJSON();
        json.kv = coreData;
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv['apiId'] = apiId;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceIoCallActionApi",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: isAsync,
            success: function (rs) {
                try {
                    if (rs.err.length > 0) {
                        be.AJAXCallFeedback(rs.err, element, apiId, "input");
                    }
                } catch (e) {
                }

                var out = rs.kv;
                out['selectedField'] = rs.kv.selectedField;

                try {

                    out['_table'] = rs.tbl[0];

                } catch (err) {
                }
                var b = $.extend(res, out);
                res = b;


                if (isAsync) {
                    try {
                        if (asyncData && asyncData.fn) {
                            res = eval(asyncData.fn)(element, out, asyncData);
                        } else {
                            //                            var id = $(element).attr('id');
                            //                            var el1 = document.getElementById(id);
                            triggerAPIAfter(element, apiId, out, rs.kv);
                        }


                        be.ShowOutData4Debug(apiId, out);
                    } catch (err) {
                        console.log(err);
                    }
                }
                return res;

            },
            error: function () {
                Toaster.showGeneralError();
            }
        });

        return res;
    },
    callFrontApi: function (apiId, data, element, asyncData) {

        be.ValidateApiOnInput(apiId, data, element);

        var res = {};

        var actionType = SACore.GetBacklogDetails(apiId, "apiAction");
        if (actionType === 'C') {
            res = this.callInsertAPI(apiId, data, element, asyncData);
        } else if (actionType === 'R') {
            res = this.callSelectAPI(apiId, data, element, asyncData);
        } else if (actionType === 'U') {
            res = this.callUpdateAPI(apiId, data, element, asyncData);
        } else if (actionType === 'D') {
            if (confirm("Silmə əməliyyatının davam etməsinə əminsiz?")) {
                res = this.callDeleteAPI(apiId, data, element, asyncData);
            }
        } else {
            res = this.callContainerAPI(apiId, data, element, asyncData);

//            var outputList = be.ExecAPI.GetOutputsByAPI(apiId);
//            var resOut = be.ExecAPI.SetInputValuesOnStoryCard(outputList, res);
//            try {
//                resOut['_table'] = res['_table'];
//            } catch (err) {
//            }
//            res = resOut;
        }

        return res;
    },

    ShowInData4Debug: function (apiId, data) {
        try {
            $('[pid=core_api_' + apiId + ']').closest('div.sa-api-esas').find('.sa-cw1 .sa-api-cw1-block')
                    //append($('<>').text(JSON.stringify(data)));
                    .html($('<span class="sa-api-cw1-body">')
                            .text(JSON.stringify(data, null, "  ")));
        } catch (err) {
        }
    },
    ShowOutData4Debug: function (apiId, data) {
        try {
            $('[pid=core_api_' + apiId + ']').closest('div.sa-api-esas').find('.sa-cw3 .sa-api-cw3-block')
                    //  .attr('data-content',"'"+JSON.stringify(data)+"'");
                    .html($('<span class="sa-api-cw3-body">')
                            .text(JSON.stringify(data, null, "  ")));
        } catch (err) {
        }
    },

    ShowDescriptionInData4Debug: function (apiId, descId, data) {
        try {
            $('[pid=core_api_desc_' + descId + ']').closest('div.sa-desc-item').find('.sa-api-cw1-block')
                    .html($('<span class="sa-desc-in-data-body">')
                            .html(JSON.stringify(data, null, "  ")));
        } catch (err) {
        }
    },
    ShowDescriptionOutData4Debug: function (apiId, descId, data) {
        try {
            $('[pid=core_api_desc_' + descId + ']').closest('div.sa-desc-item').find('.sa-api-cw3-block')
                    .html($('<span class="sa-desc-out-data-body">')
                            .html(JSON.stringify(data, null, "  ")));

        } catch (err) {
        }
    },

    GetSendToBacklogId: function (apiId) {

    },
    triggerStoryCard(storyCardId, apiId) {
        var res = this.GetGUIDataByStoryCard(storyCardId);
        this.callInsertAPI(apiId, res);
    },
    callContainerAPI: function (apiId, data, element, asyncData) {
        if (!data) {
            data = {};
        }

//        var inputList = be.ExecAPI.GetInputsByAPI(apiId);
//        var pureData = be.ExecAPI.SetInputValuesOnStoryCard(inputList, data);
        var pureData = data;

        var res = this.ExecAPI.CallContainerServices(apiId, pureData, element, asyncData);

        //call function
        try {
            if (asyncData && asyncData.fn) {
                var res = eval(asyncData.fn)(element, res, asyncData);
            }
        } catch (err) {
            //            console.log(err);
        }
        return res;
    },

    callInsertAPI: function (apiId, data, element, asyncData) {
        if (!data) {
            data = {};
        }

        var inputList = be.ExecAPI.GetInputsByAPI(apiId);
        var pureData = be.ExecAPI.SetInputValuesOnStoryCard(inputList, data);

        var innerData = this.ExecAPI.SetInsertObjects(apiId);
        var res = this.ExecAPI.CallInsertServices(apiId, pureData, innerData, element, asyncData);
        return res;
    },
    callUpdateAPI: function (apiId, data, element, asyncData) {
        if (!data) {
            data = {};
        }

        var inputList = be.ExecAPI.GetInputsByAPI(apiId);
        var pureData = be.ExecAPI.SetInputValuesOnStoryCard(inputList, data);


        var innerData = this.ExecAPI.SetUpdateObjects(apiId);
        var res = this.ExecAPI.CallUpdateServices(apiId, pureData, innerData, element, asyncData);
        return res;
    },
    callDeleteAPI: function (apiId, data, element, asyncData) {
        if (!data) {
            data = {};
        }

        var inputList = be.ExecAPI.GetInputsByAPI(apiId);
        var pureData = be.ExecAPI.SetInputValuesOnStoryCard(inputList, data);

        var innerData = this.ExecAPI.SetDeleteObjects(apiId);
        var res = this.ExecAPI.CallDeleteServices(apiId, pureData, innerData, element, asyncData);
        return res;
    },

    callSelectAPI: function (apiId, data, element, asyncData) {
        if (!data) {
            data = {};
        }

        var inputList = be.ExecAPI.GetInputsByAPI(apiId);
        var pureData = be.ExecAPI.SetInputValuesOnStoryCard(inputList, data);

        var innerData = this.ExecAPI.SetSelectObjects(apiId);
        var res = this.ExecAPI.CallSelectServices(apiId, pureData, innerData, element, asyncData);
        return res;
    },
    GetGUIDataByStoryCard: function (storyCardId) {
        var res = {};
        $('.redirectClass[bid="' + storyCardId + '"]').find('[sa-selectedfield]').each(function (e) {
            var val = $(this).val();
            var selectedFields = $(this).attr('sa-selectedfield').split(',');
            for (var i in selectedFields) {
                var field = selectedFields[i].trim();
                if (field.length > 0) {
                    res[field] = val;
                }
            }
        })

        return res;
    },
    ExecAPI: {
        Init: function (storyCardId) {
            this.SetSelectObjects(storyCardId);
        },
        SetSelectObjects: function (storyCardId) {
            var innerData = {};
            var SELECT_OBJ = {};
            var SELECT_OBJ_PAIR = {};
            var SELECT_OBJ_PAIR_GROUP = {};
            var SEND_TO_BACKLOG_ID = [];


            var outputList = SACore.GetBacklogDetails(storyCardId, "inputIds").split(',');

            //set Required Field From Descriptons
            var paramData = be.AddDbDescriptionField(storyCardId);
            var paramData4In = be.AddDbDescriptionField4IN(storyCardId);


            for (var i in outputList) {
                try {
                    var oid = outputList[i];
                    oid = oid.trim();
                    var inputObj = SAInput.getInputObject(oid);
                    if (inputObj.inputType === 'IN') {





                    } else if (inputObj.inputType === 'OUT') {
                        if (inputObj.selectFromDbId) {
                            var dbname = SAEntity.GetDBDetails(inputObj.selectFromDbId, "dbName");
                            var tableName = SAEntity.GetTableDetails(inputObj.selectFromTableId, "tableName");
                            var fieldName = SAEntity.GetFieldDetails(inputObj.selectFromFieldId, "fieldName");

                            if (inputObj.sendToBacklogId) {
                                SEND_TO_BACKLOG_ID.push(inputObj.sendToBacklogId);
                            }

                            fieldName = fieldName.replace(/_/g, ' ');
                            fieldName = firstLetterToLowercase(fieldName);


                            var coreName = inputObj.inputName;
                            var inputName = inputObj.inputName;
                            if (paramData.isCountField && paramData.isCountField.includes(inputName)) {
                                var fname = "count" + upperCaseFirstLetter(fieldName);
                                paramData.isCountField = paramData.isCountField.replace(coreName, fieldName);
                                SELECT_OBJ_PAIR_GROUP[fname] = inputName;
                            } else if (paramData.isMaximumField && paramData.isMaximumField.includes(inputName)) {
                                var fname = "maximum" + upperCaseFirstLetter(fieldName);
                                paramData.isMaximumField = paramData.isMaximumField.replace(coreName, fieldName);
                                SELECT_OBJ_PAIR_GROUP[fname] = inputName;
                            } else if (paramData.isMinimumField && paramData.isMinimumField.includes(inputName)) {
                                var fname = "minimum" + upperCaseFirstLetter(fieldName);
                                paramData.isMinimumField = paramData.isMinimumField.replace(coreName, fieldName);
                                SELECT_OBJ_PAIR_GROUP[fname] = inputName;
                            } else if (paramData.isAverageField && paramData.isAverageField.includes(inputName)) {
                                var fname = "average" + upperCaseFirstLetter(fieldName);
                                paramData.isAverageField = paramData.isAverageField.replace(coreName, fieldName);
                                SELECT_OBJ_PAIR_GROUP[fname] = inputName;
                            } else if (paramData.isSumField && paramData.isSumField.includes(inputName)) {
                                var fname = "sum" + upperCaseFirstLetter(fieldName);
                                paramData.isSumField = paramData.isSumField.replace(coreName, fieldName);
                                SELECT_OBJ_PAIR_GROUP[fname] = inputName;
                            } else {
                                SELECT_OBJ_PAIR[fieldName] = inputName;
                            }




                            try {
                                if (!SELECT_OBJ[dbname]) {
                                    SELECT_OBJ[dbname] = {};
                                }
                            } catch (err) {
                                SELECT_OBJ[dbname] = {};
                            }


                            try {
                                if (!SELECT_OBJ[dbname][tableName]) {
                                    SELECT_OBJ[dbname][tableName] = [];
                                }
                            } catch (err) {
                                SELECT_OBJ[dbname][tableName] = [];
                            }

                            SELECT_OBJ[dbname][tableName].push(fieldName);
                        }
                    }
                } catch (err) {
                }
            }
            innerData.SELECT_OBJ = SELECT_OBJ;
            innerData.SELECT_OBJ_PAIR = SELECT_OBJ_PAIR;
            innerData.SELECT_OBJ_PAIR_GROUP = SELECT_OBJ_PAIR_GROUP;
            innerData.PARAM_DATA = paramData;
            innerData.PARAM_DATA_4_IN = paramData4In;
            innerData.SEND_TO_BACKLOG_ID = SEND_TO_BACKLOG_ID;

            return innerData;
        },
        SetInsertObjects: function (apiId) {
            var innerData = {};
            var INSERT_OBJ = {};
            var INSERT_OBJ_PAIR = {};
            var INSERT_OBJ_DEFAULT_VALUE = {};
            var SEND_TO_BACKLOG_ID = [];
            var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
            for (var i in outputList) {
                try {
                    var oid = outputList[i];
                    oid = oid.trim();
                    var inputObj = SAInput.getInputObject(oid);
                    if (inputObj.inputType === 'OUT') {
                        if (inputObj.sendToDbId) {
                            var dbname = SAEntity.GetDBDetails(inputObj.sendToDbId, "dbName");
                            var tableName = SAEntity.GetTableDetails(inputObj.sendToTableId, "tableName");
                            var entityName = SAEntity.GetFieldDetails(inputObj.sendToFieldId, "fieldName");

                            if (inputObj.sendToBacklogId) {
                                SEND_TO_BACKLOG_ID.push(inputObj.sendToBacklogId);
                            }

                            entityName = entityName.replace(/_/g, ' ');
                            entityName = firstLetterToLowercase(entityName);

                            INSERT_OBJ_PAIR[inputObj.inputName] = entityName;
                            INSERT_OBJ_DEFAULT_VALUE[inputObj.inputName] = be.ExecAPI.GetInputDefaultValue(inputObj.id);

                            try {
                                if (!INSERT_OBJ[dbname]) {
                                    INSERT_OBJ[dbname] = {};
                                }
                            } catch (err) {
                                INSERT_OBJ[dbname] = {};
                            }


                            try {
                                if (!INSERT_OBJ[dbname][tableName]) {
                                    INSERT_OBJ[dbname][tableName] = [];
                                }
                            } catch (err) {
                                INSERT_OBJ[dbname][tableName] = [];
                            }

                            INSERT_OBJ[dbname][tableName].push(entityName);
                        }
                    }
                } catch (err) {

                }
            }
            innerData.INSERT_OBJ = INSERT_OBJ;
            innerData.INSERT_OBJ_PAIR = INSERT_OBJ_PAIR;
            innerData.INSERT_OBJ_DEFAULT_VALUE = INSERT_OBJ_DEFAULT_VALUE;
            innerData.SEND_TO_BACKLOG_ID = SEND_TO_BACKLOG_ID;
            return innerData;
        },
        GetInputDefaultValue: function (inputId) {
            var rs = '';
            try {
                //                var descIds = SAInput.getInputDetails(inputId, 'inputDescriptionIds').split(',');
                //                var descId = SAInput.DescriptionId[$(this).val()].split(", ");
                var descIds = SAInput.DescriptionId[inputId];
                for (var i = 0; i < descIds.length; i++) {
                    var desc = SAInputDesc.GetDetails(descIds[i]);
                    if (desc.includes('fn_(Defaultvalueis)')) {
                        var res = getParamFromFnline(desc, 'fn_(Defaultvalueis)', 'defaultval');
                        rs = res;
                    }
                }
            } catch (err) {
            }
            return rs;
        },
        SetUpdateObjects: function (apiId) {
            var innerData = {};
            var UPDATE_OBJ = {};
            var UPDATE_OBJ_PAIR = {};
            var UPDATE_OBJ_DEFAULT_VALUE = {};
            var SEND_TO_BACKLOG_ID = [];

            var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
            for (var i in outputList) {
                try {
                    var oid = outputList[i];
                    oid = oid.trim();
                    var inputObj = SAInput.getInputObject(oid);
                    if (inputObj.inputType === 'OUT') {
                        if (inputObj.sendToDbId) {
                            var dbname = SAEntity.GetDBDetails(inputObj.sendToDbId, "dbName");
                            var tableName = SAEntity.GetTableDetails(inputObj.sendToTableId, "tableName");
                            var entityName = SAEntity.GetFieldDetails(inputObj.sendToFieldId, "fieldName");

                            if (inputObj.sendToBacklogId) {
                                SEND_TO_BACKLOG_ID.push(inputObj.sendToBacklogId);
                            }

                            entityName = entityName.replace(/_/g, ' ');
                            entityName = firstLetterToLowercase(entityName);

                            UPDATE_OBJ_PAIR[inputObj.inputName] = entityName;
                            UPDATE_OBJ_DEFAULT_VALUE[inputObj.inputName] = be.ExecAPI.GetInputDefaultValue(inputObj.id);


                            try {
                                if (!UPDATE_OBJ[dbname]) {
                                    UPDATE_OBJ[dbname] = {};
                                }
                            } catch (err) {
                                UPDATE_OBJ[dbname] = {};
                            }


                            try {
                                if (!UPDATE_OBJ[dbname][tableName]) {
                                    UPDATE_OBJ[dbname][tableName] = [];
                                }
                            } catch (err) {
                                UPDATE_OBJ[dbname][tableName] = [];
                            }

                            UPDATE_OBJ[dbname][tableName].push(entityName);
                        }
                    }
                } catch (err) {

                }
            }

            innerData.UPDATE_OBJ = UPDATE_OBJ;
            innerData.UPDATE_OBJ_PAIR = UPDATE_OBJ_PAIR;
            innerData.UPDATE_OBJ_DEFAULT_VALUE = UPDATE_OBJ_DEFAULT_VALUE;
            innerData.SEND_TO_BACKLOG_ID = SEND_TO_BACKLOG_ID;
            return innerData;
        },
        SetDeleteObjects: function (apiId) {
            var innerData = {};
            var DELETE_OBJ = {};
            var DELETE_OBJ_PAIR = {};
            var SEND_TO_BACKLOG_ID = [];
            var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
            for (var i in outputList) {
                try {
                    var oid = outputList[i];
                    oid = oid.trim();
                    var inputObj = SAInput.getInputObject(oid);
                    if (inputObj.inputType === 'OUT') {
                        if (inputObj.sendToDbId) {
                            var dbname = SAEntity.GetDBDetails(inputObj.sendToDbId, "dbName");
                            var tableName = SAEntity.GetTableDetails(inputObj.sendToTableId, "tableName");
                            var entityName = SAEntity.GetFieldDetails(inputObj.sendToFieldId, "fieldName");


                            if (inputObj.sendToBacklogId) {
                                SEND_TO_BACKLOG_ID.push(inputObj.sendToBacklogId);
                            }

                            entityName = entityName.replace(/_/g, ' ');
                            entityName = firstLetterToLowercase(entityName);

                            DELETE_OBJ_PAIR[inputObj.inputName] = entityName;

                            try {
                                if (!DELETE_OBJ[dbname]) {
                                    DELETE_OBJ[dbname] = {};
                                }
                            } catch (err) {
                                DELETE_OBJ[dbname] = {};
                            }


                            try {
                                if (!DELETE_OBJ[dbname][tableName]) {
                                    DELETE_OBJ[dbname][tableName] = [];
                                }
                            } catch (err) {
                                DELETE_OBJ[dbname][tableName] = [];
                            }

                            DELETE_OBJ[dbname][tableName].push(entityName);
                        }
                    }
                } catch (err) {

                }
            }

            innerData.DELETE_OBJ = DELETE_OBJ;
            innerData.DELETE_OBJ_PAIR = DELETE_OBJ_PAIR;
            innerData.SEND_TO_BACKLOG_ID = SEND_TO_BACKLOG_ID;
            return innerData;
        },
        CallSelectServices: function (apiId, data, innerData, element, asyncData) {
            var res = {};
            var SELECT_OBJ = innerData.SELECT_OBJ;
            var SELECT_OBJ_PAIR = innerData.SELECT_OBJ_PAIR;
            var SELECT_OBJ_PAIR_GROUP = innerData.SELECT_OBJ_PAIR_GROUP;
            var SEND_TO_BACKLOG_ID = innerData.SEND_TO_BACKLOG_ID;


            //set Required Field From Descriptons
            var paramData = innerData.PARAM_DATA;
            var paramData4IN = innerData.PARAM_DATA_4_IN;



            var inputList = be.ExecAPI.GetInputsByAPI(apiId);
            var inputKV = be.ExecAPI.SetInputValuesOnStoryCard(inputList, data);

            try {
                inputKV.currentUserField = (paramData4IN.currentUserField) ? paramData4IN.currentUserField : "";
                inputKV.currentDateField = (paramData4IN.currentDateField) ? paramData4IN.currentDateField : "";
                inputKV.currentTimeField = (paramData4IN.currentTimeField) ? paramData4IN.currentTimeField : "";
            } catch (err) {
            }

            //call External Api
            var extData = be.ExecAPI.CallExternalApiServices(apiId, data, element, asyncData);
            var t = $.extend(inputKV, extData);
            inputKV = t;

            //////////////////////
            ////valicadate the inputs before deyerlerin deyishdirilmesi
            be.ValidateApi(apiId, inputKV, element);




            inputKV = $.extend(inputKV, paramData);




            //////////////////////

            var syncType = (SACore.GetBacklogDetails(apiId, 'apiSyncRequest'));
            var isAsync = (syncType === 'async') ? true : false;


            var dbList = Object.keys(SELECT_OBJ);
            for (var i in dbList) {
                var dbName = dbList[i];
                var tableList = Object.keys(SELECT_OBJ[dbName]);
                for (var j in tableList) {
                    var tableName = tableList[j];
                    //                    var fieldList = SELECT_OBJ[dbName][tableName];
                    var fieldList = Object.keys(SELECT_OBJ_PAIR);
                    var ln = "";
                    for (var k = 0; k < fieldList.length; k++) {
                        var fieldName = fieldList[k];
                        ln += fieldName;
                        ln += (k < fieldList.length - 1) ? "," : "";
                    }

                    var json = initJSON();
                    var a = $.extend(json.kv, inputKV);
                    json.kv = a;
                    json.kv.entityDb = dbName;
                    json.kv.entity = tableName;
                    json.kv.selectedField = ln;
                    try {
                        if (isAsync === false) {
                            var output = be.ExecAPI.CallSelectService(json, isAsync, SEND_TO_BACKLOG_ID, element, asyncData);
                            var out1 = {};
                            var out = {};
                            out = be.ExecAPI.SetKeysAsAlians4Select(output.kv, SELECT_OBJ_PAIR);
                            out1 = be.ExecAPI.SetKeysAsAlians4Select(output.kv, SELECT_OBJ_PAIR_GROUP);
                            out = $.extend(out, out1);
                            out['selectedField'] = output.kv.selectedField;

                            try {
                                var _obj = {};

                                var _selectedField = out.selectedField.split(",");
                                for (var i in _selectedField) {
                                    _obj[_selectedField[i]] = _selectedField[i];
                                }
                                var _kv2 = be.ExecAPI.SetKeysAsAlians4Select(_obj, SELECT_OBJ_PAIR);
                                var _kv3 = be.ExecAPI.SetKeysAsAlians4Select(_obj, SELECT_OBJ_PAIR_GROUP);
                                _obj = $.extend(_kv2, _kv3);
                                var _key = Object.keys(_obj);

                                out.selectedField = _key.toString();
                            } catch (err) {
                            }

                            try {

                                var rc = (output.tbl[0].r && output.tbl[0].r.length > 0)
                                        ? output.tbl[0].r.length
                                        : 0;

                                var rsOut = [];
                                for (var k = 0; k < rc; k++) {
                                    var kv1 = output.tbl[0].r[k];
                                    var kv2 = be.ExecAPI.SetKeysAsAlians4Select(kv1, SELECT_OBJ_PAIR);
                                    var kv3 = be.ExecAPI.SetKeysAsAlians4Select(kv1, SELECT_OBJ_PAIR_GROUP);
                                    kv2 = $.extend(kv2, kv3);
                                    rsOut.push(kv2);
                                }
                                output.tbl[0].r = rsOut;

                                out['_table'] = output.tbl[0];


                            } catch (err) {
                            }
                            var b = $.extend(res, out);
                            res = b;
                            try {
                                if (output.err.length > 0) {
                                    be.AJAXCallFeedback(output.err, element, apiId, "input");
                                }
                            } catch (e) {
                            }
                        } else {
                            be.ExecAPI.CallSelectServiceAsync(json, SELECT_OBJ_PAIR, SELECT_OBJ_PAIR_GROUP, element, apiId, asyncData, SEND_TO_BACKLOG_ID);
                        }

                    } catch (err) {
                        //                        console.log(err)
                    }
                }
            }
            return res;
        },
        SetKeysAsAlians4Select: function (data, SELECT_OBJ_PAIR) {
            var keys = Object.keys(data);
            var newData = {};
            for (var i in keys) {
                var key = keys[i];
                var val = data[key];

                var pair = SELECT_OBJ_PAIR[key];
                if (pair) {
                    newData[pair] = val;
                }

            }
            return newData;
        },
        SetKeysAsAlians4Insert: function (data, INSERT_OBJ_PAIR) {
            var res = {};

            var keys = Object.keys(data);
            for (var i in keys) {
                var key = keys[i];
                var val = data[key];

                var pair = INSERT_OBJ_PAIR[key];
                if (pair) {
                    res[pair] = val;
                }

            }
            return res;
        },
        SetKeysAsAlians4Update: function (data, UPDATE_OBJ_PAIR) {
            var res = {};

            var keys = Object.keys(data);
            for (var i in keys) {
                var key = keys[i];
                var val = data[key];

                var pair = UPDATE_OBJ_PAIR[key];
                if (pair) {
                    res[pair] = val;
                }

            }
            return res;
        },
        SetKeysAsAlians4Delete: function (data, DELETE_OBJ_PAIR) {
            var res = {};

            var keys = Object.keys(data);
            for (var i in keys) {
                var key = keys[i];
                var val = data[key];

                var pair = DELETE_OBJ_PAIR[key];
                if (pair) {
                    res[pair] = val;
                }

            }
            return res;
        },
        GetInputsOfExternalApiByCoreApi: function (apiId) {
            var inputList = [];
            var extApiList = (cr_project_desc_by_backlog[apiId])
                    ? cr_project_desc_by_backlog[apiId]
                    : [];
            var f = true;
            for (var i in extApiList) {
                try {

                    var extId = extApiList[i];
                    var o = cr_project_desc[extId];
                    if (o.fkRelatedApiId) {
                        loadBacklogInputsByIdIfNotExist(o.fkRelatedApiId);
                        var inputIds = SACore.GetBacklogDetails(o.fkRelatedApiId, "inputIds").split(",");
                        inputList = $.merge(inputList, inputIds);
                    }
                } catch (err) {

                }
            }
            return inputList;

        },
        GetOutputsByAPI: function (apiId) {
            var inputIds = SACore.GetBacklogDetails(apiId, "inputIds").split(",");

            var res = [];
            for (var i in inputIds) {
                var inputId = inputIds[i].trim();
                if (inputId.length === 0)
                    continue;
                var inputObj = SAInput.getInputObject(inputId);
                if (inputObj.inputType !== 'OUT') {
                    continue;
                }

                var inputName = inputObj.inputName;
                res.push(inputName);
            }
            return res;
        },
        GetInputsByAPI: function (apiId) {
            //Get inputIds of External APIs

            //end Get inputIds of external APIs


            var inputIds = SACore.GetBacklogDetails(apiId, "inputIds").split(",");
            var inputExternalIdList = be.ExecAPI.GetInputsOfExternalApiByCoreApi(apiId);
            var outZad = $.merge(inputIds, inputExternalIdList);
            inputIds = outZad;

            var res = [];
            for (var i in inputIds) {
                try {
                    var inputId = inputIds[i].trim();
                    if (inputId.length === 0)
                        continue;
                    var inputObj = SAInput.getInputObject(inputId);
                    if (inputObj.inputType !== 'IN') {
                        continue;
                    }

                    var inputName = inputObj.inputName;
                    res.push(inputName);
                } catch (err) {
                    //                    console.log(err);
                }
            }
            return res;
        },
        SetInputValuesOnStoryCard(inputList, data) {
            var res = {};
            for (var i in inputList) {
                try {
                    if (inputList[i].trim().length > 0) {
                        var inputName = inputList[i].trim();
                        var zad = data[inputName];

                        res[inputName] = (zad) ? zad : "";
                    }
                } catch (err) {

                }
            }
            return res;
        },
        SetInputValuesOnStoryCard4Object(inputList, data) {
            var res = {};
            var key = Object.keys(inputList);
            for (var i in key) {
                var inputKey = key[i];
                var val = inputList[inputKey];
                if (data[inputKey]) {
                    inputList[inputKey] = data[inputKey];
                }
            }
            return inputList;
        },
        CallContainerServices: function (apiId, data, element, asyncData) {

            //create initial variable as output of the API for insert
            var outputKV = data;

            //call External Api
            var extData = be.ExecAPI.CallExternalApiServices(apiId, outputKV, element, asyncData);

            var t = $.extend(outputKV, extData);
            outputKV = t;

            return outputKV;
        },
        CallInsertServices: function (apiId, data, innerData, element, asyncData) {
            var res = {};
            var INSERT_OBJ = innerData.INSERT_OBJ;
            var INSERT_OBJ_PAIR = innerData.INSERT_OBJ_PAIR;
            var INSERT_OBJ_DEFAULT_VALUE = innerData.INSERT_OBJ_DEFAULT_VALUE;
            var SEND_TO_BACKLOG_ID = innerData.SEND_TO_BACKLOG_ID;

            //            var inputList = be.ExecAPI.GetInputsByAPI(apiId);


            //create initial variable as output of the API for insert
            var outputList = Object.keys(INSERT_OBJ_PAIR);
            var outputKV = be.ExecAPI.SetInputValuesOnStoryCard(outputList, INSERT_OBJ_DEFAULT_VALUE);
            outputKV = be.ExecAPI.SetInputValuesOnStoryCard4Object(outputKV, data);
            outputKV = $.extend(outputKV, data);

            //call External Api
            var extData = be.ExecAPI.CallExternalApiServices(apiId, outputKV, element, asyncData);
            var t = $.extend(outputKV, extData);
            outputKV = t;

            //////////////////////
            ////valicadate the inputs before deyerlerin deyishdirilmesi
            be.ValidateApi(apiId, outputKV, element);

            //set Required Field From Descriptons
            var paramData = be.AddDbDescriptionField4InsertUpdate(apiId, INSERT_OBJ_PAIR);


            //add alians to output keys data
            var outputKVFinal = be.ExecAPI.SetKeysAsAlians4Insert(outputKV, INSERT_OBJ_PAIR);

            outputKVFinal = $.extend(outputKVFinal, paramData);
            //call services
            var resEndup = be.ExecAPI.CallInsertServicesEndup(outputKVFinal, INSERT_OBJ, apiId, SEND_TO_BACKLOG_ID, element, asyncData);

            var temp1 = $.extend(res, resEndup);
            res = temp1;

            return res;
        },
        CallInsertServicesEndup: function (outputKVFinal, INSERT_OBJ, apiId, SEND_TO_BACKLOG_ID, element, asyncData) {
            var syncType = (SACore.GetBacklogDetails(apiId, 'apiSyncRequest'));
            var isAsync = (syncType === 'async') ? true : false;

            var res = {};
            var dbList = Object.keys(INSERT_OBJ);
            for (var i in dbList) {
                var dbName = dbList[i];
                var tableList = Object.keys(INSERT_OBJ[dbName]);
                for (var j in tableList) {
                    var tableName = tableList[j];

                    var json = initJSON();
                    var a = $.extend(json.kv, outputKVFinal);
                    json.kv = a;
                    json.kv.entityDb = dbName;
                    json.kv.entity = tableName;
                    try {
                        var output = be.ExecAPI.CallInsertService(json, isAsync, SEND_TO_BACKLOG_ID, element, asyncData, apiId);
                        //                        var b = $.extend(res, output.kv);

                        res['id'] = output.kv.id;
                        try {
                            if (output.err.length > 0) {
                                be.AJAXCallFeedback(output.err, element, apiId, "output");
                            }
                        } catch (e) {
                        }
                    } catch (err) {
                        //                        console.log(err)
                    }
                }
            }
            return res;
        },

        ConvertArrayToStringLine: function (arrayList) {
            var stLine = "";
            for (var i = 0; i < arrayList.length; i++) {
                var st = arrayList[i];
                if (st.length === 0)
                    continue;
                stLine += st;
                stLine += (i < arrayList.length - 1) ? "," : "";
            }
            return stLine;
        },
        CallUpdateServices: function (apiId, data, innerData, element, asyncData) {
            var res = {};
            var UPDATE_OBJ_PAIR = innerData.UPDATE_OBJ_PAIR;
            var UPDATE_OBJ = innerData.UPDATE_OBJ;
            var UPDATE_OBJ_DEFAULT_VALUE = innerData.UPDATE_OBJ_DEFAULT_VALUE;
            var SEND_TO_BACKLOG_ID = innerData.SEND_TO_BACKLOG_ID;


            //            var inputList = be.ExecAPI.GetInputsByAPI(apiId);
            var outputList = Object.keys(UPDATE_OBJ_PAIR);
            var outputKV = be.ExecAPI.SetInputValuesOnStoryCard(outputList, UPDATE_OBJ_DEFAULT_VALUE);
            outputKV = be.ExecAPI.SetInputValuesOnStoryCard4Object(outputKV, data);
            outputKV = $.extend(outputKV, data);


            //call External Api
            var extData = be.ExecAPI.CallExternalApiServices(apiId, data, element, asyncData);
            var t = $.extend(outputKV, extData);
            outputKV = t;

            //////////////////////
            ////valicadate the inputs before deyerlerin deyishdirilmesi
            be.ValidateApi(apiId, outputKV, element);


            //set Required Field From Descriptons
            var paramData = be.AddDbDescriptionField(apiId);

            //////////////////////
            var outputKVFinal = be.ExecAPI.SetKeysAsAlians4Update(outputKV, UPDATE_OBJ_PAIR);
            var updatedField = this.ConvertArrayToStringLine(Object.keys(outputKVFinal));

            outputKVFinal = $.extend(outputKVFinal, paramData);

            var syncType = (SACore.GetBacklogDetails(apiId, 'apiSyncRequest'));
            var isAsync = (syncType === 'async') ? true : false;

            var dbList = Object.keys(UPDATE_OBJ);
            for (var i in dbList) {
                var dbName = dbList[i];
                var tableList = Object.keys(UPDATE_OBJ[dbName]);
                for (var j in tableList) {
                    var tableName = tableList[j];

                    var json = initJSON();
                    var a = $.extend(json.kv, outputKVFinal);
                    json.kv = a;
                    json.kv.updatedField = updatedField;
                    json.kv.entityDb = dbName;
                    json.kv.entity = tableName;
                    try {
                        var output = be.ExecAPI.CallUpdateService(json, isAsync, SEND_TO_BACKLOG_ID, element, asyncData, apiId);
                        var b = $.extend(res, output.kv);
                        res = b;
                        try {
                            if (output.err.length > 0) {
                                be.AJAXCallFeedback(output.err, element, apiId, "output");
                            }
                        } catch (e) {
                        }
                    } catch (err) {
                        //                        console.log(err)
                    }
                }
            }
            return res;
        },
        CallExternalApiServices: function (apiId, data, element, asyncData) {
            var outData = {};
            var extApiList = (cr_project_desc_by_backlog[apiId])
                    ? cr_project_desc_by_backlog[apiId]
                    : [];
            var f = true;
            for (var i in extApiList) {
                //                try {
                if (f) {
                    outData = data;
                    f = false;
                }

                var extId = extApiList[i];
                var o = cr_project_desc[extId];

                if (o.commentType === 'comment') {
                    continue;
                }

                be.ShowDescriptionInData4Debug(apiId, o.id, outData);

                if (SAFN.IsCommand(o.description)) {
                    outData = SAFN.ExecCommand(o.description, outData, element, asyncData, apiId);
                } else {
                    if (o.fkRelatedScId) {
                        var fnId = cr_js_list[o.fkRelatedScId].id;
                        var fnType = cr_js_list[o.fkRelatedScId].fnType;
                        var fnName = cr_js_list[o.fkRelatedScId].fnCoreName;

                        if (fnType === 'core') {
                            outData = SAFN.ConvertFunctions.CoreJS(fnName, outData, element, apiId, asyncData);
                        } else if (fnType === 'java') {
                            outData = SAFN.ConvertFunctions.Java(fnName, outData, element, apiId, asyncData);
                        } else if (fnType === 'sql') {
                            outData = SAFN.ConvertFunctions.SQL(fnId, outData, element, apiId, asyncData);
                        }
                    } else if (o.fkRelatedApiId) {
                        outData = SAFN.ConvertFunctions.ApiCall(o.fkRelatedApiId, outData, element, apiId, asyncData);
                    }
                }


                if (outData.err && outData.err.length > 0) {
                    be.AJAXCallFeedback(outData.err, element, apiId, "process", o.id);
                }


                be.ShowDescriptionOutData4Debug(apiId, o.id, outData);

            }
            return outData;
        },

        CallBackendApiService: function (fnName, data) {
            var rs = "";
            data.kv.fnName = fnName;
            var that = this;
            var dataCore = JSON.stringify(data);
            $.ajax({
                url: urlGl + "api/post/srv/serviceIoRunFunction",
                type: "POST",
                data: dataCore,
                contentType: "application/json",
                crossDomain: true,
                async: false,
                success: function (res) {
                    rs = res;
                    return rs;
                }
            });
            return rs;
        },

        CallBackendApiServiceForSql: function (fnId, data) {
            if (!fnId) {
                return;
            }

            var rs = "";
            data.kv.fnId = fnId;
            var that = this;
            var dataCore = JSON.stringify(data);
            $.ajax({
                url: urlGl + "api/post/srv/serviceIoRunFunctionForSql",
                type: "POST",
                data: dataCore,
                contentType: "application/json",
                crossDomain: true,
                async: false,
                success: function (res) {
                    rs = res;
                    return rs;
                }
            });
            return rs;
        },

        CallDeleteServices: function (apiId, data, innerData, element, asyncData) {
            var res = {};
            var DELETE_OBJ = innerData.DELETE_OBJ;
            var DELETE_OBJ_PAIR = innerData.DELETE_OBJ_PAIR;
            var SEND_TO_BACKLOG_ID = innerData.SEND_TO_BACKLOG_ID;


            // var inputList = be.ExecAPI.GetInputsByAPI(apiId);
            var outputList = Object.keys(DELETE_OBJ_PAIR);
            var outputKV = be.ExecAPI.SetInputValuesOnStoryCard(outputList, data);


            //call External Api
            var extData = be.ExecAPI.CallExternalApiServices(apiId, data, element, asyncData);
            var t = $.extend(outputKV, extData);
            outputKV = t;

            var syncType = (SACore.GetBacklogDetails(apiId, 'apiSyncRequest'));
            var isAsync = (syncType === 'async') ? true : false;

            //////////////////////
            be.ValidateApi(outputKV, outputKVFinal, element);

            var outputKVFinal = be.ExecAPI.SetKeysAsAlians4Delete(outputKV, DELETE_OBJ_PAIR);




            var dbList = Object.keys(DELETE_OBJ);
            for (var i in dbList) {
                var dbName = dbList[i];
                var tableList = Object.keys(DELETE_OBJ[dbName]);
                for (var j in tableList) {
                    var tableName = tableList[j];

                    var json = initJSON();
                    var a = $.extend(json.kv, outputKVFinal);
                    json.kv = a;
                    json.kv.entityDb = dbName;
                    json.kv.entity = tableName;
                    try {
                        var output = be.ExecAPI.CallDeleteService(json, isAsync, SEND_TO_BACKLOG_ID, element, asyncData, apiId);
                        var b = $.extend(res, output.kv);
                        res = b;
                        try {
                            if (output.err.length > 0) {
                                be.AJAXCallFeedback(output.err, element, apiId, "output");
                            }
                        } catch (e) {
                        }
                    } catch (err) {
                        //                        console.log(err)
                    }
                }
            }
            return res;
        },
        CallInsertService: function (dataJSON, isAsync, SEND_TO_BACKLOG_ID, element, asyncData, apiId) {
            isAsync = (isAsync) ? isAsync : false;
            var async = (isAsync === true) ? true : false;
            var rs = "";
            var that = this;
            delete dataJSON._table;
            var data = JSON.stringify(dataJSON);
            $.ajax({
                url: urlGl + "api/post/srv/serviceIoCoreInsert",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: async,
                success: function (res) {
                    be.AJAXCallFeedback(res.err, element, apiId, "output");
                    rs = res;
                    var res1 = {};
                    var res2 = {};
                    try {
                        res1 = dataJSON.kv;
                        res2 = res.kv;
                    } catch (err) {
                    }
                    var dt = $.extend(res1, res2);
                    for (var i = 0; i < SEND_TO_BACKLOG_ID.length; i++) {
                        if (SEND_TO_BACKLOG_ID[i]) {
                            try {
                                be.callApi(SEND_TO_BACKLOG_ID[i], dt, element, asyncData);
                            } catch (err) {
                                //                                console.log(err);
                            }
                        }
                    }

                    if (async)
                        be.ShowOutData4Debug(apiId, dt);
                }
            });
            return rs;
        },
        CallUpdateService: function (dataJSON, isAsync, SEND_TO_BACKLOG_ID, element, asyncData, apiId) {
            isAsync = (isAsync) ? isAsync : false;
            var async = (isAsync === true) ? true : false;
            var rs = "";
            var that = this;
            delete dataJSON._table;
            var data = JSON.stringify(dataJSON);
            $.ajax({
                url: urlGl + "api/post/srv/serviceIoCoreUpdate",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: async,
                success: function (res) {
                    be.AJAXCallFeedback(res.err, element, apiId, "output");
                    rs = res;

                    var res1 = {};
                    var res2 = {};
                    try {
                        res1 = dataJSON.kv;
                        res2 = res.kv;
                    } catch (err) {
                    }
                    var dt = $.extend(res1, res2);
                    for (var i = 0; i < SEND_TO_BACKLOG_ID.length; i++) {
                        if (SEND_TO_BACKLOG_ID[i]) {
                            try {
                                be.callApi(SEND_TO_BACKLOG_ID[i], dt, element, asyncData);
                            } catch (err) {
                                //                                console.log(err);
                            }
                        }
                    }

                    if (async)
                        be.ShowOutData4Debug(apiId, dt);
                }
            });
            return rs;
        },
        CallDeleteService: function (dataJSON, isAsync, SEND_TO_BACKLOG_ID, element, asyncData, apiId) {
            isAsync = (isAsync) ? isAsync : false;
            var async = (isAsync === true) ? true : false;
            var rs = "";
            var that = this;
            delete dataJSON._table;
            var data = JSON.stringify(dataJSON);
            $.ajax({
                url: urlGl + "api/post/srv/serviceIoCoreDelete",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: async,
                success: function (res) {
                    be.AJAXCallFeedback(res.err, element, apiId, "output");
                    rs = res;

                    var res1 = {};
                    var res2 = {};
                    try {
                        res1 = dataJSON.kv;
                        res2 = res.kv;
                    } catch (err) {
                    }
                    var dt = $.extend(res1, res2);
                    for (var i = 0; i < SEND_TO_BACKLOG_ID.length; i++) {
                        if (SEND_TO_BACKLOG_ID[i]) {
                            try {
                                be.callApi(SEND_TO_BACKLOG_ID[i], dt, element, asyncData);
                            } catch (err) {
                                //                                console.log(err);
                            }
                        }
                    }
                    if (async)
                        be.ShowOutData4Debug(apiId, dt);
                }
            });
            return rs;
        },
        CallSelectService: function (dataJSON, isAsync, SEND_TO_BACKLOG_ID, element, asyncData) {
            isAsync = (isAsync) ? isAsync : false;
            var async = (isAsync === true) ? true : false;
            var rs = "";
            var that = this;
            delete dataJSON._table;
            var data = JSON.stringify(dataJSON);
            $.ajax({
                url: urlGl + "api/post/srv/serviceIoCoreSelect",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: async,
                success: function (res) {
                    rs = res;
                    var res1 = {};
                    var res2 = {};
                    try {
                        res1 = dataJSON.kv;
                        res2 = res.kv;
                    } catch (err) {
                    }
                    var dt = $.extend(res1, res2);
                    for (var i = 0; i < SEND_TO_BACKLOG_ID.length; i++) {
                        if (SEND_TO_BACKLOG_ID[i]) {
                            try {
                                be.callApi(SEND_TO_BACKLOG_ID[i], dt, element, asyncData);
                            } catch (err) {
                                //                                console.log(err);
                            }
                        }
                    }
                }
            });
            return rs;
        },
        CallSelectServiceAsync: function (dataJSON, SELECT_OBJ_PAIR, SELECT_OBJ_PAIR_GROUP, element, apiId, asyncData, SEND_TO_BACKLOG_ID) {
            var rs = "";
            var that = this;
            delete dataJSON._table;
            var data = JSON.stringify(dataJSON);
            $.ajax({
                url: urlGl + "api/post/srv/serviceIoCoreSelect",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    var output = res;
                    var out1 = {};
                    var out = {};
                    out = be.ExecAPI.SetKeysAsAlians4Select(output.kv, SELECT_OBJ_PAIR);
                    out1 = be.ExecAPI.SetKeysAsAlians4Select(output.kv, SELECT_OBJ_PAIR_GROUP);
                    out = $.extend(out, out1);
                    out.selectedField = output.kv.selectedField;

                    try {
                        var _obj = {};
                        var _selectedField = out.selectedField.split(",");
                        for (var i in _selectedField) {
                            _obj[_selectedField[i]] = _selectedField[i];
                        }
                        var _kv2 = be.ExecAPI.SetKeysAsAlians4Select(_obj, SELECT_OBJ_PAIR);
                        var _kv3 = be.ExecAPI.SetKeysAsAlians4Select(_obj, SELECT_OBJ_PAIR_GROUP);
                        _obj = $.extend(_kv2, _kv3);
                        var _key = Object.keys(_obj);

                        out.selectedField = _key.toString();
                    } catch (err) {
                        console.log(err)
                    }

                    try {
                        var rc = (output.tbl[0].r && output.tbl[0].r.length > 0)
                                ? output.tbl[0].r.length
                                : 0;

                        var rsOut = [];
                        for (var k = 0; k < rc; k++) {
                            var kv1 = output.tbl[0].r[k];
                            var kv2 = be.ExecAPI.SetKeysAsAlians4Select(kv1, SELECT_OBJ_PAIR);
                            var kv3 = be.ExecAPI.SetKeysAsAlians4Select(kv1, SELECT_OBJ_PAIR_GROUP);
                            kv2 = $.extend(kv2, kv3);
                            rsOut.push(kv2)
                        }
                        output.tbl[0].r = rsOut;

                        out['_table'] = output.tbl[0];
                    } catch (err) {
                    }
                    var b = $.extend(res, out);
                    res = b;
                    try {
                        if (output.err.length > 0) {
                            be.AJAXCallFeedback(output.err, element, apiId, "input");
                        }
                    } catch (e) {
                    }

                    //call function
                    try {
                        if (asyncData && asyncData.fn) {
                            var res = eval(asyncData.fn)(element, out, asyncData);
                        } else {
                            //                            var id = $(element).attr('id');
                            //                            var el1 = document.getElementById(id);
                            triggerAPIAfter(element, apiId, out, dataJSON.kv);
                        }
                    } catch (err) {
                        console.log(err);
                    }


                    var res1 = {};
                    var res2 = {};
                    try {
                        res1 = dataJSON.kv;
                        res2 = res.kv;
                    } catch (err) {
                    }
                    var dt = $.extend(res1, res2);
                    dt = $.extend(dt, out);
                    for (var i = 0; i < SEND_TO_BACKLOG_ID.length; i++) {
                        if (SEND_TO_BACKLOG_ID[i]) {
                            try {
                                be.callApi(SEND_TO_BACKLOG_ID[i], dt, element, asyncData);
                            } catch (err) {
                                //                                console.log(err);
                            }
                        }
                    }


                    be.ShowOutData4Debug(apiId, dt);
                }
            });
            return rs;
        }
    },

    AddDbDescriptionField: function (apiId) {
        var data = {};
        var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
        for (var i in outputList) {
            try {
                var oid = outputList[i];
                oid = oid.trim();
                var inputObj = SAInput.getInputObject(oid);
                if (inputObj.inputType === 'OUT') {
                    //                    var inputDescIds = SAInput.getInputDetails(inputObj.id, 'inputDescriptionIds').split(',');
                    var inputDescIds = SAInput.DescriptionId[inputObj.id];
                    for (var j in inputDescIds) {
                        try {
                            var descId = inputDescIds[j].trim();
                            var descBody = SAInputDesc.GetDetails(descId);


                            if (descBody.includes('fn_(iscurrentuser)')) {
                                data['currentUserField'] = data['currentUserField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(iscurrentdate)')) {
                                data['currentDateField'] = data['currentDateField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(iscurrenttime)')) {
                                data['currentTimeField'] = data['currentTimeField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(ismaximumvalue)')) {
                                data['isMaximumField'] = data['isMaximumField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(isminimumvalue)')) {
                                data['isMinimumField'] = data['isMinimumField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(isrowcount)')) {
                                data['isCountField'] = data['isCountField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(isaveragevalue)')) {
                                data['isAverageField'] = data['isAverageField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(issummary)')) {
                                data['isSumField'] = data['isSumField'] + ',' + inputObj.inputName;
                            }
                        } catch (err1) {

                        }
                    }
                }
            } catch (err) {
            }
        }
        return data;
    },
    AddDbDescriptionField4IN: function (apiId) {
        var data = {};
        var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
        for (var i in outputList) {
            try {
                var oid = outputList[i];
                oid = oid.trim();
                var inputObj = SAInput.getInputObject(oid);
                if (inputObj.inputType === 'IN') {
                    //                    var inputDescIds = SAInput.getInputDetails(inputObj.id, 'inputDescriptionIds').split(',');
                    var inputDescIds = SAInput.DescriptionId[inputObj.id];
                    for (var j in inputDescIds) {
                        try {
                            var descId = inputDescIds[j].trim();
                            var descBody = SAInputDesc.GetDetails(descId);


                            if (descBody.includes('fn_(iscurrentuser)')) {
                                data['currentUserField'] = data['currentUserField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(iscurrentdate)')) {
                                data['currentDateField'] = data['currentDateField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(iscurrenttime)')) {
                                data['currentTimeField'] = data['currentTimeField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(ismaximumvalue)')) {
                                data['isMaximumField'] = data['isMaximumField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(isminimumvalue)')) {
                                data['isMinimumField'] = data['isMinimumField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(isrowcount)')) {
                                data['isCountField'] = data['isCountField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(isaveragevalue)')) {
                                data['isAverageField'] = data['isAverageField'] + ',' + inputObj.inputName;
                            } else if (descBody.includes('fn_(issummary)')) {
                                data['isSumField'] = data['isSumField'] + ',' + inputObj.inputName;
                            }
                        } catch (err1) {

                        }
                    }
                }
            } catch (err) {
            }
        }
        return data;
    },
    AddDbDescriptionField4InsertUpdate: function (apiId, pairData) {
        var data = {};
        var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
        for (var i in outputList) {
            try {
                var oid = outputList[i];
                oid = oid.trim();
                var inputObj = SAInput.getInputObject(oid);
                if (inputObj.inputType === 'OUT') {
                    //                    var inputDescIds = SAInput.getInputDetails(inputObj.id, 'inputDescriptionIds').split(',');
                    var inputDescIds = SAInput.DescriptionId[inputObj.id];
                    for (var j in inputDescIds) {
                        try {
                            var descId = inputDescIds[j].trim();
                            var descBody = SAInputDesc.GetDetails(descId);
                            var inputName = (pairData[inputObj.inputName])
                                    ? pairData[inputObj.inputName]
                                    : inputObj.inputName;

                            if (descBody.includes('fn_(iscurrentuser)')) {
                                data['currentUserField'] = data['currentUserField'] + ',' + inputName;
                            } else if (descBody.includes('fn_(iscurrentdate)')) {
                                data['currentDateField'] = data['currentDateField'] + ',' + inputName;
                            } else if (descBody.includes('fn_(iscurrenttime)')) {
                                data['currentTimeField'] = data['currentTimeField'] + ',' + inputName;
                            } else if (descBody.includes('fn_(ismaximumvalue)')) {
                                data['isMaximumField'] = data['isMaximumField'] + ',' + inputName;
                            } else if (descBody.includes('fn_(isminimumvalue)')) {
                                data['isMinimumField'] = data['isMinimumField'] + ',' + inputName;
                            } else if (descBody.includes('fn_(isrowcount)')) {
                                data['isCountField'] = data['isCountField'] + ',' + inputName;
                            } else if (descBody.includes('fn_(isaveragevalue)')) {
                                data['isAverageField'] = data['isAverageField'] + ',' + inputName;
                            } else if (descBody.includes('fn_(issummary)')) {
                                data['isSumField'] = data['isSumField'] + ',' + inputName;
                            }
                        } catch (err1) {

                        }
                    }
                }
            } catch (err) {
            }
        }
        return data;
    },
    ValidateApi: function (apiId, data, element) {
        var err = [];
        var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
        for (var i in outputList) {
            try {
                var oid = outputList[i];
                oid = oid.trim();
                var inputObj = SAInput.getInputObject(oid);
                if (inputObj.inputType === 'OUT') {
                    //                    var inputDescIds = SAInput.getInputDetails(inputObj.id, 'inputDescriptionIds').split(',');
                    var inputDescIds = SAInput.DescriptionId[inputObj.id];
                    for (var j in inputDescIds) {
                        try {
                            var descId = inputDescIds[j].trim();
                            var descBody = SAInputDesc.GetDetails(descId);
                            if (descBody.includes('fn_(ismandatory)')) {
                                if (!(data[inputObj.inputName] && data[inputObj.inputName].trim().length > 0)) {
                                    var kv = {};
                                    kv.code = inputObj.inputName;
                                    kv.val = 'Value is not entered!'
                                    err.push(kv);
                                }
                            }
                        } catch (err1) {

                        }
                    }
                }
            } catch (err) {
            }
        }
        be.AJAXCallFeedback(err, element, apiId, 'output');
        return err;
    },
    ValidateApiOnInput: function (apiId, data, element) {
        var err = [];
        var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
        for (var i in outputList) {
            try {
                var oid = outputList[i];
                oid = oid.trim();
                var inputObj = SAInput.getInputObject(oid);
                if (inputObj.inputType === 'IN') {
                    //                    var inputDescIds = SAInput.getInputDetails(inputObj.id, 'inputDescriptionIds').split(',');
                    var inputDescIds = SAInput.DescriptionId[inputObj.id];
                    for (var j in inputDescIds) {
                        try {
                            var descId = inputDescIds[j].trim();
                            var descBody = SAInputDesc.GetDetails(descId);
                            if (descBody.includes('fn_(ismandatory)')) {
                                if (!(data[inputObj.inputName] && data[inputObj.inputName].trim().length > 0)) {
                                    var kv = {};
                                    kv.code = inputObj.inputName;
                                    kv.val = 'Value is not entered!'
                                    err.push(kv);
                                }
                            }

                            if (descBody.includes('fn_(Defaultvalueis)')) {
                                data[inputObj.inputName] = getParamFromFnline(descBody, 'fn_(Defaultvalueis)', 'defaultval')
                            }




                        } catch (err1) {

                        }
                    }
                }
            } catch (err) {
            }
        }
        be.AJAXCallFeedback(err, element, apiId, "input");
        return err;
    },
    ApiValidation: {
        IsMandatory: function (apiId) {

        }
    },
    ShowErrorInGUIDuringDebugMode: function (apiId, senderPart, field, processId) {
        try {
            $('[pid=core_api_' + apiId + ']').addClass('debug-error-class')
        } catch (err) {
        }
        try {
            if (senderPart === 'input') {
                $('[pid=core_api_' + apiId + ']').find('.api-input-list').first()
                        .find('[idx=' + field.trim() + ']').addClass('debug-error-class-input')
            }

            if (senderPart === 'output') {
                $('[pid=core_api_' + apiId + ']').find('.api-output-list').first()
                        .find('[idx=' + field.trim() + ']').addClass('debug-error-class-input')
            }

            if (senderPart === 'process') {
                $('[pid=core_api_desc_' + processId + ']').addClass('debug-error-class-input')
            }
        } catch (err) {
        }

    },
    AJAXCallFeedback: function (err, element, apiId, senderPart, processId) {

        var msgError = "";
        if ((err.length) && err.length > 0) {
            //there are/is errors
            for (var i in err) {
                be.ShowErrorInGUIDuringDebugMode(apiId, senderPart, err[i].code, processId);

                if (err[i].code === 'general') {

                    Toaster.showError(err[i].val);
                    msgError = err[i].val;
                    //return;
                } else {
                    var f = false;
                    $(element).closest('div.redirectClass')
                            .find('[sa-selectedfield*="' + err[i].code + '"]').each(function () {
                        var fieldList = $(this).attr('sa-selectedfield').split(',');
                        if (fieldList.includes(err[i].code)) {
                            var id = makeId(10);

                            f = true;
                            $(this).closest('div')
                                    .find('.apd-form-error-msg').remove();
                            $(this).after('<p class=\'apd-form-error-msg\' id="'
                                    + id + '">' + err[i].val + '</p>');

                            setTimeout(function () {
                                $('#' + id).remove();
                            }, 3000);
                        }
                    })

                    //eyni code-lu component vardir;
                    if (!f) {
                        msgError = err[i].val + "! Error Code: " + err[i].code;
                        Toaster.showError(msgError);

                    }
                }
            }
            throw 'There is/are error(s), message:' + msgError;
        }
    }
}

