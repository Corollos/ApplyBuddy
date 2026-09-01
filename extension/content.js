(async () => {
  const profileFields = [
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
    "graduationDate",
    "workAuthorization",
    "requireSponsorship",
    "willingToRelocate"
  ];

  const profile = await chrome.storage.local.get(profileFields);

  let filledCount = 0;

  const textInputs = document.querySelectorAll(
    "input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='file']):not([type='radio']):not([type='checkbox']), textarea"
  );

  const selects = document.querySelectorAll("select");

  function getFieldContext(field) {
    const parts = [
      field.name,
      field.id,
      field.placeholder,
      field.getAttribute("aria-label"),
      field.getAttribute("autocomplete")
    ];

    if (field.id) {
      const label = document.querySelector(
        `label[for="${CSS.escape(field.id)}"]`
      );

      if (label) {
        parts.push(label.innerText);
      }
    }

    const parentLabel = field.closest("label");

    if (parentLabel) {
      parts.push(parentLabel.innerText);
    }

    return parts
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function detectProfileField(context) {
    if (
      context.includes("first name") ||
      context.includes("firstname") ||
      context.includes("given name")
    ) {
      return "firstName";
    }

    if (
      context.includes("middle name") ||
      context.includes("middlename")
    ) {
      return "middleName";
    }

    if (
      context.includes("last name") ||
      context.includes("lastname") ||
      context.includes("surname") ||
      context.includes("family name")
    ) {
      return "lastName";
    }

    if (
      context.includes("email") ||
      context.includes("e-mail")
    ) {
      return "email";
    }

    if (
      context.includes("phone") ||
      context.includes("telephone") ||
      context.includes("mobile")
    ) {
      return "phone";
    }

    if (
      context.includes("street address") ||
      context.includes("address line 1") ||
      context.includes("address1") ||
      context.includes("street")
    ) {
      return "address";
    }

    if (
      context.includes("city") ||
      context.includes("town")
    ) {
      return "city";
    }

    if (
      context.includes("state") ||
      context.includes("province") ||
      context.includes("region")
    ) {
      return "state";
    }

    if (
      context.includes("zip") ||
      context.includes("postal code") ||
      context.includes("postcode")
    ) {
      return "zipCode";
    }

    if (context.includes("country")) {
      return "country";
    }

    if (context.includes("linkedin")) {
      return "linkedin";
    }

    if (context.includes("github")) {
      return "github";
    }

    if (
      context.includes("portfolio") ||
      context.includes("personal website") ||
      context.includes("website")
    ) {
      return "portfolio";
    }

    if (
      context.includes("school") ||
      context.includes("university") ||
      context.includes("college") ||
      context.includes("institution")
    ) {
      return "school";
    }

    if (context.includes("degree")) {
      return "degree";
    }

    if (
      context.includes("major") ||
      context.includes("field of study")
    ) {
      return "major";
    }

    if (
      context.includes("graduation") ||
      context.includes("graduate date") ||
      context.includes("expected completion")
    ) {
      return "graduationDate";
    }

    return null;
  }

  function setFieldValue(field, value) {
    if (field.value && field.value.trim() !== "") {
      return false;
    }

    field.focus();

    const prototype =
      field instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;

    const nativeSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value"
    )?.set;

    if (nativeSetter) {
      nativeSetter.call(field, value);
    } else {
      field.value = value;
    }

    field.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    field.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    field.blur();

    return true;
  }

  function setSelectValue(select, value) {
    const normalizedValue = String(value)
      .trim()
      .toLowerCase();

    const option = Array.from(select.options).find((option) => {
      const optionText = option.textContent
        .trim()
        .toLowerCase();

      const optionValue = option.value
        .trim()
        .toLowerCase();

      return (
        optionText === normalizedValue ||
        optionValue === normalizedValue
      );
    });

    if (!option) {
      return false;
    }

    select.value = option.value;

    select.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    select.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    return true;
  }

  // Fill regular text inputs and textareas.
  textInputs.forEach((field) => {
    const context = getFieldContext(field);
    const profileKey = detectProfileField(context);

    if (!profileKey || !profile[profileKey]) {
      return;
    }

    if (setFieldValue(field, profile[profileKey])) {
      filledCount++;
    }
  });

  // Fill standard dropdowns.
  selects.forEach((select) => {
    const context = getFieldContext(select);
    const profileKey = detectProfileField(context);

    if (!profileKey || !profile[profileKey]) {
      return;
    }

    if (setSelectValue(select, profile[profileKey])) {
      filledCount++;
    }
  });

  // Application question radio buttons.
  const applicationQuestions = {
    workAuthorization: [
      "legally authorized",
      "authorized to work",
      "work authorization",
      "eligible to work"
    ],

    requireSponsorship: [
      "visa sponsorship",
      "require sponsorship",
      "require visa",
      "future sponsorship"
    ],

    willingToRelocate: [
      "willing to relocate",
      "willingness to relocate",
      "open to relocation"
    ]
  };

  const fieldsets = document.querySelectorAll("fieldset");

  fieldsets.forEach((fieldset) => {
    const legend = fieldset.querySelector("legend");

    if (!legend) {
      return;
    }

    const questionText = legend.innerText.toLowerCase();

    let profileKey = null;

    for (const [key, keywords] of Object.entries(
      applicationQuestions
    )) {
      if (
        keywords.some((keyword) =>
          questionText.includes(keyword)
        )
      ) {
        profileKey = key;
        break;
      }
    }

    if (!profileKey || !profile[profileKey]) {
      return;
    }

    const desiredAnswer = String(profile[profileKey])
      .trim()
      .toLowerCase();

    const choices = fieldset.querySelectorAll(
      "input[type='radio']"
    );

    choices.forEach((choice) => {
      const choiceValue = String(choice.value)
        .trim()
        .toLowerCase();

      if (
        choiceValue === desiredAnswer &&
        !choice.checked
      ) {
        choice.click();
        filledCount++;
      }
    });
  });

  console.log(
    `[ApplyBuddy] Finished. Filled ${filledCount} field(s).`
  );
})();