
const addPatientButton = document.getElementById('addPatient');
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];

function addPatients() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const condition = document.getElementById('condition').value;

    if(name && age && gender && condition) {
        patients.push({name, gender: gender.value, age, condition});
        resetForm();
        generateReport();
    }
}

function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById('condition').value = '';
}


function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = '';
    document.getElementById('conditionInput').value = '';



    fetch('health_analysis.json')
        .then(response => response.json())
        .then(data => {
            const condition = data.conditions.find(item => item.name.toLowerCase() === input);

            if(condition) {
                const symptoms = condition.symptoms.join(', ');
                const prevention = condition.prevention.join(', ');
                const treatment = condition.treatment;


                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;

                if(condition.name.toLowerCase() === 'diabetes') {
                    resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt='hjh' style="width: 350px; height: 350px; margin-top: 13px; margin-bottom: 13px;">`;
                } else {
                    resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt='hjh'>`;
                }

                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
            } else  {
                resultDiv.innerHTML = 'Condition not Found';
            }

        }).catch(error => {
            console.error('Error: ', error)
            resultDiv.innerHTML = 'An error occurred while fetching data';
        })
}

btnSearch.addEventListener('click', searchCondition);

// function generateReport() {
//     // const report = document.getElementById('report');
//     report.innerHTML = '';
//     const ul = document.createElement('ul');
//     ul.classList.add('rpt')
//     report.classList.add('rpt')

//     patients.forEach((patient, index) => {
//         const li = document.createElement('li');
//         li.innerHTML = `<h3 style='color:green;'>Patient No.: ${index +1}</h3><p>Name: ${patient.name}</p><p>Age: ${patient.age}</p><p>Condition: ${patient.condition}</p><p>Gender: ${patient.gender}</p>`
//         ul.classList.add('rpt')
//         ul.appendChild(li)
//         report.innerHTML = `<h4>Total Patients: ${index +1}</h4>`

//     })
//     report.appendChild(ul)
// }

function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    }

    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0
        },
    };

    for (const patient of patients){
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = `<h3>Number of patients: ${numPatients}</h3><br>`;
    report.innerHTML += `<h3>Conditions Breakdown:</h3>`;
    for (const condition in conditionsCount) {
        report.innerHTML += `${condition} : ${conditionsCount[condition]}<br>`
    }

    report.innerHTML += `<br><h3>Gender-Based Conditions:</h3><hr>`;
    for (const gender in genderConditionsCount) {
        report.innerHTML += `<br><h4>${gender}:</h4>`;
        for (const condition in  genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }


}

addPatientButton.addEventListener('click', addPatients);
