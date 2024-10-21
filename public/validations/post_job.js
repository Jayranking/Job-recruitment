// Registration Form Validation
const jobPostForm = document.getElementById("jobPostForm");

jobPostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Getting Error Div
  const jobTitleErr = document.querySelector(".jobTitleErr");
  const eduRequirementErr = document.querySelector(".eduRequirementErr");
  const jobExperienceErr = document.querySelector(".jobExperienceErr");
  const skillsErr = document.querySelector(".skillsErr");
  
  // Returning All the Errors
  jobTitleErr.innerHTML = "";
  eduRequirementErr.innerHTML = "";
  jobExperienceErr.innerHTML = "";
  skillsErr.innerHTML = "";
  

  // Getting all the value from our inputs
  const jobTitle = jobPostForm.jobTitle.value;
  const eduRequirement = jobPostForm.eduRequirement.value;
  const jobExperience = jobPostForm.jobExperience.value;
  const skills = jobPostForm.skills.value;


  // Applying Regex For the VAlidation
  const textReg = /^[a-zA-Z0-9\s,.'()\-!]+$/;

  // Writing The Validation Logic Using Statement
  if (!textReg.test(jobTitle)) {
    jobTitleErr.innerHTML = "Invalid text format input";
    return;
  }

  if (!textReg.test(eduRequirement)) {
    eduRequirementErr.innerHTML = "Invalid text format input";
    return;
  }

  if (!textReg.test(jobExperience)) {
    jobExperienceErr.innerHTML = "Invalid text format input";
    return;
  }

  if (!textReg.test(skills)) {
    skillsErr.innerHTML = "Invalid text format input";
    return;
  }

  const data = {jobTitle, eduRequirement, jobExperience, skills};

  fetch("/admin/post-job", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
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
      }
      if (data.error) {
        // Invoke the toast component
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
