const express = require('express');
const app = express();
const session = require('express-session');
const request = require('request-promise-native');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


var port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cookieSession = [];

app.set("view engine", "ejs");
app.use('/static', express.static('public'));

app.use(session({
  secret: Math.random().toString(36).substring(2),
  resave: true,
  saveUninitialized: true,
  cookie: {
  	maxAge: 12 * 30 * 24 * 60 * 60 * 1000
  }
}));

const CONNECTION_URL = "mongodb+srv://jasUser:password6!@cluster0-z8jcr.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "waffletest"; // you can change the database name
var database, collectionWaffle;

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
  if(error) throw error;

  database = client.db(DATABASE_NAME);
  collectionWaffle = database.collection("wafflescollection"); 

  // Start the application after the database connection is ready
  app.listen(port, () => {
    console.log('This app is running on port ' + port)
  });
});


app.get('/', (req, res) => {
	res.render('home');
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

	collectionWaffle.insertOne({ name: req.body.name, email: req.body.email, submitstamp: submitStamp, submitmonthname: submitMonthName, submitdate: submitDate, submitmonth: submitMonth, submithour: submitHour, submitminute: submitMinute, submitsecond: submitSecond, cookie: req.sessionID }, (err, result) => {
		console.log('saved waffle form submission');
		res.redirect('/queue');
	});  
})

app.get('/queue', (req, res) => {
	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();
	
	collectionWaffle.find( { submitdate: todayDate, submitmonth: todayMonth, waffleCollected: {$exists: false} }).sort({submitstamp: 1}).toArray((err, result) => {
			console.log(result);
			res.render('queue', {submission: result});
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

	collectionWaffle.insertOne({ name: req.body.name, email: req.body.email, submitstamp: submitStamp, submitmonthname: submitMonthName, submitdate: submitDate, submitmonth: submitMonth, submithour: submitHour, submitminute: submitMinute, submitsecond: submitSecond, cookie: req.sessionID }, (err, result) => {
		console.log('saved waffle form submission');
		res.redirect('/admin');
	});   
})

app.get('/login', (req, res) => {
	if (cookieSession.includes(req.sessionID)) {
		res.redirect('/admin');
	} else {
		res.render('login');
	}
})

app.post('/login', (req, res) => {
	if (req.body.password == 'Waff1ef0rl1f3') {
		cookieSession.push(req.sessionID);
		res.redirect('/admin');
	} else {
		res.send("Sorry wrong password! Don't try again.");
	}
})

app.get('/admin', (req, res) => {
	if (cookieSession.includes(req.sessionID)) {
		const today = new Date();
		const todayDate = today.getDate();
		const todayMonth = today.getMonth();

		collectionWaffle.find( { submitdate: todayDate, submitmonth: todayMonth }).sort({submitstamp: 1}).toArray((err, result) => {
			console.log(result);
			res.render('admin', {submission: result});
		});
	} else {
		res.redirect('/login');
	}

})

app.post('/slack', async (req, res) => {
	console.log(req.body.email);
	var userId = req.body.userid;
	var userEmail = req.body.email;
	var token = 'xoxp-2152023175-216767779619-713116306581-85259aec74488bafdd0f8a3419ddd05f';
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

	const slackMsg = async() => {
		try {
			var options = {
				method: 'POST',
				uri: 'https://hooks.slack.com/services/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',
				json: true,
				body: {
					"text": "Hi <@" + slackUserId.user.id + "> your waffle is ready!"
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
			$set: { waffleCollected: 'collected' }
		}
	);

	res.send(true);
});

app.post('/edit', async (req, res) => {
	var userId = req.body.userid;
	var newEmail = req.body.newEmail;
	var newName = req.body.newName;
	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();
console.log(userId);
	collectionWaffle.updateOne( { _id: ObjectId(userId), submitmonth: todayMonth, submitdate: todayDate },
		{
			$set: { name: newName, email: newEmail }
		}
	);

	res.send(true);	
});

app.get('/test', (req, res) => {
	res.render('test');
});