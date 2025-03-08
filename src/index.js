/** @format */
// Auto refresh function - will reload the page 1 second after loading
(function () {
  // Check if this is the first load or a refresh
  const isFirstLoad = !sessionStorage.getItem("pageLoaded");

  if (isFirstLoad) {
    console.log("First page load detected, will refresh in 1 second");
    // Mark that we've loaded the page
    sessionStorage.setItem("pageLoaded", "true");

    // Set a timeout to refresh after 1 second
    setTimeout(() => {
      console.log("Auto-refreshing page...");
      window.location.reload();
    }, 1000);
  } else {
    console.log("Page has been refreshed");
  }
})();

const originalSectors = [
  {
    color: "#ffda85",
    text: "#333333",
    label: "Perfume",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1741278001/perfume_efz3lf.png",
  },
  {
    color: "#fff",
    text: "#333333",
    label: "Bad Luck",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1736947162/pu0tlogr54tnhtjvsev7.png",
  },
  {
    color: "#ffda85",
    text: "#333333",
    label: "500/= Gift Voucher",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1741279050/Gift2_dmrwa0.jpg",
  },
  {
    color: "#fff",
    text: "#333333",
    label: "Soft Toy",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1741278001/soft-toy_eadp5i.png",
  },
  {
    color: "#ffda85",
    text: "#333333",
    label: "Vaccum Flask",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1741277939/vaccum-flask_jk5ndj.png",
  },
  {
    color: "#fff",
    text: "#333333",
    label: "5000/= Gift Voucher",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1741279050/Gift_abnunk.jpg",
  },
  {
    color: "#ffda85",
    text: "#333333",
    label: "Bad Luck",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1736947162/pu0tlogr54tnhtjvsev7.png",
  },

  {
    color: "#fff",
    text: "#333333",
    label: "Water Bottle",
    image:
      "https://res.cloudinary.com/dicewvvjl/image/upload/v1741278001/water-bottle_mshcgh.png",
  },
];

let sectors = [...originalSectors];

const events = {
  listeners: {},
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

// Preload images for better performance
const preloadedImages = {};

function preloadImages() {
  originalSectors.forEach((sector) => {
    if (!preloadedImages[sector.image]) {
      const img = new Image();
      img.src = sector.image;
      preloadedImages[sector.image] = img;
    }
  });
}

// Function to check inventory and update sectors
function updateWheelSectors() {
  const inventory = JSON.parse(localStorage.getItem("wheelInventory"));
  const maxInventory = {
    Perfume: 40,
    "Water Bottle": 35,
    "500/= Gift Voucher": 25,
    "Soft Toy": 24,
    "Vaccum Flask": 6,
    "5000/= Gift Voucher": 5,
  };

  sectors = originalSectors.map((sector) => {
    // Skip "Bad Luck" sectors
    if (sector.label === "Bad Luck") {
      return sector;
    }

    // Check if this item is out of stock
    if (inventory[sector.label] >= maxInventory[sector.label]) {
      return {
        ...sector,
        label: "Bad Luck",
        // color: "#f1131e", // Use the red color for Bad Luck
        image:
          "https://res.cloudinary.com/dicewvvjl/image/upload/v1736947162/pu0tlogr54tnhtjvsev7.png", // Use the Bad Luck image
      };
    }
    return sector;
  });

  // Redraw the wheel with updated sectors
  ctx.clearRect(0, 0, dia, dia);
  sectors.forEach(drawSector);
  rotate();
}

function initializeInventory() {
  // Always set to the specified values, regardless of what's in localStorage
  localStorage.setItem(
    "wheelInventory",
    JSON.stringify({
      Perfume: 8,
      "Water Bottle": 5,
      "500/= Gift Voucher": 4,
      "Soft Toy": 5,
      "Vaccum Flask": 5,
      "5000/= Gift Voucher": 0,
    })
  );
  updateWheelSectors();
}

// Update inventory when item is won
function updateInventory(item) {
  const inventory = JSON.parse(localStorage.getItem("wheelInventory"));

  // Don't update inventory for "Bad Luck"
  if (item === "Bad Luck") return;

  inventory[item] = (inventory[item] || 0) + 1;

  localStorage.setItem("wheelInventory", JSON.stringify(inventory));
  updateInventoryDisplay();
  updateWheelSectors(); // Update wheel sectors after updating inventory
}

// Display inventory counts
// Display inventory counts
function updateInventoryDisplay() {
  const inventory = JSON.parse(localStorage.getItem("wheelInventory"));
  const inventoryDiv = document.getElementById("inventory-display");

  inventoryDiv.innerHTML = `
    <h2>Your Inventory</h2>
    <div class="inventory-items">
      <div class="inventory-item">
        <span>🧴 Perfume:</span>
        <span>${inventory["Perfume"]}/40</span>
      </div>
      <div class="inventory-item">
        <span>🍶 Water Bottle:</span>
        <span>${inventory["Water Bottle"]}/35</span>
      </div>
      <div class="inventory-item">
        <span>🎫 500/= Gift Voucher:</span>
        <span>${inventory["500/= Gift Voucher"]}/25</span>
      </div>
      <div class="inventory-item">
        <span>🧸 Soft Toy:</span>
        <span>${inventory["Soft Toy"]}/24</span>
      </div>
      <div class="inventory-item">
        <span>🍼 Vaccum Flask:</span>
        <span>${inventory["Vaccum Flask"]}/6</span>
      </div>
      <div class="inventory-item">
        <span>🎟️ 5000/= Gift Voucher:</span>
        <span>${inventory["5000/= Gift Voucher"]}/5</span>
      </div>
      <button id="reset-inventory" class="reset-button">Reset Inventory</button>
    </div>
  `;
}
function resetInventory() {
  const confirmReset = confirm(
    "Are you sure you want to reset your inventory? This action cannot be undone."
  );

  if (confirmReset) {
    localStorage.setItem(
      "wheelInventory",
      JSON.stringify({
        Perfume: 0,
        "Water Bottle": 0,
        "500/= Gift Voucher": 0,
        "Soft Toy": 0,
        "Vaccum Flask": 0,
        "5000/= Gift Voucher": 0,
      })
    );
    updateInventoryDisplay();
    updateWheelSectors();
  }
}
const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const bodyEl = document.querySelector("#game");
const resultsWrapperEl = document.querySelector("#results-wrapper");
const resultEl = document.querySelector("#result");
const resultTextEl = document.querySelector("#result-text");
const resultText1El = document.querySelector("#result-text1");
const congratsTextEl = document.querySelector("#congrats");
const resultContEl = document.querySelector("#result-container");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.996;
let angVel = 0;
let ang = 0;
let spinButtonClicked = false;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

// Update the drawSector function to preserve image aspect ratio
function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // Add border
  ctx.strokeStyle = "#eb6b34";
  ctx.lineWidth = 2;
  ctx.stroke();

  // IMAGE or TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);

  if (sector.label !== "Bad Luck" && sector.image) {
    // Draw image with preserved aspect ratio
    const maxImgSize = 150; // Maximum size for images
    const imgX = rad - maxImgSize - 30; // Position from edge
    const imgY = -maxImgSize / 2; // Center vertically

    if (
      preloadedImages[sector.image] &&
      preloadedImages[sector.image].complete
    ) {
      const img = preloadedImages[sector.image];

      // Calculate aspect ratio-preserving dimensions
      let imgWidth, imgHeight;
      const imgAspect = img.width / img.height;

      if (imgAspect >= 1) {
        // Wider image
        imgWidth = maxImgSize;
        imgHeight = maxImgSize / imgAspect;
      } else {
        // Taller image
        imgHeight = maxImgSize;
        imgWidth = maxImgSize * imgAspect;
      }

      // Center image vertically based on its actual calculated height
      const adjustedImgY = -imgHeight / 2;

      ctx.drawImage(img, imgX, adjustedImgY, imgWidth, imgHeight);
    }
  } else {
    // Draw "Bad Luck" text
    ctx.textAlign = "right";
    ctx.fillStyle = sector.text;
    ctx.font = "bold 30px 'Lato', sans-serif";
    ctx.fillText(sector.label, rad - 100, 10);
  }

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  spinEl.textContent = !angVel ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false;
    return;
  }

  angVel *= friction; // Using our higher friction value
  if (angVel < 0.002) angVel = 0;
  ang += angVel;
  ang %= TAU;
  rotate();
}

// 3. Update the main spin handler to use higher initial velocity
// This will replace any click handlers on the bodyEl/spin button
bodyEl.onclick = function () {
  if (!angVel) {
    // Original: angVel = rand(0.25, 0.45);
    angVel = rand(0.6, 0.8); // Much higher initial velocity
    spinButtonClicked = true;
    console.log("Starting spin with enhanced velocity: " + angVel.toFixed(3));
  }
};
function engine() {
  frame();
  requestAnimationFrame(engine);
}

// Initialize when page loads
preloadImages();
initializeInventory();
updateInventoryDisplay();

events.addListener("spinEnd", (sector) => {
  resultsWrapperEl.style.display = "flex";

  // Change "Bad Luck" to "Bad Luck" in the result text
  if (sector.label === "Bad Luck") {
    resultEl.textContent = "Bad Luck";
    // Don't show the "Bad Luck!" text
    resultTextEl.textContent = "";
    congratsTextEl.style.display = "none";
  } else {
    resultEl.textContent = sector.label;
    resultTextEl.textContent = "You have won a";
    congratsTextEl.style.display = "block";
    updateInventory(sector.label);
  }
});

// Add reset button event listener
document
  .getElementById("reset-inventory")
  .addEventListener("click", resetInventory);

function init() {
  sectors.forEach(drawSector);
  rotate();
  engine();
  // bodyEl.addEventListener("click", () => {
  //   if (!angVel) angVel = rand(0.25, 0.45);
  //   spinButtonClicked = true;
  //   console.log("main spin button");
  // });
}

resultsWrapperEl.addEventListener("click", function (event) {
  event.stopPropagation();
  resultsWrapperEl.style.display = "none";
  // window.location.reload();
});

init();

events.addListener("spinEnd", (sector) => {
  console.log(`Result: ${sector.label}`);
});

// Add these functions to your wheel code to enable precise sector targeting

/**
 * Simulates wheel deceleration to calculate total angle traveled
 * @param {number} initialVelocity - Starting angular velocity
 * @param {number} friction - Friction coefficient (default: 0.991)
 * @param {number} stopThreshold - Velocity threshold to stop (default: 0.002)
 * @returns {Object} - Frames until stop and total angle traveled
 */
function simulateDeceleration(
  initialVelocity,
  friction = 0.991,
  stopThreshold = 0.002
) {
  let velocity = initialVelocity;
  let totalAngle = 0;
  let frames = 0;

  while (velocity >= stopThreshold) {
    velocity *= friction;
    totalAngle += velocity;
    frames++;
  }

  return { frames, totalAngle };
}

/**
 * Calculates the precise initial velocity needed to stop at a specific sector
 * @param {number} currentAngle - Current wheel angle in radians
 * @param {number} targetSectorIndex - Index of the target sector (0 to sectors.length-1)
 * @param {number} offsetDegrees - Degrees to offset from the sector edge (default: 5)
 * @returns {number} - The initial angular velocity to set
 */
function calculateVelocityForSector(
  currentAngle,
  targetSectorIndex,
  offsetDegrees = 5
) {
  // Validate input
  if (targetSectorIndex < 0 || targetSectorIndex >= sectors.length) {
    console.error(
      `Invalid sector index: ${targetSectorIndex}. Must be between 0 and ${
        sectors.length - 1
      }`
    );
    return 0.3; // Default velocity as fallback
  }

  const totalSectors = sectors.length;
  const friction = 0.991; // Match the friction used in the wheel
  const stopThreshold = 0.002; // Match the stop threshold used in the wheel

  // Calculate the target angle for the desired sector boundary
  // For the wheel to land on sector targetSectorIndex, we need to stop at the boundary
  // between targetSectorIndex and targetSectorIndex-1
  const sectorAngle = TAU / totalSectors;

  // The exactStopAngle is the boundary between the target sector and the previous sector
  const exactStopAngle = TAU * (1 - targetSectorIndex / totalSectors);

  // FIXED OFFSET: Subtract the offset (convert degrees to radians)
  // We subtract to move the stopping point earlier in the rotation (before the boundary)
  const offsetRadians = (offsetDegrees * Math.PI) / 180;
  const adjustedStopAngle = exactStopAngle - offsetRadians;

  // Normalize current angle to [0, TAU)
  const currentWheelAngle = currentAngle % TAU;
  let targetAngle = adjustedStopAngle;

  // Ensure we go around at least 2-4 times (random for natural effect)
  const minRotations = 2 + Math.floor(Math.random() * 3);
  while (targetAngle - currentWheelAngle < minRotations * TAU) {
    targetAngle += TAU;
  }

  // Binary search to find the velocity that will travel the right distance
  let minVel = 0.05;
  let maxVel = 1.0;
  let bestVel = 0.3; // Default fallback
  let bestDiff = Infinity;

  for (let i = 0; i < 20; i++) {
    // 20 iterations for good precision
    const midVel = (minVel + maxVel) / 2;
    const result = simulateDeceleration(midVel, friction, stopThreshold);
    const angleDiff = Math.abs(
      result.totalAngle - (targetAngle - currentWheelAngle)
    );

    if (angleDiff < bestDiff) {
      bestDiff = angleDiff;
      bestVel = midVel;
    }

    if (result.totalAngle < targetAngle - currentWheelAngle) {
      minVel = midVel;
    } else {
      maxVel = midVel;
    }
  }

  // Log information for debugging
  console.log(
    `Targeting sector ${targetSectorIndex} (${sectors[targetSectorIndex].label}):`
  );
  console.log(`- Current angle: ${currentWheelAngle.toFixed(4)} radians`);
  console.log(`- Exact sector boundary: ${exactStopAngle.toFixed(4)} radians`);
  console.log(
    `- Adjusted target angle: ${adjustedStopAngle.toFixed(
      4
    )} radians (${offsetDegrees}° before boundary)`
  );
  console.log(
    `- Angular distance: ${(targetAngle - currentWheelAngle).toFixed(
      4
    )} radians`
  );
  console.log(`- Calculated velocity: ${bestVel.toFixed(4)}`);

  return bestVel;
}

/**
 * Spins the wheel to land on a specific sector
 * @param {number} sectorIndex - Index of the target sector (0 to sectors.length-1)
 * @param {number} offsetDegrees - Degrees to offset from the sector edge (fixed at 30)
 */
function spinToSector(sectorIndex, offsetDegrees = 30) {
  // Don't do anything if wheel is already spinning
  if (angVel > 0) {
    console.warn("Wheel is already spinning. Wait until it stops.");
    return;
  }

  // Calculate the velocity needed to stop at the target sector
  const velocity = calculateVelocityForSector(ang, sectorIndex, offsetDegrees);

  // Set the angular velocity and start spinning
  angVel = velocity;
  spinButtonClicked = true;

  console.log(
    `Spinning to sector ${sectorIndex}: ${sectors[sectorIndex].label} with ${offsetDegrees}° offset`
  );
}

/**
 * Spins the wheel to land on a specific prize by name
 * @param {string} prizeName - Name of the prize to land on
 * @param {number} offsetDegrees - Degrees to offset from the sector edge (fixed at 30)
 */
function spinToPrize(prizeName, offsetDegrees = 30) {
  // Find the index of the sector with the matching label
  const index = sectors.findIndex((sector) => sector.label === prizeName);

  if (index === -1) {
    console.error(`Prize "${prizeName}" not found on the wheel`);
    return;
  }

  spinToSector(index, offsetDegrees);
}

// Add a control UI to the page
function addWheelController() {
  // Create a container for the controller
  const controller = document.createElement("div");
  controller.id = "wheel-controller";
  controller.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 15px;
    z-index: 1000;
    font-family: 'Lato', sans-serif;
    max-width: 300px;
  `;

  // Add header
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  `;

  const title = document.createElement("h3");
  title.textContent = "Wheel Controller";
  title.style.margin = "0";

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "&times;";
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 0 5px;
  `;
  closeBtn.onclick = () => {
    controller.style.display = "none";
  };

  header.appendChild(title);
  header.appendChild(closeBtn);
  controller.appendChild(header);

  // Add sector dropdown
  const sectorSelector = document.createElement("div");
  sectorSelector.style.marginBottom = "15px";

  const sectorLabel = document.createElement("label");
  sectorLabel.textContent = "Select sector:";
  sectorLabel.style.display = "block";
  sectorLabel.style.marginBottom = "5px";

  const sectorDropdown = document.createElement("select");
  sectorDropdown.id = "sector-dropdown";
  sectorDropdown.style.cssText = `
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  `;

  // Add options for each sector
  sectors.forEach((sector, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = sector.label;
    sectorDropdown.appendChild(option);
  });

  sectorSelector.appendChild(sectorLabel);
  sectorSelector.appendChild(sectorDropdown);
  controller.appendChild(sectorSelector);

  // Add fixed offset info
  const offsetInfo = document.createElement("div");
  offsetInfo.style.marginBottom = "15px";
  offsetInfo.style.padding = "10px";
  offsetInfo.style.backgroundColor = "#f5f5f5";
  offsetInfo.style.borderRadius = "5px";
  offsetInfo.style.border = "1px solid #ddd";

  offsetInfo.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">Fixed Offset:</div>
    <div>Wheel stops 30° before sector edge</div>
  `;

  controller.appendChild(offsetInfo);

  // Add spin button
  const spinButton = document.createElement("button");
  spinButton.textContent = "Spin to Selected Sector";
  spinButton.style.cssText = `
    width: 100%;
    display: none;
    padding: 10px;
    background-color: #eb6b34;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  `;
  spinButton.onmouseover = () => {
    spinButton.style.backgroundColor = "#d25a25";
  };
  spinButton.onmouseout = () => {
    spinButton.style.backgroundColor = "#eb6b34";
  };
  spinButton.onclick = () => {
    const selectedSector = parseInt(
      document.getElementById("sector-dropdown").value
    );
    // Use fixed offset of 30 degrees
    spinToSector(selectedSector, 30);
  };

  controller.appendChild(spinButton);

  // Add toggle button to show controller
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Controls";
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    opacity: 30%;
    background-color: #eb6b34;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
    font-weight: bold;
    z-index: 999;
    display: none;
  `;
  toggleBtn.onclick = () => {
    controller.style.display = "block";
    toggleBtn.style.display = "none";
  };

  // Add event listener to close button
  closeBtn.onclick = () => {
    controller.style.display = "none";
    toggleBtn.style.display = "block";
  };

  // Add to document
  document.body.appendChild(controller);
  document.body.appendChild(toggleBtn);

  // Keep track of actual wheel position
  const debugInfo = document.createElement("div");
  debugInfo.id = "wheel-debug";
  debugInfo.style.cssText = `
    margin-top: 15px;
    font-size: 12px;
    color: #666;
  `;
  controller.appendChild(debugInfo);

  // Update debug info every 100ms
  setInterval(() => {
    const index = getIndex();
    debugInfo.innerHTML = `
      Current sector: ${index} (${sectors[index].label})<br>
      Angle: ${ang.toFixed(4)} rad (${(((ang * 180) / Math.PI) % 360).toFixed(
      2
    )}°)<br>
      Velocity: ${angVel.toFixed(4)}
    `;
  }, 100);

  return controller;
}

// Initialize the controller when the document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addWheelController);
} else {
  addWheelController();
}

// You can call these functions from the browser console to test:
// spinToSector(2) - Spin to the third sector (indexes start at 0)
// spinToPrize("T-shirt") - Spin to the T-shirt prize
//
// Note: The wheel will always stop 30 degrees before the sector edge
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Create a new array to track T-shirt wins with timestamps
let premiumItemWins = [];
let eventStartTime = null;
let eventTimer = null;
let timerDisplay = null;
let eventDurationSeconds = 10 * 60 * 60; // 12 hours in seconds
let remainingSeconds = eventDurationSeconds;
let isEventActive = false;

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function addTimerToggleButton() {
  // Create the toggle button
  const toggleButton = document.createElement("button");
  toggleButton.id = "timer-toggle-btn";
  toggleButton.textContent = "Hide Timer";
  toggleButton.style.cssText = `
    position: fixed;
    opacity: 40%;
    bottom: 20px;
    right: 20px;
    background-color: rgba(235, 107, 52, 0.9);
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    font-family: 'Lato', sans-serif;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transition: background-color 0.3s;
  `;

  // Get reference to the timer display element
  const timerDisplay = document.getElementById("event-timer");

  // Add hover effect
  toggleButton.onmouseover = () => {
    toggleButton.style.backgroundColor = "rgba(215, 87, 32, 0.9)";
  };
  toggleButton.onmouseout = () => {
    toggleButton.style.backgroundColor = "rgba(235, 107, 52, 0.9)";
  };

  // Add click event to toggle timer visibility
  toggleButton.onclick = () => {
    if (timerDisplay) {
      if (timerDisplay.style.display === "none") {
        // Show the timer
        timerDisplay.style.display = "flex";
        toggleButton.textContent = "Hide Timer";
        // Store the state in localStorage
        localStorage.setItem("timerVisible", "true");
      } else {
        // Hide the timer
        timerDisplay.style.display = "none";
        toggleButton.textContent = "Show Timer";
        // Store the state in localStorage
        localStorage.setItem("timerVisible", "false");
      }
    }
  };

  // Add to the document
  document.body.appendChild(toggleButton);

  // Check if there's a saved state in localStorage and apply it
  const savedState = localStorage.getItem("timerVisible");
  if (savedState === "false" && timerDisplay) {
    timerDisplay.style.display = "none";
    toggleButton.textContent = "Show Timer";
  }
}

// Initialize the timer toggle button when the document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // Wait a short time to ensure the timer display has been created
    setTimeout(addTimerToggleButton, 200);
  });
} else {
  // If the document is already loaded, add the toggle button with a slight delay
  setTimeout(addTimerToggleButton, 200);
}
// Create and add timer display
function createTimerDisplay() {
  // Create timer container
  timerDisplay = document.createElement("div");
  timerDisplay.id = "event-timer";
  timerDisplay.style.cssText = `
    position: fixed;
    bottom: 60px;
    right: 20px;
    background-color: rgba(235, 107, 52, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    font-family: 'Lato', sans-serif;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 250px;
  `;

  // Time display
  const timeText = document.createElement("div");
  timeText.id = "timer-text";
  timeText.textContent = formatTime(remainingSeconds);

  // Start button
  const startButton = document.createElement("button");
  startButton.id = "start-timer";
  startButton.textContent = "Start Event (12   hours)";
  startButton.style.cssText = `
    padding: 8px 16px;
    background-color: white;
    color: #eb6b34;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
    margin-top: 10px;
  `;
  startButton.onclick = startEvent;

  // Premium items counter
  const premiumCounter = document.createElement("div");
  premiumCounter.id = "premium-counter";
  premiumCounter.style.cssText = `
    margin-top: 10px;
    font-size: 14px;
  `;
  premiumCounter.textContent = "Premium Wins: 0/12";

  // Add elements to container
  timerDisplay.appendChild(timeText);
  timerDisplay.appendChild(startButton);
  timerDisplay.appendChild(premiumCounter);

  // Add to body
  document.body.appendChild(timerDisplay);
}

function startEventWithCustomTime() {
  startEvent(); // Just redirect to the main startEvent function
}

// Format time to display hours if present
function formatTime(seconds) {
  if (seconds >= 3600) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  } else {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
}

function startEvent() {
  if (isEventActive) return;

  // Reset timer and history
  remainingSeconds = eventDurationSeconds; // 5 hours
  premiumItemWins = [];
  eventStartTime = new Date();
  isEventActive = true;

  // Update display
  document.getElementById("timer-text").textContent =
    formatTime(remainingSeconds);
  document.getElementById("premium-counter").textContent = "Premium Wins: 0/12";

  // Replace start button with reset button
  const startButton = document.getElementById("start-timer");
  startButton.textContent = "Reset Event";
  startButton.onclick = resetEvent;

  // Create premium history section
  createPremiumHistorySection();

  // Start countdown
  eventTimer = setInterval(() => {
    remainingSeconds--;
    document.getElementById("timer-text").textContent =
      formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      endEvent();
    }
  }, 1000);
}

// End the event
function endEvent() {
  clearInterval(eventTimer);
  isEventActive = false;

  // Change button text
  const button = document.getElementById("start-timer");
  button.textContent = "Start New Event";
  button.onclick = startEventWithCustomTime;

  // Update display
  document.getElementById("timer-text").textContent = "Time's Up!";
}
// Reset the event
function resetEvent() {
  // Clear any existing timer
  clearInterval(eventTimer);

  // Reset to 5 hours
  remainingSeconds = eventDurationSeconds;
  premiumItemWins = [];
  eventStartTime = new Date();
  isEventActive = true;

  // Update display
  document.getElementById("timer-text").textContent =
    formatTime(remainingSeconds);
  document.getElementById("premium-counter").textContent = "Premium Wins: 0/12";

  // Create premium history section
  createPremiumHistorySection();

  // Start countdown
  eventTimer = setInterval(() => {
    remainingSeconds--;
    document.getElementById("timer-text").textContent =
      formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      endEvent();
    }
  }, 1000);
}

// Create tshirt history section
function createPremiumHistorySection() {
  // Remove existing history if present
  const existingHistory = document.getElementById("premium-history");
  if (existingHistory) {
    existingHistory.remove();
  }

  // Create history container
  // const historyContainer = document.createElement("div");
  // historyContainer.id = "premium-history";
  // historyContainer.style.cssText = `
  //   position: fixed;
  //   top: 150px;
  //   right: 20px;
  //   background-color: rgba(255, 255, 255, 0.9);
  //   padding: 15px;
  //   border-radius: 10px;
  //   font-family: 'Lato', sans-serif;
  //   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  //   z-index: 1000;
  //   max-width: 250px;
  //   display: none;
  // `;

  // const historyTitle = document.createElement("h3");
  // historyTitle.textContent = "Premium Prize History";
  // historyTitle.style.marginTop = "0";

  // const historyList = document.createElement("ul");
  // historyList.id = "premium-history-list";
  // historyList.style.cssText = `
  //   list-style-type: none;
  //   padding: 0;
  //   margin: 10px 0 0 0;
  // `;

  // historyContainer.appendChild(historyTitle);
  // historyContainer.appendChild(historyList);
  // document.body.appendChild(historyContainer);
}

// Update tshirt history display
// Update premium win history display
function updatePremiumHistory() {
  const historyContainer = document.getElementById("premium-history");
  const historyList = document.getElementById("premium-history-list");

  if (!historyContainer || !historyList) return;

  // Show the history container if we have wins
  if (premiumItemWins.length > 0) {
    historyContainer.style.display = "block";
  }

  // Clear list
  historyList.innerHTML = "";

  // Add each win to the list
  premiumItemWins.forEach((win, index) => {
    const listItem = document.createElement("li");
    listItem.style.cssText = `
      padding: 5px 0;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    `;

    // Calculate time since event start
    const timeSinceStart = Math.floor((win.timestamp - eventStartTime) / 1000);
    const timeFormatted = formatTime(timeSinceStart);

    listItem.textContent = `${index + 1}. ${win.item} won at ${timeFormatted}`;
    historyList.appendChild(listItem);
  });
}

function spinWithProbability() {
  // Don't do anything if wheel is already spinning
  console.log("click weighted probabilities");

  if (angVel > 0) {
    console.warn("Wheel is already spinning. Wait until it stops.");
    return;
  }

  // Check if event is active
  if (!isEventActive) {
    alert("Please start the event first!");
    return;
  }

  // Get current inventory
  const inventory = JSON.parse(localStorage.getItem("wheelInventory"));

  // Use the updated max inventory values
  const maxInventory = {
    Perfume: 40,
    "Water Bottle": 35,
    "500/= Gift Voucher": 25,
    "Soft Toy": 24,
    "Vaccum Flask": 6,
    "5000/= Gift Voucher": 5,
  };

  // The rest of the function remains the same
  // Define base probabilities for each sector type
  let probabilities = {
    "Bad Luck": 0.35, // Increased from 0.25 to 0.35
    Perfume: 0.28, // Slightly increased from 0.25 to 0.28
    "Water Bottle": 0.22, // Slightly increased from 0.20 to 0.22
    "500/= Gift Voucher": 0.08, // Reduced from 0.15 to 0.08
    "Soft Toy": 0.05, // Reduced from 0.10 to 0.05
    "Vaccum Flask": 0.01, // Reduced from 0.03 to 0.01
    "5000/= Gift Voucher": 0.01, // Reduced from 0.02 to 0.01
  };

  // Calculate event progress as a percentage (0 to 1)
  const eventProgress =
    (eventDurationSeconds - remainingSeconds) / eventDurationSeconds;

  // Calculate time remaining in minutes
  const minutesRemaining = remainingSeconds / 60;

  // Calculate total remaining inventory and individual ratios
  let totalInventoryRemaining = 0;
  let inventoryRatios = {};

  for (const [item, maxCount] of Object.entries(maxInventory)) {
    if (item === "Bad Luck") continue;

    const remaining = maxCount - (inventory[item] || 0);
    if (remaining > 0) {
      totalInventoryRemaining += remaining;
      inventoryRatios[item] = remaining;
    } else {
      inventoryRatios[item] = 0;
    }
  }

  // Adjust probabilities based on event progress
  if (eventProgress > 0.5) {
    if (totalInventoryRemaining > 0) {
      const urgencyFactor = Math.min(1, 3 / minutesRemaining);
      let adjustedProbs = { ...probabilities };
      let totalAdjustment = 0;

      for (const [item, ratio] of Object.entries(inventoryRatios)) {
        if (ratio > 0) {
          const inventoryWeight = ratio / totalInventoryRemaining;
          adjustedProbs[item] =
            probabilities[item] * (1 - urgencyFactor) +
            inventoryWeight * urgencyFactor;
          totalAdjustment += adjustedProbs[item];
        } else {
          adjustedProbs[item] = 0;
        }
      }

      if (totalAdjustment < 1) {
        adjustedProbs["Bad Luck"] = 1 - totalAdjustment;
      } else {
        let sum = 0;
        for (const item in adjustedProbs) {
          if (item !== "Bad Luck") sum += adjustedProbs[item];
        }

        for (const item in adjustedProbs) {
          if (item !== "Bad Luck") adjustedProbs[item] /= sum;
        }
        adjustedProbs["Bad Luck"] = 0;
      }

      probabilities = adjustedProbs;
    }
  }

  // Last 30 seconds - focus entirely on remaining inventory
  if (remainingSeconds <= 30 && totalInventoryRemaining > 0) {
    console.log("FINAL 30 SECONDS - CLEARING INVENTORY");

    for (const item in probabilities) {
      if (item === "Bad Luck") {
        probabilities[item] = 0.05;
      } else {
        const remaining = maxInventory[item] - (inventory[item] || 0);
        probabilities[item] =
          remaining > 0 ? (remaining / totalInventoryRemaining) * 0.95 : 0;
      }
    }
  }

  // Check inventory limits and set probability to 0 for items at max
  for (const [item, maxCount] of Object.entries(maxInventory)) {
    if (inventory[item] >= maxCount) {
      probabilities[item] = 0;
    }
  }

  // If all inventories are full, only allow "Bad Luck"
  const allFull = Object.entries(maxInventory).every(
    ([item, max]) => inventory[item] >= max
  );

  if (allFull) {
    probabilities = { "Bad Luck": 1 };
  } else {
    // Normalize probabilities to ensure they sum to 1
    const totalProb = Object.values(probabilities).reduce((a, b) => a + b, 0);
    for (const item in probabilities) {
      probabilities[item] /= totalProb;
    }
  }

  // Log current probabilities for debugging
  console.log("Current probabilities:", probabilities);
  console.log("Event progress:", (eventProgress * 100).toFixed(1) + "%");
  console.log("Minutes remaining:", minutesRemaining.toFixed(1));

  // Get a random number between 0 and 1
  const randomValue = Math.random();

  // Choose a prize based on the probability distribution
  let cumulativeProbability = 0;
  let selectedPrizeType = null;

  for (const [prizeType, probability] of Object.entries(probabilities)) {
    cumulativeProbability += probability;
    if (randomValue <= cumulativeProbability) {
      selectedPrizeType = prizeType;
      break;
    }
  }

  // Find all sectors that match the selected prize type
  const matchingSectors = sectors
    .map((sector, index) => ({ index, label: sector.label }))
    .filter((sector) => sector.label === selectedPrizeType);

  // If selected type is Bad Luck or no matching sectors, find all Bad Luck sectors
  if (selectedPrizeType === "Bad Luck" || matchingSectors.length === 0) {
    const tryAgainSectors = sectors
      .map((sector, index) => ({ index, label: sector.label }))
      .filter((sector) => sector.label === "Bad Luck");

    // Make sure we found the Bad Luck sectors
    if (tryAgainSectors.length > 0) {
      const randomIndex = Math.floor(Math.random() * tryAgainSectors.length);
      spinToSector(tryAgainSectors[randomIndex].index, 30);
      console.log(
        `Spinning to Bad Luck sector ${tryAgainSectors[randomIndex].index}`
      );
      return;
    }
  }

  // Randomly select one of the matching sectors
  const randomIndex = Math.floor(Math.random() * matchingSectors.length);
  const selectedSector = matchingSectors[randomIndex];

  console.log(
    `Selected prize type: ${selectedPrizeType} (${
      selectedSector.index
    }), Event progress: ${(eventProgress * 100).toFixed(1)}%`
  );

  // Spin to the selected sector
  spinToSector(selectedSector.index, 30);
}

// Also update the probability info display in the wheel controller
function updateWheelController() {
  const controller = document.getElementById("wheel-controller");
  if (!controller) return;

  // Add a new section for probability settings
  const probabilityInfo = document.createElement("div");
  probabilityInfo.style.marginTop = "15px";
  probabilityInfo.style.marginBottom = "15px";
  probabilityInfo.style.padding = "10px";
  probabilityInfo.style.backgroundColor = "#f5f5f5";
  probabilityInfo.style.borderRadius = "5px";
  probabilityInfo.style.border = "1px solid #ddd";

  probabilityInfo.innerHTML = `
  <div style="font-weight: bold; margin-bottom: 5px;">Prize Probabilities:</div>
  <div>Bad Luck: 25%</div>
  <div>Perfume: 25% (40 available)</div>
  <div>Water Bottle: 20% (35 available)</div>
  <div>500/= Gift Voucher: 15% (25 available)</div>
  <div>Soft Toy: 10% (24 available)</div>
  <div>Vaccum Flask: 3% (6 available)</div>
  <div>5000/= Gift Voucher: 2% (25 available)</div>
  <div style="margin-top: 8px; font-style: italic; font-size: 12px;">
    Note: Rare items (Vaccum Flask & 5000/= Gift Voucher) become more likely
    as the 5-hour timer progresses
  </div>
`;

  // Replace existing probability info if it exists
  const existingProbInfo = controller.querySelector(
    'div[style*="Prize Probabilities"]'
  )?.parentNode;
  if (existingProbInfo) {
    controller.replaceChild(probabilityInfo, existingProbInfo);
  } else {
    controller.insertBefore(
      probabilityInfo,
      controller.querySelector("#wheel-debug")
    );
  }

  // Update event info to reflect 5-hour duration
  const eventInfo = controller.querySelector(
    'div[style*="5-Minute Event"]'
  )?.parentNode;
  if (eventInfo) {
    eventInfo.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">5-Hour Event:</div>
      <div>Start the event timer to begin spinning</div>
      <div>Prizes are distributed throughout the event</div>
    `;
  }
}

// Also update the probability info display in the wheel controller
function updateWheelController() {
  const controller = document.getElementById("wheel-controller");
  if (!controller) return;

  // Add a new section for probability settings
  const probabilityInfo = document.createElement("div");
  probabilityInfo.style.marginTop = "15px";
  probabilityInfo.style.marginBottom = "15px";
  probabilityInfo.style.padding = "10px";
  probabilityInfo.style.backgroundColor = "#f5f5f5";
  probabilityInfo.style.borderRadius = "5px";
  probabilityInfo.style.border = "1px solid #ddd";

  probabilityInfo.innerHTML = `
  <div style="font-weight: bold; margin-bottom: 5px;">Prize Probabilities:</div>
  <div>Bad Luck: 25%</div>
  <div>Perfume: 20% (40 available)</div>
  <div>Water Bottle: 20% (40 available)</div>
  <div>500/= Gift Voucher: 15% (20 available)</div>
  <div>Soft Toy: 10% (10 available)</div>
  <div>Vaccum Flask: 5% (5 available)</div>
  <div>5000/= Gift Voucher: 5% (5 available)</div>
  <div style="margin-top: 8px; font-style: italic; font-size: 12px;">
    Note: Rare items (Vaccum Flask & 5000/= Gift Voucher) become more likely
    as the 5-minute timer progresses
  </div>
`;

  // Replace existing probability info if it exists
  const existingProbInfo = controller.querySelector(
    'div[style*="Prize Probabilities"]'
  ).parentNode;
  if (existingProbInfo) {
    controller.replaceChild(probabilityInfo, existingProbInfo);
  } else {
    controller.insertBefore(
      probabilityInfo,
      controller.querySelector("#wheel-debug")
    );
  }
}
// Update spin button click handler
function updateSpinButtonHandler() {
  // Remove existing click handler from bodyEl
  bodyEl.removeEventListener("click", bodyClickHandler);

  // Add new click handler
  bodyEl.addEventListener("click", () => {
    if (!angVel) {
      spinWithProbability();
    }
  });
}

// Define bodyClickHandler function for old click handler (to be removed)
function bodyClickHandler() {
  if (!angVel) angVel = rand(0.25, 0.45);
  spinButtonClicked = true;
}

// Update the wheel controller to include the weighted spin option
function updateWheelController() {
  const controller = document.getElementById("wheel-controller");
  if (!controller) return;

  // Add a new section for probability settings
  const probabilityInfo = document.createElement("div");
  probabilityInfo.style.marginTop = "15px";
  probabilityInfo.style.marginBottom = "15px";
  probabilityInfo.style.padding = "10px";
  probabilityInfo.style.backgroundColor = "#f5f5f5";
  probabilityInfo.style.borderRadius = "5px";
  probabilityInfo.style.border = "1px solid #ddd";

  probabilityInfo.innerHTML = `
  <div style="font-weight: bold; margin-bottom: 5px;">Prize Probabilities:</div>
  <div>Perfume: 30% (40 available)</div>
  <div>Water Bottle: 30% (40 available)</div>
  <div>500/= Gift Voucher: 20% (20 available)</div>
  <div>Soft Toy: 10% (10 available)</div>
  <div>Vaccum Flask: 5% (5 available)</div>
  <div>5000/= Gift Voucher: 5% (5 available)</div>
  <div style="margin-top: 8px; font-style: italic; font-size: 12px;">
    Note: Rare items (Vaccum Flask & 5000/= Gift Voucher) become more likely
    as the 5-minute timer progresses
  </div>
`;

  controller.insertBefore(
    probabilityInfo,
    controller.querySelector("#wheel-debug")
  );

  // Add a new spin button for weighted spinning
  // const weightedSpinButton = document.createElement("button");
  // weightedSpinButton.textContent = "Spin with Weighted Probabilities";
  // weightedSpinButton.style.cssText = `
  //   width: 100%;
  //   padding: 10px;
  //   background-color: #2e8b57;
  //   color: white;
  //   border: none;
  //   border-radius: 5px;
  //   cursor: pointer;
  //   font-weight: bold;
  //   margin-top: 10px;
  //   transition: background-color 0.3s;
  // `;
  // weightedSpinButton.onmouseover = () => {
  //   weightedSpinButton.style.backgroundColor = "#227346";
  // };
  // weightedSpinButton.onmouseout = () => {
  //   weightedSpinButton.style.backgroundColor = "#2e8b57";
  // };
  bodyEl.onclick = spinWithProbability;

  // Add the new button after the existing spin button
  const existingSpinButton = controller.querySelector(
    'button:not([innerHTML="&times;"])'
  );
  existingSpinButton.insertAdjacentElement("afterend", weightedSpinButton);

  // Add event details section
  const eventInfo = document.createElement("div");
  eventInfo.style.marginTop = "15px";
  eventInfo.style.padding = "10px";
  eventInfo.style.backgroundColor = "#eb6b34";
  eventInfo.style.color = "white";
  eventInfo.style.borderRadius = "5px";
  eventInfo.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">5-Minute Event:</div>
    <div>Start the event timer to begin spinning</div>
    <div>Only 3 T-shirts are available per event</div>
  `;

  controller.insertBefore(eventInfo, probabilityInfo);
}

// Track when premium items are won
function trackPremiumWin(item) {
  // Add to history
  premiumItemWins.push({
    item: item,
    timestamp: new Date(),
    elapsedTime: eventStartTime ? new Date() - eventStartTime : 0,
  });

  // Update counter
  const premiumCounter = document.getElementById("premium-counter");
  if (premiumCounter) {
    premiumCounter.textContent = `Premium Wins: ${premiumItemWins.length}/12`;
  }

  // Update history display
  updatePremiumHistory();
}

// Add listener for prize wins
events.addListener("spinEnd", (sector) => {
  // Check if event is active and prize is premium
  if (
    isEventActive &&
    (sector.label === "Vaccum Flask" || sector.label === "5000/= Gift Voucher")
  ) {
    trackPremiumWin(sector.label);
  }
});

// Run these functions when the document is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    createTimerDisplay();
    updateSpinButtonHandler();
    setTimeout(updateWheelController, 500); // Delay to ensure wheel controller exists
  });
} else {
  createTimerDisplay();
  updateSpinButtonHandler();
  setTimeout(updateWheelController, 500);
}

// You can also call this function from the console to perform a weighted spin:
// spinWithProbability();

// Prevent middle mouse button and right mouse button actions
document.addEventListener(
  "mousedown",
  function (e) {
    // Middle mouse button is usually button 1 (button 0 is left, button 2 is right)
    if (e.button === 1 || e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      console.log(
        e.button === 1
          ? "Middle mouse button click prevented"
          : "Right mouse button click prevented"
      );
      return false;
    }
  },
  true
);

// Prevent mousewheel click and right-click actions
document.addEventListener(
  "auxclick",
  function (e) {
    if (e.button === 1 || e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      console.log(
        e.button === 1
          ? "Auxiliary middle mouse click prevented"
          : "Auxiliary right mouse click prevented"
      );
      return false;
    }
  },
  true
);

// Prevent context menu (right-click menu)
document.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
    console.log("Context menu prevented");
    return false;
  },
  true
);

// Additionally prevent the default scroll behavior that might trigger unwanted actions
document.addEventListener(
  "wheel",
  function (e) {
    if (e.buttons === 4 || e.button === 1) {
      // Button 4 is sometimes used for wheel press
      e.preventDefault();
      console.log("Middle mouse wheel scroll prevented");
      return false;
    }
  },
  { passive: false }
);
