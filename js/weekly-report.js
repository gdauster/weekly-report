function autoResizeTextarea(element) {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }

  const reportOutputTextArea = document.getElementById('report-output');
  
  function generateHumanReadableReport() {
    // Get all the form inputs
    const form = document.getElementById('report-form');
    const sections = form.querySelectorAll('.report-section');
  
    // Create an empty report string
    let report = '';
    let sectionNumbering = 1;
  
    // Loop through each section and add its title and field values to the report string
    sections.forEach(section => {
      // Check if the checkbox for the section is checked
      const checkbox = section.querySelector('.section-checkbox');
      if (checkbox.checked) {
        
      const sectionTitle = section.querySelector('h2').textContent;
      report += `${sectionNumbering}. ${sectionTitle}\n\n`;
      sectionNumbering += 1; // for next section numbering
  
      const fields = section.querySelectorAll('input[type="text"], textarea');
      fields.forEach(field => {
        const fieldLabel = field.previousElementSibling ? field.previousElementSibling.textContent : '';
        const fieldValue = field.value;
  
        report += `${fieldLabel}: \n ${fieldValue}\n`;
      });
  
      report += '\n';
      }

    });
  
    // Display the generated report
    const reportOutput = document.getElementById('report-output');
    reportOutput.textContent = "";
    reportOutput.textContent = report;
    autoResizeTextarea(reportOutputTextArea);
  }
  
// Call the generateReport function when the "Generate Report" button is clicked
const generateButton = document.getElementById('generate-report-button');
generateButton.addEventListener('click', generateHumanReadableReport);
  
function generateForm(config) {
    // Get the form container element
    const formContainer = document.getElementById('report-form');
    while (formContainer.firstChild) {
        formContainer.removeChild(formContainer.firstChild);
      }
  
    // Loop through the sections in the config
    config.sections.forEach(section => {
      // Create a section container element
      const sectionContainer = document.createElement('div');
      sectionContainer.classList.add('report-section');
  
      // Create a section title element
      const sectionTitle = document.createElement('span');
      sectionTitle.classList.add('section-title');
      const sectionTitleLabel = document.createElement('h2');
      sectionTitleLabel.textContent = section.title;

        // Create the checkbox element
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true; // Set the checkbox to checked by default
        checkbox.classList.add('section-checkbox');
        checkbox.addEventListener('change', function() { generateHumanReadableReport(); });
  
      // Append the section title to the section container
      sectionTitle.appendChild(sectionTitleLabel);
      sectionTitle.appendChild(checkbox);
      sectionContainer.appendChild(sectionTitle);
  
      // Loop through the fields in the section
      section.fields.forEach(field => {
        // Create the label element
        const label = document.createElement('label');
        label.textContent = `${field.label}:`;
  
        // Create the input element
        const input = document.createElement(field.type);
        input.name = field.name;
        input.addEventListener('input', function() { autoResizeTextarea(this); generateHumanReadableReport(); });
        //input.placeholder = field.placeholder;
  
        // Append the label and input to the section container
        sectionContainer.appendChild(label);
        sectionContainer.appendChild(input);
        
        // Create the hint element
        if (field.hint) { 
            const hint = document.createElement('span');
            hint.classList.add('hint');
            hint.textContent = field.hint;
            sectionContainer.appendChild(hint);
        }
      });
  
      // Append the section container to the form container
      formContainer.appendChild(sectionContainer);
      
      // Append separation line to improve readibility
      const hr = document.createElement('hr');
      formContainer.appendChild(hr);
    });
    generateHumanReadableReport();
  }

  // Define the paths to the config files for different languages
const configPaths = {
    en: 'config/software-dev-config-en.json',
    fr: 'config/software-dev-config-fr.json',
  };
  
  
  function loadConfig(language) {
    const configPath = configPaths[language];
  
    // Make an AJAX request to fetch the config file
    fetch(configPath)
      .then((response) => response.json())
      .then((config) => {
        // Once the config is loaded, generate the form fields
        generateForm(config);
      })
      .catch((error) => {
        console.error(`Error loading config file: ${error}`);
      });
  }
  
// Event listener for language selection
const languageSelect = document.getElementById('language-select');
languageSelect.addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  loadConfig(selectedLanguage);
});

// Load the default language config (English) on page load
  window.addEventListener('DOMContentLoaded', () => {
    loadConfig('en');
    languageSelect.selectedIndex = 0;
  });