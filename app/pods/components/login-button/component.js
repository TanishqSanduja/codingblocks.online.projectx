import Component from "@ember/component";
import env from "codingblocks-online/config/environment";
import { service } from "ember-decorators/service";
import { action } from "ember-decorators/object";

export default class LoginButton extends Component {
  @service api;
  @service session;
  @service currentUser;
  @service store;

  tagName = 'span'
  loginUrl = `${env.oneauthURL}/oauth/authorize?response_type=code&client_id=${
    env.clientId
  }&redirect_uri=${env.publicUrl}`;

  @action
  invalidateSession() {
    OneSignal.getUserId ()
      .then (userId => {
        console.log("user id is ", userId);
        if (! userId) {
          return
        }

        return this.get("store").queryRecord('player', {
          playerId: userId,
          custom: {
            ext: 'url',
            url: 'me'
          }
        })
      })
      .then ((player) => {
        console.log("player", player);
        if (! player) {
          return
        }
        return player.destroyRecord ()
      })
      .then (() => {
        this.get("api")
          .request("/jwt/logout")
          .then(() => {
            this.get("session").invalidate()
          });
      })
  }

  @action
  logIn () {
    window.location.href = this.get('loginUrl')
  }
}
