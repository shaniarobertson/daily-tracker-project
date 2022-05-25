/*
  Assignment: Week 7 Lab - JS for DailyTracker
  Author: Shania Robertson
  Date: 05/01/2022
  Purpose: To provide the functionality of creating a graph of my data overtime
    based on the data in local storage.
  Credit: This is based on the Thyroid App in Chapter 6 and James 
    Sekcienski's adaptation
*/

/*
  showGraph will try to get the tbRecords from localStorage.  If there are
  no records, then it will alert the user and return to the menu page.
  Otherwise, it will set-up the canvas and draw a line graph showing the 
  TSH values over time in the records and lines for the lower and upper
  bound of the target TSH range
*/
function showGraph() {
    try {
      const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  
      if (tbRecords == null) {
        alert("No records exist yet");
  
        $(location).attr("href", "#page-menu");
      } else {
        setupCanvas();
  
        const tshArr = new Array();
        const dateArr = new Array();
        getTSHHistory(tshArr, dateArr);
        
        const tshLower = new Array(2);
        const tshUpper = new Array(2);
        getTSHBounds(tshLower, tshUpper);
  
        drawLines(tshArr, dateArr, tshLower, tshUpper);
        labelAxes();
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
    setupCanvas will get the canvas-graph element and will add a rectangle for
    the background to the context of the canvas
  */
  function setupCanvas() {
    const canvas = document.getElementById("canvas-graph");
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, 500, 500);
  }
  
  /*
    getTSHHistory will take in an empty array for TSH values and an empty array 
    for date values and try to fill it with the values from tbRecords in local
    storage.
  */
  function getTSHHistory(tshArr, dateArr) {
    try {
      const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  
      for (let i = 0; i < tbRecords.length; i++) {
        const currRecord = tbRecords[i];
        
        const currDateAsArr = currRecord.Date.split("-");
        const month = currDateAsArr[1];
        const day = currDateAsArr[2];
        dateArr[i] = (month + "/" + day);
  
        tshArr[i] = parseFloat(currRecord.TSH);
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
    getTSHBounds takes in an empty array for the lower TSH bound values and an
    empty array for the upper TSH bound values.  It will try to get the user
    from local storage to determine and fill in these bound arrays.
  */
  function getTSHBounds(tshLower, tshUpper) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const tshLevel = user.TSHRange;
  
      if (tshLevel == "StageA") {
        tshUpper[0] = 0.1;
        tshUpper[1] = 0.1;
        tshLower[0] = 0.01;
        tshLower[1] = 0.01;
      } else if (tshLevel == "StageB") {
        tshUpper[0] = 0.5;
        tshUpper[1] = 0.5;
        tshLower[0] = 0.1;
        tshLower[1] = 0.1;
      } else {
        tshUpper[0] = 2.0;
        tshUpper[1] = 2.0;
        tshLower[0] = 0.35;
        tshLower[1] = 0.35;
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
    drawLines will take in an array representing the TSH values, an array
    representing the date values, an array representing the upper bound, and
    an array representing the lower bound.  It will use these values to draw
    a line graph and add it to the canvas-graph element.
  */
  function drawLines(tshArr, dateArr, tshUpper, tshLower) {
    const tshLine = new RGraph.Line("canvas-graph", tshArr, tshUpper, tshLower)
      .Set("labels", dateArr)
      .Set("colors", ["blue", "green", "green"])
      .Set("shadow", true)
      .Set("shadow.offsetx", 1)
      .Set("shadow.offsety", 1)
      .Set("linewidth", 1)
      .Set("numxticks", 6)
      .Set("scale.decimals", 2)
      .Set("xaxispos", "bottom")
      .Set("gutter.left", 40)
      .Set("tickmarks", "filledcircle")
      .Set("ticksize", 5)
      .Set("chart.labels.ingraph", [,["TSH", "blue", "yellow", 1, 50]])
      .Set("chart.title", "TSH")
      .Draw();
  }
  
  /*
    labelAxes will get the context of the canvas-graph element and add text
    for the x and y axis labels
  */
  function labelAxes() {
    const canvas = document.getElementById("canvas-graph");
    const context = canvas.getContext("2d");
  
    context.font = "11px Georgia";
    context.fillStyle = "green";
    context.fillText("Date (MM/DD)", 400, 470);
    context.rotate(-Math.PI / 2);
    context.textAlign = "center";
    context.fillText("TSH Value", -250, 10);
  }