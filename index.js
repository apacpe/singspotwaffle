const express = require('express');
const app = express();
const session = require('express-session');
const request = require('request-promise-native');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
var cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  secret: process.env.secret,

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

var port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// const cookieSession = [];
global.formisready = false;

app.set("view engine", "ejs");
app.use('/static', express.static('public'));

// app.use(session({
//   secret: Math.random().toString(36).substring(2),
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//   	maxAge: 12 * 30 * 24 * 60 * 60 * 1000
//   }
// }));
const CONNECTION_URL = "mongodb+srv://apacpe:apacpesupport@cluster0.lwey7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DATABASE_NAME = "singspotwaffles"; // you can change the database name
var database, collectionWaffle, collectionFlavour;

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
  if(error) throw error;

  database = client.db(DATABASE_NAME);
  collectionWaffle = database.collection("wafflescollection");
  collectionFlavour = database.collection("wafflesflavours");

  // Start the application after the database connection is ready
  app.listen(port, () => {
    console.log('This app is running on port ' + port)
  });
});


app.get('/', (req, res) => {
	if (formisready == true) {
		const today = new Date();
		const todayDate = today.getDate();
		const todayMonth = today.getMonth();
		const todayYear = today.getFullYear();

		collectionFlavour.find( { submitdate: todayDate, submitmonth: todayMonth, submityear: todayYear }).sort({submitstamp: -1}).toArray((err, result) => {
			res.render('home', {submission: result});
		});
	} else {
		const today = new Date();
		const todayDate = today.getDate();
		const todayMonth = today.getMonth();
		const todayYear = today.getFullYear();

		collectionFlavour.find( { submitdate: todayDate, submitmonth: todayMonth, submityear: todayYear }).sort({submitstamp: -1}).toArray((err, result) => {
			res.render('homenoform', {submission: result});
		});
	}
})

app.post('/submit', (req, res) => {
	req.body.created_at = new Date();
	var submitStamp = req.body.created_at;
	var submitDate = submitStamp.getDate();
	var submitMonth = submitStamp.getMonth();
	var submitHour = submitStamp.getHours();
	var submitMinute = submitStamp.getMinutes();
	var submitSecond = submitStamp.getSeconds();

	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];

	var submitMonthName = monthNames[submitMonth];

	collectionWaffle.insertOne({ email: req.body.email, level: req.body.level, submitstamp: submitStamp, submitmonthname: submitMonthName, submitdate: submitDate, submitmonth: submitMonth, submithour: submitHour, submitminute: submitMinute, submitsecond: submitSecond, cookie: req.sessionID }, (err, result) => {
		console.log('saved waffle form submission');
		res.redirect('/queue');
	});
})

app.get('/queue', (req, res) => {
	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();

	collectionWaffle.find( { submitdate: todayDate, submitmonth: todayMonth, waffleCollected: {$exists: false} }).sort({submitstamp: 1}).toArray((err, result) => {
			res.render('queue2', {submission: result});
		});
})

app.post('/submitadmin', (req, res) => {
	req.body.created_at = new Date();
	var submitStamp = req.body.created_at;
	var submitDate = submitStamp.getDate();
	var submitMonth = submitStamp.getMonth();
	var submitHour = submitStamp.getHours();
	var submitMinute = submitStamp.getMinutes();
	var submitSecond = submitStamp.getSeconds();

	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];

	var submitMonthName = monthNames[submitMonth];

	collectionWaffle.insertOne({ email: req.body.email, level: req.body.level, submitstamp: submitStamp, submitmonthname: submitMonthName, submitdate: submitDate, submitmonth: submitMonth, submithour: submitHour, submitminute: submitMinute, submitsecond: submitSecond, cookie: req.sessionID }, (err, result) => {
		console.log('saved waffle form submission');
		res.redirect('/order19');
	});
})

app.post('/submitadmin10', (req, res) => {
	req.body.created_at = new Date();
	var submitStamp = req.body.created_at;
	var submitDate = submitStamp.getDate();
	var submitMonth = submitStamp.getMonth();
	var submitHour = submitStamp.getHours();
	var submitMinute = submitStamp.getMinutes();
	var submitSecond = submitStamp.getSeconds();

	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];

	var submitMonthName = monthNames[submitMonth];

	collectionWaffle.insertOne({ email: req.body.email, level: req.body.level, submitstamp: submitStamp, submitmonthname: submitMonthName, submitdate: submitDate, submitmonth: submitMonth, submithour: submitHour, submitminute: submitMinute, submitsecond: submitSecond, cookie: req.sessionID }, (err, result) => {
		console.log('saved waffle form submission');
		res.redirect('/order10');
	});
})

app.get('/login', (req, res) => {
	// if (cookieSession.includes(req.sessionID)) {
	if (req.session.loginid != null && req.session.loginid == process.env.loginid )	{
		res.redirect('/admin');
	} else {
		res.render('login');
	}
})

app.post('/login', (req, res) => {
	if (req.body.password == 'Waff1ef0rl1f3') {
		// cookieSession.push(req.sessionID);
		req.session.loginid = process.env.loginid
		res.redirect('/admin');
	} else {
		res.send("Sorry wrong password! Don't try again.");
	}
})

app.get('/order19', (req, res) => {
	if (req.session.loginid != null && req.session.loginid == process.env.loginid )	{
	// if (cookieSession.includes(req.sessionID)) 
		const today = new Date();
		const todayDate = today.getDate();
		const todayMonth = today.getMonth();

		collectionWaffle.find( { submitdate: todayDate, submitmonth: todayMonth, level: "l19" }).sort({submitstamp: 1}).toArray((err, result) => {
			res.render('order19', {submission: result});
		});
	} else {
		res.redirect('/login');
	}

})

app.get('/order10', (req, res) => {
	if (req.session.loginid != null && req.session.loginid == process.env.loginid )	{
	// if (cookieSession.includes(req.sessionID)) 
		const today = new Date();
		const todayDate = today.getDate();
		const todayMonth = today.getMonth();

		collectionWaffle.find( { submitdate: todayDate, submitmonth: todayMonth, level: "l10" }).sort({submitstamp: 1}).toArray((err, result) => {
			res.render('order10', {submission: result});
		});
	} else {
		res.redirect('/login');
	}

})

app.post('/slack', async (req, res) => {
	console.log(req.body.email);
	var userId = req.body.userid;
	var userEmail = req.body.email;
	var token = 'xoxp-2152023175-1917488309302-3436670124000-80e1071d72e50bce739dd9a2baa16cac';
	var url = "https://slack.com/api/users.lookupByEmail?email=" + userEmail + "&token=" + token;

	const slackUser = async() => {
		try {
			const data = await request.get(url, {json: true});
			return data;
		} catch (e) {
			return {msg: e.message}
		}
	};

	const slackUserId = await slackUser();

	const slackInvite = async() => {
		try {
			var options = {
				method: 'POST',
				uri: 'https://slack.com/api/channels.invite?token=' + token + '&channel=CLYVCDK6C&user=' + slackUserId.user.id,
				json: true
			};
			request(options, (err, res, body) => {
				if (err) {
					console.error('error adding user to channel', err)
					throw err
				}
				console.log('body:', body);
				return body;
			});
		} catch(e) {
			return {msg: e.message}
		}
	};

	const sendInvite = await slackInvite();

	const slackMsg = async() => {
		try {
			var options = {
				method: 'POST',
				uri: 'https://hooks.slack.com/services/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',
				json: true,
				body: {
					"text": "Hi <@" + slackUserId.user.id + "> your waffle is ready on level 19!"
				}
			};
			request(options, (err, res, body) => {
				if (err) {
					console.error('error posting json', err)
					throw err
				}
				console.log('body:', body);
				return body;
			});
		} catch(e) {
			return {msg: e.message}
		}
	};

	const sendSlack = await slackMsg();

	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();

	collectionWaffle.updateMany( { _id: ObjectId(userId), submitmonth: todayMonth, submitdate: todayDate },
		{
			$set: { slackSent: 'Yes' }
		}
	);

	res.send(true);
});

app.post('/slack10', async (req, res) => {
	console.log(req.body.email);
	var userId = req.body.userid;
	var userEmail = req.body.email;
	var token = process.env.slack_token;
	var url = "https://slack.com/api/users.lookupByEmail?email=" + userEmail + "&token=" + token;

	const slackUser = async() => {
		try {
			const data = await request.get(url, {json: true});
			return data;
		} catch (e) {
			return {msg: e.message}
		}
	};

	const slackUserId = await slackUser();

	const slackInvite = async() => {
		try {
			var options = {
				method: 'POST',
				uri: 'https://slack.com/api/channels.invite?token=' + token + '&channel=CLYVCDK6C&user=' + slackUserId.user.id,
				json: true
			};
			request(options, (err, res, body) => {
				if (err) {
					console.error('error adding user to channel', err)
					throw err
				}
				console.log('body:', body);
				return body;
			});
		} catch(e) {
			return {msg: e.message}
		}
	};

	const sendInvite = await slackInvite();

	const slackMsg = async() => {
		try {
			var options = {
				method: 'POST',
				uri: 'https://hooks.slack.com/services/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',
				json: true,
				body: {
					"text": "Hi <@" + slackUserId.user.id + "> your waffle is ready on level 10!"
				}
			};
			request(options, (err, res, body) => {
				if (err) {
					console.error('error posting json', err)
					throw err
				}
				console.log('body:', body);
				return body;
			});
		} catch(e) {
			return {msg: e.message}
		}
	};

	const sendSlack = await slackMsg();

	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();

	collectionWaffle.updateMany( { _id: ObjectId(userId), submitmonth: todayMonth, submitdate: todayDate },
		{
			$set: { slackSent: 'Yes' }
		}
	);

	res.send(true);
});

app.post('/collected', async (req, res) => {
	var userId = req.body.userid;
	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();

	collectionWaffle.updateMany( { _id: ObjectId(userId), submitmonth: todayMonth, submitdate: todayDate },
		{
			$set: { waffleCollected: 'checked' }
		}
	);

	res.send(true);
});

app.post('/edit', async (req, res) => {
	var userId = req.body.userid;
	var newEmail = req.body.newEmail;
	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();

	collectionWaffle.updateOne( { _id: ObjectId(userId), submitmonth: todayMonth, submitdate: todayDate },
		{
			$set: { email: newEmail }
		}
	);

	res.send(true);
});

app.post('/editflavour', async (req, res) => {
	var flavourId = req.body.flavourId;
	var newFlavour = req.body.newFlavour;

	collectionFlavour.updateOne( { _id: ObjectId(flavourId) },
		{
			$set: { flavour: newFlavour }
		}
	);

	res.send(true);
});

app.post('/delete', async (req, res) => {
	var userId = req.body.userid;
	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();

	collectionWaffle.deleteOne( { _id: ObjectId(userId), submitmonth: todayMonth, submitdate: todayDate } );

	res.send(true);
});




app.get('/admin', (req, res) => {
	if (req.session.loginid != null && req.session.loginid == process.env.loginid )	{
		const today = new Date();
		const todayDate = today.getDate();
		const todayMonth = today.getMonth();
		const todayYear = today.getFullYear();

		collectionFlavour.find().sort({submitstamp: -1}).toArray((err, result) => {
			res.render('admin', {submission: result, formstatus: formisready});
		});
	} else {
		res.redirect('/login');
	}
});

app.post('/flavourform', async (req, res) => {
	var slackMessage = req.body.slackmsg;

	const slackStartMsg = async() => {
		try {
			var options = {
				method: 'POST',
				uri: 'https://hooks.slack.com/services/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',
				json: true,
				body: {
					"text": slackMessage
				}
			};
			request(options, (err, res, body) => {
				if (err) {
					console.error('error posting json', err)
					throw err
				}
				console.log('body:', body);
				return body;
			});
		} catch(e) {
			return {msg: e.message}
		}
	};

	const sendSlackStartMsg = await slackStartMsg();

	function hideForm() {
		formisready = false;
		console.log('Form is locked.');
	}

	formisready = true;
	console.log('Form is unlocked.');

	const duration = 1000 * 60 * 60 * 5;
	setTimeout(hideForm, duration);

	req.body.created_at = new Date();
	var submitStamp = req.body.created_at;
	var submitDate = submitStamp.getDate();
	var submitMonth = submitStamp.getMonth();
	var submitYear = submitStamp.getFullYear();

	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"];

	var submitMonthName = monthNames[submitMonth];

	collectionFlavour.insertOne({ flavour: req.body.flavour, submitstamp: submitStamp, submitmonthname: submitMonthName, submitdate: submitDate, submitmonth: submitMonth, submityear: submitYear }, (err, result) => {
		console.log('saved waffle flavour');
		res.redirect('/admin');
	});
})

app.post('/lockform', (req, res) => {
	formisready = false;
	console.log('Form is locked manually.');
	res.send(true);
})

app.post('/unlockform', (req, res) => {
	function hideForm() {
		formisready = false;
		console.log('Form is locked.');
	}

	formisready = true;
	console.log('Form is unlocked manually.');

	const duration = 1000 * 60 * 60 * 5;
	setTimeout(hideForm, duration);
	res.send(true);
})
