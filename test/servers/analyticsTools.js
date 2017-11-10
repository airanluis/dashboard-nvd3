function createChart (order, title, type, metrics, spec, operation) {
	var chart = {};
	chart.order = order;
	chart.title = title;
	chart.type = type;
	chart.metrics = metrics;
	chart.spec = spec;
	if (operation) {
		chart.resultsOperation = operation;
	}
	return chart;
}

function createSingleGroupMetric (key, type) {
	var metric = {};
	metric.key = key;
	metric.groupType = 'singleGroup';
	metric.type = type;
	return metric;
}

function createMultiGroupMetric (key, groupslabel, valueslabel) {
	var metric = {};
	metric.key = key;
	metric.groupType = 'multiGroup';
	metric.type = 'primitive';
	metric.groupslabel = groupslabel;
	metric.valueslabel = valueslabel;
	return metric;
}

function createWidget (position, title, charts) {
	var widget = {};
	widget.title = title;
	widget.position = position;
	widget.charts = charts;
	return widget;
}

function createDashboard (id, title, layouts, creationDate, modificationDate, owner, widgets, period) {
	var dashboard = {};
	dashboard.id = id;
	dashboard.title = title;
	dashboard.layouts = layouts;
	dashboard.creationDate = creationDate;
	dashboard.modificationDate = modificationDate;
	dashboard.owner = owner;
	dashboard.widgets = widgets;
	dashboard.period = period;
	return dashboard;
}

function createLastSpec () {
	return createSpec('last');
}

function createTimeIntervalSpec(interval) {
	var spec = createSpec('interval');
	spec.interval = interval;
	return spec;
}

function createCustomTimeIntervalSpec(start, end) {
	var spec = createSpec('customInterval');
	spec.interval = 'custom';
	if (start) {
		spec.start = start;
	}
	if (end) {
		spec.end = end;
	}
	return spec;
}

function createLastOfPeriodSpec(granularity) {
	var spec = createSpec('granularity');
	spec.granularity = granularity;
	return spec;
}



function createAggregationSpec(aggregation) {
	var spec = createSpec('aggregation');
	spec.aggregation = aggregation;
	return spec;
}

function createPeriodSpec(period) {
	var spec = createSpec('period');
	spec.period = period;
	return spec;
}

function createAndSpec(specs) {
	var spec = createSpec('and');
	spec.components = specs;
	return spec;
}

function createGroupBySpec(groupBy) {
	var spec = createSpec('groupBy');
	spec.groupBy = groupBy;
	return spec;
}

function createSpec(type) {
	var spec = {};
	spec.type = type;
	return spec;
}

function createOperation (type) {
	var operation = {};
	operation.type = type;
	return operation;
}

function createSingleResult (value, date) {
	var result = {};
	result.value = value.toString();
	result.date = new Date(date).getTime();
	return result;
}

function createResult (label, value) {
	var result = {};
	result.label = label;
	result.value = value.toString();
	return result;
}

function createDateResult (date, value) {
	var result = {};
	result.label = new Date(date).getTime();
	result.value = value.toString();
	return result;
}

function createMultiResult (key, values) {
	var multiResult = {};
	multiResult.key = key;
	multiResult.values = values;
	return multiResult;
}

module.exports = {
	createChart: createChart,
	createSingleGroupMetric: createSingleGroupMetric,
	createMultiGroupMetric: createMultiGroupMetric,
	createWidget: createWidget,
	createDashboard: createDashboard,
	createLastSpec: createLastSpec,
	createTimeIntervalSpec: createTimeIntervalSpec,
	createCustomTimeIntervalSpec: createCustomTimeIntervalSpec,
	createLastOfPeriodSpec: createLastOfPeriodSpec,
	createOperation: createOperation,
	createSingleResult: createSingleResult,
	createMultiResult: createMultiResult,
	createDateResult: createDateResult,
	createResult: createResult,
	createAggregationSpec:createAggregationSpec,
	createPeriodSpec : createPeriodSpec,
	createAndSpec: createAndSpec,
	createGroupBySpec:createGroupBySpec
};