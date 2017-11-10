var express = require('express'),
	moment = require('moment'),
	tools = require('./analyticsTools'),
	fs = require('fs'),
	passport = require('passport'),
	simpleSqlParser = require('simple-sql-parser'),
	jsonQuery = require('json-query'),
	BasicStrategy = require('passport-http').BasicStrategy,
	BearerStrategy = require('passport-http-bearer').Strategy;


var app = express();

var primitiveMetrics = [];
var percentageMetrics = [];
var multiGroupMetrics = [];

//Operations
var averageOperation = tools.createOperation('average');
var greatestOperation = tools.createOperation('greatest');
var percentageOperation = tools.createOperation('percentage');
var sumOperation = tools.createOperation('sum');
var subtractOperation = tools.createOperation('subtract');
var lastOperation = tools.createOperation('last');
//Specs
var lastResutSpec = tools.createLastSpec();
var dailyTimeIntervalSpec = tools.createTimeIntervalSpec('lastDay');
var lastWeekTimeIntervalSpec = tools.createTimeIntervalSpec('lastWeek');
var lastMonthTimeIntervalSpec = tools.createTimeIntervalSpec('lastMonth');
var lastTwoDaysTimeIntervalSpec = tools.createTimeIntervalSpec('lastTwoDays');
var lastTwoWeeksTimeIntervalSpec = tools.createTimeIntervalSpec('lastTwoWeeks');
var lastTwoMonthsTimeIntervalSpec = tools.createTimeIntervalSpec('lastTwoMonths');
var customTimeIntervalSpec = tools.createCustomTimeIntervalSpec('17-11-2013', '18-11-2013');
var lastOfPeriodSpec = tools.createLastOfPeriodSpec('hourly');
var andSpec1 = tools.createAndSpec([customTimeIntervalSpec, lastOfPeriodSpec]);
var andSpec2 = tools.createAndSpec([andSpec1, lastResutSpec]);
var aggregationSpec = tools.createAggregationSpec('SUM');
var periodSpec = tools.createPeriodSpec('DAILY');
var groupBySpec = tools.createGroupBySpec({
	gruopBy: {
		country: []
	}
});
var combinedSpec = tools.createAndSpec([periodSpec, dailyTimeIntervalSpec, groupBySpec]);


//SingleGroupMetrics
var installations = tools.createSingleGroupMetric('installations', 'primitive');
installations.name = 'Installations';
primitiveMetrics.push(installations);
var activeUsers = tools.createSingleGroupMetric('activeUsers', 'primitive');
activeUsers.name = 'Active Users';
primitiveMetrics.push(activeUsers);
var newUsers = tools.createSingleGroupMetric('newUsers', 'primitive');
newUsers.name = 'New Users';
primitiveMetrics.push(newUsers);
var usageRate = tools.createSingleGroupMetric('usageRate', 'primitive');
usageRate.name = 'Usage Rate';
primitiveMetrics.push(usageRate);
var maleUsers = tools.createSingleGroupMetric('maleUsers', 'primitive');
primitiveMetrics.push(maleUsers);
var femaleUsers = tools.createSingleGroupMetric('femaleUsers', 'primitive');
primitiveMetrics.push(femaleUsers);
var expands = tools.createSingleGroupMetric('expands', 'primitive');
expands.name = 'Expands';
primitiveMetrics.push(expands);
var totalUrls = tools.createSingleGroupMetric('totalUrls', 'primitive');
totalUrls.name = 'Total Urls';
primitiveMetrics.push(totalUrls);
var categorizedUrls = tools.createSingleGroupMetric('categorizedUrls', 'primitive');
categorizedUrls.name = 'Categorized Urls';
primitiveMetrics.push(categorizedUrls);
var noCategorizedUrls = tools.createSingleGroupMetric('noCategorizedUrls', 'primitive');
noCategorizedUrls.name = 'NoCategorized Urls';
primitiveMetrics.push(noCategorizedUrls);
var noMetaKeyWordsUrls = tools.createSingleGroupMetric('noMetaKeyWordsUrls', 'primitive');
noMetaKeyWordsUrls.name = 'NoMetaKeywords Urls';
primitiveMetrics.push(noMetaKeyWordsUrls);
var categorizedUrlsPercentage = tools.createSingleGroupMetric('categorizedUrlsPercentage', 'primitive');
categorizedUrlsPercentage.name = '% Categorized Urls';
percentageMetrics.push(categorizedUrlsPercentage);
var noCategorizedUrlsPercentage = tools.createSingleGroupMetric('noCategorizedUrlsPercentage', 'primitive');
noCategorizedUrlsPercentage.name = '% NoCategorized Urls';
percentageMetrics.push(noCategorizedUrlsPercentage);
var noMetaKeyWordsUrlsPercentage = tools.createSingleGroupMetric('noMetaKeyWordsUrlsPercentage', 'primitive');
noMetaKeyWordsUrlsPercentage.name = '% NoMetaKeywords Urls';
percentageMetrics.push(noMetaKeyWordsUrlsPercentage);
var changeCategoriesUrls = tools.createSingleGroupMetric('changeCategoriesUrls', 'primitive');
changeCategoriesUrls.name = 'Change Categories Urls';
primitiveMetrics.push(changeCategoriesUrls);

var totalUsers = tools.createSingleGroupMetric('totalUsers', 'primitive');
totalUsers.name = 'Total Users';
primitiveMetrics.push(totalUsers);
var categorizedUsers = tools.createSingleGroupMetric('categorizedUsers', 'primitive');
categorizedUsers.name = 'Total Users';
primitiveMetrics.push(categorizedUsers);
var noCategorizedUsers = tools.createSingleGroupMetric('noCategorizedUsers', 'primitive');
noCategorizedUsers.name = 'Total Users';
primitiveMetrics.push(noCategorizedUsers);
var categorizedUsersPercentage = tools.createSingleGroupMetric('categorizedUsersPercentage', 'primitive');
categorizedUsersPercentage.name = '% Categorized Users';
percentageMetrics.push(categorizedUsersPercentage);
var noCategorizedUsersPercentage = tools.createSingleGroupMetric('noCategorizedUsersPercentage', 'primitive');
noCategorizedUsers.name = '% NoCategorized Users';
percentageMetrics.push(noCategorizedUsersPercentage);
var changeCategoriesUsers = tools.createSingleGroupMetric('changeCategoriesUsers', 'primitive');
changeCategoriesUsers.name = 'Change Categories Users';
primitiveMetrics.push(changeCategoriesUsers);

//MultiGroupMetrics
var glassEyeClicks = tools.createMultiGroupMetric('glassEyeClicks', 'types', 'clicks');
glassEyeClicks.name = 'GlassEyeClicks';
multiGroupMetrics.push(glassEyeClicks);
var sharingPreferences = tools.createMultiGroupMetric('sharingPreferences', 'types', 'clicks');
sharingPreferences.name = 'Sharing Preferences';
multiGroupMetrics.push(sharingPreferences);
var impressionsbyBrowser = tools.createMultiGroupMetric('impressionsbyBrowser', 'browser', 'impressions');
impressionsbyBrowser.name = 'Impresions by Browser';
multiGroupMetrics.push(impressionsbyBrowser);
var impressionsbyDevicetype = tools.createMultiGroupMetric('impressionsbyDevicetype', 'device', 'impressions');
impressionsbyDevicetype.name = 'Impresions by Device Type';
multiGroupMetrics.push(impressionsbyDevicetype);
var impressionsbyOS = tools.createMultiGroupMetric('impressionsbyOS', 'os', 'impressions');
impressionsbyOS.name = 'Impresions by OS';
multiGroupMetrics.push(impressionsbyOS);
var screenResolution = tools.createMultiGroupMetric('screenResolution', 'resolution', 'users');
screenResolution.name = 'Screen Resolution';
multiGroupMetrics.push(screenResolution);
var categories = tools.createMultiGroupMetric('categories', 'categories', 'visits');
categories.name = 'Categories';
multiGroupMetrics.push(categories);
var mobileTypes = tools.createMultiGroupMetric('mobileTypes', 'types', 'impressions');
mobileTypes.name = 'Mobile Types';
multiGroupMetrics.push(mobileTypes);
var tabletTypes = tools.createMultiGroupMetric('tabletTypes', 'types', 'impressions');
tabletTypes.name = 'Tablet Types';
multiGroupMetrics.push(tabletTypes);
var expandsVSminimizations = tools.createMultiGroupMetric('expandsVSminimizations', 'action', 'clicks');
expandsVSminimizations.name = 'Expands vs Minimizations';
multiGroupMetrics.push(expandsVSminimizations);

//Layouts Glass
var glass1Layouts = ['template7wg'];
var glass2Layouts = ['template9wg'];
var glass3Layouts = ['template14wg', 'template4wg'];
var glass4Layouts = ['template2wg'];

// Authenticator
/*var auth = express.basicAuth(function (user, pass, callback) {
	var result = (user === 'test' && pass === 'test');
	callback(null , result);
});
*/

function basicAuth(username, password) {
	var result = (user === 'test' && pass === 'test');
	return result;
}

app.configure(function() {
	app.use(passport.initialize());
});

var auth = passport.authenticate(['basic', 'bearer'], {
	session: false
});

passport.use(new BasicStrategy(
	function(username, password, done) {
		var result = (username === 'test' && password === 'test');
		return done(null, result);
	}));


passport.use(new BearerStrategy({},
	function(token, done) {
		console.log('Bearer: ' + token);
		var result = (token === 'memento');
		return done(null, result);
	}));


app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, Accept, Produce, Content-Type, X-Requested-With, Authorization, Token');
	res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, HEAD, OPTIONS');
	//res.header('Cache-Control', 'no-cache, must-revalidate');
	//res.header('Expires', new Date());
	next();
});


function createMetricWidget(order, title, metric, spec) {
	var chart0,
		chart1,
		chart2 = tools.createChart(3, 'Average', 'table', [metric], spec, averageOperation),
		chart3 = tools.createChart(4, 'Best Result', 'table', [metric], spec, greatestOperation),
		chart4;
	if (spec.interval === 'lastDay') {
		chart0 = tools.createChart(0, '', 'table', [metric], spec, lastOperation);
		chart1 = tools.createChart(1, 'Evolution', 'line', [metric], spec, subtractOperation);
		chart4 = tools.createChart(2, '% change', 'colorizedTable', [metric], lastTwoDaysTimeIntervalSpec, percentageOperation);
	} else {
		chart0 = tools.createChart(0, '', 'table', [metric], spec, sumOperation);
		chart1 = tools.createChart(1, 'Evolution', 'line', [metric], spec);
		if (spec.interval === 'lastWeek') {
			chart4 = tools.createChart(2, '% change', 'colorizedTable', [metric], lastTwoWeeksTimeIntervalSpec, percentageOperation);
		}
		if (spec.interval === 'lastMonth') {
			chart4 = tools.createChart(2, '% change', 'colorizedTable', [metric], lastTwoMonthsTimeIntervalSpec, percentageOperation);
		}
	}
	return tools.createWidget(order, title, [chart0, chart1, chart2, chart3, chart4]);

}

function generateDates(timeInterval, lastResult, start, end, granularity) {
	var dates = [];
	if (lastResult) {
		return [new Date()];
	}
	switch (timeInterval) {
		case 'lastDay':
			var lastDay = moment(new Date().setHours(0, 0, 0, 0)).subtract('d', 1);
			for (var i = 0; i < moment().hour(); i++) {
				dates.push(new Date(lastDay.add('h', 1)));
			}
			break;
		case 'lastWeek':
			var firstDayWeek = moment().subtract('w', 1).weekday(0);
			for (i = 0; i < moment().subtract('w', 1).weekday(); i++) {
				dates.push(new Date(firstDayWeek.add('d', 1)));
			}
			break;
		case 'lastMonth':
			var firstDayMonth = moment().subtract('M', 1).date(0);
			var firstDayNextMonth = moment().subtract('M', 2).date(0);
			var difference = firstDayMonth.diff(firstDayNextMonth, 'days');
			for (i = 0; i < difference; i++) {
				dates.push(new Date(firstDayMonth.add('d', 1)));
			}
			break;
		case 'lastTwoDays':
			var lastTwoDays = moment(new Date().setHours(0, 0, 0, 0)).subtract('d', 2);
			dates.push(lastTwoDays);
			dates.push(lastTwoDays.add('d', 1));
			break;
		case 'lastTwoWeeks':
			var lastTwoWeeks = moment().subtract('w', 2).weekday(0);
			dates.push(lastTwoWeeks);
			dates.push(lastTwoWeeks.add('w', 1));
			break;
		case 'lastTwoMonths':
			var lastTwoMonths = moment().subtract('m', 2).date(0);
			dates.push(lastTwoMonths);
			dates.push(lastTwoMonths.add('m', 1));
			break;
		case 'custom':
			console.log('start = ' + start);
			console.log('end = ' + end);
			console.log('granularity = ' + granularity);
			var first = moment(start, 'DD-MM-YYYY');
			var last = moment(end, 'DD-MM-YYYY');
			var items = 0;
			var timeMeasurement = '';
			switch (granularity) {
				case 'hourly':
					items = last.diff(first, 'hours');
					timeMeasurement = 'h';
					break;
				case 'daily':
					items = last.diff(first, 'days');
					timeMeasurement = 'd';
					break;
				case 'weekly':
					items = last.diff(first, 'weeks');
					break;
				case 'monthly':
					items = last.diff(first, 'months');
					break;
			}
			for (i = 0; i < items; i++) {
				dates.push(new Date(first.add(timeMeasurement, 1)));
			}
			break;
	}
	return dates;
}

app.get('/memento-analytics-service/dashboards;filter=own', auth, function(req, res) {
	console.log('Get owned dashboards');

	res.json(200, [
		tools.createDashboard(1, 'Users (Daily)', glass1Layouts, moment(new Date()).subtract('y', 3), moment(new Date()).subtract('d', 1), 'test'),
		tools.createDashboard(2, 'URL\'s (Daily)', glass2Layouts, moment(new Date()).subtract('d', 18), moment(new Date()).subtract('d', 2), 'test'),
		tools.createDashboard(3, 'KPI DE GE (Daily)', glass3Layouts, moment(new Date()).subtract('d', 17), moment(new Date()).subtract('d', 3), 'test'),
		tools.createDashboard(4, 'Users (Weekly)', glass1Layouts, moment(new Date()).subtract('M', 3), moment(new Date()).subtract('d', 4), 'test'),
		tools.createDashboard(5, 'URL\'s (Weekly)', glass2Layouts, moment(new Date()).subtract('d', 15), moment(new Date()).subtract('d', 5), 'test'),
		tools.createDashboard(6, 'KPI DE GE (Weekly)', glass3Layouts, moment(new Date()).subtract('d', 14), moment(new Date()).subtract('d', 6), 'test'),
		tools.createDashboard(7, 'Users (Monthly)', glass1Layouts, moment(new Date()).subtract('d', 13), moment(new Date()).subtract('d', 7), 'test'),
		tools.createDashboard(8, 'URL\'s (Monthly)', glass2Layouts, moment(new Date()).subtract('d', 12), moment(new Date()).subtract('d', 8), 'test'),
		tools.createDashboard(9, 'KPI DE GE (Monthly)', glass3Layouts, moment(new Date()).subtract('d', 11), moment(new Date()).subtract('d', 9), 'test'),
		tools.createDashboard(11, 'AGGREGATION', glass4Layouts, moment(new Date()).subtract('d', 11), moment(new Date()).subtract('d', 10), 'test'),
		tools.createDashboard(12, 'PERIOD', glass4Layouts, moment(new Date()).subtract('d', 11), moment(new Date()).subtract('d', 10), 'test')
	]);
});

app.get('/memento-analytics-service/dashboards;filter=third-party', auth, function(req, res) {
	console.log('Get third party dashboards');

	res.json(200, [
		tools.createDashboard(15, 'Compartido 15', glass1Layouts, moment(new Date()).subtract('y', 3), moment(new Date()).subtract('d', 1), 'otherUser1'),
		tools.createDashboard(16, 'Compartido 16', glass2Layouts, moment(new Date()).subtract('d', 18), moment(new Date()).subtract('d', 2), 'otherUser2'),
		tools.createDashboard(17, 'Compartido 17', glass3Layouts, moment(new Date()).subtract('d', 17), moment(new Date()).subtract('d', 3), 'otherUser1'),
		tools.createDashboard(18, 'Compartido 18', glass1Layouts, moment(new Date()).subtract('d', 17), moment(new Date()).subtract('d', 3), 'otherUser2'),
		tools.createDashboard(20, 'Compartido 20', glass3Layouts, moment(new Date()).subtract('d', 17), moment(new Date()).subtract('d', 3), 'otherUser2'),
		tools.createDashboard(21, 'Compartido 21', glass1Layouts, moment(new Date()).subtract('d', 17), moment(new Date()).subtract('d', 3), 'otherUser2'),
		tools.createDashboard(22, 'Compartido 22', glass2Layouts, moment(new Date()).subtract('d', 17), moment(new Date()).subtract('d', 3), 'otherUser1'),
		tools.createDashboard(23, 'Compartido 23', glass3Layouts, moment(new Date()).subtract('d', 17), moment(new Date()).subtract('d', 3), 'otherUser2')
	]);
});

app.get('^\/memento-analytics-service\/dashboards\/1', auth, function(req, res) {
	console.log('Get dashboard 1');
	//Widgets Glass 1 Daily
	var widgetsGlass1Daily = [
		createMetricWidget(1, 'Total Users', totalUsers, dailyTimeIntervalSpec),
		createMetricWidget(2, 'Categorized Users', categorizedUsers, dailyTimeIntervalSpec),
		createMetricWidget(3, 'No Categorized Users', noCategorizedUsers, dailyTimeIntervalSpec),
		createMetricWidget(4, 'Changed Categories Users', changeCategoriesUsers, dailyTimeIntervalSpec)
	];
	res.json(200, tools.createDashboard(1, 'Users (Daily)', glass1Layouts, moment(new Date()).subtract('y', 3), new Date(), 'test', widgetsGlass1Daily, 'daily'));
});

app.get('^\/memento-analytics-service\/dashboards\/2', auth, function(req, res) {
	console.log('Get dashboard 2');
	//Widgets Glass 2 Daily
	var widgetsGlass2Daily = [
		createMetricWidget(1, 'Total Urls', totalUrls, dailyTimeIntervalSpec),
		createMetricWidget(2, 'Categorized Urls', categorizedUrls, dailyTimeIntervalSpec),
		createMetricWidget(3, 'No Categorized Urls', noCategorizedUrls, dailyTimeIntervalSpec),
		createMetricWidget(4, 'Meta Keywords Urls', noMetaKeyWordsUrls, dailyTimeIntervalSpec),
		createMetricWidget(5, 'Changed Categories Urls', changeCategoriesUrls, dailyTimeIntervalSpec)
	];
	res.json(200, tools.createDashboard(2, 'URL\'s (Daily)', glass2Layouts, new Date(), new Date(), 'test', widgetsGlass2Daily, 'daily'));
});

app.get('^\/memento-analytics-service\/dashboards\/3', auth, function(req, res) {
	console.log('Get dashboard 3');
	//Charts Glass 3 Daily
	var chartsGlass3Daily = [tools.createChart(0, '', 'bar', [expands], dailyTimeIntervalSpec, subtractOperation),
		tools.createChart(0, '', 'multiGroupLines', [expandsVSminimizations], dailyTimeIntervalSpec, subtractOperation),
		tools.createChart(0, '', 'lines', [expands], dailyTimeIntervalSpec, subtractOperation),
		tools.createChart(0, '', 'horizontalBar', [impressionsbyDevicetype], dailyTimeIntervalSpec, lastOperation),
		tools.createChart(0, '', 'multiGroupPie', [categories], dailyTimeIntervalSpec, lastOperation),
		tools.createChart(0, '', 'multiGroupLines', [impressionsbyDevicetype], dailyTimeIntervalSpec, subtractOperation),
		tools.createChart(0, '', 'multiGroupTable', [impressionsbyOS], dailyTimeIntervalSpec, lastOperation),
		tools.createChart(0, '', 'multiGroupLines', [mobileTypes], dailyTimeIntervalSpec, subtractOperation),
		tools.createChart(0, '', 'multiGroupLines', [tabletTypes], dailyTimeIntervalSpec, subtractOperation),
		tools.createChart(0, '', 'multiGroupLines', [glassEyeClicks], dailyTimeIntervalSpec, subtractOperation),
		tools.createChart(0, '', 'multiGroupPie', [sharingPreferences], dailyTimeIntervalSpec, lastOperation)
	];

	//Widgets Glass 3 Daily
	var widgetsGlass3Daily = [
		createMetricWidget(3, 'New users', newUsers, dailyTimeIntervalSpec),
		createMetricWidget(4, 'Usage rate', usageRate, dailyTimeIntervalSpec),
		tools.createWidget(5, 'Expands by hours interval', [chartsGlass3Daily[0]]),
		tools.createWidget(6, 'Expands Vs Minimizations', [chartsGlass3Daily[1]]),
		tools.createWidget(7, 'GlassEyeClicks', [chartsGlass3Daily[9]]),
		tools.createWidget(9, 'Sharing Preferences', [chartsGlass3Daily[10]]),
		tools.createWidget(10, 'Impresions by OS', [chartsGlass3Daily[6]]),
		tools.createWidget(11, 'Impresions by Browser', [chartsGlass3Daily[2]]),
		tools.createWidget(12, 'Impresions by Device Type', [chartsGlass3Daily[3]]),
		tools.createWidget(14, 'Categories', [chartsGlass3Daily[4]]),
		tools.createWidget(16, 'Impresions by Device', [chartsGlass3Daily[5]]),
		tools.createWidget(17, 'Mobile Types', [chartsGlass3Daily[7]]),
		tools.createWidget(18, 'Tablet Types', [chartsGlass3Daily[8]]),
		createMetricWidget(2, 'Active users', activeUsers, dailyTimeIntervalSpec),
		createMetricWidget(1, 'Installations', installations, dailyTimeIntervalSpec)
	];
	res.json(200, tools.createDashboard(3, 'KPI DE GE (Daily)', glass3Layouts, new Date(), new Date(), 'test', widgetsGlass3Daily, 'daily'));
});

app.get('^\/memento-analytics-service\/dashboards\/4', auth, function(req, res) {
	console.log('Get dashboard 4');
	//Widgets Glass 1 Current Week
	var widgetsGlass1Weekly = [
		createMetricWidget(1, 'Total Users', totalUsers, lastWeekTimeIntervalSpec),
		createMetricWidget(2, 'Categorized Users', categorizedUsers, lastWeekTimeIntervalSpec),
		createMetricWidget(3, 'No Categorized Users', noCategorizedUsers, lastWeekTimeIntervalSpec),
		createMetricWidget(4, 'Changed Categories Users', changeCategoriesUsers, lastWeekTimeIntervalSpec)
	];
	var glassDashboard4 = tools.createDashboard(4, 'Users (Weekly)', glass1Layouts, moment(new Date()).subtract('M', 3), new Date(), 'test',
		widgetsGlass1Weekly, 'weekly');
	res.json(200, glassDashboard4);
});

app.get('^\/memento-analytics-service\/dashboards\/5', auth, function(req, res) {
	console.log('Get dashboard 5');
	//Widgets Glass 2 Current Week
	var widgetsGlass2Weekly = [
		createMetricWidget(1, 'Total Urls', totalUrls, lastWeekTimeIntervalSpec),
		createMetricWidget(2, 'Categorized Urls', categorizedUrls, lastWeekTimeIntervalSpec),
		createMetricWidget(3, 'No Categorized Urls', noCategorizedUrls, lastWeekTimeIntervalSpec),
		createMetricWidget(4, 'Meta Keywords Urls', noMetaKeyWordsUrls, lastWeekTimeIntervalSpec),
		createMetricWidget(5, 'Changed Categories Urls', changeCategoriesUrls, lastWeekTimeIntervalSpec)
	];
	var glassDashboard5 = tools.createDashboard(5, 'URL\'s (Weekly)', glass2Layouts, new Date(), new Date(), 'test',
		widgetsGlass2Weekly, 'weekly');
	res.json(200, glassDashboard5);
});

app.get('^\/memento-analytics-service\/dashboards\/6', auth, function(req, res) {
	console.log('Get dashboard 6');
	//Charts Glass 3 Current Week
	var chartsGlass3Weekly = [tools.createChart(0, '', 'bar', [expands], lastWeekTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupLines', [expandsVSminimizations], lastWeekTimeIntervalSpec),
		tools.createChart(0, '', 'horizontalBar', [impressionsbyBrowser], lastWeekTimeIntervalSpec, sumOperation),
		tools.createChart(0, '', 'horizontalBar', [impressionsbyDevicetype], lastWeekTimeIntervalSpec, sumOperation),
		tools.createChart(0, '', 'horizontalBar', [categories], lastWeekTimeIntervalSpec, sumOperation),
		tools.createChart(0, '', 'multiGroupLines', [impressionsbyDevicetype], lastWeekTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupTable', [impressionsbyOS], lastWeekTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupLines', [mobileTypes], lastWeekTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupLines', [tabletTypes], lastWeekTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupLines', [glassEyeClicks], lastWeekTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupPie', [sharingPreferences], lastWeekTimeIntervalSpec, sumOperation)
	];

	//Widgets Glass 3 Current Week
	var widgetsGlass3Weekly = [
		createMetricWidget(3, 'New users', newUsers, lastWeekTimeIntervalSpec),
		createMetricWidget(4, 'Usage rate', usageRate, lastWeekTimeIntervalSpec),
		tools.createWidget(5, 'Expands by hours interval', [chartsGlass3Weekly[0]]),
		tools.createWidget(6, 'Expands Vs Minimizations', [chartsGlass3Weekly[1]]),
		tools.createWidget(7, 'GlassEyeClicks', [chartsGlass3Weekly[9]]),
		tools.createWidget(9, 'Sharing Preferences', [chartsGlass3Weekly[10]]),
		tools.createWidget(10, 'Impresions by OS', [chartsGlass3Weekly[6]]),
		tools.createWidget(11, 'Impresions by Browser', [chartsGlass3Weekly[2]]),
		tools.createWidget(12, 'Impresions by Device Type', [chartsGlass3Weekly[3]]),
		tools.createWidget(14, 'Categories', [chartsGlass3Weekly[4]]),
		tools.createWidget(16, 'Impresions by Device', [chartsGlass3Weekly[5]]),
		tools.createWidget(17, 'Mobile Types', [chartsGlass3Weekly[7]]),
		tools.createWidget(18, 'Tablet Types', [chartsGlass3Weekly[8]]),
		createMetricWidget(2, 'Active users', activeUsers, lastWeekTimeIntervalSpec),
		createMetricWidget(1, 'Installations', installations, lastWeekTimeIntervalSpec)
	];
	var glassDashboard6 = tools.createDashboard(6, 'KPI DE GE (Weekly)', glass3Layouts, moment(new Date()).subtract('M', 1), new Date(), 'test',
		widgetsGlass3Weekly, 'weekly');
	res.json(200, glassDashboard6);
});

app.get('^\/memento-analytics-service\/dashboards\/7', auth, function(req, res) {
	console.log('Get dashboard 7');
	//Widgets Glass 1 Monthly
	var widgetsGlass1Monthly = [
		createMetricWidget(1, 'Total Users', totalUsers, lastMonthTimeIntervalSpec),
		createMetricWidget(2, 'Categorized Users', categorizedUsers, lastMonthTimeIntervalSpec),
		createMetricWidget(3, 'No Categorized Users', noCategorizedUsers, lastMonthTimeIntervalSpec),
		createMetricWidget(4, 'Changed Categories Users', changeCategoriesUsers, lastMonthTimeIntervalSpec)
	];
	var glassDashboard7 = tools.createDashboard(7, 'Users (Monthly)', glass1Layouts, moment(new Date()).subtract('M', 3), new Date(), 'test',
		widgetsGlass1Monthly, 'monthly');
	res.json(200, glassDashboard7);
});

app.get('^\/memento-analytics-service\/dashboards\/8', auth, function(req, res) {
	console.log('Get dashboard 8');
	//Widgets Glass 2 Monthly
	var widgetsGlass2Monthly = [
		createMetricWidget(1, 'Total Urls', totalUrls, lastMonthTimeIntervalSpec),
		createMetricWidget(2, 'Categorized Urls', categorizedUrls, lastMonthTimeIntervalSpec),
		createMetricWidget(3, 'No Categorized Urls', noCategorizedUrls, lastMonthTimeIntervalSpec),
		createMetricWidget(4, 'Meta Keywords Urls', noMetaKeyWordsUrls, lastMonthTimeIntervalSpec),
		createMetricWidget(5, 'Changed Categories Urls', changeCategoriesUrls, lastMonthTimeIntervalSpec)
	];
	var glassDashboard8 = tools.createDashboard(8, 'URL\'s (Monthly)', glass2Layouts, moment(new Date()).subtract('M', 3), new Date(), 'test',
		widgetsGlass2Monthly, 'monthly');
	res.json(200, glassDashboard8);
});

app.get('^\/memento-analytics-service\/dashboards\/9', auth, function(req, res) {
	console.log('Get dashboard 9');
	//Charts Glass 3 Current Week
	var chartsGlass3Monthly = [tools.createChart(0, '', 'lines', [expands], lastMonthTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupLines', [expandsVSminimizations], lastMonthTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupPie', [impressionsbyBrowser], lastMonthTimeIntervalSpec, sumOperation),
		tools.createChart(0, '', 'multiGroupPie', [impressionsbyDevicetype], lastMonthTimeIntervalSpec, sumOperation),
		tools.createChart(0, '', 'multiGroupPie', [categories], lastMonthTimeIntervalSpec, sumOperation),
		tools.createChart(0, '', 'multiGroupLines', [impressionsbyDevicetype], lastMonthTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupTable', [impressionsbyOS], lastMonthTimeIntervalSpec, sumOperation),
		tools.createChart(0, '', 'multiGroupLines', [mobileTypes], lastMonthTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupLines', [tabletTypes], lastMonthTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupLines', [glassEyeClicks], lastMonthTimeIntervalSpec),
		tools.createChart(0, '', 'multiGroupPie', [sharingPreferences], lastMonthTimeIntervalSpec, sumOperation)
	];

	//Widgets Glass 3 Monthly
	var widgetsGlass3Monthly = [
		createMetricWidget(3, 'New users', newUsers, lastMonthTimeIntervalSpec),
		createMetricWidget(4, 'Usage rate', usageRate, lastMonthTimeIntervalSpec),
		tools.createWidget(5, 'Expands by hours interval', [chartsGlass3Monthly[0]]),
		tools.createWidget(6, 'Expands Vs Minimizations', [chartsGlass3Monthly[1]]),
		tools.createWidget(7, 'GlassEyeClicks', [chartsGlass3Monthly[9]]),
		tools.createWidget(9, 'Sharing Preferences', [chartsGlass3Monthly[10]]),
		tools.createWidget(10, 'Impresions by OS', [chartsGlass3Monthly[6]]),
		tools.createWidget(11, 'Impresions by Browser', [chartsGlass3Monthly[2]]),
		tools.createWidget(12, 'Impresions by Device Type', [chartsGlass3Monthly[3]]),
		tools.createWidget(14, 'Categories', [chartsGlass3Monthly[4]]),
		tools.createWidget(16, 'Impresions by Device', [chartsGlass3Monthly[5]]),
		tools.createWidget(17, 'Mobile Types', [chartsGlass3Monthly[7]]),
		tools.createWidget(18, 'Tablet Types', [chartsGlass3Monthly[8]]),
		createMetricWidget(2, 'Active users', activeUsers, lastMonthTimeIntervalSpec),
		createMetricWidget(1, 'Installations', installations, lastMonthTimeIntervalSpec)
	];

	var glassDashboard9 = tools.createDashboard(9, 'KPI DE GE (Monthly)', glass3Layouts, new Date(), new Date(), 'test',
		widgetsGlass3Monthly, 'monthly');
	res.json(200, glassDashboard9);
});

app.get('^\/memento-analytics-service\/dashboards\/10', auth, function(req, res) {
	console.log('Get dashboard 10');

	var glassDashboard10 = tools.createDashboard(10, 'Prueba', glass4Layouts, new Date(), new Date(), 'test',
		null);
	res.json(200, glassDashboard10);
});

app.get('^\/memento-analytics-service\/dashboards\/11', auth, function(req, res) {
	console.log('Get dashboard 11');
	//Widgets Glass 1 Current Week
	var chart1 = tools.createChart(0, '', 'table', [expands], aggregationSpec);
	var chart2 = tools.createChart(0, '', 'bar', [expands], lastWeekTimeIntervalSpec);
	var widget1 = tools.createWidget(1, 'Bar Showns', [chart1]);
	var widget2 = tools.createWidget(2, 'Bar Showns 2', [chart2]);
	var glassDashboard11 = tools.createDashboard(11, 'AGGREGATION', glass4Layouts, moment(new Date()).subtract('M', 3), new Date(), 'test', [widget1, widget2], 'weekly');
	res.json(200, glassDashboard11);
});

app.get('^\/memento-analytics-service\/dashboards\/12', auth, function(req, res) {
	console.log('Get dashboard 12');
	//Widgets Glass 1 Current Week
	var chart1 = tools.createChart(0, '', 'bar', [expands], combinedSpec);
	var chart2 = tools.createChart(0, '', 'bar', [expands], andSpec2);
	var widget1 = tools.createWidget(1, 'Bar Showns', [chart1]);
	var widget2 = tools.createWidget(2, 'Bar Showns 2', [chart2]);
	var glassDashboard12 = tools.createDashboard(12, 'PERIOD', glass4Layouts, moment(new Date()).subtract('M', 3), new Date(), 'test', [widget2], 'weekly');
	res.json(200, glassDashboard12);
});

app.get('^\/memento-analytics-service\/metrics\/single-group\/primitive', auth, function(req, res) {
	res.json(200, primitiveMetrics);
});

app.get('^\/memento-analytics-service\/metrics\/single-group\/percentage', auth, function(req, res) {
	res.json(200, percentageMetrics);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group', auth, function(req, res) {
	res.json(200, multiGroupMetrics);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/glassEyeClicks\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('KeyWords', Math.floor((Math.random() * 100) + 1)),
				tools.createMultiResult('Sponsored ADS', Math.floor((Math.random() * 100) + 1)),
				tools.createMultiResult('Searchs', Math.floor((Math.random() * 100) + 1)),
				tools.createMultiResult('Natural Research', Math.floor((Math.random() * 100) + 1))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/sharingPreferences\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('Twitter', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('LinkedIn', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('FaceBook', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Email', Math.floor((Math.random() * 10) + 1))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/impressionsbyDevicetype\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('Tablet', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Mobile', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('DMR', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Computer', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Game console', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Unknown', Math.floor((Math.random() * 10) + 1))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/mobileTypes\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('Type1', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Type2', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Type3', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Type4', Math.floor((Math.random() * 10) + 1))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/tabletTypes\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('Type1', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Type2', Math.floor((Math.random() * 10) + 1))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/expandsVSminimizations\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('Expands', Math.floor((Math.random() * 1005007000) + 22564622222)),
				tools.createMultiResult('Minimizations', Math.floor((Math.random() * 1005007000) + 1111556651))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/impressionsbyBrowser\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('FireFox', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Safari', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Chrome', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('iExplorer', Math.floor((Math.random() * 10) + 1))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/impressionsbyOS\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('Windows', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Android', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('IOS', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Linux', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Symbian', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Blackberry', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Others', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Unknown', Math.floor((Math.random() * 10) + 1))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/categories\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createGroupResult(
			[tools.createMultiResult('Cat1', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Cat2', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Cat3', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Cat4', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Cat5', Math.floor((Math.random() * 10) + 1)),
				tools.createMultiResult('Cat6', Math.floor((Math.random() * 10) + 1))
			],
			dates[i]));
	}
	res.json(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/single-group\/primitive\/*\/results*$', auth, function(req, res) {
	var timeInterval = 'lastDay';
	if (req.param('timeInterval')) {
		timeInterval = req.param('timeInterval');
	}
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	var value = Math.floor((Math.random() * 1000) + 1);
	for (var i = 0; i < dates.length; i++) {
		result = tools.createSingleResult(value, dates[i]);
		value += Math.floor((Math.random() * 1000) + 1);
		results.push(result);
	}
	res.send(200, results);
});

app.get('^\/memento-analytics-service\/metrics\/single-group\/percentage\/*\/results*$', auth, function(req, res) {
	var timeInterval = req.param('timeInterval');
	var lastResult = req.param('last');
	var start = req.param('start');
	var end = req.param('end');
	var granularity = req.param('granularity');
	var dates = generateDates(timeInterval, lastResult, start, end, granularity);
	var results = [];
	for (var i = 0; i < dates.length; i++) {
		results.push(tools.createSingleResult(Math.floor((Math.random() * 10) + 1), dates[i]));
	}
	res.json(200, results);
});


app.get('^\/memento-analytics-service\/data*$', auth, function(req, res) {
	var query = simpleSqlParser.sql2ast(req.param('query'));
	console.log(query);	
	var granularity = jsonQuery('GROUP BY[].column', {
		data: query
	}).value;
	console.log('granularity = '+granularity);
	var results = [];
	if (granularity) {
			var start = '01/10/2014';
			var end = '10/10/2014';
			var timeInterval = 'custom';
			var dates = generateDates(timeInterval, null, start, end, granularity);
			var values = [];
			for (var i = 0; i < dates.length; i++) {
				values.push(tools.createDateResult(dates[i], Math.floor((Math.random() * 10) + 1)));
			}		
			results.push(tools.createMultiResult('Group',values));
	}
	else {
		results.push(tools.createMultiResult('Group'+i,
				[tools.createResult('Windows', Math.floor((Math.random() * 10) + 1)),
				tools.createResult('Android', Math.floor((Math.random() * 10) + 1)),
				tools.createResult('IOS', Math.floor((Math.random() * 10) + 1)),
				tools.createResult('Linux', Math.floor((Math.random() * 10) + 1)),
				tools.createResult('Symbian', Math.floor((Math.random() * 10) + 1)),
				tools.createResult('Blackberry', Math.floor((Math.random() * 10) + 1)),
				tools.createResult('Others', Math.floor((Math.random() * 10) + 1)),
				tools.createResult('Unknown', Math.floor((Math.random() * 10) + 1))
			]
		));
	}
	console.log('results = '+results);
	res.json(200, results);
});

function getData() {
	return [
		{key: 'Cumulative Return',
		values: [{
			'label': 'A',
			'value': -29.765957771107
		}, {
			'label': 'B',
			'value': 0
		}, {
			'label': 'C',
			'value': 32.807804682612
		}, {
			'label': 'D',
			'value': 196.45946739256
		}, {
			'label': 'E',
			'value': 0.19434030906893
		}, {
			'label': 'F',
			'value': -98.079782601442
		}, {
			'label': 'G',
			'value': -13.925743130903
		}, {
			'label': 'H',
			'value': -5.1387322875705
		}]
	}];
}

app.get('^\/memento-analytics-service\/metrics\/single-group\/primitive\/*$', auth, function(req, res) {
	for (var i = 0; i < primitiveMetrics.length; i++) {
		var metric = primitiveMetrics[i];
		if (metric.key === req.params[0]) {
			res.json(200, metric);
			return;
		}
	}
	res.status(404).send;
});

app.get('^\/memento-analytics-service\/metrics\/single-group\/percentage\/*$', auth, function(req, res) {
	for (var i = 0; i < percentageMetrics.length; i++) {
		var metric = percentageMetrics[i];
		if (metric.key === req.params[0]) {
			res.json(200, metric);
			return;
		}
	}
	res.send(404);
});

app.get('^\/memento-analytics-service\/metrics\/multi-group\/*$', auth, function(req, res) {
	for (var i = 0; i < multiGroupMetrics.length; i++) {
		var metric = multiGroupMetrics[i];
		if (metric.key === req.params[0]) {
			res.json(200, metric);
			return;
		}
	}
	res.send(404);
});

app.post('^\/memento-analytics-service\/dashboards', function(req, res) {
	res.json(201, {
		'id': '10'
	});
});

app.put('^\/memento-analytics-service\/dashboards\/*\/widgets\/*$', function(req, res) {
	res.send(200);
});

app.post('^\/memento-analytics-service\/dashboards\/*\/widgets', function(req, res) {
	res.send(201);
});

app.delete('^\/memento-analytics-service\/dashboards\/*$', function(req, res) {
	res.send();
});

app.get('/memento-analytics-service/customers/1', function(req, res) {
	res.statusCode = 200;
	res.json({
		'id': 1,
		'name': 'pyro'
	});
});


app.get('/memento-security-service/users/me', function(req, res) {
	var response = {
		'id': 11,
		'username': 'test',
		'customerId': 1,
		'roles': ['READER', 'DATA_SENDER'],
		'logo': 'http://localhost:3001/memento-security-service/customers/1/logo'
	};
	console.log('User ' + req.get('Authorization') + ' is trying to authenticate');

	var rightBasicAuth = 'Basic dGVzdDp0ZXN0'; // Base64 encoded test:test
	var rightTokenAuth = 'bearer memento'; // token 
	if ((req.get('Authorization') === rightBasicAuth) || (req.get('Authorization') === rightTokenAuth)) {
		res.statusCode = 200;
		res.json(response);
		return;
	}
	res.send(401);
});


app.get('/memento-security-service/customers/1/logo', function(req, res) {
	fs.readFile('./test/resources/logo.png', function(err, data) {
		if (!err) {
			res.writeHead(200, {
				'Content-Type': 'application/octet-stream'
			});
			res.end(data);
		} else {
			console.log(err);
			res.send(404);
		}
	});
});


app.listen(process.argv[2]);
console.log('Mock server listening on ' + process.argv[2]);