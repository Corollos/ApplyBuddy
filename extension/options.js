const fields = [
  "firstName",
  "middleName",
  "lastName",
  "email",
  "phone",

  "address",
  "city",
  "state",
  "zipCode",
  "country",

  "linkedin",
  "github",
  "portfolio",

  "school",
  "degree",
  "major",
  "graduationDate"
];

// Load the saved profile when the page opens.
document.addEventListener("DOMContentLoaded", async () => {
  const profile = await chrome.storage.local.get(fields);

  fields.forEach((field) => {
    const input = document.getElementById(field);

    if (input && profile[field]) {
      input.value = profile[field];
    }
  });
});

// Save the profile.
document.getElementById("saveButton").addEventListener("click", async () => {
  const profile = {};

  fields.forEach((field) => {
    const input = document.getElementById(field);

    if (input) {
      profile[field] = input.value.trim();
    }
  });

  await chrome.storage.local.set(profile);

  const status = document.getElementById("status");

  status.textContent = "Profile saved locally!";

  setTimeout(() => {
    status.textContent = "";
  }, 3000);
});