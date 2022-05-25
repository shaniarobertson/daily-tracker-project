/*
  Assignment: Week 7 Lab - JS for DailyTracker
  Author: Shania Robertson
  Date: 05/01/2022
  Purpose: To provide the functionality for displaying advice based
    on the most recent record in local storage 
  Credit: This is based on the Thyroid App in Chapter 6 and James 
    Sekcienski's adaptation
*/

/*
  showAdvice will try to get the tbRecords from localStorage.  If there are
  no records, then it will alert the user and return to the menu page.
  Otherwise, it will get the user and most recent record from tbRecords.
  It will get the TSH Range from the user and the TSH value from the 
  most recent record and use those to draw the advice gauge and display
  the suggested actions.
*/
function showAdvice() {
    try {
      const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  
      if (tbRecords == null) {
        alert("No records exist yet");
  
        $(location).attr("href", "#page-menu");
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        const sleepAmt = user.Sleep;
  
        const mostRecentIndex = tbRecords.length - 1;
        const sleep = tbRecords[mostRecentIndex].Sleep;
  
        const canvas = document.getElementById("canvas-advice");
        const context = canvas.getContext("2d");
        context.fillStyle = "#C0C0C0";
        context.fillRect(0, 0, 550, 550);
        context.font = "22px Arial";
        drawAdviceCanvas(context, sleepAmt, sleep);
      }
    } catch(e) {
      if (window.navigator.vendor === "Google Inc.") {
        if(e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
  
      console.log(e);
    }
  }
  
  /*
    drawAdviceCanvas takes in a 2d context of a canvas, a target TSH level, and 
    a TSH value.  It will add text to the context stating the TSH value, the 
    target TSH level, the advice based on the TSH value with respect to the 
    target TSH level, and draw the gauge based on the given values.
  */
  function drawAdviceCanvas(context, sleepAmt, sleep) {
    context.font = "22px Arial";
    context.fillStyle = "black";
    context.fillText("Your current TSH is " + sleep + ".", 25, 320);
  
    if (sleepAmt == "StageA") {
      context.fillText("Your target TSH range is: 0.01-0.1 mlU/L", 25, 350);
      levelAWrite(context, sleep);
      levelAMeter(context, sleep);
    } else if (sleepAmt == "StageB") {
      context.fillText("Your target TSH range is: 0.1-0.5 mlU/L", 25, 350);
      levelBWrite(context, sleep);
      levelBMeter(context, sleep);
    } else if (sleepAmt == "StageC") {
      context.fillText("Your target TSH range is: 0.35-2.0 mlU/L", 25, 350);
      levelCWrite(context, sleep);
      levelCMeter(context, sleep);
    }
  }
  
  /*
    levelAWrite will take in a 2d context of a canvas and a TSH value.  It will
    write the advice to the context based on the TSH value using ranges for level
    A.
  */
  function levelAWrite(context, tsh) {
    if ((tsh >= 0.01) && (tsh <= 0.1)) {
      writeAdvice(context, "green");
    } else if ((tsh > 0.1) && (tsh <= 0.5)) {
      writeAdvice(context, "yellow");
    } else {
      writeAdvice(context, "red");
    }
  }
  
  /*
    levelBWrite will take in a 2d context of a canvas and a TSH value.  It will
    write the advice to the context based on the TSH value using ranges for level
    B.
  */
  function levelBWrite(context, tsh) {
    if ((tsh >= 0.1) && (tsh <= 0.5)) {
      writeAdvice(context, "green");
    } else if ((tsh > 0.5) && (tsh <= 2.0)) {
      writeAdvice(context, "yellow");
    } else if ((tsh >= 0.01) && (tsh < 0.1)) {
      writeAdvice(context, "yellow");
    } else {
      writeAdvice(context, "red");
    }
  }
  
  /*
    levelCWrite will take in a 2d context of a canvas and a TSH value.  It will
    write the advice to the context based on the TSH value using ranges for level
    C.
  */
  function levelCWrite(context, tsh) {
    if ((tsh >= 0.35) && (tsh <= 2.0)) {
      writeAdvice(context, "green");
    } else if ((tsh > 2) && (tsh <= 10.0)) {
      writeAdvice(context, "yellow");
    } else if ((tsh >= 0.1) && (tsh < 0.35)) {
      writeAdvice(context, "yellow");
    } else {
      writeAdvice(context, "red");
    }
  }
  
  /*
    writeAdvice will take in a 2d context of a canvas and a level color as a
    string that represents the advice rating that is needed.  It will write the
    corresponding advice message to the context.
  */
  function writeAdvice(context, level) {
    let adviceLine1 = "";
    let adviceLine2 = "";
  
    if (level == "red") {
      adviceLine1 = "Please consult with your family";
      adviceLine2 = "physician urgently.";
    } else if (level == "yellow") {
      adviceLine1 = "Contact family physician and recheck bloodwork";
      adviceLine2 = "in 6-8 weeks.";
    } else if (level == "green") {
      adviceLine1 = "Repeat bloodwork in 3-6 months.";
    }
  
    context.fillText("Your TSH-level is " + level + ".", 25, 380);
    context.fillText(adviceLine1, 25, 410);
    context.fillText(adviceLine2, 25, 440);
  }
  
  /*
    levelAMeter will take in a 2d context of a canvas and a TSH value.  It will
    check if the TSH value is less than or equal to 3.  If it is, it will create
    a corner gauge based with an upper bound of 3.  Otherwise, it will create a 
    corner gauge with an upper bound of the TSH value.  Finally, it will
    draw the gauge on the context. Assumes a level A TSH value.
  */
  function levelAMeter(context, tsh) {
    let gauge;
    if (tsh <= 3) {
      gauge = new RGraph.CornerGauge("canvas-advice", 0, 3, tsh)
        .Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5, "yellow"],
        [0.01, 0.1, "green"]]);
    } else {
      gauge = new RGraph.CornerGauge("canvas-advice", 0, tsh, tsh)
        .Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5, "yellow"],
        [0.01, 0.1, "green"], [3.01, tsh, "red"]]);
    }
    drawMeter(gauge);
  }
  
  /*
    levelBMeter will take in a 2d context of a canvas and a TSH value.  It will
    check if the TSH value is less than or equal to 3.  If it is, it will create
    a corner gauge based with an upper bound of 3.  Otherwise, it will create a 
    corner gauge with an upper bound of the TSH value.  Finally, it will
    draw the gauge on the context. Assumes a level B TSH value.
  */
  function levelBMeter(context, tsh) {
    let gauge;
    if (tsh <= 3) {
      gauge = new RGraph.CornerGauge("canvas-advice", 0, 3, tsh)
        .Set("chart.colors.ranges", [[2.01, 3, "red"], [0.51, 2, "yellow"],
        [0.1, 0.5, "green"], [0.01, 0.1, "yellow"]]);
    } else {
      gauge = new RGraph.CornerGauge("canvas-advice", 0, tsh, tsh)
        .Set("chart.colors.ranges", [[2.01, 3, "red"], [0.51, 2, "yellow"],
        [0.1, 0.5, "green"], [0.01, 0.1, "yellow"], [3.01, tsh, "red"]]);
    }
    drawMeter(gauge);
  }
  
  /*
    levelCMeter will take in a 2d context of a canvas and a TSH value.  It will
    check if the TSH value is less than or equal to 3.  If it is, it will create
    a corner gauge based with an upper bound of 3.  Otherwise, it will create a 
    corner gauge with an upper bound of the TSH value.  Finally, it will
    draw the gauge on the context. Assumes a level C TSH value.
  */
  function levelCMeter(context, tsh) {
    let gauge;
    if (tsh <= 15) {
      gauge = new RGraph.CornerGauge("canvas-advice", 0, 15, tsh)
        .Set("chart.colors.ranges", [[10.01, 15, "red"], [2.01, 10, "yellow"],
        [0.35, 2.0, "green"], [0.1, 0.34, "yellow"]]);
    } else {
      gauge = new RGraph.CornerGauge("canvas-advice", 0, tsh, tsh)
        .Set("chart.colors.ranges", [[10.01, 15, "red"], [2.01, 10, "yellow"],
        [0.35, 2.0, "green"], [0.1, 0.34, "yellow"], [15.01, tsh, "red"]]);
    }
    drawMeter(gauge);
  }
  
  /*
    drawMeter will take in a corner gauge object and apply final settings for
    this gauge representing the TSH Level and draw it
  */
  function drawMeter(gauge) {
    gauge.Set("chart.value.text.units.post", " muU/L")
      .Set("chart.value.text.boxed", false)
      .Set("chart.value.text.size", 14)
      .Set("chart.value.text.font", "Verdana")
      .Set("chart.value.text.bold", true)
      .Set("chart.value.text.decimals", 2)
      .Set("chart.shadow.offsetx", 5)
      .Set("chart.shadow.offsety", 5)
      .Set("chart.scale.decimals", 2)
      .Set("chart.title", "TSH LEVEL")
      .Set("chart.radius", 250)
      .Set("chart.centerx", 50)
      .Set("chart.centery", 250)
      .Draw();
  }