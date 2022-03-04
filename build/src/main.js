/*
 * FILTERS
 */

const filterParamsNumber = {
	filterOptions: ['equals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'],
	defaultOption: 'greaterThanOrEqual',
	debounceMs: 100,
};
const filterParamsText = {
	filterOptions: ['equals', 'notEqual', 'contains', 'notContains', 'startsWith', 'endsWith'],
	defaultOption: 'contains',
	debounceMs: 100,
};
const filterParamsBoolean = {
	filterOptions: ['contains'],
	defaultOption: 'contains',
	suppressAndOrCondition: true,
	textFormatter: function (r) {
		if (r == null) return null;
		return r
			.toLowerCase()
			.replace(/[yx1]/g, 'true');
		},
	debounceMs: 0,
};

/*
 * FORMATTERS
 */

function booleanFormatter(params) {
	return (params.value === true || params.value === 'true') ? '✔️' : '❌';
}

/*
 * KEYBOARD
 */

document.addEventListener('keydown', function(event) {
	if (event.altKey && event.key === 'c') {
		navigator.clipboard.writeText(gridOptions.api.getDataAsCsv({
			skipColumnGroupHeaders: true,
			skipColumnHeaders: false,
			allColumns: false,
			onlySelected: true,
		}));
	}
	if (event.altKey && event.key === 'a') {
		navigator.clipboard.writeText(gridOptions.api.getDataAsCsv({
			skipColumnGroupHeaders: true,
			skipColumnHeaders: false,
			allColumns: true,
			onlySelected: true,
		}));
	}
	if (event.ctrlKey && event.key === 'c') {
		navigator.clipboard.writeText(gridOptions.api.getDataAsCsv({
			skipColumnGroupHeaders: true,
			skipColumnHeaders: true,
			allColumns: false,
			onlySelected: true,
		}));
	}
	if (event.ctrlKey && event.key === 'a') {
		navigator.clipboard.writeText(gridOptions.api.getDataAsCsv({
			skipColumnGroupHeaders: true,
			skipColumnHeaders: true,
			allColumns: true,
			onlySelected: true,
		}));
	}
});

/*
 * GRID
 */

const gridOptions = {
	columnDefs: [
		{
			headerName: 'Machine Types',
			children: [
				{
					headerName: 'Name',
					field: "name",
					cellRenderer: params => {
						return '<a href="./'+ params.data.region +'/'+ params.value +'.html">'+ params.value + '</a>';
					},
					tooltipValueGetter: params => {
						return params.value +' ('+ params.data.vCpus + ' vCPUs, '+ params.data.memoryGiB + ' GB, '+ params.data.bandwidth + ' Gbps) ['+ params.data.region + ']';
					},
					pinned: 'left',
					//rowDrag: true,
					checkboxSelection: true,
					width: 180,
				},
			]
		},
		{
			headerName: 'Region',
			children: [
				{
					headerName: 'Name',
					field: "region",
					columnGroupShow: 'close',
					tooltipField: 'region',
					width: 140,
				},
				{
					headerName: 'Location',
					field: "regionLocation",
					columnGroupShow: 'open',
					tooltipField: 'regionLocation',
					width: 180
				},
			]
		},
		{
			headerName: 'Prozessor',
			children: [
				{ 
					headerName: 'vCPU',
					field: "vCpus",
					columnGroupShow: 'close',
					filter: 'agNumberColumnFilter',
					filterParams: filterParamsNumber,
					headerTooltip: 'A vCPU represents a single logical CPU thread',
					width: 90,
				},
				{ 
					headerName: 'Base Frequency',
					field: "cpuBaseClock",
					columnGroupShow: 'close',
					filter: 'agNumberColumnFilter',
					filterParams: filterParamsNumber,
					headerTooltip: 'CPU base clock frequency',
					width: 120,
					cellClass: 'frequency',
				},
				{ 
					headerName: 'Turbo Frequency',
					field: "cpuTurboClock",
					columnGroupShow: 'open',
					filter: 'agNumberColumnFilter',
					filterParams: filterParamsNumber,
					headerTooltip: 'CPU all-core turbo frequency / effective frequency',
					width: 120,
					cellClass: 'frequency',
				},
				{ 
					headerName: 'Max. Turbo Frequency',
					field: "cpuSingleMaxTurboClock",
					columnGroupShow: 'open',
					filter: 'agNumberColumnFilter',
					filterParams: filterParamsNumber,
					headerTooltip: 'CPU single-core max turbo frequency / max boost frequency',
					width: 120,
					cellClass: 'frequency',
				},
				{
					headerName: 'Intel',
					field: 'intel',
					columnGroupShow: 'open',
					filterParams: filterParamsBoolean,
					valueFormatter: booleanFormatter,
					headerTooltip: 'Intel CPU processors (true, false)',
					width: 90
				},
				{
					headerName: 'AMD',
					field: 'amd',
					columnGroupShow: 'open',
					filterParams: filterParamsBoolean,
					valueFormatter: booleanFormatter,
					headerTooltip: 'AMD CPU processors (true, false)',
					width: 90
				},
				{
					headerName: 'Platform',
					field: 'cpuPlatform',
					columnGroupShow: 'open',
					headerTooltip: 'CPU Platform',
					tooltipField: 'cpuPlatform'
				},
				{
					headerName: 'Shared',
					field: 'sharedCpu',
					columnGroupShow: 'open',
					filterParams: filterParamsBoolean,
					valueFormatter: booleanFormatter,
					headerTooltip: 'Fractional vCPU (true, false) [Each vCPU can burst up to 100% of CPU time, for short periods, before returning to the time limitations]',
					width: 90
				},
			]
		},
		{
			headerName: 'Benchmark',
			children: [
				{ headerName: 'CoreMark', field: "coremarkScore",     columnGroupShow: 'close', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'EEMBC CoreMark Benchmark (please see www.eembc.org/coremark)', width: 120 },
				{ headerName: 'StdDev%',  field: "standardDeviation", columnGroupShow: 'open',  filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'EEMBC CoreMark Standard Deviation (%)', width: 120 },
				{ headerName: '#Samples', field: "sampleCount",       columnGroupShow: 'open',  filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'EEMBC CoreMark Sample Count', width: 120 },
				{ headerName: 'SAPS',     field: 'saps',              columnGroupShow: 'open',  filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'SAP Standard Benchmark (please see SAP Note 1612283 and 2456432)', width: 120 },
			]
		},
		{ headerName: 'Memory', field: "memoryGiB", cellClass: 'memory', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'Random-access memory (GiB)', width: 120, },
		{
			headerName: 'Network',
			children: [
				{ headerName: 'Bandwidth', field: "bandwidth", cellClass: 'bandwidth', columnGroupShow: 'close', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'Maximum egress bandwidth (Gbps) cannot exceed the number given', width: 120, },
				{ headerName: 'Tier 1',    field: "tier1",     cellClass: 'bandwidth', columnGroupShow: 'open',  filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'High-bandwidth (Gbps) networking for larger machine types', width: 120 },
			]
		},
		{
			headerName: 'Storage',
			children: [
				{ headerName: 'Disk Size', field: "diskSizeTiB", columnGroupShow: 'close', cellClass: 'diskSize', width: 120, filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'Max. total persistent disk size (TB) [Disk usage is charged separately from machine type pricing!]' },
				{ headerName: '#Disks',    field: "disks",       columnGroupShow: 'open',  width: 110, filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, headerTooltip: 'Max. number of persistent disks (PDs) [Disk usage is charged separately from machine type pricing!]' },
				{
					headerName: 'Local SSD',
					field: "localSsd",
					columnGroupShow: 'open',
					filterParams: filterParamsBoolean,
					valueFormatter: booleanFormatter,
					width: 90,
					headerTooltip: 'VM supports local solid-state drive (SSD) block storage'
				},
			]
		},
		{
			headerName: 'Costs',
			children: [
				{ headerName: 'Hour',                   field: "hour",              width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'close' },
				{ headerName: 'Month',                  field: 'month',             width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'close' },
				{ headerName: '1Y CUD',                 field: "month1yCud",        width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open' },
				{ headerName: '3Y CUD',                 field: "month3yCud",        width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open' },
				{ headerName: 'SLES',                   field: 'monthSles',         width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open', headerTooltip: 'SUSE Linux Enterprise Server' },
				{ headerName: 'RHEL',                   field: 'monthRhel',         width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open', headerTooltip: 'Red Hat Enterprise Linux' },
				{ headerName: 'Windows',                field: 'monthWindows',      width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open', headerTooltip: 'Microsoft Windows Server' },
				{ headerName: 'SLES for SAP',           field: 'monthSlesSap',      width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open', headerTooltip: 'SUSE Linux Enterprise Server for SAP' },
				{ headerName: 'SLES for SAP w. 1Y CUD', field: 'monthSlesSap1yCud', width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open', headerTooltip: 'SUSE Linux Enterprise Server for SAP with 1 Year CUD' },
				{ headerName: 'SLES for SAP w. 3Y CUD', field: 'monthSlesSap3yCud', width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open', headerTooltip: 'SUSE Linux Enterprise Server for SAP with 1 Year CUD' },
				{ headerName: 'RHEL for SAP',           field: 'monthRhelSap',      width: 120, cellClass: 'currency', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, columnGroupShow: 'open', headerTooltip: 'Red Hat Enterprise Linux for SAP' },
				{
					headerName: 'SUD',
					field: "sud",
					columnGroupShow: 'open',
					filterParams: filterParamsBoolean,
					valueFormatter: booleanFormatter,
					width: 90,
					headerTooltip: 'Instance with SUD (sustained use discounts are automatic discounts for running specific Compute Engine resources)'
				},


			]
		},
		{
			headerName: 'More...',
			children: [
				{ headerName: 'Family',         field: "family",          columnGroupShow: 'close', width: 180, tooltipField: 'family', headerTooltip: 'A curated set of processor and hardware configurations optimized for specific workloads' },
				{ headerName: 'Series',         field: "series",          columnGroupShow: 'open',  width: 110, headerTooltip: 'Machine families are further classified by series and generation'},
				{ headerName: 'GPUs',           field: "acceleratorCount",columnGroupShow: 'open', filter: 'agNumberColumnFilter', filterParams: filterParamsNumber, width: 100 },
				{ headerName: 'GPU Type',       field: "acceleratorType", columnGroupShow: 'open' },
				{
					headerName: 'SAP',
					field: "sap",
					columnGroupShow: 'open',
					filterParams: filterParamsBoolean,
					valueFormatter: booleanFormatter,
					width: 90,
					headerTooltip: 'Certified for SAP applications on Google Cloud'
				},
				{
					headerName: 'HANA',
					field: "hana",
					columnGroupShow: 'open',
					filterParams: filterParamsBoolean,
					valueFormatter: booleanFormatter,
					width: 90,
					headerTooltip: 'Certified for SAP HANA on Google Cloud'
				},
				{
					headerName: 'Spot',
					field: "spot",
					columnGroupShow: 'open',
					filterParams: filterParamsBoolean,
					valueFormatter: booleanFormatter,
					width: 90,
					headerTooltip: 'Instance supports spot provisioning mode (Spot VM)'
				},

			]
		}
	],
	// Defaults
	defaultColDef: {
		resizable: true,
		sortable: true,
		minWidth: 90,
		maxWidth: 400,
		//width: 110,
		filter: 'agTextColumnFilter',
		filterParams: filterParamsText,
		floatingFilter: true,
		//editable: true,
	},
	groupHideOpenParents: true,
	tooltipShowDelay: 0,
	debounceVerticalScrollbar: true,
	ensureDomOrder: true,
	suppressColumnVirtualisation: true,
	rowBuffer: 60,
	rowSelection: 'multiple',
	rowMultiSelectWithClick: true,
	//rowDragManaged: true,
	//rowDragMultiRow: true,
	pagination: true,
	paginationPageSize: 45,
	//domLayout: 'autoHeight',
};

// lookup the container we want the Grid to use
const eGridDiv = document.querySelector('#myGrid');

// create the grid passing in the div to use together with the columns & data we want to use
new agGrid.Grid(eGridDiv, gridOptions);

// fetch the row data to use and one ready provide it to the Grid via the Grid API
fetch('instance_in_region.json?[% timestamp %]')
	.then(response => response.json())
	.then(data => {
		gridOptions.api.setRowData(data);
	}
);