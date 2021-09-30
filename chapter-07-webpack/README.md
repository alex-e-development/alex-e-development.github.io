# Chapter 05 - Web Storage and JSDoc

## What is Web Storage?
The Web Storage API is a standard for two different ways to store and persist data in a web application.  The one we'll be using is called [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

 `localStorage` is a property of the global [window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object available when using Javascript in a browser. It's a tool that lets you store up to 5MB of data (in a string format) in the user's browser that will remain there even after the browser is closed. It is a close cousin to [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) which works exactly the same way, but will only last as long as the page session exists (will survive a refresh, but not a browser close).

What this will allow us to do for our application is save a copy of each job that is inserted into our app, so that they still appear even when the use goes to another page, refreshes or closes the browser. The user will still have the ability to remove the data by clearing their browsing data, or alternatively we can provide a tool to remove it manually with the `localstorage.clear()` function.

## Prerequisites

This chapter will presume you have a good familiarity with using [Javascript objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object). If you don't, it would be a good idea to stop here and do some reading and practice, as objects are one of the most important fundamental concepts in Javascript. If you just need a refresher then [javascript.info](https://javascript.info/object) has you covered.

You will also need to understand the basic difference between Javascript objects and [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON). The short of it is that the former (objects) are a Javascript specific programming construct that can only exist within the Javascript environment. The latter (JSON) is just a text standard for sharing data in a format that is based on how JS objects look. Since JSON can only store [serializable](https://developer.mozilla.org/en-US/docs/Glossary/Serialization) data (data that can be written as text) it doesn't `functions` like a real object would, but it does support values like strings and numbers, and even objects and arrays so long as they themselves only store simple values.

The reason you need to understand this difference is because `localStorage` can only store string values. You can't store a Javascript object directly in `localStorage`. Fortunately there is a very easy workaround available: [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) functions convert data from a JS object -> JSON and then back again respectively, making it super easy to store complex Javascript data in `localStorage` and then retrieve it again in the future.

## ---

We're going to create a new function in `script.js` called `getFormData`. There's nothing new in this function, we've simply just taken the pieces out of `formSubmission` that were only relevant for actually getting the values from the form. We will place this new function at the top of the file:

```js
const getFormData = () => {
  // Get each individual form input
  const newJobTitle = document.querySelector("#job-form-title");
  const newJobSummary = document.querySelector("#job-form-summary");
  const newJobContactEmail = document.querySelector("#job-form-contact-email");
};
...
```

We are going to want to be able to invoke (call) this function and get back the text values from the form. Right now it doesn't return anything. We can't return three separate values in Javascript, so we have to group them together somehow. Our options are either an [object](https://javascript.info/object) or an [array](https://javascript.info/array).

Array are better for creating groups of similar things (a list of names for example) but since we are dealing with three _different_ things (title, summary and email) and object that we can use to label these values suits our purpose better. Let's return an object with each of these values. Our `getFormData` function now looks like:

`script.js`

```js
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
  }

  return newJob;
}
...
```

Make sure not to miss the `.value` there when setting up the object, we are working with input elements so we need to get the text value from inside them, not the elements themselves.

Next we will do similar with another new function that is only responsible for taking a job object, and creating a new post for it in the DOM. Even if we weren't adding the new `localStorage` feature this would be an improvement on our previous code. Smaller functions that only perform one task are considered a [best practice](https://en.wikipedia.org/wiki/Single-responsibility_principle).

Let's make a `createNewPost` function that only copies over the code that was relevant for adding the job post to the DOM. We'll place it underneath `getFormData`:

`script.js`

```js
...
const createNewPost = () => {
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
}
...
```

This function unfortunately will not work! We removed the code that was responsible for getting the form values so there is nothing to insert. We need to update this function to accept an [argument](https://javascript.info/function-basics#parameters). That argument (sometimes called parameter) we are going to expect to come in the same shape as return value from our `getFormData` function.

Now as an aside I will take this opportunity to say this is one of the examples of somewhere where [Typescript](https://www.typescriptlang.org/) really shines. If we were using TS we would create an _interface_ that explicitly states our argument must have properties called _title, summary and contactEmail_ and that each of them must be strings, and our IDE would enforce that for us and let us know if we (or someone else) accidently expected a different shape or name for one of those properties.

As it stands we are still working exclusively with JS, so we'll just have to trust ourselves and our teammates to rules (that said we do have options within Javascript as well, for example using [JSDoc](https://en.wikipedia.org/wiki/JSDoc) comments on our functions). These are completely optional, leaving them off won't impact the function of your code.

So let's add the argument now. Don't forget to also update the three occasions where we previously set the values using `.value`. The object we receive will already have the string values set on it for our convenience.

`script.js`

```js
...
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
...
```

Notice we've added an example of a JSDoc comment before the function that gives some additional helpful metadata. If you're using an IDE try hovering over the function name to see, it will look something like this (example from VS Code):

![JSDoc Example](images/chapter-05-jsdoc-example.jpg)

Lastly we need to clean what's left from our existing `formSubmit` function. Just before we do that let's get our code back into the same working order that it was before. The final step is to call the two smaller functions we've just created inside of our `formSubmit` function. It will look like this:

```js
...
/**
 * Submit the form, create a new job post, and clear the form data
 */
const formSubmit = () => {
  // Collect the job data from the form
  const newJob = getFormData(); // <-- NEW

  // Create a new job listing with the form data
  createNewPost(newJob); // <-- NEW

  // Get a reference to the form DOM node
  const jobForm = document.querySelector(".job-form");

  // Reset the form so that a new job can be entered
  jobForm.reset();

  // Return a false value to prevent the default browser behavior of refreshing
  // the page on form submission
  return false;
};
```

Save, host your app and give it a try. If everything has gone well you'll be able to submit new jobs the same way you were before, but now with each piece of it being handled individually by a separate function. This was a necessary step in order to be able to cleanly implement our local storage solution.

## Adding localStorage to our Application

Remember that at the beginning of this chapter that [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) only works with strings, so we'll need to convert back and forth between strings and objects in our functions. We will start with the function that loads existing jobs, the reason being is that our save function will need to use it, so we should write it first. Place it below the `createNewPost` function and above the `formSubmit` function:

`script.js`

```js
// ...
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
// ...
```

(Note that I used `Object` array as `@returns` for JSDoc comments, there's no reason you can't use the previous type that shows all the propertie explicitly, this is just to keep the example simple and focused on the function code)

So now whenever we call `getJobs` we have guaranteed we will receive an array, it will just be empty if no existing jobs are saved. This makes our function extremely easy to use, because now we don't need to write any extra code moving forward for handling the case where the value in `localStorage` is null.

Now let's write the code for our `saveNewJob` function. Place it directly below the `getJobs` function we just wrote:

`script.js`

```js
// ...
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
// ...
```

This function is fairly self explanatory, it gets all existing jobs (an empty array if none exist) adds a new job to the list, and then saves it back again in `localStorage`. The next time we call the `getJobs` function it will include this new job in the list it returns.

Next we want to make sure that this function gets called whenever a new job is submitted. Add a call to `saveNewJob` to `formSubmit`:

`script.js`

```js
// ...
const formSubmit = () => {
  // Collect the job data from the form
  const newJob = getFormData();

  // Save the new job in localStorage
  saveNewJob(newJob); // <-- NEW

  // Create a new job listing with the form data
  createNewPost(newJob);

// ...
```

And lastly, whenever we initially load the page, we need to initially populate the list of all jobs from all the ones saved in `localStorage`.  To do that we'll add a bit of code to the very bottom of the `script.js` file, not as a new function, this is code at the top level scope that we want to make sure runs immediately when this file is loaded:

`script.js`
```js
// ...
const jobs = getJobs();

jobs.forEach((job) => {
  createNewPost(job);
});
```

Here we get all existing jobs, iterate through them with [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach), and call our `createNewPost` on each job.  

If you're not too familiar with `forEach` or the other array methods make sure you really take the time to do so, they're some of the most common functions you'll use when writing Javascript professionally.  [Javascript.info](https://javascript.info/array-methods) has a fantastic primer on how to use them.

## Wrapping Up

No screenshot at the end of this one as there isn't anything new to see, but if all has gone well you now have a job app with persistent storage!  Try adding a new job and refreshing the page, they won't disappear!  

If you want to reset all of your custom jobs then you can simply call the `localStorage.clear()` method.  You can do this most simply by opening the dev tools console (typically `F12`) and just typing it in there.  Or you could write a small clear function and attach it to a button in your app if you like!
