$(document).ready(function () {



    $(document).on("click", "#btnApiControl", function () {
        SourcedActivityDiagram.Filter.ToggleAPICards(this);

    })

    $(document).on("change", "#btnActiveSCControl", function () {
        SourcedActivityDiagram.Filter.ToggleOnlyActiveStoryCards(this);
    })

    $(document).on("change", "#btnEntityControl", function () {
        SourcedActivityDiagram.Filter.ToggleEntityCards(this);
    })

    $(document).on("change", "#btnStoryCardsControl", function () {
        SourcedActivityDiagram.Filter.ToggleStoryCards(this);
    })

    $(document).on("change", "#btnCardDetailsControl", function () {
//        $('#btnScreenControl').prop("checked", false);
        SourcedActivityDiagram.Filter.ToggleCardDetails(this);
    })

    $(document).on("change", "#btnScreenControl", function () {
//        $('#btnCardDetailsControl').prop("checked", false);
        SourcedActivityDiagram.Filter.ToggleShowScreens(this);
    })



})
