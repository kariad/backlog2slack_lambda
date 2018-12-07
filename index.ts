import * as slackNode from 'slack-node'
import { APIGatewayEvent, Context, Callback, APIGatewayEventRequestContext } from 'aws-lambda';

var BOTNAME = process.env['BOTNAME'];
var BASEURL = process.env['BASEURL'];
var WEBHOOKURI = process.env['WEBHOOKURI'];

export function handler(event: APIGatewayEvent, context: Context, callback: Callback) {
    console.log("Hello Wold!!!!");
}
