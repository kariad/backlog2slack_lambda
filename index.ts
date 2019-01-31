import Slack = require("slack-node");
import { Context, Callback } from 'aws-lambda';

const BOTNAME = process.env['BOTNAME'];
const BASEURL = process.env['BASEURL'];
const WEBHOOKURI = process.env['WEBHOOKURI'];
const CHANNELNAME = process.env['CHANNELNAME'];
const COLOR = process.env['COLOR'];

interface BacklogEvent {
    created: String;
    type: Number
}

const BacklogType: { [key: number]: string} = {
    1: "課題の追加",
    2: "課題の更新",
    3: "課題にコメント"
}

function createDescription(event: any): string {
    switch (event.type) {
        case 1:
            return event.content.description
        case 2:
        case 3:
            return event.content.comment.content
        default:
            return event.content.description
    }
}

export function handler(event: any, context: Context, callback: Callback) {
    let slack = new Slack;
    slack.setWebhook(String(WEBHOOKURI));
    let url = BASEURL + "-" + event.content.key_id

    let attachment = {
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
                "title": "課題のステータス",
                "value": event.content.status.name,
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
      }, function(err, response) {
        console.log(err);
      });
}
