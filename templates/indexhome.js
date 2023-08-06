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

// Function to open the filter modal
function openFilterModal() {
    var filterModal = document.getElementById("filterModal");
    filterModal.style.display = "block";
}

// Function to close the filter modal
function closeFilterModal() {
    var filterModal = document.getElementById("filterModal");
    filterModal.style.display = "none";
}

function fetchDataAndDisplay(endpoint, value, displayFunction) {
  const url = `/get_vehicle_tests/?${endpoint}=${value}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => displayFunction(data))
    .catch(error => console.error('An error occurred:', error));
}

// Function to fetch data and populate dropdowns
async function fetchAndPopulateDropdown(dropdownId, dataKey, optionValueKey, optionTextKey) {
  try {
    const data = await fetch(`/get_all_data/`).then((response) => response.json());

    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ""; // Clear existing options

    // Extract unique values from the data based on the provided dataKey
    const uniqueValues = [...new Set(data.map(test => test[dataKey]))];

    // Add the options to the dropdown
    uniqueValues.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function getVehicleTests() {
  const selectedVehicles = Array.from(document.getElementById("vehicle_ids").selectedOptions)
    .map(option => option.value)
    .join(",");
  fetchDataAndDisplay("vehicle_ids", selectedVehicles, displayResults);
  document.getElementById('clearFilterDiv').style.display = 'block';
}

function getDriverTests() {
  const selectedDrivers = Array.from(document.getElementById("driver_names").selectedOptions)
    .map(option => option.value)
    .join(",");
  fetchDataAndDisplay("driver_names", selectedDrivers, displayDrivers);
  document.getElementById('clearFilterDiv1').style.display = 'block';
}

function getDriveTrace() {
  const driverTraces = Array.from(document.getElementById("drive_trace").selectedOptions)
    .map(option => option.value)
    .join(",");
  fetchDataAndDisplay("drive_traces", driverTraces, displayResults);
  document.getElementById('clearFilterDiv2').style.display = 'block';
}

function iwr() {
  const minIWR = document.getElementById("minIWR").value;
  const maxIWR = document.getElementById("maxIWR").value;
  const iwrValue = `${minIWR},${maxIWR}`;
  fetchDataAndDisplay("iwr", iwrValue, displayResults);
  document.getElementById('clearFilterDiv3').style.display = 'block';
}

function totalCOgkm() {
  const minTotalCOgkm = document.getElementById("minTotalCOgkm").value;
  const maxTotalCO2gkm = document.getElementById("maxTotalCO2gkm").value;
  const totalCOgkmValue = `${minTotalCOgkm},${maxTotalCO2gkm}`;
  fetchDataAndDisplay("totalCOgkm", totalCOgkmValue, displayResults);
  document.getElementById('clearFilterDiv4').style.display = 'block';
}

// Fetch data and populate dropdowns when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchAndPopulateDropdown("vehicle_ids", "VehicleID");
  fetchAndPopulateDropdown("driver_names", "Cell");
  fetchAndPopulateDropdown("drive_trace", "DriveTrace");
});

function clearFilter() {
  // Refresh the page to clear the filter
  location.reload();
}

function displayInitialResults() {
  return fetch(`/get_all_data/`).then((response) => response.json());
}

function InitialResults(data) {
  const testResultsDiv = document.getElementById("initialData");
  testResultsDiv.innerHTML = "";

  if (data.length > 0) {
    const table = document.createElement("table");
    const headers = [
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
        td.textContent = test[header.replace(/\s/g, '')]; // Remove spaces from header to match the property names in 'test' object
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
    testResultsDiv.textContent = "No Records Found";
  }
}

// Fetch data and display initial results
document.addEventListener("DOMContentLoaded", () => {
  displayInitialResults()
    .then((data) => InitialResults(data))
    .catch((error) => console.error("Error fetching data:", error));
});


function displayResults(data) {
  const headers = ["TestName", "TestDateTime", "Cell", "VehicleID", "DriveTrace", "Engineer", "Driver", "IWR", "RMSSE", "TotalCOgkm", "TotalCO2gkm"];
  displayData(data, headers);
}

function displayDrivers(data) {
  const headers = ["Driver"];
  displayData(data, headers);
}

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


function displayData(data, headers) {
  const testResultsDiv = document.getElementById("testResults");
  testResultsDiv.innerHTML = "";

  if (data.length > 0) {
    const table = document.createElement("table");

    const headerRow = document.createElement("tr");
    headers.forEach(headerText => {
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
      headers.forEach(header => {
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
    testResultsDiv.textContent = "No Records Found";
  }
}

function sortTableData(table, headers, defaultSortColumn) {
  let columnIndex = headers.indexOf(defaultSortColumn);
  let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  switching = true;
  dir = "asc"; // Default sorting direction is ascending

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[columnIndex];
      y = rows[i + 1].getElementsByTagName("td")[columnIndex];

      // Compare values depending on the data type 
      if (dir === "asc") {
        if (isNaN(x.textContent)) {
          shouldSwitch = x.textContent.toLowerCase() > y.textContent.toLowerCase();
        } else {
          shouldSwitch = parseFloat(x.textContent) > parseFloat(y.textContent);
        }
      } else if (dir === "desc") {
        if (isNaN(x.textContent)) {
          shouldSwitch = x.textContent.toLowerCase() < y.textContent.toLowerCase();
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
      th.innerHTML += (dir === "asc") ? '<span class="sort-icon asc-icon"></span>' : '<span class="sort-icon desc-icon"></span>';
    } else {
      th.innerHTML += '<span class="sort-icon"></span>'; // Display an empty icon for non-clicked columns
    }
  });
}


function downloadCSV(headers, data) {
  const csvContent = `data:text/csv;charset=utf-8,${headers.join(",")}\n${data.map(row => headers.map(header => row[header]).join(",")).join("\n")}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "test_results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}