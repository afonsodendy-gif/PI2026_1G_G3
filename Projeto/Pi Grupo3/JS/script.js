document.getElementById('imcForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o recarregamento da página

            // Pegando os valores dos inputs
            const peso = parseFloat(document.getElementById('peso').value);
            const alturaCm = parseFloat(document.getElementById('altura').value);

            // Validando se os valores são números válidos
            if (!peso || !alturaCm || peso <= 0 || alturaCm <= 0) {
                document.getElementById('valorIMC').textContent = '⚠️ Digite valores válidos!';
                document.getElementById('classIMC').textContent = '';
                return;
            }

            // Convertendo altura de cm para metros
            const alturaM = alturaCm / 100;

            // Calculando IMC
            const imc = peso / (alturaM * alturaM);
            const imcArredondado = imc.toFixed(2);

            // Determinando a classificação
            let classificacao = '';
            if (imc < 18.5) {
                classificacao = 'Abaixo do peso';
            } else if (imc >= 18.5 && imc <= 24.9) {
                classificacao = 'Peso normal';
            } else if (imc >= 25 && imc <= 29.9) {
                classificacao = 'Sobrepeso';
            } else if (imc >= 30 && imc <= 34.9) {
                classificacao = 'Obesidade Grau 1';
            } else if (imc >= 35 && imc <= 39.9) {
                classificacao = 'Obesidade Grau 2';
            } else {
                classificacao = 'Obesidade Grau 3';
            }

            // Exibindo o resultado
            document.getElementById('valorIMC').textContent = `${imcArredondado} kg/m²`;
            document.getElementById('classIMC').textContent = `Classificação: ${classificacao}`;
        });