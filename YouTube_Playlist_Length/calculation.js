var totalTime = {
  seconds: 0,
  minutes: 0,
  hours: 0,
};

var vidCount = 0;
var windowType;

let allPlaylistVideos;

if (window.location.href.includes("playlist")) {
  allPlaylistVideos = document.querySelectorAll("ytd-playlist-video-renderer");
  windowType = "playlist";
} else {
  allPlaylistVideos = document.querySelectorAll(
    "ytd-playlist-panel-video-renderer"
  );
  windowType = "panel";
}



//to calculate time
allPlaylistVideos.forEach((element) => {
  try {
    var timelist;
    if (windowType === "playlist") {
      timelist = element
        .querySelector("#overlays")
        .querySelector("ytd-thumbnail-overlay-time-status-renderer")
        .querySelector("span")
        .firstChild.data.trim()
        .split(":");
    } else if (windowType === "panel") {
      timelist = element.querySelector("span#text").innerHTML.split(":");
    }
    vidCount++;
    console.log(timelist);

    if (timelist.length === 2) {
      totalTime.minutes += Number(timelist[0]);
      totalTime.seconds += Number(timelist[1]);
    } else if (timelist.length === 3) {
      totalTime.hours += Number(timelist[0]);
      totalTime.minutes += Number(timelist[1]);
      totalTime.seconds += Number(timelist[2]);
    }
  } catch (err) {
    console.log(err);
  }
});

//function to format time value(hh:mm:ss)
timeCalc = (time, totalTime) => {
  totalTime.minutes = parseInt(time / 60);
  totalTime.seconds = parseInt(time % 60);
  totalTime.hours = parseInt(totalTime.minutes / 60);
  totalTime.minutes = parseInt(totalTime.minutes % 60);

  let hrs, mins, secs;

  hrs = totalTime.hours > 0 ? `${totalTime.hours} hours ` : ``;
  mins = totalTime.minutes > 0 ? `${totalTime.minutes} minutes ` : ``;
  secs = totalTime.seconds > 0 ? `${totalTime.seconds} seconds` : ``;

  return hrs + mins + secs;
};

//to calculate total no. of videos
var mvid = `No. of videos counted: ${vidCount}`;

//to calculate time at 1x
totalTime.minutes += parseInt(totalTime.seconds / 60);
totalTime.seconds = totalTime.seconds % 60;
totalTime.hours += parseInt(totalTime.minutes / 60);
totalTime.minutes = totalTime.minutes % 60;

var m1 = `Total time of playlist: ${totalTime.hours} hours ${totalTime.minutes} minutes ${totalTime.seconds} seconds`;

var totalTimeInSec = totalTime.seconds + totalTime.minutes * 60 + totalTime.hours * 3600;

//to calculate average time
var average = parseInt(totalTimeInSec / vidCount);
var m_avg = `Average duration of a video: ${timeCalc(average, totalTime)}`;

//to calculate time at 1.5x
var totalTimeInSec1_5 = totalTimeInSec / 1.5;
var m1_5 = `At 1.5x: ${timeCalc(totalTimeInSec1_5, totalTime)}`;

//to calculate time at 2x
var totalTimeInSec2 = totalTimeInSec / 2;
var m2 = `At 2x: ${timeCalc(totalTimeInSec2, totalTime)}`;

var details = {
  vid: mvid,
  //total_vid: mtotal_vid,
  avgTime: m_avg,
  time1: m1,
  time1_5: m1_5,
  time2: m2,
};

chrome.runtime.sendMessage(details);
