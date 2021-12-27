// ****************************
//    Bug List 30.08.2020
// ****************************

// Bug List table show and hide
var bug_filter = {
    search_text: '',
    project_id: '',
    backlog_id: '',
    assignee_id: '',
    created_by: '',
    closed_by: '',
    status: '',
    priority: '',
    nature: '',
    limit: 30,
    page_no: 1,
    sprint_id: '',
    label_id: '',
    showChildTask: '1',
}

var sprintTaskIds = "";
var labelTaskIds = "";
var bugId = "";

var coreBugList = {};
var coreBugKV = {};

function getSprintNamesByTask() {
    var select = $('.task-mgmt-modal-sprintname');
    select.html('');

    var json = initJSON();
    json.kv.fkBacklogTaskId = global_var.current_us_task_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetSprintNamesByTask",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            var obj = (res && res.tbl && res.tbl.length > 0) ? res.tbl[0].r : [];
            for (var i in obj) {
                var o = obj[i];
                var d = ((o.sprintStartDate) && (o.sprintEndDate)) ?
                        " (" + Utility.convertDate(o.sprintStartDate) + "-" + Utility.convertDate(o.sprintEndDate) + ")" :
                        "";

                var st = $('<span>')
                        .text(o.sprintName)
                        .append(d)
                        .append("<br>")
                        .attr("class", "lbl-item")
                        .css("font-size", "12px")
                        .attr("style", "font-size:12px;color:" + o.sprintColor)

                select.append(st);
            }

            //            new Label().load4Task()
        }
    });
}
var cl = 3232;

function sortTable(sv, cls) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("bugListTable");
    switching = true;
    /*Make a loop that will continue until
     no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
             one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[sv];
            y = rows[i + 1].getElementsByTagName("TD")[sv];
            //check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
             and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }

    var trList = $(table).find(".bug-tr");

    var fTr
    for (let index = 0; index < trList.length; index++) {
        $(trList[index]).find("td:first-child").html(index + 1)
        var tbl = "id-row" + cl
        fTr = $(trList[0]);
        if (index === 0) {
            var tx = fTr.find("." + cls).find(".get-data-group").html();

            if (tx.length < 1) {
                tx = "undefined"
            }

            fTr.before($("<tr>")
                    .addClass("groupTrElement")
                    .append($("<td>")
                            .addClass("groupTdElement")
                            .append($("<div>")
                                    .append('<span data-closed="0" data-aidli=' + tbl + ' class="bugChangegroupArrow"><i class="fas fa-chevron-down"></i></span>')
                                    .append(tx)
                                    .addClass("groupTableDivInside"))))
        }

        var htm = $(trList[index]).find("." + cls).find(".get-data-group").html();
        var htm1 = $(trList[index + 1]).find("." + cls).find(".get-data-group").html();


        if (htm === htm1) {
            $(trList[index]).attr("data-aid", tbl)

        } else {
            $(trList[index]).attr("data-aid", tbl);
            cl++
            tbl = "id-row" + cl;
            if (htm1 === '') {
                htm1 = "undefined"
            }
            if (index === trList.length) {
                console.log(index);
                $(trList[index]).attr("data-aid", tbl);
            }
            $(trList[index]).after($("<tr>")
                    .addClass("groupTrElement")
                    .append($("<td>")
                            .addClass("groupTdElement")

                            .append($("<div>")
                                    .append('<span data-closed="0" data-aidli=' + tbl + ' class="bugChangegroupArrow"><i class="fas fa-chevron-down"></i></span>')
                                    .append(htm1)
                                    .addClass("groupTableDivInside"))));

        }



    }



}
$(document).on("change", "#inputGroupSelect01", function (e) {

    getBugList();

})


function getGroupList() {
    try {

        var sv = $("#inputGroupSelect01").val();

        var td = $("#bugListTable tbody tr td:eq(" + sv + ")").attr("class").split(/\s+/);


        $.each(td, function (index, item) {
            if (item === 'bug-list-column') {

            } else {

                sortTable(sv, item);
            }
        })
    } catch (error) {

    }

}

$(document).on('click', '.bugChangegroupArrow', function (evt) {
    var dt = $(this).attr("data-closed");
    var dst = $(this).attr("data-aidli");
    if (dt == 1) {


        $(this).html('<i class="fas fa-chevron-down"></i>');
        $(this).attr("data-closed", 0);
    }
    if (dt == 0) {

        $(this).html('<i class="fas fa-chevron-right"></i>');
        $(this).attr("data-closed", 1);
    }
    $("[data-aid=" + dst + "]").toggle("fast");
})
$(document).on('click', '.bug-task-filter-checkbox-label', function (evt) {

    var rc = getLabelFilterCheckedCount();
    if (rc > 0) {
        $('.bug-filter-badge-label').show();
        $('.bug-filter-badge-label').html(rc)
    } else {
        $('.bug-filter-badge-label').hide();
    }

    if (global_var.current_modal === 'loadBugChange') {
        getBugList();
    } else if (global_var.current_modal === 'loadTaskManagement') {
        $('.' + global_var.task_mgmt_group_by).click();
    }
})

$(document).on('click', '.bug-task-filter-checkbox-sprint', function (evt) {

    var rc = getSprintFilterCheckedCount();
    if (rc > 0) {
        $('.bug-filter-badge').show();
        $('.bug-filter-badge').html(rc)
    } else {
        $('.bug-filter-badge').hide();
    }

    if (global_var.current_modal === 'loadBugChange') {
        getBugList();
    } else if (global_var.current_modal === 'loadTaskManagement') {
        $('.' + global_var.task_mgmt_group_by).click();
    } else if (global_var.current_modal === 'loadTaskTypeManagment') {
        genTaskTypeManagmentView4None();
    }
})

function getLabelFilterCheckedCount() {
    var rc = 0;
    $('.bug-task-filter-checkbox-label').each(function () {
        if ($(this).is(":checked")) {
            rc++;
        }
    })
    return rc;
}


function getSprintFilterCheckedCount() {
    var rc = 0;
    $('.bug-task-filter-checkbox-sprint').each(function () {
        if ($(this).is(":checked")) {
            rc++;
        }
    })
    return rc;
}

function lableAddAssign(elm) {
    var check = $("#bugListTable .bug-tr .checkbox-issue-task");

    var labelId = $(elm).attr("id");
    for (var indx = 0; indx < check.length; indx++) {


        if ($(check[indx]).prop('checked')) {

            var projectId = $(check[indx]).parents("tr").attr('projectid');
            var backlogId = $(check[indx]).parents("tr").attr('stIdr') ? '-1' : "";
            var id = $(check[indx]).parents("tr").attr("id");


            var checked = '1';


            var json = {
                kv: {}
            };
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }
            json.kv['fkLabelId'] = labelId;
            json.kv['fkProjectId'] = projectId;
            json.kv.fkBacklogId = backlogId;
            json.kv['fkBacklogTaskId'] = id;
            json.kv.assign = checked;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmAssignLabelToTask",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    new Label().load4Task()
                },
                error: function () {
                    Toaster.showError(('Something went wrong!!!'));
                }
            });

        }

    }


}
;


function sprintAddAssignTaskType(elm) {




    var check = $(".task-content .checkbox-task-type-task");
    var sprintId = $(elm).attr("id");
    var projectId = $('.projectList_liveprototype_tasktypemgmt').val();

    for (var indx = 0; indx < check.length; indx++) {


        if ($(check[indx]).prop('checked')) {


            var backlogId = $(check[indx]).attr('stIdr');
            ;
            var id = $(check[indx]).attr("tid");

            var checked = '1';

            sprintZadininSheyeidlmesi(id, projectId, backlogId, sprintId, checked);

        }

    }


}
;
function sprintAddAssign(elm, actionType) {




    var check = $("#bugListTable .bug-tr .checkbox-issue-task");
    var sprintId = $(elm).attr("id");

    for (var indx = 0; indx < check.length; indx++) {


        if ($(check[indx]).prop('checked')) {

            var projectId = $(check[indx]).parents("tr").attr('projectid');
            var backlogId = $(check[indx]).parents("tr").attr('stIdr') ? '-1' : "";
            ;
            var id = $(check[indx]).parents("tr").attr("id");

            var checked = (actionType === 'unassign') ? '0' : '1';

            sprintZadininSheyeidlmesi(id, projectId, backlogId, sprintId, checked);

        }

    }


}
;

function sprintZadininSheyeidlmesi(id, projectId, backlogId, sprintId, checked) {
    var json = initJSON();
    json.kv['fkSprintId'] = sprintId;
    json.kv['fkProjectId'] = projectId;
    json.kv.fkBacklogId = backlogId;
    json.kv['fkBacklogTaskId'] = id;
    json.kv.assign = checked;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAssignSprintToTask",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            new Sprint().load4Task()
        }
    });
}

function deleteBugFromTable(el) {
    if (!bugId) {
        return;
    }

    if (!confirm("Are you sure?")) {
        return;
    }

    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = bugId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteBacklogTask",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SATask.deleteTask(bugId);
            SATask.RemoveFromOrderNo(bugId);
            $('#addBugBtnClose').click();
            //            getBugList();

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}



function addNewTask4BugMultiZad() {

    var val = $('#taskNameInputNew2').val();
    if (!val) {
        Toaster.showError('Məzmun daxil edilməmişdir.');
    }

    var data = {};

    data.comment = $('#addComment4Task_comment_new').val();
    var files = $('#addComment4Task_addnewfile').attr('fname');
    
    $('.canvas-sub-class').each(function (e) {
        files += $(this).attr('fname') + "|";
    })

    var sprintList = "";
    $('.bug-task-filter-checkbox-sprint').each(function () {
        if ($(this).is(":checked")) {
            sprintList += $(this).val() + ',';
        }
    })

    data.taskName = val;
    data.filename = files;
    data.fkProjectId = $('#bug_filter_project_id_add').val();
    data.fkBacklogId = $('#bug_filter_backlog_id_add').val();
    data.fkAssigneeId = $('#bug_filter_assignee_id_add').val();
    data.fkTaskTypeId = $("#bug_task_type_id_add").val();
    data.taskNature = $("#bug_task_nature_id_add").val();
    data.taskPriority = $("#bug_filter_priority_add").val();
    //data.taskNature = $("#bug_filter_project_id_add").val();
    data.sprintList = sprintList;


    data.startDate = toDate("runTaskStartDate");
    data.endDate = toDate("runTaskEndDate");
    data.runTime = GetConvertedTime("runTaskTime");
    data.intensive = $("#run_task_intensive_select").val();
    data.repeatInterval = $("#run_task_repeat_select").val();
    data.scheduleStatus = $("#run_task_status_select").val();
// data.description = $("#bug_filter_project_id_add").val();
    data.actionParam = getMultiSelectpickerValueByElementName("run_task_weekday_select");
    data.action = $("#bug_filter_project_id_add").val();
    data.weekdays = $("#swofm_weekday_select").val();
    data.sendNotification = $("#sendnotification").is(":checked") ? "1" : "0";
    data.notificationMail = $("#bug_filter_project_id_add").val();
    data.remindMeParam = $("#bug_filter_project_id_add").val();
    data.activateSchedule = $("#runTaskAvtivateSchedule").is(":checked") ? "1" : "0";


    data.monthlyAction = $("#monthlyAction:checked").val();
    data.actionDayOfMonth = $("#sdofm_day_of_Month_select").val();
    data.dayBeforeLastDayOfMonth = $("#days_before_last_day_of_month").val();
    data.specificWeekDayOfMonthAction = $("#swofm_fl_action_select").val();
    data.specificWeekDayOfMonthWeekdays = $("#swofm_weekday_select").val();
    data.taskCheckList = $('#commentinput_for_taskcreatechecklist').val();



    insertNewTaskDetail4BugZad(data);


}


function addNewTask4BugMulti(tskNm) {
    if (!tskNm.trim()) {
        return;
    }
    var taskName = tskNm;
    var projectList = $('#bug_filter_project_id_add').val();
    if (projectList.length === 0) {
        Toaster.showError("Please select project(s).")
        return;
    }

    var backlogList = $('#bug_filter_backlog_id_add').val()
    /*    : ['-1']; */
    var assigneeList = $('#bug_filter_assignee_id_add').val()

    var sprintList = "";
    $('.bug-task-filter-checkbox-sprint').each(function () {
        if ($(this).is(":checked")) {
            sprintList += $(this).val() + ',';
        }
    })

    var taskTypeName = $("#bug_task_type_id_add").val();

    var taskNature = $("#bug_task_nature_id_add").val();

    var taskPriority = $("#bug_filter_priority_add").val();


    /*   for (var bid in backlogList) {
     for (var aid in assigneeList) { */
    insertNewTaskDetail4Bug(taskName, backlogList, assigneeList, 'new', projectList, sprintList, taskTypeName, taskNature, taskPriority)
    /*    }
     }
     */

    if (global_var.current_modal === 'loadBugChange') {
        getBugList();
    }

}
function addNewTask4Bug(el) {
    if (!$(el).val().trim()) {
        return;
    }
    var taskName = $(el).val().trim();
    var projectList = $('#bug_filter_project_id_add').val();
    if (projectList.length === 0) {
        Toaster.showError("Please select project(s).")
        return;
    }

    var backlogList = $('#bug_filter_backlog_id_add').val()
    /*    : ['-1']; */
    var assigneeList = $('#bug_filter_assignee_id_add').val()

    var sprintList = "";
    $('.bug-task-filter-checkbox-sprint').each(function () {
        if ($(this).is(":checked")) {
            sprintList += $(this).val() + ',';
        }
    })

    var taskTypeName = $("#bug_task_type_id_add").val();

    var taskNature = $("#bug_task_nature_id_add").val();

    var taskPriority = $("#bug_filter_priority_add").val();


    /*   for (var bid in backlogList) {
     for (var aid in assigneeList) { */
    insertNewTaskDetail4Bug(taskName, backlogList, assigneeList, 'new', projectList, sprintList, taskTypeName, taskNature, taskPriority)
    /*    }
     }
     */

    $(el).val('');
    getBugList();
}

function addNewTask4BugInput(el) {
    if (!$(el).val().trim()) {
        return;
    }

    var tskNature = $("#bug_add_nature").val();
    var taskName = $(el).val().trim();
    var projectList = $('#bug_filter_project_id').val();
    if (projectList.length === 0) {
//        Toaster.showError("Please select project(s).")
//        return;
        projectList = '-1';
    }

    var backlogList = ($('#bug_filter_backlog_id').val().length > 0) ?
            $('#bug_filter_backlog_id').val() : ['-1'];
    var assigneeList = ($('#bug_filter_assignee_id').val().length > 0) ?
            $('#bug_filter_assignee_id').val() : ['-1'];
    var sprintList = "";
    $('.bug-task-filter-checkbox-sprint').each(function () {
        if ($(this).is(":checked")) {
            sprintList += $(this).val() + ',';
        }
    })


    for (var bid in backlogList) {
        for (var aid in assigneeList) {
            insertNewTaskDetail4Bug(taskName, backlogList[bid], assigneeList[aid], 'new', projectList, sprintList, "", tskNature, "")
        }
    }


    $(el).val('');
    getBugList();
}



function insertNewTaskDetail4BugZad(dataCore) {

    var json = initJSON();
    var dataPure = $.extend(json.kv, dataCore);
    json.kv = dataPure;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTaskCoreNew",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            createdEventsTaskData(res.kv.id);
            getBugList();
            Toaster.showMessage('Tapşırıq uğurla daxil edilmişdir');
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function insertNewTaskDetail4Bug(taskName, backlogId, assgineeId, taskStatus, projectId, sprintList, taskTypeName, taskNature, taskPriority) {
    if (!(taskName))
        return;
    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    projectId = (projectId) ? projectId : global_var.current_project_id;
    if (!projectId) {
        return;
    }

    var id = "";

    backlogId = (backlogId) ? backlogId : "-1";
    assgineeId = (assgineeId) ? assgineeId : "-1";
    taskStatus = (taskStatus) ? taskStatus : "new";
    json.kv['fkProjectId'] = projectId;
    json.kv['fkBacklogId'] = backlogId;
    json.kv['fkAssigneeId'] = assgineeId;
    json.kv.taskName = taskName;
    json.kv.taskStatus = taskStatus;
    json.kv.taskNature = taskNature;
    json.kv.fkTaskTypeId = taskTypeName;
    json.kv.taskPriority = taskPriority;
    json.kv.sprintList = sprintList;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTask4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            id = res.kv.id;
            SATask.updateTaskByRes(res);
            SACore.updateBacklogByRes(res);

            if (global_var.current_modal === 'loadStoryCardMgmt') {
                $(".user-story-prototype-change1[data-bid='" + backlogId + "']").change();
            }
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    return id;
}

$(document).on("change", '.bug-filter', function (e) {
    if (global_var.current_modal == "loadBugChange") {
        bug_filter.page_no = 1;
        getBugList();
    }

})

$(document).on("click", '.page-item-core-previous', function (e) {
    if (global_var.current_modal == "loadBugChange") {
        bug_filter.page_no = parseInt(bug_filter.page_no) - 1;
        getBugList();
    }

})

$(document).on("click", '.page-item-core-next', function (e) {
    if (global_var.current_modal == "loadBugChange") {
        bug_filter.page_no = parseInt(bug_filter.page_no) + 1;
        getBugList();
    }

})

$(document).on("click", '.page-item-core', function (e) {
    bug_filter.page_no = $(this).attr("page-no");
    getBugList();
})

function callBugFilterMulti(el) {
    bug_filter.page_no = 1;
    getBugList();
}

//$(document).on("change", '.bug-filter-multi', function (e) {
//    getBugList();
//})

function setBugFilterAssignees() {

    var json = initJSON();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetUserListByProjects",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            var select = $('#bug_filter_assignee_id');
            var select2 = $('#bug_filter_created_by');
            var select3 = $('#bug_filter_assignee_id_add');
            var select4 = $('#bug_filter_assignee_id_multi');
            var select5 = $('#bug_filter_closed_by');
            select.html('');
            select2.html('');
            select5.html('');
            var obj = res.tbl[0].r;
            for (var id in obj) {
                var o = obj[id];
                var op = $("<option>").val(o.fkUserId).text(o.userName);
                var op2 = $("<option>").val(o.fkUserId).text(o.userName);
                var op3 = $("<option>").val(o.fkUserId).text(o.userName);
                var op4 = $("<option>").val(o.fkUserId).text(o.userName);
                var op5 = $("<option>").val(o.fkUserId).text(o.userName);
                select.append(op);
                select2.append(op2);
                select3.append(op3);
                select4.append(op4);
                select5.append(op5);
            }

            if (global_var.current_user_type === 'S') {
                select.val(global_var.current_ticker_id)
            }

            select.selectpicker('refresh');
            select2.selectpicker('refresh');
            select3.selectpicker('refresh');
            select4.selectpicker('refresh');
            select5.selectpicker('refresh');
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function getBugFilterProjectList4Sprint() {
    var st = "";

    if (global_var.current_modal === 'loadTaskManagement') {
        st = "-1%IN%";
        st += global_var.current_project_id;
    } else if (global_var.current_modal === 'loadBugChange ') {
        st = "-1";
        var keys = Object.keys(SACore.Project);
        for (var id in keys) {
            var pid = keys[id];
            st += "%IN%" + pid;
        }
    }

    return st;
}

function setBugFilterProject() {
    var select = $('#bug_filter_project_id');
    var keys = Object.keys(SACore.Project);
    select.append($("<option>")
            .val("")
            .text("All Projects"))
    for (var id in keys) {
        var pid = keys[id];
        select.append($("<option>")
                .val(pid)
                .text(SACore.Project[pid]))
    }
}

function setBugFilterProjectAdd(elId) {
    var select = $("#" + elId);
    var keys = Object.keys(SACore.Project);
    select.append($("<option>")
            .val("")
            .text("All Projects"))
    for (var id in keys) {
        var pid = keys[id];
        select.append($("<option>")
                .val(pid)
                .text(SACore.Project[pid]))
    }

    $('#' + elId).selectpicker('refresh');
}

function addUserStoryNewPopupBug() {
    var usName = $('#addUserStoryPopupModal-userstoryname1').val();
    var prid = $('#bug_filter_project_id_add_pop').val();

    if (!prid) {
        Toaster.showError("Please Choose Project")
        return
    }
    if (!usName)
        return;

    var json = initJSON();
    json.kv['backlogName'] = usName;
    json.kv['fkProjectId'] = prid;
    json.kv['isApi'] = "0";
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogShort",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            Toaster.showMessage("Story Card added successfully");
            $('#addUserStoryPopupModal-userstoryname1').val('');
            SACore.addBacklogByRes(res);
            SACore.SetBacklogNo(res.kv.backlogNo, res.kv.id);
            loadCurrentBacklogProdDetails();

            global_var.current_backlog_id = res.kv.id;
            Utility.addParamToUrl('current_backlog_id', global_var.current_backlog_id);
            $('#bug_filter_project_id').change();
            // $('.projectList_activity').change();
            $('#addUserStoryPopupModal-userstoryname').val('');
//            $('#addUserStoryPopupModalwithProject').modal('hide');

            if (global_var.current_modal === 'loadStoryCard') {
                $('.projectList_liveprototype_storycard').change();
            }

            $("#bug_filter_backlog_id").val(res.kv.id)
            $("#bug_filter_backlog_id").change()
        }
    });
}

function addUserStoryNewModalWithProject() {
    var select = $('#bug_filter_project_id_add_pop');
    var keys = Object.keys(SACore.Project);
    select.append($("<option>")
            .val("")
            .text("All Projects"))
    for (var id in keys) {
        var pid = keys[id];
        select.append($("<option>")
                .val(pid)
                .text(SACore.Project[pid]))
    }


    $('#bug_filter_project_id_add_pop').selectpicker('refresh');
    $('#addUserStoryPopupModalwithProject').modal('show');
    $('#addUserStoryPopupModal-userstoryname').focus();
}



function setBugFilterMultiValues() {
    $('.bug-filter-multi').each(function () {
        var data_type = $(this).attr('data-type');
        var val = getBugFilterMultiSelect(this)
        bug_filter[data_type] = val;
    })
}

function getBugFilterMultiSelect(el) {
    var id = $(el).val();
    var st = "";
    for (var i = 0; i < id.length; i++) {
        st += "'" + id[i] + "'"
        if (i < id.length - 1) {
            st += ','
        }
    }
    return st;
}

function getBugFilterMultiSelectById(elementId) {
    return getBugFilterMultiSelect(document.getElementById(elementId));
}

function setBugFilterValues() {
    $('.bug-filter').each(function () {
        var data_type = $(this).attr('data-type');
        bug_filter[data_type] = $(this).val();
    })
}

function setBugFilterCheckBoxValues() {
    $('.bug-filter-checkbox').each(function () {
        var data_type = $(this).attr('data-type');
        bug_filter[data_type] = $(this).is(":checked") ? "1" : "0";
    })
}


function setBugFilterLabelValues() {
    var st = ' ';
    $('.bug-task-filter-checkbox-label').each(function () {
        if ($(this).is(":checked")) {
            st += "'" + $(this).val() + "',";
        }
    })
    st = st.substring(0, st.length - 1);
    bug_filter.label_id = st;
}

function setBugFilterSprintValues() {
    var st = ' ';
    $('.bug-task-filter-checkbox-sprint').each(function () {
        if ($(this).is(":checked")) {
            st += "'" + $(this).val() + "',";
        }
    })
    st = st.substring(0, st.length - 1);
    bug_filter.sprint_id = st;
}

$(document).on("click", '.openBugStatus', function (e) {
    openTaskDialog();
})
$(document).on("click", '#addNewTaskButton', function (e) {
    reset_task_data();
    global_var.active_canvas = 'taskCreate';
    setBugFilterProjectAdd('bug_filter_project_id_add');
    var dwlmt = $('#bug_task_type_id_add')
    add_loadTaskType_bug_list(dwlmt);
    $('#issue-managment-add-task .after-add-task').css("pointer-events", "none");
    $('#issue-managment-add-task .after-add-task').css("opacity", "0.7");
    $('#issue-managment-add-task .task-step-1').show();
    $('#issue-managment-add-task .task-step-2').hide();
    $('#issue-managment-add-task #details-tab').click();
})
$(document).on("click", '#update_multi_bug_change_btn', function (e) {

    var fkAssigneeId = $("#bug_filter_assignee_id_multi").val();
    var fkTaskTypeId = $("#bug_task_type_id_multi").val();
    var fkBacklogId = $("#bug_filter_backlog_id_multi").val();
    var taskPriority = $("#bug_filter_priority_add").val();
    var taskNature = $("#bug_task_nature_id_multi").val();
    var taskStatus = $("#bug_task_status_id_zad").val();

    var check = $("#bugListTable .bug-tr .checkbox-issue-task");

    if (!fkAssigneeId == 0) {

        for (var indx = 0; indx < check.length; indx++) {
            if ($(check[indx]).prop('checked')) {
                var taskId = $(check[indx]).parents("tr").attr("id");
                multiUpdateTask4ShortChangePure(fkAssigneeId, "fkAssigneeId", taskId);
            }
        }
    }
    if (!fkTaskTypeId == 0) {

        for (var indx = 0; indx < check.length; indx++) {
            if ($(check[indx]).prop('checked')) {
                var taskId = $(check[indx]).parents("tr").attr("id");
                multiUpdateTask4ShortChangePure(fkTaskTypeId, "fkTaskTypeId", taskId);
            }
        }
    }
    if (!fkBacklogId == 0) {
        for (var indx = 0; indx < check.length; indx++) {
            if ($(check[indx]).prop('checked')) {
                var taskId = $(check[indx]).parents("tr").attr("id");
                multiUpdateTask4ShortChangePure(fkBacklogId, "fkBacklogId", taskId);
            }
        }
    }
    if (!taskPriority == 0) {
        for (var indx = 0; indx < check.length; indx++) {
            if ($(check[indx]).prop('checked')) {
                var taskId = $(check[indx]).parents("tr").attr("id");
                multiUpdateTask4ShortChangePure(taskPriority, "taskPriority", taskId);
            }
        }
    }
    if (!taskNature == 0) {
        for (var indx = 0; indx < check.length; indx++) {
            if ($(check[indx]).prop('checked')) {
                var taskId = $(check[indx]).parents("tr").attr("id");
                multiUpdateTask4ShortChangePure(taskNature, "taskNature", taskId);
            }
        }
    }
    if (taskStatus) {
        for (var indx = 0; indx < check.length; indx++) {
            if ($(check[indx]).prop('checked')) {
                var taskId = $(check[indx]).parents("tr").attr("id");
                multiUpdateTask4ShortChangePure(taskStatus, "taskStatus", taskId);
            }
        }
    }
    $("#multieditpopUp").modal("hide");
    getBugList();
})


function multiUpdateTask4ShortChangePure(val, ustype, taskId) {
    try {

        if (ustype.lentgh === 0 || val.lentgh === 0 || taskId === 0) {
            return;
        }
    } catch (e) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = taskId;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateTask4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SATask.addTaskByRes(res);
            SACore.updateBacklogByRes(res);

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

$(document).on("click", '#multi-edit-menu-btn', function (e) {
    setBugFilterProjectAdd('bug_filter_project_id_multi');
    var dwlmt = $('#bug_task_type_id_multi')
    add_loadTaskType_bug_list(dwlmt)
})

function openTaskDialog() {
    return;
    global_var.bug_list_popup_is_opened = true;
    $('.updateBugList').css('visibility', 'visible');
    $('.bug-tr').find('.active').first().click();
}

$(document).on("click", '#addBugBtnClose', function (e) {
    getBugList();
    global_var.bug_list_popup_is_opened = false;
    $('.updateBugList').css('visibility', 'hidden');
    // $('#addBuglist').removeClass('col-lg-5');
    // $('#addBuglist').addClass('col-lg-12');           bunlar silinmelidir 20.09.20
})

// bug list active tr
global_var.bug_list_popup_is_opened = false;



//$(document).on("dblclick", '.bug-tr', function (e) {
//    openTaskDialog();
//})

$(document).on("click", '.bug-tr', function (e) {
    $('.bug-tr').removeClass("active");
    $(this).toggleClass("active")
    var bugId = $(this).attr("id");
    global_var.current_issue_id = bugId;
    Utility.addParamToUrl('current_issue_id', global_var.current_issue_id);
    //    if (global_var.bug_list_popup_is_opened) {
    //        var taskId = $(this).attr("id");
    //        var projectId = $(this).attr("projectId");
    //        if (!taskId) {
    //            return;
    //        }
    //        loadTaskInfoToContainer(taskId, projectId);
    //        showAssigneeTaskCardIn(taskId, 'updateBugList-taskinfo');
    //        $('#task-mgmt-tasktype')
    //                .after($('<div class="statusCardStory">')
    //                        .append($('<span>').addClass('comment-content-header-history').css('margin-left', '0px').append('Project'))
    //                        .append(getProjectList4TaskInfo()))
    //
    //    }

})

function getProjectList4TaskInfo(currentProjectId) {
    $('#task-card-project-id').remove();
    var select = $('<select>')
            .attr('id', 'task-card-project-id')
            .attr('onchange', "updateTask4ShortChange(this, 'fkProjectId')");
    var keys = Object.keys(SACore.Project);
    for (var id in keys) {
        var pid = keys[id];
        var td = $("<option>")
                .val(pid)
                .text(SACore.Project[pid]);
        if (pid === currentProjectId) {
            td.attr("selected", "selected")
        }
        select.append(td);

    }

    return select;
}



// bug list icon -toggle
function arrowHideShow(el, id) {
    $('#bug_i' + id).toggleClass('fa-angle-right')
    $('#bug_i' + id).toggleClass('fa-angle-down')
    if ($(el).is('.arrow-right')) {
        $('#bug_tr' + id).toggle();
    }
}

//function insertNewTask4Bug(el, taskStatus) {
//    var bugDesc = $(el).parent().find("#bugDescription").val();
//    var backlogId = global_var.task_mgmt_group_by === 'userStoryTab' ? $(el).attr('us-id') : "-1";
//    var assgineeId = global_var.task_mgmt_group_by === 'assignee' ? $(el).attr('us-id') : "-1";
//    this.addNewBug(bugDesc, backlogId, assgineeId, taskStatus);
//}


// _________________________________________________________________
function addNewBug(bugDesc, backlogId, assgineeId, taskStatus) {
    var bugDesc = $('#bugDescription').val();
    if (!(bugDesc))
        return;
    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    backlogId = (backlogId) ? backlogId : "-1";
    assgineeId = (assgineeId) ? assgineeId : "-1";
    taskStatus = (taskStatus) ? taskStatus : "new";
    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['fkBacklogId'] = backlogId;
    json.kv['fkAssigneeId'] = assgineeId;
    json.kv.taskName = bugDesc;
    json.kv.taskStatus = taskStatus;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTask4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getBugList();
            $('#bugDescription').val('');

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}
// _______________________________________________________________  


// ______________________________________________________________

function setBugListInitialData() {
    setBugFilterCheckBoxValues();
    setBugFilterValues();
    setBugFilterMultiValues();
    setBugFilterSprintValues();
    setBugFilterLabelValues();

    bug_filter.sortBy = $('#bug_filter_sortby').val();
    bug_filter.sortByAsc = $('#bug_filter_sortby_asc').val();
    bug_filter.closed_date_from = GetConvertedDate('issue_management_closed_date_from');
    bug_filter.closed_date_to = GetConvertedDate('issue_management_closed_date_to');

}

$(document).on("change", ".issue-mgmt-general-filter", function (e) {
    getBugList();
})

function getBugList() {
    setBugListInitialData();
    var json = initJSON();
    json.kv.fkProjectId = bug_filter.project_id;
    json.kv.fkAssigneeId = bug_filter.assignee_id;
    json.kv.closedBy = bug_filter.closed_by;
    json.kv.createdBy = bug_filter.created_by;
    json.kv.fkBackogId = bug_filter.backlog_id;
    json.kv.taskStatus = bug_filter.status;
    json.kv.priority = bug_filter.priority;
    json.kv.taskNature = bug_filter.nature;
    json.kv.searchText = bug_filter.search_text;
    json.kv.searchLimit = bug_filter.limit;
    json.kv.pageNo = bug_filter.page_no;
    json.kv.sprintId = bug_filter.sprint_id;
    json.kv.labelId = bug_filter.label_id;
    json.kv.sortBy = bug_filter.sortBy;
    json.kv.sortByAsc = bug_filter.sortByAsc;
    json.kv.closedDateFrom = bug_filter.closed_date_from;
    json.kv.closedDateTo = bug_filter.closed_date_to;
    json.kv.showChildTask = bug_filter.showChildTask;
    json.kv.showChildTask = bug_filter.showChildTask;
    json.kv.startLimit = 0;
    json.kv.endLimit = 25;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Table",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            AJAXCallFeedback(res);
            coreBugList = res;
            setKV4CoreBugList();
            getBugListDetails(res);
            toggleColumns();
            setPagination(res.kv.tableCount, res.kv.limit);
            getGroupList();

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });

}

function setKV4CoreBugList() {
    try {
        var obj = coreBugList.tbl[0].r;
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            coreBugKV[o.id] = o;
            SATask.AddTask(o);
        }
    } catch (err) {
    }
}

function setPagination(rowcount, limit) {
    var rc = Math.ceil(rowcount / limit);
    var el = $('#pagination_block');
    el.html('');
    el.append($('<li class="page-item page-item-core-previous">')
            .append($('<a class="page-link" href="#" aria-label="Previous">')
                    .append($('<span aria-hidden="true">').append('&laquo;'))
                    .append($('<span class="sr-only">').append('Previous'))))

    for (var i = 1; i <= rc; i++) {

        var li = $('<li>')
                .addClass('page-item num page-item-core')
                .attr('page-no', i)
                .append($('<a  href="#" class="page-link">').append(i));

        if (i === parseInt(bug_filter.page_no)) {
            li.addClass("active");
        }

        el.append(li)


    }

    el.append($('<li class="page-item order-last page-item-core-next">')
            .append($('<a class="page-link" href="#" aria-label="Next">')
                    .append($('<span aria-hidden="true">').append('&raquo;'))
                    .append($('<span class="sr-only">').append('Next'))))

}


function getBugListDetailsHeader() {
    var th = $('<tr>')

            .append($('<th>').append('<i class="cs-svg-icon numbers"></i>'))
            .append($('<th>').append('<input type="checkbox" class="all-bug-list-check">'))
            .append($('<th>').addClass('bug-list-column')
            .addClass('bug-list-column-task-id').append('<i class="cs-svg-icon id"></i>'))
            .append($('<th>').addClass('bug-list-column-0')
            .addClass('bug-list-column-task-deadline').append('<i class="cs-svg-icon deadline"></i>'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-task-status')
                    .css("width", '90px')
                    .append('<i class="cs-svg-icon status"></i>'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-task-name').css("min-width", '160px').append('Description'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-task-nature').attr("style", "width:140px;").append('Task Nature'))
            // .append($('<th>').addClass('bug-list-column')
            //         .addClass('bug-list-column-tasktype').append('Task Type'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-priority').append('Priority'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-story-card').append($('<span>').text('Story Card')).append("<button onclick='addUserStoryNewModalWithProject()' class='btn btn-sm'><i class='fas fa-plus'></i></button>"))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-project').append('Project'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-assignee').css("width", '70px').append('<i class="cs-svg-icon task-user-1"></i>'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-created-by').css("width", '70px').append('<i class="cs-svg-icon task-user-2"></i>'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-created-date').css("width", '80px').append('<i class="cs-svg-icon calendar-01-dark"></i>'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-close-date').append('Closed On'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-closed-by').append('Closed By'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-last-update').append('Last Update'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-estimated-hours').append('Estimated Hour(s)'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-spent-hours').append('Spent Hour(s)'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-estimated-counter').append('Estimated Counter'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-executed-counter').append('Executed Counter'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-estimated-budget').append('Estimated Budget'))
            .append($('<th>').addClass('bug-list-column')
                    .addClass('bug-list-column-spent-budget').append('Spent Budget'))
            .append($('<th>').append(''))




    return th;
}

var TableIDvalue = "bugListTable";
var TableLastSortedColumn = -1;



function CompareRowOfText(a, b) {
    var aval = a.value;
    var bval = b.value;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
}


function getBugListTaskNatureValue(taskNature) {
    var res = '';
    if (taskNature === 'new') {
        res = $('<div>').addClass("get-data-group")
                .append("<span class='im-new'></span> <span class='text'>New Request</span>");
    } else if (taskNature === 'bug') {
        res = $('<span>').addClass("get-data-group")
                .append("<span class='im-bug'></span> <span class='text'>Bug</span>");
    } else if (taskNature === 'change') {
        res = $('<span>').addClass("get-data-group")
                .append("<span class='im-change'></span> <span class='text'>Change Request</span>");
    }
    return res;
}

function increaseValue(mainVal, addedVal) {
    var res = mainVal;
    if (!addedVal || addedVal === undefined)
        return res;
    try {
        res = (parseFloat(mainVal) + parseFloat(addedVal));
    } catch (err) {
        res = mainVal;
    }
    res = Math.round(res, 2);
    return res;
}

function getBugListDetails(res) {
    //    tbody to append
    var table = $('#bugListTable');
    var tbody = $('#bugListTable > tbody');
    tbody.html('');
    table.append(getBugListDetailsHeader());
    // // thead to appaend----main header
    var sumEstHours = 0,
            sumSpentHours = 0,
            sumEstCount = 0,
            sumExecCount = 0,
            sumEstBudget = 0,
            sumSpentBudget = 0;



    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];

        /*         var isLabelChecked = (bug_filter.label_id.length > 1);
         var divLabelFilter = $('<div>')
         .append($("<input type='checkbox'>")
         .addClass("assign-label-to-task-item")
         .attr("pid", o.id)
         .attr('projectId', o.fkProjectId)
         .attr('backlogId', o.fkBacklogId)
         .attr("checked", isLabelChecked)
         .attr("sid", global_var.bug_task_label_assign_id))
         .append($('<span>').append(" (" + global_var.bug_task_label_assign_name + ") ")); */

        /* var rsLabelFilter = global_var.bug_task_label_assign_checked === 1 *//*  ?
         divLabelFilter.html() :
         ""; */
        /* 
         var ischecked = (bug_filter.sprint_id.length > 1); */
        /*         var div = $('<div>')
         .append($("<input type='checkbox'>")
         .addClass("assign-sprint-to-task-item")
         .attr("pid", o.id)
         .attr('projectId', o.fkProjectId)
         .attr('backlogId', o.fkBacklogId)
         .attr("checked", ischecked)
         .attr("sid", global_var.bug_task_sprint_assign_id))
         .append($('<span>').append(" (" + global_var.bug_task_sprint_assign_name + ") ")); */



        var rs = global_var.bug_task_sprint_assign_checked === 1 /* ?
         div.html() :
         ""; */

        sumEstHours = increaseValue(sumEstHours, o.estimatedHours);
        sumSpentHours = increaseValue(sumSpentHours, o.spentHours);
        sumEstCount = increaseValue(sumEstCount, o.estimatedCounter);
        sumExecCount = increaseValue(sumExecCount, o.executedCounter);
        sumEstBudget = increaseValue(sumEstBudget, o.estimatedBudget);
        sumSpentBudget = increaseValue(sumSpentBudget, o.spentBudget);

        var row = (i + 1 + (parseInt(bug_filter.page_no) - 1) * (parseInt(bug_filter.limit)));
        row += " " /* + rs + rsLabelFilter; */

        var userImage = o.userImage;
        var img = (userImage) ?
                fileUrl(userImage) :
                fileUrl(new User().getDefaultUserprofileName());

        var createByImage = o.createByImage;
        var createdByImg = (createByImage) ?
                fileUrl(createByImage) :
                " ";

        var backlogName = '<a href1="#" onclick="callStoryCard4BugTask(\'' + o.fkProjectId + '\',\'' + o.fkBacklogId + '\',this)">' + replaceTags(o.backlogName) + '</a>';
        var taskName = '<a class="task-list-name issue_' + o.id + '" href1="#" onclick="callTaskCard4BugTask(this,\'' + o.fkProjectId + '\',\'' + o.id + '\')" >' + replaceTags(fnline2Text(o.taskName)) + '</a>';
        var task_id = getTaskCode(o.id);

        var dropMenuDiv = $("<div>")
                .addClass("dropdown-menu")
                .attr("aria-labelledby", "bug-status-dropdown")

                .append('<a class="dropdown-item" data-value ="new">New</a>')
                .append('<a class="dropdown-item" data-value ="ongoing">Ongoing</a>')
//                        .append('<a class="dropdown-item" data-value ="closed">closed</a>')
                .append('<a class="dropdown-item" data-value ="waiting">Waiting</a>')
                .append('<a class="dropdown-item" data-value ="Canceled">Canceled</a>')
//                        .append('<a class="dropdown-item" data-value ="UAT">UAT</a>')

        var t = $('<tr>')
                .attr("id", o.id)
                .attr("projectId", o.fkProjectId)
                .attr("stIdr", o.fkBacklogId)
                .addClass('bug-tr')
                .append($('<td>').attr("style", "width:25px;")
                    .append(row)
                )
                .append($('<td>').attr("style", "width:30px;")
                .addClass('bug-list-checkbox')
                    .append('<input class="checkbox-issue-task" type="checkbox">')
                )
                .append($('<td>').addClass('bug-list-column').attr("style", "width:100px;")
                        .addClass('bug-list-column-task-id').append(task_id))
                .append($('<td>').addClass('bug-list-column-0').attr("style", "width:30px; padding: 0;")
                        .addClass('bug-list-column-task-deadline')
                        .append($('<div>').addClass('td-deadline-box kecib')
                        .append($('<span>')
                        .text('-22s')))
                        )
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-task-status cs-input-group')
                        .css("text-align", 'left')
                        .css("padding-left", '3px')
                        .css("overflow", 'initial')
                        .append($("<div>")
                                .addClass("dropdown")
                                .append($("<div>")
                                        .addClass('dropdown-toggle cst-dropwdown-toggle-bug')
                                        .addClass('us-item-status-' + o.taskStatus)
                                        .attr("data-toggle", "dropdown")
                                        .attr("aria-haspopup", "true")
                                        .attr("aria-expanded", "false")
                                        .attr("id", "bug-status-dropdown")
                                        .append($('<span>')
                                                .append(o.taskStatus)))
                                .append(o.taskStatus !== 'UAT' ? dropMenuDiv : "")
                                ))
                .append($('<td>')
                        .addClass('bug-list-column')
                        .addClass('bug-list-column-task-name')
                        .css("max-width", '240px')
                        .append(taskName, ' ')
                        .append("<input type='text' class=' task-name-issue select-box-issue'>")
                        .append($("<div>")
                                .addClass("dropdown task-name-editdrop")
                                .append($("<button>")
                                        .addClass('btn btn-light')
                                        .attr("aria-haspopup", "true")
                                        .attr("aria-expanded", "false")
                                        .attr("data-toggle", "dropdown")
                                        .attr("id", "bug-taskName-dropdown")
                                        .append('<i class="fas fa-ellipsis-v"></i>'))

                                .append($("<div>")
                                        .addClass("dropdown-menu")
                                        .attr("aria-labelledby", "bug-taskName-dropdown")

                                        .append('<a class="dropdown-item forward-task" href="#" onclick="()">Create Child Task</a>')
                                        .append('<a class="dropdown-item forward-task" href="#" onclick="ForwardTaskTo()">Forward To</a>')
                                        .append('<a class="dropdown-item assign-task" href="#" onclick="assignTaskToOthers()">Assign To</a>')
                                        .append('<a class="dropdown-item clone-task" href="#" onclick="cloneTask()">Duplicate</a>')
                                        .append('<a class="dropdown-item" href="#" onclick="rejectTask()">Reject Task</a>')
                                        .append('<a class="dropdown-item" href="#" onclick="iDidIt()">I Did It!</a>')
                                        .append('<a class="dropdown-item" href="#" onclick="userAcceptance()">User Acceptance Testing</a>')
                                        .append('<a class="dropdown-item" href="#" onclick="deleteTask()">Delete</a>')

                                        ))
                        .append((o.fkParentTaskId) ? "<i class='fa fa-level-up '>" : "")
                        .attr('title', (o.fkParentTaskId) ? "Has Parent Task" : "")
                        )
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-task-nature')
                        .append($("<div>")
                                .addClass("dropdown")
                                .append($("<div>")
                                        .addClass('dropdown-toggle cst-dropwdown-toggle-bug')
                                        .attr("data-toggle", "dropdown")
                                        .attr("aria-haspopup", "true")
                                        .attr("aria-expanded", "false")
                                        .attr("id", "bug-taskNature-dropdown")
                                        .append(getBugListTaskNatureValue(o.taskNature)))

                                .append($("<div>")
                                        .addClass("dropdown-menu")
                                        .attr("aria-labelledby", "bug-taskNature-dropdown")

                                        .append('<a class="dropdown-item" data-value ="new">New Request</a>')
                                        .append('<a class="dropdown-item" data-value ="change">Change Request</a>')
                                        .append('<a class="dropdown-item" data-value ="bug">Bug</a>')

                                        )))
          
                // .append($('<td>').addClass('bug-list-column')
                //         .addClass('bug-list-column-tasktype')
                //         .append($("<div>")
                //                 .addClass("dropdown")
                //                 .append($("<div>")
                //                         .addClass('dropdown-toggle cst-dropwdown-toggle-bug get-data-group')

                //                         .attr("data-toggle", "dropdown")
                //                         .attr("aria-haspopup", "true")
                //                         .attr("aria-expanded", "false")
                //                         .attr("id", "bug-tasktype-dropdown")
                //                         .append((replaceTags(o.taskTypeName)) ? "<span >" + o.taskTypeName + "</span>" : "<span style ='visibility:hidden;'>djnfjsd</span>"))

                //                 .append($("<div>")
                //                         .addClass("dropdown-menu")
                //                         .attr("aria-labelledby", "bug-tasktype-dropdown")

                //                         /* .append('<a class="dropdown-item" data-value ="New">New</a>')
                //                          .append('<a class="dropdown-item" data-value ="ongoing">Ongoing</a>')
                //                          .append('<a class="dropdown-item" data-value ="closed">closed</a>')
                //                          .append('<a class="dropdown-item" data-value ="waiting">waiting</a>')
                //                          .append('<a class="dropdown-item" data-value ="Canceled">Canceled</a>')
                //                          .append('<a class="dropdown-item" data-value ="UAT">UAT</a>') */

                //                         )))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-priority get-data-group').append(replaceTags(o.taskPriority)))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-story-card')
                        .append("<span class='get-data-group ellipsis-story-card'>" + backlogName + "</span>")
                        .append(' <select dataPid=' + o.fkProjectId + ' id="userStory-taskList-us" title="UserStory" data-actions-box="true" class=" select-box-issue" data-live-search="true"></select>')
                        .append($('<div>').addClass('set-filter-box')
                                .append($('<i class="fa fa-filter">')
                                        .attr('onclick', 'setFilter4IssueMgmtAsBacklog("' + o.fkProjectId + '","' + o.fkBacklogId + '")')
                                        .css("display", "none")
                                        .addClass("hpYuyept"))
                                .append($('<i class="fas fa-chevron-down">')
                                        .attr('onclick', 'setChnageUserStoryCard("' + o.fkProjectId + '",this)')
                                        .css("display", "none")
                                        .addClass("hpYuyept1"))
                                )
                            .mouseover(function () {
                                $(this).find(".hpYuyept").show();
                                $(this).find(".hpYuyept1").show();
                            })
                            .mouseleave(function () {
                                $(this).find(".hpYuyept").hide();
                                $(this).find(".hpYuyept1").hide();
                            })
                        )
                .append($('<td>').addClass('bug-list-column')
                .attr("style", "width:140px;")
                        .addClass('bug-list-column-project')
                        .append("<span class='get-data-group'>" + replaceTags(o.projectName) + "</span>")
                        .append($('<i class="fa fa-filter">')
                                .attr('onclick', 'setFilter4IssueMgmtAsProject("' + o.fkProjectId + '")')
                                .css("display", "none")
                                .addClass("hpYuyept"))
                        .mouseover(function () {
                            $(this).find(".hpYuyept").show();
                        })
                        .mouseleave(function () {
                            $(this).find(".hpYuyept").hide();
                        }))
                .append($('<td>')
                        .css('white-space', 'nowrap').css("text-align", 'center')
                        .addClass('bug-list-column')
                        .addClass('bug-list-column-assignee')
                        .append(genUserTrblock(o.userName,img))
                            .append($('<i class="fa fa-filter">')
                            .attr('onclick', 'setFilter4IssueMgmtAsAssigne("' + o.fkAssigneeId + '")')
                            .css("display", "none")
                            .addClass("hpYuyept"))
                    .mouseover(function () {
                        $(this).find(".hpYuyept").show();
                    })
                    .mouseleave(function () {
                        $(this).find(".hpYuyept").hide();
                    }))
                .append($('<td>').addClass('bug-list-column')
                        .css('white-space', 'nowrap').css("text-align", 'center')
                        .addClass('bug-list-column-created-by ')
                            .append(genUserTrblock(o.createByName,createdByImg))
                            .append($('<i class="fa fa-filter">')
                            .attr('onclick', 'setFilter4IssueMgmtAsProject("' + o.fkProjectId + '")')
                            .css("display", "none")
                            .addClass("hpYuyept"))
                            .mouseover(function () {
                                $(this).find(".hpYuyept").show();
                            })
                            .mouseleave(function () {
                                $(this).find(".hpYuyept").hide();
                            })
                        )
                .append($('<td>').addClass('bug-list-column')
                        .css('white-space', 'nowrap').css("text-align", 'center')
                        .addClass('bug-list-column-created-date').append("<span class='get-data-group'>" + Utility.convertDate(o.createdDate) + "</span>"))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-close-date')
                        .append((o.closeStatusDate) ?
                                "<span class='get-data-group'>" + Utility.convertDate(o.closeStatusDate) + " : " + Utility.convertTime(o.closeStatusTime) + "</span>"
                                : ""))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-closed-by')
                        .append("<span class='get-data-group'>" + o.closedByName + "</span>"))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-last-update').append("<span class='get-data-group'>" + (o.lastUpdatedDate) ? Utility.convertDate(o.lastUpdatedDate) : "" + "</span>"))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-estimated-hours').append((o.estimatedHours !== '0') ? o.estimatedHours : ""))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-spent-hours').append((o.spentHours !== '0') ? o.spentHours : ""))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-estimated-counter').append((o.estimatedCounter !== '0') ? o.estimatedCounter : ""))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-executed-counter').append((o.executedCounter !== '0') ? o.executedCounter : ""))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-estimated-budget').append((o.estimatedBudget !== '0') ? o.estimatedBudget : ""))
                .append($('<td>').addClass('bug-list-column')
                        .addClass('bug-list-column-spent-budget').append((o.spentBudget !== '0') ? o.spentBudget : ""))
            
        tbody.append(t);
        $('[data-toggle="popover"]').popover({
            html: true
        });
    }

    getBugListDetailsSumLine(tbody, sumEstHours, sumSpentHours, sumEstCount, sumExecCount,
            sumEstBudget, sumSpentBudget);

    global_var.bug_task_sprint_assign_checked = '';
    global_var.bug_task_sprint_assign_name = '';
    global_var.bug_task_sprint_assign_id = '';


    global_var.bug_task_label_assign_checked = '';
    global_var.bug_task_label_assign_name = '';
    global_var.bug_task_label_assign_id = '';

}
function genUserTrblock(names,img) {

    try {
        return $('<a>')
            .attr('tabindex', "0")
            .attr('data-placement', "left")
            //.attr('data-original-title', filed === "createdBy" ? "Daxil Edən" : "İcra Edən")
            .attr('data-toggle', 'popover')
            .attr('data-trigger', "focus")
            .attr('data-content', genHoverImageBlock(img, names))
                .append($('<img>')
                .addClass("rounded-circle personal-btn-img js-btn-popover--custom")
                .css("width", '22px')
                .css("height", '22px')
                .css("border", '1px solid #03396C')
                .attr("src", img)
            )

    } catch (error) {
        return ''
    }

  }
  function genHoverImageBlock (img,ad) {
    return `
    <div class="task-table-personal-info">
     <div class="d-table w-100"><div class="pi-head-title">Daxil Edən</div></div>
     <ul class="avatar">
         <li>
             <div class="d-flex">
               <div class="left-min-box avatar-image"><img width='36px' height="36px" src="${img}"></div>
               <div class="mr-auto avatar-name"><span>${ad}</span></div>
             </div>                
         </li>
     </ul>
     <ul class="main-info">
         <li>
             <div class="d-flex">
                 <div class="left-min-box info-title"><span>Şirkət</span></div>
                 <div class="mr-auto info-desc"><span>ELCOM GROUP</span></div>
             </div>
         </li>
         <li>
              <div class="d-flex">
                 <div class="left-min-box info-title"><span>Filial</span></div>
                 <div class="mr-auto info-desc"><span>Reklam</span></div>
             </div>
         </li>
         <li>
         <div class="d-flex">
                 <div class="left-min-box info-title"><span>Dep.</span></div>
                 <div class="mr-auto info-desc"><span>Planlama</span></div>
             </div>
         </li>
         <li>
             <div class="d-flex">
                 <div class="left-min-box info-title"><span>Şöbə</span></div>
                 <div class="mr-auto info-desc"><span>Dizayn</span></div>
             </div>
         </li>
         <li>
          <div class="d-flex">
                 <div class="left-min-box info-title"><span>Sektor</span></div>
                 <div class="mr-auto info-desc"><span>Qrafik</span></div>
             </div>
         </li>
         <li>
             <div class="d-flex">
                 <div class="left-min-box info-title"><span>Vəzifə</span></div>
                 <div class="mr-auto info-desc"><span>Qrafik Dizayner</span></div>
             </div>
         </li>
         <li>
             <div class="d-flex">
                 <div class="left-min-box info-title"><span>Email</span></div>
                 <div class="mr-auto info-desc"><span>info@elcom.az</span></div>
             </div>
         </li>
         <li>
             <div class="d-flex">
                 <div class="left-min-box info-title"><span>Mobil</span></div>
                 <div class="mr-auto info-desc"><span>+994 10 101 01 01</span></div>
             </div>
         </li>
     </ul>
    </div>
    `
 };
function callTaskCard4BugTask(el, projectId, taskId) {



    if (!taskId) {
        //        hideProgressAlternative();
        return;
    }


    global_var.current_issue_id = taskId;
    Utility.addParamToUrl('current_issue_id', global_var.current_issue_id);
    global_var.current_issue_is_hide = "0";
    Utility.addParamToUrl('current_issue_is_hide', global_var.current_issue_is_hide);


    //Task card-da Story Card-linke basanda istifade edilir.
    if (projectId !== global_var.current_project_id) {
        global_var.current_project_id = projectId;
        new UserStory().refreshBacklog4Bug(true);
    }

    getProjectUsers();
    //    getUsers();

    $(".card-UserStory-header-text-code").text("");
    $(".card-UserStory-header-text-code").append(getTaskCode(taskId));



    let headerText = $(el).html();
    $(".card-UserStory-header-text").text("");
    $(".card-UserStory-header-text").append(headerText);
    $("#taskMgmtModal").modal("show");
    $('.comment-body').html("")
    $('.card-UserStory-edit-task').show();


    loadUsersAsAssignee();
    loadTaskInfoToContainer(taskId, projectId);
    loadTaskCardDetails(taskId);




    //add project list to task
    $('.task-card-project-div-id').remove();
    $('.task-mgmt-tasktype').each(function () {
        $(this).after($('<div class="col-lg-4 task-card-project-div-id statusCardStory" id="task-card-project-div-id">')
                .append($('<div>').addClass('cs-input-group')
                        .append($('<label>').addClass('input-group-addon').append('Project'))
                        .append(getProjectList4TaskInfo(projectId))
                        )
                );
        $('#task-card-project-id').selectpicker('refresh');
    });


    //set backlog infos
    if (coreBugKV[taskId].backlogName) {
        $('#taskMgmtModal').find('#task-mgmt-modal-user-story')
                .attr('pid', coreBugKV[taskId].fkBacklogId)
                .html(coreBugKV[taskId].backlogName);
    }

    getTaskCheckList(taskId);
    getTaskkObserverList(taskId);

    //    showAssigneeTaskCardIn(taskId, 'updateBugList-taskinfo');

    //    hideProgressAlternative();


    infoEventsTaskData(taskId);
    // $('.task-events-updated').attr("data-taskid",taskId);
    // $('.task-events-updated [data-taskid]').change();  
}


function getProjectIdOfBacklog(backlogId) {
    if (!backlogId) {
        return;
    }
    var rs = "";
    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBacklogId = backlogId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetProjectIdOfBacklog",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            rs = res.kv.fkProjectId;
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    return rs;
}


function getBacklogDetailsById(backlogId) {
    if (!backlogId) {
        return;
    }
    var rs = "";
    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBacklogId = backlogId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBacklogDetailsById",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            rs = res.kv;
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    return rs;
}


function callStoryCard4BugTask(projectIdOld, backlogId, el, containDiv) {

    //    showProgressAlternative();

    //    var divId = (containDiv)? containDiv :"body_of_nature";

    var divId = '#storyCardViewManualModal-body';
    $('#storyCardViewManualModal').modal('show');

    $.get("resource/child/storycard.html", function (html_string) {
        if (!backlogId || backlogId === '-1') {
            return;
        }

        global_var.current_backlog_id = backlogId;

        $(divId).html(html_string); // this is not Working
        var storyCard = html_string;
        $(divId).html(storyCard);


        var backlogName = $(el).html();
        $('#generalview-us-header-name').text(backlogName);


        var projectId = getProjectIdOfBacklog(backlogId);
        if (projectId !== global_var.current_project_id || SACore.GetBacklogKeyList().length === 0) {
            global_var.current_project_id = projectId;
            new UserStory().refreshBacklog4Bug();
        }

        new UserStory().toggleSubmenuStoryCard();
        loadUsersAsOwner();
        setStoryCardOwner();
        setStoryCardCreatedBy();

        //        hideProgressAlternative();

    });
}

function getBugListDetailsSumLine(tbody, sumEstHours, sumSpentHours, sumEstCount, sumExecCount,
        sumEstBudget, sumSpentBudget) {


    var t = $('<tr>')
            .append($('<td>').append(''))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-task-status'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-task-name'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-task-nature'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-assignee'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-tasktype'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-story-card'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-project'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-created-by'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-created-date'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-last-update'))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-estimated-hours')
                    .append($('<h6>').append(sumEstHours)))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-spent-hours')
                    .append($('<h6>')
                            .append(sumSpentHours)))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-estimated-counter')
                    .append($('<h6>').append(sumEstCount)))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-executed-counter')
                    .append($('<h6>').append(sumExecCount)))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-estimated-budget')
                    .append($('<h6>').append(sumEstBudget)))
            .append($('<td>').addClass('bug-list-column')
                    .addClass('bug-list-column-spent-budget')
                    .append($('<h6>').append(sumSpentBudget)))
            .append($('<td>').append($('<h6>').append('')))

    tbody.append(t);
}


$(document).on("click", '.all-bug-list-check', function (e) {

    var chck = $(".checkbox-issue-task");
    if ($(this).is(':checked')) {
        $('#multi-edit-menu-btn').css('display', 'initial');
        chck.prop('checked', true);
    } else {

        $('#multi-edit-menu-btn').css('display', 'none');
        chck.prop('checked', false);
    }

})
$(document).on("click", '.checkbox-issue-task', function (e) {


    var check = $("#bugListTable .bug-tr .checkbox-issue-task");

    var ast = [];
    var pids = [];
    for (var indx = 0; indx < check.length; indx++) {


        if ($(check[indx]).prop('checked')) {

            ast.push($(check[indx]).prop('checked'));
            pids.push($(check[indx]).attr('onclick_trigger_id'));

        }

    }



    if (ast.length === check.length) {
        $(".all-bug-list-check").prop('checked', true);
    } else {

        $(".all-bug-list-check").prop('checked', false);

    }
    if (ast.length > 1) {
        $('#multi-edit-menu-btn').css('display', 'initial');
    } else {

        $('#multi-edit-menu-btn').css('display', 'none');

    }



})
$(document).on("change", '#bug_filter_project_id', function (e) {
    var id = getProjectListIn();
    loadStoryCardByProject(id);
    loadAssigneesByProject(id);
    //    $('#bug_filter_backlog_id').selectpicker();
    //    $('#bug_filter_assignee_id').selectpicker();

})
$(document).on("change", '#bug_filter_project_id_add_pop', function (e) {
    var id = $(this).val();
    $('#bug_filter_project_id').val(id);
    $('#bug_filter_project_id').change();
    loadStoryCardByProjectAdd(id)


})
$(document).on("change", '#bug_filter_project_id_add', function (e) {
    var id = $(this).val();
    $('#bug_filter_project_id').val(id);
    $('#bug_filter_project_id').change();
    loadStoryCardByProjectAdd(id);


})


$(document).on("change", '#bug_filter_project_id_multi', function (e) {
    var id = $(this).val();//getProjectListIn();
    loadStoryCardByProjectAdd4Multi(id);
    //loadAssigneesByProject(id);
    //    $('#bug_filter_backlog_id').selectpicker();
    //    $('#bug_filter_assignee_id').selectpicker();

})



function loadStoryCardByProjectAdd4Multi(projectId) {
    if (!projectId) {
        return;
    }

    var json = initJSON();
    json.kv.fkProjectId = projectId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmLoadStoryCardByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadStoryCardByProjectDetails4Multi(res);
            $('#bug_filter_backlog_id_multi').selectpicker('refresh');
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function loadStoryCardByProjectDetails4Multi(res) {
    try {
        var el = $('#bug_filter_backlog_id_multi');
        el.html('');
        var obj = res.tbl[0].r;
        for (var i in obj) {
            var o = obj[i];
            el.append($('<option>')
                    .val(o.id)
                    .text(o.backlogName));
        }
    } catch (err) {

    }
    $('#bug_filter_backlog_id_multi').selectpicker('refresh');
}


$(document).on("click", '#collapse-group', function (e) {
    var $this = $(".bugChangegroupArrow");
    console.log($this);

    for (let index = 0; index < $this.length; index++) {
        var dt = $this[index].attr("data-closed");
        var dt = $($this[index]).attr("data-closed");

        if (dt == 1) {
            $($this[index]).click();

        }



    }



})
$(document).on("click", '#expand-group', function (e) {
    var $this = $(".bugChangegroupArrow")

    for (let index = 0; index < $this.length; index++) {
        var dt = $($this[index]).attr("data-closed");

        if (dt == 0) {
            $($this[index]).click();

        }


    }
})

function reset_task_data() {
    $('.task-events-created').attr("data-taskid", '');
    $('.task-events-created input').val('');
    $('.task-events-created input').change('');
    $('input#taskNameInputNew2').val('');
    $('#addComment4Task_comment_new').val('');
}

$(document).on("click", '#addIssueButtonId', function (e) {
    // $('#issue-managment-add-task .after-add-task').show();
    $('#issue-managment-add-task .after-add-task').css("pointer-events", "auto");
    $('#issue-managment-add-task .after-add-task').css("opacity", "1");
    $('#issue-managment-add-task .task-step-1').hide();
    $('#issue-managment-add-task .task-step-2').show();
    addNewTask4BugMultiZad( );

})

$(document).on("focus", 'input#taskNameInputNew2', function (e) {
    // $('#issue-managment-add-task .after-add-task').hide();
    // $('#issue-managment-add-task .task-step-1').show();
    // $('#issue-managment-add-task .task-step-2').hide();
})
$(document).on("focus", '.add-new-task', function (e) {
    // $('#issue-managment-add-task .after-add-task').show();
    $('#issue-managment-add-task .after-add-task').css("pointer-events", "auto");
    $('#issue-managment-add-task .after-add-task').css("opacity", "1");
    $('#issue-managment-add-task .task-step-1').show();
    $('#issue-managment-add-task .task-step-2').hide();
    reset_task_data();
})

function insertNewTask() {
    var lines = [];
    $.each($('#taskNameInputNew2').val().split(/\n/), function (i, line) {
        if (line) {
            lines.push(line);
        }
    });
    if (lines.length === 0) {
        return
    }
    for (let index = 0; index < lines.length; index++) {
        addNewTask4BugMulti(lines[index])

    }
    if (run_task_valid()) {
        msgMessage = 'Gool!!!!';
        Toaster.showMessage(msgMessage);
    } else {
        msgError = 'Fill in the required fields';
        Toaster.showError(msgError);
    }
    $("#issue-managment-add-task").modal('hide');
}


$(document).on("click", '#bug-listassigne-dropdown', function (e) {

    var id = $(this).parents('tr').attr("projectid")
    var el = $(this).parents(".dropdown").find(".dropdown-menu ");
    el.empty()
    loadAssigneesByProjectDrop(id, el);
})
$(document).on("click", '.bug-list-column-task-status a', function (e) {

    var val = $(this).attr("data-value");
    var id = $(this).parents('tr').attr("id");
    updateTask4ShortChangePure(val, "taskStatus", id);
})
$(document).on("click", '.bug-list-column-assignee a', function (e) {

    var val = $(this).attr("assigne-id");
    var id = $(this).parents('tr').attr("id");
    updateTask4ShortChangePure(val, "fkAssigneeId", id);
})
$(document).on("click", '.bug-list-column-task-nature a', function (e) {

    var val = $(this).attr("data-value");
    var id = $(this).parents('tr').attr("id");
    updateTask4ShortChangePure(val, "taskNature", id);
})
$(document).on("click", '#bug-tasktype-dropdown', function (e) {


    var elm = $(this).parent().find('.dropdown-menu');
    addUserStoryToTask_loadTaskType_bug_list(elm);
})
$(document).on("click", '.bug-list-column-tasktype a', function (e) {

    var val = $(this).attr("data-value");
    var id = $(this).parents('tr').attr("id");
    updateTask4ShortChangePure(val, "fkTaskTypeId", id);
})

function addUserStoryToTask_loadTaskType_bug_list(elm) {
    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.asc = 'typeName';
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskTypeList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {

            var dt = res.tbl[0].r;
            for (let index = 0; index < dt.length; index++) {

                var nm = dt[index].typeName;
                var ids = dt[index].id;
                var opt = $('<a>').addClass("dropdown-item").attr("data-value", ids).text(nm);
                $(elm).append(opt);
            }
        }
    });
}

function add_loadTaskType_bug_list(elm) {
    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.asc = 'typeName';
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskTypeList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {

            var dt = res.tbl[0].r;
            for (let index = 0; index < dt.length; index++) {

                var nm = dt[index].typeName;
                var ids = dt[index].id;
                var opt = $('<option>').val(ids).text(nm);
                $(elm).append(opt);
                $(elm).selectpicker('refresh')
            }
        }
    });
}

function toggleColumns() {
    $('.bug-list-column').hide();
    var colList = $('#bug_filter_columns').val();
    for (var col in colList) {
        $('.bug-list-column-' + colList[col]).show();
    }
}

function getProjectListIn() {
    var id = $('#bug_filter_project_id').val();
    var st = id;
    //    for (var i in id) {
    //        st += id[i] + "%IN%"
    //    }
    return st;
}

function loadAssigneesByProjectDrop(projectId, el) {


    var json = initJSON();
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
            var obj = res.tbl[0].r;
            for (var i in obj) {
                var o = obj[i];
                var opt = $('<a>').addClass("dropdown-item").attr("assigne-id", o.fkUserId).text(o.userName);
                $(el).append(opt);
            }
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function loadAssigneesByProject(projectId) {


    var json = initJSON();
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
            loadAssigneesByProjectDetails(res);
            $('#bug_filter_created_by').selectpicker('refresh');
            $('#bug_filter_assignee_id').selectpicker('refresh');
            $('#bug_filter_assignee_id_add').selectpicker('refresh');
            $('#bug_filter_assignee_id_multi').selectpicker('refresh');
            $('#testcase_createdbyfilter').selectpicker('refresh');
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function loadAssigneesByProjectDetails(res) {
    $('#bug_filter_assignee_id').html('');
    $('#bug_filter_assignee_id_add').html('');
    $('#bug_filter_assignee_id_multi').html('');
    $('#bug_filter_created_by').html('');
    $('#testcase_createdbyfilter').html('');
    var obj = res.tbl[0].r;
    for (var i in obj) {
        var o = obj[i];
        var opt = $('<option>').val(o.fkUserId).text(o.userName);
        var opt2 = $('<option>').val(o.fkUserId).text(o.userName);
        var opt3 = $('<option>').val(o.fkUserId).text(o.userName);
        var opt4 = $('<option>').val(o.fkUserId).text(o.userName);
        var opt5 = $('<option>').val(o.fkUserId).text(o.userName);
        $('#bug_filter_assignee_id').append(opt);
        $('#bug_filter_assignee_id_add').append(opt4);
        $('#bug_filter_assignee_id_multi').append(opt5);
        $('#bug_filter_created_by').append(opt2);
        $('#testcase_createdbyfilter').append(opt3);
    }


}

function loadStoryCardByProjectSingle(fkProjectId, elm) {
    var pid = (fkProjectId) ? fkProjectId : global_var.current_project_id;
    var json = initJSON();
    json.kv.fkProjectId = pid;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBacklogList4Combo",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {


            var cmd = elm;
            cmd.html('');
            //            new UserStory().setUSLists(res);
            var f = true;
            cmd.append($('<option></option>'));
            var obj = res.tbl[0].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                var pname = o.backlogName;
                var op = $('<option></option>')
                        .attr('value', o.id)
                        .text(pname);
                /* if (f) {
                 op.attr("selected", true);
                 f = false;
                 }
                 if (o.id === global_var.current_backlog_id) {
                 op.attr("selected", true);
                 } */
                cmd.append(op);
            }

            //            cmd.val(global_var.current_backlog_id);
            sortSelectBoxByElement(cmd);
            cmd.selectpicker('refresh');
            cmd.focus();
        }
    });
}
function loadStoryCardByProject(projectId) {
    if (!projectId) {
        return;
    }

    var json = initJSON();
    json.kv.fkProjectId = projectId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmLoadStoryCardByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadStoryCardByProjectDetails(res);
            $('#bug_filter_backlog_id').selectpicker('refresh');
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function loadStoryCardByProjectAdd(projectId) {
    if (!projectId) {
        return;
    }

    var json = initJSON();
    json.kv.fkProjectId = projectId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmLoadStoryCardByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadStoryCardByProjectDetailsAdd(res);
            $('#bug_filter_backlog_id_add').selectpicker('refresh');
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function loadStoryCardByProjectDetails(res) {
    try {
        var el = $('#bug_filter_backlog_id');
        el.html('');
        var obj = res.tbl[0].r;
        for (var i in obj) {
            var o = obj[i];
            el.append($('<option>')
                    .val(o.id)
                    .text(o.backlogName));
        }
    } catch (err) {

    }
    $('#bug_filter_backlog_id_add').selectpicker('refresh');
}

function loadStoryCardByProjectDetailsAdd(res) {
    try {
        var el = $('#bug_filter_backlog_id_add');
        el.html('');
        var obj = res.tbl[0].r;
        for (var i in obj) {
            var o = obj[i];
            el.append($('<option>')
                    .val(o.id)
                    .text(o.backlogName));
        }
    } catch (err) {

    }
    $('#bug_filter_backlog_id_add').selectpicker('refresh');
}




$(document).on('click', function (e) {
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 100) {
            $(".addBugModalListUpdate").addClass("sticky2");
        } else {
            $(".addBugModalListUpdate").removeClass("sticky2")
        }
    })
})
function loadBugTaskDeadlineScripts() {
    $("#task-info-modal-status").selectpicker('refresh');
    $("#task-info-modal-nature").selectpicker('refresh');
    $("#task-info-modal-tasktype").selectpicker('refresh');
    $("#bug_filter_sortby").selectpicker('refresh');
    $("#bug_filter_sortby_asc").selectpicker('refresh');
    $("#bug_filter_limit").selectpicker('refresh');
    $("#inputGroupSelect01").selectpicker('refresh');
    $('#run_task_project_name').selectpicker('refresh');
    setProjectListByID('run_task_project_name');
    $('#run_task_project_name').change();
    $('#run_task_name').selectpicker('refresh');
    $('#run_task_intensive_select').selectpicker('refresh');
    $('#run_task_repeat_select').selectpicker('refresh');
    $('#run_task_status_select').selectpicker('refresh');
    $('#run_task_weekday_select').selectpicker('refresh');
    $('#sdofm_day_of_Month_select').selectpicker('refresh');
    $('#swofm_fl_action_select').selectpicker('refresh');
    $('#swofm_weekday_select').selectpicker('refresh');
    $('#run_task_reminder_select').selectpicker('refresh');
    $("#runTaskStartDate").daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true
    });
    $("#runTaskEndDate").daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true
    });
    $('#runTaskTime').datetimepicker({
        format: 'HH:mm'
                // sideBySide: true
    });
    $('#runTaskExecutiveDate').daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true,
        drops: 'up'
    });
    $('.hr_spa').hide();

    $('.task-events-created .cs-input-group input[type="text"]').css("pointer-events", "none");
    $('.task-events-created .cs-input-group input[type="text"]').css("opacity", "0.7");
    $('.task-events-created .cs-input-group input[type="text"]').attr("disabled", true);
    // $('#issue-managment-add-task .after-add-task').hide();
    $('#issue-managment-add-task .after-add-task').css("pointer-events", "none");
    $('#issue-managment-add-task .after-add-task').css("opacity", "0.7");
    $('#issue-managment-add-task .task-step-2').hide();

    // TASK DETAILS ON
    $('#run_task_project_name_detail').selectpicker('refresh');
    setProjectListByID('run_task_project_name_detail');
    $('#run_task_project_name_detail').change();

    $('#run_task_name_detail').selectpicker('refresh');
    $('#run_task_intensive_select_detail').selectpicker('refresh');
    $('#run_task_repeat_select_detail').selectpicker('refresh');
    $('#run_task_status_select_detail').selectpicker('refresh');
    $('#run_task_weekday_select_detail').selectpicker('refresh');
    $('#sdofm_day_of_Month_select_detail').selectpicker('refresh');
    $('#swofm_fl_action_select_detail').selectpicker('refresh');
    $('#swofm_weekday_select_detail').selectpicker('refresh');
    $('#run_task_reminder_select_detail').selectpicker('refresh');
    $('#updatetask_oblerverlist').selectpicker('refresh');
    $('#createdtask_oblerverlist').selectpicker('refresh');

    $("#runTaskStartDate_detail").daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true
    });
    $("#runTaskEndDate_detail").daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true
    });
    $('#runTaskTime_detail').datetimepicker({
        format: 'HH:mm'
                // sideBySide: true
    });
    $('#runTaskExecutiveDate_detail').daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true,
        drops: 'up'
    });
    $('.hr_spa').hide();

    $('.shedule-elements').addClass('el-disabled');
    $('.shedule-elements.el-disabled .soon').css("pointer-events", "none");
    $('.shedule-elements.el-disabled .soon').css("opacity", "0.7");
    $('.shedule-elements.el-disabled .soon input').attr("disabled", true);
    $('.shedule-elements.el-disabled .soon select').attr("disabled", true);

    $('.run-shedule-elements').addClass('el-disabled');
    $('.run-shedule-elements.el-disabled .rsoon').css("pointer-events", "none");
    $('.run-shedule-elements.el-disabled .rsoon').css("opacity", "0.7");
    $('.run-shedule-elements.el-disabled .rsoon input').attr("disabled", true);
    $('.run-shedule-elements.el-disabled .rsoon select').attr("disabled", true);

    $('.task-events-updated .cs-input-group input[type="text"]').css("pointer-events", "none");
    $('.task-events-updated .cs-input-group input[type="text"]').css("opacity", "0.7");
    $('.task-events-updated .cs-input-group input[type="text"]').attr("disabled", true);
    // TASK DETAILS OFF


}

$(document).on("change", "#runTaskExecutiveDate", function (e) {
    $('#hide_actions').val('');
    $('#hide_actions_param').val('');
    var runSEDate = $(this).val();
    $('#hide_actions_param').val(runSEDate);
});
$(document).on("change", '#sendnotification', function () {


    if ($(this).is(':checked')) {
        $(this).val('1');
    } else {
        $(this).val('0');
    }

})

$(document).on("change", '#sendnotification', function () {

    if ($(this).is(':checked')) {
        $(this).val('1');
    } else {
        $(this).val('0');
    }

})

$(document).on("change", "#runTaskExecutiveDate_detail", function (e) {
    $('#hide_actions_detail').val('');
    $('#hide_actions_param_detail').val('');
    var runSEDate = $(this).val();
    $('#hide_actions_param_detail').val(runSEDate);
});

$(document).on("change", '#sendnotification_detail', function () {

    if ($(this).is(':checked')) {
        $(this).val('1');
    } else {
        $(this).val('0');
    }

})

$(document).on("change", "#run_task_intensive_select", function (e) {
    $('#hide_actions').val();
    $('#hide_actions_param').val();
    var run_intensive = $('#run_task_intensive_select').val();
    run_action = run_intensive;
    switch (run_action) {
        case 'weekly':
            run_enabled = 'run-enabled';
            break;
        case 'monthly':
            run_enabled = 'run-enabled';
            break;
        case 'yearly':
            run_enabled = 'run-enabled';
            break;
    }
    if (run_enabled) {
        $('.run-intensive').removeClass('run-enabled');
        $('.' + run_intensive + '-actions').addClass(run_enabled);
    }
    if (run_intensive == 'yearly') {
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');
    }
    if (run_intensive == 'weekly') {
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');
        var run_sw_select = $('#run_task_weekday_select').val();
        $('#hide_actions_param').val(run_sw_select);
    }
    if (run_intensive == 'monthly') {
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');
        if ($('#first_day_of_month').is(':checked')) {
            $('#hide_actions').val('');
            $('#hide_actions_param').val('');
            $('#hide_actions').val('first_day_of_month');
        }
        if ($('#last_day_of_month').is(':checked')) {
            $('#hide_actions').val('');
            $('#hide_actions_param').val('');
            $('#hide_actions').val('last_day_of_month');
        }

        if ($('#specific_day_of_month').is(':checked')) {
            $('.run_spa').removeClass('spa_enable');
            $('.hr_spa').hide();
            $('.hr_spa').show();
            $('.spa_sdofm_day_of_Month_select').addClass('spa_enable');
            $('#hide_actions').val('specific_day_of_month');
            var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select').val();
            $('#hide_actions_param').val(sdofm_day_of_Month_select);
        }
        if ($('#before_last_day_of_month').is(':checked')) {
            $('#hide_actions').val('');
            $('#hide_actions_param').val('');
            $('#hide_actions').val('before_last_day_of_month');
            var days_before_last_day_of_month = $('#days_before_last_day_of_month').val();
            $('#hide_actions_param').val(days_before_last_day_of_month);
        }
        if ($('#specific_weekday_of_month').is(':checked')) {
            $('#hide_actions').val('');
            $('#hide_actions_param').val('');
            $('#hide_actions').val('specific_weekday_of_month');
            var swofm_a1 = $('#swofm_fl_action_select').val();
            var swofm_a2 = $('#swofm_weekday_select').val();
            $('#hide_actions_param').val(swofm_a1);
            $('#hide_actions_param_2').val(swofm_a2);
        }

    }

});
$(document).on("change", "#swofm_fl_action_select, #swofm_weekday_select", function (e) {
    $('#hide_actions_param').val('');
    var swofm_a1 = $('#swofm_fl_action_select').val();
    var swofm_a2 = $('#swofm_weekday_select').val();
    $('#hide_actions_param').val(swofm_a1);
    $('#hide_actions_param_2').val(swofm_a2);
});
$(document).on("change", "#run_task_weekday_select", function (e) {
    $('#hide_actions').val('');
    $('#hide_actions_param').val('');
    var run_task_weekday_select = $('#run_task_weekday_select').val();
    $('#hide_actions_param').val(run_task_weekday_select);
    if ($('#run_task_weekday_select').val() == 0) {
        $('[data-id="run_task_weekday_select"]').css('border', '1px solid red').css('background', 'red').css('box-shadow', '0px 0px 10px rgb(255 0 0 / 35%)');
        return false;
    } else {
        $('[data-id="run_task_weekday_select"]').removeAttr('style');
    }
});
$(document).on("change", "#sdofm_day_of_Month_select", function (e) {
    $('#hide_actions_param').val();
    var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select').val();
    $('#hide_actions_param').val(sdofm_day_of_Month_select);
});
$(document).on("change", ".checkcontainer input[type='radio']", function (e) {
    var val = $("#monthlyAction:checked").val();
    if (val === 'first_day_of_month') {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();
        $('#hide_actions').val('');
        $('#hide_actions').val('first_day_of_month');
        $('#hide_actions_param').val('');
    } else if (val === 'last_day_of_month') {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');
        $('#hide_actions').val('last_day_of_month');
    }
});
$(document).on("change", ".checkcontainer.spa input[type='radio']", function (e) {
    var val = $("#monthlyAction:checked").val();
    if (val === 'specific_day_of_month') {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();
        $('.hr_spa').show();
        $('.spa_sdofm_day_of_Month_select').addClass('spa_enable');
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');
        $('#hide_actions').val('specific_day_of_month');
        var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select').val();
        $('#hide_actions_param').val(sdofm_day_of_Month_select);
    } else if (val === 'before_last_day_of_month') {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();
        $('.hr_spa').show();
        $('.spa_days_before_last_day_of_month').addClass('spa_enable');
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');
        $('#hide_actions').val('before_last_day_of_month');
        var days_before_last_day_of_month = $('#days_before_last_day_of_month').val();
        $('#hide_actions_param').val(days_before_last_day_of_month);
    } else if (val === 'specific_weekday_of_month') {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();
        $('.hr_spa').show();
        $('.spa_swofm_fl_action_select').addClass('spa_enable');
        $('.spa_swofm_weekday_select').addClass('spa_enable');
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');
        $('#hide_actions').val('specific_weekday_of_month');
        var swofm_a1 = $('#swofm_fl_action_select').val();
        var swofm_a2 = $('#swofm_weekday_select').val();
        $('#hide_actions_param').val(swofm_a1);
        $('#hide_actions_param_2').val(swofm_a2);
    }
});
function run_task_valid() {
    if ($.trim($('input#taskNameInputNew2').val()).length == 0) {
        $('input#taskNameInputNew2').css('border', '1px solid red');
        return false;
    } else {
        $('#taskNameInputNew2').removeAttr('style');
    }

    if ($('#run_task_name').val() == '-1') {
        $('[data-id="run_task_name"]').css('border', '1px solid red').css('background', 'red').css('box-shadow', '0px 0px 10px rgb(255 0 0 / 35%)');
        return false;
    } else {
        $('[data-id="run_task_name"]').removeAttr('style');
    }

    if ($.trim($('input:required#runTaskEndDate').val()).length == 0) {
        $('input:required#runTaskEndDate').css('border', '1px solid red');
        return false;
    } else {
        $('#runTaskEndDate').removeAttr('style');
    }

    if ($.trim($('input:required#runTaskTime').val()).length == 0) {
        $('input:required#runTaskTime').css('border', '1px solid red');
        return false;
    } else {
        $('#runTaskTime').removeAttr('style');
    }

    var val_sw_select = $('#run_task_intensive_select').val();
    if (val_sw_select == 'weekly') {
        if ($('#run_task_weekday_select').val() == 0) {
            $('[data-id="run_task_weekday_select"]').css('border', '1px solid red').css('background', 'red').css('box-shadow', '0px 0px 10px rgb(255 0 0 / 35%)');
            return false;
        } else {
            $('[data-id="run_task_weekday_select"]').removeAttr('style');
        }
    }

    if ($('#run_task_intensive_select').val() == 'monthly') {
        if ($('#before_last_day_of_month').is(':checked')) {
            if ($.trim($('input:required#days_before_last_day_of_month').val()).length == 0) {
                $('input:required#days_before_last_day_of_month').css('border', '1px solid red');
                return false;
            } else {
                $('#days_before_last_day_of_month').removeAttr('style');
            }
        }
    }

    if ($('#run_task_intensive_select').val() == 'yearly') {

        if ($.trim($('input:required#runTaskExecutiveDate').val()).length == 0) {
            $('input:required#runTaskExecutiveDate').css('border', '1px solid red');
            return false;
        } else {
            $('#runTaskExecutiveDate').removeAttr('style');
        }
    }

    return true;
}

// TASK DETAILS ON
$(document).on("change", "#run_task_intensive_select_detail", function (e) {
    $('#hide_actions_detail').val();
    $('#hide_actions_param_detail').val();
    var run_intensive = $('#run_task_intensive_select_detail').val();
    run_action = run_intensive;
    switch (run_action) {
        case 'weekly':
            run_enabled = 'run-enabled';
            break;
        case 'monthly':
            run_enabled = 'run-enabled';
            break;
        case 'yearly':
            run_enabled = 'run-enabled';
            break;
    }
    if (run_enabled) {
        $('.run-intensive').removeClass('run-enabled');
        $('.' + run_intensive + '-actions').addClass(run_enabled);
    }
    if (run_intensive == 'yearly') {
        $('#hide_actions_detail').val('');
        $('#hide_actions_param_detail').val('');
    }
    if (run_intensive == 'weekly') {
        $('#hide_actions_detail').val('');
        $('#hide_actions_param_detail').val('');
        var run_sw_select = $('#run_task_weekday_select_detail').val();
        $('#hide_actions_param_detail').val(run_sw_select);
    }
    if (run_intensive == 'monthly') {
        $('#hide_actions_detail').val('');
        $('#hide_actions_param_detail').val('');

        if ($('#first_day_of_month_detail').is(':checked')) {
            $('#hide_actions_detail').val('');
            $('#hide_actions_param_detail').val('');
            $('#hide_actions').val('first_day_of_month_detail');
        }
        if ($('#last_day_of_month_detail').is(':checked')) {
            $('#hide_actions_detail').val('');
            $('#hide_actions_param_detail').val('');
            $('#hide_actions_detail').val('last_day_of_month');
        }

        if ($('#specific_day_of_month_detail').is(':checked')) {
            $('.run_spa').removeClass('spa_enable');
            $('.hr_spa').hide();
            $('.hr_spa').show();

            $('.spa_sdofm_day_of_Month_select').addClass('spa_enable');
            $('#hide_actions_detail').val('specific_day_of_month');
            var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select_detail').val();
            $('#hide_actions_param_detail').val(sdofm_day_of_Month_select);
        }
        if ($('#before_last_day_of_month_detail').is(':checked')) {
            $('#hide_actions_detail').val('');
            $('#hide_actions_param_detail').val('');

            $('#hide_actions_detail').val('before_last_day_of_month');
            var days_before_last_day_of_month = $('#days_before_last_day_of_month_detail').val();
            $('#hide_actions_param_detail').val(days_before_last_day_of_month);
        }
        if ($('#specific_weekday_of_month_detail').is(':checked')) {
            $('#hide_actions_detail').val('');
            $('#hide_actions_param_detail').val('');

            $('#hide_actions_detail').val('specific_weekday_of_month');
            var swofm_a1 = $('#swofm_fl_action_select_detail').val();
            var swofm_a2 = $('#swofm_weekday_select_detail').val();
            $('#hide_actions_param_detail').val(swofm_a1);
            $('#hide_actions_param_2_detail').val(swofm_a2);
        }

    }

});

$(document).on("change", "#swofm_fl_action_select_detail, #swofm_weekday_select_detail", function (e) {
    $('#hide_actions_param_detail').val('');
    var swofm_a1 = $('#swofm_fl_action_select_detail').val();
    var swofm_a2 = $('#swofm_weekday_select_detail').val();
    $('#hide_actions_param_detail').val(swofm_a1);
    $('#hide_actions_param_2_detail').val(swofm_a2);
});

$(document).on("change", "#run_task_weekday_select_detail", function (e) {
    $('#hide_actions_detail').val('');
    $('#hide_actions_param_detail').val('');
    var run_task_weekday_select = $('#run_task_weekday_select_detail').val();
    $('#hide_actions_param_detail').val(run_task_weekday_select);

    if ($('#run_task_weekday_select_detail').val() == 0) {
        $('[data-id="run_task_weekday_select_detail"]').css('border', '1px solid red').css('background', 'red').css('box-shadow', '0px 0px 10px rgb(255 0 0 / 35%)');
        return false;
    } else {
        $('[data-id="run_task_weekday_select_detail"]').removeAttr('style');
    }
});

$(document).on("change", "#sdofm_day_of_Month_select_detail", function (e) {
    $('#hide_actions_param_detail').val();
    var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select_detail').val();
    $('#hide_actions_param_detail').val(sdofm_day_of_Month_select);
});

$(document).on("change", ".checkcontainer input[type='radio']", function (e) {
    if ($('#first_day_of_month_detail').is(':checked')) {
        $('.shedule-elements').find('.run_spa').removeClass('spa_enable');
        $('.shedule-elements').find('.hr_spa').hide();

        $('#hide_actions_detail').val('');
        $('#hide_actions_detail').val('first_day_of_month');
        $('#hide_actions_param_detail').val('');
    }
    if ($('#last_day_of_month_detail').is(':checked')) {
        $('.shedule-elements').find('.run_spa').removeClass('spa_enable');
        $('.shedule-elements').find('.hr_spa').hide();

        $('#hide_actions').val('');
        $('#hide_actions_param').val('');

        $('#hide_actions').val('last_day_of_month');
    }
});

$(document).on("change", ".checkcontainer.spa input[type='radio']", function (e) {
    if ($('#specific_day_of_month_detail').is(':checked')) {
        $('.shedule-elements').find('.run_spa').removeClass('spa_enable');
        $('.shedule-elements').find('.hr_spa').hide();
        $('.shedule-elements').find('.hr_spa').show();
        $('.shedule-elements').find('.spa_sdofm_day_of_Month_select').addClass('spa_enable');

        $('#hide_actions_detail').val('');
        $('#hide_actions_param_detail').val('');

        $('#hide_actions_detail').val('specific_day_of_month');
        var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select_detail').val();
        $('#hide_actions_param_detail').val(sdofm_day_of_Month_select);
    }
    if ($('#before_last_day_of_month_detail').is(':checked')) {
        $('.shedule-elements').find('.run_spa').removeClass('spa_enable');
        $('.shedule-elements').find('.hr_spa').hide();
        $('.shedule-elements').find('.hr_spa').show();
        $('.shedule-elements').find('.spa_days_before_last_day_of_month').addClass('spa_enable');
        $('.shedule-elements').find('#hide_actions').val('');
        $('#hide_actions_param_detail').val('');

        $('#hide_actions_detail').val('before_last_day_of_month');
        var days_before_last_day_of_month = $('#days_before_last_day_of_month_detail').val();
        $('#hide_actions_param_detail').val(days_before_last_day_of_month);
    }
    if ($('#specific_weekday_of_month_detail').is(':checked')) {
        $('.shedule-elements').find('.run_spa').removeClass('spa_enable');
        $('.shedule-elements').find('.hr_spa').hide();
        $('.shedule-elements').find('.hr_spa').show();
        $('.shedule-elements').find('.spa_swofm_fl_action_select').addClass('spa_enable');
        $('.shedule-elements').find('.spa_swofm_weekday_select').addClass('spa_enable');
        $('#hide_actions_detail').val('');
        $('#hide_actions_param_detail').val('');
        $('#hide_actions_detail').val('specific_weekday_of_month');
        var swofm_a1 = $('#swofm_fl_action_select_detail').val();
        var swofm_a2 = $('#swofm_weekday_select_detail').val();
        $('#hide_actions_param_detail').val(swofm_a1);
        $('#hide_actions_param_2_detail').val(swofm_a2);
    }
});

$(document).on("change", "#runTaskStartDate_activateschedule", function (e) {

    if ($(this).is(':checked')) {
        $('.shedule-elements.el-disabled .soon').css("pointer-events", "auto");
        $('.shedule-elements.el-disabled .soon').css("opacity", "1");
        $('.shedule-elements.el-disabled .soon input').attr("disabled", false);
        $('.shedule-elements.el-disabled .soon select').attr("disabled", false);
        $('.shedule-elements').removeClass('el-disabled');
    } else {
        $('.shedule-elements').addClass('el-disabled');
        $('.shedule-elements.el-disabled .soon').css("pointer-events", "none");
        $('.shedule-elements.el-disabled .soon').css("opacity", "0.7");
        $('.shedule-elements.el-disabled .soon input').attr("disabled", true);
        $('.shedule-elements.el-disabled .soon select').attr("disabled", true);
    }
});
$(document).on("change", "#runTaskAvtivateSchedule", function (e) {

    if ($(this).is(':checked')) {
        $('.run-shedule-elements.el-disabled .rsoon').css("pointer-events", "auto");
        $('.run-shedule-elements.el-disabled .rsoon').css("opacity", "1");
        $('.run-shedule-elements.el-disabled .rsoon input').attr("disabled", false);
        $('.run-shedule-elements.el-disabled .rsoon select').attr("disabled", false);
        $('.run-shedule-elements').removeClass('el-disabled');
    } else {
        $('.run-shedule-elements').addClass('el-disabled');
        $('.run-shedule-elements.el-disabled .rsoon').css("pointer-events", "none");
        $('.run-shedule-elements.el-disabled .rsoon').css("opacity", "0.7");
        $('.run-shedule-elements.el-disabled .rsoon input').attr("disabled", true);
        $('.run-shedule-elements.el-disabled .rsoon select').attr("disabled", true);
    }
});

$(document).on('change', '#run_task_project_name_detail', function (event) {
    var elm = $("#run_task_name_detail").selectpicker('refresh');
    var val = $(this).val();
    getBacklogListByProject4Element(val, elm);
});
// TASK DETAILS OFF


$(document).on('change', '#run_task_project_name', function (event) {
    var elm = $("#run_task_name").selectpicker('refresh');
    var val = $(this).val();
    getBacklogListByProject4Element(val, elm);
});

function converDatePicker(val) {
    try {
        val = val.split('/')
        stTime = val[2].trim() + "-" + val[0].trim() + "-" + val[1].trim();
        return stTime
    } catch (error) {
        return
    }

}
function reconverDatePicker(val) {
    try {
        val = val.split('-')
        stTime = val[2].trim() + "/" + val[0].trim() + "/" + val[1].trim();
        return stTime
    } catch (error) {
        return
    }

}
$(document).on("click", ".sc-close-sidebar-btn", function (e) {
    $('.card-userstory-navmenu').removeClass('isOpen');
    $('.card-userstory-navmenu').addClass('isClose');
});
$(document).on("click", ".sc-open-sidebar-btn", function (e) {
    $('.card-userstory-navmenu').removeClass('isClose');
    $('.card-userstory-navmenu').addClass('isOpen');
});

$(document).on("click", ".task-skin-btn", function (e) {
    $(this).toggleClass('navIcon');
    $('.bugListNavMenu').toggleClass('task-menu-open');
});
$(document).on("mouseup", "html", function (e)
{
    var container = $(".bugListNavMenu");

    if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.removeClass("task-menu-open");
        $('.task-skin-btn').removeClass('navIcon');
    }
});


function getTaskCheckList(taskId) {
    if (!taskId && !global_var.current_task_id_4_comment) {
        return;
    }

    global_var.current_task_id_4_comment = (taskId)
            ? taskId
            : global_var.current_task_id_4_comment;
    var json = initJSON();
    json.kv.fkTaskId = global_var.current_task_id_4_comment;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskCheckList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getTaskCheckListDetails(res)
        },
        error: function () {
//                alert("error");
        }
    });
}

function  getTaskCheckListDetails(res) {
    var userList = {};
    try {
        var idx = getIndexOfTable(res, "userList");
        var objUser = res.tbl[idx].r;
        for (var k in objUser) {
            var o2 = objUser[k];
            userList[o2.id] = o2;
        }
    } catch (err) {
    }



    $('.task-check-list').html('')
    var table = $('<table>')
            .addClass('table table-hover project-table-list defaultTable sar-table');
    table.append($('<thead>').addClass('task-checklist-thead')
            .append($("<tr>")
                    .append($("<th>")
                            .css("width", "1%")
                            .text("#"))
                    .append($('<th>')
                            .css("width", "20px")
                            .text(""))
                    .append($('<th>')
                            .text(""))
                    .append($('<th>')
                            .css("width", "40px")
                            .text(""))
                    .append($('<th>')
                            .css("width", "40px")
                            .text(""))
                    .append($('<th>')
                            .css("width", "40px")
                            .text(""))
                    )
            )

    var idy = getIndexOfTable(res, "tmBacklogTaskCheckList");
    var obj = (res && res.tbl && res.tbl.length > 0) ? res.tbl[idy].r : [];
    for (var n = 0; n < obj.length; n++) {
        var o = obj[n];
        var createdBySpan = (o.createdBy && userList[o.createdBy])
                ? $('<span>')
                .attr('title', 'Created By')
                .append($('<img>')
                        .attr('width', '40px')
                        .addClass('Assigne-card-story-select-img created')
                        .attr('src', fileUrl(userList[o.createdBy].userImage))
                        .attr('data-placement', 'top')
                        .attr('data-trigger', 'hover')
                        .attr('data-toggle', 'popover')
                        .attr('data-content', userList[o.createdBy].userPersonName + ' / ' + Utility.convertDate(o.createdDate) + '  ' + Utility.convertTime(o.createdTime))
                        .attr('data-title', 'Created By')
                        )
                : '';

        var updatedBySpan = (o.updatedBy && userList[o.updatedBy])
                ? $('<span>')
                .attr('title', 'Updated By')
                .append($('<img>')
                        .attr('width', '40px')
                        .addClass('Assigne-card-story-select-img updated')
                        .attr('src', fileUrl(userList[o.updatedBy].userImage))
                        .attr('data-placement', 'top')
                        .attr('data-trigger', 'hover')
                        .attr('data-toggle', 'popover')
                        .attr('data-content', userList[o.updatedBy].userPersonName + ' | ' + Utility.convertDate(o.updatedDate) + '  ' + Utility.convertTime(o.updatedTime))
                        .attr('data-title', 'Updated By')
                        )
                : '';

        var tr = $("<tr>")
                .addClass((o.isChecked === '1') ? 'on-checked' : '')
                .append($('<td>').text((n + 1)))
                .append($('<td>').append($('<input>')
                        .addClass("taskCheckListItemToggle")
                        .attr("oid", o.id)
                        .attr('type', 'checkbox')
                        .attr("checked", (o.isChecked === '1') ? true : false)))
                .append($('<td>')
                        .addClass((o.isChecked === '1') ? 'text-checked' : '')
                        .append($('<textarea>')
                                .attr('rows', '1')
                                .addClass('form-control')
                                .attr("oid", o.id)
                                .addClass("updateTaskcheckListItemName")
                                .val(o.itemName)))
                .append($('<td>')
                        .append(createdBySpan))
                .append($('<td>')
                        .append(updatedBySpan))

                .append($('<td>')
                        .append($('<a href="#">')
                                .attr('oid', o.id)
                                .addClass("taskCheckListItemDelete")
                                .append('<i class="fas fa-trash-alt" aria-hidden="true"></i>')))
                ;
        table.append(tr);

    }
    $('.task-check-list').html(table);

    $('[data-toggle=popover]').popover({
        html: true,
        trigger: "hover"
    });
}

$(document).on("change", '.taskCheckListItemToggle', function () {

    if ($(this).is(':checked')) {
        $(this).closest('tr').addClass('on-checked');
        $(this).closest('tr').find('td:nth-child(3)').addClass('text-checked');
    } else {
        $(this).closest('tr').removeClass('on-checked');
        $(this).closest('tr').find('td:nth-child(3)').removeClass('text-checked');
    }

})

$(document).on("change", ".taskCheckListItemToggle", function (e) {
    var res = '0';
    if ($(this).is(":checked")) {
        res = '1';
    }

    callService('serviceTmupdateTaskCheckListItemCheck',
            {"isChecked": res,
                "id": $(this).attr('oid')}
    , true);

})


$(document).on("click", ".taskObserverDelete", function (e) {
    if (!confirm("Are you sure?")) {
        return;
    }
    var that = this;
    callService('serviceTmDeleteTaskObserver',
            {"id": $(this).attr('oid')}, true
            , function () {
                $(that).closest('tr').remove();
            });

})

$(document).on("click", ".taskCheckListItemDelete", function (e) {
    if (!confirm("Are you sure?")) {
        return;
    }
    var that = this;
    callService('serviceTmDeleteTaskCheckListItemCheck',
            {"id": $(this).attr('oid')}, true
            , function () {
                $(that).closest('tr').remove();
            });

})


$(document).on("click", ".addCheckListToTask", function (e) {
    var itemName = $('#updatetask_checklist').val();
    var that = this;

    callService('serviceTminsertSingleTaskCheckListCumulative',
            {"fkTaskId": global_var.current_task_id_4_comment,
                "itemName": itemName}, true
            , function () {
                getTaskCheckList(global_var.current_task_id_4_comment);
                ;
                $('#updatetask_checklist').val('');
            });

})


$(document).on("change", ".updateTaskcheckListItemName", function (e) {
    var itemName = $(this).val();
    var that = this;

    callService('serviceTmupdateTaskCheckListItemCheckName',
            {"id": $(this).attr('oid'),
                "itemName": itemName}, true
            , function () {

            });

})

$(document).on("click", ".addObserverToTAsk", function (e) {


    callService('serviceTminsertTaskObserver',
            {"fkTaskId": global_var.current_task_id_4_comment,
                "fkUserId": $('#updatetask_oblerverlist').val()}, true
            , function () {
                getTaskkObserverList(global_var.current_task_id_4_comment)
            });

})


$(document).on("click", ".loadUserForObserver", function (e) {

    var that = this;
    var cmb = $('#updatetask_oblerverlist');
    cmb.html('');

    callService('serviceTmLoadAssigneeByProject',
            {}, true
            , function (res) {
                var obj = (res && res.tbl && res.tbl.length > 0) ? res.tbl[0].r : [];
                for (var i in obj) {
                    var o = obj[i];
                    var opt = $('<option>').val(o.fkUserId).text(o.userName);
                    var opt2 = $('<option>').val(o.fkUserId).text(o.userName);
                    var opt3 = $('<option>').val(o.fkUserId).text(o.userName);
                    var opt4 = $('<option>').val(o.fkUserId).text(o.userName);
                    var opt5 = $('<option>').val(o.fkUserId).text(o.userName);
                    cmb.append(opt);
                    cmb.selectpicker('refresh');
                }
            });

})


function getTaskkObserverList(fkTaskId) {
    $('.task-observer-list').html('')
    callService('serviceTmgetTaskkObserverList',
            {"fkTaskId": fkTaskId}, true
            , function (res) {
                getTaskkObserverListDetaisl(res);
            });
}


function  getTaskkObserverListDetaisl(res) {
    var userList = {};
    try {
        var idx = getIndexOfTable(res, "userList");
        var objUser = res.tbl[idx].r;
        for (var k in objUser) {
            var o2 = objUser[k];
            userList[o2.id] = o2;
        }
    } catch (err) {
    }



    var div = $('.task-observer-list');
    div.html('')

    var table = $('<table>')
            .addClass('table table-hover project-table-list defaultTable sar-table');
    table.append($('<thead>')
            .append($("<tr>")
                    .append($("<th>")
                            .css("width", "1%")
                            .text("#"))
                    .append($('<th>')
                            .text("Observer"))
                    )
            )

    var idy = getIndexOfTable(res, "tmBacklogTaskObserver");
    var obj = (res && res.tbl && res.tbl.length > 0) ? res.tbl[idy].r : [];
    for (var n = 0; n < obj.length; n++) {
        var o = obj[n];

        var userSpan = (o.fkUserId && userList[o.fkUserId])
                ? $('<span>')
                .attr('title', 'Observer ')
                .addClass('peronal-info')
                .append($('<img>')
                        .addClass('Assigne-card-story-select-img')
                        .attr('width', '40px')
                        .attr('src', fileUrl(userList[o.fkUserId].userImage)))
                .append($('<span>').text(userList[o.fkUserId].userPersonName))

                : '';



        var tr = $("<tr>")
                .append($('<td>').text((n + 1)))
                .append($('<td>')
                        .append(userSpan))
                .append($('<td>')
                        .append($('<a href="#">')
                                .attr('oid', o.id)
                                .addClass("taskObserverDelete")
                                .append('<i class="fas fa-trash-alt" aria-hidden="true"></i>')))
                ;
        table.append(tr);
    }
    div.html(table);
}
function createdEventsTaskData(id) {
   ///legv edildi
}

function infoEventsTaskData(taskId) {
    $('.task-events-updated').attr("data-taskid", '');
    $('.task-events-updated input').val('');
    $('.task-events-updated input').change('');
    var json = initJSON();

    json.kv.fkTaskId = taskId;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsGetTaskEventListByTaskId",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            var obj = res.tbl[0].r[0];

            $('.task-events-updated').attr("data-taskid", obj.id);

            $('.task-events-updated input[name="mezmun"]').val(obj.mezmun);
            $('.task-events-updated input[name="mezmun"]').change();

            $('.task-events-updated input[name="struktur"]').val(obj.struktur);
            $('.task-events-updated input[name="struktur"]').change();

            $('.task-events-updated input[name="nov"]').val(obj.nov);
            $('.task-events-updated input[name="nov"]').change();

            $('.task-events-updated input[name="mesulShexs"]').val(obj.mesulShexs);
            $('.task-events-updated input[name="mesulShexs"]').change();

            $('.task-events-updated input[name="istirakci"]').val(obj.istirakci);
            $('.task-events-updated input[name="istirakci"]').change();

            $('.task-events-updated input[name="kontragent"]').val(obj.kontragent);
            $('.task-events-updated input[name="kontragent"]').change();

            $('.task-events-updated input[name="yer"]').val(obj.yer);
            $('.task-events-updated input[name="yer"]').change();

            $('.task-events-updated input[name="qeyd"]').val(obj.qeyd);
            $('.task-events-updated input[name="qeyd"]').change();

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


// function updatedEventsTaskData(id) {


// }

$(document).on("change", ".updevents", function (e) {
    var json = initJSON();
    json.kv.id = $(this).closest('.task-events-updated').attr('data-taskId');
    json.kv.type = $(this).attr('name');
    json.kv.value = $(this).val();

    // json.kv.filename = zipfilename;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsUpdateTaskEventInput4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            //  var dataurl = urlGl + 'api/get/files/' + res.kv.filename;
            try {
                var err = res.err.message;
                if (err) {
                    Toaster.showError(err);
                }

            } catch (error) {
                msgMessage = 'Events Updated successfully created!';
                Toaster.showMessage(msgMessage);
            }

        },
        error: function () {
            Toaster.showError(('API error'));

        }
    });
});

$(document).on("change", "#activateUpdatedEvenets", function (e) {

    if ($(this).is(':checked')) {

        $('.task-events-updated .cs-input-group input').css("pointer-events", "auto");
        $('.task-events-updated .cs-input-group input').css("opacity", "1");
        $('.task-events-updated .cs-input-group input').attr("disabled", false);
    } else {
        $('.task-events-updated .cs-input-group input[type="text"]').css("pointer-events", "none");
        $('.task-events-updated .cs-input-group input[type="text"]').css("opacity", "0.7");
        $('.task-events-updated .cs-input-group input[type="text"]').attr("disabled", true);
    }
});
$(document).on("change", "#activateCreatedEvenets", function (e) {

    if ($(this).is(':checked')) {

        $('.task-events-created .cs-input-group input').css("pointer-events", "auto");
        $('.task-events-created .cs-input-group input').css("opacity", "1");
        $('.task-events-created .cs-input-group input').attr("disabled", false);
    } else {
        $('.task-events-created .cs-input-group input[type="text"]').css("pointer-events", "none");
        $('.task-events-created .cs-input-group input[type="text"]').css("opacity", "0.7");
        $('.task-events-created .cs-input-group input[type="text"]').attr("disabled", true);
    }
});

$(document).on("click", '.sticky-badges, .taskfilter-btn, .notification-btn', function () {
    $('body').addClass('open-setting-panel');    
});
$(document).on("click", '.close-panel', function () {
    $('body').removeClass('open-setting-panel');    
});

$(document).on("focus", '.has-search .form-control', function () {
    if ($(this).is(':focus')) {
        $(this).closest('.header-section').addClass('search-focus');
    }
});

$(document).on("focusout", '.has-search .form-control', function () {
    $(this).closest('.header-section').removeClass('search-focus');
});
$(document).on("mouseenter", '.personal-btn-img', function () {
    $('.popover').addClass('task-list-personal-info-popover')
});

$(document).on("click", '.setting-elemen-box .taskfilter-btn', function () {
    $('#main-sidebar-div>div').hide();
    $('#main-sidebar-div .bugList-elements').show();    
});
$(document).on("click", '.setting-elemen-box .sticky-badges', function () {
    $('#main-sidebar-div>div').hide();
    $('#main-sidebar-div .sticky-elements').show();    
});
$(document).on("click", '.setting-elemen-box .notification-btn', function () {
    $('#main-sidebar-div>div').hide();
    $('#main-sidebar-div .notification-elements').show();    
});
$(document).on("click", '.show-more-btn', function () {
    $('.notification-elements').toggleClass('show-more');    
});
$(document).on("change", '.noteCheckListItem', function () {

    if ($(this).is(':checked')) {
        $(this).closest('li').addClass('on-checked');
    } else {
        $(this).closest('li').removeClass('on-checked');
    }

})

