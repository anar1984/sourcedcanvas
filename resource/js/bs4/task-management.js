const taskManagement = {

    insertTask: {

        insertNewTask: function () {
             var data  = this.getValueCreateModalScreen();
                         this.insertNewTaskApi(data);
        },
        insertNewTaskApi: function (dataCore) {
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
                    that.insertEventByTaskId(res.kv.id);
                    getBugList();
                    Toaster.showMessage('Tapşırıq uğurla daxil edilmişdir');
                },
                error: function () {
                    Toaster.showError(('Tapşırıq daxil edilmədi'));
                }
            });
        },
        getValueCreateModalScreen:function () {
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
            
            return data;
        },
        insertEventByTaskId: function (id) {

            var json = initJSON();
            json.kv.fkTaskId = id;
            json.kv.mezmun = $('#ivent-mezmun').val();
            json.kv.struktur = $('#ivent-struktur').val();
            json.kv.nov = $('#ivent-nov').val();
            json.kv.mesulShexs = $('#ivent-mesulShexs').val();
            json.kv.istirakci = $('#ivent-istirakci').val();
            json.kv.kontragent = $('#ivent-kontragent').val();
            json.kv.yer = $('#ivent-yer').val();
            json.kv.qeyd = $('#ivent-qeyd').val();


            // json.kv.filename = zipfilename;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceRsCreateBacklogTaskEvent",
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
                        msgMessage = 'Events successfully created!';
                        Toaster.showMessage(msgMessage);
                    }

                },
                error: function () {
                    Toaster.showError(('API error'));

                }
            });
        },
        insertObserverTask: function (taskId) {
            
               var userList  = 
            callService('serviceTminsertTaskObserver',
            {"fkTaskId": taskId,
                "fkUserId":userList }, true
            , function () {
                getTaskkObserverList(global_var.current_task_id_4_comment)
            }); 
        }
          

    }
}