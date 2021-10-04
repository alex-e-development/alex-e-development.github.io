const getFormData = () => {
  // Get each individual form input
  const newJobTitle = document.querySelector("#job-form-title");
  const newJobSummary = document.querySelector("#job-form-summary");
  const newJobContactEmail = document.querySelector("#job-form-contact-email");

  // Create a new object with the value of each form field
  const newJob = {
    title: newJobTitle.value,
    summary: newJobSummary.value,
    contactEmail: newJobContactEmail.value,
  };

  return newJob;
};

/**
 * Adds a new job post to the list of jobs
 *
 * @param {{ title: string, summary: string, contactEmail: string }} job Contains all properties of a job posting
 */
const createNewPost = (job) => {
  // Get a reference to any existing job post DOM node
  const existingJobPost = document.querySelector(".job-post");

  // Create a copy of that job post DOM node
  const clonedJobPost = existingJobPost.cloneNode(true);

  // Set the values of the cloned job post equal to the values in the forms
  // Note that for the anchor link we use `href` instead of `innerText` and we concatenate `mailto:`
  clonedJobPost.querySelector(".job-post-title").innerText = job.title;
  clonedJobPost.querySelector(".job-post-summary").innerText = job.summary;
  clonedJobPost.querySelector(
    ".job-post-contact-email"
  ).href = `mailto:${job.contactEmail}`;

  // Insert the new cloned job with updated values immediately after the jobs header tag
  document.querySelector(".jobs-header").after(clonedJobPost);
};

/**
 * Gets all jobs that are saved in localStorage
 *
 * @returns {Array<Object>} Array of jobs, empty if value in localStoage does not exist
 */
const getJobs = () => {
  // Get existing jobs from localStorage as a string
  // if they exist (will be `null` if not)
  const jobsString = localStorage.getItem("devJobs");

  // Create an array to hold the jobs
  let jobs = [];
  if (jobsString !== null) {
    // Convert the string back into a real Javasscript array and replace
    // our empty jobs array
    jobs = JSON.parse(jobsString);
  }

  // Returns either an empty array, or the existing jobs
  return jobs;
};

/**
 * Saves a single job in localStorage
 *
 * @param {Object} job of jobs, empty if value in localStoage does not exist
 */
const saveNewJob = (job) => {
  const jobs = getJobs();
  jobs.push(job);
  localStorage.setItem("devJobs", JSON.stringify(jobs));
};

/**
 * Submit the form, create a new job post, and clear the form data
 */
const formSubmit = () => {
  // Collect the job data from the form
  const newJob = getFormData();

  // Save the new job in localStorage
  saveNewJob(newJob);

  // Create a new job listing with the form data
  createNewPost(newJob);

  // Get a reference to the form DOM node
  const jobForm = document.querySelector(".job-form");

  // Reset the form so that a new job can be entered
  jobForm.reset();

  // Return a false value to prevent the default browser behavior of refreshing
  // the page on form submission
  return false;
};

const jobs = getJobs();

jobs.forEach((job) => {
  createNewPost(job);
});
