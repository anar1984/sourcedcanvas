$(document).ready(function () {
    function getTask(StoryInputVal) {
        return $("<div>")

                .addClass("task-content content-drag")
                .append($("<div>")
                        .addClass("task-content-header")
                        .append($("<div>")
                                .addClass("TaskContentText")
                                .append($('<span class="isFromCustomer "></span>')
                                        .append($('<a href="#" onclick="new UserStory().redirectToDetailedView( o.id )" class="headerContentText"></a>')
                                                .text(StoryInputVal))
                                        )
                                )
                        .append($("<div>")
                                .addClass("content-header-edit ")
                                .append($('<a class="btn dropdown-toggle-task-content">')
                                        .attr('href', "#")
                                        .attr('role', "button")
                                        .attr('id', "dropdownMenuLink")
                                        .attr('data-toggle', "dropdown")
                                        .attr('aria-haspopup', "true")
                                        .attr('aria-expanded', "false")
                                        .append($('<i class="fas fa-ellipsis-h"></i>')))
                                .append($('<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">')
                                        .append($('<a class="dropdown-item Content-delete" href="#">')
                                                .append('Delete'))
                                        )
                                )
                        )
                .append($("<div>").addClass("taskContentBody")
                        .append($('<span class="backlog-status">')
                                .append('<div class="us-list-item   us-item-status- "></div>'))
                        .append($('<span class="us-list-item us-priority">'))
                        .append($('<span class="us-list-item   us-item-executor">'))
                        .append($('<span class="us-list-item   us-item-date">'))
                        .append($('<span class="us-list-item   us-item-date">')
                                .append('&nbsp;&nbsp;&nbsp;<b></b>'))
                        .append('&nbsp;<i href="#" class="fa fa-info-circle" data-toggle="modal" data-target="#backlogTaskInfoModal" title="User Story Task Info" \n\
                          style="cursor:pointer;color:#33adff;" onclick="new UserStory().backlogTaskInfoModal(\ \)"></i>'));


    }


    //mini card
    $(document).on("click", "#TaskAcceptStory", function (e) {
        let StoryInputTask = $(this).parent().find(".TaskMiniStoryInput").val()
        if (StoryInputTask.trim().length > 0) {
            $(this).parent().parent().find(".task-column-body").append(getTask(StoryInputTask))
            $(this).parent().css("display", "none")
            $(this).parent().find(".TaskMiniStoryInput").val("");
            try {
                $('.content-drag').arrangeable()
            } catch (er) {
            }
        }
    })

    $(document).on("click", ".CardContentAdd", function (e) {
        $(this).parent().find(".TaskMiniStoryCard").toggle().css("display", "block")
    })

    $(document).on("click", "#DeleteStory", function (e) {
        $(this).parent().css("display", "none")
        $(this).parent().find(".TaskMiniStoryInput").val("");
    })

//user story
    let boal = true
    $(document).on("click", ".userStory-header1,.downUser", function () {

        if (boal) {
            $(this).parent().find(".angle-right").css("display", "none")
            $(this).parent().find(".angle-down").css("display", "block")
            $(this).parent().parent().find(".task-column").css("display", "block")
            boal = false
        } else {
            $(this).parent().find(".angle-right").css("display", "block")
            $(this).parent().find(".angle-down").css("display", "none")
            $(this).parent().parent().find(".task-column").css("display", "none")
            boal = true
        }


    })

//card user story 

    $(document).on("dblclick", ".card-UserStory-header-text", function () {
        $(this).parent().find(".card-UserStory-header-edit").css("display", "block")
        let Namestory = $(this).parent().parent().find(".card-UserStory-header-text").text()
        $(this).parent().find(".card-UserStory-header-input").val(Namestory)
    })


    $(document).on("click", "#AcceptText", function (e) {
        let InputText = $(this).parent().find(".card-UserStory-header-input").val()
        if (InputText.trim().length > 0) {
            $(this).parent().parent().find(".card-UserStory-header-text").text(InputText)
            $(this).parent().find(".card-UserStory-header-input").val("")
            $(this).parent().css("display", "none")
        }
    })

    $(document).on("click", "#DeleteText", function (e) {
        $(this).parent().css("display", "none")
    })


// addpeople     

    $(document).on("click", ".Addpeople-icon", function () {

        $(".addpeoplezone1").css("transition", "visibility 2s, opacity 2s linear;")
        $(".addpeoplezone1").css("display", "block")


    })
    $(document).on("click", ".deletepeople", function () {

        $(".addpeoplezone1").css("display", "none")


    })

    $(document).on("click", ".acceptpeople", function () {

        let peopleVal = $(this).parent().parent().find(".peoplename").val()

        if (peopleVal.trim().length > 0) {
            let peoplecontent = `<a class="dropdown-item" href="#"> <input type="checkbox"> ${peopleVal}</a>`
            let userstorycontent = ` <div class="UserStory">
         <div class="userStory-header sticky-top col-12">
             <div class="downUser angle-right" style="display: none;"><i class="fas fa-angle-right"></i></div>
             <div class="downUser angle-down" > <i class="fas fa-angle-down"></i></div>
         
             <span style="margin-right: 10px;">${peopleVal}</span> 
             <span class="backlog-status"><div class="us-list-item   us-item-status-new "> new </div></span>
         </div>
         <div class="task-column new" >

             <div class="task-column-body task_main_div_of_backlog_info_kanban_view_table_new" id="new">
                <div draggable="true" class="content-drag"></div>  
               
        

             </div>
             <div class="TaskMiniStoryCard">
                 <h5>New Task</h5>
                 <input  class="TaskMiniStoryInput form-control" type="text">
                 <div class="TextHeader " id="TaskAcceptStory" style="color: green;">
                     <i class="fas fa-check" ></i>
                     
                 </div>
                 <div class="TextHeader " id="DeleteStory" style="color: red;">
                     <i class="fas fa-times"></i> 
                 </div>
             </div>
             <div class="CardContentAdd">
                 <img class="contentAdImg" src="resource/img/plus-icon.png" alt="">
            </div>
         </div>
         <div class="task-column on-going" >

             <div class="task-column-body task_main_div_of_backlog_info_kanban_view_table_new" id="new">
                <div draggable="true" class="content-drag"></div>  
               
        

             </div>
             <div class="TaskMiniStoryCard">
                 <h5>New Task</h5>
                 <input  class="TaskMiniStoryInput form-control" type="text">
                 <div class="TextHeader " id="TaskAcceptStory" style="color: green;">
                     <i class="fas fa-check" ></i>
                     
                 </div>
                 <div class="TextHeader " id="DeleteStory" style="color: red;">
                     <i class="fas fa-times"></i> 
                 </div>
             </div>
             <div class="CardContentAdd">
                 <img class="contentAdImg" src="resource/img/plus-icon.png" alt="">
            </div>
         </div>
         <div class="task-column closed" >

             <div class="task-column-body task_main_div_of_backlog_info_kanban_view_table_new" id="new">
                <div draggable="true" class="content-drag"></div>  
               
        

             </div>
             <div class="TaskMiniStoryCard">
                 <h5>New Task</h5>
                 <input  class="TaskMiniStoryInput form-control" type="text">
                 <div class="TextHeader " id="TaskAcceptStory" style="color: green;">
                     <i class="fas fa-check" ></i>
                     
                 </div>
                 <div class="TextHeader " id="DeleteStory" style="color: red;">
                     <i class="fas fa-times"></i> 
                 </div>
             </div>
             <div class="CardContentAdd">
                 <img class="contentAdImg" src="resource/img/plus-icon.png" alt="">
            </div>
         </div>
       </div> `

            $(".epic-dropdown").append(peoplecontent)
            $(".groupByUserstory").append(userstorycontent)

            $(".addpeoplezone1").css("display", "none")
            $(this).parent().parent().find(".peoplename").val("")
        }



    })
    $(document).on("click", ".task-card-UserStory-edit-exit", function (e) {
        $(document).find(".TaskStoryCardPanel").css("display", "none")

        global_var.current_issue_is_hide = "1";
        Utility.addParamToUrl('current_issue_is_hide', global_var.current_issue_is_hide);

        global_var.current_issue_id = "";
        Utility.addParamToUrl('current_issue_id', global_var.current_issue_id);

        if (global_var.current_modal === 'loadTaskManagement') {
            genTaskKanbanView();
        } else if (global_var.current_modal === 'loadBugChange') {
            getBugList();
        }
    })


    $(document).on("click", ".Assigne-card-story-select", function () {

        $(".Assigne-card-story-search").css("display", "block")
        $(".Assigne-card-story-select-content").css("display", "block")



    })



    $(document).on("click", ".Assigne-content-user", function (event) {
        event.stopPropagation()
        $(this).parent().css("display", "none");
        $(this).parent().parent().find(".Assigne-card-story-search").css("display", "none");

        $('#task-mgmt-assignee').find('img').attr("src", $(this).find('img').first().attr("src"));
        $("#task-mgmt-assignee").find('span').html($(this).find('span').first().html())

        var id = $(this).attr('pid');
        updateTask4ShortChangeDetails(id, 'fkAssigneeId')
    })

    $(document).on("click", ".owner-content-user", function (event) {
        event.stopPropagation()
        $(this).parent().css("display", "none");
        $(this).parent().parent().find(".Assigne-card-story-search").css("display", "none");

        $('#story-card-owner').find('img').attr("src", $(this).find('img').first().attr("src"));
        $("#story-card-owner").find('span').html($(this).find('span').first().html())

        var id = $(this).attr('pid');
        updateUS4ShortChangeDetails(id, 'fkOwnerId')
    })


// add comment 
    $(document).on("click", ".acceptcomment", function (e) {

//        let  currentdate = new Date();
//        var datetime = " " + currentdate.getDay() + "." + currentdate.getMonth()
//                + "." + currentdate.getFullYear() + ", "
//                + currentdate.getHours() + ":"
//                + currentdate.getMinutes();
//        let cominputval = $(this).parent().parent().find(".commentinput").val()
//
//        let commentcontent = `<div class="comment-content">
//                   
//   <div class="comment-content-header">
//      <div class="image-user">
//          <img id="comment-img" src="resource/img/rev.png" alt="">
//            </div>
//            
//       <span class="comment-content-header-name">Revan</span>
//       <span class="comment-content-header-history">${datetime}</span>
//    
//   </div>
//   <div class="comment-content-body">
//       <span>${cominputval}</span>
//      </div>
//   <div class="comment-content-footer">
//       <span class="comment-content-footer-edit">Edit</span>
//       <span class="comment-content-footer-delete">Delete</span>
//   </div>
//</div>`
//
//
//        if (cominputval.trim().length > 0) {
//            $(this).parent().parent().parent().find(".comment-body").append(commentcontent)
//            $(this).parent().parent().find(".commentinput").val("")
//            $('.comment-content').animate({scrollTop: $('.comment-content').height()}, 1000)
//        }


    })
    $('.commentinput').keyup(function (e) {
        return;
        if (e.keyCode == 13)
        {
            let  currentdate = new Date();
            var datetime = " " + currentdate.getDay() + "." + currentdate.getMonth()
                    + "." + currentdate.getFullYear() + ", "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes();
            let cominputval = $(this).parent().parent().find(".commentinput").val()

            let commentcontent = `<div class="comment-content">
                       
       <div class="comment-content-header">
          <div class="image-user">
              <img id="comment-img" src="resource/img/rev.png" alt="">
                </div>
                
           <span class="comment-content-header-name">Revan</span>
           <span class="comment-content-header-history">${datetime}</span>
        
       </div>
       <div class="comment-content-body">
           <span>${cominputval}</span>
          </div>
       <div class="comment-content-footer">
           <span class="comment-content-footer-edit">Edit</span>
           <span class="comment-content-footer-delete">Delete</span>
       </div>
    </div>`


            if (cominputval.trim().length > 0) {
                $(this).parent().parent().parent().find(".comment-body").append(commentcontent)
                $(this).parent().parent().find(".commentinput").val("")
                $('.comment-content').animate({scrollTop: $('.comment-content').height()}, 1000)
            }
        }
    });



    $('.TaskMiniStoryInput').keyup(function (e) {

        if (e.keyCode == 13)
        {
            let StoryInputVal = $(this).parent().find(".TaskMiniStoryInput").val()
            if (StoryInputVal.trim().length > 0) {

                $(this).parent().parent().find(".task-column-body").append(getTask(StoryInputVal))

                $(this).parent().css("display", "none")

                $(this).parent().find(".TaskMiniStoryInput").val("");
                try {

                    $('.content-drag').arrangeable()
                } catch (er) {
                }

            }
        }
    });

    $(document).on("dblclick", ".TaskContentText", function () {
//        $('#taskMgmtModal').modal("show");

        let headerText = $(this).find('span.headerContentText').text();
        $(".card-UserStory-header-text").text("");
        $(".card-UserStory-header-text").append(headerText);
        $(".TaskStoryCardPanel").css("display", "block")
        $('.comment-body').html("")

        var id = $(this).attr('pid');

        loadTaskCardDetails(id);


    })




    $(document).on("click", ".comment-content-footer-delete", function () {

        if (confirm("Are you sure?!")) {
            $(this).parent().parent().remove()
        } else {

        }


    })
    $(document).on("click", ".deletecomment", function () {
        $("#cke_commentinput").remove()
        $(".commentinput").css("display", "block")
        $(".commentinput").css("visibility", "visible")

        setTimeout(function () {
            $(".commentsubmit-seqment").css("display", "none")
            $(".commentinput").css("height", "")
        }, 300)
    })

    $(document).on("focusin", ".commentinput", function () {
        $(".commentsubmit-seqment").css("display", "flex")
        $(".commentinput").css("height", "6rem")
    })
    $(document).on("focusout", ".commentinput", function () {
        return;
        setTimeout(function () {
            $(".commentsubmit-seqment").css("display", "none")
            $(".commentinput").css("height", "")
        }, 300)



    })



//add description
    $(document).on("click", ".descriptonBody", function () {
        $(".Descriptionsubmit-seqment").css("display", "flex")
        $(this).css("display", "none")
    })

    $(document).on("click", ".deleteDescription", function () {
        $(".Descriptionsubmit-seqment").css("display", "none")
        $(".descriptonBody").css("display", "block")
    })

    $(document).on("focusout", "#task-info-modal-description1", function () {
        $(".Descriptionsubmit-seqment").css("display", "none")
        $(".descriptonBody").css("display", "block")
    })



    $(document).on("click", ".acceptDescription", function () {
        updateTask4ShortChange($('#task-info-modal-description'), 'taskDescription');
        let descriptioninput = $(this).parent().parent().find(".descriptonInput").val()

        if (descriptioninput.trim().length > 0) {
            $(".descriptonBody").empty()
            $(".descriptonBody").append(MapTextAreaHtml(replaceTags(descriptioninput)))

        } else {
            $(".descriptonBody").empty()
            $(".descriptonBody").append("Add description...")
        }

        $(".Descriptionsubmit-seqment").css("display", "none")
        $(".descriptonBody").css("display", "block")
    })


// serach
    $("#searchinput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".task-column .task-content").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#epicsearchinput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".groupByUserstory .UserStory").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#epicsearchinput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".epic-dropdown ").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

//file uploAD

    $("#open_btn").click(function () {


        $.FileDialog({

            // MIME type of accepted files, e. g. image/jpeg
            accept: "*",

            // cancel button
            cancelButton: "Close",

            // drop zone message
            dragMessage: "Drop files here",

            // the height of drop zone in pixels
            dropheight: 400,

            // error message
            errorMessage: "An error occured while loading file",

            // whether it is possible to choose multiple files or not.
            multiple: true,

            // OK button
            okButton: "OK",

            // file reading mode.
            // BinaryString, Text, DataURL, ArrayBuffer
            readAs: "DataURL",

            // remove message
            removeMessage: "Remove&nbsp;file",

            // file dialog title
            title: "Load file(s)"

        })
                // handle files choice when done
                .on('files.bs.filedialog', function (ev) {
                    var files_list = ev.files;
                    // DO SOMETHING
                });


        // handle dialog cancelling
        on('cancel.bs.filedialog', function (ev) {
            // DO SOMETHING
        });


    })


//textarea scrol none

    function auto_grow(element) {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
    }


// category 
    $(document).on("click", ".assignee", function () {
        global_var.task_mgmt_group_by = "assignee";
        $(".categorybtn").empty()
        $(".categorybtn").append('<span class="category" >Assignee</span>')
        $(".column-body-none").css("display", "none")
        $(".groupByUserstory").css("display", "block");
        genTaskKanbanView();
    })
    $(document).on("click", ".none", function () {
        $(".categorybtn").empty()
        global_var.task_mgmt_group_by = "none";
        $(".categorybtn").append('<span class="category" >None</span>')
        $(".column-body-none").css("display", "")
        $(".groupByUserstory").css("display", "none")
        genTaskKanbanView();
    })
    $(document).on("click", ".userStoryTab2", function () {
        global_var.task_mgmt_group_by = "userStoryTab";
        $(".categorybtn").empty()
        $(".categorybtn").append('<span class="category" >User Story</span>')
        $(".column-body-none").css("display", "none")
        $(".groupByUserstory").css("display", "block");
        genTaskKanbanView();
    })



    function selected() {
        const cells = document.querySelectorAll(".content-drag");
        let lastClicked;

        function handleClick(e) {
            // Toggle class active
            if (e.target.classList.contains("active")) {
                e.target.classList.remove("active");
            } else {
                e.target.classList.add("active");
            }

            // Check if CTRL key is down and if the clicked cell has aready class active
            let inRange = false;
            if (e.ctrlKey && this.classList.contains("active")) {
                // loop over cells
                cells.forEach(cell => {
                    // check for the first and last cell clicked
                    if (cell === this || cell === lastClicked) {
                        // reverse inRange
                        inRange = !inRange;
                    }
                    // If we are in range, add active class
                    if (inRange) {
                        cell.classList.add("active");
                    }
                });
            }
            // Mark last clicked
            lastClicked = this;
        }

        cells.forEach(cell => cell.addEventListener("click", handleClick));
    }


})


function getTaskCode(taskId) {
    try {
        var orderSeq = SATask.GetDetails(taskId, 'orderNoSeq');
        var projectId = SATask.GetDetails(taskId, 'fkProjectId');
        var projectCode = SACore.GetProjectCore(projectId).projectCode;
        projectCode = projectCode.toUpperCase();

        var taskId = (orderSeq)
                ? (replaceTags(projectCode)) ? replaceTags(projectCode) + "-" + orderSeq : orderSeq : "";
        taskId = "<b>" + taskId + "</b>";
        return taskId;
    } catch (err) {
        return ""
    }
}

function loadTaskCardDetails(taskId) {
    var id = taskId;
    global_var.current_us_task_id = id;

    $(".card-UserStory-header-text-code").text("");
    $(".card-UserStory-header-text-code").append(getTaskCode(id));


    $(".card-UserStory-header-text").text("");
    $(".card-UserStory-header-text").append(replaceTags(SATask.GetDetails(id, 'taskName')));
    $('.comment-body').html("")


    $('#task-info-modal-status').val(replaceTags(SATask.GetDetails(id, 'taskStatus')));
    $('.task-info-modal-status').each(function () {
        $(this).val(replaceTags(SATask.GetDetails(id, 'taskStatus')));
    })

    $('#task-info-modal-priority').val(replaceTags(SATask.GetDetails(id, 'taskPriority')));
    $('.task-info-modal-priority').each(function () {
        $(this).val(replaceTags(SATask.GetDetails(id, 'taskPriority')));
    })
    $('#task-info-modal-priority').selectpicker('refresh');

    $('.taskEstimationHoursInput').val(replaceTags(SATask.GetDetails(id, 'estimatedHours')));
    $('.taskSpentHoursInput').val(replaceTags(SATask.GetDetails(id, 'spentHours')));

    $('.taskEstimatedCounterInput').val(replaceTags(SATask.GetDetails(id, 'estimatedCounter')));
    $('.taskExecutedCounterInput').val(replaceTags(SATask.GetDetails(id, 'executedCounter')));
    $('.taskEstimatedBudgetInput').val(replaceTags(SATask.GetDetails(id, 'estimatedBudget')));
    $('.taskSpentBudgetInput').val(replaceTags(SATask.GetDetails(id, 'spentBudget')));


    $('#task-info-modal-tasktype').val(replaceTags(SATask.GetDetails(id, 'fkTaskTypeId')));
    $('.task-info-modal-tasktype').each(function () {
        $(this).val(replaceTags(SATask.GetDetails(id, 'fkTaskTypeId')));
    })


    $('#task-info-modal-nature').val(replaceTags(SATask.GetDetails(id, 'taskNature')));
    $('.task-info-modal-nature').each(function () {
        $(this).val(replaceTags(SATask.GetDetails(id, 'taskNature')));
    })

    $('#task-info-modal-description').val(replaceTags(SATask.GetDetails(id, 'taskDescription')));
    $('.task-info-modal-description').each(function () {
        $(this).val(replaceTags(SATask.GetDetails(id, 'taskDescription')));
    })


    $('.descriptonBody').html(MapTextAreaHtml(replaceTags(SATask.GetDetails(id, 'taskDescription'))));


    var created_date = SATask.GetDetails(id,'closeStatusDate')
    $(".task_detail_created_date").text(Utility.convertDate(created_date));
    var created_time = SATask.GetDetails(id,'closeStatusTime')
    $(".task_detail_created_time").text(Utility.convertTime(created_time));


    var userStoryNo = SACore.GetBacklogKey(SATask.GetDetails(id, 'fkBacklogId'), "orderNo");
    var userStoryName = SACore.GetBacklogKey(SATask.GetDetails(id, 'fkBacklogId'), "backlogName");

    var blName = (userStoryNo)
            ? "#" + userStoryNo + " " + userStoryName
            : "";
    $('#task-mgmt-modal-user-story')
            .attr('pid', SATask.GetDetails(id, 'fkBacklogId')).html(blName);

    var assigneeId = SATask.GetDetails(id, 'fkAssigneeId')
    var userImage = SAProjectUser.GetDetails(assigneeId, "userImage");
    var userName = SAProjectUser.GetDetails(assigneeId, "userName");

    var img = (userImage)
            ? fileUrl(userImage)
            : fileUrl(new User().getDefaultUserprofileName());
    var userName1 = (userName)
            ? userName
            : ' Unassigned';

    $('#task-mgmt-assignee').find('img').attr('src', img);
    $('#task-mgmt-assignee').find('span').html(' ' + userName1);


    var createdBy = SATask.GetDetails(id, 'createdBy')
    var userImage4createdBy = SAProjectUser.GetUserDetails(createdBy, "userImage");
    var userName4createdBy = SAProjectUser.GetUserDetails(createdBy, "userPersonName");

    var img4 = (userImage4createdBy)
            ? fileUrl(userImage4createdBy)
            : fileUrl(new User().getDefaultUserprofileName());
    var userName4 = (userName4createdBy)
            ? userName4createdBy
            : ' Unassigned';

    $('#task-mgmt-created-by').find('img').attr('src', img4);
    $('#task-mgmt-created-by').find('span').html(' ' + userName4);


    var updateBy = SATask.GetDetails(id, 'updatedBy')
    var userImage4updateBy = SAProjectUser.GetUserDetails(updateBy, "userImage");
    var userName4updateBy = SAProjectUser.GetUserDetails(updateBy, "userPersonName");

    var img5 = (userImage4updateBy)
            ? fileUrl(userImage4updateBy)
            : fileUrl(new User().getDefaultUserprofileName());
    var userName5 = (userName4updateBy)
            ? userName4updateBy
            : ' Unassigned';

    $('#task-mgmt-update-by').find('img').attr('src', img5);
    $('#task-mgmt-update-by').find('span').html(' ' + userName5);



    setGlobalActiveCanvas(global_var.canvas.comment);

    genCommentListOfTask();

    loadAssignedLabel(SATask.GetDetails(id, 'fkBacklogId'), SATask.GetDetails(id, 'taskVersion'));

    //set parent task info
   getParentTask();
    
    //set child task list
     getChildTasks();
     
     //get sprint list;
     getSprintNamesByTask()

}
