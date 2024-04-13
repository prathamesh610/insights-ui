document.addEventListener("DOMContentLoaded", async () => {
  const analysisResults = document.getElementById("analysisResults");
  const analysisCategoryDropdown = document.getElementById("analysisCategory");
  const analyzeButton = document.getElementById("analyzeButton");
  const showButton = document.getElementById("showButton");
  const showData = document.getElementById("showData");

  // Fetch options for analysisCategory dropdown
  try {
    const responseAnalysisOptions = await fetch(
      "http://localhost:8080/insights/getAvailableInsightsTimeline"
    );
    if (!responseAnalysisOptions.ok) {
      throw new Error("Failed to fetch analysis options");
    }
    const analysisOptions = await responseAnalysisOptions.json();
    console.log("analysis options:", analysisOptions);

    analysisOptions.forEach((option) => {
      const analysisOption = document.createElement("option");
      analysisOption.value = option;
      analysisOption.textContent = option;
      analysisCategoryDropdown.appendChild(analysisOption);
    });
  } catch (error) {
    console.error("Error fetching analysis options:", error);
    alert("Failed to fetch analysis options. Please try again later.");
  }

  // analyzeButton.addEventListener('click', async () => {
  //     analysisResults.style.display = 'block';
  // })

  showButton.addEventListener("click", async () => {
    const selectedValue = analysisCategoryDropdown.value;
    if (selectedValue) {
      try {
        const response = await fetch(
          `http://localhost:8080/insights/getInsightsByTimeline/${selectedValue}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch insights");
        }
        const insightsData = await response.json();
        console.log("Insights dataaaaa:", insightsData);

        // Clear previous results
        analysisResults.innerHTML = "";

        // Create a table element
        const table = document.createElement("table");

        // Create table header
        const headerRow = document.createElement("tr");
        for (const key of Object.keys(insightsData)) {
          const th = document.createElement("th");
          th.textContent = key;
          headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        // Create table body
        const bodyRow = document.createElement("tr");
        for (const value of Object.values(insightsData)) {
          const td = document.createElement("td");
          td.textContent = value.toString();
          bodyRow.appendChild(td);
        }
        table.appendChild(bodyRow);

        // Append table to analysisResults div
        analysisResults.appendChild(table);
      } catch (error) {
        console.error("Error fetching insights:", error);
        // alert('Failed to fetch insights. Please try again later.');
      }
    } else {
      alert("Please select an option from the dropdown.");
    }
  });
});
