
// Get the form element
const examForm = document.getElementById('examForm');
const applicantId = document.getElementsByName("applicantId")[0].value;

// Function to submit the form
async function submitExamForm() {
    try {
        const examQuestions = context.examQuestions;
        const selectedAnswers = [];

        for (let i = 0; i < examQuestions.length; i++) {
            const selectedAnswer = document.querySelector(`input[name="question${i + 1}"]:checked`);
            if (selectedAnswer) {
                selectedAnswers.push({
                    questionId: examQuestions[i]._id,
                    selectedOption: selectedAnswer.value,
                    isCorrect: false
                });
            }
        }

        const data = { applicantId, answers: selectedAnswers };
        console.log('Submitting data:', data); // Debugging log

        // Send POST request to the server
        await fetch("/admin/result", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                $(document).ready(() => {
                    iziToast.success({
                        title: "Ok",
                        message: data.msg,
                    });
                });

                setInterval(() => {
                    window.location.href = data.redirectURL;
                }, 2000);
            } else if (data.error) {
                $(document).ready(() => {
                    iziToast.error({
                        title: "Error",
                        message: data.error,
                    });
                });
            }
        })
        .catch((e) => {
            console.log('Fetch error:', e);
        });
    } catch (e) {
        console.error('Error:', e);
    }
}

// Ensure form submission is captured
examForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
    console.log('Form submission captured'); // Debugging log
    await submitExamForm();
});

