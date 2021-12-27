// ***********************************************
//   7.09.2020 By GulBahar
// **********************************************
//  view pages open

var TestCase = {};
var TestCaseId = "";
var TestCaseTrialId = "";
var TestCaseTrials = {};
var TestCaseTrialRel = {};
var TestCaseTrialFailed = {};
var TestCaseTrialSolved = {};
var TestCaseTrialUnsolved = {};
var TestCasePopupsIsActive = false;



var testcase_filter = {
    search_text: '',
    backlog_id: '',
    createBy: '',
    priority: '',
    limit: 30,
    page_no: 1,
}

function setTestCaseFilterProject() {
    var select = $('#testcase_projectfilter');
    select.html("");
    var keys = Object.keys(SACore.Project);
    for (var id in keys) {
        var pid = keys[id];
        var option = $("<option>")
                .val(pid)
                .text(SACore.Project[pid]);
        if (pid === global_var.current_project_id) {
            option.attr("selected", "selected");
        }
        select.append(option)
    }
//    select.val(global_var.current_project_id)
    select.selectpicker();

}


$(document).on("change", '#testcase_projectfilter', function (e) {
    var id = $(this).val();
    global_var.current_project_id = id;
    Utility.addParamToUrl('current_project_id', global_var.current_project_id);
    //new Project().toggleProject(this);
    loadStoryCardByProject4TestCase(id);
    loadAssigneesByProject(id);

    testCaseFilter();
//    new Project().toggleProject(this);
//    loadStoryCardsForTestCase();
//    loadCreatedByForTestCase();
})


function loadStoryCardByProject4TestCase(projectId) {
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
        url: urlGl + "api/post/srv/serviceTmLoadStoryCardByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            loadStoryCardByProject4TestCaseDetails(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function loadStoryCardByProject4TestCaseDetails(res) {
    try {
        var el = $('#testcase_storycardfilter');
        el.html('');
        el.append($('<option>').val('').text('All'));
        var obj = res.tbl[0].r;
        for (var i in obj) {
            var o = obj[i];
            el.append($('<option>')
                    .val(o.id)
                    .text(o.backlogName));
        }
    } catch (err) {

    }
    $('#testcase_storycardfilter').selectpicker('refresh');

}

$(document).on("change", '.testcase-filter', function (e) {
    testCaseFilter();
})

function testCaseFilter() {
    testcase_filter.page_no = 1;
    getTestCaseList();
}

function setFilterValues() {
    testcase_filter.search_text = $('#testcase_search').val();
    testcase_filter.backlog_id = $('#testcase_storycardfilter').val();
    testcase_filter.createBy = $('#testcase_createdbyfilter').val();
    testcase_filter.limit = $('#testcase_limit').val();
    testcase_filter.priority = $('#testcase_priority4filter').val();
}

$(document).on("click", '.opentestCaseViewPage', function (e) {
    openTestCaseDiagloq();
})

$(document).on("dblclick", '.testcase-tr', function (e) {
    var ptype = $(this).attr('ptype');

    if (ptype === 'case') {
        openTestCaseDiagloq();
    } else if (ptype === 'trial') {
        openTestCaseTrialDiagloq();
    }

})

function openTestCaseTrialDiagloq() {
    TestCasePopupsIsActive = true;
    $('#testCaseTrialViewPage').css('visibility', 'visible');
    $('#testCaseViewPage').css('visibility', 'hidden');
    // $('#testCaseViewPageListTable').removeClass('col-12');         24.09.2020 bunlar silinmeli
    // $('#testCaseViewPageListTable').addClass('col-6');
}


function openTestCaseDiagloq() {
    TestCasePopupsIsActive = true;

    $('#testCaseViewPage').css('visibility', 'visible');
    $('#testCaseTrialViewPage').css('visibility', 'hidden');

    // $('#testCaseViewPageListTable').removeClass('col-12');         24.09.2020 bunlar silinmeli
    // $('#testCaseViewPageListTable').addClass('col-6');
}

$(document).on("click", '#testCaseViewPageClose', function (e) {
    TestCasePopupsIsActive = false;
    $('#testCaseViewPage').css('visibility', 'hidden');
    // $('#testCaseViewPageListTable').removeClass('col-6');           24.09.2020 bunlar silinmeli
    // $('#testCaseViewPageListTable').addClass('col-12');
})

$(document).on("click", '#testCaseTrialViewPageClose', function (e) {
    TestCasePopupsIsActive = false;
    $('#testCaseTrialViewPage').css('visibility', 'hidden');
    // $('#testCaseViewPageListTable').removeClass('col-6');           24.09.2020 bunlar silinmeli
    // $('#testCaseViewPageListTable').addClass('col-12');
})

$(document).on("click", '.testcase-tr ', function (e) {


    $('.testcase-tr').removeClass("active");
    $(this).toggleClass("active")

    var ptype = $(this).attr('ptype');
    var caseId = $(this).attr('case-id');
    var id = $(this).attr('pid');



    if (ptype === 'case') {
        TestCaseId = id;
        TestCaseTrialId = "";
        getNewLPrerActionList();

        var obj = TestCase[TestCaseId];
        $('#testcase_name').val(obj.testCaseName);
        $('#testcase_generaldesc').val(obj.generalDescription);
        $('#testcase_testscenario').val(obj.testCaseScenario);
        $('#testcase_priority').val(obj.priority);
        $('#testcase_storycard').val(obj.fkBacklogId);

        if (TestCasePopupsIsActive)
            openTestCaseDiagloq();

    } else if (ptype === 'trial') {
        TestCaseId = caseId;
        TestCaseTrialId = id;
        getTrialStepList(id);

        if (TestCasePopupsIsActive)
            openTestCaseTrialDiagloq();
    }



})


function testTrialToTaskNew(trialId) {
    $('#addNewDetailedTaskModal').modal('show');
    addUserStoryToTask_loadAssignee();
    addUserStoryToTask_loadTaskType();
    $('#addNewDetailedTaskModal_assigneelist').html('');

    getTrialInfo4TaskAssignee(trialId);

//    $('#addNewDetailedTaskModal_backlogid').val(global_var.current_backlog_id);
//    $('#addNewDetailedTaskModal_projectid').val(global_var.current_project_id);
//    addInputListToTaskNew_setHeader(descId);
//    addInputListToTaskNew_setComment(descId, inputId);
}

function getTrialInfo4TaskAssignee(trialId) {
    if (!trialId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.trialId = trialId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTestCaseStepTrialList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#addNewDetailedTaskModal_tasknature').val('bug');
            $('#addNewDetailedTaskModal_backlogid').val(res.kv.fkBacklogId);
            $('#addNewDetailedTaskModal_projectid').val(res.kv.fkProjectId);
            $('#addNewDetailedTaskModal_filelist').val(res.kv.imgUrl);

            var prCode = SACore.GetProjectCore(res.kv.fkProjectId).projectCode;
            prCode = prCode.toUpperCase();

            var st = "(BUG " + prCode + "" + res.kv.testCaseNo + ") " + add3Dots2String(res.kv.testCaseName, 120) + "";
            $('#addNewDetailedTaskModal_description').val(st);


            var cmmt = getTestCaseTrialTaskAssignContent(res);
            $('#addNewDetailedTaskModal_comment').val(cmmt);
        }
    });
}

function getTestCaseTrialTaskAssignContent(result) {
    var res = "";
    try {
        var obj = result.tbl[0].r;
        var preq = "";
        var steps = "";

        var idx = 1;
        var idy = 1;
        for (var i in obj) {
            var ob = obj[i];

            if (ob.stepType === 'prer') {
                preq += (idx++) + ") " + ob.stepName + " ([Requeired Data]:" + ob.requiredData + ") \n";
            } else if (ob.stepType === 'step') {
                steps += (idy++) + ") " + ob.stepName + " \n"
                steps += '[Requeired Data]: ' + ob.requiredData + " \n";
                steps += '[Expected Result]: ' + ob.expectedResult + " \n";
                steps += '[Actual Result]: ' + ob.actualResult + " \n";
                steps += '[Step Status]: ' + ob.stepStatus + " \n";
                steps += "\n";

            }
        }




        var o = result.kv;
        res += "TEST CASE: \n"
        res += o.testCaseName;
        res += "\n\n";
        res += "TEST SCENARIO:\n";
        res += o.testCaseScenario;
        res += "\n\n";
        res += "TEST DESCRIPTION: \n";
        res += o.generalDescription;
        res += "\n\n";
        res += "TEST STATUS: \n";
        res += o.trialStatus;
        res += "\n\n";
        res += "PREREQUISITE: \n";
        res += preq
        res += "\n\n";
        res += "STEPS: \n";
        res += steps;
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";
        res += "";

    } catch (err) {
    }
    return res;
}

function getTestCaseTrialTaskAssignContent_Prerequisite(res) {

}

$(document).on("change", '.test-case-change-4-update', function (e) {
    var data_type = $(this).attr("data-type");
    var val = $(this).val();
    var id = TestCaseId;
    TestCase[id][data_type] = val;
    updateTestCase4ShortChangeDetails(id, val, data_type)
})

$(document).on("change", '.test-case-trial-change-4-update', function (e) {
    var data_type = $(this).attr("data-type");
    var val = $(this).val();
    var id = TestCaseTrialId;
    TestCaseTrials[id][data_type] = val;
    updateTestCaseTrial4ShortChangeDetails(id, val, data_type)
})

$(document).on("change", '.test-case-step-trial-change-4-update', function (e) {
    var data_type = $(this).attr("data-type");
    var val = $(this).val();
    var id = $(this).attr("data-id");
    updateTestCaseStepTrial4ShortChangeDetails(id, val, data_type)
})

$(document).on("change", '.test-case-step-change-4-update', function (e) {
    var data_type = $(this).attr("data-type");
    var val = $(this).val();
    var id = $(this).attr("data-id");
    updateTestCaseStep4ShortChangeDetails(id, val, data_type)
})

function loadCreatedByForTestCase() {
    var obj = Object.keys(SAProjectUser.ProjectUsers);
    $('#testcase_createdbyfilter')
            .append($('<option>').val('').text(''))

    for (var i in obj) {
        var o = obj[i];
        var userName = SAProjectUser.GetUserDetails(o, "userPersonName");
        $('#testcase_createdbyfilter')
                .append($('<option>').val(o).text(userName));

    }
    sortCombo('testcase_createdbyfilter');
    $('#testcase_createdbyfilter').selectpicker('refresh');
}

function loadStoryCardsForTestCase() {
    var objCore = SACore.toJSON();
    var obj = objCore.tbl[0].r;

    $('#testcase_storycardfilter')
            .append($('<option>').val('').text(''))
    $('#testcase_storycard')
            .append($('<option>').val('').text(''))
    for (var i in obj) {
        var o = obj[i];
        $('#testcase_storycard')
                .append($('<option>').val(o.id).text(o.backlogName));
        $('#testcase_storycardfilter')
                .append($('<option>').val(o.id).text(o.backlogName))
    }
    sortCombo('testcase_storycard');
    sortCombo('testcase_storycardfilter');
    $('#testcase_storycardfilter').selectpicker('refresh');

}

function updateTestCaseStep4ShortChangeDetails(id, val, ustype) {

    try {

        if (id.lentgh === 0 || ustype.lentgh === 0 || val.lentgh === 0) {
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
    json.kv.id = id;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateTestCaseStep4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function updateTestCaseStepTrial4ShortChangeDetails(id, val, ustype) {

    try {

        if (id.lentgh === 0 || ustype.lentgh === 0 || val.lentgh === 0) {
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
    json.kv.id = id;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateTestCaseStepTrial4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function addImageToTestCaseTrial(id, imgUrl) {

    try {

        if (id.lentgh === 0 || imgUrl.lentgh === 0) {
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
    json.kv.id = id;
    json.kv.imgUrl = imgUrl;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddImageToTestCaseTrial",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            var imgUrl = res.kv.imgUrl;
            getTestCaseList();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function setFilesToTestCaseTrial4Td(trialId, imgUrl) {
    var imgs = imgUrl.split("|");
    var div = $('<div>');

    for (var i in imgs) {
        var img = imgs[i];
        if (img.length < 6) {
            continue;
        }

        div.append(fileDiv4TestCaseTrial(trialId, img))
                .append(" &nbsp; | &nbsp; ");


    }
    return div;
}


function setFilesToTestCaseTrial(trialId, imgUrl) {
    var imgs = imgUrl.split("|");
    var div = $('#testcasetrial_filelist');
    div.html('');
    for (var i in imgs) {
        var img = imgs[i];
        if (img.length < 6) {
            continue;
        }

        div.append(fileDiv4TestCaseTrial(trialId, img))
                .append(" &nbsp; | &nbsp; ");


    }
}


function fileDiv4TestCaseTrial(id, name) {
    try {

        if (name.trim().length === 0) {
            return;
        }

        var ind = name.lastIndexOf(".") + 1;
        var fileFormat = name.substr(ind);
        var fileUrlVar = fileUrl(name);

        if (global_var.image_formats.includes(fileFormat)) {
            fileUrlVar = fileUrl(name);
        } else if (global_var.video_formats.includes(fileFormat)) {
            fileUrlVar = videoFileURL(name);

        } else if (fileFormat === 'pdf') {
            fileUrlVar = pdfFileURL(name);
        }

        var a = $('<a target="_blank"></a>')
                .attr("href", fileUrlVar)
                .append(add3Dots2Filename(name));

        return a;
    } catch (err) {
    }
}



function updateTestCaseTrial4ShortChangeDetails(id, val, ustype) {

    try {

        if (id.lentgh === 0 || ustype.lentgh === 0 || val.lentgh === 0) {
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
    json.kv.id = id;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateTestCaseTrial4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            genTestCaseTableByRes();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}



function updateTestCase4ShortChangeDetails(id, val, ustype) {

    try {

        if (id.lentgh === 0 || ustype.lentgh === 0 || val.lentgh === 0) {
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
    json.kv.id = id;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateTestCase4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            genTestCaseTableByRes();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


// search

// *************************
// //1.3 Test Case Scenario
// ************************



function setGlobData(res) {
    try {
        TestCase = {};
        var idx = getIndexOfTable(res, "tmTestCase");
        var obj = res.tbl[idx].r;
        for (var i in obj) {
            var o = obj[i];
            TestCase[o.id] = o;
        }

    } catch (err) {
        console.log(err)
    }
}

function addNewTestCase(el) {
    var testCaseName = $(el).val();
    if (!testCaseName)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkBacklogId = testcase_filter.backlog_id;
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.testCaseName = testCaseName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewTestCase",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $(el).val('');
            setGlobData(res);
            getTestCaseList();
            $('.test-case-row-id-' + res.kv.id).click();
        }
    });
}

function getTestCaseList() {
    setFilterValues();
//    $('#testCaseViewPageListTableMain > tbody').html('');

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.searchText = testcase_filter.search_text;
    json.kv.fkBacklogId = testcase_filter.backlog_id = $('#testcase_storycardfilter').val();
    json.kv.createBy = testcase_filter.createBy;
    json.kv.tableLimit = testcase_filter.limit;
    json.kv.pageNo = testcase_filter.page_no;
    json.kv.priority = testcase_filter.priority;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTestCaseList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            setTestCaseTrialRes(res);
            setGlobData(res);
            genTestCaseTableByRes(res);
            setPagination4TestCase(res.kv.tableCount, res.kv.limit);
//            genTestCaseTable(res);
        }
    });
}

$(document).on("click", '.page-item-core-previous-4-testcase', function (e) {
    testcase_filter.page_no = parseInt(testcase_filter.page_no) - 1;
    getTestCaseList();
})

$(document).on("click", '.page-item-core-next-4-testcase', function (e) {
    testcase_filter.page_no = parseInt(testcase_filter.page_no) + 1;
    getTestCaseList();
})

$(document).on("click", '.page-item-core-4-testcase', function (e) {
    testcase_filter.page_no = $(this).attr("page-no");
    getTestCaseList();
})

function setPagination4TestCase(rowcount, limit) {
    var rc = Math.ceil(rowcount / testcase_filter.limit);
    var el = $('#pagination_block');
    el.html('');
    el.append($('<li class="page-item page-item-core-previous-4-testcase">')
            .append($('<a class="page-link" href="#" aria-label="Previous">')
                    .append($('<span aria-hidden="true">').append('&laquo;'))
                    .append($('<span class="sr-only">').append('Previous'))))

    for (var i = 1; i <= rc; i++) {

        var li = $('<li>')
                .addClass('page-item num page-item-core-4-testcase')
                .attr('page-no', i)
                .append($('<a  href="#" class="page-link">').append(i));

        if (i === parseInt(testcase_filter.page_no)) {
            li.addClass("active");
        }

        el.append(li)
    }

    el.append($('<li class="page-item order-last page-item-core-next-4-testcase">')
            .append($('<a class="page-link" href="#" aria-label="Next">')
                    .append($('<span aria-hidden="true">').append('&raquo;'))
                    .append($('<span class="sr-only">').append('Next'))))

}


function genTestCaseTableHeader() {
    var header = $('<tr>')
            .addClass('testcase-tr')
            .addClass('testCaseListborder')
            .append($('<th>').append("#"))
            .append($('<th>').append(" "))
            .append($('<th>').append(" "))
            .append($('<th>').append(" "))
            .append($('<th>').append("Test Case"))
            .append($('<th>').append("Test Scenario"))
//            .append($('<th>').append("# Failed Trials "))
//            .append($('<th>').append("Last Executed Date"))
//            .append($('<th>').append("Last Execution Status"))
            .append($('<th>').append("Priority"))
            .append($('<th>').append("Created Date"))
            .append($('<th>').append("Created By"))
            .append($('<th>').append("Story Card"))
            .append($('<th>').append(""))
            .append($('<th>').append(""))


    return header;
}

function genTestCaseTableByRes() {
    var hiddenTrials = [];
    $('.testcase-tr.testCaseListborder').each(function () {
        var pid = $(this).attr("pid");
        hiddenTrials.push(pid);
    })

    $('.case-trial-list:hidden').each(function () {
        var caseId = $(this).attr("caseId");
        hiddenTrials = hiddenTrials.filter(function (elem) {
            return elem != caseId;
        });
    })

    var header = $('#testCaseViewPageListTableMain > thead');
    var tbody = $('#testCaseViewPageListTableMain > tbody');
    tbody.html('');

    header.html(genTestCaseTableHeader());

    var obj = Object.keys(TestCase);
    for (var i = 0; i < obj.length; i++) {
        var o = TestCase[obj[i]];

        var userImage = SAProjectUser.GetDetails(o.createdBy, "userImage");
        var userName = SAProjectUser.GetDetails(o.createdBy, "userName");
        var img = (userImage)
                ? fileUrl(userImage)
                : fileUrl(new User().getDefaultUserprofileName());

        var assigneeImg = $('<span>')
        assigneeImg.append($('<img>')
//                        .css("width","24px")
//                        .css('height','24px')
                .addClass('Assigne-card-story-select-img')
                .attr('src', img)
                .attr('alt', userName)
                .attr("title", userName))
                .append(" ")
                .append(userName)

        var storyCard = SACore.GetBacklogname(o.fkBacklogId);
        var row = (i + 1 + (parseInt(testcase_filter.page_no) - 1) * (parseInt(testcase_filter.limit)))

        var trialCount = 0;
        var failedCount = 0;
        var solvedCount = 0;
        var unsolvedCount = 0;
        try {
            trialCount = TestCaseTrialRel[o.id].split(',').length - 1;
        } catch (err) {
        }
        try {
            failedCount = TestCaseTrialFailed[o.id].split(',').length - 1;
        } catch (err) {
        }
        try {
            solvedCount = TestCaseTrialSolved[o.id].split(',').length - 1;
        } catch (err) {
        }
        try {
            unsolvedCount = TestCaseTrialUnsolved[o.id].split(',').length - 1;
        } catch (err) {
        }

        var showPanel = (hiddenTrials.length > 0 && hiddenTrials.includes(o.id)) ? "" : "none";
        var arrowRight = (showPanel === 'none') ? "" : "none";
        var arrowDown = (showPanel === 'none') ? "none" : "";

        var t = $('<tr>')
                .addClass('testcase-tr')
                .attr("ptype", "case")
                .addClass("test-case-row-id-" + o.id)
                .attr("pid", o.id)
                .addClass('testCaseListborder')
                .append($('<td>').append(row))
                .append($('<td>')
                        .append((trialCount > 0) ? $("<i class='fa fa-arrow-circle-right'>")
                                .addClass("test-case-trial-toggle")
                                .css("cursor", "pointer")
                                .css("display", arrowRight)
                                .css("color", "blue")
                                .css("font-size", "24px") : "")
                        .append((trialCount > 0) ? $("<i class='fa fa-arrow-circle-down'>")
                                .addClass("test-case-trial-toggle")
                                .css("cursor", "pointer")
                                .css("display", arrowDown)
                                .css("color", "orange")
                                .css("font-size", "24px") : ""))
                .append($('<td>')
                        .append((trialCount > 0) ? $("<span>")
                                .addClass("test-case-trial-status-trial")
                                .append("TRIAL - ")
                                .append('<b>' + trialCount + "</b> ") : "")
                        .append("<br>")
                        .append((trialCount > 0) ? $("<span>")
                                .css("margin-top", "3px")
                                .addClass("test-case-trial-status-failed")
                                .append("FAILED - ")
                                .append('<b>' + failedCount + "</b>") : "")
                        )
                .append($('<td>')
                        .append((trialCount > 0 && failedCount > 0) ? $("<span>")
                                .addClass("test-case-trial-is-solved-no")
                                .append("UNSOLVED - ")
                                .append(unsolvedCount) : "")
                        )
                .append($('<td>').css("max-width", "300px").append(o.testCaseName))
                .append($('<td>').css("max-width", "300px").append(o.testCaseScenario))
//                .append($('<td>').append("6 ").append($('<i class="fa fa-bug">').css("color", "red")))
//                .append($('<td>').append("20.03.2020"))
//                .append($('<td>').append("ongoing"))
                .append($('<td>').append(o.priority))
                .append($('<td>').append(Utility.convertDate(o.createdDate)).append(' ').append(Utility.convertTime(o.createdTime)))
                .append($('<td>').append(assigneeImg))
                .append($('<td>').append($('<a href="#">')
                        .css("color", "blue")
                        .attr("onclick", "callStoryCard('" + o.fkBacklogId + "')")
                        .append(storyCard)))

                .append($('<td>')
//                        .css("width", "2%")
                        .addClass("text-right")
                        .addClass("text-scenario-new-trial")
                        .attr("pid", o.id)
                        .append($('<button>')
                                .addClass('btn btn-primary ')
                                .text("Run")
                                ))
                .append($('<td>')
                        .css("width", "1%")
                        .append($('<i>')
                                .addClass('fa fa-arrow-right bug-icon viewBtn')
                                .addClass('opentestCaseViewPage'))
                        )

        tbody.append(t);




        tbody.append($('<tr>')
                .addClass("test-case-step-trials-" + o.id)
                .addClass("case-trial-list")
                .attr("caseId", o.id)
                .css("cursor", "pointer")
                .css('display', showPanel)
                .append($("<td>")
                        .attr('colspan', '11')
                        .css("padding", "30px 150px")
                        .append(trialTableOfTestCase(o.id)))
                )
    }


    if (TestCaseTrialId) {
        $('.test-case-trial-' + TestCaseTrialId).click();
    } else {
        $('.test-case-row-id-' + TestCaseId).click();
    }
}


$(document).on("click", '.test-case-trial-toggle', function (e) {
    var pid = $(this).closest("tr").attr('pid');
    $('.test-case-step-trials-' + pid).toggle(700);
    $(this).closest('tr').find('.test-case-trial-toggle').each(function (e) {
        $(this).toggle(700);
    });

})


function getUserProfilePicture(userId) {
    var userImage = SAProjectUser.GetDetails(userId, "userImage");
    var userName = SAProjectUser.GetDetails(userId, "userName");
    var img = (userImage)
            ? fileUrl(userImage)
            : fileUrl(new User().getDefaultUserprofileName());

    var assigneeImg = $('<span>')
    assigneeImg.text(userName).prepend(" ")
            .prepend($('<img>')
//                        .css("width","24px")
//                        .css('height','24px')
                    .addClass('Assigne-card-story-select-img')
                    .attr('src', img)
                    .attr('alt', userName)
                    .attr("title", userName))
            ;
    return assigneeImg;
}

function trialTableOfTestCase(testCaseId) {
    if (!testCaseId)
        return;

    try {
        var table = $("<table>")
                .css("width1", "60%")
                .css("background-color", "#FAEBD7;")
                .attr("border", "0px solid white")
                .addClass("table1 table-borderless ");

        var trialIds = TestCaseTrialRel[testCaseId].split(',');
        for (var i in trialIds) {
            try {
                var trialId = trialIds[i];
                var o = TestCaseTrials[trialId];

                var dt = Utility.convertDate(o.createdDate) + ' ' + Utility.convertTime(o.createdTime);
                var userImg = getUserProfilePicture(o.createdBy);
                var isSolvedVal = (o.isSolved) ? o.isSolved : "no";
                var isSolved = (o.trialStatus === 'failed')
                        ? $('<span>')
                        .addClass("test-case-trial-is-solved-" + isSolvedVal)
                        .text((isSolvedVal === 'yes' ? "SOLVED" : "UNSOLVED"))
                        : "";


                var tr = $("<tr>")
                        .addClass("testcase-tr")
                        .addClass("test-case-trial-" + o.id)
                        .attr("ptype", "trial")
                        .attr("pid", trialId)
                        .attr("case-id", testCaseId)
                        .append($('<td>')
                                .css("width", "1%")
                                .append($('<span>')
                                        .addClass("test-case-trial-status-" + o.trialStatus)
                                        .text(o.trialStatus.toUpperCase())))
                        .append($('<td>').css("width", "1%").append(isSolved))
                        .append($('<td>').css("padding", "5px 30px").text(dt))
                        .append($('<td>')
                                .css("padding", "10px 30px")
                                .append(userImg))
                        .append($('<td>')
                                .css("padding", "10px 30px")
                                .append(setFilesToTestCaseTrial4Td(o.id, o.imgUrl)))
                        .append($('<td>')

                                .css("padding", "10px 30px")
                                .append($("<button>")
                                        .attr("onclick", "testTrialToTaskNew('" + trialId + "')")
                                        .addClass("btn btn-warning")
                                        .text('Notify')))
                        .append($('<td>')
                                .css("width", "1%")
                                .append($('<i>')
                                        .css("font-size", "14px")
                                        .addClass('fa fa-arrow-right')
                                        .addClass('opentestCaseViewPage'))
                                )

                table.append(tr);
            } catch (err) {
            }
        }
        return table;
    } catch (err) {
    }

}

$(document).on("click", '.test-case-trial-toggle', function (e) {

})

$(document).on("click", '.text-scenario-new-trial', function (e) {

    var testCaseId = $(this).attr('pid');

    if (!(testCaseId))
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkTestCaseId = testCaseId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewTestCaseTrial",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {

            getTestCaseList();

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
})

function setTestCaseTrialRes(res) {
    try {
        TestCaseTrials = {};
        TestCaseTrialRel = {};
        TestCaseTrialFailed = {};
        TestCaseTrialSolved = {};
        TestCaseTrialUnsolved = {};
        var idx = getIndexOfTable(res, "trialListTable");
        var obj = res.tbl[idx].r;
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            TestCaseTrials[o.id] = o;
            TestCaseTrialRel[o.fkTestCaseId] += "," + o.id;
            TestCaseTrialFailed[o.fkTestCaseId] += (o.trialStatus === 'failed') ? "," + o.id : "";
            TestCaseTrialSolved[o.fkTestCaseId] += (o.trialStatus === 'failed' && o.isSolved === 'yes') ? "," + o.id : "";
            TestCaseTrialUnsolved[o.fkTestCaseId] += (o.trialStatus === 'failed' && o.isSolved === 'no') ? "," + o.id : "";
        }

    } catch (err) {

    }
}


function genTestCaseTable(res) {
    var table = $('#testCaseViewPageListTableMain');
    var header = $('#testCaseViewPageListTableMain > thead');
    var tbody = $('#testCaseViewPageListTableMain > tbody');
    tbody.html('');

    header.html(genTestCaseTableHeader());

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];

        var userImage = SAProjectUser.GetDetails(o.createdBy, "userImage");
        var userName = SAProjectUser.GetDetails(o.createdBy, "userName");
        var img = (userImage)
                ? fileUrl(userImage)
                : fileUrl(new User().getDefaultUserprofileName());


        var t = $('<tr>')
                .addClass('testcase-tr')
                .addClass("test-case-row-id-" + o.id)
                .attr("pid", o.id)
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
//                .append($('<td>').append("FAILED"))
                .append($('<td>').append(o.testCaseName))
                .append($('<td>').append(o.testCaseScenario))
//                .append($('<td>').append("6 ").append($('<i class="fa fa-bug">').css("color", "red")))
//                .append($('<td>').append("20.03.2020"))
//                .append($('<td>').append("ongoing"))
                .append($('<td>').append(o.createdDate).append(' ').append(o.createdTime))
                .append($('<td>').append(o.createdBy))
                .append($('<td>').append(o.fkBacklogId))

                .append($('<td>')
                        .append($('<button>').addClass('btn btn-light viewBtn')
                                .addClass('opentestCaseViewPage')
                                .append($('<i>').addClass('fa fa-plus').addClass('bug-icon'))
                                ))

        tbody.append(t);
    }
}


function testCaseGeneralTable(el) {
    var stepName = $(el).val();

    if (!(stepName))
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['fkTestCaseId'] = TestCaseId;
    json.kv['stepType'] = "step";
    json.kv.stepName = stepName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewTestCaseStep",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getNewLPrerActionList();
            $(el).val('')
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

// ****************************
//  // 1 Prerequisite Action
//  **************************

function addNewPrerAction(el) {

    var stepName = $(el).val();

    if (!(stepName))
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['fkTestCaseId'] = TestCaseId;
    json.kv['stepType'] = "prer";
    json.kv.stepName = stepName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewTestCaseStep",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getNewLPrerActionList();
            $(el).val('')
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function deleteTestCaseTrial(el) {

    var testCaseId = TestCaseTrialId;

    if (!(testCaseId)) {
        return;
    }

    if (!confirm("Are you sure?")) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }


    json.kv.id = testCaseId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteTestCaseTrial",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getTestCaseList();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function deleteTestCase(el) {

    var testCaseId = TestCaseId;

    if (!(testCaseId)) {
        return;
    }

    if (!confirm("Are you sure?")) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }


    json.kv.id = testCaseId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteTestCase",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getTestCaseList();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function dublicateTestCase(el) {

    var testCaseId = TestCaseId;

    if (!(testCaseId)) {
        return;
    }



    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }


    json.kv.id = testCaseId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDublicateTestCase",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getTestCaseList();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function prerActionTable(res) {
    var table = $('#prerAction').children();
    var t = table.addClass('table')
            .addClass('spilted')
            .addClass('bugListTable')
    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<tr>')
                .append($('<td>')
                        .append(o.taskName))
                .append($('<td>')
                        .append($('<div>').append($('<table>').addClass('testData'))

                                .append($('<input>')
                                        .attr('id', 'AddNewTestData' + obj[i].id)
                                        .addClass('form-control')
                                        .attr('placeholder', '+ Add Test data')
                                        .attr("onclick", 'addNewTestData("' + obj[i].id + '")')
                                        .addClass('prerActionTableGeneralCls'))))

        table.append(t);
    }
}


function deleteTestCaseStep(el, id) {
    if (!id)
        return;

    if (!confirm("Are you sure?")) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteTestCaseStep",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $(el).closest('tr').remove();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function getTrialStepList(trialId) {
    if (!trialId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.trialId = trialId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTestCaseStepTrialList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#testcasetrial_trialstatus').val(res.kv.trialStatus);
            $('#testcasetrial_issolved').val(res.kv.isSolved);
            $('#testcasetrial_name').val(res.kv.testCaseName);
            $('#testcasetrial_generaldesc').val(res.kv.generalDescription);
            $('#testcasetrial_testscenario').val(res.kv.testCaseScenario);
            $('#testcasetrial_priority').val(res.kv.priority);

            getTrialStepListDetails(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function getTrialStepListDetails(res) {
    var prerTable = $('#prerActionTableTrial >tbody');
    var stepTable = $('#testCaseTrialGeneralTableList >tbody');
    prerTable.html('');
    stepTable.html('');


    var obj = res.tbl[0].r;
    for (var i in obj) {
        var o = obj[i];




        var tr = $('<tr>')
                .append($('<td>').text(o.stepName))
                .append($('<td>').text(o.requiredData))

        prerTable.append(tr);

        if (o.stepType === 'step') {
            var select = $('<select>')
                    .attr('data-type', "stepStatus")
                    .attr('data-id', o.id)
                    .addClass("test-case-step-trial-change-4-update")
                    .addClass("form-control textareaStyle")
                    .append($("<option>").val("ok").text("OK"))
                    .append($("<option>").val("nok").text("Not OK"));
            select.val(o.stepStatus);

            tr.append($('<td>').text(o.expectedResult));
            tr.append($('<td>')
                    .append($('<textarea rows="2">')
                            .attr('data-type', "actualResult")
                            .attr('data-id', o.id)
                            .addClass("test-case-step-trial-change-4-update")
                            .addClass("form-control textareaStyle")
                            .append(o.actualResult)))
            tr.append($('<td>').append(select))
            stepTable.append(tr)
        }
    }
}

function getNewLPrerActionList() {
    if (!TestCaseId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkTestCaseId = TestCaseId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTestCaseStepList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getNewLPrerActionListDetails(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function getNewLPrerActionListDetails(res) {
    var prerTable = $('#prerActionTable >tbody');
    var stepTable = $('#testCaseGeneralTableList >tbody');
    prerTable.html('');
    stepTable.html('');


    var obj = res.tbl[0].r;
    for (var i in obj) {
        var o = obj[i];




        var tr = $('<tr>')
                .append($('<td style="width1:50%">')
                        .append($('<textarea rows="2">')
                                .attr('data-type', "stepName")
                                .attr('data-id', o.id)
                                .addClass("test-case-step-change-4-update")
                                .addClass("form-control textareaStyle")
                                .append(o.stepName)))
                .append($('<td style="width1:50%" >')
                        .append($('<textarea rows="2">')
                                .attr('data-type', "requiredData")
                                .attr('data-id', o.id)
                                .addClass("test-case-step-change-4-update")
                                .addClass("form-control textareaStyle")
                                .append(o.requiredData)))

        if (o.stepType === 'prer') {
            tr.append($('<td style="width1:50%" >')
                    .append($('<a href="#">')
                            .css("color", "blue")
                            .attr("onclick", "deleteTestCaseStep(this,'" + o.id + "')")
                            .append("Delete")));
            prerTable.append(tr);

        } else if (o.stepType === 'step') {
            tr.append($('<td style="width1:50%" >')
                    .append($('<textarea rows="2">')
                            .attr('data-type', "expectedResult")
                            .attr('data-id', o.id)
                            .addClass("test-case-step-change-4-update")
                            .addClass("form-control textareaStyle")
                            .append(o.expectedResult)));
            tr.append($('<td style="color:blue" >')
                    .append($('<a href="#">')
                            .css("color", "blue")
                            .attr("onclick", "deleteTestCaseStep(this,'" + o.id + "')")
                            .append("Delete")));
            stepTable.append(tr)
        }
    }
}

//  *************************     
//     //1 Test Data
// ****************************

function addNewTestData(id, backlogId, assgineeId, taskStatus) {

    $('#AddNewTestData' + id).keypress(function (e, bugDesc) {

        var key = e.which;
        if (key == 13) {
            var bugDesc = $('#AddNewTestData' + id).val();
            console.log(bugDesc)
            console.log(id + 'ok')

            if (!(bugDesc))
                return;
            var json = {kv: {}};
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
                    getTestDataList()
                    $('#AddNewTestData' + id).val('')
                },
                error: function () {
                    Toaster.showError(('somethingww'));
                }
            });
            $('#AddNewTestData' + id).val()

        }
    });
}
// 2 T.D_______________________________________________________________  

function testDataTable(res) {
    var table = $('.testData');
    var t = table.addClass('table')
            .addClass('spilted')
            .addClass('bugListTable')
    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<tr>')
                .append($('<td>')
                        .append(o.taskName))

        table.append(t);
    }
}
//3  T.D_______________________________________________________________  
function getTestDataList() {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            testDataTable(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

// ****************************
// <!-- Test case view list -->
// ***************************
// 1 T.C .V.L_______________________________________________________________  
function addNewviewListTable(backlogId, assgineeId, taskStatus) {
    $('.testDesc').keypress(function (e, bugDesc) {

        var key = e.which;
        if (key == 13) {
            var bugDesc = $('.testDesc').val();

            if (!(bugDesc))
                return;
            var json = {kv: {}};
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
                    getNewviewListTable()
                    $('.testDesc').val('')

                },
                error: function () {
                    Toaster.showError(('somethingww'));
                }
            });
            $('.testDesc').val('')
        }
    });
}

// 2 T.C .V.L_______________________________________________________________  

function viewListTable(res) {

}

//3   T.C .V.L_______________________________________________________________  
function getNewviewListTable(e) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            viewListTable(res);

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

$(document).on('click', function (e) {
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 100) {
            $("#testCaseViewPage").addClass("sticky2");
            $("#testCaseTrialViewPage").addClass("sticky2");
        } else {
            $("#testCaseViewPage").removeClass("sticky2")
            $("#testCaseTrialViewPage").removeClass("sticky2")
        }
    })
})