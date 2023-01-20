const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.use(express.json());
const Facebook = require('facebook-node-sdk');
const facebook = new Facebook({ appId: process.env.APP_ID, secret: process.env.APP_SECRET });
app.get('/', (req, res) => {
	res.status(200).json({ message: 'hello from facebook bot' });
});
app.get('/login', function(req, res) {
	const options = {
		client_id: process.env.APP_ID,
		redirect_uri: 'http://localhost:3000/login/facebook/callback',
		scope:
			'email, pages_show_list, pages_messaging, pages_read_engagement, pages_manage_metadata, pages_read_user_content, pages_manage_posts, pages_manage_engagement,public_profile'
	};
	const loginUrl = `https://www.facebook.com/v8.0/dialog/oauth?client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&scope=${options.scope}`;
	res.redirect(loginUrl);
});

app.get('/login/facebook/callback', function(req, res) {
	const code = req.query.code;
	facebook.api(
		'/oauth/access_token',
		{
			client_id: process.env.APP_ID,
			client_secret: process.env.APP_SECRET,
			redirect_uri: 'http://localhost:3000/login/facebook/callback',
			code: code
		},
		function(accessToken) {
			console.log(accessToken);
			if (!accessToken || accessToken.error) {
				console.log(!accessToken ? 'error occurred #####' : accessToken.error);
				return;
			}
			// access token will be in the accessToken.access_token field
			console.log(
				'Access Token:',
				accessToken.access_token,
				'&&&&&&',
				'Access Token:',
				accessToken.data.access_token
			);
		}
	);
	// facebook.api('/me/accounts', { access_token: accessToken.access_token }, function(res) {
	// 	if (!res || res.error) {
	// 		console.log(!res ? 'error occurred @@@@@' : res.error);
	// 		return;
	// 	}
	// 	// res is a json object containing the list of pages
	// 	// you can access the page access token by res.data[i].access_token
	// 	console.log(res);
	// 	const pages = res.data;
	// 	const targetPage = pages.find((page) => page.id === process.env.PAGE_ID);
	// 	if (targetPage) {
	// 		const pageAccessToken = targetPage.access_token;
	// 		console.log(`Page Access Token for page ${targetPage.name} is ${pageAccessToken}`);
	// 		// use the page access token to make requests to the Graph API on behalf of the page
	// 	} else {
	// 		console.log(`Page with id ${process.env.PAGE_ID} not found`);
	// 	}
	// });
});

app.listen(3000, () => {
	console.log('server running');
});
