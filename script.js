document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('expenseForm');
    const categoryDropdown = document.getElementById('category');
    const clearButton = document.getElementById('clearButton');
    const analysisResults = document.getElementById('analysisResults');
    const analysisCategoryDropdown = document.getElementById('analysisCategory');
    const analyzeButton = document.getElementById('analyzeButton');
    const showButton = document.getElementById('showButton');

    // Fetch categories from API and populate dropdown
    try {
        const response = await fetch('http://localhost:8080/api/get-categories-list');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const categories = await response.json();

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.categoryName;
            categoryDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to fetch categories. Please try again later.');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log(JSON.stringify(data)); // Log the JSON data

        try {
            const response = await fetch('http://localhost:8080/api/record-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error submitting form');
            }

            alert('Expense submitted successfully!');
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit expense. Please try again later.');
        }
    });

    clearButton.addEventListener('click', () => {
        console.log('clear clicked');
        form.reset();
    });

    // Fetch options for analysisCategory dropdown
    try {
        const responseAnalysisOptions = await fetch('http://localhost:8080/insights/getAvailableInsightsTimeline');
        if (!responseAnalysisOptions.ok) {
            throw new Error('Failed to fetch analysis options');
        }
        const analysisOptions = await responseAnalysisOptions.json();
        console.log('analysis options:', analysisOptions);

        analysisOptions.forEach(option => {
            const analysisOption = document.createElement('option');
            analysisOption.value = option;
            analysisOption.textContent = option;
            analysisCategoryDropdown.appendChild(analysisOption);
        });
    } catch (error) {
        console.error('Error fetching analysis options:', error);
        alert('Failed to fetch analysis options. Please try again later.');
    }

    // analyzeButton.addEventListener('click', async () => {
    //     analysisResults.style.display = 'block';
    // })

    showButton.addEventListener('click', async () => {
        const selectedValue = analysisCategoryDropdown.value;
        if (selectedValue) {
            try {
                const response = await fetch(`http://localhost:8080/insights/getInsightsByTimeline/${selectedValue}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch insights');
                }
                const insightsData = await response.json();
                console.log('Insights data:', insightsData);
                // Display insights data in the analysisResults div or perform any other actions
            } catch (error) {
                console.error('Error fetching insights:', error);
                alert('Failed to fetch insights. Please try again later.');
            }
        } else {
            alert('Please select an option from the dropdown.');
        }
    });
});
