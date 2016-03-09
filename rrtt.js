
var RRTT = (function() {
    var that = this;
    var timer = null;
    var startButton, pauseButton;
    var cookie_key = "rrtt_spent_time_" + window.location.href.substr(parent.location.href.lastIndexOf('/') + 1);

    var toHHMMSS = function(sec_num) {
        sec_num = window.parseInt(sec_num);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = hours+':'+minutes+':'+seconds;
        return time;
    }

    this.startTheTimer = function() {
        timer = window.setInterval(function() {
            var currentSpentTime = window.parseInt($.cookie(cookie_key));
            $("#time_entry_hours").val((currentSpentTime / 3600));
            $("#rrtt_timeholder").html(toHHMMSS(currentSpentTime));
            $.cookie(cookie_key, currentSpentTime + 1);
        }, 1000);
    }

    this.pauseTheTimer = function() {
        if(timer) {
            window.clearInterval(timer);
        }
    }

    this.startTrack = function() {
        that.startTheTimer();
        startButton.attr("disabled", "disabled");
        pauseButton.removeAttr("disabled");
    }

    this.pauseTrack = function() {
        that.pauseTheTimer();
        pauseButton.attr("disabled", "disabled");
        startButton.removeAttr("disabled");
    }

    this.resetTrack = function() {
        if(confirm("Are you sure to reset value?")) {
            that.pauseTheTimer();
            $.cookie(cookie_key, 0);
            $("#rrtt_timeholder").html("00:00:00");
            $("#time_entry_hours").val("");
            pauseButton.attr("disabled", "disabled");
            startButton.removeAttr("disabled");
        }
    }

    this.buildUI = function() {
        startButton = $("<button type='button' title='Play' class='RRTTButton RRTTstartButton'>&#9654;</button>");
        pauseButton = $("<button type='button' title='Pause' disabled class='RRTTButton RRTTpauseButton'>&#10074;&#10074;</button>");
        resetButton = $("<button type='button' title='Reset time' class='RRTTButton RRTTresetButton'>&#10005;</button>");
        var currVal = "00:00:00";

        if($("#flash_notice").length > 0) {
            $.removeCookie(cookie_key);
        }

        if($.cookie(cookie_key) && !isNaN($.cookie(cookie_key)) && window.parseInt($.cookie(cookie_key)) > 0) {
            var currentSpentTime = window.parseInt($.cookie(cookie_key));
            currVal = toHHMMSS(currentSpentTime);
            $("#time_entry_hours").val((currentSpentTime / 3600));
        }
        else {
            $.cookie(cookie_key, 0);
        }

        var timeHolder  = $("<div id='rrtt_timeholder' class='RRTTTimeHolder'>" + currVal+ "</div>");
        var holder = $("<p><label for='time_track'>Track time</label></p>");

        startButton.click(this.startTrack);
        pauseButton.click(this.pauseTrack);
        resetButton.click(this.resetTrack);

        holder.append(timeHolder).append(startButton).append(pauseButton).append(resetButton)
        holder.insertAfter($("#time_entry_hours").closest(".tabular").find(">.splitcontent"));

        $("#issue-form").submit(function() {
            $.removeCookie(cookie_key);
        });
    }

    this.init = function(details) {
        this.buildUI();
    }

    return this;
})();

if($("meta[content='Redmine']").length > 0) {
    RRTT.init();
}
