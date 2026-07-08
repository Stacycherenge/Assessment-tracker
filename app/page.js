"use client";
import { useState } from "react";

const ALL_SUBJECTS = ["mobile", "dsa", "python", "webdev"];

export default function Home() {
  const [subject, setSubject] = useState("mobile");
  const [score, setScore] = useState("");
  const [history, setHistory] = useState([]);
  const [activeWeek, setActiveWeek] = useState(1);

  const maxWeek =
    history.length > 0 ? Math.max(...history.map((e) => e.week)) : 1;

  const latestEntries = history.filter((entry) => {
    return entry.week === maxWeek;
  });
  const totalWeeksAvailable = Array.from(
    { length: maxWeek + 1 },
    (_, index) => index + 1,
  );
  const uniqueSubjectsThisWeek = new Set(
    latestEntries.map((entry) => entry.subject),
  );

  let currentWeekNumber = 1;
  if (history.length > 0) {
    const maxWeek = Math.max(...history.map((e) => e.week));

    if (uniqueSubjectsThisWeek.size === ALL_SUBJECTS.length) {
      currentWeekNumber = maxWeek + 1;
    } else {
      currentWeekNumber = maxWeek;
    }
  }

  const isSubjectAlreadyLogged = latestEntries.some(
    (entry) => entry.subject === subject && entry.week === currentWeekNumber,
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (score === "" || score === null || score === undefined) {
      alert("Please enter a score before submitting!");
      return;
    }

    if (String(score).trim() === "") {
      alert("Please enter a valid score before submitting!");
      return;
    }

    const selectedSubject = subject;
    const selectedWeek = currentWeekNumber;
    const isDuplicate = history.some(
      (entry) =>
        entry.subject === selectedSubject && entry.week === selectedWeek,
    );

    if (isDuplicate) {
      alert(
        `Error: You have already logged a score for ${selectedSubject.toUpperCase()} in Week ${selectedWeek}!`,
      );
      return;
    }

    const newEntry = {
      subject: selectedSubject,
      week: selectedWeek,
      score: Number(score),
      id: Date.now(),
    };

    setHistory([...history, newEntry]);
    setScore("");
  };
  // logic for the proven study advice
  const STUDY_STRATEGIES = {
    dsa:
      'Data Structures & Algorithms (DSA): The "Spaced Pattern" Method\n\n' +
      "DSA cannot be memorized; it must be recognized via patterns.\n\n" +
      "• The 45-Minute Rule: When solving problems on LeetCode or Codeforces, spend 30 minutes struggling with the logic. If you cannot solve it, look at the solution. Spend the remaining 15 minutes manually tracing the successful algorithm on a whiteboard or paper.\n\n" +
      "• Pattern Classification: Group your study by patterns, not individual problems. Master Two Pointers, Sliding Window, Breadth-First Search (BFS), and Dynamic Programming sequentially.\n\n" +
      "• Spaced Repetition Tracking: Keep a spreadsheet of problems you fail. Re-try the exact same problem 3 days later, then 7 days later, and then 2 weeks later until the underlying logic becomes second nature.",

    python:
      'Python: The "Automation & Scripting" Approach\n\n' +
      "Python's syntax is highly readable, making it easy to fall into the trap of passive reading.\n\n" +
      "• Automate Boring Tasks: Apply Python immediately to your daily routine. Write small scripts to rename 100 files at once, scrape data from a favorite blog using Beautiful Soup, or send automated email alerts.\n\n" +
      "• Read-Evaluate-Print Loop (REPL) Tinkering: Keep a Python shell or Jupyter Notebook open while studying. Test every new function, list comprehension, or slicing technique instantly to see how the interpreter behaves.\n\n" +
      "• Interactive Code Challenges: Solve 2-3 daily bite-sized problems on platforms like Edabit or HackerRank to internalize core syntax rules.",

    webdev:
      "Web Development: The Layout Drill & Core Integration\n\n" +
      "• The HTML/CSS Layout Drill: Build an explicitly sized grid system using CSS Grid (grid-template-areas) for a dashboard layout.\n\n" +
      "• Mobile Responsiveness: Make that dashboard mobile-responsive using CSS Flexbox wrapped inside @media queries.\n\n" +
      '• Form Validation: Build an interactive form with native HTML validation using attributes like required, pattern, and type="email".\n\n' +
      "• Vanilla JavaScript Integration: Write a JavaScript fetch() script that pulls real-time data from the JSONPlaceholder API and dynamically renders it using DOM manipulation.\n\n" +
      "• React Porting: Port that exact same script into a React app using the useEffect hook.\n\n" +
      "• Component Architecture: Build a reusable, stylized <Button /> and <Card /> component in React that dynamically renders children elements and accepts custom configurations via props.",

    mobile:
      "Mobile Development: The Dart & Flutter Engineering Milestones\n\n" +
      '• The Dart "Must-Master" Checklist: Open DartPad and write 3 custom Mixins to share behavior across unrelated classes.\n\n' +
      "• Asynchronous Mastery: Build a mock data stream using StreamController and listen to it using .listen() to master asynchronous programming.\n\n" +
      "• Sound Null Safety: Force compiler errors by passing null values to non-nullable variables to master Dart's Sound Null Safety mechanics.\n\n" +
      "• Core Flutter Layouts: Build a static UI dashboard using nesting combinations of Row, Column, Container, and Stack widgets.\n\n" +
      "• UI Cloning Drill: Recreate the exact layout of the Spotify Mobile App home screen using static dummy data.\n\n" +
      "• State Management Migration: Integrate a state management solution. Start with built-in setState, then migrate the project to Provider or Riverpod.",
  };

  const currentWeekEntries = history.filter(
    (entry) => entry.week === currentWeekNumber,
  );

  let worstSubject = "None yet";
  let lowestScore = 101;

  currentWeekEntries.forEach((entry) => {
    if (entry.score < lowestScore) {
      lowestScore = entry.score;
      worstSubject = entry.subject;
    }
  });

  const actionableAdvice =
    STUDY_STRATEGIES[worstSubject] ||
    "Keep logging your scores to receive proven study advice!";

  //Logic for the change in weeks score
  const currentWeekNumber1 = activeWeek;
  const previousWeekNumber =
    currentWeekNumber1 > 1 ? currentWeekNumber1 - 1 : 1;

  const analyticsRows = ALL_SUBJECTS.map((subName) => {
    const currentEntry = history.find(
      (e) => e.subject === subName && e.week === currentWeekNumber1,
    );
    const prevEntry = history.find(
      (e) => e.subject === subName && e.week === previousWeekNumber,
    );

    const currentVal = currentEntry ? currentEntry.score : null;
    const prevVal = prevEntry ? prevEntry.score : null;

    let changeText = "N/A";
    let changeColor = "gray";

    if (currentVal !== null && prevVal !== null) {
      const delta = currentVal - prevVal;
      if (delta > 0) {
        changeText = `+${delta}%`;
        changeColor = "green";
      } else if (delta < 0) {
        changeText = `${delta}%`;
        changeColor = "red";
      } else {
        changeText = "0%";
        changeColor = "gray";
      }
    }

    return {
      name: subName,
      thisWeek: currentVal !== null ? `${currentVal}%` : "Pending",
      lastWeek: prevVal !== null ? `${prevVal}%` : "No Data",
      change: changeText,
      color: changeColor,
    };
  });

  return (
    <main className="app-container">
      <h1>Assessment Progress Tracker</h1>

      <div style={{ marginBottom: "10px" }}>
        <p>
          <strong>Logging Data For:</strong> Week {currentWeekNumber}
        </p>
      </div>

      {/* THE INPUT FORM */}
      <section className="input-form">
        <h2>Log Weekly Scores</h2>
        <form onSubmit={handleSubmit}>
          <div className="subjects">
            <label>Subject: </label>
            <select
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="mobile">Frontend Mobile Development</option>
              <option value="dsa">Data Structures & Algorithms</option>
              <option value="python"> Backend Development</option>
              <option value="webdev"> Frontend Web Development</option>
            </select>
          </div>

          <div className="subjects">
            <label>Weekly Score (0-100): </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 85"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />{" "}
          </div>

          <button className="btn-submit" type="submit">
            Submit Score
          </button>
        </form>
      </section>

      {/* THE ADVICE & INSIGHTS PANEL */}
      <section className="advice-insights">
        <h2>Weekly Smart Insights & Advice</h2>
        <p>
          <strong>Highest Priority Focus:</strong>{" "}
          <span style={{ textTransform: "capitalize" }}>{worstSubject}</span>
        </p>
        <p>
          <strong>Current Score:</strong>{" "}
          {lowestScore === 101 ? "N/A" : `${lowestScore}%`}
        </p>
        <p>
          <strong>Proven Study Action:</strong>{" "}
        </p>
        <div
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.6",
            marginTop: "10px",
          }}
        >
          {actionableAdvice}
        </div>
      </section>

      {/* THE PROGRESS DASHBOARD */}
      <section className="progressds">
        <h2>Performance Dashboard</h2>
        <p>
          <em>(Placeholder for performance dashboard)</em>
        </p>

        {/* THE week dropdown */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Viewing Analytics For:</label>
          <select
            value={activeWeek}
            onChange={(e) => setActiveWeek(Number(e.target.value))}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            {totalWeeksAvailable.map((weekNum) => (
              <option key={weekNum} value={weekNum}>
                Week {weekNum}
              </option>
            ))}
          </select>
        </div>

        {/* THE DATA TABLE */}
        <table
          className="data-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: "8px" }}>Week</th>
              <th style={{ padding: "8px" }}>Subject</th>
              <th style={{ padding: "8px" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>Week {entry.week}</td>
                <td style={{ padding: "8px", textTransform: "capitalize" }}>
                  {entry.subject}
                </td>
                <td style={{ padding: "8px" }}>{entry.score}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* THE ANALYTICS TABLE */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: "8px" }}>Subject</th>
              <th style={{ padding: "8px" }}>This Week</th>
              <th style={{ padding: "8px" }}>Last Week</th>
              <th style={{ padding: "8px" }}>Change</th>
            </tr>
          </thead>
          <tbody>
            {analyticsRows.map((row, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px", textTransform: "uppercase" }}>
                  {row.name}
                </td>
                <td style={{ padding: "8px" }}>{row.thisWeek}</td>
                <td style={{ padding: "8px" }}>{row.lastWeek}</td>
                <td
                  style={{
                    padding: "8px",
                    color: row.color,
                    fontWeight: "bold",
                  }}
                >
                  {row.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
