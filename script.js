// =======================
// SELECTION & PREVIEW LOGIC
// =======================

const baseOptions = document.querySelectorAll('input[name="base"]');
const featureOptions = document.querySelectorAll('.feature-item input');
const themeOptions = document.querySelectorAll('input[name="theme"]');

const basePriceEl = document.getElementById("basePrice");
const featuresPriceEl = document.getElementById("featuresPrice");
const totalPriceEl = document.getElementById("totalPrice");
const previewBox = document.getElementById("previewBox");
const previewFeatures = document.getElementById("previewFeatures");

// Accordion & card selection
document.querySelectorAll(".project-card").forEach(card => {
    const radio = card.querySelector("input[type='radio']");

    // Accordion toggle
    card.addEventListener("click", (e) => {
        if (e.target.tagName === "INPUT") return; // skip if clicking radio
        document.querySelectorAll(".project-card").forEach(c => c !== card && c.classList.remove("active"));
        card.classList.toggle("active");
    });

    // Card selection
    radio.addEventListener("change", () => {
        document.querySelectorAll(".project-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        calculateTotal();
    });
});

// Theme change
themeOptions.forEach(option => {
    option.addEventListener("change", function() {
        previewBox.className = "preview-box " + this.value;
        calculateTotal(); // optional: update if theme affects preview price
    });
});

// Features & total calculation
featureOptions.forEach(option => option.addEventListener("change", calculateTotal));
baseOptions.forEach(option => option.addEventListener("change", calculateTotal));

function calculateTotal() {
    let basePrice = 0;
    let featuresPrice = 0;
    previewFeatures.innerHTML = "";

    baseOptions.forEach(option => { if(option.checked) basePrice = parseInt(option.value); });
    featureOptions.forEach(option => {
        if(option.checked) {
            featuresPrice += parseInt(option.value);
            let div = document.createElement("div");
            div.innerText = option.parentElement.innerText;
            previewFeatures.appendChild(div);
        }
    });

    if(previewFeatures.innerHTML === "") previewFeatures.innerHTML = "<p>Selected features will appear here</p>";

    let total = basePrice + featuresPrice;
    basePriceEl.innerText = "N$ " + basePrice.toLocaleString();
    featuresPriceEl.innerText = "N$ " + featuresPrice.toLocaleString();
    totalPriceEl.innerText = "N$ " + total.toLocaleString();
}

// Initialize
calculateTotal();



// =======================
// CONSULTATION MODAL LOGIC
// =======================

const consultationBtn = document.getElementById("consultationBtn");
const modal = document.getElementById("consultationModal");
const closeModal = document.querySelector(".close-modal");

consultationBtn.addEventListener("click", () => {
    modal.style.display = "flex";

    const project = document.querySelector("input[name='base']:checked");
    const theme = document.querySelector("input[name='theme']:checked");
    const features = [];
    document.querySelectorAll(".feature-item input:checked")
        .forEach(f => features.push(f.parentElement.innerText));

    // Fill hidden inputs for EmailJS
    document.getElementById("consultProject").value =
        project ? project.parentElement.innerText.trim() : "None";
    document.getElementById("consultTheme").value =
        theme ? theme.value.replace("-theme","") : "Default";
    document.getElementById("consultFeatures").value =
        features.length ? features.join(", ") : "None";
    document.getElementById("consultTotal").value =
        document.getElementById("totalPrice").innerText;


    document.getElementById("consultProjectDisplay").textContent =
        document.getElementById("consultProject").value;
    document.getElementById("consultThemeDisplay").textContent =
        document.getElementById("consultTheme").value;
    document.getElementById("consultFeaturesDisplay").textContent =
        document.getElementById("consultFeatures").value;
    document.getElementById("consultTotalDisplay").textContent =
        document.getElementById("consultTotal").value;
});

closeModal.addEventListener("click", () => { modal.style.display = "none"; });
window.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });



// =======================
// EMAILJS FORM HANDLER (REUSABLE)
// =======================

// Initialize EmailJS
(function(){
emailjs.init("BwkhSeTD7P0qzOJom");
})();

function setupEmailForm(formId, feedbackId) {
    const form = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);
    if(!form || !feedback) return;

    form.addEventListener('submit', function(e){
        e.preventDefault();

        // Send form via EmailJS
        emailjs.sendForm("service_34av8ln","template_qeezjmq", this, "BwkhSeTD7P0qzOJom")
        .then(() => {
            feedback.textContent = "Your message has been sent successfully!";
            feedback.classList.add('success');
            feedback.classList.remove('error');
            feedback.style.display = 'block';
            
            form.reset(); 

            setTimeout(() => {
        modal.style.display = "none";
    }, 2000);

        })
        .catch(() => {
            feedback.textContent = "Oops! Something went wrong. Try again.";
            feedback.classList.add('error');
            feedback.classList.remove('success');
            feedback.style.display = 'block';
        });
    });
}

// =======================
// INITIALIZE FOR BOTH FORMS
// =======================
setupEmailForm("contactForm", "contactFeedback");       
setupEmailForm("consultationForm", "consultationFeedback");


// =======================
// PROJECT MODAL LOGIC
// =======================

const projectButtons = document.querySelectorAll(".view-project-btn");
const projectModal = document.getElementById("projectModal");
const projectImages = document.getElementById("projectImages");
const projectLink = document.getElementById("projectLink");
const closeProjectModal = document.querySelector(".close-project-modal");

projectButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        projectModal.style.display = "flex";

        // Images
        const images = btn.dataset.images.split(",");
        projectImages.innerHTML = "";

        images.forEach(img => {
            const imageEl = document.createElement("img");
            imageEl.src = img;
            projectImages.appendChild(imageEl);
        });

        // Link
        projectLink.href = btn.dataset.link;
    });
});

closeProjectModal.addEventListener("click", () => {
    projectModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if(e.target === projectModal){
        projectModal.style.display = "none";
    }
});