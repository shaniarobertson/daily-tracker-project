/*
  Assignment: Week 7 Lab - JS for DailyTracker
  Author: Shania Robertson
  Date: 05/01/2022
  Purpose: to provide the functionality for the user profile page to validate
    the data, save the information to local storage, and show the information
    that is currently saved.
  Credit: This is based on the Thyroid App in Chapter 6 and James 
    Sekcienski's adaptation
*/

/*
  checkUserForm and it will ensure that each required input element of the form
  has a valid value.
*/
function checkUserForm() {
    if ($("#data-first-name").val() == "") {
      alert("You need to enter your first name.");
      return false;
    } else if ($("#data-last-name").val() == "") {
      alert("You need to enter your last name.");
      return false;
    } else if ($("#data-long-term-").val() == "") {
        alert("You need to enter a long term goal.");
        return false;
    } else if ($("#data-short-term").val() == "") {
        alert("You need to enter a short term goal.");
        return false;
    } else {
      return true;
    }
  }
  
  /*
    getCurrentDateFormatted will return the current date in the format
    "yyyy-mm-dd"
  */
  function getCurrentDateFormatted() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
  
    const formattedDate =
      year +
      "-" +
      (("" + month).length < 2 ? "0" : "") +
      month +
      "-" +
      (("" + day).length < 2 ? "0" : "") +
      day;
  
    return formattedDate;
  }
  
  /*
    Add a submit handler for the form-user-info element that will call saveUserForm
    and return false to prevent default behavior of submitting the form
  */
  $("#form-user-info").submit(function () {
    saveUserForm();
    return false;
  });
  
  /*
    saveUserForm will check that the required inputs are all valid.  If they are,
    then it will attempt to save the information in the form to localStorage
    saved with the key user
  */
  function saveUserForm() {
    if (checkUserForm()) {
      const user = {
        FirstName: $("#data-first-name").val(),
        LastName: $("#data-last-name").val(),
        LongTerm: $("#data-long-term").val(),
        ShortTerm: $("#data-short-term").val()
      };
  
      try {
        localStorage.setItem("user", JSON.stringify(user));
        alert("Saving Information");
  
        $.mobile.changePage("#page-menu");
        window.location.reload();
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
  }
  
  /*
    showUserForm this will try to get the user from local storage.  If it exists,
    then it will load the information into the user form based on the associated
    values.
  */
  function showUserForm() {
    let user = null;
    user = JSON.parse(localStorage.getItem("user"));
  
    if (user != null) {
      $("#data-first-name").val(user.FirstName);
      $("#data-last-name").val(user.LastName);
      $("#data-new-password").val(user.NewPassword);
      $("#data-long-term").val(user.LongTerm);
      $("#data-short-term").val(user.ShortTerm);
      
    }
  }