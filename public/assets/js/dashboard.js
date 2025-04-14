document.addEventListener("DOMContentLoaded", async () => {
  const welcome = document.getElementById("dashboard-welcome");
  const contentList = document.getElementById("dashboard-content");
  const toolsList = document.getElementById("dashboard-tools");

  try {
    const res = await fetch("/api/dashboard");
    const data = await res.json();

    if (data.welcomeMessage) {
      welcome.textContent = data.welcomeMessage;
    }

    if (data.contentSections) {
      data.contentSections.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.link;
        a.textContent = item.label;
        li.appendChild(a);
        contentList.appendChild(li);
      });
    }

    if (data.systemTools) {
      data.systemTools.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.link;
        a.textContent = item.label;
        li.appendChild(a);
        toolsList.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
    welcome.textContent = "⚠️ Error loading dashboard.";
  }
});