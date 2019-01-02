"use strict";
exports.__esModule = true;
var Slack = require("slack-node");
var BOTNAME = process.env['BOTNAME'];
var BASEURL = process.env['BASEURL'];
var WEBHOOKURI = process.env['WEBHOOKURI'];
var CHANNELNAME = process.env['CHANNELNAME'];
var COLOR = process.env['COLOR'];
var BacklogType = {
    1: "課題の追加",
    2: "課題の更新",
    3: "課題にコメント"
};
function createDescription(event) {
    switch (event.type) {
        case 1:
        case 2:
            return event.content.description;
        case 3:
            return event.content.comment.content;
        default:
            return event.content.description;
    }
}
function handler(event, context, callback) {
    var slack = new Slack;
    slack.setWebhook(String(WEBHOOKURI));
    var url = BASEURL + "-" + event.content.key_id;
    var attachment = {
        "color": COLOR,
        "pretext": "Backlogに更新がありました。",
        "title": event.content.summary,
        "title_link": url,
        "fields": [
            {
                "title": "更新種別",
                "value": BacklogType[+event.type],
                "short": true
            },
            {
                "title": "更新者",
                "value": event.createdUser.name,
                "short": true
            },
            {
                "title": "内容",
                "value": createDescription(event),
                "short": false
            }
        ]
    };
    slack.webhook({
        channel: CHANNELNAME,
        username: String(BOTNAME),
        attachments: [attachment]
    }, function (err, response) {
        console.log(err);
    });
}
exports.handler = handler;
