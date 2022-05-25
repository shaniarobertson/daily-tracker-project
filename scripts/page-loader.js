/*
  Assignment: Week 7 Lab - JS for DailyTracker
  Author: Shania Robertson
  Date: 05/01/2022
  Purpose: To provide the functionality pre-loading information when certain
    pages are loaded
  Credit: This is based on the Thyroid App in Chapter 6 and James 
    Sekcienski's adaptation
*/

/*
  Add an on pageshow handler for the document so that when a page is made
  active, it will pre-load any necessary information
*/
$(document).on("pageshow", function() {
  const activePageId = $(".ui-page-active").attr("id")
  if (activePageId == "page-user-info") {
    showUserForm();
  } else if (activePageId == "page-records") {
    loadUserInformation();
    listRecords();
  } else if (activePageId == "page-advice") {
    showAdvice();
    resizeGraph();
  } else if (activePageId == "page-graph") {
    showGraph();
    resizeGraph();
  }
});

/*
  resizeGraph will check if the width of the window is less than 700px.  If it
  is then it will change the width of the advice canvas and graph canvas to be
  75px smaller than the window width
*/
function resizeGraph() {
  if ($(window).width() < 700) {
    $("#canvas-advice").css({"width": $(window).width() - 75});
    $("#canvas-graph").css({"width": $(window).width() - 75});
  }
}