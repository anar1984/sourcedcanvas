/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Statistics = {
    ProjectList: {},
    ProjectList_Overall: {},
    ProjectList_InAction: {},
    ProjectList_Initial: {},
    ProjectList_WithBugs: {},
    ProjectList_WithChange: {},
    ProjectList_WithNew: {},
    ProjectList_Bug: {},
    ProjectList_Change: {},
    ProjectList_New: {},
    ProjectList_TaskOverall: {},
    ProjectList_TaskUnassigned: {},
    ProjectList_TaskNostorycard: {},
    GelGeneralLabels: function () {
        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.fkProjectId = "-1";
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmGetLabelList4Task",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: true,
            success: function (res) {
                var ln = $('#statistics-labellist4task');
                var ln2 = $('#statistics-labellist4user');
                ln.html('');
                ln2.html('');
                try {
                    var obj = res.tbl[0].r;
                    for (var i = 0; i < obj.length; i++) {
                        var o = obj[i];
                        ln.append($('<option>').val(o.id).text(o.name))
                        ln2.append($('<option>').val(o.id).text(o.name))
                    }
                } catch (err) {
                }
                ln.selectpicker("refresh");
                ln2.selectpicker("refresh");
            }

        });
    },
    GelGeneralSprints: function () {
        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.fkProjectId = "-1";
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmGetSprintList4Task",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: true,
            success: function (res) {
                var ln = $('#statistics-sprintlist4user');
                var ln2 = $('#statistics-sprintlist4task');
                ln.html('');
                ln2.html('');
                try {
                    var obj = res.tbl[0].r;
                    for (var i = 0; i < obj.length; i++) {
                        var o = obj[i];
                        ln.append($('<option>').val(o.id).text(o.sprintName))
                        ln2.append($('<option>').val(o.id).text(o.sprintName))
                    }
                } catch (err) {
                }
                ln.selectpicker("refresh");
                ln2.selectpicker("refresh");
            }

        });
    },
    GetGeneralUsers: function () {
        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmGetUserListByProjects",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: true,
            success: function (res) {
                var select = $('#statistics-userlist4user');
                select.html('');
                var obj = res.tbl[0].r;
                for (var id in obj) {
                    var o = obj[id];
                    var op = $("<option>").val(o.fkUserId).text(o.userName);
                    select.append(op);
                }
                select.selectpicker('refresh');
            },
            error: function () {
                Toaster.showError(('somethingww'));
            }
        });
    },
    GetProjectListIn: function () {
        var id = $('#statistics-projectlist').val();
        var st = "";
        for (var i in id) {
            st += id[i] + "%IN%"
        }
        return st;
    },
    LoadAssigneesByProject: function () {
        var projectId = this.GetProjectListIn();
        if (!projectId) {
            return;
        }

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.fkProjectId = projectId;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmLoadAssigneeByProject",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                $('#statistics-userlist4user').html('');

                var obj = res.tbl[0].r;
                for (var i in obj) {
                    var o = obj[i];
                    var opt = $('<option>').val(o.fkUserId).text(o.userName);
                    $('#statistics-userlist4user').append(opt);
                }
                $('#statistics-userlist4user').selectpicker('refresh');

            },
            error: function () {
                Toaster.showError(('somethingww'));
            }
        });
    },

    GetTableIndexValue: function (res, action) {
        try {
            return res.tbl[getIndexOfTable(res, action)].r;
        } catch (err) {
            return "";
        }
    }
    ,
    SetKVPair4ProjectAll: function (res) {
        this.ProjectList_Overall = this.SetKVPair4Project(this.GetTableIndexValue(res, 'overall'));
        this.ProjectList_InAction = this.SetKVPair4Project(this.GetTableIndexValue(res, 'inaction'));
        this.ProjectList_Initial = this.SetKVPair4Project(this.GetTableIndexValue(res, 'initial'));
        this.ProjectList_WithBugs = this.SetKVPair4Project(this.GetTableIndexValue(res, 'withbugs'));
        this.ProjectList_WithNew = this.SetKVPair4Project(this.GetTableIndexValue(res, 'withnews'));
        this.ProjectList_WithChange = this.SetKVPair4Project(this.GetTableIndexValue(res, 'withchanges'));
    }
    ,
    SetKVPair4ProjectAllByAssignee: function (res) {
        this.ProjectList_TaskOverall = this.SetKVPair4Project(this.GetTableIndexValue(res, 'overall'));
        this.ProjectList_Bug = this.SetKVPair4Project(this.GetTableIndexValue(res, 'bugs'));
        this.ProjectList_Change = this.SetKVPair4Project(this.GetTableIndexValue(res, 'changes'));
        this.ProjectList_New = this.SetKVPair4Project(this.GetTableIndexValue(res, 'news'));
        this.ProjectList_Created = this.SetKVPair4Project(this.GetTableIndexValue(res, 'created'));
        this.ProjectList_CreatedNew = this.SetKVPair4Project(this.GetTableIndexValue(res, 'creatednew'));
        this.ProjectList_CreatedChange = this.SetKVPair4Project(this.GetTableIndexValue(res, 'createdchange'));
        this.ProjectList_CreatedBug = this.SetKVPair4Project(this.GetTableIndexValue(res, 'createdbug'));
        this.ProjectList_CreatedStory = this.SetKVPair4Project(this.GetTableIndexValue(res, 'createdstory'));
    }
    ,
    SetKVPair4ProjectAllByTask: function (res) {
        this.ProjectList_Bug = this.SetKVPair4Project(this.GetTableIndexValue(res, 'bugs'));
        this.ProjectList_Change = this.SetKVPair4Project(this.GetTableIndexValue(res, 'changes'));
        this.ProjectList_New = this.SetKVPair4Project(this.GetTableIndexValue(res, 'news'));
        this.ProjectList_TaskOverall = this.SetKVPair4Project(this.GetTableIndexValue(res, 'overall'));
        this.ProjectList_TaskUnassigned = this.SetKVPair4Project(this.GetTableIndexValue(res, 'unassigned'));
        this.ProjectList_TaskNostorycard = this.SetKVPair4Project(this.GetTableIndexValue(res, 'nostorycard'));
    }
    ,
    SetKVPair4Project: function (obj) {
        var list = {};
        for (var i in obj) {
            var id = obj[i].fkProjectId;
            if (id.length === 0)
                continue;
            list[id] = obj[i];
        }
        return list;
    }
    ,
    Dashboard: {
        InitByCombo: function (el) {
            if (global_var.current_dashboard_modal === 'storycard') {
                this.GetProjectSummary();
            } else if (global_var.current_dashboard_modal === 'task') {
                this.GetProjectSummaryByTask();
            } else if (global_var.current_dashboard_modal === 'assignee') {
                this.GetProjectSummaryByAssignee();
                Statistics.LoadAssigneesByProject();
            }
           
       
        },
        GetProjectList: function () {
            var list = $('#statistics-projectlist').val();
            var st = "";
            try {
                for (var i = 0; i < list.length; i++) {
                    st += list[i];
                    st += (i < list.length - 1) ? "," : "";
                }
            } catch (err) {
            }
            return st;
        }
        ,
        GetSprintList4Task: function () {
            var list = $('#statistics-sprintlist4task').val();
            var st = "";
            try {
                for (var i = 0; i < list.length; i++) {
                    st += list[i];
                    st += (i < list.length - 1) ? "," : "";
                }
            } catch (err) {
            }
            return st;
        }
        ,
        GetLabelList4Task: function () {
            var list = $('#statistics-labellist4task').val();
            var st = "";
            try {
                for (var i = 0; i < list.length; i++) {
                    st += list[i];
                    st += (i < list.length - 1) ? "," : "";
                }
            } catch (err) {
            }
            return st;
        }
        ,
        GetSprintList4User: function () {
            var list = $('#statistics-sprintlist4user').val();
            var st = "";
            try {
                for (var i = 0; i < list.length; i++) {
                    st += list[i];
                    st += (i < list.length - 1) ? "," : "";
                }
            } catch (err) {
            }
            return st;
        }
        ,
        GetLabelList4User: function () {
            var list = $('#statistics-labellist4user').val();
            var st = "";
            try {
                for (var i = 0; i < list.length; i++) {
                    st += list[i];
                    st += (i < list.length - 1) ? "," : "";
                }
            } catch (err) {
            }
            return st;
        }
        ,
        GetUserList4User: function () {
            var list = $('#statistics-userlist4user').val();
            var st = "";
            try {
                for (var i = 0; i < list.length; i++) {
                    st += list[i];
                    st += (i < list.length - 1) ? "," : "";
                }
            } catch (err) {
            }
            return st;
        }
        ,
        StatusDivByAssignee: function (count, assigneeId, actiontype, status) {
            var res = $('<div>')
                    .attr('projectId', Statistics.Dashboard.GetProjectList())
                    .attr("pid", assigneeId)
                    .attr("action", actiontype)
                    .attr("status", status)
                    .append($('<span>').addClass('us-list-item us-item-status-' + status).append(status))
                    .append($('<span>').append("-"))
                    .append($('<span>')
                            .append(count));
            if (count > 0) {
                res.css("cursor", "pointer")
                        .addClass("stat_group_title")
                        .attr("ondblclick", "showGeneralStatisticsDetailsModalByAssignee(this)");
            }

            return res;
        }
        ,
        StatusDivByTask: function (count, projectId, actiontype, status) {
            var res = $('<div>')
                    .attr("pid", projectId)
                    .attr("action", actiontype)
                    .attr("status", status)
                    .append($('<span>').addClass('us-list-item us-item-status-' + status).append(status))
                    .append($('<span>').append("-"))
                    .append($('<span>')
                            .append(count));
            if (count > 0) {
                res.css("cursor", "pointer")
                        .addClass("stat_group_title")
                        .attr("ondblclick", "showGeneralStatisticsDetailsModalByTask(this)");
            }

            return res;
        }
        ,
        NewStatusDiv: function (count, projectId, actiontype) {
            var res = $('<div>')
                    .attr("pid", projectId)
                    .attr("action", actiontype)
                    .attr("status", "new")
                    .append($('<span>').addClass('us-list-item us-item-status-new').append("new"))
                    .append($('<span>').append("-"))
                    .append($('<span>')
                            .append(count));
            if (count > 0) {
                res.css("cursor", "pointer")
                        .addClass("stat_group_title")
                        .attr("ondblclick", "showGeneralStatisticsDetailsModal(this)");
            }

            return res;
        }
        ,
        OngoingStatusDiv: function (count, projectId, actiontype) {
            var res = $('<div>')
                    .attr("pid", projectId)
                    .attr("action", actiontype)
                    .attr("status", "ongoing")
                    .append($('<span>').addClass('us-list-item us-item-status-ongoing').append("ongoing"))
                    .append($('<span>').append("-"))
                    .append($('<span>')
                            .append(count));
            if (count > 0) {
                res.css("cursor", "pointer")
                        .addClass("stat_group_title")
                        .attr("ondblclick", "showGeneralStatisticsDetailsModal(this)");
            }

            return res;
        }
        ,
        ClosedStatusDiv: function (count, projectId, actiontype) {


            var res = $('<div>')
                    .attr("pid", projectId)
                    .attr("action", actiontype)
                    .attr("status", "closed")

                    .append($('<span>').addClass('us-list-item us-item-status-closed').append("closed"))
                    .append($('<span>').append("-"))
                    .append($('<span>')
                            .append(count));
            if (count > 0) {
                res.css("cursor", "pointer")
                        .addClass("stat_group_title")
                        .attr("ondblclick", "showGeneralStatisticsDetailsModal(this)");
            }

            return res;
        }
        ,
        GetProjectSummaryByUser: function (projectIds) {
            global_var.current_dashboard_modal = 'assignee';
            var projectIds = this.GetProjectList();
            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }

            json.kv.fkProjectId = projectIds;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetGeneralStatisticsByUser",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.SetUserNames(res);
                    Statistics.SetKVPair4ProjectAllByAssignee(res);
                    that.GetProjectSummaryTableByAssignee(res);
                }
            });
        }
        ,
        GetProjectSummaryByAssignee: function (projectIds) {
            global_var.current_dashboard_modal = 'assignee';
            var projectIds = this.GetProjectList();
            var labelIds = this.GetLabelList4User();
            var sprintIds = this.GetSprintList4User();
            var createdBy = this.GetUserList4User();
            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }

            json.kv.fkProjectId = projectIds;
            json.kv.fkLabelId = labelIds;
            json.kv.fkSprintId = sprintIds;
            json.kv.createdBy = createdBy;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetGeneralStatisticsByAssignee",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.SetUserNames(res);
                    Statistics.SetKVPair4ProjectAllByAssignee(res);
                    that.GetProjectSummaryTableByAssignee(res);
                }
            });
        }
        ,
        GetProjectSummaryByTask: function (projectIds) {
            global_var.current_dashboard_modal = 'task';
            var projectIds = this.GetProjectList();
            var labelIds = this.GetLabelList4Task();
            var sprintIds = this.GetSprintList4Task();
            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }

            json.kv.fkProjectId = projectIds;
            json.kv.fkLabelId = labelIds;
            json.kv.fkSprintId = sprintIds;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetGeneralStatisticsByTask",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.SetProjectNames(res);
                    Statistics.SetKVPair4ProjectAllByTask(res);
                    that.GetProjectSummaryTableByTask(res);
                }
            });
        }
        ,
        GetProjectSummary: function () {
            global_var.current_dashboard_modal = 'storycard';
            var projectIds = this.GetProjectList();
            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }

            json.kv.fkProjectId = projectIds;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetGeneralStatistics",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.SetProjectNames(res);
                    Statistics.SetKVPair4ProjectAll(res);
                    that.GetProjectSummaryTable(res);
                }
            });
        }
        ,
        SetUserNames: function (res) {

            try {
                Statistics.ProjectList = {};
                var idx = getIndexOfTable(res, 'userList');
                var proList = res.tbl[idx].r;
                for (var i in proList) {
                    var o = proList[i];
                    if (o.fkUserId.length === 0) {
                        continue;
                    }
                    Statistics.ProjectList[o.fkUserId] = Statistics.GetGeneralStatsCountNGB.GetOwnerInfo(o.fkUserId).html() + " " + o.userName;
                }
                Statistics.ProjectList["-1"] = Statistics.GetGeneralStatsCountNGB.GetOwnerInfo("-1").html() + " Unassigneed";
            } catch (err) {
            }
        }
        ,
        SetProjectNames: function (res) {

            try {
                Statistics.ProjectList = {};
                var idx = getIndexOfTable(res, 'projectList');
                var proList = res.tbl[idx].r;
                for (var i in proList) {
                    var o = proList[i];
                    if (o.id.length === 0) {
                        continue;
                    }
                    Statistics.ProjectList[o.id] = o.projectName;
                }
            } catch (err) {
            }
        }
        ,
        GetProjectName: function (id) {
            var r = "";
            try {
                r = Statistics.ProjectList[id];
            } catch (err) {
            }
            return r;
        }
        ,
        CellDivByStatusByAssignee: function (assigneeId, actiontype, obj) {
            try {
                var div = $('<div>')
                        .append($('<b>')
                                .attr("projectId", Statistics.Dashboard.GetProjectList())
                                .attr("pid", assigneeId)
                                .attr("action", actiontype)
                                .attr("status", "total")
                                .css("cursor", "pointer")
                                .addClass("stat_group_title")
                                .attr("ondblclick", "showGeneralStatisticsDetailsModalByAssignee(this)")
                                .append("Total-").append(obj.overall)
                                )
                        .append(this.StatusDivByAssignee(obj.statusNew, assigneeId, actiontype, "new"))
                        .append(this.StatusDivByAssignee(obj.statusOngoing, assigneeId, actiontype, "ongoing"))
                        .append(this.StatusDivByAssignee(obj.statusClosed, assigneeId, actiontype, "closed"))
                        .append(this.StatusDivByAssignee(obj.statusWaiting, assigneeId, actiontype, "waiting"))
                        .append(this.StatusDivByAssignee(obj.statusCanceled, assigneeId, actiontype, "canceled"))
                        .append(this.StatusDivByAssignee(obj.statusRejected, assigneeId, actiontype, "rejected"))
                        ;
                return div;
            } catch (err) {
                return "";
            }
        }
        ,
        CellDivByStatusByTask: function (projectId, actiontype, obj) {
            try {
                var div = $('<div>')
                        .append($('<b>')
                                .attr("pid", projectId)
                                .attr("action", actiontype)
                                .attr("status", "total")
                                .css("cursor", "pointer")
                                .addClass("stat_group_title")
                                .attr("ondblclick", "showGeneralStatisticsDetailsModalByTask(this)")
                                .append("Total-").append(obj.overall))
                        .append(this.StatusDivByTask(obj.statusNew, projectId, actiontype, "new"))
                        .append(this.StatusDivByTask(obj.statusOngoing, projectId, actiontype, "ongoing"))
                        .append(this.StatusDivByTask(obj.statusClosed, projectId, actiontype, "closed"))
                        .append(this.StatusDivByTask(obj.statusWaiting, projectId, actiontype, "waiting"))
                        .append(this.StatusDivByTask(obj.statusCanceled, projectId, actiontype, "canceled"))
                        .append(this.StatusDivByTask(obj.statusRejected, projectId, actiontype, "rejected"))
                        ;
                return div;
            } catch (err) {
                return "";
            }
        }
        ,
        CellDivByStatus: function (projectId, actiontype, obj) {
            try {
                var div = $('<div>')
                        .append($('<b>')
                                .attr("pid", projectId)
                                .attr("action", actiontype)
                                .attr("status", "total")
                                .css("cursor", "pointer")
                                .addClass("stat_group_title")
                                .attr("ondblclick", "showGeneralStatisticsDetailsModal(this)")
                                .append("Total-").append(obj.overall))
                        .append(this.NewStatusDiv(obj.statusNew, projectId, actiontype))
                        .append(this.OngoingStatusDiv(obj.statusOngoing, projectId, actiontype, ))
                        .append(this.ClosedStatusDiv(obj.statusClosed, projectId, actiontype, ))
                        ;
                return div;
            } catch (err) {
                return "";
            }
        }
        ,
        GetProjectSummaryTableByAssignee: function (res) {
            var table = $("<table>")
                    .addClass("table table-hover project-table-list text-center")
                    .append($('<thead>')
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("User"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Assigned Tasks"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Assigned Bugs"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Assinged Change Requests"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Assigned New Requests"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Created Tasks"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Created Bugs"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Created New Requests"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Created Change Requests"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Created Story Cards"))
                            );
            var obj = Statistics.ProjectList;
            for (var id in obj) {
                var name = obj[id];
                try {
                    var tr = $('<tr>')
                            .append($("<td class='text-center' style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(name))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByAssignee(id, "overall", Statistics.ProjectList_TaskOverall[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByAssignee(id, "bug", Statistics.ProjectList_Bug[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByAssignee(id, "change", Statistics.ProjectList_Change[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByAssignee(id, "new", Statistics.ProjectList_New[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByAssignee(id, "created", Statistics.ProjectList_Created[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByAssignee(id, "createdbug", Statistics.ProjectList_CreatedBug[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByAssignee(id, "creatednew", Statistics.ProjectList_CreatedNew[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByAssignee(id, "createdchange", Statistics.ProjectList_CreatedChange[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatus(id, "createdstory", Statistics.ProjectList_CreatedStory[id])))

                    table.append(tr);
                } catch (err) {

                }


            }

            $('#stat-general-project-byassignee-summary').html(table);
        }
        ,
        GetProjectSummaryTableByTask: function (res) {
            var table = $("<table>")
                    .addClass("table table-hover project-table-list text-center")
                    .append($('<thead>')
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("Project"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Overall Tasks"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Bugs"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Change Requests"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# New Requests"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Unassigned Tasks"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Tasks without Story Cards"))
                            )
                    ;
            var obj = Statistics.ProjectList;
            for (var id in obj) {
                var name = obj[id];
                try {
                    var tr = $('<tr>')
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(name))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByTask(id, "overall", Statistics.ProjectList_TaskOverall[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByTask(id, "bug", Statistics.ProjectList_Bug[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByTask(id, "change", Statistics.ProjectList_Change[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByTask(id, "new", Statistics.ProjectList_New[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByTask(id, "unassigned", Statistics.ProjectList_TaskUnassigned[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatusByTask(id, "nostorycard", Statistics.ProjectList_TaskNostorycard[id])))

                    table.append(tr);
                } catch (err) {

                }


            }

            $('#stat-general-project-bytask-summary').html(table);
        }
        ,
        GetProjectSummaryTable: function (res) {
            var table = $("<table>")
                    .addClass("table table-hover project-table-list text-center")
                    .append($('<thead>')
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("Project"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Overall Story Cards"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Story Cards in Action"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Initial Story Cards"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Story Cards with Bugs"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Story Cards with Change Requests"))
                            .append($("<th style='border-right: 1px solid #abc4ff;'>").append("# Story Cards with New Requests"))

                            )
                    ;
            var obj = Statistics.ProjectList;
            for (var id in obj) {
                var name = obj[id];
                try {
                    var tr = $('<tr>')
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(name))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatus(id, "overall", Statistics.ProjectList_Overall[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatus(id, "inaction", Statistics.ProjectList_InAction[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatus(id, "initial", Statistics.ProjectList_Initial[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatus(id, "withbugs", Statistics.ProjectList_WithBugs[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatus(id, "withchanges", Statistics.ProjectList_WithChange[id])))
                            .append($("<td style='padding:25px 5px; border-right: 1px solid #abc4ff;'>").append(this.CellDivByStatus(id, "withnews", Statistics.ProjectList_WithNew[id])))

                } catch (err) {

                }

                table.append(tr);
            }

            $('#stat-general-project-summary').html(table);
        }
    },
    GetGeneralStatsCountNGB: {
        Call: function () {
            if (global_var.current_project_id.length === 0) {
                return;
            }

            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }

            json.kv.fkProjectId = global_var.current_project_id;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetGeneralStatsCountNGB",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    Statistics.GetGeneralStatsCountNGB.CreatePivotOfOwner(res);
                },
                error: function () {
                    Toaster.showError(('somethingww'));
                }
            });
        },
        Call4Group: function () {
            if (global_var.current_project_id.length === 0) {
                return;
            }

            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }

            json.kv.fkProjectId = global_var.current_project_id;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetGeneralStatsCountNGB",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    Statistics.GetGeneralStatsCountNGB.CreatePivotOfOwner4Group(res);
                },
                error: function () {
                    Toaster.showError(('somethingww'));
                }
            });
        },
        CreatePivotOfOwner: function (res) {
            try {
                var ownerList = [];
                var owners4New = {};
                var owners4Change = {};
                var owners4Bug = {};
                var table = $('<table>');
                var obj = res.tbl[0].r;
                for (var n = 0; n < obj.length; n++) {
                    var o = obj[n];
                    var ownerId = SACore.GetBacklogDetails(o.fkBacklogId, "fkOwnerId");
                    if (!ownerId || ownerId === undefined) {
                        ownerId = "-2"
                    }

                    if (o.taskNature === 'bug') {
                        owners4Bug[ownerId] = ownerId in owners4Bug
                                ? parseInt(owners4Bug[ownerId]) + 1
                                : 1;
                    } else if (o.taskNature === 'change') {
                        owners4Change[ownerId] = ownerId in owners4Change
                                ? parseInt(owners4Change[ownerId]) + 1
                                : 1;
                    } else if (o.taskNature === 'new') {
                        owners4New[ownerId] = ownerId in owners4New
                                ? parseInt(owners4New[ownerId]) + 1
                                : 1;
                    }
                }

                this.CreatePivotMatrix(owners4New, owners4Change, owners4Bug)



            } catch (err) {

            }

        },
        CreatePivotOfOwner4Group: function (res) {
            try {
                var owners4New = {};
                var owners4Change = {};
                var owners4Bug = {};
                var owners4New4Task = {};
                var owners4Change4Task = {};
                var owners4Bug4Task = {};
//                var emptyStatusBlock = {n: 0, o: 0, c: 0};
                var obj = res.tbl[0].r;
                for (var n = 0; n < obj.length; n++) {
                    var o = obj[n];
                    var ownerId = SACore.GetBacklogDetails(o.fkBacklogId, "fkOwnerId");
                    var status = o.taskStatus;
                    if (!ownerId || ownerId === undefined) {
                        ownerId = "-2"
                    }

                    if (o.taskNature === 'bug') {
                        owners4Bug[ownerId] = ownerId in owners4Bug
                                ? parseInt(owners4Bug[ownerId]) + 1
                                : 1;
                        if (!(ownerId in owners4Bug4Task)) {
                            owners4Bug4Task[ownerId] = {n: 0, o: 0, c: 0};
                        }

                        if (status === 'new') {
                            owners4Bug4Task[ownerId].n++;
                        } else if (status === 'ongoing') {
                            owners4Bug4Task[ownerId].o++;
                        } else if (status === 'closed') {
                            owners4Bug4Task[ownerId].c++;
                        }

                    } else if (o.taskNature === 'change') {
                        owners4Change[ownerId] = ownerId in owners4Change
                                ? parseInt(owners4Change[ownerId]) + 1
                                : 1;
                        if (!(ownerId in owners4Change4Task)) {
                            owners4Change4Task[ownerId] = {n: 0, o: 0, c: 0};
                        }

                        if (status === 'new') {
                            owners4Change4Task[ownerId].n++;
                        } else if (status === 'ongoing') {
                            owners4Change4Task[ownerId].o++;
                        } else if (status === 'closed') {
                            owners4Change4Task[ownerId].c++;
                        }
                    } else if (o.taskNature === 'new') {
                        owners4New[ownerId] = ownerId in owners4New
                                ? parseInt(owners4New[ownerId]) + 1
                                : 1;
                        if (!(ownerId in owners4New4Task)) {
                            owners4New4Task[ownerId] = {n: 0, o: 0, c: 0};
                        }

                        if (status === 'new') {
                            owners4New4Task[ownerId].n++;
                        } else if (status === 'ongoing') {
                            owners4New4Task[ownerId].o++;
                        } else if (status === 'closed') {
                            owners4New4Task[ownerId].c++;
                        }
                    }
                }

                this.CreatePivotMatrix4Group(owners4New, owners4Change, owners4Bug, owners4New4Task, owners4Change4Task, owners4Bug4Task)



            } catch (err) {

            }

        },
        GetOwnerInfo: function (ownerId) {
            var assigneeImg = $('<span>')
            if (ownerId.length > 3) {
                var userImage = SAProjectUser.GetDetails(ownerId, "userImage");
                var userName = SAProjectUser.GetDetails(ownerId, "userName");
                var img = (userImage)
                        ? fileUrl(userImage)
                        : fileUrl(new User().getDefaultUserprofileName());
                assigneeImg.append($('<img>')
//                        .css("width","24px")
//                        .css('height','24px')
                        .addClass('Assigne-card-story-select-img')
                        .attr('src', img)
                        .attr('alt', userName)
                        .attr("title", userName))
            }
            return assigneeImg;
        },
        CreatePivotMatrix: function (owners4New, owners4Change, owners4Bug) {
            var table = $("<table>")
                    .addClass("table table-hover project-table-list text-center")
                    .append($('<thead>')
                            .append($("<th>").append("Owner"))
                            .append($("<th>").append("# New Request"))
                            .append($("<th>").append("# Change Request"))
                            .append($("<th>").append("# Bug"))
                            .append($("<th>").append("# Total"))
                            )
                    ;
            var ownerList = SAProjectUser.GetKeys();
            if ("-2" in  owners4Bug || "-2" in  owners4Change || "-2" in  owners4New) {
                ownerList.push('-2');
            }

            var idxNew = 0;
            var idxChange = 0;
            var idxBug = 0;
            for (var id in ownerList) {
                var ownerId = ownerList[id];
                var ownerName = SAProjectUser.GetDetails(ownerId, "userName");
                var cssTd4Undefined = "text-left";
                if (ownerId === '-2') {
                    ownerName = "Undefined";
                    cssTd4Undefined = " text-right ";
                }

                var overall = 0;
                var n = (owners4New[ownerId] && owners4New[ownerId] !== undefined) ? parseInt(owners4New[ownerId]) : 0;
                var c = (owners4Change[ownerId] && owners4Change[ownerId] !== undefined) ? parseInt(owners4Change[ownerId]) : 0;
                var b = (owners4Bug[ownerId] && owners4Bug[ownerId] !== undefined) ? parseInt(owners4Bug[ownerId]) : 0;
                overall = n + c + b;
                idxNew += n;
                idxChange += c;
                idxBug += b;
                var tr = $("<tr>")
                        .append($("<td>").addClass(cssTd4Undefined).append(this.GetOwnerInfo(ownerId)).append(" ").append(ownerName))
                        .append($("<td>").append(owners4New[ownerId]))
                        .append($("<td>").append(owners4Change[ownerId]))
                        .append($("<td>").css("border-right", "1px solid #abc4ff").append(owners4Bug[ownerId]))
                        .append($("<td>").append($("<b>").append(overall)))
                        ;
                table.append(tr);
            }

            var tr1 = $("<tr>")
                    .append($("<td>").addClass("text-right").append($("<b>").append("Total")))
                    .append($("<td>").append($("<b>").append(idxNew)))
                    .append($("<td>").append($("<b>").append(idxChange)))
                    .append($("<td>").css("border-right", "1px solid #abc4ff").append($("<b>").append(idxBug)))
                    .append($("<td>").append($("<b>").append(idxNew + idxChange + idxBug)))
                    ;
            table.append(tr1);
            $('#stat-general-info-ncb').html(table);
        },
        CreatePivotMatrix4Group: function (owners4New, owners4Change, owners4Bug, owners4New4Task, owners4Change4Task, owners4Bug4Task) {
            var table = $("<table>")
                    .addClass("table table-hover project-table-list text-center")
                    .append($('<thead>')
                            .append($("<th>").append("Owner"))
                            .append($("<th>").append("# New Request"))
                            .append($("<th>").append("# Change Request"))
                            .append($("<th>").append("# Bug"))
                            .append($("<th>").append("# Total"))
                            )
                    ;
            var ownerList = SAProjectUser.GetKeys();
            if ("-2" in  owners4Bug || "-2" in  owners4Change || "-2" in  owners4New) {
                ownerList.push('-2');
            }

            var idxNew = 0;
            var idxChange = 0;
            var idxBug = 0;
            for (var id in ownerList) {
                var ownerId = ownerList[id];
                var ownerName = SAProjectUser.GetDetails(ownerId, "userName");
                var cssTd4Undefined = "text-left";
                if (ownerId === '-2') {
                    ownerName = "Undefined";
                    cssTd4Undefined = " text-right ";
                }

                var overall = 0;
                var n = (owners4New[ownerId] && owners4New[ownerId] !== undefined) ? parseInt(owners4New[ownerId]) : 0;
                var c = (owners4Change[ownerId] && owners4Change[ownerId] !== undefined) ? parseInt(owners4Change[ownerId]) : 0;
                var b = (owners4Bug[ownerId] && owners4Bug[ownerId] !== undefined) ? parseInt(owners4Bug[ownerId]) : 0;
                overall = n + c + b;
                idxNew += n;
                idxChange += c;
                idxBug += b;
                var tr = $("<tr>")
                        .append($("<td>").addClass(cssTd4Undefined).append(this.GetOwnerInfo(ownerId)).append(" ").append(ownerName))
                        .append($("<td>")
                                .append((owners4New[ownerId]) ? $("<b>").append("Total - ").append(owners4New[ownerId]) : "")

//                                .append(owners4New[ownerId])
                                .append(this.GetTaskNatureGroupByStatus4New(owners4New4Task, ownerId))
                                .append(this.GetTaskNatureGroupByStatus4Ongoing(owners4New4Task, ownerId))
                                .append(this.GetTaskNatureGroupByStatus4Closed(owners4New4Task, ownerId))
                                )
                        .append($("<td>")
                                .append((owners4Change[ownerId]) ? $("<b>").append("Total - ").append(owners4Change[ownerId]) : "")
//                                .append(owners4Change[ownerId])
                                .append(this.GetTaskNatureGroupByStatus4New(owners4Change4Task, ownerId))
                                .append(this.GetTaskNatureGroupByStatus4Ongoing(owners4Change4Task, ownerId))
                                .append(this.GetTaskNatureGroupByStatus4Closed(owners4Change4Task, ownerId))
                                )
                        .append($("<td>")
                                .css("border-right", "1px solid #abc4ff")
                                .append((owners4Bug[ownerId]) ? $("<b>").append("Total - ").append(owners4Bug[ownerId]) : "")
                                .append(this.GetTaskNatureGroupByStatus4New(owners4Bug4Task, ownerId))
                                .append(this.GetTaskNatureGroupByStatus4Ongoing(owners4Bug4Task, ownerId))
                                .append(this.GetTaskNatureGroupByStatus4Closed(owners4Bug4Task, ownerId))
                                )
                        .append($("<td>").append($("<b>").append(overall)))
                        ;
                table.append(tr);
            }


            $('#stat-general-info-ncb-details').html(table);
        },
        GetTaskNatureGroupByStatus4New: function (ownerTaskList, ownerId) {
            var res = '';
            try {
                res = $('<div>')
                        .append($('<span>').addClass('us-list-item us-item-status-new').append("new"))
                        .append($('<span>').append(" - "))
                        .append($('<span>').append(ownerTaskList[ownerId]['n']));
            } catch (err) {
                console.log(err)
            }
            return res;
        },
        GetTaskNatureGroupByStatus4Ongoing: function (ownerTaskList, ownerId) {
            var res = '';
            try {
                res = $('<div>')
                        .append($('<span>').addClass('us-list-item us-item-status-ongoing').append("ongoing"))
                        .append($('<span>').append(" - "))
                        .append($('<span>').append(ownerTaskList[ownerId]['o']));
            } catch (err) {
                console.log(err)
            }
            return res;
        },
        GetTaskNatureGroupByStatus4Closed: function (ownerTaskList, ownerId) {
            var res = '';
            try {
                res = $('<div>')
                        .append($('<span>').addClass('us-list-item us-item-status-closed').append("ongoing"))
                        .append($('<span>').append(" - "))
                        .append($('<span>').append(ownerTaskList[ownerId]['c']));
            } catch (err) {
                console.log(err)
            }
            return res;
        },
    },
}


