// NEW CHAPTER 04
const formSubmit = () => {
  // Get a reference to the form DOM node
  const jobForm = document.querySelector(".job-form");

  // Get each individual form input
  const newJobTitle = document.querySelector("#job-form-title");
  const newJobSummary = document.querySelector("#job-form-summary");
  const newJobContactEmail = document.querySelector("#job-form-contact-email");

  // Get a reference to any existing job post DOM node
  const existingJobPost = document.querySelector(".job-post");

  // Create a copy of that job post DOM node
  const clonedJobPost = existingJobPost.cloneNode(true);

  // Set the values of the cloned job post equal to the values in the forms
  // Note that for the anchor link we use `href` instead of `innerText` and we concatenate `mailto:`
  clonedJobPost.querySelector(".job-post-title").innerText = newJobTitle.value;
  clonedJobPost.querySelector(".job-post-summary").innerText =
    newJobSummary.value;
  clonedJobPost.querySelector(
    ".job-post-contact-email"
  ).href = `mailto:${newJobContactEmail.value}`;

  // Insert the new cloned job with updated values immediately after the jobs header tag
  document.querySelector(".jobs-header").after(clonedJobPost);

  // Reset the form so that a new job can be entered
  jobForm.reset();

  // Return a false value to prevent the default browser behavior of refreshing
  // the page on form submission
  return false;
};
// END: NEW CHAPTER 04
