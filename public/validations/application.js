const applyForm = document.getElementById("applyForm");

applyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // fetch all divs using querySelector
  const fullNameErr = document.querySelector(".fullNameErr");
  const emailErr = document.querySelector(".emailErr");
  const phoneErr = document.querySelector(".phone_noErr"); 
  const qualificationErr = document.querySelector(".qualificationErr");
  const resumeErr = document.querySelector(".resumeErr");

  // Clear previous errors
  fullNameErr.innerHTML = "";
  emailErr.innerHTML = "";
  phoneErr.innerHTML = "";
  qualificationErr.innerHTML = "";
  resumeErr.innerHTML = "";

  const fullName = applyForm.fullName.value;
  const email = applyForm.email.value;
  const phone_no = applyForm.phone_no.value;
  const qualification = applyForm.qualification.value;
  const resume = applyForm.resume;
  const job_id = applyForm.job_id.value;

  // Regex for validation
  const nameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
  const phone_noReg = /^[0-9]+$/;
  const emailReg = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;

  // Validation checks
  if (!nameReg.test(fullName)) {
    fullNameErr.innerHTML = "Full name is required";
    return;
  }

  if (!emailReg.test(email)) {
    emailErr.innerHTML = "Email is required";
    return;
  }

  if (!phone_noReg.test(phone_no)) {
    phoneErr.innerHTML = "Phone number is required";
    return;
  }

  if (qualification == "") {
    qualificationErr.innerHTML = "Select your Qualification";
    return;
  }

  if (resume.files.length == 0) {
    resumeErr.innerHTML = "Upload your resume";
    return;
  }

  // Creating form data
  const formData = new FormData();

  formData.append("job_id", job_id);
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("phone_no", phone_no);
  formData.append("qualification", qualification);
  formData.append("resume", resume.files[0]);

  // Submitting the form using fetch
  fetch("/apply-form", {
    method: "POST",
    body: formData,
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

        setTimeout(() => {
          window.location.href = data.redirectURL;
        }, 2000);
      }
      if (data.error) {
        $(document).ready(() => {
          iziToast.error({
            title: "Error",
            message: data.error,
          });
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
