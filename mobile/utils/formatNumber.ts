export default function formatNumber(numero: number): string {
    const abreviacoes = ['', 'M', 'B', 'T']; // Adicione mais abreviações conforme necessário
    var numeroAbs = Math.abs(numero);
  
    let i = 0;
    while (numeroAbs >= 1000000 && i < abreviacoes.length - 1) {
      numeroAbs /= 1000000;
      i++;
    }
  
    const numeroFormatado = numeroAbs.toFixed(2);
    return `${numeroFormatado}${abreviacoes[i]}`;
  }
  