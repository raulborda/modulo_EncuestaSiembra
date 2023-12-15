//Cambia formato de numeros con miles a puntos Ej: 1000 -> 1.000
export default function milesFormat(number) {
    return Number(number)?.toLocaleString('de-DE');
}
