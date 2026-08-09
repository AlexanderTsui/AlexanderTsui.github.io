const comparisonExamples = {
  knight: {
    prompt: "A stylized knight character with a hexagonal helmet with a horizontal eye slit, rigid armor plates, a rectangular shield, and a sword arranged in a combat-ready pose.",
    image: "assets/images/comparison_knight_results.jpg",
    alt: "Qualitative comparison for the knight prompt"
  },
  dog: {
    prompt: "A small dog figurine in a sitting pose with upward-facing triangular ears, eyes, nose, and colorful splashes on feet, body, and collar.",
    image: "assets/images/comparison_dog_results.jpg",
    alt: "Qualitative comparison for the dog prompt"
  },
  buddha: {
    prompt: "A rigid Buddha bust with a slender neck, broad shoulders, elongated ears, spiral curls, and a tapered base.",
    image: "assets/images/comparison_buddha_results.jpg",
    alt: "Qualitative comparison for the Buddha prompt"
  },
  gazebo: {
    prompt: "An octagonal gazebo with a conical roof with a finial, eight vertical support columns, a perimeter railing with vertical balusters, and a slightly elevated flat base with an entry opening.",
    image: "assets/images/comparison_gazebo_results.jpg",
    alt: "Qualitative comparison for the gazebo prompt"
  },
  shoe: {
    prompt: "A high-top athletic shoe with a rigid upper, perforated toe box, and a multi-part midsole and outsole arranged in a layered configuration.",
    image: "assets/images/comparison_shoe_results.jpg",
    alt: "Qualitative comparison for the shoe prompt"
  }
};

const methodFigures = {
  concept: {
    src: "assets/images/concept.png",
    alt: "Conceptual comparison between autoregressive, diffusion, and Block3D generation",
    caption: "Block3D retains causal structure across blocks while enabling parallel, bidirectional denoising within each block."
  },
  pipeline: {
    src: "assets/images/pipeline.jpg",
    alt: "Block3D training and inference pipeline",
    caption: "Training uses a block-causal visibility pattern; inference alternates masked-token recovery with confidence-guided token correction."
  }
};

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const modal = document.querySelector(".image-modal");
const modalImage = modal.querySelector("img");
const modalCaption = modal.querySelector("p");
const video = document.querySelector("#project-video");

const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  navToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  nav.classList.toggle("is-open", !open);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
}));

document.querySelectorAll("[data-method]").forEach((button) => {
  button.addEventListener("click", () => {
    const figure = methodFigures[button.dataset.method];
    document.querySelectorAll("[data-method]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    const image = document.querySelector("#method-image");
    const zoomButton = image.closest(".zoomable");
    image.src = figure.src;
    image.alt = figure.alt;
    document.querySelector("#method-caption").textContent = figure.caption;
    zoomButton.dataset.zoomSrc = figure.src;
    zoomButton.dataset.zoomAlt = figure.alt;
  });
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    const example = comparisonExamples[button.dataset.example];
    document.querySelectorAll("[data-example]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    const image = document.querySelector("#comparison-image");
    const zoomButton = image.closest(".zoomable");
    image.src = example.image;
    image.alt = example.alt;
    document.querySelector("#comparison-prompt").textContent = example.prompt;
    zoomButton.dataset.zoomSrc = example.image;
    zoomButton.dataset.zoomAlt = example.alt;
  });
});

document.querySelectorAll(".chapter").forEach((chapter) => {
  chapter.addEventListener("click", () => {
    const targetTime = Number(chapter.dataset.time);
    document.querySelectorAll(".chapter").forEach((item) => item.classList.toggle("is-active", item === chapter));

    const playFromTarget = async () => {
      video.removeEventListener("seeked", playFromTarget);
      video.currentTime = targetTime;
      try {
        await video.play();
      } catch (_) {
        // Browser autoplay policy may require the native play control.
      }
    };

    const seekAndPlay = () => {
      video.pause();
      video.addEventListener("seeked", playFromTarget, { once: true });
      video.currentTime = targetTime;
    };

    if (video.readyState >= 1) {
      seekAndPlay();
    } else {
      video.addEventListener("loadedmetadata", seekAndPlay, { once: true });
      video.load();
    }
  });
});

video.addEventListener("timeupdate", () => {
  const chapters = [...document.querySelectorAll(".chapter")];
  const active = [...chapters].reverse().find((chapter) => video.currentTime >= Number(chapter.dataset.time));
  if (active) chapters.forEach((chapter) => chapter.classList.toggle("is-active", chapter === active));
});

document.querySelectorAll("[data-zoom-src]").forEach((button) => {
  button.addEventListener("click", () => {
    modalImage.src = button.dataset.zoomSrc;
    modalImage.alt = button.dataset.zoomAlt || "Full-size figure";
    modalCaption.textContent = button.dataset.zoomAlt || "";
    modal.showModal();
    document.body.classList.add("modal-open");
  });
});

const closeModal = () => {
  modal.close();
  document.body.classList.remove("modal-open");
};
modal.querySelector(".modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
modal.addEventListener("close", () => document.body.classList.remove("modal-open"));

document.querySelector("[data-copy]").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(document.querySelector("#bibtex").innerText);
    button.textContent = "Copied";
    setTimeout(() => { button.textContent = "Copy"; }, 1800);
  } catch (_) {
    button.textContent = "Select text";
  }
});
