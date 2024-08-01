require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("_helpers/jwt");
const errorHandler = require("_helpers/error-handler");
const nocache = require("nocache");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(cors(corsOptions));
app.use(cors());
app.use(jwt());
app.use(nocache());

// Middleware to normalise the request URL
app.use((req, res, next) => {
	// Replace multiple leading slashes with a single slash
	req.url = req.url.replace(/^\/+/, "/");
	next();
});

// for testing purposes
//
app.get("/", function (request, response) {
	response.writeHead(200, { "Content-Type": "text/plain" });
	response.end("/ is working yahoo");
});

app.get("/test", function (request, response) {
	response.writeHead(200, { "Content-Type": "text/plain" });
	response.end("/test is working");
});

app.get("/api/test", (req, res) => {
	response.writeHead(200, { "Content-Type": "text/plain" });
	res.send("/api/test is working");
});

// api routes  - ENTRY POINTS
app.use("/accounts", require("apps/accounts/accounts.controller"));
app.use("/archive", require("apps/archive/archive.controller"));
app.use("/content", require("apps/content/content.controller"));
app.use(
	"/contributions",
	require("apps/contributions/contributions.controller")
);
app.use("/clubhouse", require("apps/clubhouse/clubhouse.controller"));
app.use("/image", require("images/image.controller"));
app.use("/memberinfo", require("apps/memberinfo/memberinfo.controller"));
app.use("/news", require("apps/news/news.controller"));
app.use("/newsletters", require("apps/newsletters/newsletters.controller"));
app.use("/statss", require("apps/stats/stats.controller"));
app.use("/sponsors", require("apps/sponsors/sponsors.controller"));
app.use("/users", require("apps/users/users.controller"));
app.use("/videos", require("apps/videos/videos.controller"));
app.use("/payments", require("apps/payments/payments.controller"));
app.use(
	"/supportingaccounts",
	require("apps/supportingaccounts/supportingaccounts.controller")
);
app.use("/sms", require("apps/sms/sms.controller"));
app.use("/votes", require("apps/votes/votes.controller"));
/* end first server ENTRY P0INTS*/
app.use(errorHandler);

const { DB, PORT } = require("./config");

const server = app.listen(PORT, function () {
	const msg =
		"CanisiusRugby.org api server listening on PORT " +
		PORT +
		" using DB " +
		DB.DB_DATABASE +
		" on " +
		DB.DB_HOST;
	console.log(msg);
});
