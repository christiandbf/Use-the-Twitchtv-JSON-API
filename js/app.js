"use strict";

const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

function makeURL(dataType, channel) {
    const ROOTURL = 'https://wind-bow.gomix.me/twitch-api/';
    return ROOTURL + dataType + '/' + channel + '?callback=?';
}

function streamState(data) {
    var game, status;
    if (data.stream === null) {
        game = "Offline";
        status = "offline";
    } else if (data.stream === undefined) {
        game = "Account Closed";
        status = "offline";
    } else {
        game = data.stream.game;
        status = "online";
    };
    return {
        "game": game,
        "status": status
    };
}

function channelInfo(data, stream) {
    var logo = data.logo != null ? data.logo : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F",
        name = data.display_name != null ? data.display_name : channel,
        description = stream.status === "online" ? ': ' + data.status : "",
        url = data.url;
    return {
        "logo": logo,
        "name": name,
        "description": description,
        "url": url
    };
}

function view(stream, info) {
    var html = `
        <div class="row ${stream.status} show">
            <div class="col-xs-2 col-sm-1" id="icon">
                <img src="${info.logo}" class="logo">
            </div>
            <div class="col-xs-10 col-sm-3" id="name">
                <a href="${info.url}" target="_blank">${info.name}</a>
            </div>
            <div class="col-xs-10 col-sm-8" id="streaming">
                ${stream.game}<span class="hidden-xs">${info.description}</span>
            </div>
        </div>
    `;
    $('#content-streamers').append(html);
}

channels.forEach(function (channel) {
    $.getJSON(makeURL('streams', channel), function (data) {
        var stream;
        stream = streamState(data);
        $.getJSON(makeURL('channels', channel), function (data) {
            var info = channelInfo(data, stream);
            view(stream, info);
        });
    });
}, this);

$('#button-all').click(function () {
    if ($('.online').hasClass('hidden')) $('.online').removeClass('hidden').addClass('show');
    if ($('.offline').hasClass('hidden')) $('.offline').removeClass('hidden').addClass('show');
});

$("#button-online").click(function () {
    if ($('.online').hasClass('hidden')) $('.online').removeClass('hidden').addClass('show');
    if ($('.offline').hasClass('show')) $('.offline').removeClass('show').addClass('hidden');
});

$("#button-offline").click(function () {
    if ($('.online').hasClass('show')) $('.online').removeClass('show').addClass('hidden');
    if ($('.offline').hasClass('hidden')) $('.offline').removeClass('hidden').addClass('show');
});