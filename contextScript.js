console.log("Guardium content script loaded");

function setNativeValue(element, value) {
  const prototype = Object.getPrototypeOf(element);
  const descriptor =
    Object.getOwnPropertyDescriptor(prototype, "value") ||
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");

  if (descriptor && descriptor.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function isExtensionContextValid() {
  return typeof chrome !== "undefined" && chrome.runtime?.id;
}

function findUsernameField(passwordInput) {
  const inputs = Array.from(document.querySelectorAll("input"));
  const passIndex = inputs.indexOf(passwordInput);

  for (let i = passIndex - 1; i >= 0; i--) {
    const input = inputs[i];
    if (
      (input.type === "text" || input.type === "email") &&
      input.offsetParent !== null
    ) {
      return input;
    }
  }
  return null;
}

function fillCredentials(passwordInput, credentials) {
  if (!credentials?.password) return;

  setNativeValue(passwordInput, credentials.password);

  const usernameInput = findUsernameField(passwordInput);
  if (usernameInput && credentials.username) {
    setNativeValue(usernameInput, credentials.username);
  }
}

function attachListeners(passwordInput) {
  if (passwordInput.dataset.guardiumAttached) return;
  passwordInput.dataset.guardiumAttached = "true";

  passwordInput.addEventListener("focus", () => {
    if (!isExtensionContextValid()) return;

    chrome.runtime.sendMessage(
      {
        type: "REQUEST_CREDENTIALS",
        site: location.hostname,
      },
      (response) => {
        if (chrome.runtime.lastError) return;
        if (response?.credentials) {
          fillCredentials(passwordInput, response.credentials);
        }
      }
    );
  });
}

function detectPasswordInputs() {
  document
    .querySelectorAll('input[type="password"]')
    .forEach((el) => attachListeners(el));
}

const observer = new MutationObserver(detectPasswordInputs);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

detectPasswordInputs();

// 🔁 Background → Content autofill
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FILL_CREDENTIALS" && message.credentials) {
    const passwordInputs = document.querySelectorAll(
      'input[type="password"]'
    );

    passwordInputs.forEach((input) =>
      fillCredentials(input, message.credentials)
    );

    sendResponse({ filled: true });
  }
});

// 🔄 Sync typed credentials back to background
let typingTimer;

function syncToBackground(passwordInput) {
  clearTimeout(typingTimer);

  typingTimer = setTimeout(() => {
    if (!passwordInput.value || !isExtensionContextValid()) return;

    const usernameInput = findUsernameField(passwordInput);

    chrome.runtime.sendMessage({
      type: "QUEUE_CREDENTIALS",
      data: {
        username: usernameInput?.value || "",
        password: passwordInput.value,
        site: location.hostname,
      },
    });
  }, 500);
}

document.addEventListener(
  "input",
  (e) => {
    if (e.target?.type === "password") {
      syncToBackground(e.target);
    }
  },
  true
);

document.addEventListener(
  "change",
  (e) => {
    if (e.target?.type === "password") {
      syncToBackground(e.target);
    }
  },
  true
);
