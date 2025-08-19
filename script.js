function savePlan() {
  const plan = {
      examName: document.getElementById("examName").value,
      examDate: document.getElementById("examDate").value,
      topics: document.getElementById("topics").value.split(',').map(t => t.trim()),
      subTopics: document.getElementById("subTopics").value.split(',').map(s => s.trim()),
      topicTime: document.getElementById("topicTime").value,
      subTopicTime: document.getElementById("subTopicTime").value
  };
  const plans = JSON.parse(localStorage.getItem("studyPlans")) || [];
  plans.push(plan);
  localStorage.setItem("studyPlans", JSON.stringify(plans));
  generateFlowchart(plan);
}
function generateFlowchart(plan) {
  const today = new Date();
  const examDate = new Date(plan.examDate);
  const diffTime = examDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let urgencyClass = "low";
  if (daysLeft <= 3) urgencyClass = "high";
  else if (daysLeft <= 7) urgencyClass = "medium";
  let diagram = `graph TD\n`;
  diagram += `title["📘 ${plan.examName}\\n📅 ${plan.examDate}\\n⏳ ${daysLeft} days left"]:::title\n`;

  plan.topics.forEach((topic, i) => {
      const topicId = `T${i}`;
      diagram += `${topicId}["${topic} (${plan.topicTime})"]:::${urgencyClass}\n`;

      plan.subTopics.forEach((sub, j) => {
          const subId = `${topicId}_S${j}`;
          diagram += `${subId}["${sub} (${plan.subTopicTime})"]\n`;
          diagram += `${topicId} --> ${subId}\n`;
      });

      diagram += `title --> ${topicId}\n`;
  });

  const mermaidContainer = document.getElementById("mermaidChart");
  mermaidContainer.innerHTML = "";
  const chartBlock = document.createElement("div");
  chartBlock.className = "mermaid";
  chartBlock.textContent = diagram;
  mermaidContainer.appendChild(chartBlock);

  mermaid.init(undefined, chartBlock);
}
function showPreviousPlans() {
  const plans = JSON.parse(localStorage.getItem("studyPlans")) || [];
  const list = document.getElementById("previousPlans");
  list.innerHTML = "<h3>🗂️ Previous Study Plans</h3>";

  plans.forEach((plan, index) => {
      const item = document.createElement("div");
      item.innerHTML = `
          <div style="margin-bottom:10px;">
              <strong>${plan.examName}</strong> - ${plan.examDate}
              <button onclick="deletePlan(${index})">Delete</button>
              <button onclick="generateFlowchart(${JSON.stringify(plan).replace(/"/g, '&quot;')})">View</button>
          </div>
      `;
      list.appendChild(item);
  });
}

function deletePlan(index) {
  const plans = JSON.parse(localStorage.getItem("studyPlans")) || [];
  plans.splice(index, 1);
  localStorage.setItem("studyPlans", JSON.stringify(plans));
  showPreviousPlans();
}

document.addEventListener("DOMContentLoaded", () => {
  mermaid.initialize({ startOnLoad: false });
});
