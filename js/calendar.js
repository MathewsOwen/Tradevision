document.addEventListener("DOMContentLoaded", () => {
  const calendarTable = document.getElementById("calendarTable");
  const nextEvent = document.getElementById("calendarNextEvent");
  const highImpact = document.getElementById("calendarHighImpact");

  if (!calendarTable) return;

  const events = [
    {
      date: "10/03/2026",
      time: "09:00",
      country: "Brasil",
      event: "IPCA",
      impact: "Alto",
      reading: "Inflação ao consumidor"
    },
    {
      date: "11/03/2026",
      time: "10:30",
      country: "EUA",
      event: "CPI",
      impact: "Alto",
      reading: "Inflação ao consumidor"
    },
    {
      date: "13/03/2026",
      time: "09:00",
      country: "Brasil",
      event: "IBC-Br",
      impact: "Médio",
      reading: "Atividade econômica"
    },
    {
      date: "15/03/2026",
      time: "09:00",
      country: "Brasil",
      event: "Decisão do Copom",
      impact: "Alto",
      reading: "Taxa Selic"
    },
    {
      date: "18/03/2026",
      time: "15:00",
      country: "EUA",
      event: "FOMC / Fed",
      impact: "Alto",
      reading: "Taxa de juros"
    },
    {
      date: "05/04/2026",
      time: "09:30",
      country: "EUA",
      event: "Payroll",
      impact: "Alto",
      reading: "Emprego não agrícola"
    },
    {
      date: "08/04/2026",
      time: "09:00",
      country: "Brasil",
      event: "IPCA",
      impact: "Alto",
      reading: "Inflação ao consumidor"
    },
    {
      date: "12/04/2026",
      time: "10:30",
      country: "EUA",
      event: "PPI",
      impact: "Médio",
      reading: "Inflação ao produtor"
    }
  ];

  function getImpactClass(impact) {
    if (impact === "Alto") return "negative";
    if (impact === "Médio") return "neutral";
    return "positive";
  }

  calendarTable.innerHTML = events
    .map(
      (item) => `
        <tr>
          <td>${item.date}</td>
          <td>${item.time}</td>
          <td>${item.country}</td>
          <td>${item.event}</td>
          <td class="${getImpactClass(item.impact)}">${item.impact}</td>
          <td>${item.reading}</td>
        </tr>
      `
    )
    .join("");

  if (nextEvent) {
    nextEvent.textContent = events[0].event;
  }

  const highImpactCount = events.filter((item) => item.impact === "Alto").length;
  if (highImpact) {
    highImpact.textContent = `${highImpactCount} eventos`;
  }
});
