document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('imcForm');
  if (!form) return;

  const pesoInput = document.getElementById('peso');
  const alturaInput = document.getElementById('altura');
  const resultadoValor = document.getElementById('valorIMC');
  const resultadoClasse = document.getElementById('classIMC');
  const resultadoDescricao = document.getElementById('descricaoIMC');
  const resultCard = document.getElementById('resultCard');
  const pesoErro = document.getElementById('pesoErro');
  const alturaErro = document.getElementById('alturaErro');
  const limparBtn = document.getElementById('limparBtn');
  const faixaItens = Array.from(document.querySelectorAll('[data-faixa]'));

  const faixaMap = [
    {
      limite: 18.5,
      estado: 'baixo',
      titulo: 'Abaixo do peso',
      badge: 'Abaixo do peso',
      descricao: 'O valor está abaixo da faixa de referência para adultos.'
    },
    {
      limite: 24.9,
      estado: 'normal',
      titulo: 'Peso adequado',
      badge: 'Peso normal',
      descricao: 'O valor está na faixa considerada adequada para adultos.'
    },
    {
      limite: 29.9,
      estado: 'sobrepeso',
      titulo: 'Sobrepeso',
      badge: 'Sobrepeso',
      descricao: 'Vale observar hábitos de alimentação, movimento e rotina.'
    },
    {
      limite: 34.9,
      estado: 'obesidade1',
      titulo: 'Obesidade grau 1',
      badge: 'Obesidade grau 1',
      descricao: 'É um sinal importante para buscar acompanhamento e ajustes de hábitos.'
    },
    {
      limite: 39.9,
      estado: 'obesidade2',
      titulo: 'Obesidade grau 2',
      badge: 'Obesidade grau 2',
      descricao: 'O acompanhamento profissional é especialmente importante nesta faixa.'
    },
    {
      limite: Infinity,
      estado: 'obesidade3',
      titulo: 'Obesidade grau 3',
      badge: 'Obesidade grau 3',
      descricao: 'Essa faixa pede atenção e acompanhamento profissional.'
    }
  ];

  const numberFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const setError = (field, message) => {
    field.textContent = message;
  };

  const clearErrors = () => {
    setError(pesoErro, '');
    setError(alturaErro, '');
  };

  const highlightLegend = (estado) => {
    faixaItens.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.faixa === estado);
    });
  };

  const resetResult = (initial = false) => {
    resultCard.dataset.state = '';
    resultadoValor.textContent = '—';
    resultadoClasse.textContent = initial
      ? 'Preencha os dados para ver a classificação.'
      : 'Classificação: —';
    resultadoDescricao.textContent = initial
      ? 'Use o formulário para calcular o IMC e ver a interpretação.'
      : 'Os resultados aparecem aqui depois do cálculo.';
    highlightLegend('');
  };

  const showResult = ({ imc, estado, titulo, badge, descricao }) => {
    resultCard.dataset.state = estado;
    resultadoValor.textContent = `${numberFormatter.format(imc)} kg/m²`;
    resultadoClasse.textContent = badge;
    resultadoDescricao.textContent = descricao;
    highlightLegend(estado);
  };

  const parseInputValue = (input) => {
    const normalized = String(input.value || '').replace(',', '.').trim();
    return normalized === '' ? NaN : Number(normalized);
  };

  const validateInputs = () => {
    clearErrors();

    const peso = parseInputValue(pesoInput);
    const altura = parseInputValue(alturaInput);

    let valid = true;

    if (!Number.isFinite(peso)) {
      setError(pesoErro, 'Informe um peso válido.');
      valid = false;
    } else if (peso <= 0) {
      setError(pesoErro, 'O peso precisa ser maior que zero.');
      valid = false;
    } else if (peso < 10 || peso > 500) {
      setError(pesoErro, 'Use um valor plausível para o peso.');
      valid = false;
    }

    if (!Number.isFinite(altura)) {
      setError(alturaErro, 'Informe uma altura válida.');
      valid = false;
    } else if (altura <= 0) {
      setError(alturaErro, 'A altura precisa ser maior que zero.');
      valid = false;
    } else if (altura < 50 || altura > 250) {
      setError(alturaErro, 'Use a altura em centímetros, por exemplo: 175.');
      valid = false;
    }

    return { valid, peso, altura };
  };

  const classifyImc = (imc) => {
    for (const faixa of faixaMap) {
      if (imc <= faixa.limite) {
        return faixa;
      }
    }
    return faixaMap[faixaMap.length - 1];
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const { valid, peso, altura } = validateInputs();
    if (!valid) {
      resetResult();
      return;
    }

    const alturaM = altura / 100;
    const imc = peso / (alturaM * alturaM);
    const faixa = classifyImc(imc);

    showResult({
      imc,
      estado: faixa.estado,
      titulo: faixa.titulo,
      badge: faixa.badge,
      descricao: faixa.descricao
    });
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      clearErrors();
      resetResult(true);
      pesoInput.focus();
    }, 0);
  });

  [pesoInput, alturaInput].forEach((input) => {
    input.addEventListener('input', () => {
      if (input === pesoInput) setError(pesoErro, '');
      if (input === alturaInput) setError(alturaErro, '');
    });
  });

  limparBtn?.addEventListener('click', () => {
    form.reset();
  });

  resetResult(true);
});

document.addEventListener('DOMContentLoaded', () => {
  const horasInput = document.getElementById('horasAtividade');
  const recomendacao = document.getElementById('recomendacaoAtividade');
  const cards = document.querySelectorAll('.routine-card');

  if (!horasInput || !recomendacao) return;

  function limparDestaque() {
    cards.forEach((card) => {
      card.style.border = '';
      card.style.boxShadow = '';
      card.style.transform = '';
    });
  }

  function destacarCard(nivel) {
    limparDestaque();

    const card = document.querySelector(`[data-nivel="${nivel}"]`);

    if (card) {
      card.style.border = '2px solid var(--verde-500)';
      card.style.boxShadow = '0 8px 24px rgba(74, 125, 35, 0.18)';
      card.style.transform = 'translateY(-4px)';
    }
  }

  horasInput.addEventListener('input', () => {
    const horas = Number(horasInput.value);

    if (horasInput.value === '') {
      recomendacao.textContent =
        'Digite uma quantidade de horas para receber uma sugestão de rotina.';

      limparDestaque();
      return;
    }

    if (horas < 0 || horas > 40) {
      recomendacao.textContent =
        'Informe uma quantidade de horas válida.';

      limparDestaque();
      return;
    }

    if (horas <= 2) {
      recomendacao.textContent =
        'Pelo seu tempo de atividade, a rotina iniciante pode ser uma boa opção para começar.';

      destacarCard('iniciante');
    }

    else if (horas <= 5) {
      recomendacao.textContent =
        'Você já pratica atividade física com alguma frequência. A rotina intermediária pode ser uma boa opção.';

      destacarCard('intermediario');
    }

    else {
      recomendacao.textContent =
        'Você já dedica bastante tempo à atividade física. A rotina avançada pode servir como referência, respeitando seu condicionamento e descanso.';

      destacarCard('avancado');
    }
  });
});