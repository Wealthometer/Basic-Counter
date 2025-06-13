class DoWhileCounter {
  constructor() {
    this.counter = 0
    this.step = 1
    this.target = 100
    this.isRunning = false
    this.isPaused = false
    this.intervalId = null
    this.startTime = null
    this.iterations = 0
    this.speed = 500

    this.initializeElements()
    this.bindEvents()
    this.updateDisplay()
  }

  initializeElements() {
    this.counterValue = document.getElementById("counterValue")
    this.stepInput = document.getElementById("stepInput")
    this.targetInput = document.getElementById("targetInput")
    this.speedInput = document.getElementById("speedInput")
    this.startBtn = document.getElementById("startBtn")
    this.pauseBtn = document.getElementById("pauseBtn")
    this.resetBtn = document.getElementById("resetBtn")
    this.progressFill = document.getElementById("progressFill")
    this.progressText = document.getElementById("progressText")
    this.progressPercent = document.getElementById("progressPercent")
    this.consoleContent = document.getElementById("consoleContent")
    this.clearConsole = document.getElementById("clearConsole")
    this.iterationsCount = document.getElementById("iterationsCount")
    this.elapsedTime = document.getElementById("elapsedTime")
    this.avgIncrement = document.getElementById("avgIncrement")
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.startCounter())
    this.pauseBtn.addEventListener("click", () => this.pauseCounter())
    this.resetBtn.addEventListener("click", () => this.resetCounter())
    this.clearConsole.addEventListener("click", () => this.clearConsoleOutput())

    this.stepInput.addEventListener("change", () => this.updateSettings())
    this.targetInput.addEventListener("change", () => this.updateSettings())
    this.speedInput.addEventListener("change", () => this.updateSettings())

    // Prevent negative values
    this.stepInput.addEventListener("input", (e) => {
      if (e.target.value < 1) e.target.value = 1
    })
    this.targetInput.addEventListener("input", (e) => {
      if (e.target.value < 10) e.target.value = 10
    })
  }

  updateSettings() {
    if (!this.isRunning) {
      this.step = Number.parseInt(this.stepInput.value) || 1
      this.target = Number.parseInt(this.targetInput.value) || 100
      this.speed = Number.parseInt(this.speedInput.value) || 500
      this.updateProgress()
      this.logToConsole(`Settings updated: Step=${this.step}, Target=${this.target}, Speed=${this.speed}ms`)
    }
  }

  startCounter() {
    if (this.isPaused) {
      this.resumeCounter()
      return
    }

    this.isRunning = true
    this.startTime = Date.now()
    this.step = Number.parseInt(this.stepInput.value) || 1
    this.target = Number.parseInt(this.targetInput.value) || 100
    this.speed = Number.parseInt(this.speedInput.value) || 500

    this.startBtn.disabled = true
    this.pauseBtn.disabled = false
    this.stepInput.disabled = true
    this.targetInput.disabled = true

    this.logToConsole("=== Counter Started ===")
    this.logToConsole(`Initial values: counter=${this.counter}, step=${this.step}, target=${this.target}`)

    // Implement do-while loop logic
    this.doWhileLoop()
  }

  doWhileLoop() {
    // This simulates the do-while loop with visual feedback
    const executeIteration = () => {
      // Log current counter value (this happens first in do-while)
      this.logToConsole(`Iteration ${this.iterations + 1}: counter = ${this.counter}`, true)

      // Update display with animation
      this.updateDisplay()
      this.updateProgress()
      this.updateStats()

      // Increment counter by step (this happens in the loop body)
      this.counter += this.step
      this.iterations++

      // Check condition (this happens at the end in do-while)
      if (this.counter < this.target && this.isRunning && !this.isPaused) {
        // Continue loop
        this.intervalId = setTimeout(executeIteration, this.speed)
      } else {
        // Loop ended
        this.completeCounter()
      }
    }

    // Start the first iteration (do-while always executes at least once)
    executeIteration()
  }

  pauseCounter() {
    this.isPaused = true
    this.isRunning = false

    if (this.intervalId) {
      clearTimeout(this.intervalId)
      this.intervalId = null
    }

    this.startBtn.disabled = false
    this.startBtn.innerHTML = '<span class="btn-icon">▶️</span>Resume'
    this.pauseBtn.disabled = true

    this.logToConsole("⏸️ Counter paused")
    this.progressText.textContent = "Paused"
  }

  resumeCounter() {
    this.isPaused = false
    this.isRunning = true

    this.startBtn.disabled = true
    this.startBtn.innerHTML = '<span class="btn-icon">▶️</span>Start Counter'
    this.pauseBtn.disabled = false

    this.logToConsole("▶️ Counter resumed")
    this.doWhileLoop()
  }

  completeCounter() {
    this.isRunning = false
    this.isPaused = false

    if (this.intervalId) {
      clearTimeout(this.intervalId)
      this.intervalId = null
    }

    this.startBtn.disabled = false
    this.pauseBtn.disabled = true
    this.stepInput.disabled = false
    this.targetInput.disabled = false

    // Final log
    this.logToConsole(`=== Counter Completed ===`)
    this.logToConsole(`Final value: ${this.counter} (target was ${this.target})`)
    this.logToConsole(`Total iterations: ${this.iterations}`)

    // Add completion animation
    this.counterValue.classList.add("bounce")
    document.querySelector(".counter-display").classList.add("completed")

    setTimeout(() => {
      this.counterValue.classList.remove("bounce")
    }, 800)

    this.progressText.textContent = "Completed!"
    this.updateStats()
  }

  resetCounter() {
    this.isRunning = false
    this.isPaused = false

    if (this.intervalId) {
      clearTimeout(this.intervalId)
      this.intervalId = null
    }

    this.counter = 0
    this.iterations = 0
    this.startTime = null

    this.startBtn.disabled = false
    this.startBtn.innerHTML = '<span class="btn-icon">▶️</span>Start Counter'
    this.pauseBtn.disabled = true
    this.stepInput.disabled = false
    this.targetInput.disabled = false

    document.querySelector(".counter-display").classList.remove("completed")

    this.updateDisplay()
    this.updateProgress()
    this.updateStats()

    this.logToConsole("🔄 Counter reset to 0")
    this.progressText.textContent = "Ready to start"
  }

  updateDisplay() {
    this.counterValue.textContent = this.counter
    this.counterValue.classList.add("animate")

    setTimeout(() => {
      this.counterValue.classList.remove("animate")
    }, 300)
  }

  updateProgress() {
    const progress = Math.min((this.counter / this.target) * 100, 100)
    this.progressFill.style.width = `${progress}%`
    this.progressPercent.textContent = `${Math.round(progress)}%`

    if (this.isRunning && !this.isPaused) {
      this.progressText.textContent = `Counting... (${this.counter}/${this.target})`
    }
  }

  updateStats() {
    this.iterationsCount.textContent = this.iterations

    if (this.startTime) {
      const elapsed = (Date.now() - this.startTime) / 1000
      this.elapsedTime.textContent = `${elapsed.toFixed(1)}s`

      const avgIncrement = this.iterations > 0 ? (this.counter / this.iterations).toFixed(1) : 0
      this.avgIncrement.textContent = avgIncrement
    } else {
      this.elapsedTime.textContent = "0s"
      this.avgIncrement.textContent = "0"
    }
  }

  logToConsole(message, highlight = false) {
    const line = document.createElement("div")
    line.className = `console-line ${highlight ? "highlight" : ""}`
    line.textContent = `> ${message}`

    this.consoleContent.appendChild(line)
    this.consoleContent.scrollTop = this.consoleContent.scrollHeight
  }

  clearConsoleOutput() {
    this.consoleContent.innerHTML = '<div class="console-line">Console cleared...</div>'
  }
}

// Initialize the counter when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new DoWhileCounter()
})

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault()
    const startBtn = document.getElementById("startBtn")
    const pauseBtn = document.getElementById("pauseBtn")

    if (!startBtn.disabled) {
      startBtn.click()
    } else if (!pauseBtn.disabled) {
      pauseBtn.click()
    }
  } else if (e.code === "KeyR" && e.ctrlKey) {
    e.preventDefault()
    document.getElementById("resetBtn").click()
  }
})

// Add some visual feedback for better UX
document.addEventListener("DOMContentLoaded", () => {
  // Add tooltips
  const tooltips = {
    stepInput: "How much to increase the counter each iteration",
    targetInput: "Stop when counter reaches this value",
    speedInput: "Delay between each iteration",
    startBtn: "Start the do-while loop (Spacebar)",
    pauseBtn: "Pause the counter (Spacebar)",
    resetBtn: "Reset counter to 0 (Ctrl+R)",
  }

  Object.entries(tooltips).forEach(([id, text]) => {
    const element = document.getElementById(id)
    if (element) {
      element.title = text
    }
  })
})
