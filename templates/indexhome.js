// Global variable to store the table data
let tableData = [];

// Global variable to store the headers data
let headers = [
      "TestName",
      "TestDateTime",
      "Cell",
      "VehicleID",
      "DriveTrace",
      "Engineer",
      "Driver",
      "IWR",
      "RMSSE",
      "TotalCOgkm",
      "TotalCO2gkm",
  ];

// Function to apply filters on the previous filtered data
function applyFilters() {
    // Reset filteredData to the original tableData
    let filteredData = [...tableData];

    // Get the selected filter option
    const selectedFilter = document.getElementById('filterSelect').value;

    // Apply filters based on the selected option
    if (selectedFilter === 'vehicle_ids') {
      // Filter data by vehicle IDs
      const vehicle_ids = document.getElementById('vehicle_ids').value.split(',');
      filteredData = filteredData.filter((item) => vehicle_ids.includes(item.VehicleID.toString()));
    } else if (selectedFilter === 'driver_names') {
      // Filter data by driver names using cell numbers
      const driver_names = document.getElementById('driver_names').value.split(',');
      filteredData = filteredData.filter((item) => driver_names.includes(item.Cell));
    } else if (selectedFilter === 'drive_trace') {
      // Filter data by drive traces
      const drive_traces = document.getElementById('drive_trace').value.split(',');
      filteredData = filteredData.filter((item) => drive_traces.includes(item.DriveTrace));
    } else if (selectedFilter === 'iwr') {
      // Filter data by IWR values
      const minIWR = parseFloat(document.getElementById('minIWR').value);
      const maxIWR = parseFloat(document.getElementById('maxIWR').value);
      filteredData = filteredData.filter((item) => item.IWR >= minIWR && item.IWR <= maxIWR);
    } else if (selectedFilter === 'totalCOgkm') {
      // Filter data by TotalCOgkm and TotalCO2gkm values
      const minTotalCOgkm = parseFloat(document.getElementById('minTotalCOgkm').value);
      const maxTotalCO2gkm = parseFloat(document.getElementById('maxTotalCO2gkm').value);
      filteredData = filteredData.filter((item) => item.TotalCOgkm >= minTotalCOgkm && item.TotalCO2gkm <= maxTotalCO2gkm);
    }

    // Display the filtered data in the table
    displayData(filteredData, headers);

    document.getElementById("clearFilterDiv1").style.display = "block"; //Display clear filter Button
    document.getElementById("clearFilterDiv2").style.display = "block";
    document.getElementById("clearFilterDiv3").style.display = "block";
    document.getElementById("clearFilterDiv4").style.display = "block";
    document.getElementById("clearFilterDiv5").style.display = "block";
}

// Function to show/hide filter options based on the selected filter inside the modal
function showDiv() {
  var select = document.getElementById("filterSelect");
  var selectedValue = select.value;

  var allDivs = document
    .getElementsByClassName("container")[0]
    .getElementsByTagName("div");
  for (var i = 0; i < allDivs.length; i++) {
    if (allDivs[i].classList.contains(selectedValue)) {
      allDivs[i].classList.remove("hidden");
    } else {
      allDivs[i].classList.add("hidden");
    }
  }
}

// Function to open the filter modal by clicking on X button
function openFilterModal() {
  var filterModal = document.getElementById("filterModal");
  filterModal.style.display = "block";
}

// Function to close the filter modal by clicking on X button
function closeFilterModal() {
  var filterModal = document.getElementById("filterModal");
  filterModal.style.display = "none";
}

// Function to fetch data and display it in the table
function fetchDataAndDisplay(endpoint, value, displayFunction) {
  const url = `/get_vehicle_tests/?${endpoint}=${value}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => displayFunction(data))
    .catch((error) => console.error("An error occurred:", error));
}

// Function to fetch and populate dropdowns with unique values inside the modal select options
async function fetchAndPopulateDropdown(
  dropdownId,
  dataKey,
  optionValueKey,
  optionTextKey
) {
  try {
    const data = await fetch(`/get_all_data/`).then((response) =>
      response.json()
    );

    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ""; // Clear existing options

    // Extract unique values from the data based on the provided dataKey
    const uniqueValues = [...new Set(data.map((test) => test[dataKey]))];

    // Add the options to the dropdown
    uniqueValues.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch data and populate dropdowns when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchAndPopulateDropdown("vehicle_ids", "VehicleID");
  fetchAndPopulateDropdown("driver_names", "Cell");
  fetchAndPopulateDropdown("drive_trace", "DriveTrace");
});

// Get all elements with class "closeModal"
const buttons = document.querySelectorAll(".closeModal");

// Add event listeners to each button, when the button is clicked, modal will close and show the filtered data
buttons.forEach(button => {
  button.addEventListener("click", closeFilterModal);
});

// Functions to fetch data based on filter options
function getVehicleTests() {
  const selectedVehicles = Array.from(
    document.getElementById("vehicle_ids").selectedOptions
  )
    .map((option) => option.value)
    .join(",");
  fetchDataAndDisplay("vehicle_ids", selectedVehicles, displayResults);
  document.getElementById("clearFilterDiv").style.display = "block";
}

function getDriverTests() {
  const selectedDrivers = Array.from(
    document.getElementById("driver_names").selectedOptions
  )
    .map((option) => option.value)
    .join(",");
  fetchDataAndDisplay("driver_names", selectedDrivers, displayDrivers);
  document.getElementById("clearFilterDiv1").style.display = "block";
}

function getDriveTrace() {
  const driverTraces = Array.from(
    document.getElementById("drive_trace").selectedOptions
  )
    .map((option) => option.value)
    .join(",");
  fetchDataAndDisplay("drive_traces", driverTraces, displayResults);
  document.getElementById("clearFilterDiv2").style.display = "block";
}

function iwr() {
  const minIWR = document.getElementById("minIWR").value;
  const maxIWR = document.getElementById("maxIWR").value;
  const iwrValue = `${minIWR},${maxIWR}`;
  fetchDataAndDisplay("iwr", iwrValue, displayResults);
  document.getElementById("clearFilterDiv3").style.display = "block";
}

function totalCOgkm() {
  const minTotalCOgkm = document.getElementById("minTotalCOgkm").value;
  const maxTotalCO2gkm = document.getElementById("maxTotalCO2gkm").value;
  const totalCOgkmValue = `${minTotalCOgkm},${maxTotalCO2gkm}`;
  fetchDataAndDisplay("totalCOgkm", totalCOgkmValue, displayResults);
  document.getElementById("clearFilterDiv4").style.display = "block";
}


// Function to handle the click event for multiple select elements in modal options
function handleMultipleSelectClick(element) {
    element.addEventListener("mousedown", function (e) {
        e.preventDefault();
        var originalScrollTop = this.scrollTop;
        var clickedOption = e.target;
        clickedOption.selected = !clickedOption.selected;
        this.scrollTop = originalScrollTop;
        return false;
    });
}
// Pass the IDs of the select elements you want to handle for multiple select
const selectIdsToHandle = ["vehicle_ids", "driver_names", "drive_trace"];
// Attach the event listener to each select element
selectIdsToHandle.forEach(id => {
    const selectElement = document.getElementById(id);
    handleMultipleSelectClick(selectElement);
});


function clearFilter() {
  // Refresh the page to clear the filter
  location.reload();
}

// Function to display initial results when the page loads for the first time
function displayInitialResults() {
  return fetch(`/get_all_data/`).then((response) => response.json());
}

// Fetch data and display initial results
function InitialResults(data) {
  const testResultsDiv = document.getElementById("initialData");
  testResultsDiv.innerHTML = "";

  if (data.length > 0) {
    const table = document.createElement("table");
    headers = headers;

    const headerRow = document.createElement("tr");
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.addEventListener("click", () => {
        sortTableData(table, headers, headerText);
      });
      headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    sortTableData(table, headers, headers[0]);

    data.forEach((test) => {
      const row = document.createElement("tr");
      headers.forEach((header) => {
        const td = document.createElement("td");
        td.textContent = test[header.replace(/\s/g, "")]; // Remove spaces from header to match the property names in 'test' object
        row.appendChild(td);
      });

      table.appendChild(row);
    });

    const infoDiv = document.createElement("div");
    infoDiv.textContent = `Number of Records: ${data.length}`;
    infoDiv.classList.add("info-div"); 

    // Create a new div for the filter icon
    const filterIconDiv = document.createElement("div");
    filterIconDiv.classList.add("filter-icon");
    filterIconDiv.onclick = openFilterModal; // Assign the onclick event

    // Add the filter icon HTML inside the div
    filterIconDiv.innerHTML = '<i class="fas fa-filter"></i>';

    // Add the filter icon div before appending the infoDiv
    const containerDiv = document.createElement("div");
    containerDiv.appendChild(filterIconDiv);
    containerDiv.appendChild(infoDiv);

    const searchContainerDiv = document.createElement("div");
    searchContainerDiv.classList.add("search-container");

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search Data...";
    searchInput.classList.add("search-input"); // Adding a class to the search input element to CSS Design
    searchInput.addEventListener("input", () => {
      filterTableData(table, headers, searchInput.value);
    });

    searchContainerDiv.appendChild(searchInput); // Add the search input to the container

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-div-results"); // Adding a class to center-align buttons

    const button = document.createElement("button");
    button.textContent = "Download";
    button.classList.add("button-download"); // Adding a class to download button
    button.addEventListener("click", () => {
      downloadCSV(headers, data);
    });

    buttonDiv.appendChild(button);

    // Append both buttonDiv and infoDiv to the container div
    containerDiv.appendChild(buttonDiv);
    containerDiv.appendChild(searchContainerDiv);
    containerDiv.appendChild(infoDiv);

    testResultsDiv.appendChild(containerDiv);

    testResultsDiv.appendChild(table);
  } else {
    //Error Handling, Display 'Refresh Page' Button and 'No records found text' when no records found

    testResultsDiv.innerHTML = ""; // Clear previous content

    // Displaying "No Records Found" text in the middle of the page vertically
    const noRecordsDiv = document.createElement("div");
    noRecordsDiv.textContent = "No Records Found in DataBase";
    noRecordsDiv.style.display = "flex";
    noRecordsDiv.style.alignItems = "center";
    noRecordsDiv.style.justifyContent = "center";
    noRecordsDiv.style.height = "60vh"; // Set the container to take up the full viewport height

    // Creating the "Remove Filter" button and center it vertically
    const removeFilterButton = document.createElement("button");
    removeFilterButton.textContent = "Refresh Page";
    removeFilterButton.onclick = clearFilter;
    removeFilterButton.classList.add("remove-filter-button");
    removeFilterButton.style.marginLeft = "50px"; // Add some space between the text and button

    // Appending the "No Records Found" text and "Remove Filter" button to the container
    noRecordsDiv.appendChild(removeFilterButton);
    testResultsDiv.appendChild(noRecordsDiv);
  }
}

// Fetch data and display initial results
document.addEventListener("DOMContentLoaded", () => {
  displayInitialResults()
    .then((data) => InitialResults(data))
    .catch((error) => console.error("Error fetching data:", error));
});

// Function to display filtered results
function displayResults(data) {
  headers = headers;
  displayData(data, headers);
}

// Function to display drivers based on filter
function displayDrivers(data) {
  const headers = ["Driver"];
  displayData(data, headers);
}

// Function to filter data based on search input
function filterTableData(table, headers, searchTerm) {
  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    let foundMatch = false;

    for (let j = 0; j < headers.length; j++) {
      const cell = row.getElementsByTagName("td")[j];
      if (cell) {
        const cellText = cell.textContent || cell.innerText;
        if (cellText.toLowerCase().includes(searchTerm.toLowerCase())) {
          foundMatch = true;
          break;
        }
      }
    }

    row.style.display = foundMatch ? "" : "none";
  }
}

// Function to display filtered data in the table
function displayData(data, headers) {
  // Store the table data in the global variable
  tableData = data;
  const testResultsDiv = document.getElementById("testResults");
  testResultsDiv.innerHTML = "";

  if (data.length > 0) {
    const table = document.createElement("table");

    const headerRow = document.createElement("tr");
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.addEventListener("click", () => {
        sortTableData(table, headers, headerText);
      });
      headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    sortTableData(table, headers, headers[0]);

    data.forEach((test) => {
      const row = document.createElement("tr");
      headers.forEach((header) => {
        const td = document.createElement("td");
        td.textContent = test[header];
        row.appendChild(td);
      });

      table.appendChild(row);
    });

    const infoDiv = document.createElement("div");
    infoDiv.textContent = `Number of Records: ${data.length}`;
    infoDiv.classList.add("info-div"); // Adding a class to the div

    // Create a new div for the filter icon
    const filterIconDiv = document.createElement("div");
    filterIconDiv.classList.add("filter-icon");
    filterIconDiv.onclick = openFilterModal; // Assign the onclick event

    // Add the filter icon HTML inside the div
    filterIconDiv.innerHTML = '<i class="fas fa-filter"></i>';

    // Add the filter icon div before appending the infoDiv
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("clearbuttoninfocontainer");
    containerDiv.appendChild(filterIconDiv);
    containerDiv.appendChild(infoDiv);

    const searchContainerDiv = document.createElement("div");
    searchContainerDiv.classList.add("search-container");

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.classList.add("search-input"); // Adding a class to the search input element to CSS Design
    searchInput.addEventListener("input", () => {
      filterTableData(table, headers, searchInput.value);
    });

    searchContainerDiv.appendChild(searchInput); // Add the search input to the container

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-div-results"); // Adding a class to center-align buttons

    const button = document.createElement("button");
    button.textContent = "Download";
    button.classList.add("button-download"); // Adding a class to download button
    button.addEventListener("click", () => {
      downloadCSV(headers, data);
    });

    buttonDiv.appendChild(button);

    // Append both buttonDiv and infoDiv to the container div
    containerDiv.appendChild(filterIconDiv);
    containerDiv.appendChild(buttonDiv);
    containerDiv.appendChild(searchContainerDiv);
    containerDiv.appendChild(infoDiv);

    testResultsDiv.appendChild(containerDiv);
    testResultsDiv.appendChild(table);
  } else {
    //Error Handling, Display 'Remove Filter' Button and 'No records found text' when no records found

    testResultsDiv.innerHTML = ""; // Clear previous content

    // Displaying "No Records Found" text in the middle of the page vertically
    const noRecordsDiv = document.createElement("div");
    noRecordsDiv.textContent = "No Records Found";
    noRecordsDiv.style.display = "flex";
    noRecordsDiv.style.alignItems = "center";
    noRecordsDiv.style.justifyContent = "center";
    noRecordsDiv.style.height = "60vh"; // Set the container to take up the full viewport height

    // Creating the "Remove Filter" button and center it vertically
    const removeFilterButton = document.createElement("button");
    removeFilterButton.textContent = "Remove Filter";
    removeFilterButton.onclick = clearFilter;
    removeFilterButton.classList.add("remove-filter-button");
    removeFilterButton.style.marginLeft = "50px"; // Add some space between the text and button

    // Appending the "No Records Found" text and "Remove Filter" button to the container
    noRecordsDiv.appendChild(removeFilterButton);
    testResultsDiv.appendChild(noRecordsDiv);
  }
}

// Function to sort table data based on header click
function sortTableData(table, headers, defaultSortColumn) {
  let columnIndex = headers.indexOf(defaultSortColumn);
  let rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  switching = true;
  dir = "asc"; // Default sorting direction is ascending

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[columnIndex];
      y = rows[i + 1].getElementsByTagName("td")[columnIndex];

      // Compare values depending on the data type
      if (dir === "asc") {
        if (isNaN(x.textContent)) {
          shouldSwitch =
            x.textContent.toLowerCase() > y.textContent.toLowerCase();
        } else {
          shouldSwitch = parseFloat(x.textContent) > parseFloat(y.textContent);
        }
      } else if (dir === "desc") {
        if (isNaN(x.textContent)) {
          shouldSwitch =
            x.textContent.toLowerCase() < y.textContent.toLowerCase();
        } else {
          shouldSwitch = parseFloat(x.textContent) < parseFloat(y.textContent);
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      }
    }

    if (switchcount === 0 && dir === "asc") {
      dir = "desc";
      switching = true;
    }
  }

  // Update header icons based on the sorting direction for all columns
  const headerRow = table.querySelector("tr");
  headers.forEach((header, index) => {
    const th = headerRow.querySelector("th:nth-child(" + (index + 1) + ")");
    th.innerHTML = header;

    if (columnIndex === index) {
      th.innerHTML +=
        dir === "asc"
          ? '<span class="sort-icon asc-icon"></span>'
          : '<span class="sort-icon desc-icon"></span>';
    } else {
      th.innerHTML += '<span class="sort-icon"></span>'; // Display an empty icon for non-clicked columns
    }
  });
}

// Function to download data as CSV
function downloadCSV(headers, data) {
  const csvContent = `data:text/csv;charset=utf-8,${headers.join(",")}\n${data
    .map((row) => headers.map((header) => row[header]).join(","))
    .join("\n")}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "test_results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
