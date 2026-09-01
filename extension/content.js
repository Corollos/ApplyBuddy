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

  const inputs = document.querySelectorAll(
    "input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='file']), textarea"
  );

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
      context.includes("given name") ||
      context.includes("givenname")
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
      context.includes("field of study") ||
      context.includes("fieldofstudy")
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
      new Event("input", {
        bubbles: true
      })
    );

    field.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    field.blur();

    return true;
  }

  inputs.forEach((field) => {
    if (
      field.type === "radio" ||
      field.type === "checkbox"
    ) {
      return;
    }

    const context = getFieldContext(field);
    const profileKey = detectProfileField(context);

    if (!profileKey || !profile[profileKey]) {
      return;
    }

    if (setFieldValue(field, profile[profileKey])) {
      filledCount++;

      console.log(
        `[ApplyBuddy] Filled ${profileKey}`
      );
    }
  });

  console.log(
    `[ApplyBuddy] Finished. Filled ${filledCount} field(s).`
  );
})();