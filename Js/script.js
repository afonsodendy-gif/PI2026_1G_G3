document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('imcForm');
  if (form) {
    const fields = {
      peso: { min: 10, max: 250, label: 'peso' },
      altura: { min: 80, max: 220, label: 'altura' },
      idade: { min: 5, max: 17, label: 'idade', integer: true },
      atividade: { min: 0, max: 300, label: 'minutos de atividade', integer: true },
      tela: { min: 0, max: 24, label: 'horas de tela' }
    };
    const result = document.getElementById('resultCard');
    const value = document.getElementById('valorIMC');
    const badge = document.getElementById('classIMC');
    const description = document.getElementById('descricaoIMC');
    const habits = document.getElementById('orientacaoHabitos');
    const screen = document.getElementById('orientacaoTela');
    const resetResult = () => {
      value.textContent = '—';
      badge.textContent = 'Preencha os dados para ver a orientação.';
      description.textContent = 'O resultado e as sugestões aparecem após o cálculo.';
      habits.textContent = 'Informe sua rotina para ver uma sugestão de atividade.';
      screen.textContent = 'Pausas e equilíbrio com as telas também contam.';
    };
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let valid = true;
      const data = {};
      Object.entries(fields).forEach(([id, limits]) => {
        const input = document.getElementById(id);
        const raw = input.value.trim().replace(',', '.');
        const number = raw === '' ? NaN : Number(raw);
        const error = document.getElementById(`${id}Erro`);
        const good = /^\d+(?:[.,]\d+)?$/.test(raw) && Number.isFinite(number) && number >= limits.min && number <= limits.max && (!limits.integer || Number.isInteger(number));
        error.textContent = good ? '' : `Informe ${limits.label} entre ${limits.min} e ${limits.max}${limits.integer ? ', em número inteiro' : ''}.`;
        input.setAttribute('aria-invalid', String(!good));
        if (!good) {
          valid = false;
          if (!form.dataset.firstInvalid) form.dataset.firstInvalid = id;
        }
        data[id] = number;
      });
      if (!valid) {
        resetResult();
        document.getElementById(form.dataset.firstInvalid).focus();
        delete form.dataset.firstInvalid;
        return;
      }
      delete form.dataset.firstInvalid;
      const imc = data.peso / Math.pow(data.altura / 100, 2);
      value.textContent = `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(imc)} kg/m²`;
      badge.textContent = 'Sem classificação automática';
      description.textContent = `Aos ${data.idade} anos, o IMC precisa ser interpretado por curvas próprias para idade e sexo. Este número não é um diagnóstico.`;
      if (data.atividade < 30) {
        habits.textContent = `Você relatou ${data.atividade} min/dia. Experimente começar com 10 a 15 minutos de caminhada, dança ou brincadeira e aumentar gradualmente, conforme se sentir bem.`;
      } else if (data.atividade < 60) {
        habits.textContent = `Você relatou ${data.atividade} min/dia. Acrescente uma brincadeira, caminhada ou dança de 10 a 20 minutos em alguns dias para se aproximar da média de 60 minutos.`;
      } else {
        habits.textContent = `Você relatou ${data.atividade} min/dia. Continue variando as atividades que gosta e inclua brincadeiras que fortalecem músculos e ossos em pelo menos 3 dias da semana.`;
      }
      screen.textContent = data.tela >= 3
        ? `Você relatou ${data.tela} h/dia de tela para lazer. Faça pausas para levantar e tente trocar parte desse tempo por movimento, sem usar o IMC como meta de exercício.`
        : `Você relatou ${data.tela} h/dia de tela para lazer. Mantenha pausas quando ficar muito tempo sentado e preserve tempo para descanso e movimento.`;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    form.addEventListener('reset', () => {
      window.setTimeout(() => {
        Object.keys(fields).forEach(id => {
          document.getElementById(`${id}Erro`).textContent = '';
          document.getElementById(id).removeAttribute('aria-invalid');
        });
        resetResult();
      }, 0);
    });
    Object.keys(fields).forEach(id => document.getElementById(id).addEventListener('input', (event) => {
      document.getElementById(`${id}Erro`).textContent = '';
      event.target.removeAttribute('aria-invalid');
    }));
  }

  const minutesInput = document.getElementById('minutosAtividade');
  const recommendation = document.getElementById('recomendacaoAtividade');
  if (minutesInput && recommendation) {
    const cards = [...document.querySelectorAll('.routine-card')];
    minutesInput.addEventListener('input', () => {
      const minutes = Number(minutesInput.value);
      cards.forEach(card => card.classList.remove('is-suggested'));
      if (minutesInput.value === '') {
        recommendation.textContent = 'Digite os minutos para receber uma ideia de atividade.';
        return;
      }
      if (!Number.isFinite(minutes) || minutes < 0 || minutes > 300 || !Number.isInteger(minutes)) {
        recommendation.textContent = 'Informe um número inteiro entre 0 e 300 minutos.';
        return;
      }
      const level = minutes < 30 ? 'iniciante' : 'intermediario';
      recommendation.textContent = minutes < 30
        ? 'Comece com brincadeiras, dança ou caminhada leve e aumente o tempo aos poucos. A primeira rotina pode dar ideias.'
        : minutes < 60
          ? 'Você já se movimenta. A segunda rotina traz ideias para variar as atividades e se aproximar da média de 60 min/dia.'
          : 'Você já relatou 60 minutos ou mais. Varie as atividades, respeite pausas e use a segunda rotina como inspiração; o nível avançado depende de experiência e supervisão.';
      document.querySelector(`[data-nivel="${level}"]`).classList.add('is-suggested');
    });
  }
});
