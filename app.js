// ── MENU MOBILE ──
document.getElementById("nav-toggle").addEventListener("click", () => {
  document.getElementById("nav-mobile").classList.toggle("aberto");
});

// Fechar menu ao clicar em link
document.querySelectorAll(".nav-mobile a").forEach(a => {
  a.addEventListener("click", () => {
    document.getElementById("nav-mobile").classList.remove("aberto");
  });
});

// Nav scroll shadow
window.addEventListener("scroll", () => {
  document.getElementById("nav").style.boxShadow =
    window.scrollY > 20 ? "0 4px 30px rgba(0,0,0,.5)" : "none";
});

// ── CLASSIFICAÇÃO IMC ──
function classifIMC(imc) {
  if (imc < 18.5) return { label:"Abaixo do peso",  cor:"#38bdf8", bg:"rgba(56,189,248,.15)",  pct: Math.max(5, (imc/18.5)*25) };
  if (imc < 25)   return { label:"Peso adequado",   cor:"#22c55e", bg:"rgba(34,197,94,.15)",   pct: 25 + ((imc-18.5)/6.4)*25 };
  if (imc < 30)   return { label:"Sobrepeso",       cor:"#f59e0b", bg:"rgba(245,158,11,.15)",  pct: 50 + ((imc-25)/5)*25 };
  return                  { label:"Obesidade",      cor:"#ef4444", bg:"rgba(239,68,68,.15)",   pct: Math.min(95, 75+((imc-30)/10)*20) };
}

// ── ANÁLISE ──
function gerarAnalise(imc, obj) {
  const objLabel = {
    gordura:"Redução de gordura",
    hipertrofia:"Hipertrofia muscular",
    recomp:"Recomposição corporal",
    performance:"Performance esportiva"
  }[obj] || obj;

  let txt = `Com IMC de <strong>${imc.toFixed(1)}</strong> e objetivo de <strong>${objLabel}</strong>, `;

  if (imc < 18.5)      txt += "o foco deve ser <strong>ganho de massa magra</strong> com superávit calórico controlado e treino de força progressivo.";
  else if (imc < 25)   txt += "você está em posição estratégica ideal. O foco é <strong>otimizar a composição corporal</strong> e maximizar a performance.";
  else if (imc < 30)   txt += "existe margem clara para <strong>recomposição corporal</strong>. Treino de força + controle nutricional geram resultados expressivos.";
  else                 txt += "a prioridade é <strong>estruturar uma base sólida</strong> de treino e nutrição. Progressão gradual e consistência são os pilares iniciais.";

  return txt;
}

// ── CALCULAR ──
function calcular() {
  const peso  = parseFloat(document.getElementById("peso").value);
  const altCm = parseFloat(document.getElementById("altura").value);
  const obj   = document.getElementById("objetivo").value;

  if (!peso || !altCm || !obj) {
    const btn = document.getElementById("btn-diag");
    btn.style.animation = "shake .4s ease";
    setTimeout(() => btn.style.animation = "", 400);
    return;
  }

  const imc = peso / Math.pow(altCm / 100, 2);
  const cls = classifIMC(imc);

  // IMC
  document.getElementById("res-imc").textContent = imc.toFixed(1);

  const resClass = document.getElementById("res-class");
  resClass.textContent = cls.label;
  resClass.style.background = cls.bg;
  resClass.style.color = cls.cor;

  const objLabel = { gordura:"Redução de gordura", hipertrofia:"Hipertrofia muscular", recomp:"Recomposição corporal", performance:"Performance esportiva" }[obj] || obj;
  document.getElementById("res-obj").textContent = "Objetivo: " + objLabel;

  // Barra
  const barra = document.getElementById("res-barra");
  barra.style.background = `linear-gradient(90deg, ${cls.cor}66, ${cls.cor})`;
  setTimeout(() => { barra.style.width = cls.pct + "%"; }, 100);

  // Análise
  document.getElementById("res-analise").innerHTML = gerarAnalise(imc, obj);

  // Guardar para WhatsApp
  window._dadosDiag = { imc, obj, objLabel };

  // Mostrar resultado
  document.getElementById("diag-form").classList.add("oculto");
  document.getElementById("resultado").classList.remove("oculto");
  document.getElementById("diagnostico").scrollIntoView({ behavior: "smooth" });
}

// ── REFAZER ──
function refazer() {
  document.getElementById("resultado").classList.add("oculto");
  document.getElementById("diag-form").classList.remove("oculto");
  document.getElementById("res-barra").style.width = "0%";
}

// ── SHAKE ──
const s = document.createElement("style");
s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`;
document.head.appendChild(s);

// ── ANIMAÇÃO DE ENTRADA ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".pilar-card, .plano-card").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity .5s ease, transform .5s ease";
  observer.observe(el);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".pilar-card, .plano-card").forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + "s";
  });
});

// Adicionar classe visible via CSS
const s2 = document.createElement("style");
s2.textContent = `.visible{opacity:1!important;transform:translateY(0)!important}`;
document.head.appendChild(s2);
