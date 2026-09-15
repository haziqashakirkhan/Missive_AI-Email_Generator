document.addEventListener("DOMContentLoaded", function () {
  // Core DOM Elements
  var form = document.getElementById("email-form");
  var submitButton = document.getElementById("submit-button");
  var purposeInput = document.getElementById("purpose");
  var purposeCount = document.getElementById("purpose-count");
  var clearBtn = document.getElementById("clear-btn");
  var recipientInput = document.getElementById("recipient_name");
  var senderInput = document.getElementById("sender_name");
  var toneSelect = document.getElementById("tone");
  var lengthSelect = document.getElementById("length");
  var toast = document.getElementById("toast");

  // Statistics Elements
  var wordCountEl = document.getElementById("stat-word-count");
  var readTimeEl = document.getElementById("stat-read-time");

  // Show Toast Notification
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }

  // Update Purpose Character Counter
  function updateCharCount() {
    if (purposeInput && purposeCount) {
      var len = purposeInput.value.length;
      purposeCount.textContent = len + " character" + (len === 1 ? "" : "s");
    }
  }

  if (purposeInput) {
    purposeInput.addEventListener("input", updateCharCount);
    updateCharCount();
  }

  // Calculate Document Statistics (Word Count & Reading Time)
  function updateDocumentStats() {
    var bodyEl = document.getElementById("email-body-text");
    if (!bodyEl) return;

    var text = bodyEl.textContent.trim();
    if (!text) {
      if (wordCountEl) wordCountEl.textContent = "0 words";
      if (readTimeEl) readTimeEl.textContent = "< 1 min read";
      return;
    }

    var words = text.split(/\s+/).filter(Boolean).length;
    var minutes = Math.max(1, Math.ceil(words / 200));

    if (wordCountEl) wordCountEl.textContent = words + " word" + (words === 1 ? "" : "s");
    if (readTimeEl) readTimeEl.textContent = minutes + " min read";
  }

  updateDocumentStats();

  // Preset Scenario Click Listeners
  var presetChips = document.querySelectorAll(".chip-btn");
  presetChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var recipient = chip.getAttribute("data-recipient");
      var purpose = chip.getAttribute("data-purpose");
      var tone = chip.getAttribute("data-tone");
      var length = chip.getAttribute("data-length");

      if (recipientInput && recipient) recipientInput.value = recipient;
      if (purposeInput && purpose) {
        purposeInput.value = purpose;
        updateCharCount();
      }
      if (toneSelect && tone) toneSelect.value = tone;
      if (lengthSelect && length) lengthSelect.value = length;

      showToast("Scenario loaded into draft parameters");

      var controlPanel = document.querySelector(".control-panel");
      if (controlPanel) {
        controlPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Clear Form Parameters
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (form) form.reset();
      updateCharCount();
      showToast("Parameters cleared");
    });
  }

  // Form Submission Loading State
  if (form && submitButton) {
    form.addEventListener("submit", function () {
      submitButton.disabled = true;
      submitButton.classList.add("loading");
      submitButton.innerHTML = `
        <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10" />
        </svg>
        <span>Constructing Draft...</span>
      `;
    });
  }

  // Copy Subject Handler
  var copySubjectBtn = document.querySelector(".copy-subject-btn");
  if (copySubjectBtn) {
    copySubjectBtn.addEventListener("click", function () {
      var subjectText = copySubjectBtn.getAttribute("data-subject");
      if (subjectText) {
        navigator.clipboard.writeText(subjectText).then(function () {
          showToast("Subject copied to clipboard");
        });
      }
    });
  }

  // Copy Body Handler
  var copyBodyBtn = document.querySelector(".copy-body-btn");
  if (copyBodyBtn) {
    copyBodyBtn.addEventListener("click", function () {
      var bodyEl = document.getElementById("email-body-text");
      if (bodyEl) {
        navigator.clipboard.writeText(bodyEl.textContent.trim()).then(function () {
          showToast("Body copied to clipboard");
        });
      }
    });
  }

  // Copy Full Email Handler
  var copyAllBtn = document.getElementById("copy-all-btn");
  if (copyAllBtn) {
    copyAllBtn.addEventListener("click", function () {
      var subjectEl = document.getElementById("subject-text");
      var bodyEl = document.getElementById("email-body-text");

      var fullText = "";
      if (subjectEl) {
        fullText += "Subject: " + subjectEl.textContent.trim() + "\n\n";
      }
      if (bodyEl) {
        fullText += bodyEl.textContent.trim();
      }

      if (fullText) {
        navigator.clipboard.writeText(fullText).then(function () {
          showToast("Full email draft copied to clipboard");
        });
      }
    });
  }

  // Export .txt Download Handler
  var downloadBtn = document.getElementById("download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      var subjectEl = document.getElementById("subject-text");
      var bodyEl = document.getElementById("email-body-text");

      var fullText = "";
      if (subjectEl) {
        fullText += "Subject: " + subjectEl.textContent.trim() + "\n\n";
      }
      if (bodyEl) {
        fullText += bodyEl.textContent.trim();
      }

      if (fullText) {
        var dateStr = new Date().toISOString().slice(0, 10);
        var blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "missive_draft_" + dateStr + ".txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Exported missive_draft_" + dateStr + ".txt");
      }
    });
  }

  // Setup Mailto Application Link
  var mailtoLink = document.getElementById("mailto-link");
  if (mailtoLink) {
    var subjectEl = document.getElementById("subject-text");
    var bodyEl = document.getElementById("email-body-text");

    var subj = subjectEl ? subjectEl.textContent.trim() : "";
    var body = bodyEl ? bodyEl.textContent.trim() : "";

    var href = "mailto:?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
    mailtoLink.setAttribute("href", href);
  }

  // Auto-scroll to result canvas if page loaded with result
  if (document.body.classList.contains("has-result")) {
    var result = document.getElementById("result");
    if (result) {
      setTimeout(function () {
        result.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }
});