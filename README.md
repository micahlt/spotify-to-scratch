# spotify-to-scratch

Use the Spotify Web API and Scratch cloud variables to send data about your listening status into a project on Scratch, live

[![](https://scratch-stats-badge.sid72020123.repl.co/project?id=598414279&data=views&label=Project%20Views&style=flat&color=blue)](https://scratch.mit.edu/projects/598414279) [![](https://scratch-stats-badge.sid72020123.repl.co/project?id=598414279&data=remixes&label=Project%20Remixes&style=flat)](https://scratch.mit.edu/projects/598414279)

## Setup

<details>
<summary>Remix the original Scratch project</summary>

You can find the original Scratch project [here](https://scratch.mit.edu/projects/598414279/).  Log in to your own account and hit "remix".
</details>

<details>
<summary>Get a Spotify refresh token</summary>

> Many thanks to [@lowlighter/metrics](https://github.com/lowlighter/metrics/blob/master/source/plugins/music/README.md#recently-played--top-modes) for this method

Spotify does not have *personal tokens*, so it makes the process a bit longer because you're required to follow the [authorization workflow](https://developer.spotify.com/documentation/general/guides/authorization-guide/)... Follow the instructions below for a  *TL;DR* to obtain a `refresh_token`.

Sign in to the [developer dashboard](https://developer.spotify.com/dashboard/) and create a new app.
Keep your `client_id` and `client_secret` and let this tab open for now.

![Add a redirect url](https://github.com/lowlighter/metrics/raw/master/.github/readme/imgs/plugin_music_recent_spotify_token_0.png)

Open the settings and add a new *Redirect url*. Normally it is used to setup callbacks for apps, but just put `https://localhost` instead (it is mandatory as per the [authorization guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/), even if not used).

Forge the authorization url with your `client_id` and the encoded `redirect_uri` you whitelisted, and access it from your browser:

```
https://accounts.spotify.com/authorize?client_id=********&response_type=code&scope=user-read-recently-played%20user-top-read&redirect_uri=https%3A%2F%2Flocalhost
```

When prompted, authorize your application.

![Authorize application](https://github.com/lowlighter/metrics/raw/master/.github/readme/imgs/plugin_music_recent_spotify_token_1.png)

Once redirected to `redirect_uri`, extract the generated authorization `code` from your url bar.

![Extract authorization code from url](https://github.com/lowlighter/metrics/raw/master/.github/readme/imgs/plugin_music_recent_spotify_token_2.png)

Go back to your developer dashboard tab, and open the web console of your browser to paste the following JavaScript code, with your own `client_id`, `client_secret`, authorization `code` and `redirect_uri`.

```js
(async () => {
  console.log(await (await fetch("https://accounts.spotify.com/api/token", {
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({
      grant_type:"authorization_code",
      redirect_uri:"https://localhost",
      client_id:"********",
      client_secret:"********",
      code:"********",
    })
  })).json())
})()
```

It should return a JSON response with the following content:
```json
{
  "access_token":"********",
  "expires_in": 3600,
  "scope":"user-read-recently-played user-top-read",
  "token_type":"Bearer",
  "refresh_token":"********"
}
```

Save your `client_id`, `client_secret` and `refresh_token` somewhere you can access them.
</details>

<details>
<summary>Set up credentials in env</summary>

> How you set up the environment variables may differ depending on what hosting platform (e.g., Replit, Heroku, DigitalOcean) you are using

Set the environment variables as follows:

```javascript
USERNAME -> your Scratch username
PASSWORD -> your Scratch password
CLIENT -> the Spotify client ID
SECRET -> the Spotfiy client secret
REFRESHER -> the Spotify refresh token
PROJECT_ID -> the ID of the Scratch project
```

A quick note - you probably don't want to use your primary Scratch account's username and password.  If you do, you will be logged out frequently, and there's no reason _not_ to use an alternate account since cloud variables don't care who's setting them.

</details>

<details>
<summary>Install dependencies</summary>

Navigate to the project directory and run the following command:

```bash
npm install
```

</details>

<details>
<summary>Start the server</summary>

> Once again, this really all depends on what platform you're running this on.

Run the following command in the project directory:

```bash
node index.js
```

</details>
