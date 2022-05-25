/*
  Assignment: Week 7 Lab - JS for DailyTracker
  Author: Shania Robertson
  Date: 05/01/2022
  Purpose: To provide the functionality for loading information on the records
    page, adding new records, editing records, and deleting/clearing records.
  Credit: This is based on the Thyroid App in Chapter 6 and James 
    Sekcienski's adaptation
*/

/*
  loadUserInformation is going to try to get user from localStorage and load
  a summary of the information into the div-user-section element
*/
function loadUserInformation() {
    let user = null;
    user = JSON.parse(localStorage.getItem("user"));
  
    if (user != null) {
      $("#div-user-section").empty();
  
      $("#div-user-section").append(
        "<p>User's Name: " +
          user.FirstName +
          " " +
          user.LastName +
          "<br>New Password: " +
          user.Password +
          "<br>Long Term Goal: " +
          user.LongTerm +
          "<br>Short Term Goal " +
          user.ShortTerm +
          "</p>"
      );
      $("#div-user-section").append(
        "<a href='#page-user-info' data-mini='true' " +
          "id='btn-edit-profile' data-role='button' data-icon='edit' data-iconpos=" +
          "'left' data-inline='true'>Edit Profile</a>"
      );
      $("#btn-edit-profile").buttonMarkup();
    }
  }
  
  /*
    Add a click handler function to the btn-add-record element that will update the
    value of the btn-submit-record element to be "Add" and then refresh
  */
  $("#btn-add-record").click(function () {
    $("#btn-submit-record").val("Add");
    $("#btn-submit-record").button();
    $("#btn-submit-record").button("refresh");
  });
  
  /*
    Add an on pageshow handler function to the page-record-form element.  If we
    are adding a new record, then we will clear the form.  If we are editing a
    record, then it will pre-load the form with the saved information of the
    record we are editing.
  */
  $("#page-record-form").on("pageshow", function () {
    const formOperation = $("#btn-submit-record").val();
  
    if (formOperation == "Add") {
      clearRecordForm();
    } else if (formOperation == "Edit") {
      showRecordForm($("#btn-submit-record").attr("index-to-edit"));
    }
  });
  
  /*
    clearRecordForm will set the value of each input element on the
    page-record-form element to be ""
  */
  function clearRecordForm() {
    $("#data-date").val("");
    $("#data-sleep").val("");
    $("#data-activity").val("");
    $("#data-mood").val("");
  }
  
  /*
    checkRecordForm will check each user input element of the form on the
    Add New Record page.  If an element has an invalid value, it will alert the
    user and return false.  Otherwise, if they are all valid, it will return true
  */
  function checkRecordForm() {
    if ($("#data-date").val() == "") {
      alert("You need to enter a date.");
      return false;
    } else if ($("#data-sleep").val() == "") {
      alert("You need to enter an hours slept value.");
      return false;
    } else if ($("#data-study").val() == "") {
        alert("You need to select a study value.");
        return false;
    } else if ($("#data-mood").val() == "") {
        alert("You need to select a mood value.");
        return false;
    } else {
      return true;
    }
  }
  
  /*
    Add a submit form handler to the form-record element.  If the value of
    the btn-submit-record element is "Add", then we will add the record and
    change the page to page-records.  If the value is "Edit", then we will save
    the updated information for that record to tbRecords, change the page to
    page-records, and remove the attribute for index-to-edit.
  */
  $("#form-record").submit(function () {
    const formOperation = $("#btn-submit-record").val();
  
    if (formOperation == "Add") {
      if (addRecord()) {
        $.mobile.changePage("#page-records");
      }
    } else if (formOperation == "Edit") {
      if (editRecord($("#btn-submit-record").attr("index-to-edit"))) {
        $.mobile.changePage("#page-records");
        $("#btn-submit-record").removeAttr("index-to-edit");
      }
    }
  
    return false;
  });
  
  /*
    addRecord will check if the record form is completed properly.  If it is,
    then it will try to save the values of the input elements in the form
    to localStorage by adding them to the tbRecords key.  If it successfully
    adds the record and saves it to localStorage it returns true.  Otherwise,
    it will return false;
  */
  function addRecord() {
    if (checkRecordForm()) {
      const record = {
        Date: $("#data-date").val(),
        Sleep: $("#data-sleep").val(),
        Study: $("#data-study").find(":selected").text(), // gets value of selected option
        Mood: $("#data-mood").find(":selected").text() // gets value of selected option
      };
  
      try {
        let tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  
        if (tbRecords == null) {
          tbRecords = [];
        }
  
        tbRecords.push(record);
        tbRecords.sort(compareDates);
        localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
        alert("Saving Information");
        clearRecordForm();
        listRecords();
  
        return true;
      } catch (e) {
        if (window.navigator.vendor === "Google Inc.") {
          if (e === DOMException.QUOTA_EXCEEDED_ERR) {
            alert("Error: Saving to local storage.");
          }
        } else if (e === QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
  
        console.log(e);
  
        return false;
      }
    } else {
      return false;
    }
  }
  
  /*
    listRecords will try to get tbRecords from localStorage.  If it exists, then
    it will fill in a sorted table of all the records in tbRecords.  It will be
    the tbl-records element that gets updated.
  */
  function listRecords() {
    let tbRecords = null;
    tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  
    if (tbRecords != null) {
      tbRecords.sort(compareDates);
  
      // initialize the table
      $("#tbl-records").html(
        "<thead>" +
          "  <tr>" +
          "    <th>Date</th>" +
          "    <th>Hours Slept</th>" +
          "</th>" +
          "    <th>Studied?</th>" +
          "    <th>Mood</th>" +
          "    <th>Edit / Delete</th>" +
          "  </tr>" +
          "</thead>" +
          "<tbody>" +
          "</tbody>"
      );
  
      // insert each record into the table
      for (let i = 0; i < tbRecords.length; i++) {
        const rec = tbRecords[i];
        $("#tbl-records tbody").append(
          "<tr>" +
            "  <td>" +
            rec.Date +
            "</td>" +
            "  <td>" +
            rec.Sleep +
            "</td>" +
            "  <td>" +
            rec.Study +
            "</td>" +
            "  <td>" +
            rec.Mood +
            "</td>" +
            "  <td><a data-inline='true' data-mini='true' data-role='button'" +
            "href='#page-record-form' onclick='callEdit(" +
            i +
            ");' " +
            "data-icon='edit' data-iconpos='notext'></a>" +
            "    <a data-inline='true' data-mini='true' data-role='button' " +
            "href='#' onclick='callDelete(" +
            i +
            ");' data-icon='delete' " +
            "data-iconpos='notext'></a></td>" +
            "</tr>"
        );
      }
  
      $("#tbl-records [data-role='button']").buttonMarkup();
    } else {
      $("#tbl-records").html("");
    }
    $("#tbl-records").table();
    $("#tbl-records").table("refresh");
  }
  
  /*
    compareDates will take in two record values.  If the first record's date value is
    greater than the second it will return 1.  Otherwise, it returns -1.
  */
  function compareDates(record1, record2) {
    const date1 = new Date(record1.Date);
    const date2 = new Date(record2.Date);
  
    if (date1 > date2) {
      return 1;
    } else {
      return -1;
    }
  }
  
  /*
    Add a click event handler to the btn-clear-history element.  This will remove
    tbRecords from localStorage, call listRecords again, and alert the user
    to them them know the records have all been deleted.
  */
  $("#btn-clear-history").click(function () {
    localStorage.removeItem("tbRecords");
    listRecords();
    alert("All records have been deleted.");
  });
  
  /*
    callDelete takes in an index representing the index of the record to remove
    from tbRecords in the localStorage.  It will delete that record from local
    storage and call listRecords to display the updated tbRecords.
  */
  function callDelete(index) {
    deleteRecord(index);
    listRecords();
  }
  
  /*
    deleteRecord takes in an index of the record to remove from tbRecords in the
    localStorage.  It will remove this record and update the value of tbRecords
    in localStorage.  If tbRecords no longer has any records, it will be removed
    from localStorage.
  */
  function deleteRecord(index) {
    try {
      const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  
      tbRecords.splice(index, 1);
  
      if (tbRecords.length == 0) {
        localStorage.removeItem("tbRecords");
      } else {
        localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      }
    } catch (e) {
      if (window.navigator.vendor === "Google Inc.") {
        if (e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
  
      console.log(e);
    }
  }
  
  /*
    callEdit takes in an index of a record in tbRecords to update.  It will set
    the attribute index-to-edit on the btnSumbitRecord element to the given index.
    It will also set the value to Edit and refresh the button.
  */
  function callEdit(index) {
    $("#btn-submit-record").attr("index-to-edit", index);
    $("#btn-submit-record").val("Edit");
    $("#btn-submit-record").button();
    $("#btn-submit-record").button("refresh");
  }
  
  /*
    showRecordForm takes in an index of a record to edit.  It gets the record at
    that index from tbRecords in localStorage and sets the values of the
    corresponding input elements in the form to those values.
  */
  function showRecordForm(index) {
    const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    const rec = tbRecords[index];
  
    $("#data-date").val(rec.Date);
    $("#data-sleep").val(rec.Sleep);
    $("#data-study").val(rec.Study);
    $("#data-mood").val(rec.Mood);
  }
  
  /*
    editRecord will take in an index of a record to edit in tbRecords.  It will
    try to get tbRecords from localStorage and update the value at the given
    index based on the values from the input elements in the form-record,
    if all of the values are valid. If it is successful, it will return true.
    Otherwise, it returns false.
  */
  function editRecord(index) {
    if (checkRecordForm()) {
      try {
        const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
        tbRecords[index] = {
          Date: $("#datadate").val(),
          Sleep: $("#data-sleep").val(),
          Study: $("#data-study option:selected").val(),
          Mood: $("#data-mood option:selected").val()
        };
  
        tbRecords.sort(compareDates);
        localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
        alert("Saving Information");
        clearRecordForm();
        listRecords();
  
        return true;
      } catch (e) {
        if (window.navigator.vendor === "Google Inc.") {
          if (e === DOMException.QUOTA_EXCEEDED_ERR) {
            alert("Error: Saving to local storage.");
          }
        } else if (e === QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
  
        console.log(e);
  
        return false;
      }
    } else {
      return false;
    }
  }