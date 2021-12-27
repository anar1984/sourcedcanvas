/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var SAEntity = {
    "Databases": {},
    "Tables": {},
    "Fields": {},
    TableFields: {},
    DBTables: {},
    TableDBs: {},
    "FieldRel": {},

    SetTableFields: function (tableId, InputId) {
        if (tableId in this.TableFields) {
            if (!this.TableFields[tableId].includes(InputId))
                this.TableFields[tableId] = this.TableFields[tableId] + ',' + InputId;
        } else {
            this.TableFields[tableId] = InputId;
        }
    },
    SetDBTables: function (dbId, tableId) {
        if (dbId in this.DBTables) {
            if (!this.DBTables[dbId].includes(tableId))
                this.DBTables[dbId] = this.DBTables[dbId] + ',' + tableId;
        } else {
            this.DBTables[dbId] = tableId;
        }
    },
    SetTableDBs: function (tableId, dbId) {
        if (tableId in this.TableDBs) {
            if (!this.TableDBs[tableId].includes(dbId))
                this.TableDBs[tableId] = this.TableDBs[tableId] + ',' + dbId;
        } else {
            this.TableDBs[tableId] = dbId;
        }
    },
    SetFieldRels: function (fromFieldId, toFieldId) {
        if (fromFieldId in this.FieldRel) {
            if (!this.FieldRel[fromFieldId].includes(toFieldId))
                this.FieldRel[fromFieldId] = this.FieldRel[fromFieldId] + ',' + toFieldId;
        } else {
            this.FieldRel[fromFieldId] = toFieldId;
        }
    },
    updateEntireDb: function (id, object) {
        try {
            this.Databases[id] = object;
        } catch (e) {
        }
    },
    updateEntireFieldRel: function (id, object) {
        try {
            this.FieldRel[id] = object;
        } catch (e) {
        }
    },

    updateEntireTable: function (id, object) {
        try {
            this.Tables[id] = object;
        } catch (e) {
        }
    },
    updateEntireField: function (id, object) {
        try {
            this.Fields[id] = object;
        } catch (e) {
        }
    },

    updateDbByRes: function (res) {
        var idx = getIndexOfTable(res, "dbList");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.updateEntireDb(o.id, o);
        }
    },

    updateFieldRelByRes: function (res) {
        try {
            var idx = getIndexOfTable(res, "fieldRelList");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.SetFieldRels(o.fromFieldId, o.toFieldId);
            }
        } catch (err) {
        }
    },

    updateTableByRes: function (res) {
        var idx = getIndexOfTable(res, "tableList");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.SetTableDBs(o.id, o.fkDbId);
            this.SetDBTables(o.fkDbId, o.id);
            this.updateEntireTable(o.id, o);
        }
    },

    updateFieldByRes: function (res) {
        var idx = getIndexOfTable(res, "fieldList");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.SetTableFields(o.fkTableId, o.id);
            this.updateEntireField(o.id, o);
        }
    },

    deleteDb: function (id) {
        try {
            delete this.Databases[id];
        } catch (e) {
        }
    },

    deleteTable: function (id) {
        try {
            delete this.Tables[id];
        } catch (e) {
        }
    },

    deleteField: function (id) {
        try {
            delete this.Fields[id];
        } catch (e) {
        }
    },

    Load: function (res) {
        try {
            this.Databases = {};
            this.Tables = {};
            this.Fields = {};
            this.FieldRel = {};
            this.updateDbByRes(res);
            this.updateTableByRes(res);
            this.updateFieldByRes(res);
            this.updateFieldRelByRes(res);
        } catch (err) {
        }
    },
    LoadNew: function (res) {
        try {

            this.updateDbByRes(res);
            this.updateTableByRes(res);
            this.updateFieldByRes(res);
            this.updateFieldRelByRes(res);
        } catch (err) {
        }
    },

    GetOrderNoKeys: function () {
//        const ordered = {};
//        Object.keys(SACore.BacklogNo).sort().forEach(function (key) {
//            ordered[key] = SACore.BacklogNo[key];
//        });
        var keys = Object.keys(SATask.OrderNo);
        keys = keys.sort(function (a, b) {
            return a - b
        });

        return keys;
    },

    GetDBDetails: function (objId, param) {
        try {
            objId = objId.trim();
            return this.Databases[objId][param]
        } catch (e) {
        }
        return "";
    },
    GetTableDetails: function (objId, param) {
        try {
            objId = objId.trim();
            return this.Tables[objId][param];
        } catch (e) {
        }
        return "";
    },
    GetFieldDetails: function (objId, param) {
        try {
            objId = objId.trim();
            return this.Fields[objId][param];
        } catch (e) {
        }
        return "";
    },

}




var SAProjectUser = {
    "ProjectUsers": {},
    "Users": {},
    "OrderNo": {},

    updateEntireProjectUser: function (backlogId, object) {
        try {
            this.ProjectUsers[backlogId] = object;
        } catch (e) {
        }
    },
    updateProjectUserByRes: function (res) {
        var idx = 0;
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.SetOrderNo(o.taskOrderNo, o.id);
            this.updateEntireProjectUser(o.fkUserId, o);
        }
    },
    addProjectUserByRes: function (res) {
        var idx = 0;
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.AddProjectUser(o);
        }
    },
    deleteProjectUser: function (backlogId) {
        try {
            delete this.ProjectUsers[backlogId];
        } catch (e) {
        }
    },
    LoadProjectUser: function (res) {
        try {
            this.ProjectUsers = {};
            this.OrderNo = {};
            var idx = 0;
            var obj = res.tbl[idx].r;

            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddProjectUser(o);
            }
        } catch (err) {
        }
    },
    LoadUser: function (res) {
        try {
            this.Users = {};
            var idx = 0;
            var obj = res.tbl[idx].r;

            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddUser(o);
            }
        } catch (err) {
        }
    },

    GetOrderNoKeys: function () {
//        const ordered = {};
//        Object.keys(SACore.BacklogNo).sort().forEach(function (key) {
//            ordered[key] = SACore.BacklogNo[key];
//        });
        var keys = Object.keys(SAProjectUser.OrderNo);
        keys = keys.sort(function (a, b) {
            return a - b
        });

        return keys;
    },

    GetKeys: function () {
        var keys = Object.keys(this.ProjectUsers);
        return keys;
    },

    RemoveFromOrderNo: function (taskId) {
        var keys = Object.keys(this.OrderNo);
        for (var i = 0; i < keys.length; i++) {
            var idLn = this.OrderNo[keys[i]].replace(taskId, '');
            this.OrderNo[keys[i]] = idLn;
        }
    },

    SetOrderNo: function (orderNo, taskId) {
        orderNo = (orderNo) ? orderNo : "0";

        if (orderNo in this.OrderNo) {
            if (!this.OrderNo[orderNo].includes(taskId))
                this.OrderNo[orderNo] = this.OrderNo[orderNo] + ',' + taskId;
        } else {
            this.OrderNo[orderNo] = taskId;
        }
    },

    toJSONObject: function (taskId) {
        var json = {"tbl": [{"r": []}]};
        var o = this.ProjectUsers[taskId];
        return o;
    },
    toCurrentDescJSON: function () {
        return this.toDescJSON(global_var.current_us_input_id);
    },
    toDescJSON: function (inputId) {
        var json = {"tbl": [{"r": []}]};
        var keys = SAInput.GetCurrentProjectUser();
        var idx = 0;
        try {
            for (var n = 0; n < keys.length; n++) {
                var k = keys[n];
                k = k.trim();
                var o = this.ProjectUsers[k];
                json.tbl[0].r.push(o);
                idx++;
            }
        } catch (err) {
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    getDescriptionByIn: function (inputId) {
        var res = "";

        try {
            var keys = SAInput.GetProjectUser(inputId);
            for (var n = 0; n < keys.length; n++) {
                var k = keys[n];
                k = k.trim();
                var o = this.ProjectUsers[k].description;
                res += o + "%IN%";
            }
        } catch (err) {
        }
        return res;
    },
    toJSON: function () {
        var json = {"tbl": [{"r": []}]};
        var keys = Object.keys(this.ProjectUsers);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            var o = this.ProjectUsers[k];
//            if (this.checkFilter(o)) {
//                continue;
//            }
            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    GetDetails: function (objId, param) {
        try {
            objId = objId.trim();
            return this.ProjectUsers[objId][param];
        } catch (e) {
            return "";
        }

    },
    GetUserDetails: function (userId, param) {
        try {
            userId = userId.trim();
            return this.Users[userId][param];
        } catch (e) {
            return "";
        }

    },
    GetObject: function (objId) {
        try {
            objId = objId.trim();
        } catch (e) {
        }
        return this.ProjectUsers[objId];
    },

    AddProjectUser: function (obj) {
        this.ProjectUsers[obj.fkUserId] = obj;
    },
    AddUser: function (obj) {
        this.Users[obj.id] = obj;
    },
    AddProjectUsers: function (obj) {
        this.ProjectUsers[obj.id] = obj;
    }

}

var SATask = {
    "Tasks": {},
    "OrderNo": {},

    checkFilter: function (object) {
        var o = object;
        var continueOr = false;

        if (global_var.userStoryFilter.backlogStatus.length > 0 &&
                !global_var.userStoryFilter.backlogStatus.includes(o.taskStatus))
            continueOr = true;
        if (global_var.userStoryFilter.createdBy.length > 0 &&
                !global_var.userStoryFilter.createdBy.includes(o.createdBy))
            continueOr = true;
        if (global_var.userStoryFilter.assignee.length > 0 &&
                !SACore.hasAssigneeInFilter(o.fkAssigneeId))
            continueOr = true;
        if (global_var.userStoryFilter.taskType.length > 0 &&
                !SACore.hasTaskTypesInFilter(o.fkTaskTypeId))
            continueOr = true;


        var userstoryname = o.taskName.toLowerCase();
        if (global_var.userStoryFilter.userstory.length > 0 &&
                !(userstoryname.includes(global_var.userStoryFilter.userstory.toLowerCase())))
            continueOr = true;

        return continueOr;
    },

    updateEntireTask: function (backlogId, object) {
        try {
            this.Tasks[backlogId] = object;
        } catch (e) {
        }
    },
    updateTaskByRes: function (res) {
        var idx = getIndexOfTable(res, "taskListTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.SetOrderNo(o.taskOrderNo, o.id);
            this.updateEntireTask(o.id, o);
        }
    },

    addTaskByRes: function (res) {
        var idx = getIndexOfTable(res, "taskListTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.AddTask(o);
        }
    },
    deleteTask: function (backlogId) {
        try {
            delete this.Tasks[backlogId];
        } catch (e) {
        }
    },
    LoadTask: function (res) {
        try {
            this.Tasks = {};
            this.OrderNo = {};
            var idx = getIndexOfTable(res, "taskListTable");
            var obj = res.tbl[idx].r;

            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.SetOrderNo(o.taskOrderNo, o.id);
                this.AddTask(o);
            }
        } catch (err) {
        }
    },

    GetOrderNoKeys: function () {
//        const ordered = {};
//        Object.keys(SACore.BacklogNo).sort().forEach(function (key) {
//            ordered[key] = SACore.BacklogNo[key];
//        });
        var keys = Object.keys(SATask.OrderNo);
        keys = keys.sort(function (a, b) {
            return a - b
        });

        return keys;
    },

    RemoveFromOrderNo: function (taskId) {
        var keys = Object.keys(this.OrderNo);
        for (var i = 0; i < keys.length; i++) {
            var idLn = this.OrderNo[keys[i]].replace(taskId, '');
            this.OrderNo[keys[i]] = idLn;
        }
    },

    SetOrderNo: function (orderNo, taskId) {
        orderNo = (orderNo) ? orderNo : "0";

        if (orderNo in this.OrderNo) {
            if (!this.OrderNo[orderNo].includes(taskId))
                this.OrderNo[orderNo] = this.OrderNo[orderNo] + ',' + taskId;
        } else {
            this.OrderNo[orderNo] = taskId;
        }
    },

    toJSONObject: function (taskId) {
        var json = {"tbl": [{"r": []}]};
        var o = this.Tasks[taskId];
        return o;
    },
    toCurrentDescJSON: function () {
        return this.toDescJSON(global_var.current_us_input_id);
    },
    toDescJSON: function (inputId) {
        var json = {"tbl": [{"r": []}]};
        var keys = SAInput.GetCurrentTask();
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            k = k.trim();
            var o = this.Tasks[k];
            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    getDescriptionByIn: function (inputId) {
        var res = "";

        try {
            var keys = SAInput.GetTask(inputId);
            for (var n = 0; n < keys.length; n++) {
                var k = keys[n];
                k = k.trim();
                var o = this.Tasks[k].description;
                res += o + "%IN%";
            }
        } catch (err) {
        }
        return res;
    },
    toJSON: function () {
        var json = {"tbl": [{"r": []}]};
        var keys = Object.keys(this.Tasks);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            var o = this.Tasks[k];
//            if (this.checkFilter(o)) {
//                continue;
//            }
            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    GetDetails: function (objId, param) {
        try {
            objId = objId.trim();
            return this.Tasks[objId][param];
        } catch (e) {
            return "";
        }

    },

    AddTask: function (obj) {
        this.Tasks[obj.id] = obj;
    },
    AddTasks: function (obj) {
        this.Tasks[obj.id] = obj;
    }

}


var SACore = {
    "PinnedImages": {},
    "Project": {},
    "ProjectCore": {},
    "BacklogNo": {},
    "BacklogNames": {},
    "Backlogs": {},
    "Labels": {},
    "Assignees": {},
    "Sprints": {},
    "TaskTypes": {},
    "AssignedLabels": {},
    "SUSs": [],
    "APIs": [],
    "MyUSs": [],
    "BoundUSs": [],
    "InitialUSs": [],
    AddProject: function (pid, pname) {
        this.Project[pid] = pname;
    },
    AddProjectCore: function (pid, obj) {
        this.ProjectCore[pid] = obj;
    },
    GetProjectKeys: function () {
        return Object.keys(this.Project);
    },
    GetProjectCore: function (id) {
        return this.ProjectCore[id];
    },
    GetProjectName: function (id) {
        return this.Project[id];
    },
    updateBacklog: function (backlogId, key, value) {
        try {
            this.Backlogs[backlogId][key] = value;
        } catch (e) {
        }
    },
    updateEntireBacklog: function (backlogId, object) {
        try {
            this.Backlogs[backlogId] = object;
        } catch (e) {
        }
    },
    updateBacklogDescriptionByRes: function (res) {
        try {
            var idx = getIndexOfTable(res, "backlogDescList");
            var obj = res.tbl[idx].r;
            this.updateBacklogDescriptionByResDEtails(obj) 
        } catch (errr) {
        }
    },
     updateBacklogDescriptionByResDEtails: function (res) {
        try {
            var obj = res;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                cr_project_desc[o.id] = o;

                if (!cr_project_desc_by_backlog[o.fkBacklogId]) {
                    cr_project_desc_by_backlog[o.fkBacklogId] = [];
                }

                if (!cr_project_desc_by_backlog[o.fkBacklogId].includes(o.id))
                    cr_project_desc_by_backlog[o.fkBacklogId].push(o.id);

            }
        } catch (errr) {
        }
    },
    updateBacklogByRes: function (res) {
        try {
            var idx = getIndexOfTable(res, "userStoryTable");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.updateEntireBacklog(o.id, o);
            }
        } catch (errr) {
        }
    },
    addBacklogByRes: function (res) {
        var idx = getIndexOfTable(res, "userStoryTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.AddBacklog(o.id, o);
        }
    },
    addInputToBacklog: function (backlogId, inputId) {

        try {
            if (this.Backlogs[backlogId].inputIds) {
                this.Backlogs[backlogId].inputIds =
                        this.Backlogs[backlogId].inputIds + ',' + inputId;
            } else {
                this.Backlogs[backlogId]['inputIds'] = inputId;
            }
        } catch (err) {
            this.Backlogs[backlogId]['inputIds'] = inputId;
        }
    },
    deleteBacklog: function (backlogId) {
        try {
            delete this.Backlogs[backlogId];
        } catch (e) {
        }
    },
    LoadBacklog: function (res) {
        try {
            this.ClearAllFilledCombobox();
            this.Backlogs = {};
            this.BacklogNo = {};
            this.BacklogName = {};
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.BacklogName[o.backlogName] = o.id;
                this.AddBacklog(o.id, o);
                this.SetBacklogNo(o.backlogNo, o.id);
//                if (o.isSourced === '1') {
                    this.AddSUSs(o.id);
                    this.FillSUSCombobox(o);
//                }
            }
            this.SortFilledCombos();
        } catch (err) {
        }

        try {
            this.PinnedImages = res.kv;
        } catch (err) {
        }
    },
    GetBacklogNoKeys: function () {
//        const ordered = {};
//        Object.keys(SACore.BacklogNo).sort().forEach(function (key) {
//            ordered[key] = SACore.BacklogNo[key];
//        });
        var keys = Object.keys(SACore.BacklogNo);
        keys = keys.sort(function (a, b) {
            return a - b
        });

        return keys;
    },

    RemoveFromBacklogNo: function (backlogId) {
        var keys = Object.keys(this.BacklogNo);
        for (var i = 0; i < keys.length; i++) {
            var idLn = this.BacklogNo[keys[i]].replace(backlogId, '');
            this.BacklogNo[keys[i]] = idLn;
        }
    },

    SetBacklogNo: function (backlogNo, bid) {
        backlogNo = (backlogNo) ? backlogNo : "0";

        if (backlogNo in this.BacklogNo) {
            if (!this.BacklogNo[backlogNo].includes(bid))
                this.BacklogNo[backlogNo] = this.BacklogNo[backlogNo] + ',' + bid;
        } else {
            this.BacklogNo[backlogNo] = bid;
        }
    },

    FillAllSelectBox: function () {
        try {
            this.ClearAllFilledCombobox();
            var keys = this.GetBacklogKeys();
            for (var n = 0; n < keys.length; n++) {
                var id = keys[n];
                var o = this.Backlogs[id];
//                if (o.isSourced === '1') {
                    this.AddSUSs(o.id);
                    this.FillSUSCombobox(o);
//                }
            }
            this.SortFilledCombos();
        } catch (err) {
        }
    },
    IsImagePinned: function (imageId) {
        var f = false;
        try {
            if (this.PinnedImages[imageId] === '1') {
                f = true;
            }
        } catch (e) {
        }
        return f;
    },
    SetPinnedImageFalse: function (imageId) {
        this.PinnedImages[imageId] = '0';
    },
    SetPinnedImageTrue: function (imageId) {
        this.PinnedImages[imageId] = '1';
    },
    ClearAllFilledCombobox: function () {
        this.ClearFilledSUSCombobox();
    },
    SortFilledCombos: function () {
        sortCombo('us-gui-component-rel-sus-id');
        sortCombo('us-related-sus');
        $('#us-related-sus').selectpicker('refresh');
//        $('.us-gui-component-rel-sus-id').selectpicker('refresh');
    },
    FillAllCombobox: function (obj) {
        this.FillSUSCombobox(obj);
    },
    ClearFilledSUSCombobox: function () {
        $('#us-gui-component-rel-sus-id').html('');
        $('#us-related-sus').html('');

        $('#us-gui-component-rel-sus-id').append($("<option></option>")
                .attr("value", '')
                .text(' '));
        $('#us-related-sus').append($("<option></option>")
                .attr("value", '')
                .text(' '));



    },
    FillSUSCombobox: function (obj) {
        $('#us-gui-component-rel-sus-id').append($("<option></option>")
                .attr("value", obj.id)
                .text(replaceTags(obj.backlogName) + "  #" + obj.orderNo + " "));

        $('#us-related-sus').append($("<option></option>")
                .attr("value", obj.id)
                .text(replaceTags(obj.backlogName) + "  #" + obj.orderNo + " "));

    },
    FillInCombo: function (compId) {
        try {
            $('#' + compId).html('');

            var keys = Object.keys(SACore.BacklogName);
            keys = keys.sort();

            $('#' + compId)
                    .append($('<option>')
                            .val("-1")
                            .text("None"))
            for (var n = 0; n < keys.length; n++) {
                var name = keys[n];
                var id = this.BacklogName[name];
                name += "  (#" + this.GetBacklogOrderNo(id) + ")"
                $('#' + compId)
                        .append($('<option>')
                                .val(id)
                                .text(name))
            }

        } catch (err) {
        }

    },
    toJSON: function () {
        var json = {"tbl": [{"r": []}]};
        var keys = Object.keys(this.Backlogs);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            var o = this.Backlogs[k];
//            if (this.checkFilterUserStory(o)) {
//                continue;
//            }

            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },

    toJSONObject: function (backlogId) {
        var json = {"tbl": [{"r": []}]};
        var o = this.Backlogs[backlogId];
        return o;
    },

    toJSON4View: function () {
        var json = {"tbl": [{"r": []}]};
        var keys = Object.keys(this.Backlogs);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            var o = this.Backlogs[k];
            if (this.checkFilter4View(o)) {
                continue;
            }

            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },

    checkFilter: function (object) {
        var o = object;
        var continueOr = false;
        if (global_var.userStoryFilter.isSourced === '1' && o.isSourced !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.isAPI === '1' && o.isApi !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.isBounded === '1' && o.isBounded !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.isInitial === '1' && o.isInitial !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.isInitial === '1' && o.isInitial !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.priority.length > 0 &&
                !global_var.userStoryFilter.priority.includes(o.priority))
            continueOr = true;
        if (global_var.userStoryFilter.backlogStatus.length > 0 &&
                !global_var.userStoryFilter.backlogStatus.includes(o.backlogStatus))
            continueOr = true;
        if (global_var.userStoryFilter.createdBy.length > 0 &&
                !global_var.userStoryFilter.createdBy.includes(o.createdBy))
            continueOr = true;
        if (global_var.userStoryFilter.assignee.length > 0 &&
                !this.hasAssigneeInFilter(o.assigneeIds))
            continueOr = true;
        if (global_var.userStoryFilter.owner.length > 0 &&
                !this.hasOwnerInFilter(o.fkOwnerId))
            continueOr = true;
        if (global_var.userStoryFilter.taskType.length > 0 &&
                !this.hasTaskTypesInFilter(o.taskTypeIds))
            continueOr = true;
        if (global_var.userStoryFilter.assignedLabel.length > 0 &&
                !this.hasAssignedLabelsInFilter(o.assignedLabelIds))
            continueOr = true;
        if (global_var.userStoryFilter.label.length > 0 &&
                !this.hasLabelsInFilter(o.labelIds))
            continueOr = true;
        if (global_var.userStoryFilter.sprint.length > 0 &&
                !this.hasSprintsInFilter(o.sprintIds))
            continueOr = true;

        var userstoryname = o.backlogName.toLowerCase();
        if (global_var.userStoryFilter.userstory.length > 0 &&
                !(userstoryname.includes(global_var.userStoryFilter.userstory.toLowerCase()) ||
                        o.orderNo.includes(global_var.userStoryFilter.userstory) ||
                        o.createdByName.includes(global_var.userStoryFilter.userstory)
                        )
                )
            continueOr = true;

        return continueOr;
    },

    checkFilterUserStory: function (object) {
        var o = object;
        var continueOr = false;
        if (global_var.userStoryFilter.isSourced === '1' && o.isSourced !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.isAPI === '1' && o.isApi !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.isBounded === '1' && o.isBounded !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.isInitial === '1' && o.isInitial !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.isInitial === '1' && o.isInitial !== '1')
            continueOr = true;
        if (global_var.userStoryFilter.priority.length > 0 &&
                !global_var.userStoryFilter.priority.includes(o.priority))
            continueOr = true;
        if (global_var.userStoryFilter.backlogStatus.length > 0 &&
                !global_var.userStoryFilter.backlogStatus.includes(o.backlogStatus))
            continueOr = true;
        if (global_var.userStoryFilter.createdBy.length > 0 &&
                !global_var.userStoryFilter.createdBy.includes(o.createdBy))
            continueOr = true;
        try {
            if (global_var.userStoryFilter.owner.length > 0 &&
                    !global_var.userStoryFilter.owner.includes(o.fkOwnerId))
                continueOr = true;
        } catch (err) {
        }

        if (global_var.userStoryFilter.assignedLabel.length > 0 &&
                !this.hasAssignedLabelsInFilter(o.assignedLabelIds))
            continueOr = true;
        if (global_var.userStoryFilter.label.length > 0 &&
                !this.hasLabelsInFilter(o.labelIds))
            continueOr = true;
        if (global_var.userStoryFilter.sprint.length > 0 &&
                !this.hasSprintsInFilter(o.sprintIds))
            continueOr = true;

        var userstoryname = o.backlogName.toLowerCase();
        if (global_var.userStoryFilter.userstory.length > 0 &&
                !(userstoryname.includes(global_var.userStoryFilter.userstory.toLowerCase()) ||
                        o.orderNo.includes(global_var.userStoryFilter.userstory) ||
                        o.createdByName.includes(global_var.userStoryFilter.userstory)
                        )
                )
            continueOr = true;

        return continueOr;
    },

    checkFilter4View: function (object) {
        var o = object;
        var continueOr = false;

        var userstoryname = o.backlogName.toLowerCase();
        if (global_var.userStoryFilter.userstory.length > 0 &&
                !(userstoryname.includes(global_var.userStoryFilter.userstory.toLowerCase()) ||
                        o.orderNo.includes(global_var.userStoryFilter.userstory) ||
                        o.createdByName.includes(global_var.userStoryFilter.userstory)
                        )
                )
            continueOr = true;
        return continueOr;
    },
    hasSprintsInFilter: function (coreList) {
        var f = false;
        try {
            var itemList = global_var.userStoryFilter.sprint.split('%IN%');
            for (var i = 0; i < itemList.length; i++) {
                if (itemList[i].length > 0 &&
                        coreList.includes(itemList[i]))
                    return true;
            }

        } catch (e) {

        }
        return f;
    },
    hasLabelsInFilter: function (labelList) {
        var f = false;
        try {
            var fileteredAssignedLabelList = global_var.userStoryFilter.label.split('%IN%');
            for (var i = 0; i < fileteredAssignedLabelList.length; i++) {
                if (fileteredAssignedLabelList[i].length > 0 &&
                        labelList.includes(fileteredAssignedLabelList[i]))
                    return true;
            }

        } catch (e) {

        }
        return f;
    },
    hasAssignedLabelsInFilter: function (assignedLabelList) {
        var f = false;
        try {
            var fileteredAssignedLabelList = global_var.userStoryFilter.assignedLabel.split('%IN%');
            for (var i = 0; i < fileteredAssignedLabelList.length; i++) {
                if (fileteredAssignedLabelList[i].length > 0 &&
                        assignedLabelList.includes(fileteredAssignedLabelList[i]))
                    return true;
            }

        } catch (e) {

        }
        return f;
    },
    hasAssigneeInFilter: function (assigneeList) {
        var f = false;
        try {
            var fileteredAssigneedList = global_var.userStoryFilter.assignee.split('%IN%');
            for (var i = 0; i < fileteredAssigneedList.length; i++) {
                if (fileteredAssigneedList[i].length > 0 &&
                        assigneeList.includes(fileteredAssigneedList[i]))
                    return true;
            }

        } catch (e) {

        }
        return f;
    },
    hasOwnerInFilter: function (assigneeList) {
        var f = false;
        try {
            var fileteredAssigneedList = global_var.userStoryFilter.owner.split('%IN%');
            for (var i = 0; i < fileteredAssigneedList.length; i++) {
                if (fileteredAssigneedList[i].length > 0 &&
                        assigneeList.includes(fileteredAssigneedList[i]))
                    return true;
            }
        } catch (e) {
        }
        return f;
    },
    hasTaskTypesInFilter: function (taskTypesList) {
        var f = false;
        try {
            var fileteredTaskTypesList = global_var.userStoryFilter.taskType.split('%IN%');
            for (var i = 0; i < fileteredTaskTypesList.length; i++) {
                if (fileteredTaskTypesList[i].length > 0 &&
                        taskTypesList.includes(fileteredTaskTypesList[i]))
                    return true;
            }

        } catch (e) {

        }
        return f;
    },
    setEmptyMessage4Backlog: function () {
        var st = '<div  style="padding:30px;text-align:center;">';
        st += '<h5> <i class="fa fa-cubes" style="font-size:30px"></i></h5>';
        st += "<h5> No User Story have been found or created on this project</h5>";
        st += "<p>All User Story searched or created on this project will appear here</p>"
        st += "</div>";
        $('#container-us-body').html(st);
    },
    AddBacklog: function (backlogId, obj) {
        this.Backlogs[backlogId] = obj;
    },
    AddInput: function (obj) {
        this.Inputs[obj.id] = obj;
    },

    AddInputDescriptions: function (obj) {
        this.InputDescriptions[obj.id] = obj;
    },
    AddAPI: function (backlogId) {
        this.APIs.push(backlogId);
    },
    AddSUSs: function (backlogId) {
        this.SUSs.push(backlogId);
    },
    AddLabel: function (id, backlogId) {
        if (typeof this.Labels[id] !== 'undefined') {
            this.Labels[id] = [];
        }
        this.Labels[id].push(backlogId);
    },
    GetInputList: function (backlogId) {
        var res = [];
        try {
            res = this.Backlogs[backlogId]['inputIds'].split(',');
        } catch (err) {
        }
        return res;
    },
    GetDescription: function (backlogId) {
        var res = "";
        try {
            res = this.Backlogs[backlogId]['description'];
        } catch (err) {
        }
        return res;
    },
    GetDescriptionSourced: function (backlogId) {
        var res = "";
        try {
            res = this.Backlogs[backlogId]['descriptionSourced'];
        } catch (err) {
        }
        return res;
    },
    GetCurrentDescriptionSourced: function () {
        return this.GetDescriptionSourced(global_var.current_backlog_id);
    },
    GetBacklogname: function (backlogId) {
        loadBacklogDetailsByIdIfNotExist(backlogId)
        var res = "";
        try {
            res = this.Backlogs[backlogId]['backlogName'];
            res = replaceTag(res);
            
        } catch (err) {
        }
        return res;
    },
    GetCurrentBacklogname: function () {
        return this.GetBacklogname(global_var.current_backlog_id);
    },
    GetBacklogOrderNo: function (backlogId) {
        var res = "";
        try {
            res = this.Backlogs[backlogId]['orderNo'];
        } catch (err) {
        }
        return res;
    },
    GetBacklogParam1: function (backlogId) {
        var res = "";
        try {
            res = this.Backlogs[backlogId]['param1'];
        } catch (err) {
        }
        return res;
    },
    GetBacklogDetails: function (backlogId, param) {
        var res = "";
        try {
            res = this.Backlogs[backlogId][param];
        } catch (err) {
        }
        return res;
    },
    GetBacklogKey: function (backlogId, key) {
        var res = "";
        try {
            res = this.Backlogs[backlogId][key];
        } catch (err) {
        }
        return res;
    },

    GetBacklogKeys: function () {
        var keys = [];
        try {
            keys = Object.keys(this.Backlogs);
        } catch (err) {
        }
        return keys;
    },
    GetBaklogFileUrls: function (backlogId) {
        return this.GetBacklogKey(backlogId, "fileUrl");
    },
    GetBaklogFileUrlIds: function (backlogId) {
        return this.GetBacklogKey(backlogId, "fileUrlIds");
    },
    GetCurrentBaklogFileUrls: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "fileUrl");
    },
    GetCurrentBaklogFileUrlIds: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "fileUrlIds");
    },
    GetCurrentBaklogStatus: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "backlogStatus");
    },
    GetCurrentBaklogEstimatedHours: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "estimatedHours");
    },
    GetCurrentBaklogSpentHours: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "spentHours");
    },
    GetCurrentBaklogEstimatedCounter: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "estimatedCounter");
    },
    GetCurrentBaklogExecutedCounter: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "executedCounter");
    },
    GetCurrentBaklogEstimatedBudget: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "estimatedBudget");
    },
    GetCurrentBaklogSpentBudget: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "spentBudget");
    },
    GetCurrentBaklogApiAction: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "apiAction");
    },
    GetCurrentBaklogApiSyncRequest: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "apiSyncRequest");
    },
    GetCurrentBaklogIsShared: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "isBounded");
    },
    GetCurrentBaklogShowPrototype: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "showPrototype");
    },
    GetCurrentBaklogDescriptionSourced: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "descriptionSourced");
    },
    GetCurrentBaklogDescriptionSourced1: function (backlogId) {
        return this.GetBacklogKey(backlogId, "descriptionSourced");
    },
    GetCurrentBaklogDescription: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "description");
    },
    GetCurrentBaklogPriority: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "priority");
    },
    GetCurrentBaklogIsApi: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "isApi");
    },
    GetBaklogIsApi: function (backlogId) {
        return this.GetBacklogKey(backlogId, "isApi");
    },
    GetBaklogAssignedLabel: function (backlogId) {
        return this.GetBacklogKey(backlogId, "assignedLabelIds").split(',');
    },
    GetBaklogNotifiedLabel: function (backlogId) {
        return this.GetBacklogKey(backlogId, "notifiedLabelIds").split(',');
    },
    GetCurrentBaklogProjectName: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "projectName");
    },
    GetCurrentBaklogBecause: function () {
        return this.GetBacklogKey(this.GetCurrentBacklogId(), "backlogBecause");
    },
    GetCurrentBacklogParam1: function () {
        return this.GetBacklogParam1(global_var.current_backlog_id);
    },
    GetCurrentBacklogId: function () {
        var res = global_var.current_backlog_id;
        return res;
    },
    GetBacklogKeyListWithInputs: function () {
        var json = [];

        var keys = Object.keys(this.Backlogs);
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            var o = this.Backlogs[k];
//            console.log(o.inputCount,':',parseFloat(o.inputCount))
            if (o.inputCount.length === 0 || parseFloat(o.inputCount) === 0) {
                continue;
            }
            json.push(k);
        }
        return json;
    },
    GetBacklogKeyList: function () {
        var json = [];

        var keys = Object.keys(this.Backlogs);
//        for (var n = 0; n < keys.length; n++) {
//            var k = keys[n];
//            var o = this.Backlogs[k];
////            console.log(o.inputCount,':',parseFloat(o.inputCount))
//            if (o.inputCount.length === 0 || parseFloat(o.inputCount) === 0) {
//                continue;
//            }
//            json.push(k);
//        }
        return keys;
    }
}


var SAInputDesc = {
    "InputDescriptions": {},
    updateInputDescription: function (backlogId, key, value) {
        try {
            this.InputDescriptions[backlogId][key] = value;
        } catch (e) {
        }
    },
    updateEntireInputDescription: function (backlogId, object) {
        try {
            this.InputDescriptions[backlogId] = object;
        } catch (e) {
        }
    },
    updateInputDescriptionByRes: function (res) {
        var idx = getIndexOfTable(res, "inputDescriptionTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.updateEntireInputDescription(o.id, o);
        }
    },
    addInputDescriptionByRes: function (res) {
        try {
            var idx = getIndexOfTable(res, "inputDescriptionTable");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInputDescription(o);
            }
        } catch (e) {
        }
    },
    deleteInputDescription: function (backlogId) {
        try {
            delete this.InputDescriptions[backlogId];
        } catch (e) {
        }
    },
    LoadInputDescription: function (res) {
        try {
            this.InputDescriptions = {};
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInputDescription(o);
            }
        } catch (err) {
        }
    },
    LoadInput: function (res) {
        try {
            this.Inputs = {};
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInput(o);
            }
        } catch (err) {
        }
    },

    toCurrentDescJSON: function () {
        return this.toDescJSON(global_var.current_us_input_id);
    },
    toDescJSON: function (inputId) {
        var json = {"tbl": [{"r": []}]};
        var keys = SAInput.GetCurrentInputDescription();
        var idx = 0;
        try {
            for (var n = 0; n < keys.length; n++) {
                var k = keys[n];
                k = k.trim();
                var o = this.InputDescriptions[k];
                json.tbl[0].r.push(o);
                idx++;

            }
        } catch (err) {
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    getDescriptionByIn: function (inputId) {
        var res = "";

        try {
            var keys = SAInput.GetInputDescription(inputId);
            for (var n = 0; n < keys.length; n++) {
                var k = keys[n];
                k = k.trim();
                var o = this.InputDescriptions[k].description;
                res += o + "%IN%";
            }

        } catch (err) {

        }
        return res;
    },
    toJSON: function () {
        var json = {"tbl": [{"r": []}]};
        var keys = Object.keys(this.InputDescriptions);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            var o = this.InputDescriptions[k];
            if (this.checkFilter(o)) {
                continue;
            }

            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    GetDetails: function (descriptionId) {
        try {
            descriptionId = descriptionId.trim();
            return this.InputDescriptions[descriptionId].description;
        } catch (e) {
        }

    },
    setEmptyMessage4InputDescription: function () {
        var st = '<div  style="padding:30px;text-align:center;">';
        st += '<h5> <i class="fa fa-cubes" style="font-size:30px"></i></h5>';
        st += "<h5> No User Story have been found or created on this project</h5>";
        st += "<p>All User Story searched or created on this project will appear here</p>"
        st += "</div>";
        $('#container-us-body').html(st);
    },
    AddInputDescription: function (obj) {
        this.InputDescriptions[obj.id] = obj;
    },
    AddInputDescriptions: function (obj) {
        this.InputDescriptions[obj.id] = obj;
    },
    AddAPI: function (backlogId) {
        this.APIs.push(backlogId);
    },
    AddSUSs: function (backlogId) {
        this.SUSs.push(backlogId);
    },
    AddLabel: function (id, backlogId) {
        if (typeof this.Labels[id] !== 'undefined') {
            this.Labels[id] = [];
        }
        this.Labels[id].push(backlogId);
    },
}

var SAInput = {
    "Inputs": {},
    "Tables": {},
    "TableByBacklog": {},
    "Tabs": {},
    "TabByBacklog": {},
    "DescriptionId": {},
    "ChildDependenceId": {},
    "LoadedBacklogs4Input": [],
    "LoadedBacklogs4InputNew": [],
    "LoadedChildDependenceId4Input": [],
    updateInput: function (backlogId, key, value) {
        try {
            this.Inputs[backlogId][key] = value;
        } catch (e) {
        }
    },
    updateInputList: function (backlogIdList, key, value) {
        try {
            for (var i = 0; i < backlogIdList.length; i++) {
                if (backlogIdList[i].length === 0) {
                    continue;
                }
                var backlogId = backlogIdList[i].trim();
                this.updateInput(backlogId, key, value);
            }
        } catch (e) {
        }
    },
    updateEntireInput: function (backlogId, object) {
        try {
            this.Inputs[backlogId] = object;
        } catch (e) {
        }
    },
    updateInputByRes: function (res) {
        var idx = getIndexOfTable(res, "inputTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.updateEntireInput(o.id, o);
        }
    },
    addInputByRes: function (res) {
        var idx = getIndexOfTable(res, "inputTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.AddInput(o);

        }
    },
    addInputTableByRes: function (res) {
        try {
            var idx = getIndexOfTable(res, "inputTableCompList");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInputTable(o);

            }
        } catch (err) {
        }
    },
    addInputTabByRes: function (res) {
        try {
            var idx = getIndexOfTable(res, "inputTabCompList");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInputTab(o);

            }
        } catch (err) {
        }
    },
    deleteInput: function (inputId) {
        try {
            delete this.Inputs[inputId];
        } catch (e) {
        }
    },

    deleteInputTable: function (inputTableId) {
        try {
            delete this.Tables[inputTableId];
        } catch (e) {
        }
    },
    deleteInputTab: function (inputTableId) {
        try {
            delete this.Tabs[inputTableId];
        } catch (e) {
        }
    },
    getInputObject: function (inputId) {
        try {
            return this.Inputs[inputId];
        } catch (e) {
        }
    },
    getInputDetails: function (inputId, param) {
        try {
            return this.Inputs[inputId][param];
        } catch (e) {
        }
    },
    LoadInputSection: function (res) {
        try {

            var jsonString = res.kv.jsonOut;
            var jsonKV = JSON.parse(jsonString);
            var kv = Object.keys(jsonKV);

            for (var n = 0; n < kv.length; n++) {
                var key = kv[n];
                var valueLine = jsonKV[key];
                var valObj = JSON.parse(valueLine);
                this.Inputs[key] = valObj;
            }
        } catch (err) {
        }
    },
    LoadInputNew: function (res) {
        try {
            this.Inputs = {};


            var jsonString = res.kv.jsonOut;
            var jsonKV = JSON.parse(jsonString);
            var kv = Object.keys(jsonKV);

            for (var n = 0; n < kv.length; n++) {
                var key = kv[n];
                var valueLine = jsonKV[key];
                var valObj = JSON.parse(valueLine);
                this.Inputs[key] = valObj

            }
        } catch (err) {
        }
    },
    LoadInput4Zad: function (res) {

        try {
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInput(o);
            }
        } catch (err) {
        }
    },
    LoadInput: function (res) {
        this.LoadInputTable(res);
        this.LoadInputTab(res);
        try {
            this.Inputs = {};

            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInput(o);
            }
        } catch (err) {
        }
    },
    LoadInputTable: function (res) {
        try {
            this.Tables = {};
            this.TableByBacklog = {};
            var idx = getIndexOfTable(res, "inputTableCompList");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInputTable(o);
            }
        } catch (err) {
        }
    },
    LoadInputDescriptionId: function (res) {
        try {
            //this.DescriptionId = res.kv;

        } catch (err) {
        }
    },
    LoadInputChildDependenceId: function (res) {
        try {
            this.ChildDependenceId = res.kv;

        } catch (err) {
        }
    },
    LoadInputChildDependenceIdNew: function (res) {
        try {
            this.ChildDependenceId = $.extend(this.ChildDependenceId, res.kv);

        } catch (err) {
        }
    },
    LoadInputTab: function (res) {
        try {
            this.Tabs = {};
            this.TabByBacklog = {};
            var idx = getIndexOfTable(res, "inputTabCompList");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInputTab(o);
            }
        } catch (err) {
        }
    },
    GetInputTableColumns: function () {
        return this.GetInputTableColumnsById(global_var.current_backlog_id);
    },
    GetInputTableColumnsById: function (backlogId) {
        if (!backlogId) {
            return "";
        }

        var st = "";
        try {
            var tableIds = this.TableByBacklog[backlogId].split(',');
            for (var id in tableIds) {
                var idx = tableIds[id];
                try {
                    st += this.Tables[idx].fkInputId + ",";
                } catch (err1) {
                }
            }
        } catch (err) {
        }
        return st;
    },
    AddInputTab: function (obj) {
        this.Tabs[obj.id] = obj;
        try {
            this.TabByBacklog[obj.fkBacklogId] = this.TabByBacklog[obj.fkBacklogId] + ',' + obj.id;
        } catch (err) {
            this.TabByBacklog[obj.fkBacklogId] = obj.id;
        }
    },
    AddInputTable: function (obj) {
        this.Tables[obj.id] = obj;
        try {
            this.TableByBacklog[obj.fkBacklogId] = this.TableByBacklog[obj.fkBacklogId] + ',' + obj.id;
        } catch (err) {
            this.TableByBacklog[obj.fkBacklogId] = obj.id;
        }
    },
    getTableDetails: function (tableId, param) {
        var res = "";
        try {
            res = this.Tables[tableId][param];
        } catch (err) {
        }
        return res;
    },
    getTableObject: function (tableId) {
        var res = {};
        try {
            res = this.Tables[tableId];
        } catch (err) {
        }
        return res;
    },
    getTabDetails: function (tabId, param) {
        var res = "";
        try {
            res = this.Tabs[tabId][param];
        } catch (err) {
        }
        return res;
    },
    getTabObject: function (tableId) {
        var res = {};
        try {
            res = this.Tabs[tableId];
        } catch (err) {
        }
        return res;
    },
    getBacklogId: function () {
        return global_var.current_backlog_id;
    },
    getInputsByBacklodId: function () {
        var id = this.getBacklogId();
        var ids = SACore.GetInputList(id);
        return ids;
    },

    toJSONWithInputs: function () {
        var json = {"tbl": [{"r": []}]};

        var keys = Object.keys(this.Inputs);

        for (var n = 0; n < keys.length; n++) {
            var o = this.Inputs[keys[n]];
            json.tbl[0].r.push(o);
        }

        return json;
    },
    toInputJSON: function (inputId) {
        var json = {"tbl": [{"r": []}]};
        var o = SAInput.Inputs[inputId];
        json.tbl[0].r.push(o);
        return json;
    },
    toJSONAsInputType: function (backlogId) {
        var json = {"tbl": [{"r": []}]};
        try {
            var keys = SACore.GetInputList(backlogId);
            var idx = 0;
            for (var n = 0; n < keys.length; n++) {
                var k = keys[n].trim();
                var o = SAInput.Inputs[k];
                if (!(o.inputType === 'IN' || o.inputType === 'GUI'
                        || o.inputType === 'TBL' || o.inputType==='GRP'
                        || o.inputType === 'TAB')) {
                    continue;
                }
                json.tbl[0].r.push(o);
                idx++;
            }
        } catch (e) {
        }
        return json;
    },
    _toJSONByBacklog: function (backlogId) {
       
        var json = {"tbl": [{"r": []}]};

        var keys = SACore.GetInputList(backlogId);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n].trim();
            var o = SAInput.Inputs[k];
            json.tbl[0].r.push(o);
            idx++;
        }

        return json;
    },
    toJSONByBacklog: function (backlogId) {
        loadBacklogInputsByIdIfNotExist(backlogId);
        var json = {"tbl": [{"r": []}]};

        var keys = SACore.GetInputList(backlogId);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n].trim();
            var o = SAInput.Inputs[k];
            json.tbl[0].r.push(o);
            idx++;
        }

        return json;
    },
    toJSON: function () {
        loadBacklogInputsByIdIfNotExist(global_var.current_backlog_id);
        var json = {"tbl": [{"r": []}]};
        var keys = this.getInputsByBacklodId();
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n].trim();
            var o = SAInput.Inputs[k];
            json.tbl[0].r.push(o);
            idx++;
        }

        return json;
    },
    toJSONAsSectionType: function () {
        var json = {"tbl": [{"r": []}]};

        var keys = this.getInputsByBacklodId();
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n].trim();
            var o = SAInput.Inputs[k];
            json.tbl[0].r.push(o);
            idx++;
        }

        return json;
    },
    toCurrentInputJSON: function () {
        return this.toInputJSON(global_var.current_us_input_id);
    },

    AddInput: function (obj) {
        this.Inputs[obj.id] = obj;
    },
    AddInputDescriptions: function (obj) {
        this.InputDescriptions[obj.id] = obj;
    },
    AddAPI: function (backlogId) {
        this.APIs.push(backlogId);
    },
    AddSUSs: function (backlogId) {
        this.SUSs.push(backlogId);
    },
    AddLabel: function (id, backlogId) {
        if (typeof this.Labels[id] !== 'undefined') {
            this.Labels[id] = [];
        }
        this.Labels[id].push(backlogId);
    },
    GetInputDescription: function (inputId) {
        var res = [];
        try {
//            res = this.Inputs[inputId]['inputDescriptionIds'].split(',');
            res = this.DescriptionId[inputId];
        } catch (err) {
        }
        return res;
    },
    GetCurrentInputDescription: function () {
        return this.GetInputDescription(global_var.current_us_input_id);
    },
    GetInputName: function (inputId) {
        var res = "";
        try {
            res = this.Inputs[inputId]['inputName'];
        } catch (err) {
        }
        return res;
    },
    GetCurrentDependenceBacklogName: function () {
        var id = this.Inputs[global_var.current_us_input_id].fkDependentBacklogId;
        return SACore.GetBacklogname(id);
    },
    GetCurrentDependenceInputName: function () {
        var inputId = this.Inputs[global_var.current_us_input_id].fkDependentOutputId;
        var name = this.Inputs[inputId].inputName;
        return name;
    },
    GetCurrentDependenceId: function () {
        var id = this.Inputs[global_var.current_us_input_id].fkDependentBacklogId;
        return  id;
    },
    GetCurrentChildDependenceId: function () {
//        var id = this.Inputs[global_var.current_us_input_id].childDependenceId;
        LoadChildDependenceId4Input(global_var.current_us_input_id);

        var id = this.ChildDependenceId[global_var.current_us_input_id];
        return  id;
    }
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SADependency = {
    "Dependencies": {},
    "ChildDependencies": {},
    updateInputDescription: function (backlogId, key, value) {
        try {
            this.Dependencies[backlogId][key] = value;
        } catch (e) {
        }
    },
    updateEntireInputDescription: function (backlogId, object) {
        try {
            this.Dependencies[backlogId] = object;
        } catch (e) {
        }
    },
    updateInputDescriptionByRes: function (res) {
        var idx = getIndexOfTable(res, "inputDescriptionTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.updateEntireInputDescription(o.id, o);
        }
    },
    addInputDescriptionByRes: function (res) {
        var idx = getIndexOfTable(res, "inputDescriptionTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.AddInputDescription(o);
        }
    },
    deleteInputDescription: function (backlogId) {
        try {
            delete this.Dependencies[backlogId];
        } catch (e) {
        }
    },
    LoadInputDescription: function (res) {
        try {
            this.Dependencies = {};
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInputDescription(o.id, o);
            }
        } catch (err) {
        }
    },
    LoadInput: function (res) {
        try {
            this.Inputs = {};
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInput(o);
            }
        } catch (err) {
        }
    },
    LoadDependency: function (res) {
        try {
            this.Dependencies = {};
            this.ChildDependencies = {};
            var idx = getIndexOfTable(res, "dependenceTable");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddDependencies(o);
                this.AddChildDependencies(o);
            }
        } catch (err) {
        }
    },
    GetBacklogListByParent: function (parentBacklogId) {
        var res = [];
        try {
            res = this.Dependencies[parentBacklogId];
            res[1];
        } catch (e) {
            res = [];
        }
        return res;
    },
    GetBacklogListByChild: function (childBacklogId) {
        var res = [];
        try {
            res = this.ChildDependencies[childBacklogId];
            res[1];
        } catch (e) {
            res = [];
        }
        return res;
    },
    toCurrentDescJSON: function () {
        return this.toDescJSON(global_var.current_us_input_id);
    },
    toDescJSON: function (inputId) {
        var json = {"tbl": [{"r": []}]};
        var keys = SAInput.GetCurrentInputDescription();
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            k = k.trim();
            var o = this.Dependencies[k];
            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    toJSON: function () {
        var json = {"tbl": [{"r": []}]};
        var keys = Object.keys(this.Dependencies);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            var o = this.Dependencies[k];
            if (this.checkFilter(o)) {
                continue;
            }

            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    GetDetails: function (descriptionId) {
        try {
            descriptionId = descriptionId.trim();
        } catch (e) {
        }
        return this.Dependencies[descriptionId].description;
    },
    setEmptyMessage4InputDescription: function () {
        var st = '<div  style="padding:30px;text-align:center;">';
        st += '<h5> <i class="fa fa-cubes" style="font-size:30px"></i></h5>';
        st += "<h5> No User Story have been found or created on this project</h5>";
        st += "<p>All User Story searched or created on this project will appear here</p>"
        st += "</div>";
        $('#container-us-body').html(st);
    },
    AddDependencies: function (obj) {
        if (!(this.Dependencies[obj.fkParentBacklogId])) {
            this.Dependencies[obj.fkParentBacklogId] = [];
        }
        this.Dependencies[obj.fkParentBacklogId].push(obj.fkBacklogId);
    },
    AddChildDependencies: function (obj) {
        if (!(this.ChildDependencies[obj.fkBacklogId])) {
            this.ChildDependencies[obj.fkBacklogId] = [];
        }
        this.ChildDependencies[obj.fkBacklogId].push(obj.fkParentBacklogId);
    },
    AddAPI: function (backlogId) {
        this.APIs.push(backlogId);
    },
    AddSUSs: function (backlogId) {
        this.SUSs.push(backlogId);
    },
    AddLabel: function (id, backlogId) {
        if (typeof this.Labels[id] !== 'undefined') {
            this.Labels[id] = [];
        }
        this.Labels[id].push(backlogId);
    },
}


var SABacklogLabel = {
    "LabelList": {},
    "LabelBacklogDepList": {},
    "BacklogList": {},
    "BacklogLabelList": {},
    "NotifiedLabelList": {},

    updateInputDescription: function (backlogId, key, value) {
        try {
            this.InputDescriptions[backlogId][key] = value;
        } catch (e) {
        }
    },
    updateEntireInputDescription: function (backlogId, object) {
        try {
            this.InputDescriptions[backlogId] = object;
        } catch (e) {
        }
    },
    updateInputDescriptionByRes: function (res) {
        var idx = getIndexOfTable(res, "inputDescriptionTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.updateEntireInputDescription(o.id, o);
        }
    },
    addInputDescriptionByRes: function (res) {
        var idx = getIndexOfTable(res, "inputDescriptionTable");
        var obj = res.tbl[idx].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            this.AddInputDescription(o);
        }
    },
    deleteInputDescription: function (backlogId) {
        try {
            delete this.InputDescriptions[backlogId];
        } catch (e) {
        }
    },
    Load: function (res) {
        try {
            this.LoadLabel(res);
            this.LoadNotifiedLabel(res);

            this.LabelList = {};
            this.BacklogList = {};

            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                if (!this.LabelList[o.fkTaskLabelId]) {
                    this.LabelList[o.fkTaskLabelId] = [];
                }
                if (!this.BacklogList[o.fkBacklogId]) {
                    this.BacklogList[o.fkBacklogId] = [];
                }

                this.LabelList[o.fkTaskLabelId].push(o.fkBacklogId);
                this.BacklogList[o.fkBacklogId].push(o.fkTaskLabelId);
            }
        } catch (err) {
        }
    },
    LoadLabelBacklogDep: function (res) {
        try {

            this.LabelBacklogDepList = {};
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                if (!this.LabelBacklogDepList[o.fkTaskLabelId]) {
                    this.LabelBacklogDepList[o.fkTaskLabelId] = [];
                }

                this.LabelBacklogDepList[o.fkTaskLabelId].push(o.fkBacklogId);
            }
        } catch (err) {
        }
    },
    GetBacklogList: function (labelId) {
        return this.LabelList[labelId];
    },
    GetLabelBacklogDepList: function (labelId) {
        return this.LabelBacklogDepList[labelId];
    },
    GetLabelList: function (backlogId) {
        return this.BacklogList[backlogId];
    },
    GetNotifiedLabelKeys: function () {
        return Object.keys(this.NotifiedLabelList);
    },

    GetNotifiedLabelObject: function (key) {
        var st = "";
        try {
            st = this.NotifiedLabelList[key];
        } catch (err) {
        }
        return st;
    },
    GetNotifiedLabelStartDate: function (key) {
        return this.GetNotifiedLabelParam(key, "startDate");
    },
    GetNotifiedLabelStartTime: function (key) {
        return this.GetNotifiedLabelParam(key, "startTime");
    },
    GetNotifiedLabelEndDate: function (key) {
        return this.GetNotifiedLabelParam(key, "endDate");
    },
    GetNotifiedLabelEndTime: function (key) {
        return this.GetNotifiedLabelParam(key, "endTime");
    },
    GetNotifiedLabelLabelId: function (key) {
        return this.GetNotifiedLabelParam(key, "fkLabelId");
    },
    GetNotifiedLabelBaklogId: function (key) {
        return this.GetNotifiedLabelParam(key, "fkBacklogId");
    }, GetNotifiedLabelProjectId: function (key) {
        return this.GetNotifiedLabelParam(key, "fkProjectId");
    }, GetNotifiedLabelParam: function (key, param) {
        var st = "";
        try {
            st = this.NotifiedLabelList[key][param];
        } catch (err) {
        }
        return st;
    },
    GetLabelName: function (labelId) {
        var st = "";
        try {
            st = this.LabelList[labelId]['name'];
        } catch (err) {
        }
        return st;
    },
    GetBacklogLabelName: function (labelId) {
        var st = "";
        try {
            st = this.BacklogLabelList[labelId]['name'];
        } catch (err) {
        }
        return st;
    },
    LoadLabel: function (res) {
        try {
            this.BacklogLabelList = {};
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.BacklogLabelList[o.id] = o
            }
        } catch (err) {
        }
    },
    LoadNotifiedLabel: function (res) {
        try {
            this.NotifiedLabelList = {};
            var idx = getIndexOfTable(res, "notifiedLabelList");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.NotifiedLabelList[o.id] = o
            }
        } catch (err) {
        }
    },
    GetBacklog: function (backlogId) {
        return this.BacklogList[backlogId];
    },
    GetLabel: function (labelId) {
        return this.LabelList[labelId];
    },

    LoadInput: function (res) {
        try {
            this.Inputs = {};
            var idx = getIndexOfTable(res, "Response");
            var obj = res.tbl[idx].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                this.AddInput(o);
            }
        } catch (err) {
        }
    },

    toCurrentDescJSON: function () {
        return this.toDescJSON(global_var.current_us_input_id);
    },
    
    toDescJSON: function (inputId) {
        var json = {"tbl": [{"r": []}]};
        var keys = SAInput.GetCurrentInputDescription();
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            k = k.trim();
            var o = this.InputDescriptions[k];
            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    getDescriptionByIn: function (inputId) {
        var res = "";

        try {
            var keys = SAInput.GetInputDescription(inputId);
            for (var n = 0; n < keys.length; n++) {
                var k = keys[n];
                k = k.trim();
                var o = this.InputDescriptions[k].description;
                res += o + "%IN%";
            }

        } catch (err) {

        }
        return res;
    },
    toJSONAsBacklogLabel: function () {
        var json = {"tbl": [{"r": []}]};
        var keys = Object.keys(this.BacklogLabelList);
        var idx = 0;
        for (var n = 0; n < keys.length; n++) {
            var k = keys[n];
            var o = this.BacklogLabelList[k];
            if (o.isMenu !== '1') {
                continue;
            }

            json.tbl[0].r.push(o);
            idx++;
        }
        if (idx === 0) {
            json = {"tbl": []};
        }
        return json;
    },
    GetDetails: function (descriptionId) {
        try {
            descriptionId = descriptionId.trim();
        } catch (e) {
        }
        return this.InputDescriptions[descriptionId].description;
    },
    setEmptyMessage4InputDescription: function () {
        var st = '<div  style="padding:30px;text-align:center;">';
        st += '<h5> <i class="fa fa-cubes" style="font-size:30px"></i></h5>';
        st += "<h5> No User Story have been found or created on this project</h5>";
        st += "<p>All User Story searched or created on this project will appear here</p>"
        st += "</div>";
        $('#container-us-body').html(st);
    },
    AddInputDescription: function (obj) {
        this.InputDescriptions[obj.id] = obj;
    },
    AddInputDescriptions: function (obj) {
        this.InputDescriptions[obj.id] = obj;
    },
    AddAPI: function (backlogId) {
        this.APIs.push(backlogId);
    },
    AddSUSs: function (backlogId) {
        this.SUSs.push(backlogId);
    },
    AddLabel: function (id, backlogId) {
        if (typeof this.Labels[id] !== 'undefined') {
            this.Labels[id] = [];
        }
        this.Labels[id].push(backlogId);
    },
}




function setApiIpoBlock() {

    var keys = Object.keys(SAEntity.Tables)
//    console.log(keys);
    for (var k in keys) {

        var from = keys[k];
        var toKeys = SourcedActivityDiagram.CoreLines.SC2SC[from];
//        console.log(from, toKeys);
        for (var m in toKeys) {
            var to = toKeys[m];
            try {
                new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
//                                    color: 'rgb(41,146,210)',
                            color: 'rgb(255,146,27)',
                            dash: true,
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left',
                        }
                );

            } catch (err) {
                console.log(err);
            }
        }
    }
}
setTimeout(function () {

    setApiIpoBlock();

}, 7000);