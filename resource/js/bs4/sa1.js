/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 

function showGuiInputList4DebugView() {
    var tbody = $('#backlogInput4Debug');
    tbody.html('');

    var loadedList = [];

    var ls = SADebug.Lines;
    for (var i = 0; i < ls.length; i++) {
        var obj = SADebug.Lines[i];
        if (!obj.actionId) {
            continue
        }

        if (loadedList.includes(obj.actionId)) {
            continue;
        }


        loadedList.push(obj.actionId);



        var txt = " " + obj.desc;
        txt += (obj.relationType === 'gui_gui') ? " (Event Relation)" : "";

        var tr = $('<tr>')
                .append($('<td>')
                        .append($('<input type="checkbox">')
                                .addClass('debugInputListCheckbox')
                                .attr('pval', obj.desc)
                                .attr('checked', obj.active === '1')
                                .attr('onchange', 'toggleInputList4Debug(this)')
                                .attr('actionId', obj.actionId)
                                )
                        )
                .append($('<td>')
                        .append($('<input type="checkbox">')
                                .addClass('debugInputListCheckbox4Selectedfield')
                                .attr('pval', obj.desc)
                                .attr('onchange', 'toggleInputList4Debug4Selectedfield(this)')
                                .attr('actionId', obj.actionId)
                                )
                        )
                .append($('<td>')
                        .append($('<span>').text(txt)))

        tbody.append(tr);
    }
}


function toggleInputList4Debug(el) {
    var actionId = $(el).attr('actionId');

    if (actionId) {
        var ls = SADebug.Lines;
        for (var i = 0; i < ls.length; i++) {
            var obj = SADebug.Lines[i];
            if (obj.actionId === actionId) {
                SADebug.Lines[i].active = $(el).is(":checked") ? "1" : "0";
            }
        }
    }

    SADebug.RemoveAllDrawLine();
    SADebug.DrawLines();

}

function toggleCheckAllInputListInDebugMode(el) {
    if ($(el).is(":checked")) {
        $(el).closest('table').find('.debugInputListCheckbox').each(function () {
            var val = $(this).attr('pval');
            var ls = SADebug.Lines;
            for (var i = 0; i < ls.length; i++) {
                if (SADebug.Lines[i].desc === val) {
                    SADebug.Lines[i].active = "1";
                }
            }
        });


    } else {
        $(el).closest('table').find('.debugInputListCheckbox').prop("checked", false);
        $(el).closest('table').find('.debugInputListCheckbox').each(function () {
            var val = $(this).attr('pval');
            var ls = SADebug.Lines;
            for (var i = 0; i < ls.length; i++) {
                if (SADebug.Lines[i].desc === val) {
                    SADebug.Lines[i].active = "0";
                }
            }
        });
    }

    SADebug.RemoveAllDrawLine();
    SADebug.DrawLines();
}

function toggleInputList4Debug4Selectedfield(el) {
    SADebug.RemoveAllDrawLine();
    $('.debugInputListCheckbox4Selectedfield').each(function () {
        var elm = $(this);
        if (elm.is(':checked')) {
            try {
                var inputId = elm.attr('actionId');
                var compId = 'comp_id_' + inputId;
                var selectedFields = $('#' + compId).attr('sa-selectedfield').split(',');
                for (var i in selectedFields) {
                    var field = selectedFields[i].trim();
                    if (field.length > 0) {
                        var fromId = compId;

                        var toId = '';
                        $('.api-io-list-zad[idx=' + field + ']').each(function () {
                            toId = $(this).attr('id');
//                            showParentDivOfEsasApi(document.getElementById(toId));

                            var oldTop = $('#gui_component_main_view').scrollTop();
                            var oldLeft = $('#gui_component_main_view').scrollLeft();

                            $('#gui_component_main_view').scrollTop(0);
                            $('#gui_component_main_view').scrollLeft(0);

                            SADebug.JustLine4SelecedField(fromId, toId, field);

                            $('#gui_component_main_view').scrollTop(oldTop);
                            $('#gui_component_main_view').scrollLeft(oldLeft);
                        })
                    }
                }
            } catch (err) {
            }

        }
    })
}

function showParentDivOfEsasApi(el) {
    $(el).show();
    $(el).parents('div.sa-api-esas').each(function () {
        $(this).show();
        showParentDivOfEsasApi(this);
    })
}

function hideParentDivOfEsasApi(el) {
    $(el).hide();
    $(el).parents('div.sa-api-esas').each(function () {
        hideParentDivOfEsasApi(this);
    })
}

function showChildDivOfEsasApi(el) {
    return;

    $(el).show();
    $(el).find('div.sa-api-esas').each(function () {
        showChildDivOfEsasApi(this);
    })
}

var hideOlacaqEsasDivler = [];

function hideChildDivOfEsasApi(elId) {
//    $(el).hide();

    console.log(elId, ' hide oldu');

    $('#' + elId).hide();

    $('#' + elId).find('.sa-api-esas').each(function () {
//       $(this).html('kelbetin');

        var idZad = $(this).attr('id');
        hideChildDivOfEsasApi(idZad);
    })

}




function deleteUpdatedBacklogStorageInfo(bid) {

    var bid1 = (bid) ? bid : global_var.current_backlog_id;

    var json = initJSON();
    json.kv.fkBacklogId = bid1;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteUpdatedBacklogStorageInfo",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {

        }
    });
}


function getUnloadedBacklogListOnInit() {
//    getBacklogProductionStorageInfo
    var idx = 100;
    var toBeDownloadedBacklog = [];
    var overallSentBacklogs = [];
    var availableBacklogList = Object.keys(backlog_last_modification);
    for (var k in availableBacklogList) {
        var ky = availableBacklogList[k];
        if (ky) {
            var lastModificationDateAndTime = backlog_last_modification[ky];
            var localModDateAndTime = '';
            try {
                localModDateAndTime = localStorage.getItem('idb_' + ky);
            } catch (err) {
            }
            ;


//            console.log('1.', ky, '  -> upload', lastModificationDateAndTime)
//            console.log('2.', ky, '  -> current', localModDateAndTime)

            if (lastModificationDateAndTime !== localModDateAndTime) {
                if (!overallSentBacklogs.includes(ky)) {
                    overallSentBacklogs.push(ky);
                    toBeDownloadedBacklog.push(ky);
                }
            }

            if (toBeDownloadedBacklog.length >= idx) {
                loadMissedBacklogsListFromStorage(toBeDownloadedBacklog.toString());
                toBeDownloadedBacklog = [];
            }
        }
    }

//    console.log('string=', toBeDownloadedBacklog.toString());
    loadMissedBacklogsListFromStorage(toBeDownloadedBacklog.toString());
}


function loadMissedBacklogsListFromStorage(bid) {

    var bid1 = (bid) ? bid : global_var.current_backlog_id;
    
//    console.log('========================================')
//     console.log('========================================')
//console.log('missed backlog id=',bid)
// console.log('========================================') 
// console.log('========================================')
 
    if (!bid1){
        return;
    }

    var json = initJSON();
    json.kv.fkBacklogId = bid1;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmLoadMissedBacklogsListFromStorage",
//        url: urlGl + "api/post/srv/serviceTmgetTestZadShey",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                var json = '';
                try {
                    json = JSON.parse(obj[i].json);
                    var idd = obj[i].id;
                    var transaction = db.transaction(["subdb"], "readwrite");
                    var store = transaction.objectStore("subdb");
                    store.delete('idb_' + idd);
                    store.add({'bid': 'idb_' + idd, 'json': json});

                    localStorage.setItem('idb_' + idd, json.kv.modificationTime);
                    SAInput.LoadedBacklogs4Input.push(idd);
                    loadBacklogProductionDetailsById_resparams(json);
                    
                    try{
                        //Bezen ele hallar olur ki, pr_xxx. faylindaki last modification ile
                        //backlog modicationTime ferqli olur.Bu halda hemin backlog yeniden upload edilmelidir
                        //
                        if (backlog_last_modification[idd]!==json.kv.modificationTime){
                            loadBacklogProductionDetailsById(idd);
                        }
                        }catch(err){}
                } catch (err) {
                    console.log(err);
                }


            }
        }
    });
}


function  reloadBacklogListOnStoryCard() {
    $('.projectList_liveprototype_storycard').change();
}


function updateBacklogName() {

    var val = $('#updateUserStoryPopupModal-userstoryname').val();
    if (!val) {
        return;
    }


    var json = initJSON();
    json.kv.id = global_var.current_backlog_id;
    json.kv.backlogName = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateBacklog",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadCurrentBacklogProdDetailsSyncrone();
            if (global_var.current_modal === 'loadLivePrototype') {
                callStoryCardAfterIPOAction();
            } else if (global_var.current_modal === 'loadStoryCard') {
                reloadBacklogListOnStoryCard();
            }
        },
        error: function () {
//                Toaster.showError("error");
        }
    });
}

function runApiOnStoryCard() {
    var fkBacklogId = global_var.current_backlog_id;
    global_var.runApiOnStoryCard = 1;
    var out = be.callApi(fkBacklogId, {});
    var html = $('<span>').css('white-space', 'pre')
            .css('font-family', 'monospace')
            .css("width", "200px")
            .text(JSON.stringify(out, null, "  "))
//    alert(JSON.stringify(out));
    generatePopupModalNew($('<div>').append(html).html());
}

function testApiOnStoryCard() {
    $('#apiIntegrationModal').modal('show');
    $('#apiIntegrationModal_method').selectpicker('refresh');
}

function sendApiIntegrationForTest() {

    var url = $('#apiIntegrationModal_urllink').val();
    var method = $('#apiIntegrationModal_method').val();
    var content = $('#apiIntegrationModal_body').val();
    var contentType = $('#apiIntegrationModal_contenttype').val();


    var json = initJSON();

    json.kv.url = url;
    json.kv.method = method;
    json.kv.content = content;
    json.kv.contentType = contentType;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmSendApiIntegrationForTest",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {

        },
        error: function (err) {
            Toaster.showError(JSON.stringify(err));
        }
    });
}

function beautifyApiIntegrationContent() {

}

function getFnBodyZadPush(line, startIndex) {

    var lastIndex = line.indexOf('}',startIndex);
    var idx = getFnBodyZadIteration(line, startIndex+1, lastIndex,1,0);
    return idx;
//    var out = line.substr(startIndex + 1, (idx - startIndex -1));
//    console.log(out);
}


function getFnBodyZadIteration(line, startIndex, lastIndex, iterationCount, paranCount) {
    try {


        var cmd = line.substr(startIndex , (lastIndex - startIndex+1));
        var argLine = (line && line !== 'undefined') ? cmd.trim() : '';
        var numberOfParthBetweenIndexes = argLine.split('{').length - 1;
        numberOfParthBetweenIndexes = (numberOfParthBetweenIndexes < 0) ? 0
                : numberOfParthBetweenIndexes;

        paranCount = +numberOfParthBetweenIndexes;

//        if (numberOfParthBetweenIndexes === 0) {
//            return lastIndex + 1;
//        }
        if ((numberOfParthBetweenIndexes===0) && (iterationCount * 2 >= paranCount)) {
            return lastIndex + 1;
        }

        var indTmp = lastIndex ;
        for (var i = 0; i < numberOfParthBetweenIndexes; i++) {
            var intTempTT = indTmp;
            indTmp = line.indexOf('}', indTmp+1);
//            if (indTmp <= 0) {
//                indTmp = intTempTT;
//            }
        }

        iterationCount++;
        return getFnBodyZadIteration(line, lastIndex+1, indTmp, iterationCount, paranCount);
    } catch (err) {
    }
}