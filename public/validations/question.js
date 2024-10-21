questionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    
    // Fetching Error Divs
    const questionErr = document.querySelector('.questionErr');
    const optionAErr = document.querySelector('.optionAErr');
    const optionBErr = document.querySelector('.optionBErr');
    const optionCErr = document.querySelector('.optionCErr');
    const optionDErr = document.querySelector('.optionDErr');
    const correctAnsErr = document.querySelector('.correctAnsErr');

    // Resetting Error Divs
    questionErr.innerHTML = '';
    optionAErr.innerHTML = '';
    optionBErr.innerHTML = '';
    optionCErr.innerHTML = '';
    optionDErr.innerHTML = '';
    correctAnsErr.innerHTML = '';
    
    // Getting Input Values
    const question = questionForm.question.value;
    const optionA = questionForm.optionA.value;
    const optionB = questionForm.optionB.value;
    const optionC = questionForm.optionC.value;
    const optionD = questionForm.optionD.value;
    

    // Getting the selected option
    const selectedOption = document.querySelector('input[name="option"]:checked');

    // Regex for the Inputs
    const pattern = /^[A-Za-z0-9_\-? ]+$/;
    

    // If Statements for Validation
    if (!pattern.test(question)) {
        questionErr.innerHTML = 'Type questions correctly';
        return; 
    }

    if (!pattern.test(optionA)) {
        optionAErr.innerHTML = 'Type answer correctly';
        return; 
    }

    if (!pattern.test(optionB)) {
        optionBErr.innerHTML = 'Type answer correctly';
        return; 
    }

    if (!pattern.test(optionC)) {
        optionCErr.innerHTML = 'Type answer correctly';
        return; 
    }

    if (!pattern.test(optionD)) {
        optionDErr.innerHTML = 'Type answer correctly';
        return; 
    }

    // Checking if an option is selected
    if (!selectedOption) {
        correctAnsErr.innerHTML = 'Please select the correct answer';
        return; 
    }

    // Extracting the value of the selected option
    const correctAnswer = selectedOption.value;

    // Pushing all the options into an options Array
    let options = [optionA, optionB, optionC, optionD]
    
    // options.push(optionA, optionB, optionC, optionD)

    


    const data = {
        question,
        options,
        correctAnswer: correctAnswer
    };
    console.log(data);

    // Sending data to the server
    fetch('/admin/exam-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((data) => {
        if (data.success) {
            $(document).ready(() => {
                iziToast.success({
                    title: 'Ok',
                    message: data.msg,
                });
            });

            setInterval(() => {
                window.location.href = data.redirectURL;
            }, 2000);
        }
        if (data.error) {
            // Invoke the toast component
            $(document).ready(() => {
                iziToast.error({
                    title: 'Error',
                    message: data.error,
                });
            });
        }
    })
    .catch(e => {
        console.log(e);
    });
});
